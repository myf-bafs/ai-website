import React, { useState, useEffect, useRef } from 'react';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';
import emblem from '../4emblem.png';

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

const sections = [
  {
    id: 'funding', num: '01', title: '智啟學教', desc: '榮獲政府「智啟學教」50萬港元專項撥款。',
    cols: [
      { title: '採購與工具', items: [{ l: '軟件 / 平台', s: 'AI教育版 · Canva Pro' }, { l: '硬件', s: 'micro:bit · Pi AI' }] },
      { title: '學科推行', items: [{ l: '語文科', s: 'AI寫作 + AI會話' }, { l: '科學/ICT', s: 'Teachable Machine' }] },
      { title: '學生活動', items: [{ l: 'Prompt 創意賽', s: '全校爭霸戰' }] },
    ],
  },
  {
    id: 'genai', num: '02', title: '生成式 AI', desc: '全面引入生成式AI助手。',
    subs: [
      { icon: '✍️', label: '語文寫作', items: ['AI 寫作構思'] },
      { icon: '🔬', label: '科學探究', items: ['Teachable Machine'] },
      { icon: '🎨', label: '藝術創作', items: ['AI 繪圖'] },
    ],
  },
  { id: 'vibe', num: '03', title: 'Vibe Coding', desc: '以自然語言寫程式。' },
  { id: 'assistant', num: '04', title: 'AI 輔助學習', desc: '全天候個性化導師。' },
];

export default function App() {
  const [gameImg, setGameImg] = useState(0);
  const scrollP = useScrollProgress();

  const gameImages = [img3, img4, img5, img6];
  useEffect(() => { const t = setInterval(() => setGameImg(p => (p + 1) % gameImages.length), 3500); return () => clearInterval(t); }, []);

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Noto Serif SC', 'PingFang HK', serif", fontWeight: 300, background: '#EBE7E0' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-5 sm:px-10 py-3" style={{ background: 'rgba(235,231,224,0.93)', backdropFilter: 'blur(8px)' }}>
        <div className="flex items-center gap-3">
          <img src={emblem} alt="校徽" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
          <span className="text-sm text-[#666]" style={{ letterSpacing: '0.08em' }}>新會商會中學</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#888] tracking-[0.15em]">
          <a href="#hero" className="hover:text-[#333] transition-colors">首頁</a>
          {sections.map(s => (
            <a key={s.id} href={'#' + s.id} className="hover:text-[#333] transition-colors">{s.num}</a>
          ))}
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <section id="hero" className="relative w-full overflow-hidden" style={{ height: '100dvh', background: '#C9C0B4' }}>
        {/* Letter content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10"
          style={{ opacity: scrollP }}>
          <h1 className="text-white text-4xl sm:text-6xl font-bold">創新·啟發·未來</h1>
          <p className="mt-4 text-white/60 text-lg">新會商會中學 · 人工智慧教育藍圖</p>
        </div>

        {/* Envelope */}
        <div className="absolute inset-0 z-20 flex items-center justify-center"
          style={{ transform: `translateY(${scrollP * 110}%)` }}>
          <div className="bg-white w-[85%] max-w-xl shadow-2xl flex flex-col items-center justify-center"
            style={{ height: '75%', borderRadius: 4 }}>
            <div className="absolute top-4 left-4 text-left">
              <p className="text-xs text-[#bbb]">寄件人</p>
              <p className="text-sm text-[#666]">新會商會中學</p>
            </div>
            <div className="absolute top-4 right-4 w-10 h-12" style={{ border: '2px solid rgba(196,30,58,0.2)' }}>
              <span className="text-[6px] text-[#C41E3A]">AIR MAIL</span>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs text-[#bbb] mb-3">致</p>
              <div className="w-16 h-16 rounded-full flex items-center justify-center p-2 mb-3" style={{ border: '2px solid #C41E3A' }}>
                <img src={emblem} alt="校徽" className="w-full h-full object-contain" />
              </div>
              <p className="text-sm text-[#444]">全體教職員 · 學生 · 家長</p>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30" style={{ opacity: 1 - scrollP }}>
          <svg width="20" height="28" viewBox="0 0 20 28">
            <rect x="1" y="1" width="18" height="26" rx="9" fill="none" stroke="#999" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="2.5" fill="#999" />
          </svg>
        </div>
      </section>

      {/* Sections shortened for test */}
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className="py-16 px-5 sm:px-12" style={{ background: i % 2 ? '#F5F2EC' : '#FAF9F6' }}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl text-[#1a1a1a] mb-4">{s.title}</h2>
            <p className="text-sm text-[#555]">{s.desc}</p>
          </div>
        </section>
      ))}

      <footer className="py-12 text-center">
        <img src={emblem} alt="校徽" className="w-8 h-8 mx-auto mb-3 opacity-70" />
        <p className="text-xs text-[#999]">新會商會中學</p>
      </footer>
    </div>
  );
}
