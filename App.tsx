import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, ArrowRight, Sparkles, MoveRight, ChevronLeft, Calendar, Award, 
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Image as LucideImage,
  Target, Eye, ShieldCheck, TrendingUp, AlertCircle, Building2, Workflow, Lightbulb, Heart, Info, Phone, MapPin
} from 'lucide-react';
import { 
  NAVIGATION, SERVICE_AREAS, STRATEGIC_PHASES, STATS, COLORS, HERO_IMAGES, GALLERY_IMAGES,
  MISSION_VISION, DETAILED_ABOUT, DONOR_PAGE_CONTENT
} from './constants';

// --- Global UI Components ---

const LogoFallback = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <defs>
      <path id="topTextArcFB" d="M 68, 250 A 182,182 0 0,1 432,250" />
      <path id="bottomTextArcFB" d="M 85, 250 A 165,165 0 0,0 415,250" />
      <clipPath id="globeClipFB">
        <circle cx="250" cy="185" r="70" />
      </clipPath>
    </defs>
    <circle cx="250" cy="250" r="248" fill="#eeb053" />
    <circle cx="250" cy="250" r="242" fill="#ffffff" />
    <circle cx="250" cy="250" r="236" fill="#4a4440" />
    <path d="M 14,250 A 236,236 0 0,1 486,250 L 250,250 Z" fill="#d6d6d6" />
    <circle cx="250" cy="250" r="176" stroke="#4a4440" stroke-width="2" fill="none" />
    <circle cx="250" cy="250" r="172" fill="#df8c3d" />
    <circle cx="250" cy="185" r="70" fill="#122d4f" />
    <g clipPath="url(#globeClipFB)">
      <path d="M210,165 Q225,145 245,165 T275,175 T300,160 T315,185 T285,215 T240,210 T205,190 Z" fill="#df8c3d" />
    </g>
    <g fill="#f1c27d">
      <path d="M190,220 Q185,250 200,300 Q215,330 245,355 L250,350 Q220,320 210,280 T205,220 Z" />
      <path d="M310,220 Q315,250 300,300 Q285,330 255,355 L250,350 Q280,320 290,280 T295,220 Z" />
    </g>
    <path d="M250,235 C210,185 140,210 140,295 C140,370 250,455 250,455 C250,455 360,370 360,295 C360,210 290,185 250,235 Z" fill="#8b1a1a" />
    <g fill="#f1c27d">
      <path d="M92,250 l10,-12 16,3 -12,12 5,16 -19,-10 -19,10 5,-16 -12,-12 16,-3 z" />
      <path d="M408,250 l10,-12 16,3 -12,12 5,16 -19,-10 -19,10 5,-16 -12,-12 16,-3 z" />
    </g>
    <text font-family="serif" font-weight="900" font-size="44" fill="#1a1a1a">
      <textPath href="#topTextArcFB" startOffset="50%" text-anchor="middle">FOUNDATION OF LUV</textPath>
    </text>
    <text font-family="serif" font-weight="700" font-size="24" fill="#ffffff">
      <textPath href="#bottomTextArcFB" startOffset="50%" text-anchor="middle">LOVE IN ACTION CHANGE IN MOTION</textPath>
    </text>
  </svg>
);

const Logo = ({ className, style }: { className?: string; style?: React.CSSProperties }) => {
  const [error, setError] = useState(false);
  
  if (error) {
    return <LogoFallback className={className} style={style} />;
  }
  
  return (
    <img 
      src="logo.svg" 
      alt="Foundation of Luv" 
      className={className} 
      style={style} 
      onError={() => setError(true)} 
    />
  );
};

const FireworksBackground = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const spawnBurst = useCallback(() => {
    const id = Date.now() + Math.random();
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const colorValues = [COLORS.crimson, COLORS.gold, COLORS.accent, COLORS.white];
    const color = colorValues[Math.floor(Math.random() * colorValues.length)];
    setBursts(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => setBursts(prev => prev.filter(b => b.id !== id)), 3000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => { spawnBurst(); }, 800);
    return () => clearInterval(interval);
  }, [spawnBurst]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-transparent">
      <AnimatePresence>
        {bursts.map(burst => (
          <div key={burst.id} className="absolute" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                animate={{ x: Math.cos((i * 30) * (Math.PI / 180)) * 120, y: Math.sin((i * 30) * (Math.PI / 180)) * 120, opacity: 0, scale: [0, 1, 0.4] }}
                transition={{ duration: 2.5, ease: "easeOut" }}
                className="absolute w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: burst.color }}
              />
            ))}
          </div>
        ))}
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
  useEffect(() => { if (isInView) animate(count, numericValue, { duration: 2.5, ease: [0.32, 1, 0.2, 1] }); }, [isInView, numericValue, count]);
  return <motion.span ref={ref}>{rounded}</motion.span>;
};

// --- Page Content Views ---

const HomeView = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10">
      <header className="relative w-full pt-32 pb-16 md:pt-64 md:pb-32 lg:pt-72 lg:pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative group p-0 md:p-12 w-full max-w-[950px]">
            <div className="relative aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden border-[8px] md:border-[24px] border-white shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
                  <img src={HERO_IMAGES[currentSlide].url} alt={HERO_IMAGES[currentSlide].caption} className="w-full h-full object-cover brightness-75" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <span className="text-[#eeb053] font-cinzel font-black tracking-[0.4em] text-[10px] uppercase">Movement Chapter</span>
                    <h3 className="text-white text-lg md:text-5xl font-serif italic font-bold">{HERO_IMAGES[currentSlide].caption}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-6 -right-6 md:-top-16 md:-right-16 w-24 h-24 md:w-56 md:h-56 z-40"><Logo className="w-full h-full drop-shadow-2xl" /></motion.div>
          </motion.div>
          
          <div className="mt-12">
            <h1 className="hero-text text-4xl md:text-[8rem] font-serif font-black leading-tight text-shine-crimson">Love in Action,<br /><span className="italic font-normal text-shine text-[#eeb053]">Change in Motion.</span></h1>
            <p className="mobile-p text-lg md:text-3xl text-[#332d2b]/70 mt-8 max-w-4xl mx-auto font-serif italic text-center">"We are the kinetic pulse of restoration, engineering pathways where human dignity is an unshakeable reality."</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
              <button onClick={() => onNavigate('donate')} className="px-12 py-6 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-xl shadow-xl flex items-center gap-3 hover:bg-[#7a141a] transition-all">Show some Love <MoveRight /></button>
              <button onClick={() => onNavigate('aboutus')} className="px-12 py-6 glass-card rounded-full font-cinzel font-bold text-xl border border-[#eeb053]/50 flex items-center justify-center gap-3 hover:bg-white/60 transition-all">Explore Our Story <ArrowRight /></button>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 md:py-40 bg-[#f9f5f0] border-y border-[#332d2b]/5">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <div className="p-4 bg-white rounded-[4rem] shadow-2xl border-4 border-[#eeb053]">
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" className="rounded-[3.5rem] grayscale" alt="Foundation Origin" />
            </div>
          </motion.div>
          <div className="lg:col-span-7">
            <h2 className="text-4xl md:text-7xl font-serif font-black text-[#332d2b] leading-tight mb-8">ABOUT US (FOL)</h2>
            <p className="text-xl md:text-2xl text-[#332d2b]/80 font-serif leading-relaxed italic border-l-8 border-[#9c1c22] pl-10">
              Foundation of Love (FOL) was created in 2016 with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities. Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides, empower the vulnerable, and create lasting pathways to opportunity.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <div className="bg-[#fdfaf6] p-14 rounded-[4rem] border-2 border-[#9c1c22]/10">
            <div className="text-[#9c1c22] mb-8"><Target size={48} /></div>
            <h3 className="text-4xl font-serif font-black mb-6">Mission</h3>
            <p className="text-2xl text-[#332d2b]/70 font-serif leading-relaxed italic">{MISSION_VISION.mission.content}</p>
          </div>
          <div className="bg-[#fdfaf6] p-14 rounded-[4rem] border-2 border-[#eeb053]/20">
            <div className="text-[#eeb053] mb-8"><Eye size={48} /></div>
            <h3 className="text-4xl font-serif font-black mb-6">Vision</h3>
            <p className="text-2xl text-[#332d2b]/70 font-serif leading-relaxed italic">{MISSION_VISION.vision.content}</p>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-40 bg-[#f9f5f0]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-8xl font-serif font-black text-[#332d2b] mb-12">Love Witnessed.</h2>
          <div className="relative aspect-video rounded-[3rem] md:rounded-[5rem] overflow-hidden border-[16px] md:border-[32px] border-[#eeb053] shadow-2xl bg-black max-w-5xl mx-auto">
            <iframe className="w-full h-full" src="https://www.youtube.com/embed/XxfFvLERt7o" title="FoL Impact" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-6xl md:text-8xl font-serif font-black text-[#9c1c22] mb-4"><AnimatedNumber value={stat.value} /><span className="text-[#eeb053]">{stat.suffix}</span></div>
              <h4 className="font-cinzel font-black text-[12px] tracking-[0.3em] uppercase mb-4 text-[#332d2b]">{stat.label}</h4>
              <p className="font-serif italic text-xl text-[#332d2b]/50">{stat.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const DetailedAboutView = () => (
  <section className="py-24 md:py-48 bg-[#fdfaf6] pt-48">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-24 text-center">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">In-Depth Foundation Profile</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] leading-tight mb-12">{DETAILED_ABOUT.header}</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-20 mb-32 items-center">
        <div className="lg:col-span-7 bg-white p-14 rounded-[3.5rem] shadow-xl border-l-8 border-[#eeb053]">
           <h3 className="text-4xl font-serif font-black mb-10 text-[#332d2b]">{DETAILED_ABOUT.dualRole.intro}</h3>
           <ul className="space-y-8 text-xl font-serif text-[#332d2b]/70 italic">
             {DETAILED_ABOUT.dualRole.points.map((p, i) => <li key={i} className="flex gap-6"><MoveRight className="text-[#eeb053] shrink-0" /> {p}</li>)}
           </ul>
        </div>
        <div className="lg:col-span-5"><Logo className="w-full h-full grayscale opacity-20" /></div>
      </div>

      <div className="mb-32">
        <h3 className="text-5xl font-serif font-black text-center mb-16">{DETAILED_ABOUT.problemStatement.title}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
           {DETAILED_ABOUT.problemStatement.crises.map((item, idx) => (
             <div key={idx} className="bg-white p-10 rounded-[2rem] border-2 border-[#9c1c22]/10 shadow-sm hover:border-[#9c1c22] transition-all">
                <AlertCircle className="text-[#9c1c22] mb-4" />
                <p className="text-xl text-[#332d2b] font-serif font-bold italic">{item}</p>
             </div>
           ))}
        </div>
      </div>

      <div className="mb-32">
        <h3 className="text-5xl font-serif font-black text-center mb-20">Core Values</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DETAILED_ABOUT.values.map((v, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-[#eeb053]/50 shadow-sm hover:bg-[#eeb053]/5 transition-all">
              <h4 className="text-2xl font-serif font-black text-[#9c1c22] mb-4">{v.title}</h4>
              <p className="text-lg text-[#332d2b]/60 font-serif italic leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-32 bg-[#9c1c22] text-white rounded-[5rem] shadow-2xl px-8 border-b-[20px] border-[#eeb053]">
        <h2 className="text-4xl md:text-6xl font-serif font-black leading-tight italic mb-12">"{DETAILED_ABOUT.closing.quote}"</h2>
        <p className="text-2xl font-cinzel font-black tracking-widest text-[#eeb053]">{DETAILED_ABOUT.closing.tagline}</p>
      </div>
    </div>
  </section>
);

const DonorView = () => (
  <section className="py-48 bg-[#fdfaf6] pt-48 relative z-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <Heart className="text-[#9c1c22] w-20 h-20 mx-auto mb-10" />
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">{DONOR_PAGE_CONTENT.different.title}</h2>
        <p className="text-2xl md:text-4xl text-[#332d2b]/70 font-serif italic max-w-4xl mx-auto">{DONOR_PAGE_CONTENT.different.content}</p>
      </div>

      <div className="mb-32 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {DONOR_PAGE_CONTENT.impactPillars.map((pillar, i) => (
          <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-lg border-t-4 border-[#eeb053]">
             <h4 className="text-2xl font-serif font-black text-[#9c1c22] mb-6">{pillar.title}</h4>
             <p className="text-lg text-[#332d2b]/70 font-serif italic">{pillar.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#9c1c22] text-white p-20 rounded-[5rem] text-center shadow-2xl border-4 border-[#eeb053]">
        <h3 className="text-6xl font-serif font-black mb-16 italic underline decoration-[#eeb053] decoration-8 underline-offset-8 uppercase">Our Promise</h3>
        <div className="flex flex-col gap-10 text-3xl font-serif italic opacity-90 mb-20">
          {DONOR_PAGE_CONTENT.promise.points.map((p, i) => <p key={i}>"{p}"</p>)}
        </div>
        <p className="text-4xl font-cinzel font-black tracking-[0.3em] text-[#eeb053]">{DONOR_PAGE_CONTENT.promise.tagline}</p>
      </div>
    </div>
  </section>
);

const GalleryPageView = () => (
  <section className="py-48 bg-white min-h-screen pt-48 relative z-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b]">The Visual <span className="italic text-[#eeb053]">Witness.</span></h2>
        <div className="h-2 w-32 bg-[#9c1c22] mx-auto mt-10 rounded-full" />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="group relative aspect-square overflow-hidden rounded-[3rem] shadow-2xl border-4 border-transparent hover:border-[#eeb053] transition-all">
            <img src={img.url} alt={img.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#9c1c22]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-12">
              <h4 className="text-white font-cinzel font-bold text-2xl uppercase tracking-[0.2em]">{img.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- Global App Layout ---

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'aboutus': return <DetailedAboutView />;
      case 'gallery': return <GalleryPageView />;
      case 'donate': return <DonorView />;
      case 'globalservices': return <HomeView onNavigate={handleNavigate} />;
      default: return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden selection:bg-[#9c1c22]/20 selection:text-[#9c1c22] bg-[#fdfaf6] relative">
      <FireworksBackground />
      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#9c1c22] via-[#eeb053] to-[#ffffff] z-[100] origin-left" style={{ scaleX: scrollYProgress }} />
      
      <nav className="fixed w-full z-50 glass border-b-2 border-[#eeb053]/30">
        <div className="max-w-7xl mx-auto px-4 h-20 md:h-32 flex justify-between items-center">
          <div onClick={() => handleNavigate('home')} className="cursor-pointer transition-transform hover:scale-105">
            <Logo className="w-16 h-16 md:w-28 md:h-28" />
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {NAVIGATION.map((item) => (
              <button key={item.id} onClick={() => handleNavigate(item.id)} className="text-[11px] font-cinzel font-bold uppercase tracking-[0.3em] text-[#332d2b] hover:text-[#9c1c22] transition-all relative group">
                {item.name}<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#eeb053] transition-all group-hover:w-full" />
              </button>
            ))}
            <motion.button onClick={() => handleNavigate('donate')} whileHover={{ scale: 1.05 }} className="bg-[#9c1c22] text-white px-12 py-4 rounded-full text-[11px] font-cinzel font-black tracking-[0.2em] uppercase shadow-xl border-2 border-[#eeb053]">DONATE</motion.button>
          </div>
          
          <button className="md:hidden p-2 text-[#332d2b]" onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
        
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden glass border-b border-[#332d2b]/10 overflow-hidden shadow-2xl">
              <div className="px-8 py-12 space-y-8 bg-white">
                {NAVIGATION.map((item) => (<button key={item.id} onClick={() => handleNavigate(item.id)} className="block w-full text-left text-2xl font-cinzel font-bold tracking-[0.2em] text-[#332d2b]">{item.name}</button>))}
                <button onClick={() => handleNavigate('donate')} className="w-full bg-[#9c1c22] text-white py-6 rounded-[2rem] font-cinzel font-black text-2xl border-2 border-[#eeb053]">SHOW SOME LOVE</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10"><AnimatePresence mode="wait"><motion.div key={currentPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>{renderContent()}</motion.div></AnimatePresence></main>

      <footer className="bg-[#1a1a1a] text-[#fdfaf6] pt-20 md:pt-32 pb-20 relative overflow-hidden z-20 border-t-8 border-[#eeb053]">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-4 gap-16 mb-24 items-start text-center md:text-left">
            <div className="lg:col-span-2">
              <div onClick={() => handleNavigate('home')} className="cursor-pointer inline-block mb-10"><Logo className="w-24 h-24 md:w-56 md:h-56 brightness-110 drop-shadow-2xl mx-auto md:mx-0" /></div>
              <p className="text-2xl text-[#fdfaf6]/60 max-w-lg mb-10 font-serif italic">"Restoring human dignity and transforming global communities through structured compassion."</p>
              <div className="flex flex-col gap-4 text-xl font-serif text-[#eeb053] mb-10">
                <div className="flex items-center justify-center md:justify-start gap-4"><Phone size={20} className="text-[#9c1c22]" /> 443-402-5802</div>
                <div className="flex items-center justify-center md:justify-start gap-4 text-left"><MapPin size={24} className="text-[#9c1c22] shrink-0" /> #9960 Raven Hurst Road, Middle River MD 21221</div>
              </div>
              <div className="flex justify-center md:justify-start gap-6">
                <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#9c1c22] transition-all"><Instagram size={24} /></a>
                <a href="https://www.linkedin.com/company/111352944/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#9c1c22] transition-all"><Linkedin size={24} /></a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 hover:bg-[#9c1c22] transition-all"><Youtube size={24} /></a>
              </div>
            </div>
            <div>
              <h5 className="text-[#eeb053] font-cinzel font-black uppercase tracking-[0.4em] text-[12px] mb-10">Sitemap</h5>
              <ul className="space-y-6 text-xl font-serif italic text-[#fdfaf6]/50">
                {NAVIGATION.map(n => (<li key={n.id}><button onClick={() => handleNavigate(n.id)} className="hover:text-white transition-colors">{n.name}</button></li>))}
              </ul>
            </div>
            <div>
              <h5 className="text-[#eeb053] font-cinzel font-black uppercase tracking-[0.4em] text-[12px] mb-10">Inquiries</h5>
              <p className="text-xl font-serif italic text-[#fdfaf6]/50 leading-relaxed italic">Direct Correspondence:<br />hello@foundationofluv.org</p>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-[#fdfaf6]/20 text-[10px] font-cinzel font-black tracking-[0.4em] uppercase text-center md:text-left">© 2025 FOUNDATION OF LUV. LOVE IN ACTION, CHANGE IN MOTION.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
