import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  GraduationCap, 
  Terminal, 
  Bot, 
  Coins, 
  Compass, 
  ArrowRight
} from 'lucide-react';
import bgImage from '../2.png';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';

const Stylesheet = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
    * { font-family: 'Inter', 'PingFang HK', -apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', sans-serif; letter-spacing: 0.03em; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
    .font-playfair { font-family: 'Playfair Display', 'PingFang HK', serif; }
    .font-noto { font-family: 'PingFang HK', -apple-system, BlinkMacSystemFont, 'Microsoft JhengHei', sans-serif; letter-spacing: 0.06em; }
    html { scroll-behavior: smooth; }
    @keyframes heroZoom { 0% { transform: scale(1.12); } 100% { transform: scale(1); } }
    @keyframes cyberPulse { 0%,100% { border-color: rgba(139,195,74,0.2); box-shadow: 0 0 0 rgba(139,195,74,0); } 50% { border-color: rgba(139,195,74,0.6); box-shadow: 0 0 15px rgba(139,195,74,0.2); } }
    .hero-zoom { animation: heroZoom 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .cyber-pulse { animation: cyberPulse 3s infinite; }
    @media (prefers-reduced-motion: reduce) { .hero-zoom { animation: none; } }
    .char-type { display: inline-block; transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
    @keyframes spotlight {
      0% { transform: scale(1); box-shadow: 0 0 0 transparent; border-color: rgba(139,195,74,0.15); }
      18% { transform: scale(1.35); box-shadow: 0 0 40px rgba(139,195,74,0.2); border-color: rgba(139,195,74,0.5); }
      45% { transform: scale(1); box-shadow: 0 0 0 transparent; border-color: rgba(139,195,74,0.15); }
      100% { transform: scale(1); box-shadow: 0 0 0 transparent; border-color: rgba(139,195,74,0.15); }
    }
    .spotlight-active { animation: spotlight 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .node-glow { transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1); }
    .node-glow:hover { box-shadow: 0 0 24px rgba(139,195,74,0.15); border-color: rgba(139,195,74,0.5) !important; transform: scale(1.02); }
  `}</style>
);

function NeuralNetwork({ mouseX, mouseY }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: -999, y: -999 });
  const rafRef = useRef(null);

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COUNT = 70;
    const CONNECT_DIST = 160;
    const ATTRACT_STR = 0.04;
    const FRICTION = 0.98;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    if (particlesRef.current.length === 0) {
      particlesRef.current = Array.from({ length: COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
      }));
    }
    const p = particlesRef.current;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < COUNT; i++) {
        const a = p[i];
        const dx = mx - a.x;
        const dy = my - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          a.vx += (dx / dist) * ATTRACT_STR;
          a.vy += (dy / dist) * ATTRACT_STR;
        }
        a.vx += (Math.random() - 0.5) * 0.08;
        a.vy += (Math.random() - 0.5) * 0.08;
        a.vx *= FRICTION;
        a.vy *= FRICTION;
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0) a.x = canvas.width;
        if (a.x > canvas.width) a.x = 0;
        if (a.y < 0) a.y = canvas.height;
        if (a.y > canvas.height) a.y = 0;

        const n = 0.6 + Math.sin(Date.now() * 0.002 + i) * 0.4;
        ctx.beginPath();
        ctx.arc(a.x, a.y, 2.5 * n, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 195, 74, ${0.25 * n})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(a.x, a.y, 6 * n, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 195, 74, ${0.06 * n})`;
        ctx.fill();

        for (let j = i + 1; j < COUNT; j++) {
          const b = p[j];
          const dx2 = b.x - a.x;
          const dy2 = b.y - a.y;
          const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
          if (d2 < CONNECT_DIST) {
            const o = 1 - d2 / CONNECT_DIST;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(139, 195, 74, ${o * 0.12})`;
            ctx.lineWidth = o * 0.8;
            ctx.stroke();
          }
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-20 pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}

function LiquidReveal({ image, cursorX, cursorY, velocity }) {
  const canvasRef = useRef(null);
  const [maskUrl, setMaskUrl] = useState('');

  useEffect(() => {
    const resize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const t = Date.now() * 0.003;
    const vMag = Math.min(velocity.current, 12);
    const displace = vMag * 1.5;
    const R = 280 + displace * 0.5;

    ctx.save();
    for (let ring = 0; ring < 4; ring++) {
      const offsetX = Math.sin(t + ring * 1.7) * displace * (1 - ring * 0.2);
      const offsetY = Math.cos(t * 0.7 + ring * 2.3) * displace * (1 - ring * 0.2);
      const radius = R + ring * 18 + Math.sin(t * 1.3 + ring) * 8;
      const grad = ctx.createRadialGradient(
        cursorX + offsetX, cursorY + offsetY, 0,
        cursorX + offsetX, cursorY + offsetY, radius
      );
      const w = Math.max(0, 1 - ring * 0.15);
      grad.addColorStop(0, `rgba(255,255,255,${w})`);
      grad.addColorStop(0.3, `rgba(255,255,255,${w * 0.9})`);
      grad.addColorStop(0.5, `rgba(255,255,255,${w * 0.6})`);
      grad.addColorStop(0.7, `rgba(255,255,255,${w * 0.25})`);
      grad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.beginPath();
      ctx.arc(cursorX + offsetX, cursorY + offsetY, radius, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.restore();

    setMaskUrl(canvas.toDataURL());
  }, [cursorX, cursorY, velocity]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: `url(${maskUrl})`,
          WebkitMaskImage: `url(${maskUrl})`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
          transition: 'mask-image 0.05s, -webkit-mask-image 0.05s',
        }}
      />
    </>
  );
}

function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [sheen, setSheen] = useState({ x: 50, y: 50 });
  const rafRef = useRef(null);

  const handleMouse = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const maxRotate = 10;
    setTilt({
      x: (dy / (rect.height / 2)) * -maxRotate,
      y: (dx / (rect.width / 2)) * maxRotate,
    });
    setSheen({
      x: 50 + (dx / (rect.width / 2)) * 40,
      y: 50 + (dy / (rect.height / 2)) * 40,
    });
  }, []);

  const reset = () => {
    setTilt({ x: 0, y: 0 });
    setSheen({ x: 50, y: 50 });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.closest('.tilt-container') || el.parentElement;
    parent.addEventListener('mousemove', handleMouse);
    parent.addEventListener('mouseleave', reset);
    return () => {
      parent.removeEventListener('mousemove', handleMouse);
      parent.removeEventListener('mouseleave', reset);
    };
  }, [handleMouse]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.08), transparent 60%)`,
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      {children}
    </div>
  );
}

function MagneticButton({ children, className, onClick }) {
  const ref = useRef(null);
  const magnetRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const MAGNET_RADIUS = 200;
    const STRENGTH = 0.35;

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAGNET_RADIUS) {
        const power = 1 - dist / MAGNET_RADIUS;
        magnetRef.current = { x: dx * power * STRENGTH, y: dy * power * STRENGTH };
      } else {
        magnetRef.current = { x: 0, y: 0 };
      }
    };

    const handleLeave = () => {
      magnetRef.current = { x: 0, y: 0 };
    };

    const animate = () => {
      smoothRef.current.x += (magnetRef.current.x - smoothRef.current.x) * 0.15;
      smoothRef.current.y += (magnetRef.current.y - smoothRef.current.y) * 0.15;
      if (Math.abs(smoothRef.current.x) > 0.01 || Math.abs(smoothRef.current.y) > 0.01) {
        el.style.transform = `translate(${smoothRef.current.x}px, ${smoothRef.current.y}px)`;
      } else {
        el.style.transform = 'translate(0, 0)';
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button ref={ref} className={className} onClick={onClick} style={{ willChange: 'transform' }}>
      {children}
    </button>
  );
}

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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
    const handleMouseMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });

    const loop = () => {
      const dx = mouse.current.x - prevMouse.current.x;
      const dy = mouse.current.y - prevMouse.current.y;
      velocityRef.current += (Math.sqrt(dx * dx + dy * dy) - velocityRef.current) * 0.1;

      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.08;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.08;

      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      setVelocity({ x: dx, y: dy });

      prevMouse.current = { ...mouse.current };
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const typingText = '創新·啟發·未來';
  const typingTotal = typingText.length + 6;
  useEffect(() => {
    const timer = setInterval(() => {
      setTypingStep(s => (s + 1) % typingTotal);
    }, 350);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (selectedPillar?.id !== 'funding') { setSpotlightCycle(0); return; }
    const t = setTimeout(() => setSpotlightCycle(1), 300);
    return () => clearTimeout(t);
  }, [selectedPillar]);

  useEffect(() => {
    if (spotlightCycle === 0) {
      const t = setTimeout(() => setSpotlightCycle(1), 3500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setSpotlightCycle(prev => prev >= 8 ? 0 : prev + 1);
    }, 2200);
    return () => clearTimeout(t);
  }, [spotlightCycle]);

  const gameImages = [img3, img4, img5, img6];
  useEffect(() => {
    const t = setInterval(() => setGameImg(prev => (prev + 1) % gameImages.length), 3500);
    return () => clearInterval(t);
  }, []);

  const aiPillars = [
    {
      id: 'funding',
      title: '「智」啟學教 50萬撥款',
      nav: '撥款計劃',
      icon: <Sparkles className="text-[#8BC34A]" size={20} />,
      short: '榮獲政府50萬港元專項撥款支援。',
      desc: '榮獲政府「智啟學教」50萬港元專項撥款，用於校園AI算力設備、智能化教室及創新教材開發，為全校師生提供一流人工智能硬件環境。',
      color: '#8BC34A',
    },
    {
      id: 'genai',
      title: '生成式 AI',
      nav: '生成式AI',
      icon: <GraduationCap className="text-[#9CCC65]" size={20} />,
      short: '跨學科引入生成式AI助手。',
      desc: '在語文寫作、科學探究及藝術創作中全面引入生成式AI助手。引導學生掌握提問技巧（Prompt Engineering），學會與AI協同解決現實問題。',
      color: '#9CCC65',
    },
    {
      id: 'vibecoding',
      title: 'Vibe Coding 學習',
      nav: 'VibeCoding',
      icon: <Terminal className="text-[#66BB6A]" size={20} />,
      short: '零代碼門檻，以自然語言指揮AI寫程式。',
      desc: '引進前沿Vibe Coding模式。學生無需死記語法，只需以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型，專注力從語法解放至邏輯思維。',
      color: '#66BB6A',
    },
    {
      id: 'assistant',
      title: 'AI 輔助學習',
      nav: 'AI輔助',
      icon: <Bot className="text-[#81C784]" size={20} />,
      short: '24/7 個性化診斷式學習導師。',
      desc: '全天候在線課業輔助學習系統，針對每位學生的作答與弱點進行溫和、漸進式拆解引導，提供真正因材施教的一對一教學輔導。',
      color: '#81C784',
    },
  ];

  const cardColors = [
    { bg: 'bg-[#8BC34A]/10', border: 'border-[#8BC34A]/30', hover: 'hover:border-[#8BC34A]', text: 'text-[#8BC34A]', glow: 'rgba(139,195,74,0.15)' },
    { bg: 'bg-[#9CCC65]/10', border: 'border-[#9CCC65]/30', hover: 'hover:border-[#9CCC65]', text: 'text-[#9CCC65]', glow: 'rgba(156,204,101,0.15)' },
    { bg: 'bg-[#66BB6A]/10', border: 'border-[#66BB6A]/30', hover: 'hover:border-[#66BB6A]', text: 'text-[#66BB6A]', glow: 'rgba(102,187,106,0.15)' },
    { bg: 'bg-[#81C784]/10', border: 'border-[#81C784]/30', hover: 'hover:border-[#81C784]', text: 'text-[#81C784]', glow: 'rgba(129,199,132,0.15)' },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-inter relative select-none overflow-x-hidden">
      <Stylesheet />

      <NeuralNetwork mouseX={cursorPos.x} mouseY={cursorPos.y} />

      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px]">
        <div className="flex items-center gap-2.5 cursor-pointer">
          <svg className="w-[26px] h-[26px] animate-pulse" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-white text-xl sm:text-2xl font-noto font-semibold leading-none tracking-[0.15em]">新會商會中學</span>
            <span className="text-[9px] tracking-[0.35em] uppercase text-white/50 font-bold">AI 智慧校園</span>
          </div>
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-2 py-2 items-center gap-1 shadow-lg">
          <button
            onClick={() => { setSelectedPillar(null); setActiveTab('overview'); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'overview' && !selectedPillar ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/10'}`}
          >
            發展總覽
          </button>
          {aiPillars.map((pillar) => (
            <button
              key={pillar.id}
              onClick={() => { setSelectedPillar(pillar); setActiveTab(pillar.id); }}
              className={`text-white/80 hover:bg-white/20 hover:text-white transition-colors px-4 py-1.5 rounded-full text-sm font-medium ${selectedPillar?.id === pillar.id ? 'bg-white/20 text-white font-semibold' : ''}`}
            >
              {pillar.nav}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <MagneticButton
            onClick={() => setSelectedPillar(aiPillars[0])}
            className="hidden md:flex items-center gap-1.5 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-colors hover:scale-[1.02]"
          >
            <GraduationCap size={16} />
            <span className="tracking-[0.08em]">AI 教育藍圖</span>
          </MagneticButton>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col justify-center p-8 transition-all duration-300">
          <div className="flex flex-col gap-6 text-center text-xl font-light tracking-[0.08em]">
            <button onClick={() => { setSelectedPillar(null); setMobileMenuOpen(false); }}
              className="hover:text-[#8BC34A] transition-colors py-2 block text-white/90">
              學校概覽
            </button>
            {aiPillars.map((pillar) => (
              <button key={pillar.id}
                onClick={() => { setSelectedPillar(pillar); setMobileMenuOpen(false); }}
                className="hover:text-[#8BC34A] transition-colors py-2 block text-white/90 text-lg">
                {pillar.title}
              </button>
            ))}
            <button onClick={() => { setSelectedPillar(aiPillars[0]); setMobileMenuOpen(false); }}
              className="mt-6 bg-[#8BC34A] text-white font-semibold text-base py-3 px-8 rounded-full shadow-lg">
              <span className="tracking-[0.08em]">探索 AI 教育計劃</span>
            </button>
          </div>
        </div>
      )}

      <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom brightness-[0.45] contrast-105"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        <NeuralNetwork mouseX={cursorPos.x} mouseY={cursorPos.y} />

        <LiquidReveal image={bgImage} cursorX={cursorPos.x} cursorY={cursorPos.y} velocity={velocityRef} />

        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-semibold text-[#8BC34A] uppercase tracking-widest cyber-pulse select-none">
          <Sparkles size={12} className="animate-pulse" />
          <span className="tracking-[0.15em]">新會商會中學 · AI 教育改革</span>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <span className="block font-noto font-bold italic text-[3.5rem] sm:text-[5.5rem] md:text-[7rem]"
              style={{ letterSpacing: '0.15em' }}>
              {typingText.split('').map((ch, i) => (
                <span key={i} className="char-type" style={{
                  opacity: i < typingStep ? 1 : 0,
                  transform: i < typingStep ? 'scale(1)' : 'scale(0.15)',
                }}>
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <div className="mt-4 flex items-center gap-2 text-white/40 text-[10px] sm:text-xs tracking-[0.2em] uppercase select-none animate-pulse">
            <Compass size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span className="tracking-[0.15em]">移動滑鼠或觸控 ‧ 探索新會商會中學 AI 教育藍圖</span>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-10 left-0 right-0 z-50 px-4 sm:px-10 tilt-container">
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {aiPillars.map((pillar, i) => {
              const c = cardColors[i];
              return (
                <TiltCard key={pillar.id}>
                  <button
                    onClick={() => setSelectedPillar(pillar)}
                    className={`relative w-full p-4 sm:p-5 rounded-2xl ${c.bg} ${c.border} ${c.hover} border backdrop-blur-sm text-left cursor-pointer`}
                    style={{ boxShadow: `0 0 30px ${c.glow}` }}
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${c.bg} flex items-center justify-center mb-3`}>
                      {pillar.icon}
                    </div>
                    <h3 className="text-sm sm:text-base font-noto font-semibold text-white mb-1.5 tracking-[0.08em]">{pillar.title}</h3>
                    <p className={`text-[10px] sm:text-xs ${c.text}/70 leading-relaxed tracking-[0.05em]`}>{pillar.short}</p>
                    <div className={`mt-3 flex items-center gap-1 text-[10px] ${c.text}`}>
                      <span>了解更多</span>
                      <ArrowRight size={10} />
                    </div>
                  </button>
                </TiltCard>
              );
            })}
          </div>
        </div>
      </section>

      {selectedPillar && selectedPillar.id !== 'funding' && selectedPillar.id !== 'assistant' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <button onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-colors">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3.5 mb-5 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-white/5">{selectedPillar.icon}</div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8BC34A] font-bold">新會商會中學 · AI 教育</span>
                <h3 className="text-lg sm:text-xl font-semibold text-white">{selectedPillar.title}</h3>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-white/90 text-sm leading-relaxed font-light tracking-[0.06em]">{selectedPillar.desc}</p>

              {selectedPillar.id === 'vibecoding' && (
                <div className="p-3.5 rounded-lg bg-black/40 border border-[#66BB6A]/10 text-xs font-mono text-[#66BB6A]">
                  <div className="flex justify-between items-center text-[10px] text-white/40 mb-2 border-b border-white/5 pb-1">
                    <span>VIBE_CODING_SIMULATOR.sh</span>
                    <span className="w-2 h-2 rounded-full bg-[#66BB6A] animate-pulse"></span>
                  </div>
                  <div># Prompt: "建立一個校園圖書管理系統"</div>
                  <div className="text-white/60 mt-1">&gt; 正在生成應用程式...</div>
                  <div className="text-white/60">&gt; 學生成功在課堂內完成開發。</div>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-7 pt-4 border-t border-white/10">
              <button onClick={() => setSelectedPillar(null)}
                className="px-5 py-2 rounded-full text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium">
                <span className="tracking-[0.08em]">關閉視窗</span>
              </button>
              <MagneticButton onClick={() => {
                const currentIndex = aiPillars.findIndex(p => p.id === selectedPillar.id);
                const nextIndex = (currentIndex + 1) % aiPillars.length;
                setSelectedPillar(aiPillars[nextIndex]);
              }}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#8BC34A] text-white hover:bg-[#7CB342] transition-all">
                <span className="tracking-[0.08em]">了解下一項</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      )}

      {selectedPillar?.id === 'funding' && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 sm:p-8 pt-12 sm:pt-16 overflow-y-auto bg-black/90 backdrop-blur-lg">
          <div className="relative bg-[#0a0a0b] border border-[#8BC34A]/20 rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 my-4" style={{ boxShadow: '0 0 60px rgba(139,195,74,0.06)' }}>
            <button onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors z-10">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-8 border-b border-[#8BC34A]/10 pb-6">
              <div className="p-3 rounded-2xl bg-[#8BC34A]/10 border border-[#8BC34A]/20">
                <Sparkles className="text-[#8BC34A]" size={28} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#8BC34A] font-bold">新會商會中學 · AI 教育</span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mt-0.5">「智」啟學教 50萬撥款 — 執行藍圖</h3>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full relative">
                <div className="flex-1 relative flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8BC34A]/10 border border-[#8BC34A]/20 text-sm font-bold text-white mb-3">
                    <span>🛠️</span> 採購與工具
                  </div>
                  <div className="w-full space-y-2 relative pl-4 border-l-2 border-[#8BC34A]/20">
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-[#8BC34A]/20">
                      <div className={`node-glow p-3 rounded-lg bg-[#8BC34A]/5 border ${spotlightCycle === 1 ? 'spotlight-active' : 'border-[#8BC34A]/10'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#8BC34A]">軟件/平台</span>
                          <span className="text-[9px] text-[#8BC34A]/60 font-mono">40-50%</span>
                        </div>
                        <div className="text-[10px] text-white/40 leading-relaxed">訂閱生成式 AI（教育版）及 Canva Pro 等學科專用工具</div>
                      </div>
                    </div>
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-[#8BC34A]/20">
                      <div className={`node-glow p-3 rounded-lg bg-[#8BC34A]/5 border ${spotlightCycle === 2 ? 'spotlight-active' : 'border-[#8BC34A]/10'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#8BC34A]">硬件</span>
                          <span className="text-[9px] text-[#8BC34A]/60 font-mono">20-30%</span>
                        </div>
                        <div className="text-[10px] text-white/40 leading-relaxed">micro:bit V2 + AI 鏡頭 / Raspberry Pi AI 套件</div>
                      </div>
                    </div>
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-[#8BC34A]/20">
                      <div className={`node-glow p-3 rounded-lg bg-[#8BC34A]/5 border ${spotlightCycle === 3 ? 'spotlight-active' : 'border-[#8BC34A]/10'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-[#8BC34A]">外間方案</span>
                          <span className="text-[9px] text-[#8BC34A]/60 font-mono">20%</span>
                        </div>
                        <div className="text-[10px] text-white/40 leading-relaxed">教師 AI 工作坊（備課與批改）2-3 場</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9CCC65]/10 border border-[#9CCC65]/20 text-sm font-bold text-white mb-3">
                    <span>📚</span> 學科推行
                  </div>
                  <div className="w-full space-y-2 relative pl-4 border-l-2 border-[#9CCC65]/20">
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-[#9CCC65]/20">
                      <div className={`node-glow p-3 rounded-lg bg-[#9CCC65]/5 border ${spotlightCycle === 4 ? 'spotlight-active' : 'border-[#9CCC65]/15'}`}>
                        <div className="text-xs font-semibold text-[#9CCC65] mb-1">語文科 · 中一至中二</div>
                        <div className="text-[10px] text-white/40 leading-relaxed">AI 寫作構思 + AI 會話夥伴</div>
                      </div>
                    </div>
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-[#66BB6A]/20">
                      <div className={`node-glow p-3 rounded-lg bg-[#66BB6A]/5 border ${spotlightCycle === 5 ? 'spotlight-active' : 'border-[#66BB6A]/15'}`}>
                        <div className="text-xs font-semibold text-[#66BB6A] mb-1">科學/ICT · 中二至中三</div>
                        <div className="text-[10px] text-white/40 leading-relaxed">Teachable Machine + micro:bit 硬件</div>
                      </div>
                    </div>
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-[#81C784]/20">
                      <div className={`node-glow p-3 rounded-lg bg-[#81C784]/5 border ${spotlightCycle === 6 ? 'spotlight-active' : 'border-[#81C784]/15'}`}>
                        <div className="text-xs font-semibold text-[#81C784] mb-1">視藝/地理 · 中一及中三</div>
                        <div className="text-[10px] text-white/40 leading-relaxed">AI 繪圖倫理 + 氣候模擬</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 relative flex flex-col items-center">
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-sm font-bold text-white mb-3">
                    <span>🎯</span> 學生活動
                  </div>
                  <div className="w-full space-y-2 relative pl-4 border-l-2 border-white/15">
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-white/15">
                      <div className={`node-glow p-3 rounded-lg bg-white/[0.03] border ${spotlightCycle === 7 ? 'spotlight-active' : 'border-white/10'}`}>
                        <div className="text-xs font-semibold text-white mb-1">AI Prompt 創意大賽</div>
                        <div className="text-[10px] text-white/40 leading-relaxed">全校「Prompt Master」爭霸戰</div>
                      </div>
                    </div>
                    <div className="relative pl-4 before:content-[''] before:absolute before:left-[-16px] before:top-1/2 before:w-4 before:h-[2px] before:bg-white/15">
                      <div className={`node-glow p-3 rounded-lg bg-white/[0.03] border ${spotlightCycle === 8 ? 'spotlight-active' : 'border-white/10'}`}>
                        <div className="text-xs font-semibold text-white mb-1">AI 智能產品設計日</div>
                        <div className="text-[10px] text-white/40 leading-relaxed">AI Boot Camp · 社區問題解決</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-10 pt-6 border-t border-[#8BC34A]/10">
              <button onClick={() => setSelectedPillar(null)}
                className="px-5 py-2.5 rounded-full text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium">
                <span className="tracking-[0.08em]">關閉視窗</span>
              </button>
              <MagneticButton onClick={() => {
                const currentIndex = aiPillars.findIndex(p => p.id === selectedPillar.id);
                const nextIndex = (currentIndex + 1) % aiPillars.length;
                setSelectedPillar(aiPillars[nextIndex]);
              }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#8BC34A] text-white hover:bg-[#7CB342] transition-all">
                <span className="tracking-[0.08em]">了解下一項</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      )}

      {selectedPillar?.id === 'assistant' && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center p-4 sm:p-8 pt-12 sm:pt-16 overflow-y-auto bg-black/90 backdrop-blur-lg">
          <div className="relative bg-[#0a0a0b] border border-[#81C784]/20 rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl animate-in fade-in zoom-in-95 duration-300 my-4">
            <button onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors z-10">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6 border-b border-[#81C784]/10 pb-5">
              <div className="p-3 rounded-2xl bg-[#81C784]/10 border border-[#81C784]/20">
                <Bot className="text-[#81C784]" size={28} />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#81C784] font-bold">新會商會中學 · AI 教育</span>
                <h3 className="text-xl sm:text-2xl font-semibold text-white mt-0.5">BAFS 商業大亨 — AI 輔助學習工具</h3>
              </div>
            </div>

            <p className="text-white/60 text-xs leading-relaxed mb-6 tracking-[0.05em]">
              「BAFS 商業大亨」是一款結合了香港中學文憑試「企會財 (BAFS)」學科知識與大富翁 (Monopoly) 玩法的教育型桌遊。
            </p>

            <div className="relative w-full rounded-xl mb-6 bg-black/40 border border-white/5">
              <img
                src={gameImages[gameImg]}
                alt="BAFS 商業大亨"
                className="w-full h-auto max-h-[55vh] object-contain mx-auto transition-opacity duration-500"
              />
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {gameImages.map((_, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full transition-all ${i === gameImg ? 'bg-[#81C784] w-4' : 'bg-white/30'}`} />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
              {[
                { icon: '🏢', label: '企業收購', sub: '一般地產' },
                { icon: '🎲', label: '機遇與風險', sub: '機會/命運' },
                { icon: '📊', label: '法規改變', sub: '總體經濟' },
                { icon: '⚖️', label: '稅務與懲罰', sub: '' },
                { icon: '🤝', label: '收購中心', sub: '' },
                { icon: '📈', label: '證券交易', sub: '' },
                { icon: '🏦', label: '銀行中心', sub: '' },
                { icon: '🔨', label: '打工', sub: '' },
              ].map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#81C784]/5 border border-[#81C784]/15 text-center hover:bg-[#81C784]/10 hover:border-[#81C784]/30 transition-all cursor-default">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-xs font-semibold text-white">{item.label}</div>
                  {item.sub && <div className="text-[9px] text-white/40 mt-0.5">{item.sub}</div>}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-end pt-5 border-t border-[#81C784]/10">
              <button onClick={() => setSelectedPillar(null)}
                className="px-5 py-2.5 rounded-full text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium">
                <span className="tracking-[0.08em]">關閉視窗</span>
              </button>
              <MagneticButton onClick={() => {
                const currentIndex = aiPillars.findIndex(p => p.id === selectedPillar.id);
                const nextIndex = (currentIndex + 1) % aiPillars.length;
                setSelectedPillar(aiPillars[nextIndex]);
              }}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#81C784] text-white hover:bg-[#66BB6A] transition-all">
                <span className="tracking-[0.08em]">了解下一項</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-black border-t border-white/5 py-10 px-5">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-white/30 text-xs tracking-[0.15em]">
            <span className="font-noto font-semibold text-white/40">新會商會中學</span>
            <span className="mx-3">·</span>
            <span>AI 智慧校園計劃</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
