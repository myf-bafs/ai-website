import React, { useState, useEffect, useRef } from 'react';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';
import emblem from '../4emblem.png';

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
  { id: 'funding', num: '01', title: '智啟學教', desc: '榮獲政府「智啟學教」50萬港元專項撥款。' },
  { id: 'genai', num: '02', title: '生成式 AI', desc: '全面引入生成式AI助手。' },
  { id: 'vibe', num: '03', title: 'Vibe Coding', desc: '以自然語言寫程式。' },
  { id: 'assistant', num: '04', title: 'AI 輔助學習', desc: '全天候個性化導師。' },
];

export default function App() {
  const scrollP = useScrollProgress();

  return (
    <div style={{ fontFamily: "'Noto Serif SC', 'PingFang HK', serif", fontWeight: 300, background: '#EBE7E0' }}>
      {/* Nav */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3" style={{ background: 'rgba(235,231,224,0.95)' }}>
        <div className="flex items-center gap-2">
          <img src={emblem} alt="校徽" className="w-8 h-8 object-contain" />
          <span className="text-sm text-[#666]">新會商會中學</span>
        </div>
      </div>

      {/* ════════ HERO ════════ */}
      <div id="hero" className="relative overflow-hidden" style={{ height: '100vh', background: '#C9C0B4' }}>
        {/* Letter content slide up */}
        <div className="absolute inset-0 z-10 flex items-center justify-center"
          style={{ opacity: scrollP, transform: `translateY(${(1-scrollP)*40}px)` }}>
          <div className="text-center text-white">
            <h1 className="text-4xl sm:text-6xl font-bold">創新·啟發·未來</h1>
            <p className="mt-4 text-white/60">新會商會中學 · 人工智慧教育藍圖</p>
          </div>
        </div>

        {/* Envelope slide down */}
        <div className="absolute z-20" style={{
          top: '5%', bottom: '5%', left: '5%', right: '5%',
          maxWidth: 500, maxHeight: 700, margin: 'auto',
          transform: `translateY(${scrollP * 100}%)`,
          background: 'white',
          borderRadius: 4,
          boxShadow: '0 20px 80px rgba(0,0,0,0.25)',
        }}>
          {/* Flap */}
          <svg className="absolute top-0 left-0 right-0 w-full" viewBox="0 0 200 24" preserveAspectRatio="none" style={{ height: 24 }}>
            <path d="M0,0 L200,0 L200,2 L106,21 L100,24 L94,21 L0,2 Z" fill="#f5f4f0" stroke="#ddd" strokeWidth="0.5" />
          </svg>
          {/* Return address */}
          <div className="absolute" style={{ top: 28, left: 24 }}>
            <p className="text-[10px] text-[#bbb]" style={{ letterSpacing: '0.15em' }}>寄件人</p>
            <p className="text-sm text-[#666]">新會商會中學</p>
            <p className="text-xs text-[#888]">葵涌葵盛圍</p>
          </div>
          {/* Stamp */}
          <div className="absolute" style={{ top: 24, right: 24, width: 48, height: 56, border: '2px solid rgba(196,30,58,0.2)' }}>
            <span className="block text-center text-[7px] text-[#C41E3A] mt-1" style={{ letterSpacing: '0.1em' }}>AIR MAIL</span>
          </div>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <p className="text-xs text-[#bbb] mb-4" style={{ letterSpacing: '0.15em' }}>致</p>
            <div className="w-20 h-20 rounded-full flex items-center justify-center p-3 mb-3" style={{ border: '2px solid #C41E3A' }}>
              <img src={emblem} alt="校徽" className="w-full h-full object-contain" />
            </div>
            <p className="text-base text-[#444]" style={{ letterSpacing: '0.15em' }}>全體教職員 · 學生 · 家長</p>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-6 left-1/2 z-30" style={{ opacity: 1-scrollP, transform: 'translateX(-50%)' }}>
          <svg width="20" height="28" viewBox="0 0 20 28">
            <rect x="1" y="1" width="18" height="26" rx="9" fill="none" stroke="#aaa" strokeWidth="1.5" />
            <circle cx="10" cy="8" r="2.5" fill="#aaa" />
          </svg>
        </div>
      </div>

      {/* Content sections */}
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} style={{ padding: '60px 24px', background: i % 2 ? '#F5F2EC' : '#FAF9F6' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 className="text-2xl sm:text-3xl text-[#1a1a1a]" style={{ fontWeight: 300 }}>{s.title}</h2>
            <p className="text-sm text-[#555] mt-3">{s.desc}</p>
          </div>
        </section>
      ))}

      <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid #ddd' }}>
        <img src={emblem} alt="校徽" className="w-8 h-8 object-contain mx-auto mb-2" />
        <p className="text-xs text-[#999]">新會商會中學</p>
      </footer>
    </div>
  );
}
