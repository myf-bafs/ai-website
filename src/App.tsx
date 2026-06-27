import React, { useState, useEffect } from 'react';
import bgImage from '../2.png';
import img3 from '../3.png';
import img4 from '../4.png';
import img5 from '../5.png';
import img6 from '../6.png';
import emblem from '../4emblem.png';

function useInView(t = 0.12) {
  const [ref, setRef] = useState(null);
  const [v, s] = useState(false);
  useEffect(() => {
    if (!ref) return;
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { s(true); o.unobserve(ref); } }, { threshold: t });
    o.observe(ref);
    return () => o.disconnect();
  }, [ref, t]);
  return [el => setRef(el), v];
}

const Style = () => (
  <style>{`
    @keyframes charReveal {
      0% { opacity: 0; transform: scale(0.1); }
      100% { opacity: 1; transform: scale(1); }
    }
    .char-type { display: inline-block; animation: charReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
  `}</style>
);

function Section({ id, num, title, desc, children, idx }) {
  const [ref, inView] = useInView(0.08);
  return (
    <section ref={ref} id={id} style={{ padding: '80px 24px', background: idx % 2 ? '#F5F2EC' : '#FAF9F6', opacity: inView ? 1 : 0, transform: inView ? 'translateY(0)' : 'translateY(24px)', transition: 'opacity 0.7s, transform 0.7s' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs text-[#999]" style={{ letterSpacing: '0.3em' }}>{num}</span>
          <div style={{ width: 32, height: 1, background: '#ccc' }} />
          <h2 className="text-2xl sm:text-3xl text-[#1a1a1a]" style={{ fontWeight: 300 }}>{title}</h2>
        </div>
        <p className="text-sm sm:text-base text-[#555] max-w-2xl leading-[2] mb-10">{desc}</p>
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
    id: 'genai', num: '02', title: '生成式 AI', desc: '在語文寫作、科學探究及藝術創作中全面引入生成式AI助手。',
    subs: [
      { icon: '✍️', label: '語文寫作', items: ['AI 寫作構思', 'AI 會話夥伴', '文章潤飾'] },
      { icon: '🔬', label: '科學探究', items: ['Teachable Machine', '數據分析', '實驗模擬'] },
      { icon: '🎨', label: '藝術創作', items: ['AI 繪圖倫理', '風格轉換', '多媒體設計'] },
    ],
  },
  { id: 'vibe', num: '03', title: 'Vibe Coding', desc: '引進前沿Vibe Coding模式，學生無需死記語法，以口頭邏輯描述指揮AI撰寫網頁。' },
  { id: 'assistant', num: '04', title: 'AI 輔助學習', desc: '全天候在線課業輔助學習系統，針對每位學生的作答與弱點進行溫和、漸進式拆解引導。' },
];

export default function App() {
  const [opened, setOpened] = useState(false);
  const [gameImg, setGameImg] = useState(0);
  const [step, setStep] = useState(0);
  const typingText = '創新·啟發·未來';

  useEffect(() => {
    if (!opened) return;
    const t = setInterval(() => setStep(s => Math.min(s + 1, typingText.length + 3)), 350);
    return () => clearInterval(t);
  }, [opened]);

  const gameImages = [img3, img4, img5, img6];
  useEffect(() => { const t = setInterval(() => setGameImg(p => (p + 1) % gameImages.length), 3500); return () => clearInterval(t); }, []);

  return (
    <div style={{ fontFamily: "'Noto Serif SC', 'PingFang HK', serif", fontWeight: 300, background: '#EBE7E0' }}>
      <Style />

      {/* Nav - hidden initially, shows after opening */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 py-3"
        style={{ background: 'rgba(235,231,224,0.93)', backdropFilter: 'blur(8px)', opacity: opened ? 1 : 0, pointerEvents: opened ? 'auto' : 'none', transition: 'opacity 0.6s', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3">
          <img src={emblem} alt="校徽" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
          <span className="text-sm text-[#666]" style={{ letterSpacing: '0.1em' }}>新會商會中學</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#888]" style={{ letterSpacing: '0.12em' }}>
          <a href="#hero" className="hover:text-[#C41E3A] transition-colors" onClick={() => setOpened(false)}>首頁</a>
          {sections.map(s => (
            <a key={s.id} href={'#' + s.id} className="hover:text-[#C41E3A] transition-colors" onClick={() => setOpened(true)}>{s.num} {s.title}</a>
          ))}
        </div>
      </nav>

      {/* ════════ HERO ════════ */}
      <div id="hero" className="relative overflow-hidden" style={{ height: '100vh', background: '#C9C0B4', cursor: opened ? 'default' : 'pointer' }} onClick={() => !opened && setOpened(true)}>
        {/* Subtle radial glow */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 55%, rgba(255,255,255,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
        {/* Background image */}
        <div className="absolute inset-0 bg-center bg-cover bg-no-repeat" style={{ backgroundImage: `url(${bgImage})`, opacity: 0.08, filter: 'grayscale(1) contrast(0.8) brightness(1.2)', pointerEvents: 'none' }} />
        {/* Letter content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center" style={{ opacity: opened ? 1 : 0, transition: 'opacity 0.8s ease 0.3s' }}>
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-full bg-[#C41E3A] flex items-center justify-center mx-auto mb-4 shadow-md">
              <span className="text-white text-xs" style={{ letterSpacing: '0.1em' }}>AI</span>
            </div>
            <h1 className="text-white" style={{ fontWeight: 300 }}>
              <span className="block text-[2.8rem] sm:text-[4.5rem] md:text-[6rem] leading-none">
                {typingText.split('').map((ch, i) => (
                  <span key={i} className="char-type" style={{ animationDelay: `${i * 0.12}s`, opacity: step > i ? 1 : 0 }}>{ch}</span>
                ))}
              </span>
            </h1>
            <p className="mt-4 text-sm sm:text-lg text-white/60" style={{ letterSpacing: '0.2em' }}>新會商會中學 · 人工智慧教育藍圖</p>
          </div>
        </div>

        {/* Envelope */}
        <div className="absolute z-20" style={{
          top: opened ? '-100%' : '6%', bottom: opened ? 'auto' : '6%', left: '6%', right: '6%',
          maxWidth: 520, maxHeight: opened ? 0 : 680, margin: 'auto',
          borderRadius: 4,
          transition: 'top 0.7s cubic-bezier(0.4,0,0.2,1), max-height 0.7s cubic-bezier(0.4,0,0.2,1), box-shadow 0.7s',
          overflow: 'hidden',
        }}>
          {/* Envelope paper with elegant border */}
          <div className="absolute inset-0 bg-white" style={{ borderRadius: 4, boxShadow: opened ? 'none' : '0 12px 60px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e5e0d8' }} />
          {/* Inner decorative frame */}
          <div className="absolute inset-0" style={{ margin: 12, border: '1px solid rgba(196,30,58,0.12)', borderRadius: 2, pointerEvents: 'none' }} />

          {/* Flap */}
          <svg className="absolute top-0 left-0 right-0 w-full z-10" viewBox="0 0 200 28" preserveAspectRatio="none" style={{ height: 28 }}>
            <defs>
              <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f8f7f4" /><stop offset="100%" stopColor="#f0ede8" /></linearGradient>
            </defs>
            <path d="M0,0 L200,0 L200,3 L106,24 L100,28 L94,24 L0,3 Z" fill="url(#flapGrad)" stroke="#ddd" strokeWidth="0.5" />
            {/* Flap shadow line */}
            <path d="M0,3 L94,24 L100,28 L106,24 L200,3" fill="none" stroke="rgba(0,0,0,0.04)" strokeWidth="1.5" />
          </svg>

          {/* Decorative top stripe */}
          <div className="absolute" style={{ top: 34, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,30,58,0.15), transparent)' }} />

          {/* Return address */}
          <div className="absolute" style={{ top: 40, left: 28 }}>
            <p className="text-[9px] text-[#bbb]" style={{ letterSpacing: '0.2em' }}>寄件人</p>
            <p className="text-sm text-[#555]" style={{ fontWeight: 400, letterSpacing: '0.08em' }}>新會商會中學</p>
            <p className="text-xs text-[#999]" style={{ letterSpacing: '0.05em' }}>屯門良景村 · SWCSSS</p>
          </div>

          {/* Stamp */}
          <div className="absolute flex flex-col items-center justify-center" style={{ top: 38, right: 28, width: 50, height: 60, border: '2px solid rgba(196,30,58,0.18)', background: '#fcfaf8' }}>
            <span className="text-[6px] text-[#C41E3A] font-bold" style={{ letterSpacing: '0.12em' }}>AIR MAIL</span>
            <div className="w-5 h-5 mt-1 rounded-full flex items-center justify-center" style={{ border: '1px solid rgba(196,30,58,0.12)' }}>
              <span className="text-[5px] text-[#C41E3A]" style={{ letterSpacing: '0.05em' }}>$3.7</span>
            </div>
          </div>

          {/* Center: emblem */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6" style={{ marginTop: 8 }}>
            <p className="text-xs text-[#ccc] mb-5" style={{ letterSpacing: '0.25em', fontWeight: 300 }}>致</p>
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center p-4 mb-4" style={{ border: '2px solid #C41E3A', background: '#fcfaf8', boxShadow: '0 2px 12px rgba(196,30,58,0.08)' }}>
              <img src={emblem} alt="校徽" className="w-full h-full object-contain" />
            </div>
            <p className="text-lg sm:text-xl text-[#444]" style={{ fontWeight: 400, letterSpacing: '0.25em' }}>全體教職員 · 學生 · 家長</p>
            <div style={{ width: 100, height: 1, background: 'linear-gradient(90deg, transparent, #ddd, transparent)', margin: '14px auto' }} />
            <p className="text-xs text-[#aaa]" style={{ letterSpacing: '0.15em' }}>香港屯門良景村 新會商會中學</p>
          </div>
        </div>

        {/* Click hint */}
        <div className="absolute bottom-10 left-1/2 z-30 flex flex-col items-center gap-2" style={{ opacity: opened ? 0 : 1, transition: 'opacity 0.4s', transform: 'translateX(-50%)' }}>
          <span className="text-sm text-[#aaa]" style={{ letterSpacing: '0.2em' }}>點擊打開信封</span>
          <svg width="22" height="30" viewBox="0 0 22 30">
            <rect x="1.5" y="1.5" width="19" height="27" rx="10" fill="none" stroke="#aaa" strokeWidth="1.5" />
            <circle cx="11" cy="8" r="3" fill="#aaa" />
          </svg>
        </div>
      </div>

      {/* Content sections */}
      <Section id="funding" num="01" title="智啟學教" desc={sections[0].desc} idx={0}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#d5d0c8' }}>
          {sections[0].cols.map((col, i) => (
            <div key={i} className="p-6 sm:p-8 bg-white">
              <p className="text-base sm:text-lg text-[#333] mb-5" style={{ fontWeight: 400 }}>{col.title}</p>
              <div className="space-y-3">
                {col.items.map((item, j) => (
                  <div key={j} className="p-4 bg-[#F8F6F2]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm sm:text-base text-[#444]">{item.l}</span>
                      {item.p && <span className="text-xs text-[#aaa]">{item.p}</span>}
                    </div>
                    <span className="text-xs sm:text-sm text-[#888]">{item.s}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="genai" num="02" title="生成式 AI" desc={sections[1].desc} idx={1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: '#d5d0c8' }}>
          {sections[1].subs.map((sub, i) => (
            <div key={i} className="p-6 sm:p-8 bg-white">
              <span className="text-xl sm:text-2xl">{sub.icon}</span>
              <p className="text-sm sm:text-base text-[#333] my-4" style={{ fontWeight: 400 }}>{sub.label}</p>
              <ul className="space-y-2">
                {sub.items.map((item, j) => (
                  <li key={j} className="text-xs sm:text-sm text-[#666] flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#ccc]" />{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <a href="https://ai-photo-lyart.vercel.app/" target="_blank" className="block mt-8 group" style={{ outline: '1px solid #d5d0c8' }}>
          <img src="/ai-photo-shot.png" alt="AI 圖片生成器" className="w-full h-auto transition-opacity duration-500 group-hover:opacity-80" />
          <div className="py-3 text-center text-sm text-[#888] bg-white" style={{ borderTop: '1px solid #eee' }}>AI 圖片生成器 →</div>
        </a>
      </Section>

      <Section id="vibe" num="03" title="Vibe Coding" desc={sections[2].desc} idx={2}>
        <div className="flex flex-col sm:flex-row" style={{ outline: '1px solid #d5d0c8' }}>
          <div className="flex-1 p-6 sm:p-8 bg-white">
            <p className="text-sm sm:text-base text-[#555] leading-[2]">學生無需死記語法，只需以口頭邏輯描述指揮AI撰寫網頁、遊戲與數據分析模型。</p>
            <p className="text-sm sm:text-base text-[#555] leading-[2] mt-4">專注力從語法解放至邏輯思維，真正實現「想法即程式」的教學理念。</p>
          </div>
          <div className="flex-1 p-6 sm:p-8" style={{ background: '#F8F6F2', borderLeft: '1px solid #d5d0c8' }}>
            <div className="flex items-center gap-2 text-sm text-[#2E8B57] mb-4 pb-3" style={{ borderBottom: '1px solid rgba(46,139,87,0.15)' }}>
              <span className="w-2 h-2 rounded-full bg-[#2E8B57]" />Vibe Code
            </div>
            <div className="text-sm leading-[2.2] text-[#666]"># 「建立一個校園圖書管理系統」</div>
            <div className="text-sm leading-[2.2] text-[#999]">&gt; 正在生成應用程式…</div>
            <div className="text-sm leading-[2.2] text-[#999]">&gt; 學生成功在課堂內完成開發。</div>
            <div className="text-sm leading-[2.2] text-[#2E8B57] mt-1">&gt; ✓ 部署完成</div>
          </div>
        </div>
      </Section>

      <Section id="assistant" num="04" title="AI 輔助學習" desc={sections[3].desc} idx={3}>
        <div className="flex flex-col sm:flex-row" style={{ outline: '1px solid #d5d0c8' }}>
          <div className="flex-1 p-6 sm:p-8 bg-white">
            <p className="text-sm sm:text-base text-[#333] mb-4" style={{ fontWeight: 400 }}>BAFS 商業大亨</p>
            <p className="text-sm sm:text-base text-[#555] leading-[2] mb-5">結合香港中學文憑試「企會財 (BAFS)」學科知識與大富翁玩法的教育型桌遊。</p>
            <div className="grid grid-cols-4 gap-2">
              {[['🏢','企業收購'],['🎲','機遇風險'],['📊','法規改變'],['⚖️','稅務懲罰'],['🤝','收購中心'],['📈','證券交易'],['🏦','銀行中心'],['🔨','打工']].map(([icon, label], i) => (
                <div key={i} className="p-2 text-center bg-[#F8F6F2]"><div className="text-lg">{icon}</div><div className="text-[10px] text-[#666] mt-0.5">{label}</div></div>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white" style={{ borderLeft: '1px solid #d5d0c8' }}>
            <img src={gameImages[gameImg]} alt="BAFS" className="w-full h-auto max-h-[40vh] object-contain mx-auto" />
            <div className="flex justify-center gap-2 py-3 bg-white" style={{ borderTop: '1px solid #eee' }}>
              {gameImages.map((_, i) => (
                <span key={i} className={`rounded-full transition-all cursor-pointer ${i === gameImg ? 'bg-[#555] w-5 h-2' : 'bg-[#ddd] w-2 h-2'}`} onClick={() => setGameImg(i)} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      <footer className="py-14 px-5 text-center" style={{ borderTop: '1px solid #d5d0c8' }}>
        <img src={emblem} alt="校徽" className="w-10 h-10 object-contain mx-auto mb-3 opacity-70" />
        <p className="text-sm text-[#999]" style={{ letterSpacing: '0.12em' }}>新會商會中學 · 人工智慧教育</p>
      </footer>
    </div>
  );
}
