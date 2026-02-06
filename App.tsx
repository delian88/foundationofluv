import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, ArrowRight, Sparkles, MoveRight, ChevronLeft, Calendar, Award, 
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Image as LucideImage,
  Target, Eye, ShieldCheck, TrendingUp, AlertCircle, Building2, Workflow, Lightbulb, Heart, Info, Phone, MapPin,
  CheckCircle2, Footprints, Zap, Star, Activity, LayoutGrid
} from 'lucide-react';
import { 
  NAVIGATION, STRATEGIC_PHASES, STATS, COLORS, HERO_IMAGES, GALLERY_IMAGES,
  MISSION_VISION, DETAILED_ABOUT, DONOR_PAGE_CONTENT, LUV_ACT_PROGRAMS, LEADERSHIP_MESSAGE, LUVWATTS_CONTENT,
  GLOBAL_SERVICES_DATA
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

const GlobalServicesView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Global Reach</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">International <span className="text-[#eeb053] italic">Architecture.</span></h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto">
          Foundation of Luv operates a multi-disciplinary suite of services designed to address the convergent crises of the modern era.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {GLOBAL_SERVICES_DATA.map((service, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -15 }}
            className="bg-[#fdfaf6] p-12 rounded-[4rem] border-2 border-transparent hover:border-[#eeb053] transition-all shadow-lg flex flex-col h-full"
          >
            <div className="text-[#9c1c22] mb-10 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md">
              {React.cloneElement(service.icon as React.ReactElement, { size: 32 })}
            </div>
            <h3 className="text-3xl font-serif font-black text-[#332d2b] mb-6 uppercase leading-tight">{service.title}</h3>
            <p className="text-xl font-serif text-[#332d2b]/70 italic mb-10 leading-relaxed">{service.description}</p>
            <div className="mt-auto pt-8 border-t border-black/5">
               <ul className="space-y-4">
                 {service.features.map((feature, idx) => (
                   <li key={idx} className="flex items-center gap-4 text-lg font-serif italic text-[#332d2b]/50">
                     <div className="w-2 h-2 rounded-full bg-[#eeb053]" /> {feature}
                   </li>
                 ))}
               </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const RoadmapView = () => (
  <section className="py-24 md:py-48 bg-[#f9f5f0] pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Strategic Trajectory</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">The Impact <span className="text-[#9c1c22] italic">Roadmap.</span></h2>
      </div>

      <div className="space-y-32 relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#eeb053]/20 hidden lg:block -translate-x-1/2" />
        
        {STRATEGIC_PHASES.map((phase, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-24 relative`}
          >
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 bg-[#eeb053] rounded-full border-[8px] border-white shadow-xl z-10 items-center justify-center text-white font-cinzel font-black">
              {i + 1}
            </div>

            <div className="w-full lg:w-1/2">
               <div className="bg-white p-14 rounded-[5rem] shadow-2xl border-b-[16px] border-[#9c1c22]">
                  <span className="text-[#eeb053] font-cinzel font-black tracking-widest text-sm mb-6 block uppercase">{phase.years}</span>
                  <h3 className="text-4xl md:text-5xl font-serif font-black text-[#332d2b] mb-10 leading-tight">{phase.title}</h3>
                  
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[#9c1c22] font-cinzel font-black text-xs uppercase tracking-widest mb-6">Strategic Goals</h4>
                      <ul className="space-y-4">
                        {phase.goals.map((goal, idx) => (
                          <li key={idx} className="flex gap-4 text-xl font-serif italic text-[#332d2b]/60 leading-relaxed">
                            <CheckCircle2 className="shrink-0 text-[#eeb053]" /> {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#fdfaf6] p-8 rounded-[2rem]">
                      <h4 className="text-[#332d2b] font-cinzel font-black text-xs uppercase tracking-widest mb-6">Targeted Outputs</h4>
                      <ul className="grid md:grid-cols-2 gap-4">
                        {phase.outputs.map((out, idx) => (
                          <li key={idx} className="flex gap-4 text-lg font-serif font-black text-[#332d2b] items-center">
                            <Activity className="shrink-0 text-[#9c1c22]" size={18} /> {out}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
               </div>
            </div>
            <div className="w-full lg:w-1/2 h-full flex items-center justify-center opacity-10 grayscale">
              <Logo className="w-64 h-64 md:w-96 md:h-96" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const LUVWATTSView = () => (
  <section className="py-24 md:py-48 bg-[#1a1a1a] text-white pt-48 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#9c1c22]/20 via-black to-[#df8c3d]/20" />
    
    <div className="max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-32">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="mb-12">
          <Heart className="w-32 h-32 mx-auto text-[#eeb053] blur-[2px] animate-pulse" />
        </motion.div>
        <h2 className="text-6xl md:text-[10rem] font-serif font-black text-white leading-none mb-8">LUVWATTS</h2>
        <p className="text-2xl md:text-4xl font-serif italic text-white/60 max-w-4xl mx-auto leading-tight">
          "{LUVWATTS_CONTENT.description}"
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {LUVWATTS_CONTENT.acronym.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative p-12 rounded-[3.5rem] bg-white/5 border border-white/10 hover:bg-[#eeb053] hover:text-[#1a1a1a] transition-all duration-500 overflow-hidden"
          >
            <span className="text-8xl font-cinzel font-black opacity-10 absolute -top-4 -left-4 group-hover:opacity-20">{item.letter}</span>
            <div className="relative z-10">
              <h3 className="text-3xl font-cinzel font-black mb-4 uppercase tracking-tighter">{item.term}</h3>
              <p className="text-xl font-serif italic opacity-60 group-hover:opacity-100 leading-relaxed">{item.definition}</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 text-center p-20 bg-white text-[#1a1a1a] rounded-[5rem] shadow-[0_0_100px_rgba(238,176,83,0.2)]">
        <h3 className="text-4xl md:text-6xl font-serif font-black mb-10 leading-tight italic uppercase">The Kinetic Heartbeat of Restoration.</h3>
        <p className="text-2xl font-serif italic opacity-60 mb-12 max-w-2xl mx-auto">It is the energy that drives every program, every volunteer, and every life changed by the Foundation of Luv.</p>
        <div className="flex justify-center gap-12 text-[#9c1c22]">
          <Activity size={48} className="animate-bounce" />
          <Workflow size={48} className="animate-spin-slow" />
          <Zap size={48} className="animate-pulse" />
        </div>
      </div>
    </div>
  </section>
);

const HomeView = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10">
      {/* Hero Section */}
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

      {/* Intro / About Summary */}
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

      {/* Community Outreach Highlights */}
      <section className="py-24 md:py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-[#eeb053]/10 blur-3xl -z-10 rounded-full"></div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="p-8 bg-[#fdfaf6] rounded-[5rem] shadow-2xl border-4 border-[#eeb053] relative">
                <div className="grid grid-cols-3 gap-4">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500 shadow-inner">
                        <img src={`https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=400&sig=${i}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-full shadow-2xl border-4 border-[#9c1c22] w-48 h-48 flex items-center justify-center">
                    <Logo className="w-full h-full" />
                  </div>
                </div>
              </motion.div>
            </div>
            <div>
              <span className="text-[#9c1c22] font-cinzel font-black tracking-widest text-xs uppercase mb-6 block">Community Outreach</span>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-10 leading-tight uppercase">Let's Give <br />Those Feet <span className="text-[#9c1c22] italic">Shoes.</span></h2>
              <p className="text-2xl font-serif italic text-[#332d2b]/60 mb-12">
                Our community efforts where we show love and help those in need. Simple acts of restoration create waves of progress.
              </p>
              <div className="bg-[#eeb053]/20 p-8 rounded-[2rem] border-l-8 border-[#eeb053]">
                <p className="text-xl font-serif font-bold italic text-[#332d2b]">"Providing dignity through direct assistance is the first step toward lasting community empowerment."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 Luv Acts Highlights */}
      <section className="py-24 md:py-40 bg-[#f9f5f0] border-y border-[#332d2b]/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-24">
             <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.4em] text-xs uppercase mb-4 block">Our Architecture</span>
             <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] uppercase">The 7 Luv Acts</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LUV_ACT_PROGRAMS.slice(0, 6).map((act, i) => (
              <motion.div 
                key={act.id} 
                whileHover={{ y: -10 }}
                className="p-10 rounded-[3rem] border-2 border-transparent hover:border-[#eeb053] transition-all bg-white group shadow-sm"
              >
                <span className="text-4xl font-cinzel font-black text-[#9c1c22]/20 group-hover:text-[#9c1c22] transition-colors mb-6 block">{act.id}</span>
                <h3 className="text-2xl font-serif font-black text-[#332d2b] mb-4 uppercase">{act.title}</h3>
                <p className="text-lg text-[#332d2b]/60 font-serif italic leading-relaxed">{act.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-16 text-center">
            <button onClick={() => onNavigate('programs')} className="text-xl font-cinzel font-bold text-[#9c1c22] flex items-center gap-3 mx-auto hover:gap-6 transition-all">View All Restoration Pillars <ArrowRight /></button>
          </div>
        </div>
      </section>

      {/* Leadership Highlight */}
      <section className="py-20 md:py-40 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Logo className="w-full h-full scale-150 rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="order-2 lg:order-1">
            <h2 className="text-[#eeb053] font-cinzel font-black tracking-widest text-sm uppercase mb-8">{LEADERSHIP_MESSAGE.title}</h2>
            <div className="relative">
               <span className="text-[12rem] font-serif font-black absolute -top-24 -left-12 opacity-10 text-[#eeb053]">"</span>
               <p className="text-3xl md:text-5xl font-serif italic leading-tight mb-12">
                 {LEADERSHIP_MESSAGE.content}
               </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="h-1 w-20 bg-[#9c1c22]"></div>
              <div>
                <p className="text-2xl font-cinzel font-black text-[#eeb053] uppercase">{LEADERSHIP_MESSAGE.author}</p>
                <p className="text-lg font-serif italic opacity-50">{LEADERSHIP_MESSAGE.tagline}</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative p-6">
              <div className="aspect-square rounded-[4rem] overflow-hidden shadow-[0_0_80px_rgba(238,176,83,0.3)] border-4 border-[#eeb053] bg-white flex items-center justify-center p-8 md:p-16">
                 <Logo className="w-full h-full" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-10 -right-10 w-40 h-40 hidden md:block"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <path id="circlePath" d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0" fill="transparent" />
                  <text fill="#eeb053" className="font-cinzel font-bold text-[10px] tracking-[0.2em] uppercase">
                    <textPath href="#circlePath">Restoring Human Dignity • Leading with Love • </textPath>
                  </text>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* LUVWATTS Movement Section */}
      <section className="py-24 md:py-40 bg-white border-y border-[#332d2b]/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <span className="text-[#9c1c22] font-cinzel font-black tracking-widest text-xs uppercase mb-6 block">The Kinetic Pulse</span>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-10 leading-tight uppercase">Solid Growth, <br /><span className="text-[#9c1c22]">Love in Action.</span></h2>
              <p className="text-2xl font-serif italic text-[#332d2b]/60 mb-12">
                {LUVWATTS_CONTENT.description}
              </p>
              <button onClick={() => onNavigate('luvwatts')} className="px-12 py-6 bg-[#1a1a1a] text-white rounded-full font-cinzel font-black text-xl hover:bg-[#332d2b] transition-all flex items-center gap-4 uppercase">Explore LUVWATTS <ArrowRight /></button>
            </div>
            <div className="relative group">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }}
                 className="aspect-square bg-gradient-to-br from-[#9c1c22] to-[#df8c3d] rounded-[5rem] shadow-3xl p-1 flex items-center justify-center relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-30 mix-blend-overlay"></div>
                 <div className="w-full h-full bg-[#1a1a1a] rounded-[4.8rem] flex items-center justify-center p-12">
                   <div className="relative">
                      <Heart className="w-64 h-64 text-[#9c1c22] blur-md absolute inset-0 opacity-50" />
                      <Heart className="w-64 h-64 text-[#eeb053] relative z-10 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Zap className="text-white w-20 h-20" />
                      </div>
                   </div>
                 </div>
                 <div className="absolute bottom-12 right-12 text-right">
                    <p className="font-cinzel font-black text-4xl text-white tracking-[0.2em]">017</p>
                    <p className="font-serif italic text-white/50">Movement Energy</p>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProgramsPageView = () => {
  const redBlocks = LUV_ACT_PROGRAMS.filter(p => p.id === "01" || p.id === "02" || p.id === "03");
  const yellowBlocksGroup1 = LUV_ACT_PROGRAMS.filter(p => p.id === "04" || p.id === "05" || p.id === "06");
  const yellowBlockLast = LUV_ACT_PROGRAMS.find(p => p.id === "07");

  return (
    <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-16">
          <Logo className="w-20 h-20 md:w-24 md:h-24" />
          <h2 className="text-[#9c1c22] font-cinzel font-black tracking-widest text-4xl md:text-5xl uppercase">Foundation of Luv</h2>
        </div>

        <div className="mb-16">
          <h1 className="text-6xl md:text-9xl font-serif font-black text-[#9c1c22] leading-none mb-8 uppercase">Programs & Projects</h1>
          <div className="max-w-4xl">
            <p className="text-2xl md:text-3xl font-serif text-[#332d2b] leading-tight mb-4">
              At Foundation of Luv we are driven by our objectives and act to fulfill them through our programs & projects.
            </p>
            <p className="text-xl md:text-2xl font-serif text-[#332d2b]/60 italic">
              They are also known as the <span className="text-[#9c1c22] font-bold">7 Luv Act.</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="flex flex-col gap-8">
            {redBlocks.map((program) => (
              <motion.div key={program.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#9c1c22] text-white p-12 h-full flex flex-col justify-start min-h-[320px] shadow-lg">
                <span className="text-7xl font-cinzel font-black block mb-6 opacity-70 leading-none">{program.id}</span>
                <h3 className="text-3xl md:text-4xl font-serif font-black mb-6 leading-tight uppercase">{program.title}</h3>
                <p className="text-xl md:text-2xl font-serif opacity-90 leading-relaxed italic border-t border-white/20 pt-6">{program.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-8">
            {yellowBlocksGroup1.map((program) => (
              <motion.div key={program.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#eeb053] text-[#332d2b] p-12 h-full flex flex-col justify-start min-h-[320px] shadow-lg">
                <span className="text-7xl font-cinzel font-black block mb-6 opacity-50 leading-none">{program.id}</span>
                <h3 className="text-3xl md:text-4xl font-serif font-black mb-6 leading-tight uppercase">{program.title}</h3>
                <p className="text-xl md:text-2xl font-serif text-[#332d2b]/80 leading-relaxed italic border-t border-black/10 pt-6">{program.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex flex-col gap-8 h-full">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-[3/4.5] overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border-8 border-white">
              <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=1200" alt="Foundation Impact Leader" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            {yellowBlockLast && (
              <motion.div key={yellowBlockLast.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#eeb053] text-[#332d2b] p-12 h-full flex flex-col justify-start min-h-[320px] shadow-lg">
                <span className="text-7xl font-cinzel font-black block mb-6 opacity-50 leading-none">{yellowBlockLast.id}</span>
                <h3 className="text-3xl md:text-4xl font-serif font-black mb-6 leading-tight uppercase">{yellowBlockLast.title}</h3>
                <p className="text-xl md:text-2xl font-serif text-[#332d2b]/80 leading-relaxed italic border-t border-black/10 pt-6">{yellowBlockLast.description}</p>
              </motion.div>
            )}
          </div>
        </div>
        <div className="mt-32 pt-12 border-t border-[#332d2b]/10 flex justify-between items-center font-cinzel text-lg md:text-2xl opacity-40 italic">
          <span>012</span>
          <span>FOL Profile</span>
        </div>
      </div>
    </section>
  );
};

const DetailedAboutView = () => (
  <section className="py-24 md:py-48 bg-[#fdfaf6] pt-48">
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-24 text-center">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">In-Depth Foundation Profile</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] leading-tight mb-12 uppercase">{DETAILED_ABOUT.header}</h2>
      </div>
      <div className="grid lg:grid-cols-12 gap-20 mb-32 items-center">
        <div className="lg:col-span-7 bg-white p-14 rounded-[3.5rem] shadow-xl border-l-8 border-[#eeb053]">
           <h3 className="text-4xl font-serif font-black mb-10 text-[#332d2b] uppercase">{DETAILED_ABOUT.dualRole.intro}</h3>
           <ul className="space-y-8 text-xl font-serif text-[#332d2b]/70 italic">
             {DETAILED_ABOUT.dualRole.points.map((p, i) => <li key={i} className="flex gap-6"><MoveRight className="text-[#eeb053] shrink-0" /> {p}</li>)}
           </ul>
        </div>
        <div className="lg:col-span-5"><Logo className="w-full h-full grayscale opacity-20" /></div>
      </div>
      <div className="mb-32">
        <h3 className="text-5xl font-serif font-black text-center mb-16 uppercase">The Problem Statement</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
           {DETAILED_ABOUT.problemStatement.crises.map((item, idx) => (
             <div key={idx} className="bg-white p-10 rounded-[2rem] border-2 border-[#9c1c22]/10 shadow-sm hover:border-[#9c1c22] transition-all">
                <AlertCircle className="text-[#9c1c22] mb-4" />
                <p className="text-xl text-[#332d2b] font-serif font-bold italic uppercase">{item}</p>
             </div>
           ))}
        </div>
      </div>
      <div className="mb-32">
        <h3 className="text-5xl font-serif font-black text-center mb-20 uppercase">Core Values</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {DETAILED_ABOUT.values.map((v, i) => (
            <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-[#eeb053]/50 shadow-sm hover:bg-[#eeb053]/5 transition-all">
              <h4 className="text-2xl font-serif font-black text-[#9c1c22] mb-4 uppercase">{v.title}</h4>
              <p className="text-lg text-[#332d2b]/60 font-serif italic leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center py-32 bg-[#9c1c22] text-white rounded-[5rem] shadow-2xl px-8 border-b-[20px] border-[#eeb053]">
        <h2 className="text-4xl md:text-6xl font-serif font-black leading-tight italic mb-12">"{DETAILED_ABOUT.closing.quote}"</h2>
        <p className="text-2xl font-cinzel font-black tracking-widest text-[#eeb053] uppercase">{DETAILED_ABOUT.closing.tagline}</p>
      </div>
    </div>
  </section>
);

const DonorView = () => (
  <section className="py-48 bg-[#fdfaf6] pt-48 relative z-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <Heart className="text-[#9c1c22] w-20 h-20 mx-auto mb-10" />
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Show Some Love</h2>
        <p className="text-2xl md:text-4xl text-[#332d2b]/70 font-serif italic max-w-4xl mx-auto uppercase">{DONOR_PAGE_CONTENT.different.content}</p>
      </div>
      <div className="mb-32 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {DONOR_PAGE_CONTENT.impactPillars.map((pillar, i) => (
          <div key={i} className="bg-white p-12 rounded-[3.5rem] shadow-lg border-t-4 border-[#eeb053]">
             <h4 className="text-2xl font-serif font-black text-[#9c1c22] mb-6 uppercase">{pillar.title}</h4>
             <p className="text-lg text-[#332d2b]/70 font-serif italic">{pillar.description}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#9c1c22] text-white p-20 rounded-[5rem] text-center shadow-2xl border-4 border-[#eeb053]">
        <h3 className="text-6xl font-serif font-black mb-16 italic underline decoration-[#eeb053] decoration-8 underline-offset-8 uppercase">Our Promise</h3>
        <div className="flex flex-col gap-10 text-3xl font-serif italic opacity-90 mb-20 uppercase">
          {DONOR_PAGE_CONTENT.promise.points.map((p, i) => <p key={i}>"{p}"</p>)}
        </div>
        <p className="text-4xl font-cinzel font-black tracking-[0.3em] text-[#eeb053] uppercase">{DONOR_PAGE_CONTENT.promise.tagline}</p>
      </div>
    </div>
  </section>
);

const GalleryPageView = () => (
  <section className="py-48 bg-white min-h-screen pt-48 relative z-10">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] uppercase">The Visual Witness</h2>
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
      case 'globalservices': return <GlobalServicesView />;
      case 'roadmap': return <RoadmapView />;
      case 'luvwatts': return <LUVWATTSView />;
      case 'gallery': return <GalleryPageView />;
      case 'donate': return <DonorView />;
      case 'programs': return <ProgramsPageView />;
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
                {NAVIGATION.map((item) => (<button key={item.id} onClick={() => handleNavigate(item.id)} className="block w-full text-left text-2xl font-cinzel font-bold tracking-[0.2em] text-[#332d2b] uppercase">{item.name}</button>))}
                <button onClick={() => handleNavigate('donate')} className="w-full bg-[#9c1c22] text-white py-6 rounded-[2rem] font-cinzel font-black text-2xl border-2 border-[#eeb053] uppercase">SHOW SOME LOVE</button>
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
              <p className="text-2xl text-[#fdfaf6]/60 max-w-lg mb-10 font-serif italic uppercase">"Restoring human dignity and transforming global communities through structured compassion."</p>
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
              <ul className="space-y-6 text-xl font-serif italic text-[#fdfaf6]/50 uppercase">
                {NAVIGATION.map(n => (<li key={n.id}><button onClick={() => handleNavigate(n.id)} className="hover:text-white transition-colors">{n.name}</button></li>))}
              </ul>
            </div>
            <div>
              <h5 className="text-[#eeb053] font-cinzel font-black uppercase tracking-[0.4em] text-[12px] mb-10">Inquiries</h5>
              <p className="text-xl font-serif italic text-[#fdfaf6]/50 leading-relaxed italic uppercase">Direct Correspondence:<br />hello@foundationofluv.org</p>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 text-[#fdfaf6]/20 text-[10px] font-cinzel font-black tracking-[0.4em] uppercase text-center md:text-left">© 2025 FOUNDATION OF LUV. LOVE IN ACTION, CHANGE IN MOTION.</div>
        </div>
      </footer>
    </div>
  );
};

export default App;
