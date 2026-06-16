import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  Cpu, 
  GraduationCap, 
  Terminal, 
  Bot, 
  Coins, 
  Compass, 
  ArrowRight, 
  Code,
  Info
} from 'lucide-react';
import bgImage from './1.png';

const SPOTLIGHT_R = 260;

const Stylesheet = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,400;1,500;1,600&display=swap');
    
    * { font-family: 'Inter', sans-serif; }
    .font-playfair { font-family: 'Playfair Display', serif; }

    @keyframes heroReveal { 
      0% { opacity: 0; transform: translateY(28px); filter: blur(12px); } 
      100% { opacity: 1; transform: translateY(0); filter: blur(0); } 
    }
    @keyframes heroFadeUp { 
      0% { opacity: 0; transform: translateY(20px); } 
      100% { opacity: 1; transform: translateY(0); } 
    }
    @keyframes heroZoom { 
      0% { transform: scale(1.12); } 
      100% { transform: scale(1); } 
    }
    @keyframes cyberPulse {
      0%, 100% { border-color: rgba(232, 112, 42, 0.2); box-shadow: 0 0 0 rgba(232, 112, 42, 0); }
      50% { border-color: rgba(232, 112, 42, 0.6); box-shadow: 0 0 15px rgba(232, 112, 42, 0.2); }
    }

    .hero-anim { opacity: 0; animation-fill-mode: forwards; animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }
    .hero-reveal { animation-name: heroReveal; animation-duration: 1.1s; }
    .hero-fade { animation-name: heroFadeUp; animation-duration: 1s; }
    .hero-zoom { animation: heroZoom 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .cyber-pulse { animation: cyberPulse 3s infinite; }

    @media (prefers-reduced-motion: reduce) { 
      .hero-anim, .hero-zoom { animation: none; opacity: 1; } 
    }
  `}</style>
);

function RevealLayer({ image, cursorX, cursorY }) {
  const canvasRef = useRef(null);
  const [maskUrl, setMaskUrl] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render soft radial gradient exactly with the requested color stop thresholds
    const grad = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(255,255,255,1)');
    grad.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    setMaskUrl(canvas.toDataURL());
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div
        className="absolute inset-0 bg-center bg-cover bg-no-repeat z-30 pointer-events-none transition-all duration-300"
        style={{
          backgroundImage: `url(${image})`,
          maskImage: `url(${maskUrl})`,
          WebkitMaskImage: `url(${maskUrl})`,
          maskSize: '100% 100%',
          WebkitMaskSize: '100% 100%',
        }}
      />
    </>
  );
}

export default function App() {
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPillar, setSelectedPillar] = useState(null);

  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smooth = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
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

    const updateLoop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(updateLoop);
    };
    rafRef.current = requestAnimationFrame(updateLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const aiPillars = [
    {
      id: 'funding',
      title: '「智」啟學教 50萬撥款',
      icon: <Coins className="text-[#e8702a]" size={20} />,
      short: '榮獲政府50萬港元專項科技教學撥款支援。',
      desc: '我校成功榮獲政府「『智』啟學教」專向撥款支持。此筆預算將100%投入校園新型AI算力設備、智能化教室、以及創新探究教材的開發，為全校師生提供一流的人工智能硬件環境。'
    },
    {
      id: 'genai',
      title: '生成式 AI 深度融入',
      icon: <Sparkles className="text-cyan-400" size={20} />,
      short: '將大語言模型轉化為跨學科寫作、思維與創作助手。',
      desc: '不再侷限於單一科目，我們在語文寫作、科學探究及藝術創作中全面引入生成式 AI 助手。引導學生掌握「提問的藝術（Prompt Engineering）」，學會與 AI 協同合作解決現實複雜問題。'
    },
    {
      id: 'vibecoding',
      title: 'Vibe Coding 敏捷思維',
      icon: <Terminal className="text-emerald-400" size={20} />,
      short: '零代碼門檻，用口頭自然語言指揮 AI 寫出完整程式。',
      desc: '引進前沿的 Vibe Coding 模式。學生不再需要死記硬背複雜代碼語法，只需通過口頭邏輯描述，即可指揮 AI 撰寫出網頁、遊戲與數據分析模型。將學生的專注力從「語法細節」徹底解放至「邏輯思維與架構設計」。'
    },
    {
      id: 'assistant',
      title: 'AI 24/7 個性化輔助學習',
      icon: <Bot className="text-indigo-400" size={20} />,
      short: '每位學生配備專屬的課後診斷式智能學習導師。',
      desc: '結合學校學情數據，我們研發了全天候在線的課業輔助學習系統。它能針對每位學生的作答與痛點，進行溫和、漸進式的拆解和引導，提供真正因材施教的一對一教學輔導。'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white tracking-[-0.02em] font-inter relative select-none">
      <Stylesheet />

      {}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-black/60 to-transparent backdrop-blur-[2px]">
        {/* Left Side Wordmark Logo */}
        <div className="flex items-center gap-2.5 cursor-pointer">
          <svg className="w-[26px] h-[26px] animate-pulse" viewBox="0 0 256 256" fill="#ffffff">
            <path d="M 256 256 L 128 256 L 0 128 L 128 128 Z M 256 128 L 128 128 L 0 0 L 128 0 Z" />
          </svg>
          <div className="flex flex-col">
            <span className="text-white text-xl sm:text-2xl font-playfair italic font-semibold leading-none">SWCSSS AI</span>
            <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 font-bold">未來智能校園</span>
          </div>
        </div>

        {/* Center Pill - Desktop Navigation (Matches exact layout structure of prompt) */}
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
              {pillar.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Right CTA button */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedPillar(aiPillars[0])}
            className="hidden md:flex items-center gap-1.5 bg-white text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-gray-100 transition-all hover:scale-[1.02]"
          >
            <GraduationCap size={16} />
            <span>50萬專案藍圖</span>
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-xl flex flex-col justify-center p-8 transition-all duration-300">
          <div className="flex flex-col gap-6 text-center text-xl font-light">
            <button
              onClick={() => { setSelectedPillar(null); setMobileMenuOpen(false); }}
              className="hover:text-[#e8702a] transition-colors py-2 block text-white/90"
            >
              發展總覽
            </button>
            {aiPillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => { setSelectedPillar(pillar); setMobileMenuOpen(false); }}
                className="hover:text-[#e8702a] transition-colors py-2 block text-white/90 text-lg"
              >
                {pillar.title}
              </button>
            ))}
            <button 
              onClick={() => { setSelectedPillar(aiPillars[0]); setMobileMenuOpen(false); }}
              className="mt-6 bg-[#e8702a] text-white font-semibold text-base py-3 px-8 rounded-full shadow-lg"
            >
              看50萬撥款計劃
            </button>
          </div>
        </div>
      )}

      {}
      <section className="relative w-full overflow-hidden h-screen bg-black" style={{ height: '100dvh' }}>
        
        {/* Base Background (Traditional Classroom / Library Context) */}
        <div 
          className="absolute inset-0 bg-center bg-cover bg-no-repeat z-10 hero-zoom brightness-[0.45] contrast-105" 
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Dynamic Spotlight Canvas (Reveals the high-tech glowing network computational layer bgImage) */}
        <RevealLayer image={bgImage} cursorX={cursorPos.x} cursorY={cursorPos.y} />

        {/* Floating AI Hub Active Badge to catch user's attention */}
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 backdrop-blur-md text-xs font-semibold text-[#e8702a] uppercase tracking-widest cyber-pulse select-none">
          <Sparkles size={12} className="animate-pulse" />
          <span>政府「智」啟學教 50 萬資助學校</span>
        </div>

        {}
        <div className="absolute top-[18%] sm:top-[16%] left-0 right-0 flex flex-col items-center text-center px-5 pointer-events-none z-50">
          <h1 className="text-white leading-[0.92] drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
            <span 
              className="block font-playfair italic font-normal text-[2.75rem] sm:text-7xl md:text-[5.5rem]" 
              style={{ letterSpacing: '-0.05em', animationDelay: '0.25s' }}
            >
              Future holds
            </span>
            <span 
              className="block font-normal text-[2.75rem] sm:text-7xl md:text-[5.5rem] -mt-1 sm:-mt-2" 
              style={{ letterSpacing: '-0.08em', animationDelay: '0.42s' }}
            >
              tales of minds
            </span>
          </h1>
          
          {/* Hint for interactions (Bilingual touch / mouse cue) */}
          <div className="mt-4 flex items-center gap-2 text-white/40 text-[10px] sm:text-xs tracking-[0.2em] uppercase select-none animate-pulse">
            <Compass size={12} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>移動滑鼠或觸控 ‧ 窺見 AI 圖層中的學教未來</span>
          </div>
        </div>

        {}
        <div className="hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[285px] z-50 hero-anim hero-fade" style={{ animationDelay: '0.7s' }}>
          <div className="p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl hover:border-white/20 transition-all">
            <div className="flex items-center gap-2 mb-2 text-[#e8702a]">
              <GraduationCap size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">智能學教改革</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              榮獲政府<strong>「智」啟學教50萬港元專項撥款</strong>。本校全新導入生成式 AI，將大語言模型轉化為跨學科寫作、思維與創作助手。
            </p>
          </div>
        </div>

        {}
        <div className="absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[285px] flex flex-col items-start gap-4 sm:gap-5 z-50 hero-anim hero-fade" style={{ animationDelay: '0.85s' }}>
          <div className="w-full p-4 rounded-xl bg-black/60 border border-white/10 backdrop-blur-md shadow-2xl hover:border-white/20 transition-all">
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <Code size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Vibe Coding 實踐</span>
            </div>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light">
              引入前沿的 <strong>Vibe Coding 學習模式</strong>。學生僅需描述邏輯構想，即可藉由 AI 助手實時編寫出創新的科技作品。
            </p>
          </div>
          
          <button 
            onClick={() => setSelectedPillar(aiPillars[2])}
            className="w-full sm:w-auto bg-[#e8702a] hover:bg-[#d2611f] text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg hover:shadow-[#e8702a]/30 flex items-center justify-center gap-2"
          >
            <span>探索創科藍圖</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </section>

      {}
      {selectedPillar && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#0b0b0c] border border-white/10 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            {/* Close trigger button */}
            <button 
              onClick={() => setSelectedPillar(null)}
              className="absolute top-4 right-4 text-white/40 hover:text-white p-1 hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            {/* Modal Heading block */}
            <div className="flex items-center gap-3.5 mb-5 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-white/5">
                {selectedPillar.icon}
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#e8702a] font-bold">LITHOS AI PILLARS</span>
                <h3 className="text-lg sm:text-xl font-semibold text-white">{selectedPillar.title}</h3>
              </div>
            </div>

            {/* Modal Body descriptions */}
            <div className="space-y-4">
              <p className="text-white/90 text-sm leading-relaxed font-light">
                {selectedPillar.desc}
              </p>

              {/* High-fidelity interactive mockup block based on mode */}
              {selectedPillar.id === 'vibecoding' && (
                <div className="p-3.5 rounded-lg bg-black/40 border border-emerald-500/10 text-xs font-mono text-emerald-400">
                  <div className="flex justify-between items-center text-[10px] text-white/40 mb-2 border-b border-white/5 pb-1">
                    <span>VIBE_CODING_SIMULATOR.sh</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <div># Prompt: "建立一個偵測課堂專注力的3D儀表板"</div>
                  <div className="text-white/60 mt-1">&gt; 正在生成 React 三維元件...</div>
                  <div className="text-white/60">&gt; 模塊構建完畢！學生成功在 3 秒內發佈應用。</div>
                </div>
              )}

              {selectedPillar.id === 'funding' && (
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 rounded bg-white/5 border border-white/5 text-center">
                    <div className="text-xs text-[#e8702a] font-bold">50% 撥款</div>
                    <div className="text-[10px] text-white/50">算力與AI伺服器</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5 text-center">
                    <div className="text-xs text-[#e8702a] font-bold">30% 撥款</div>
                    <div className="text-[10px] text-white/50">Vibe Coding 平台</div>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5 text-center">
                    <div className="text-xs text-[#e8702a] font-bold">20% 撥款</div>
                    <div className="text-[10px] text-white/50">教師科研培訓</div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal action controllers */}
            <div className="flex gap-3 justify-end mt-7 pt-4 border-t border-white/10">
              <button 
                onClick={() => setSelectedPillar(null)}
                className="px-5 py-2 rounded-full text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium"
              >
                關閉視窗
              </button>
              <button 
                onClick={() => {
                  // Cycle to next pillar
                  const currentIndex = aiPillars.findIndex(p => p.id === selectedPillar.id);
                  const nextIndex = (currentIndex + 1) % aiPillars.length;
                  setSelectedPillar(aiPillars[nextIndex]);
                }}
                className="px-5 py-2 rounded-full text-xs font-semibold bg-[#e8702a] text-white hover:bg-[#d2611f] transition-all"
              >
                了解下一個亮點
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}