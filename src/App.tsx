import React, { useState, useEffect, useRef } from 'react';
import bgImage from '../2.png';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';

function useInView(t = 0.12) {
  const ref = useRef(null);
  const [v, s] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { s(true); o.unobserve(el); } }, { threshold: t });
    o.observe(el);
    return () => o.disconnect();
  }, [t]);
  return [ref, v];
}

function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el = document.getElementById('hero');
      if (!el) return;
      const r = el.getBoundingClientRect();
      setP(Math.max(0, Math.min(1, (window.innerHeight - r.top) / (window.innerHeight * 1.3))));
    };
    fn();
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return p;
}

const Style = () => (
  <style>{`
    html { scroll-behavior: smooth; }
    @keyframes sealPop {
      0% { transform: scale(0) rotate(-15deg); opacity: 0; }
      60% { transform: scale(1.15) rotate(3deg); opacity: 1; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    .seal-anim { animation: sealPop 0.8s cubic-bezier(0.34,1.56,0.64,1) forwards; }
    @keyframes fadeUp {
      0% { opacity: 0; transform: translateY(32px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .fade-up { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) forwards; }
    @keyframes charReveal {
      0% { opacity: 0; transform: scale(0.1); }
      100% { opacity: 1; transform: scale(1); }
    }
    .char-type { display: inline-block; transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1); }
    @keyframes pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.8; } }
    .pulse { animation: pulse 2s ease-in-out infinite; }
    @media (prefers-reduced-motion: reduce) {
      .char-type, .seal-anim, .fade-up { animation: none !important; }
    }
  `}</style>
);

function Seal({ text, size = 52 }) {
  return (
    <div className="seal-anim flex items-center justify-center rounded-full bg-[#C41E3A] text-white shadow-lg"
      style={{ width: size, height: size, fontSize: size * 0.34, lineHeight: 1 }}>
      {text}
    </div>
  );
}

function PaperBg() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none"
      style={{
        backgroundColor: '#FAF9F6',
        backgroundImage: `
          repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.015) 40px, rgba(0,0,0,0.015) 41px),
          repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.015) 40px, rgba(0,0,0,0.015) 41px)
        `,
      }} />
  );
}

function Section({ id, num, title, desc, bg, children, idx }) {
  const [ref, inView] = useInView(0.08);
  const colors = ['#F0EDE6', '#EBE9E2', '#EDEFE9', '#ECE8E2'];
  const walls = ['#1a1a1a', '#2E8B57', '#8B4513'];
  return (
    <section ref={ref} id={id} className={`py-20 sm:py-28 px-5 sm:px-12 ${bg || colors[idx % 4]}`}
      style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.7s ease, transform 0.7s ease', ...(inView ? { opacity: 1, transform: 'translateY(0)' } : {}) }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 sm:gap-6 mb-8">
          <span className="text-[10px] text-[#bbb] tracking-[0.3em]">{num}</span>
          <div className="w-6 h-px bg-[#ddd]" />
          <h2 className="text-xl sm:text-2xl md:text-3xl text-[#333]" style={{ fontWeight: 300 }}>{title}</h2>
        </div>
        <p className="text-xs sm:text-sm text-[#777] max-w-2xl leading-[1.9] mb-8">{desc}</p>
        {children}
      </div>
    </section>
  );
}

const sections = [
  {
    id: 'funding', num: '01', title: '智啟學教', desc: '榮獲政府「智啟學教」50萬港元專項撥款，用於校園AI算力設備、智能化教室及創新教材開發。',
    cols: [
      { title: '採購與工具', items: [{ l: '軟件 / 平台', s: 'AI教育版 · Canva Pro', p: '40-50%' }, { l: '硬件', s: 'micro:bit · Pi AI', p: '20-30%' }, { l: '外間方案', s: '教師 AI 工作坊', p: '20%' }] },
      { title: '學科推行', items: [{ l: '語文科', s: 'AI寫作 + AI會話' }, { l: '科學/ICT', s: 'Teachable Machine' }, { l: '視藝/地理', s: 'AI繪圖·氣候模擬' }] },
      { title: '學生活動', items: [{ l: 'Prompt 創意賽', s: '全校爭霸戰' }, { l: 'AI 產品設計', s: 'Boot Camp' }] },
    ],
  },
  {
    id: 'genai', num: '02', title: '生成式 AI', desc: '在語文寫作、科學探究及藝術創作中全面引入生成式AI助手，引導學生掌握提問技巧，學會與AI協同解決現實問題。',
    subs: [
      { icon: '✍️', label: '語文寫作', items: ['AI 寫作構思', 'AI 會話夥伴', '文章潤飾'] },
      { icon: '🔬', label: '科學探究', items: ['Teachable Machine', '數據分析', '實驗模擬'] },
      { icon: '🎨', label: '藝術創作', items: ['AI 繪圖倫理', '風格轉換', '多媒體設計'] },
    ],
  },
  {
    id: 'vibe', num: '03', title: 'Vibe Coding', desc: '引進前沿Vibe Coding模式，學生無需死記語法，以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型。',
  },
  {
    id: 'assistant', num: '04', title: 'AI 輔助學習', desc: '全天候在線課業輔助學習系統，針對每位學生的作答與弱點進行溫和、漸進式拆解引導，提供真正因材施教的一對一教學輔導。',
  },
];

export default function App() {
  const [typingStep, setTypingStep] = useState(0);
  const [gameImg, setGameImg] = useState(0);
  const scrollP = useScrollProgress();

  const typingText = '創新·啟發·未來';
  const total = typingText.length + 6;
  useEffect(() => { const t = setInterval(() => setTypingStep(s => (s + 1) % total), 400); return () => clearInterval(t); }, []);

  const gameImages = [img3, img4, img5, img6];
  useEffect(() => { const t = setInterval(() => setGameImg(p => (p + 1) % gameImages.length), 3500); return () => clearInterval(t); }, []);

  const sealScale = 1 - scrollP * 0.5;
  const sealOpacity = 1 - scrollP;
  const envY = scrollP * 100;
  const envOpacity = 1 - scrollP;
  const letterOpacity = Math.min(1, scrollP * 1.2);
  const letterY = (1 - scrollP) * 40;

  return (
    <div className="min-h-screen text-[#1a1a1a] relative overflow-x-hidden"
      style={{ fontFamily: "'Noto Serif SC', 'PingFang HK', serif", fontWeight: 300 }}>
      <Style />
      <PaperBg />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 sm:px-10 py-3" style={{ background: 'rgba(250,249,246,0.92)', backdropFilter: 'blur(6px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-full bg-[#C41E3A] flex items-center justify-center">
            <span className="text-white text-[7px] tracking-[0.05em]">SWS</span>
          </div>
          <span className="text-[10px] text-[#888]" style={{ letterSpacing: '0.08em' }}>新會商會中學</span>
        </div>
        <div className="hidden md:flex items-center gap-5 text-[10px] text-[#aaa] tracking-[0.15em]">
          <a href="#hero" className="hover:text-[#666] transition-colors">首頁</a>
          {sections.map(s => (
            <a key={s.id} href={'#' + s.id} className="hover:text-[#666] transition-colors">{s.num} {s.title}</a>
          ))}
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" className="relative w-full overflow-hidden flex items-center justify-center" style={{ height: '100dvh' }}>
        {/* Background */}
        <div className="absolute inset-0 z-10" style={{ background: 'linear-gradient(180deg, #FAF9F6 0%, #F5F2EC 50%, #EDE8E0 100%)' }} />
        <div className="absolute inset-0 z-20 bg-center bg-cover bg-no-repeat opacity-[0.08] mix-blend-multiply"
          style={{ backgroundImage: `url(${bgImage})`, filter: 'grayscale(1) contrast(0.7) brightness(1.5)' }} />

        {/* Letter content (behind envelope) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-none" style={{ opacity: letterOpacity, transform: `translateY(${letterY}px)` }}>
          <Seal text="AI" size={28} />
          <h1 className="text-[#1a1a1a] mt-5">
            <span className="block text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-none" style={{ fontWeight: 300, letterSpacing: '0.04em' }}>
              {typingText.split('').map((ch, i) => (
                <span key={i} className="char-type" style={{ opacity: i < typingStep ? 1 : 0, transform: i < typingStep ? 'scale(1)' : 'scale(0.1)' }}>{ch}</span>
              ))}
            </span>
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-[#999]" style={{ letterSpacing: '0.2em' }}>新會商會中學 · 人工智慧教育藍圖</p>
        </div>

        {/* Envelope front */}
        <div className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center" style={{ transform: `translateY(${envY}%)`, opacity: envOpacity }}>
          <div className="w-full h-full max-w-2xl mx-auto flex flex-col items-center justify-center px-6" style={{ background: '#FAF9F6', boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 4px 24px rgba(0,0,0,0.04)' }}>
            {/* Flap triangle */}
            <div className="absolute top-0 left-0 right-0">
              <svg viewBox="0 0 200 28" className="w-full h-auto" preserveAspectRatio="none">
                <path d="M0,0 L200,0 L200,2 L105,24 L100,28 L95,24 L0,2 Z" fill="rgba(0,0,0,0.025)" stroke="rgba(0,0,0,0.06)" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Stamp */}
            <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-12 sm:w-12 sm:h-14 flex flex-col items-center justify-center" style={{ border: '2px solid rgba(196,30,58,0.25)', background: '#FAF9F6' }}>
              <span className="text-[6px] text-[#C41E3A] font-bold" style={{ letterSpacing: '0.1em' }}>AIR MAIL</span>
              <div className="w-4 h-4 mt-1 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(196,30,58,0.2)' }}>
                <span className="text-[5px] text-[#C41E3A]">$3.7</span>
              </div>
            </div>

            {/* Return address */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8 text-left">
              <p className="text-[7px] text-[#ccc]" style={{ letterSpacing: '0.15em' }}>寄件人</p>
              <p className="text-[10px] text-[#999] mt-0.5" style={{ fontWeight: 400 }}>新會商會中學</p>
              <p className="text-[8px] text-[#aaa]">葵涌葵盛圍 · SWCSSS</p>
            </div>

            {/* Address */}
            <div className="text-center" style={{ marginTop: '-1rem' }}>
              <p className="text-[10px] text-[#ccc] mb-4" style={{ letterSpacing: '0.15em' }}>致</p>
              <p className="text-sm sm:text-base md:text-lg text-[#666] mb-3" style={{ fontWeight: 400, letterSpacing: '0.2em' }}>全體教職員 · 學生 · 家長</p>
              <div className="w-28 h-px mx-auto mb-3" style={{ background: '#eee' }} />
              <p className="text-[9px] text-[#bbb]" style={{ letterSpacing: '0.12em' }}>新界葵涌葵盛圍 新會商會中學</p>
            </div>

            {/* Wax seal */}
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2" style={{ transform: `translateX(-50%) scale(${sealScale})`, opacity: sealOpacity }}>
              <div className="seal-anim w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-[#C41E3A] flex items-center justify-center shadow-md">
                <span className="text-white text-[9px] sm:text-[11px]" style={{ letterSpacing: '0.1em' }}>SWS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none" style={{ opacity: 1 - scrollP }}>
          <span className="text-[9px] text-[#bbb]" style={{ letterSpacing: '0.2em' }}>向下滾動打開</span>
          <svg width="20" height="28" viewBox="0 0 20 28" className="pulse">
            <rect x="1" y="1" width="18" height="26" rx="9" fill="none" stroke="#ccc" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="2.5" fill="#bbb" />
          </svg>
        </div>
      </section>

      {/* ════════ SECTION 01 ════════ */}
      <Section id="funding" num="01" title="智啟學教" desc={sections[0].desc} idx={0}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(0,0,0,0.05)' }}>
          {sections[0].cols.map((col, i) => (
            <div key={i} className="p-5 sm:p-6" style={{ background: '#FAF9F6' }}>
              <p className="text-xs sm:text-sm text-[#555] mb-4" style={{ fontWeight: 400 }}>{col.title}</p>
              <div className="space-y-2.5">
                {col.items.map((item, j) => (
                  <div key={j} className="p-3" style={{ background: 'rgba(0,0,0,0.015)' }}>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[11px] text-[#555]">{item.l}</span>
                      {item.p && <span className="text-[8px] text-[#aaa]">{item.p}</span>}
                    </div>
                    <span className="text-[9px] text-[#888]">{item.s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ════════ SECTION 02 ════════ */}
      <Section id="genai" num="02" title="生成式 AI" desc={sections[1].desc} idx={1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: 'rgba(0,0,0,0.05)' }}>
          {sections[1].subs.map((sub, i) => (
            <div key={i} className="p-5 sm:p-6" style={{ background: '#FAF9F6' }}>
              <span className="text-lg sm:text-xl">{sub.icon}</span>
              <p className="text-xs sm:text-sm text-[#555] my-3" style={{ fontWeight: 400 }}>{sub.label}</p>
              <ul className="space-y-1.5">
                {sub.items.map((item, j) => (
                  <li key={j} className="text-[10px] sm:text-xs text-[#888] flex items-center gap-2">
                    <span className="w-0.5 h-0.5 rounded-full" style={{ background: '#aaa' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a href="https://ai-photo-lyart.vercel.app/" target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-6 text-[10px] text-[#888] px-4 py-2"
          style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
          <span>AI 圖片生成器</span>
          <span>→</span>
        </a>
      </Section>

      {/* ════════ SECTION 03 ════════ */}
      <Section id="vibe" num="03" title="Vibe Coding" desc={sections[2].desc} idx={2}>
        <div className="flex flex-col sm:flex-row gap-6" style={{ outline: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex-1 p-5 sm:p-6" style={{ background: '#FAF9F6' }}>
            <p className="text-[11px] sm:text-xs text-[#777] leading-[1.9]">學生無需死記語法，只需以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型。</p>
            <p className="text-[11px] sm:text-xs text-[#777] leading-[1.9] mt-3">專注力從語法解放至邏輯思維，真正實現「想法即程式」的教學理念。</p>
          </div>
          <div className="flex-1 p-5 sm:p-6" style={{ background: 'rgba(46,139,87,0.03)', borderLeft: '1px solid rgba(46,139,87,0.1)' }}>
            <div className="flex items-center gap-2 text-[11px] text-[#2E8B57] mb-4 pb-3" style={{ borderBottom: '1px solid rgba(46,139,87,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2E8B57' }} />
              Vibe Code
            </div>
            <div className="text-[10px] leading-[2] text-[#777]"># 「建立一個校園圖書管理系統」</div>
            <div className="text-[10px] leading-[2] text-[#aaa]">&gt; 正在生成應用程式…</div>
            <div className="text-[10px] leading-[2] text-[#aaa]">&gt; 學生成功在課堂內完成開發。</div>
            <div className="text-[10px] leading-[2] text-[#2E8B57] mt-1">&gt; ✓ 部署完成</div>
          </div>
        </div>
      </Section>

      {/* ════════ SECTION 04 ════════ */}
      <Section id="assistant" num="04" title="AI 輔助學習" desc={sections[3].desc} idx={3}>
        <div className="flex flex-col sm:flex-row gap-6" style={{ outline: '1px solid rgba(0,0,0,0.05)' }}>
          <div className="flex-1 p-5 sm:p-6" style={{ background: '#FAF9F6' }}>
            <p className="text-xs sm:text-sm text-[#555] mb-4" style={{ fontWeight: 400 }}>BAFS 商業大亨</p>
            <p className="text-[11px] sm:text-xs text-[#777] leading-[1.9] mb-5">結合香港中學文憑試「企會財 (BAFS)」學科知識與大富翁玩法的教育型桌遊。</p>
            <div className="grid grid-cols-4 gap-2">
              {[['🏢','企業收購'],['🎲','機遇風險'],['📊','法規改變'],['⚖️','稅務懲罰'],['🤝','收購中心'],['📈','證券交易'],['🏦','銀行中心'],['🔨','打工']].map(([icon, label], i) => (
                <div key={i} className="p-2 text-center" style={{ background: 'rgba(0,0,0,0.015)' }}>
                  <div className="text-sm">{icon}</div>
                  <div className="text-[8px] text-[#888] mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1" style={{ background: '#FAF9F6' }}>
            <img src={gameImages[gameImg]} alt="BAFS" className="w-full h-auto max-h-[40vh] object-contain mx-auto" />
            <div className="flex justify-center gap-2 py-3" style={{ background: '#FAF9F6' }}>
              {gameImages.map((_, i) => (
                <span key={i} className={`rounded-full transition-all cursor-pointer ${i === gameImg ? 'w-4 h-1.5' : 'w-1.5 h-1.5'}`}
                  style={{ background: i === gameImg ? '#555' : '#ddd' }} onClick={() => setGameImg(i)} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-14 px-5 text-center" style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="w-8 h-8 rounded-full bg-[#C41E3A] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-[7px]">SWS</span>
          </div>
          <p className="text-[10px] text-[#aaa]" style={{ letterSpacing: '0.12em' }}>新會商會中學 · 人工智慧教育</p>
        </div>
      </footer>
    </div>
  );
}
