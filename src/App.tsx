import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, ArrowRight } from 'lucide-react';
import bgImage from '../2.png';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';

const Stylesheet = () => (
  <style>{`
    html { scroll-behavior: smooth; }

    @keyframes inkSpread {
      0% { clip-path: circle(0% at 50% 50%); opacity: 0; }
      100% { clip-path: circle(100% at 50% 50%); opacity: 1; }
    }
    .ink-in { animation: inkSpread 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @keyframes mistDrift {
      0%, 100% { transform: translateX(0); opacity: 0.35; }
      50% { transform: translateX(30px); opacity: 0.55; }
    }
    .mist { animation: mistDrift 8s ease-in-out infinite; }

    @keyframes sealAppear {
      0% { transform: scale(0) rotate(-15deg); opacity: 0; }
      60% { transform: scale(1.2) rotate(3deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .seal-in { animation: sealAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    @keyframes fadeUp {
      0% { opacity: 0; transform: translateY(24px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    .char-type {
      display: inline-block;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .section-ink {
      position: relative;
    }
    .section-ink::before {
      content: '';
      position: absolute;
      top: -1px;
      left: 10%;
      right: 10%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(30,30,30,0.1), transparent);
    }

    @media (prefers-reduced-motion: reduce) {
      .mist, .char-type, .seal-in, .fade-up, .ink-in { animation: none; }
    }
  `}</style>
);

function InkParticles() {
  const canvasRef = useRef(null);
  const pRef = useRef([]);
  const rRef = useRef(null);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const COUNT = 30;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    if (pRef.current.length === 0) {
      pRef.current = Array.from({ length: COUNT }, () => ({
        x: Math.random() * c.width, y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        r: 1 + Math.random() * 3, a: 0.02 + Math.random() * 0.04,
      }));
    }
    const p = pRef.current;
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 0; i < COUNT; i++) {
        const a = p[i];
        a.x += a.vx + Math.sin(Date.now() * 0.001 + i) * 0.08;
        a.y += a.vy + Math.cos(Date.now() * 0.0013 + i) * 0.08;
        if (a.x < -20) a.x = c.width + 20;
        if (a.x > c.width + 20) a.x = -20;
        if (a.y < -20) a.y = c.height + 20;
        if (a.y > c.height + 20) a.y = -20;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60,60,60,${a.a})`;
        ctx.fill();
      }
      rRef.current = requestAnimationFrame(loop);
    };
    rRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />;
}

function InkReveal({ image, cursorX, cursorY, velocity }) {
  const canvasRef = useRef(null);
  const [maskUrl, setMaskUrl] = useState('');
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    ctx.clearRect(0, 0, c.width, c.height);
    const t = Date.now() * 0.002;
    const vMag = Math.min(velocity.current, 12);
    const R = 200 + vMag * 1.2;
    ctx.save();
    for (let ring = 0; ring < 5; ring++) {
      const ox = Math.sin(t + ring * 1.7) * vMag * (1 - ring * 0.15);
      const oy = Math.cos(t * 0.7 + ring * 2.3) * vMag * (1 - ring * 0.15);
      const rad = R + ring * 20 + Math.sin(t * 1.3 + ring) * 6;
      const g = ctx.createRadialGradient(cursorX + ox, cursorY + oy, 0, cursorX + ox, cursorY + oy, rad);
      const w = Math.max(0, 1 - ring * 0.18);
      g.addColorStop(0, `rgba(30,30,30,${w * 0.5})`);
      g.addColorStop(0.3, `rgba(30,30,30,${w * 0.4})`);
      g.addColorStop(0.7, `rgba(30,30,30,${w * 0.15})`);
      g.addColorStop(1, `rgba(30,30,30,0)`);
      ctx.beginPath(); ctx.arc(cursorX + ox, cursorY + oy, rad, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
    ctx.restore();
    setMaskUrl(c.toDataURL());
  }, [cursorX, cursorY, velocity]);
  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: `url(${maskUrl})`, WebkitMaskImage: `url(${maskUrl})`,
          maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
          transition: 'mask-image 0.08s, -webkit-mask-image 0.08s',
          filter: 'grayscale(0.6) sepia(0.3) brightness(0.7) contrast(1.1)',
        }} />
    </>
  );
}

function InkButton({ children, className, onClick }) {
  const ref = useRef(null);
  const mr = useRef({ x: 0, y: 0 });
  const sr = useRef({ x: 0, y: 0 });
  const r2 = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const RADIUS = 180, STR = 0.3;
    const hm = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.sqrt(dx * dx + dy * dy);
      mr.current = d < RADIUS ? { x: dx * (1 - d / RADIUS) * STR, y: dy * (1 - d / RADIUS) * STR } : { x: 0, y: 0 };
    };
    const hl = () => { mr.current = { x: 0, y: 0 }; };
    const anim = () => {
      sr.current.x += (mr.current.x - sr.current.x) * 0.12;
      sr.current.y += (mr.current.y - sr.current.y) * 0.12;
      el.style.transform = Math.abs(sr.current.x) > 0.01 || Math.abs(sr.current.y) > 0.01
        ? `translate(${sr.current.x}px, ${sr.current.y}px)` : 'translate(0,0)';
      r2.current = requestAnimationFrame(anim);
    };
    document.addEventListener('mousemove', hm);
    el.addEventListener('mouseleave', hl);
    r2.current = requestAnimationFrame(anim);
    return () => { document.removeEventListener('mousemove', hm); el.removeEventListener('mouseleave', hl); cancelAnimationFrame(r2.current); };
  }, []);
  return <button ref={ref} className={className} onClick={onClick} style={{ willChange: 'transform' }}>{children}</button>;
}

function InkMountains() {
  return (
    <svg className="absolute bottom-0 left-0 w-full h-[45%] z-20 pointer-events-none opacity-25" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#666" stopOpacity="0.35"/><stop offset="100%" stopColor="#999" stopOpacity="0"/></linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#444" stopOpacity="0.25"/><stop offset="100%" stopColor="#888" stopOpacity="0"/></linearGradient>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#222" stopOpacity="0.2"/><stop offset="100%" stopColor="#666" stopOpacity="0"/></linearGradient>
      </defs>
      <g className="mist" style={{ animationDelay: '0s' }}><path d="M0,400 Q180,300 360,380 Q540,280 720,360 Q900,260 1080,340 Q1260,240 1440,320 L1440,600 L0,600 Z" fill="url(#g1)"/></g>
      <g className="mist" style={{ animationDelay: '-3s', animationDuration: '12s' }}><path d="M0,450 Q200,350 400,420 Q600,320 800,400 Q1000,300 1200,380 Q1320,320 1440,380 L1440,600 L0,600 Z" fill="url(#g2)"/></g>
      <g className="mist" style={{ animationDelay: '-6s', animationDuration: '10s' }}><path d="M0,500 Q240,400 480,480 Q720,380 960,460 Q1200,360 1440,440 L1440,600 L0,600 Z" fill="url(#g3)"/></g>
    </svg>
  );
}

function Seal({ text, size = 60, className = '' }) {
  return (
    <div className={`seal-in inline-flex items-center justify-center border-2 border-[#C41E3A] ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.34, color: '#C41E3A', lineHeight: 1.2, textAlign: 'center' }}>
      {text}
    </div>
  );
}

const inkSections = [
  { id: 'funding', num: '01', title: '智啟學教', subtitle: '50萬撥款', short: '榮獲政府50萬港元專項撥款支援。', desc: '榮獲政府「智啟學教」50萬港元專項撥款，用於校園AI算力設備、智能化教室及創新教材開發。', color: '#1a1a1a' },
  { id: 'genai', num: '02', title: '生成式 AI', subtitle: '跨學科應用', short: '跨學科引入生成式AI助手。', desc: '在語文寫作、科學探究及藝術創作中全面引入生成式AI助手。引導學生掌握提問技巧（Prompt Engineering）。', color: '#444' },
  { id: 'vibecoding', num: '03', title: 'Vibe Coding', subtitle: '以自然語言寫程式', short: '零代碼門檻，以自然語言指揮AI寫程式。', desc: '引進前沿Vibe Coding模式。學生無需死記語法，只需以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型。', color: '#2E8B57' },
  { id: 'assistant', num: '04', title: 'AI 輔助學習', subtitle: '24/7 個人化導師', short: '24/7 個性化診斷式學習導師。', desc: '全天候在線課業輔助學習系統，針對每位學生的作答與弱點進行溫和、漸進式拆解引導。', color: '#8B4513' },
];

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [selectedPillar, setSelectedPillar] = useState(null);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [typingStep, setTypingStep] = useState(0);
  const [spotlightCycle, setSpotlightCycle] = useState(0);
  const [gameImg, setGameImg] = useState(0);

  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smooth = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const prevMouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const velocityRef = useRef(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const handleTouchMove = (e) => { if (e.touches.length > 0) mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    const loop = () => {
      const dx = mouse.current.x - prevMouse.current.x, dy = mouse.current.y - prevMouse.current.y;
      velocityRef.current += (Math.sqrt(dx * dx + dy * dy) - velocityRef.current) * 0.1;
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      setVelocity({ x: dx, y: dy });
      prevMouse.current = { ...mouse.current };
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('touchmove', handleTouchMove); window.removeEventListener('touchstart', handleTouchMove); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const typingText = '創新·啟發·未來';
  const typingTotal = typingText.length + 6;
  useEffect(() => { const t = setInterval(() => setTypingStep(s => (s + 1) % typingTotal), 400); return () => clearInterval(t); }, []);

  useEffect(() => {
    if (selectedPillar?.id !== 'funding') { setSpotlightCycle(0); return; }
    const t = setTimeout(() => setSpotlightCycle(1), 300);
    return () => clearTimeout(t);
  }, [selectedPillar]);

  useEffect(() => {
    if (spotlightCycle === 0) { const t = setTimeout(() => setSpotlightCycle(1), 3500); return () => clearTimeout(t); }
    const t = setTimeout(() => setSpotlightCycle(prev => prev >= 8 ? 0 : prev + 1), 2200);
    return () => clearTimeout(t);
  }, [spotlightCycle]);

  const gameImages = [img3, img4, img5, img6];
  useEffect(() => { const t = setInterval(() => setGameImg(prev => (prev + 1) % gameImages.length), 3500); return () => clearInterval(t); }, []);

  const findPillar = (id) => inkSections.find(s => s.id === id);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1a1a1a] relative select-none overflow-x-hidden leading-relaxed tracking-[0.04em]"
      style={{ fontFamily: "'Noto Serif SC', 'PingFang HK', serif" }}>
      <Stylesheet />
      <InkParticles />

      {/* Paper texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px, 60px 60px' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 bg-gradient-to-b from-[#F8F5F0]/90 to-transparent">
        <div className="flex items-center gap-3">
          <Seal text="SWCSSS" size={42} />
          <span className="text-sm sm:text-base text-[#444] tracking-[0.12em]">新會商會中學</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs tracking-[0.1em]">
          <a href="#hero" className="text-[#555] hover:text-[#1a1a1a] transition-colors">首頁</a>
          {inkSections.map(s => (
            <a key={s.id} href={'#' + s.id} className="text-[#555] hover:text-[#1a1a1a] transition-colors">{s.title}</a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative w-full overflow-hidden" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F8F5F0] via-[#F5F0E8] to-[#E8E0D0]" />
        <InkMountains />
        <div className="absolute inset-0 z-20 bg-center bg-cover bg-no-repeat opacity-15 mix-blend-multiply"
          style={{ backgroundImage: `url(${bgImage})`, filter: 'grayscale(1) contrast(0.8) brightness(1.4)' }} />
        <InkReveal image={bgImage} cursorX={cursorPos.x} cursorY={cursorPos.y} velocity={velocityRef} />

        {/* Title */}
        <div className="absolute top-[20%] sm:top-[25%] left-0 right-0 flex flex-col items-center text-center px-4 pointer-events-none z-50">
          <Seal text="AI" size={32} className="mb-3" />
          <h1 className="text-[#1a1a1a]">
            <span className="block text-[2.8rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem] leading-none tracking-[0.08em]"
              style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 700 }}>
              {typingText.split('').map((ch, i) => (
                <span key={i} className="char-type" style={{
                  opacity: i < typingStep ? 1 : 0,
                  transform: i < typingStep ? 'scale(1)' : 'scale(0.1)',
                }}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#666] tracking-[0.15em]">
            新會商會中學 · 人工智慧教育藍圖
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 text-[9px] sm:text-[10px] text-[#999] tracking-[0.2em] animate-pulse">
          ↓ 向下探索
        </div>
      </section>

      {/* 4 Scrollable Sections */}
      {inkSections.map((section, i) => (
        <section key={section.id} id={section.id}
          className="section-ink min-h-[70vh] sm:min-h-[60vh] flex items-center py-16 sm:py-24 px-5 sm:px-12">
          <div className="max-w-4xl mx-auto w-full fade-up">
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 items-start">
              {/* Left: Number seal */}
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center border-2 border-[#C41E3A]"
                  style={{ width: 56, height: 56, fontSize: 18, color: '#C41E3A' }}>
                  {section.num}
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl md:text-3xl text-[#1a1a1a] mb-2 sm:mb-3 tracking-[0.08em]" style={{ fontWeight: 700 }}>
                  {section.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#666] mb-1 max-w-xl tracking-[0.06em]">{section.subtitle}</p>
                <p className="text-xs sm:text-sm text-[#444] leading-relaxed mb-5 sm:mb-6 max-w-xl">{section.short}</p>
                <button onClick={() => setSelectedPillar(section)}
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-[#555] hover:text-[#1a1a1a] transition-colors border-b border-[#ccc] hover:border-[#333] pb-0.5">
                  <span>了解更多</span>
                  <ArrowRight size={10} />
                </button>

                {/* Decorative line */}
                <div className="mt-6 sm:mt-8 w-12 h-[1px] bg-[#ccc]" />
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* General Modal */}
      {selectedPillar && selectedPillar.id !== 'funding' && selectedPillar.id !== 'assistant' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#F8F5F0] max-w-lg w-full p-5 sm:p-8 relative shadow-2xl mx-3 sm:mx-0 ink-in"
            style={{ border: '1px solid rgba(30,30,30,0.1)' }}>
            <div className="absolute top-0 left-0 w-16 h-16 opacity-[0.06]">
              <svg viewBox="0 0 64 64" fill="#333"><path d="M0,0 Q16,8 24,24 Q32,40 48,48 Q56,52 64,56 L64,0 Z"/></svg>
            </div>
            <button onClick={() => setSelectedPillar(null)}
              className="absolute top-3 right-3 text-[#999] hover:text-[#333] p-1 transition-colors"><X size={18} /></button>
            <div className="mb-4 sm:mb-5 pb-3 sm:pb-4" style={{ borderBottom: '1px solid rgba(30,30,30,0.08)' }}>
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center justify-center border-2 border-[#C41E3A]"
                  style={{ width: 42, height: 42, fontSize: 14, color: '#C41E3A' }}>
                  {findPillar(selectedPillar.id)?.num}
                </div>
                <div>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.15em] text-[#888]">新會商會中學 · 人工智慧</span>
                  <h3 className="text-sm sm:text-lg text-[#1a1a1a]" style={{ fontWeight: 700 }}>{selectedPillar.title}</h3>
                </div>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-[#444] leading-relaxed">{selectedPillar.desc}</p>
              {selectedPillar.id === 'vibecoding' && (
                <div className="p-3 sm:p-4 text-[10px] sm:text-xs"
                  style={{ background: 'rgba(46,139,87,0.05)', border: '1px solid rgba(46,139,87,0.15)' }}>
                  <div className="flex justify-between items-center text-[9px] sm:text-[10px] text-[#666] mb-2 pb-1"
                    style={{ borderBottom: '1px solid rgba(46,139,87,0.1)' }}>
                    <span>Vibe Code</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B57] animate-pulse" />
                  </div>
                  <div className="text-[#555]"># 「建立一個校園圖書管理系統」</div>
                  <div className="text-[#888] mt-1">&gt; 正在生成應用程式…</div>
                  <div className="text-[#888]">&gt; 學生成功在課堂內完成開發。</div>
                </div>
              )}
            </div>
            <div className="flex gap-2 sm:gap-3 justify-end mt-5 sm:mt-7 pt-3 sm:pt-4" style={{ borderTop: '1px solid rgba(30,30,30,0.08)' }}>
              <button onClick={() => setSelectedPillar(null)}
                className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs text-[#666] hover:text-[#333] transition-colors">關閉</button>
              <InkButton onClick={() => {
                const ci = inkSections.findIndex(p => p.id === selectedPillar.id);
                setSelectedPillar(inkSections[(ci + 1) % inkSections.length]);
              }}
                className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs text-white bg-[#333] hover:bg-[#1a1a1a] transition-colors">下一項</InkButton>
            </div>
          </div>
        </div>
      )}

      {/* Funding Modal */}
      {selectedPillar?.id === 'funding' && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-3 sm:p-8 pt-14 sm:pt-16 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[#F8F5F0] max-w-3xl w-full p-4 sm:p-10 shadow-2xl my-4 ink-in"
            style={{ border: '1px solid rgba(30,30,30,0.12)' }}>
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-20 bg-[#333]" />
            <button onClick={() => setSelectedPillar(null)}
              className="absolute top-3 right-3 text-[#999] hover:text-[#333] p-2 transition-colors z-10"><X size={18} /></button>
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-8 pb-4 sm:pb-6" style={{ borderBottom: '1px solid rgba(30,30,30,0.08)' }}>
              <div className="inline-flex items-center justify-center border-2 border-[#C41E3A]"
                style={{ width: 48, height: 48, fontSize: 16, color: '#C41E3A' }}>撥款</div>
              <div>
                <span className="text-[8px] sm:text-[10px] tracking-[0.15em] text-[#888]">新會商會中學 · 人工智慧</span>
                <h3 className="text-base sm:text-2xl text-[#1a1a1a]" style={{ fontWeight: 700 }}>智啟學教 50萬撥款 — 執行藍圖</h3>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full relative">
                {[
                  { title: '🛠 採購與工具', items: [
                    { num: 1, label: '軟件/平台', sub: '訂閱生成式 AI（教育版）及 Canva Pro', pct: '40-50%' },
                    { num: 2, label: '硬件', sub: 'micro:bit V2 + AI 鏡頭 / Pi AI', pct: '20-30%' },
                    { num: 3, label: '外間方案', sub: '教師 AI 工作坊 2-3 場', pct: '20%' },
                  ]},
                  { title: '📚 學科推行', items: [
                    { num: 4, label: '語文科 · 中一至中二', sub: 'AI 寫作構思 + AI 會話夥伴' },
                    { num: 5, label: '科學/ICT · 中二至中三', sub: 'Teachable Machine + micro:bit' },
                    { num: 6, label: '視藝/地理 · 中一及中三', sub: 'AI 繪圖倫理 + 氣候模擬' },
                  ]},
                  { title: '🎯 學生活動', items: [
                    { num: 7, label: 'AI Prompt 創意大賽', sub: '全校「Prompt Master」爭霸戰' },
                    { num: 8, label: 'AI 智能產品設計日', sub: 'AI Boot Camp · 社區問題解決' },
                  ]},
                ].map((col, ci) => (
                  <div key={ci} className="flex-1 flex flex-col items-center">
                    <div className="text-xs sm:text-sm text-[#333] mb-3 tracking-[0.1em] pb-1" style={{ borderBottom: '1px solid rgba(30,30,30,0.15)' }}>{col.title}</div>
                    <div className="w-full space-y-2 relative pl-3 sm:pl-4" style={{ borderLeft: '2px solid rgba(30,30,30,0.1)' }}>
                      {col.items.map((item) => (
                        <div key={item.num} className="relative pl-3 sm:pl-4" style={{ borderLeft: 'none' }}>
                          <div className={`p-2 sm:p-3 transition-all duration-700`}
                            style={{
                              background: spotlightCycle === item.num ? 'rgba(30,30,30,0.06)' : 'transparent',
                              border: '1px solid ' + (spotlightCycle === item.num ? 'rgba(30,30,30,0.2)' : 'rgba(30,30,30,0.06)'),
                            }}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] sm:text-xs text-[#333]" style={{ fontWeight: 700 }}>{item.label}</span>
                              {item.pct && <span className="text-[8px] sm:text-[9px] text-[#888]">{item.pct}</span>}
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-[#666]">{item.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 justify-end mt-6 sm:mt-10 pt-4 sm:pt-6" style={{ borderTop: '1px solid rgba(30,30,30,0.08)' }}>
              <button onClick={() => setSelectedPillar(null)}
                className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs text-[#666] hover:text-[#333] transition-colors">關閉</button>
              <InkButton onClick={() => {
                const ci = inkSections.findIndex(p => p.id === selectedPillar.id);
                setSelectedPillar(inkSections[(ci + 1) % inkSections.length]);
              }}
                className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs text-white bg-[#333] hover:bg-[#1a1a1a] transition-colors">下一項</InkButton>
            </div>
          </div>
        </div>
      )}

      {/* Assistant Modal */}
      {selectedPillar?.id === 'assistant' && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-3 sm:p-8 pt-14 sm:pt-16 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="relative bg-[#F8F5F0] max-w-3xl w-full p-4 sm:p-10 shadow-2xl my-4 ink-in"
            style={{ border: '1px solid rgba(30,30,30,0.12)' }}>
            <div className="absolute top-0 left-[10%] right-[10%] h-[1px] opacity-20 bg-[#333]" />
            <button onClick={() => setSelectedPillar(null)}
              className="absolute top-3 right-3 text-[#999] hover:text-[#333] p-2 transition-colors z-10"><X size={18} /></button>
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-3 sm:pb-5" style={{ borderBottom: '1px solid rgba(30,30,30,0.08)' }}>
              <div className="inline-flex items-center justify-center border-2 border-[#C41E3A]"
                style={{ width: 48, height: 48, fontSize: 16, color: '#C41E3A' }}>輔助</div>
              <div>
                <span className="text-[8px] sm:text-[10px] tracking-[0.15em] text-[#888]">新會商會中學 · 人工智慧</span>
                <h3 className="text-base sm:text-2xl text-[#1a1a1a]" style={{ fontWeight: 700 }}>BAFS 商業大亨 — AI 輔助學習工具</h3>
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-[#666] leading-relaxed mb-4 sm:mb-6">
              「BAFS 商業大亨」是一款結合了香港中學文憑試「企會財 (BAFS)」學科知識與大富翁玩法的教育型桌遊。
            </p>
            <div className="relative w-full mb-4 sm:mb-6" style={{ border: '1px solid rgba(30,30,30,0.06)' }}>
              <img src={gameImages[gameImg]} alt="BAFS 商業大亨"
                className="w-full h-auto max-h-[50vh] sm:max-h-[55vh] object-contain mx-auto transition-opacity duration-500" />
              <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
                {gameImages.map((_, i) => (
                  <span key={i} className={`rounded-full transition-all ${i === gameImg ? 'bg-[#333] w-3 sm:w-4' : 'bg-[#ccc]'} w-1.5 h-1.5 sm:w-2 sm:h-2`} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 mb-4 sm:mb-6">
              {[
                { icon: '🏢', label: '企業收購', sub: '一般地產' }, { icon: '🎲', label: '機遇與風險', sub: '機會/命運' },
                { icon: '📊', label: '法規改變', sub: '總體經濟' }, { icon: '⚖️', label: '稅務與懲罰' },
                { icon: '🤝', label: '收購中心' }, { icon: '📈', label: '證券交易' }, { icon: '🏦', label: '銀行中心' },
                { icon: '🔨', label: '打工' },
              ].map((item, i) => (
                <div key={i} className="p-1.5 sm:p-3 text-center cursor-default"
                  style={{ border: '1px solid rgba(30,30,30,0.08)', background: 'rgba(30,30,30,0.02)' }}>
                  <div className="text-sm sm:text-lg mb-0.5">{item.icon}</div>
                  <div className="text-[8px] sm:text-[11px] text-[#333]">{item.label}</div>
                  {item.sub && <div className="text-[6px] sm:text-[9px] text-[#888] mt-0.5">{item.sub}</div>}
                </div>
              ))}
            </div>
            <div className="flex gap-2 sm:gap-3 justify-end pt-3 sm:pt-5" style={{ borderTop: '1px solid rgba(30,30,30,0.08)' }}>
              <button onClick={() => setSelectedPillar(null)}
                className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs text-[#666] hover:text-[#333] transition-colors">關閉</button>
              <InkButton onClick={() => {
                const ci = inkSections.findIndex(p => p.id === selectedPillar.id);
                setSelectedPillar(inkSections[(ci + 1) % inkSections.length]);
              }}
                className="px-4 sm:px-5 py-2 text-[10px] sm:text-xs text-white bg-[#333] hover:bg-[#1a1a1a] transition-colors">下一項</InkButton>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#F0EBE0] py-12 sm:py-16 px-5" style={{ borderTop: '1px solid rgba(30,30,30,0.06)' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center border-2 border-[#C41E3A] mx-auto mb-4"
            style={{ width: 40, height: 40, fontSize: 13, color: '#C41E3A' }}>SWCSSS</div>
          <div className="text-[10px] sm:text-xs text-[#888] tracking-[0.15em]">
            <span className="text-sm text-[#555]" style={{ fontWeight: 700 }}>新會商會中學</span>
            <span className="mx-2">·</span>
            <span>人工智慧教育計劃</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
