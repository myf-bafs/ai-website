import React, { useState, useEffect, useRef } from 'react';
import bgImage from '../2.png';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';

/* ─── Scroll animation ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

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
      60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .seal-in { animation: sealAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

    @keyframes fadeUp {
      0% { opacity: 0; transform: translateY(40px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @keyframes charReveal {
      0% { opacity: 0; transform: scale(0.1); }
      100% { opacity: 1; transform: scale(1); }
    }
    .char-type {
      display: inline-block;
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    @keyframes inkLine {
      0% { width: 0; }
      100% { width: 100%; }
    }
    .ink-line { animation: inkLine 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    @media (prefers-reduced-motion: reduce) {
      .mist, .char-type, .seal-in, .fade-up, .ink-in, .ink-line { animation: none !important; }
    }
  `}</style>
);

/* ─── Particles ─── */
function InkParticles() {
  const ref = useRef(null);
  const pRef = useRef([]);
  const rRef = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const COUNT = 25;
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    if (!pRef.current.length) {
      pRef.current = Array.from({ length: COUNT }, () => ({
        x: Math.random() * c.width, y: Math.random() * c.height,
        vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.5) * 0.2,
        r: 1 + Math.random() * 3, a: 0.015 + Math.random() * 0.035,
      }));
    }
    const p = pRef.current;
    const loop = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      for (let i = 0; i < COUNT; i++) {
        const a = p[i];
        a.x += a.vx + Math.sin(Date.now() * 0.001 + i) * 0.06;
        a.y += a.vy + Math.cos(Date.now() * 0.0013 + i) * 0.06;
        if (a.x < -20) a.x = c.width + 20;
        if (a.x > c.width + 20) a.x = -20;
        if (a.y < -20) a.y = c.height + 20;
        if (a.y > c.height + 20) a.y = -20;
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(60,60,60,${a.a})`; ctx.fill();
      }
      rRef.current = requestAnimationFrame(loop);
    };
    rRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rRef.current); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" />;
}

/* ─── Ink Reveal ─── */
function InkReveal({ image, cx, cy, vel }) {
  const ref = useRef(null);
  const [mask, setMask] = useState('');
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight; };
    window.addEventListener('resize', resize); resize();
    return () => window.removeEventListener('resize', resize);
  }, []);
  useEffect(() => {
    const c = ref.current; if (!c || !c.getContext) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    const t = Date.now() * 0.002;
    const vm = Math.min(vel.current, 12);
    const R = 200 + vm * 1.2;
    ctx.save();
    for (let ring = 0; ring < 5; ring++) {
      const ox = Math.sin(t + ring * 1.7) * vm * (1 - ring * 0.15);
      const oy = Math.cos(t * 0.7 + ring * 2.3) * vm * (1 - ring * 0.15);
      const rad = R + ring * 20 + Math.sin(t * 1.3 + ring) * 6;
      const g = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, rad);
      const w = Math.max(0, 1 - ring * 0.18);
      g.addColorStop(0, `rgba(30,30,30,${w * 0.5})`);
      g.addColorStop(0.3, `rgba(30,30,30,${w * 0.4})`);
      g.addColorStop(0.7, `rgba(30,30,30,${w * 0.15})`);
      g.addColorStop(1, `rgba(30,30,30,0)`);
      ctx.beginPath(); ctx.arc(cx + ox, cy + oy, rad, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();
    }
    ctx.restore();
    setMask(c.toDataURL());
  }, [cx, cy, vel]);
  return (
    <>
      <canvas ref={ref} style={{ display: 'none' }} />
      <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: `url(${mask})`, WebkitMaskImage: `url(${mask})`,
          maskSize: '100% 100%', WebkitMaskSize: '100% 100%',
          transition: 'mask-image 0.08s',
          filter: 'grayscale(0.6) sepia(0.3) brightness(0.7) contrast(1.1)',
        }} />
    </>
  );
}

/* ─── Mountains ─── */
function InkMountains() {
  return (
    <svg className="absolute bottom-0 left-0 w-full h-[40%] z-20 pointer-events-none opacity-20" viewBox="0 0 1440 500" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#555" stopOpacity="0.3"/><stop offset="100%" stopColor="#999" stopOpacity="0"/></linearGradient>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#333" stopOpacity="0.2"/><stop offset="100%" stopColor="#888" stopOpacity="0"/></linearGradient>
      </defs>
      <g className="mist"><path d="M0,350 Q180,250 360,330 Q540,230 720,310 Q900,210 1080,290 Q1260,200 1440,280 L1440,500 L0,500 Z" fill="url(#g1)"/></g>
      <g className="mist" style={{ animationDelay: '-4s', animationDuration: '12s' }}><path d="M0,400 Q200,300 400,370 Q600,270 800,350 Q1000,250 1200,330 Q1320,280 1440,340 L1440,500 L0,500 Z" fill="url(#g2)"/></g>
    </svg>
  );
}

/* ─── Seal ─── */
function Seal({ text, size = 52, className = '' }) {
  return (
    <div className={`seal-in inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.32, border: '2px solid #C41E3A', color: '#C41E3A', lineHeight: 1.2, fontFamily: "'Noto Serif SC', 'PingFang HK', serif" }}>
      {text}
    </div>
  );
}

/* ─── Section divider ─── */
function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="w-16 h-px bg-[#333]/10 mx-auto" />
    </div>
  );
}

/* ─── Scroll section ─── */
function ScrollSection({ children, className = '' }) {
  const [ref, inView] = useInView(0.1);
  return (
    <section ref={ref} className={className}
      style={{ opacity: 0, transform: 'translateY(35px)', transition: 'opacity 0.7s ease, transform 0.7s ease', ...(inView ? { opacity: 1, transform: 'translateY(0)' } : {}) }}>
      {children}
    </section>
  );
}

/* ─── Data ─── */
const sectionBgs = ['bg-[#F8F5F0]', 'bg-[#F1F0EA]', 'bg-[#EEF0EC]', 'bg-[#F0EDE8]'];

const sections = [
  {
    id: 'funding', num: '01', title: '智啟學教', subtitle: '五十萬撥款',
    desc: '榮獲政府「智啟學教」50萬港元專項撥款，用於校園AI算力設備、智能化教室及創新教材開發。',
    seal: '撥款',
    columns: [
      { title: '採購與工具', items: [
        { label: '軟件 / 平台', sub: 'AI教育版 · Canva Pro', pct: '40-50%' },
        { label: '硬件', sub: 'micro:bit · Pi AI 套件', pct: '20-30%' },
        { label: '外間方案', sub: '教師 AI 工作坊', pct: '20%' },
      ]},
      { title: '學科推行', items: [
        { label: '語文科', sub: 'AI寫作構思 + AI會話' },
        { label: '科學 / ICT', sub: 'Teachable Machine' },
        { label: '視藝 / 地理', sub: 'AI繪圖 · 氣候模擬' },
      ]},
      { title: '學生活動', items: [
        { label: 'Prompt 創意大賽', sub: '全校爭霸戰' },
        { label: 'AI 產品設計日', sub: 'Boot Camp' },
      ]},
    ],
  },
  {
    id: 'genai', num: '02', title: '生成式 AI', subtitle: '跨學科應用',
    desc: '在語文寫作、科學探究及藝術創作中全面引入生成式AI助手，引導學生掌握提問技巧，學會與AI協同解決現實問題。',
    seal: 'AI',
    subjects: [
      { icon: '✍️', label: '語文寫作', items: ['AI 寫作構思', 'AI 會話夥伴', '文章潤飾'] },
      { icon: '🔬', label: '科學探究', items: ['Teachable Machine', '數據分析', '實驗模擬'] },
      { icon: '🎨', label: '藝術創作', items: ['AI 繪圖倫理', '風格轉換', '多媒體設計'] },
    ],
  },
  {
    id: 'vibecoding', num: '03', title: 'Vibe Coding', subtitle: '以自然語言寫程式',
    desc: '引進前沿Vibe Coding模式，學生無需死記語法，以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型。',
    seal: 'VC',
  },
  {
    id: 'assistant', num: '04', title: 'AI 輔助學習', subtitle: '全天候個性化導師',
    desc: '全天候在線課業輔助學習系統，針對每位學生的作答與弱點進行溫和、漸進式拆解引導，提供真正因材施教的一對一教學輔導。',
    seal: '輔助',
  },
];

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [typingStep, setTypingStep] = useState(0);
  const [gameImg, setGameImg] = useState(0);

  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const prev = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smooth = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const vel = useRef(0);
  const rId = useRef(null);

  useEffect(() => {
    const mm = (e) => { mouse.current = { x: e.clientX, y: e.clientY }; };
    const tm = (e) => { if (e.touches.length) mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    window.addEventListener('mousemove', mm);
    window.addEventListener('touchmove', tm, { passive: true });
    window.addEventListener('touchstart', tm, { passive: true });
    const loop = () => {
      const dx = mouse.current.x - prev.current.x, dy = mouse.current.y - prev.current.y;
      vel.current += (Math.sqrt(dx * dx + dy * dy) - vel.current) * 0.1;
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      prev.current = { ...mouse.current };
      rId.current = requestAnimationFrame(loop);
    };
    rId.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener('mousemove', mm); window.removeEventListener('touchmove', tm); window.removeEventListener('touchstart', tm); cancelAnimationFrame(rId.current); };
  }, []);

  const typingText = '創新·啟發·未來';
  const total = typingText.length + 6;
  useEffect(() => { const t = setInterval(() => setTypingStep(s => (s + 1) % total), 400); return () => clearInterval(t); }, []);

  const gameImages = [img3, img4, img5, img6];
  useEffect(() => { const t = setInterval(() => setGameImg(p => (p + 1) % gameImages.length), 3500); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1a1a1a] relative overflow-x-hidden"
      style={{ fontFamily: "'Noto Serif SC', 'PingFang HK', serif", letterSpacing: '0.04em', fontWeight: 300 }}>
      <Stylesheet />
      <InkParticles />

      {/* Paper texture */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0,0,0,0.03) 1px, transparent 1px), radial-gradient(circle at 80% 20%, rgba(0,0,0,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px, 60px 60px' }} />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-4 sm:px-10 py-3 bg-gradient-to-b from-[#F8F5F0]/95 to-transparent">
        <div className="flex items-center gap-3">
          <Seal text="SWS" size={36} />
          <span className="text-[11px] text-[#666]">新會商會中學</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs tracking-[0.15em] text-[#888]">
          <a href="#hero" className="hover:text-[#333] transition-colors">首頁</a>
          {sections.map(s => (
            <a key={s.id} href={'#' + s.id} className="hover:text-[#333] transition-colors">{s.num}</a>
          ))}
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" className="relative w-full overflow-hidden" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#F8F5F0] via-[#F5F0E8] to-[#E8E0D0]" />
        <InkMountains />
        <div className="absolute inset-0 z-20 bg-center bg-cover bg-no-repeat opacity-[0.12] mix-blend-multiply"
          style={{ backgroundImage: `url(${bgImage})`, filter: 'grayscale(1) contrast(0.8) brightness(1.4)' }} />
        <InkReveal image={bgImage} cx={cursorPos.x} cy={cursorPos.y} vel={vel} />

        <div className="absolute top-[22%] sm:top-[26%] left-0 right-0 flex flex-col items-center text-center px-4 pointer-events-none z-50">
          <Seal text="AI" size={26} className="mb-3" />
          <h1 className="text-[#1a1a1a]">
            <span className="block text-[2.8rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-none" style={{ fontWeight: 300 }}>
              {typingText.split('').map((ch, i) => (
                <span key={i} className="char-type" style={{
                  opacity: i < typingStep ? 1 : 0, transform: i < typingStep ? 'scale(1)' : 'scale(0.1)',
                }}>{ch}</span>
              ))}
            </span>
          </h1>
          <div className="mt-3 text-xs sm:text-sm text-[#888] tracking-[0.2em]">
            新會商會中學 · 人工智慧教育藍圖
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 text-[10px] text-[#aaa] tracking-[0.3em] animate-pulse">
          ↓ 向下探索
        </div>
      </section>

      {/* ════════ SECTION 01：智啟學教 ════════ */}
      <ScrollSection id="funding" className={`py-24 sm:py-32 px-5 sm:px-12 ${sectionBgs[0]}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 items-start mb-12">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="text-xs text-[#bbb] tracking-[0.3em]">0 1</span>
              <Seal text={sections[0].seal} size={46} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] leading-relaxed" style={{ fontWeight: 300 }}>
                {sections[0].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#666] max-w-2xl leading-[2] mt-4">
                {sections[0].desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#333]/10"
            style={{ outline: '1px solid rgba(30,30,30,0.06)' }}>
            {sections[0].columns.map((col, ci) => (
              <div key={ci} className="p-5 sm:p-6 bg-[#F8F5F0]">
                <div className="text-sm sm:text-base text-[#333] mb-5" style={{ fontWeight: 400 }}>{col.title}</div>
                <div className="space-y-3">
                  {col.items.map((item, ii) => (
                    <div key={ii} className="p-3 sm:p-4 bg-[#F5F2EC]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs sm:text-sm text-[#444]">{item.label}</span>
                        {item.pct && <span className="text-[9px] text-[#999]">{item.pct}</span>}
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#888]">{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollSection>

      {/* ════════ SECTION 02：生成式 AI ════════ */}
      <ScrollSection id="genai" className={`py-24 sm:py-32 px-5 sm:px-12 ${sectionBgs[1]}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 items-start mb-12">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="text-xs text-[#bbb] tracking-[0.3em]">0 2</span>
              <Seal text={sections[1].seal} size={46} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] leading-relaxed" style={{ fontWeight: 300 }}>
                {sections[1].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#666] max-w-2xl leading-[2] mt-4">
                {sections[1].desc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-[#333]/10"
            style={{ outline: '1px solid rgba(30,30,30,0.06)' }}>
            {sections[1].subjects.map((subj, i) => (
              <div key={i} className="p-5 sm:p-6 bg-[#F8F5F0]">
                <div className="text-lg sm:text-xl mb-2">{subj.icon}</div>
                <div className="text-sm sm:text-base text-[#333] mb-4" style={{ fontWeight: 400 }}>{subj.label}</div>
                <ul className="space-y-2">
                  {subj.items.map((item, j) => (
                    <li key={j} className="text-[10px] sm:text-xs text-[#888] flex items-center gap-2">
                      <span className="w-0.5 h-0.5 bg-[#888] shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10" style={{ outline: '1px solid rgba(30,30,30,0.06)' }}>
            <a href="https://ai-photo-lyart.vercel.app/" target="_blank" rel="noopener noreferrer"
              className="block bg-[#F8F5F0] group">
              <img src="/ai-photo-screenshot.png" alt="AI 圖片生成示範"
                className="w-full h-auto transition-opacity duration-500 group-hover:opacity-80" />
              <div className="py-3 text-center text-[10px] text-[#999] tracking-[0.15em]">
                點擊開啟 AI 圖片生成器 →
              </div>
            </a>
          </div>
        </div>
      </ScrollSection>

      {/* ════════ SECTION 03：Vibe Coding ════════ */}
      <ScrollSection id="vibecoding" className={`py-24 sm:py-32 px-5 sm:px-12 ${sectionBgs[2]}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 items-start mb-12">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="text-xs text-[#bbb] tracking-[0.3em]">0 3</span>
              <Seal text={sections[2].seal} size={46} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] leading-relaxed" style={{ fontWeight: 300 }}>
                {sections[2].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#666] max-w-2xl leading-[2] mt-4">
                {sections[2].desc}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-stretch"
            style={{ outline: '1px solid rgba(46,139,87,0.12)' }}>
            <div className="flex-1 p-5 sm:p-6 bg-[#F8F5F0] space-y-4 text-xs sm:text-sm text-[#666] leading-[2]">
              <p>學生無需死記語法，只需以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型。</p>
              <p>專注力從語法解放至邏輯思維，真正實現「想法即程式」的教學理念。</p>
            </div>
            <div className="flex-1 p-5 sm:p-6 bg-[#2E8B57]/[0.03] text-[11px] sm:text-xs leading-relaxed"
              style={{ borderLeft: '1px solid rgba(46,139,87,0.12)' }}>
              <div className="flex items-center gap-2 text-[#2E8B57] mb-4 pb-3"
                style={{ borderBottom: '1px solid rgba(46,139,87,0.12)' }}>
                <span className="w-2 h-2 rounded-full bg-[#2E8B57] animate-pulse" />
                <span>Vibe Code</span>
              </div>
              <div className="text-[#666] leading-[2]"># 「建立一個校園圖書管理系統」</div>
              <div className="text-[#aaa] leading-[2]">&gt; 正在生成應用程式…</div>
              <div className="text-[#aaa] leading-[2]">&gt; 學生成功在課堂內完成開發。</div>
              <div className="text-[#2E8B57] mt-2 leading-[2]">&gt; ✓ 部署完成</div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* ════════ SECTION 04：AI 輔助學習 ════════ */}
      <ScrollSection id="assistant" className={`py-24 sm:py-32 px-5 sm:px-12 ${sectionBgs[3]}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 items-start mb-12">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <span className="text-xs text-[#bbb] tracking-[0.3em]">0 4</span>
              <Seal text={sections[3].seal} size={46} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-[#1a1a1a] leading-relaxed" style={{ fontWeight: 300 }}>
                {sections[3].title}
              </h2>
              <p className="text-xs sm:text-sm text-[#666] max-w-2xl leading-[2] mt-4">
                {sections[3].desc}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start"
            style={{ outline: '1px solid rgba(30,30,30,0.06)' }}>
            <div className="flex-1 p-5 sm:p-6 bg-[#F8F5F0]">
              <div className="text-sm sm:text-base text-[#333] mb-4" style={{ fontWeight: 400 }}>
                BAFS 商業大亨 — AI 輔助學習工具
              </div>
              <p className="text-xs sm:text-sm text-[#666] leading-[2] mb-5">
                「BAFS 商業大亨」是一款結合了香港中學文憑試「企會財 (BAFS)」學科知識與大富翁玩法的教育型桌遊，由校內師生共同設計。
              </p>
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[
                  { icon: '🏢', label: '企業收購' }, { icon: '🎲', label: '機遇風險' },
                  { icon: '📊', label: '法規改變' }, { icon: '⚖️', label: '稅務懲罰' },
                  { icon: '🤝', label: '收購中心' }, { icon: '📈', label: '證券交易' },
                  { icon: '🏦', label: '銀行中心' }, { icon: '🔨', label: '打工' },
                ].map((item, i) => (
                  <div key={i} className="p-2 sm:p-3 text-center bg-[#F5F2EC]">
                    <div className="text-sm sm:text-base mb-0.5">{item.icon}</div>
                    <div className="text-[8px] sm:text-[10px] text-[#666]">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 bg-[#F5F2EC]">
              <img src={gameImages[gameImg]} alt="BAFS 商業大亨"
                className="w-full h-auto max-h-[45vh] object-contain mx-auto transition-opacity duration-500" />
              <div className="flex justify-center gap-2 py-3 bg-[#F5F2EC]">
                {gameImages.map((_, i) => (
                  <span key={i}
                    className={`rounded-full transition-all cursor-pointer ${i === gameImg ? 'bg-[#333] w-4 h-1.5' : 'bg-[#ccc] w-1.5 h-1.5'}`}
                    onClick={() => setGameImg(i)} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollSection>

      {/* Footer */}
      <footer className="py-16 sm:py-20 px-5 text-center"
        style={{ borderTop: '1px solid rgba(30,30,30,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <Seal text="SWS" size={34} className="mx-auto mb-5" />
          <div className="text-[11px] sm:text-xs text-[#aaa] tracking-[0.15em]">
            <span>新會商會中學</span>
            <span className="mx-2">·</span>
            <span>人工智慧教育</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
