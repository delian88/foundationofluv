import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, ArrowRight, Sparkles, MoveRight, ChevronLeft, Calendar, Award, 
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Image as LucideImage,
  ArrowLeft, Heart
} from 'lucide-react';
import { 
  NAVIGATION, SERVICE_AREAS, STRATEGIC_PHASES, STATS, PARTNERS, COLORS, HERO_IMAGES, GALLERY_IMAGES
} from './constants';

// --- Components ---

const Logo = ({ className, style, alt }: { className?: string; style?: React.CSSProperties; alt?: string }) => {
  const [error, setError] = useState(false);
  
  const inlineSvg = (
    <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <defs>
        <path id="topTextArc" d="M 50, 250 A 200,200 0 0,1 450,250" />
        <path id="bottomTextArc" d="M 75, 250 A 175,175 0 0,0 425,250" />
        <clipPath id="globeClip">
          <circle cx="250" cy="185" r="75" />
        </clipPath>
      </defs>
      <circle cx="250" cy="250" r="248" fill="#e2a744" />
      <circle cx="250" cy="250" r="242" fill="#ffffff" />
      <circle cx="250" cy="250" r="236" fill="#332d2b" />
      <path d="M 14,250 A 236,236 0 0,1 486,250 L 250,250 Z" fill="#f2e9e4" />
      <circle cx="250" cy="250" r="172" stroke="#332d2b" strokeWidth="6" fill="none" />
      <circle cx="250" cy="250" r="168" fill="#df8c3d" />
      <circle cx="250" cy="185" r="75" fill="#0d2440" />
      <g clipPath="url(#globeClip)">
        <path d="M210,165 Q225,145 245,165 T275,175 T300,160 T315,185 T285,215 T240,210 T205,190 Z" fill="#df8c3d" />
        <path d="M255,130 Q275,140 270,160 T295,170 T310,150 Z" fill="#df8c3d" />
      </g>
      <g fill="#e2a744" opacity="0.9">
        <path d="M190,220 Q185,250 200,300 Q215,330 245,355 L250,350 Q220,320 210,280 T205,220 Z" />
        <ellipse cx="188" cy="230" rx="6" ry="11" transform="rotate(-30 188 230)" />
        <ellipse cx="192" cy="260" rx="6" ry="11" transform="rotate(-25 192 260)" />
        <ellipse cx="202" cy="290" rx="6" ry="11" transform="rotate(-20 202 290)" />
        <ellipse cx="218" cy="320" rx="6" ry="11" transform="rotate(-15 218 320)" />
        <path d="M310,220 Q315,250 300,300 Q285,330 255,355 L250,350 Q280,320 290,280 T295,220 Z" />
        <ellipse cx="312" cy="230" rx="6" ry="11" transform="rotate(30 312 230)" />
        <ellipse cx="308" cy="260" rx="6" ry="11" transform="rotate(25 308 260)" />
        <ellipse cx="298" cy="290" rx="6" ry="11" transform="rotate(20 298 290)" />
        <ellipse cx="282" cy="320" rx="6" ry="11" transform="rotate(15 282 320)" />
      </g>
      <path d="M250,235 C210,185 140,210 140,295 C140,370 250,455 250,455 C250,455 360,370 360,295 C360,210 290,185 250,235 Z" fill="#9c1c22" />
      <g fill="#e2a744">
        <path d="M85,250 l9,-12 15,2 -11,11 4,16 -17,-10 -17,10 4,-16 -11,-11 15,-2 z" />
        <path d="M415,250 l9,-12 15,2 -11,11 4,16 -17,-10 -17,10 4,-16 -11,-11 15,-2 z" />
      </g>
      <text fontFamily="Cinzel, serif" fontWeight="900" fontSize="34" fill="#332d2b" letterSpacing="4">
        <textPath href="#topTextArc" startOffset="50%" textAnchor="middle">FOUNDATION OF LUV</textPath>
      </text>
      <text fontFamily="Cinzel, serif" fontWeight="700" fontSize="20" fill="#ffffff" letterSpacing="2">
        <textPath href="#bottomTextArc" startOffset="50%" textAnchor="middle">LOVE IN ACTION CHANGE IN MOTION</textPath>
      </text>
    </svg>
  );

  if (error) return inlineSvg;
  return <img src="logo.svg" alt={alt || "Foundation of Luv"} className={className} style={style} onError={() => setError(true)} />;
};

const FireworkBurst = ({ x, y, color }: { x: number; y: number; color: string }) => {
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ 
            x: Math.cos((i * 30) * (Math.PI / 180)) * 150, 
            y: Math.sin((i * 30) * (Math.PI / 180)) * 150, 
            opacity: 0, 
            scale: [0, 1, 0.5] 
          }}
          transition={{ duration: 2.5, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

const FireworksBackground = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  
  const spawnBurst = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 100; 
    const y = Math.random() * 100;
    const colorValues = Object.values(COLORS);
    const color = colorValues[Math.floor(Math.random() * colorValues.length)] as string;
    setBursts(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 2500);
  }, []);
  
  useEffect(() => {
    const interval = setInterval(() => { spawnBurst(); }, 1200);
    return () => clearInterval(interval);
  }, [spawnBurst]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      <AnimatePresence>
        {bursts.map(burst => <FireworkBurst key={burst.id} {...burst} />)}
      </AnimatePresence>
    </div>
  );
};

const AnimatedNumber = ({ value }: { value: string }) => {
  const numericValue = parseFloat(value);
  const decimals = value.includes('.') ? value.split('.')[1].length : 0;
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  useEffect(() => { 
    if (isInView) animate(count, numericValue, { duration: 2.5, ease: [0.32, 1, 0.2, 1] }); 
  }, [isInView, numericValue, count]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

// --- Page Views ---

const GalleryView = () => (
  <section className="py-20 md:py-40 bg-white min-h-screen pt-40">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-24">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-6 block">Visual Stories</span>
        <h2 className="text-4xl md:text-7xl font-serif font-black text-[#332d2b] leading-tight">Our <span className="italic font-normal text-[#e2a744]">Gallery.</span></h2>
        <div className="h-1 w-24 bg-[#e2a744] mx-auto mt-8 rounded-full" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group relative aspect-square overflow-hidden rounded-[2rem] shadow-xl"
          >
            <img src={img.url} alt={img.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
              <div>
                <LucideImage className="text-[#e2a744] mb-3" />
                <h4 className="text-white font-cinzel font-bold text-xl uppercase tracking-widest">{img.title}</h4>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const RoadmapView = ({ activeRoadmap, setActiveRoadmap }: { activeRoadmap: number, setActiveRoadmap: (i: number) => void }) => (
  <section className="py-24 md:py-40 bg-[#332d2b] text-[#fdfaf6] min-h-screen pt-40 overflow-hidden relative">
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-8 block">Projected Trajectory</span>
        <h2 className="text-4xl md:text-[6.5rem] font-serif font-black leading-tight">Visionary <br /><span className="italic font-normal text-[#9c1c22]">Benchmarks.</span></h2>
      </div>
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4 flex flex-col gap-6">
          {STRATEGIC_PHASES.map((phase, i) => (
            <button 
              key={i} 
              onClick={() => setActiveRoadmap(i)} 
              className={`text-left p-10 rounded-[2.5rem] transition-all border-2 flex items-center justify-between relative overflow-hidden ${activeRoadmap === i ? 'bg-[#fdfaf6] text-[#332d2b] border-[#fdfaf6] shadow-2xl' : 'bg-transparent text-[#fdfaf6]/50 border-[#fdfaf6]/5 hover:border-[#fdfaf6]/20'}`}
            >
              <div className="relative z-10">
                <div className={`text-[11px] font-cinzel font-black uppercase tracking-widest mb-2 ${activeRoadmap === i ? 'text-[#9c1c22]' : 'text-[#e2a744]'}`}>{phase.years}</div>
                <div className="text-2xl font-serif font-black tracking-tight">{phase.title}</div>
              </div>
              <ChevronRight className={`relative z-10 transition-all ${activeRoadmap === i ? 'rotate-90 text-[#9c1c22]' : ''}`} />
            </button>
          ))}
        </div>
        <motion.div key={activeRoadmap} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-8 bg-[#fdfaf6]/[0.05] backdrop-blur-3xl rounded-[4rem] p-12 md:p-20 border border-[#fdfaf6]/10 shadow-2xl">
          <div className="grid md:grid-cols-2 gap-20">
            <div>
              <h4 className="text-[#e2a744] font-cinzel font-black uppercase tracking-[0.3em] text-[10px] mb-12">Core Objectives</h4>
              <div className="space-y-10">
                {STRATEGIC_PHASES[activeRoadmap].goals.map((goal, idx) => (
                  <div key={idx} className="flex gap-7 items-start">
                    <div className="w-2 h-2 bg-[#9c1c22] rounded-full mt-2" />
                    <p className="text-xl text-[#fdfaf6]/80 font-serif italic">{goal}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#fdfaf6] text-[#332d2b] rounded-[3.5rem] p-14 shadow-2xl">
              <h4 className="text-[#9c1c22] font-cinzel font-black uppercase tracking-[0.3em] text-[10px] mb-12">Target Outputs</h4>
              <div className="space-y-12">
                {STRATEGIC_PHASES[activeRoadmap].outputs.map((output, idx) => (
                  <div key={idx} className="flex gap-8 items-center">
                    <div className="text-7xl font-serif font-black italic text-[#9c1c22]/10">{idx + 1}</div>
                    <p className="text-2xl font-serif font-black leading-tight">{output}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
);

const AboutView = () => (
  <section className="py-20 md:py-40 bg-[#f9f5f0] min-h-screen pt-40">
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid lg:grid-cols-12 gap-24 items-center">
        <div className="lg:col-span-5">
           <div className="bg-white p-4 rounded-[3rem] shadow-2xl overflow-hidden group relative">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="History" className="w-full aspect-[3/4] object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
              <div className="absolute top-10 left-10 w-24 h-24 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-[#e2a744]">
                <Calendar size={20} className="text-[#9c1c22] mb-1" />
                <span className="text-[10px] font-cinzel font-black text-[#332d2b]">EST.</span>
                <span className="text-lg font-serif font-black text-[#9c1c22]">2016</span>
              </div>
            </div>
        </div>
        <div className="lg:col-span-7">
          <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#9c1c22]/5 text-[#9c1c22] text-[10px] font-cinzel font-black tracking-[0.3em] mb-8 border border-[#9c1c22]/10 uppercase">
            <Award size={14} /> THE FOUNDATION LEGACY
          </span>
          <h2 className="text-4xl md:text-7xl font-serif font-black text-[#332d2b] leading-tight mb-12">ABOUT US (FOL)</h2>
          <div className="space-y-8">
            <p className="text-xl md:text-2xl text-[#332d2b]/80 font-serif leading-relaxed">
              Foundation of Love (FOL) was created in 2016 with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities. Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides, empower the vulnerable, and create lasting pathways to opportunity. Since inception, the foundation has touched lives across diverse demographics through outreach, capacity-building, mentorship, and community-centered initiatives.
            </p>
            <div className="h-0.5 w-24 bg-gradient-to-r from-[#e2a744] to-transparent" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const ServicesView = () => (
  <section className="py-20 md:py-40 bg-[#fdfaf6]/50 min-h-screen pt-40">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-6 block">Foundational Pillars</span>
        <h2 className="text-3xl md:text-[5.5rem] font-serif font-black text-[#332d2b] leading-tight">Strategic Impact <br /><span className="italic font-normal text-[#9c1c22]">Channels.</span></h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {SERVICE_AREAS.map((service, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-14 rounded-[2rem] border border-[#332d2b]/10 hover:shadow-2xl transition-all duration-700">
            <div className="w-20 h-20 bg-[#fdfaf6] text-[#9c1c22] rounded-2xl flex items-center justify-center mb-8 border border-[#332d2b]/5">
              {service.icon}
            </div>
            <h4 className="text-xl md:text-3xl font-serif font-black text-[#332d2b] mb-4">{service.title}</h4>
            <p className="text-[#332d2b]/60 text-lg leading-relaxed font-serif italic">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const LuvwattsView = () => (
  <section className="py-20 md:py-40 bg-[#332d2b] text-white min-h-screen pt-40">
    <div className="max-w-7xl mx-auto px-4 text-center">
      <div className="mb-24">
        <Sparkles size={48} className="text-[#e2a744] mx-auto mb-8" />
        <h2 className="text-5xl md:text-8xl font-serif font-black mb-8">LUVWATTS <span className="italic font-normal text-[#9c1c22]">Movement.</span></h2>
        <p className="text-xl md:text-3xl text-white/70 max-w-3xl mx-auto font-serif italic">The energetic frequency of restored human dignity.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10">
          <Heart size={40} className="text-[#9c1c22] mb-6" />
          <h3 className="text-3xl font-serif font-bold mb-4">Mission Kinetic</h3>
          <p className="text-lg text-white/60">Driving restorative change through the power of love and active humanitarian outreach.</p>
        </div>
        <div className="p-12 bg-white/5 rounded-[3rem] border border-white/10">
          <Globe size={40} className="text-[#e2a744] mb-6" />
          <h3 className="text-3xl font-serif font-bold mb-4">Global Frequency</h3>
          <p className="text-lg text-white/60">Bridging divides across continents to ensure every human life is valued equally.</p>
        </div>
      </div>
    </div>
  </section>
);

const ProgramsView = () => (
  <section className="py-20 md:py-40 bg-[#fdfaf6] min-h-screen pt-40">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-24 text-center">
        <h2 className="text-5xl md:text-7xl font-serif font-black text-[#332d2b] mb-8">Active <span className="italic font-normal text-[#9c1c22]">Programs.</span></h2>
        <div className="h-1 w-24 bg-[#9c1c22] mx-auto rounded-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-10">
        {STATS.map((stat, i) => (
          <div key={i} className="p-10 bg-white rounded-[2rem] border border-[#332d2b]/10 shadow-lg">
            <h4 className="text-2xl font-cinzel font-black text-[#9c1c22] mb-4 uppercase tracking-widest">{stat.label}</h4>
            <p className="text-lg text-[#332d2b]/70 font-serif italic">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// --- Main App ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'gallery': return <GalleryView />;
      case 'roadmap': return <RoadmapView activeRoadmap={activeRoadmap} setActiveRoadmap={setActiveRoadmap} />;
      case 'aboutus': return <AboutView />;
      case 'globalservices': return <ServicesView />;
      case 'luvwatts': return <LuvwattsView />;
      case 'programs': return <ProgramsView />;
      default: return (
        <>
          <header className="relative w-full pt-32 pb-16 md:pt-64 md:pb-32 lg:pt-80 lg:pb-48 overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center relative z-10">
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative group p-0 md:p-12 w-full max-w-[900px]">
                <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] md:rounded-[5rem] overflow-hidden border-[8px] md:border-[32px] border-white shadow-2xl">
                  <AnimatePresence mode="wait">
                    <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
                      <img src={HERO_IMAGES[currentSlide].url} alt={HERO_IMAGES[currentSlide].caption} className="w-full h-full object-cover brightness-75" />
                      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 bg-gradient-to-t from-black/80 to-transparent text-left">
                        <span className="text-[#e2a744] font-cinzel font-black tracking-[0.4em] text-[10px] uppercase">Movement Chapter</span>
                        <h3 className="text-white text-lg md:text-5xl font-serif italic font-bold">{HERO_IMAGES[currentSlide].caption}</h3>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="absolute inset-0 flex items-center justify-between px-4 z-30">
                    <button onClick={prevSlide} className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center"><ChevronLeft size={24} /></button>
                    <button onClick={nextSlide} className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center"><ChevronRight size={24} /></button>
                  </div>
                </div>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-6 -right-6 md:-top-16 md:-right-16 w-20 h-20 md:w-56 md:h-56 z-40"><Logo className="w-full h-full drop-shadow-xl" /></motion.div>
              </motion.div>
              <div className="mt-12">
                <h1 className="hero-text text-4xl md:text-[8.5rem] font-serif font-black leading-tight text-shine-crimson">Love in Action,<br /><span className="italic font-normal text-shine">Change in Motion.</span></h1>
                <p className="mobile-p text-lg md:text-4xl text-[#332d2b]/70 mt-8 max-w-4xl mx-auto font-serif italic">"We are the kinetic pulse of restoration, engineering pathways where human dignity is an unshakeable reality."</p>
                <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
                  <button className="px-12 py-6 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-xl shadow-xl flex items-center gap-3">Join the Movement <MoveRight /></button>
                  <button onClick={() => navigateTo('aboutus')} className="px-12 py-6 glass-card rounded-full font-cinzel font-bold text-xl border border-[#9c1c22]/15 flex items-center justify-center gap-3">Explore Our Story <ArrowRight /></button>
                </div>
              </div>
            </div>
          </header>

          <section className="py-12 md:py-24 bg-white border-y border-[#332d2b]/5 overflow-hidden relative z-10">
            <p className="text-center font-cinzel font-black text-[12px] text-[#332d2b]/40 tracking-[0.5em] uppercase mb-12">Partners and Clients</p>
            <motion.div className="flex whitespace-nowrap gap-12 md:gap-32" animate={{ x: ["0%", "-50%"] }} transition={{ repeat: Infinity, duration: 30, ease: "linear" }}>
              {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                <span key={i} className="font-cinzel font-bold text-2xl md:text-4xl text-[#332d2b] opacity-40 grayscale hover:grayscale-0 transition-all">{partner}</span>
              ))}
            </motion.div>
          </section>

          <section className="py-20 md:py-40 bg-[#fdfaf6] relative z-10">
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-16">
              {STATS.map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                  <div className="text-5xl md:text-8xl font-serif font-black text-[#9c1c22] mb-4"><AnimatedNumber value={stat.value} /><span className="text-[#e2a744]">{stat.suffix}</span></div>
                  <h4 className="font-cinzel font-black text-[12px] tracking-[0.3em] uppercase mb-4 text-[#332d2b]">{stat.label}</h4>
                  <p className="font-serif italic text-xl text-[#332d2b]/50">{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="about-home" className="py-20 md:py-40 bg-[#f9f5f0] relative z-10">
            <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-24 items-center">
              <motion.div className="lg:col-span-5 relative" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="bg-white p-4 rounded-[3rem] shadow-2xl overflow-hidden group relative">
                  <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="History" className="w-full aspect-[3/4] object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
                  <div className="absolute top-10 left-10 w-24 h-24 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-[#e2a744]">
                    <Calendar size={20} className="text-[#9c1c22] mb-1" />
                    <span className="text-[10px] font-cinzel font-black text-[#332d2b]">EST.</span>
                    <span className="text-lg font-serif font-black text-[#9c1c22]">2016</span>
                  </div>
                </div>
              </motion.div>
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#9c1c22]/5 text-[#9c1c22] text-[10px] font-cinzel font-black tracking-[0.3em] mb-8 border border-[#9c1c22]/10 uppercase">
                  <Award size={14} /> THE FOUNDATION LEGACY
                </span>
                <h2 className="text-4xl md:text-7xl font-serif font-black text-[#332d2b] leading-tight mb-12">ABOUT US (FOL)</h2>
                <div className="space-y-8">
                  <p className="text-xl md:text-2xl text-[#332d2b]/80 font-serif leading-relaxed">
                    Foundation of Love (FOL) was created in 2016 with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities. Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides, empower the vulnerable, and create lasting pathways to opportunity. Since inception, the foundation has touched lives across diverse demographics through outreach, capacity-building, mentorship, and community-centered initiatives.
                  </p>
                  <div className="h-0.5 w-24 bg-gradient-to-r from-[#e2a744] to-transparent" />
                </div>
              </div>
            </div>
          </section>

          {/* YouTube Video Section */}
          <section className="py-20 md:py-40 bg-white relative overflow-hidden z-10">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 md:mb-24">
                <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[10px] uppercase mb-6 block">Kinetic Resonance</span>
                <h2 className="text-4xl md:text-8xl font-serif font-black text-[#332d2b] leading-tight mb-8">Love <span className="italic font-normal text-[#e2a744]">Witnessed.</span></h2>
                <div className="h-1 w-20 md:w-32 bg-[#9c1c22] mx-auto rounded-full" />
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative group max-w-5xl mx-auto">
                <div className="relative aspect-video rounded-[1.5rem] md:rounded-[4rem] overflow-hidden border-[6px] md:border-[20px] border-white shadow-2xl bg-slate-900">
                  <iframe className="w-full h-full" src="https://www.youtube.com/embed/XxfFvLERt7o?autoplay=0&rel=0&modestbranding=1" title="Foundation of Luv" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
              </motion.div>
            </div>
          </section>
        </>
      );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden selection:bg-[#9c1c22]/20 selection:text-[#9c1c22] bg-[#fdfaf6] relative">
      <FireworksBackground />
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c1c22] to-[#e2a744] z-[100] origin-left" style={{ scaleX: scrollYProgress }} />
      
      <nav className="fixed w-full z-50 glass border-b border-[#332d2b]/10">
        <div className="max-w-7xl mx-auto px-4 h-20 md:h-28 flex justify-between items-center">
          <div onClick={() => navigateTo('home')} className="cursor-pointer">
            <Logo className="w-14 h-14 md:w-24 md:h-24 transition-transform duration-500" />
          </div>
          <div className="hidden md:flex items-center gap-10">
            {NAVIGATION.map((item) => (
              <button 
                key={item.name} 
                onClick={() => navigateTo(item.name.toLowerCase().replace(/\s+/g, ''))}
                className="text-[10px] font-cinzel font-bold uppercase tracking-[0.3em] text-[#332d2b] hover:text-[#9c1c22] transition-all relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9c1c22] transition-all group-hover:w-full" />
              </button>
            ))}
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              className="bg-[#9c1c22] text-white px-8 py-3 rounded-full text-[10px] font-cinzel font-black tracking-[0.2em] uppercase"
            >
              DONATE
            </motion.button>
          </div>
          <button className="md:hidden p-2 text-[#332d2b]" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-b border-[#332d2b]/10 overflow-hidden shadow-2xl">
              <div className="px-6 py-10 space-y-6">
                {NAVIGATION.map((item) => (
                  <button 
                    key={item.name} 
                    onClick={() => navigateTo(item.name.toLowerCase().replace(/\s+/g, ''))}
                    className="block w-full text-left text-xl font-cinzel font-bold tracking-widest text-[#332d2b]" 
                  >
                    {item.name}
                  </button>
                ))}
                <button className="w-full bg-[#9c1c22] text-white py-5 rounded-2xl font-cinzel font-black text-xl">DONATE NOW</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-[#332d2b] text-[#fdfaf6] pt-20 md:pt-48 pb-20 relative overflow-hidden z-20">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-4 gap-24 mb-32 items-start text-center md:text-left">
            <div className="lg:col-span-2">
              <div onClick={() => navigateTo('home')} className="cursor-pointer inline-block">
                <Logo className="w-24 h-24 md:w-48 md:h-48 mb-14 brightness-110 drop-shadow-2xl mx-auto md:mx-0" />
              </div>
              <p className="text-3xl text-[#fdfaf6]/40 max-w-lg mb-14 font-serif italic">"Restoring human dignity and transforming global communities through strategic action."</p>
              <div className="flex justify-center md:justify-start gap-6">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#9c1c22] transition-all"><Instagram size={22} /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#9c1c22] transition-all"><Linkedin size={22} /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#9c1c22] transition-all"><Youtube size={22} /></a>
              </div>
            </div>
            <div>
              <h5 className="text-[#e2a744] font-cinzel font-black uppercase tracking-[0.3em] text-[10px] mb-8">Architecture</h5>
              <ul className="space-y-6 text-xl font-serif italic text-[#fdfaf6]/60">
                {NAVIGATION.map(n => (
                  <li key={n.name}>
                    <button 
                      onClick={() => navigateTo(n.name.toLowerCase().replace(/\s+/g, ''))}
                      className="hover:text-white transition-colors"
                    >
                      {n.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-[#e2a744] font-cinzel font-black uppercase tracking-[0.3em] text-[10px] mb-8">Contact</h5>
              <p className="text-lg md:text-xl font-serif italic text-[#fdfaf6]/60">hello@foundationofluv.org</p>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 text-[#fdfaf6]/20 text-[9px] font-cinzel font-black tracking-[0.3em] uppercase text-center md:text-left">© 2025 FOUNDATION OF LUV. ALL RIGHTS RESERVED.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
