
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, ArrowRight, Sparkles, MoveRight, ChevronLeft, Calendar, Award, 
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Image as LucideImage,
  Target, Eye, ShieldCheck, TrendingUp, AlertCircle, Building2, Workflow, Lightbulb, Heart, Info, Phone, MapPin,
  CheckCircle2, Footprints, Zap, Star, Activity, LayoutGrid, Newspaper, MessageSquare, Shield, PenTool,
  Quote, Compass, Anchor
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

// Fix: Implemented DetailedAboutView component
const DetailedAboutView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Organizational Profile</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">{DETAILED_ABOUT.header}</h2>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-20 mb-32">
        <div className="bg-[#fdfaf6] p-16 rounded-[4rem] shadow-xl border-l-8 border-[#9c1c22]">
          <h3 className="text-3xl font-serif font-black mb-8 uppercase">{DETAILED_ABOUT.dualRole.intro}</h3>
          <ul className="space-y-6">
            {DETAILED_ABOUT.dualRole.points.map((point, i) => (
              <li key={i} className="flex gap-4 text-xl font-serif italic text-[#332d2b]/70 uppercase leading-relaxed">
                <CheckCircle2 className="shrink-0 text-[#eeb053]" /> {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#f9f5f0] p-16 rounded-[4rem] shadow-xl border-l-8 border-[#eeb053]">
          <h3 className="text-3xl font-serif font-black mb-8 uppercase">{DETAILED_ABOUT.problemStatement.title}</h3>
          <ul className="space-y-6">
            {DETAILED_ABOUT.problemStatement.crises.map((crisis, i) => (
              <li key={i} className="flex gap-4 text-xl font-serif italic text-[#332d2b]/70 uppercase leading-relaxed">
                <AlertCircle className="shrink-0 text-[#9c1c22]" /> {crisis}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
        {DETAILED_ABOUT.values.map((val, i) => (
          <div key={i} className="p-10 bg-white border-2 border-[#332d2b]/5 rounded-[3rem] hover:border-[#eeb053] transition-all">
            <h4 className="text-2xl font-cinzel font-black text-[#9c1c22] mb-4 uppercase">{val.title}</h4>
            <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase">{val.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center p-20 bg-[#1a1a1a] text-white rounded-[5rem]">
        <Quote className="w-16 h-16 mx-auto text-[#eeb053] mb-8 opacity-20" />
        <h3 className="text-4xl font-serif font-black italic mb-6 uppercase">"{DETAILED_ABOUT.closing.quote}"</h3>
        <p className="text-xl font-cinzel font-black text-[#eeb053] uppercase tracking-widest">{DETAILED_ABOUT.closing.tagline}</p>
      </div>
    </div>
  </section>
);

// Fix: Implemented DonorView component
const DonorView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Support Our Mission</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Give <span className="text-[#eeb053] italic">Luv.</span></h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase">{DONOR_PAGE_CONTENT.different.content}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
        {DONOR_PAGE_CONTENT.impactPillars.map((pillar, i) => (
          <div key={i} className="p-12 bg-[#fdfaf6] rounded-[4rem] shadow-lg border-b-8 border-[#9c1c22]">
            <h3 className="text-2xl font-serif font-black text-[#332d2b] mb-6 uppercase leading-tight">{pillar.title}</h3>
            <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase">{pillar.description}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-20 items-start mb-32">
        <div className="bg-[#f9f5f0] p-16 rounded-[4rem]">
          <h3 className="text-3xl font-serif font-black mb-10 uppercase">{DONOR_PAGE_CONTENT.stewardship.title}</h3>
          <ul className="space-y-6">
            {DONOR_PAGE_CONTENT.stewardship.points.map((p, i) => (
              <li key={i} className="flex gap-4 text-xl font-serif italic text-[#332d2b]/70 uppercase">
                <ShieldCheck className="text-[#eeb053] shrink-0" /> {p}
              </li>
            ))}
          </ul>
          <p className="mt-12 text-[#9c1c22] font-cinzel font-black uppercase tracking-widest">{DONOR_PAGE_CONTENT.stewardship.closing}</p>
        </div>
        <div className="space-y-12">
          <div>
            <h3 className="text-3xl font-serif font-black mb-8 uppercase">{DONOR_PAGE_CONTENT.matters.title}</h3>
            <ul className="grid grid-cols-1 gap-4">
              {DONOR_PAGE_CONTENT.matters.points.map((p, i) => (
                <li key={i} className="flex gap-4 text-lg font-serif italic text-[#332d2b]/60 uppercase items-center">
                  <div className="w-2 h-2 rounded-full bg-[#9c1c22]" /> {p}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-12 bg-[#1a1a1a] text-white rounded-[3rem]">
            <h3 className="text-2xl font-cinzel font-black text-[#eeb053] mb-6 uppercase">{DONOR_PAGE_CONTENT.promise.title}</h3>
            <ul className="space-y-4 mb-8">
              {DONOR_PAGE_CONTENT.promise.points.map((p, i) => (
                <li key={i} className="flex gap-4 text-lg font-serif italic uppercase opacity-70">
                  <Heart className="text-[#9c1c22] shrink-0" size={20} /> {p}
                </li>
              ))}
            </ul>
            <p className="font-serif italic text-white/40 uppercase">{DONOR_PAGE_CONTENT.promise.tagline}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Fix: Implemented GalleryPageView component
const GalleryPageView = () => (
  <section className="py-24 md:py-48 bg-white pt-48">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Visual Narrative</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Impact <span className="text-[#eeb053] italic">Gallery.</span></h2>
      </div>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative group rounded-[3rem] overflow-hidden break-inside-avoid"
          >
            <img src={img.url} alt={img.title} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
              <h4 className="text-white text-2xl font-serif italic font-bold uppercase">{img.title}</h4>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Fix: Implemented ProgramsPageView component
const ProgramsPageView = () => (
  <section className="py-24 md:py-48 bg-[#fdfaf6] pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">The 7 Luv Acts</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Our <span className="text-[#9c1c22] italic">Programs.</span></h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">A deeper look at the specific initiatives driving our mission of restoration.</p>
      </div>

      <div className="space-y-24">
        {LUV_ACT_PROGRAMS.map((program, i) => (
          <motion.div 
            key={program.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row border-b-[20px]"
            style={{ borderColor: program.color }}
          >
            <div className="lg:w-1/3 bg-[#f9f5f0] p-20 flex flex-col items-center justify-center text-center">
              <span className="text-9xl font-cinzel font-black opacity-10 mb-8" style={{ color: program.color }}>{program.id}</span>
              <h3 className="text-4xl font-serif font-black uppercase leading-tight" style={{ color: program.color }}>{program.title}</h3>
            </div>
            <div className="lg:w-2/3 p-20 flex flex-col justify-center">
              <p className="text-2xl md:text-3xl font-serif italic text-[#332d2b]/70 leading-relaxed uppercase">{program.description}</p>
              <div className="mt-12 flex gap-4">
                 <div className="w-12 h-1 bg-[#eeb053]" />
                 <p className="font-cinzel font-bold text-sm tracking-widest uppercase opacity-40">Active Chapter Program</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const GlobalServicesView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Global Reach</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">International <span className="text-[#eeb053] italic">Architecture.</span></h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">
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
              {service.icon}
            </div>
            <h3 className="text-3xl font-serif font-black text-[#332d2b] mb-6 uppercase leading-tight">{service.title}</h3>
            <p className="text-xl font-serif text-[#332d2b]/70 italic mb-10 leading-relaxed uppercase">{service.description}</p>
            <div className="mt-auto pt-8 border-t border-black/5">
               <ul className="space-y-4">
                 {service.features.map((feature, idx) => (
                   <li key={idx} className="flex items-center gap-4 text-lg font-serif italic text-[#332d2b]/50 uppercase">
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
                  <h3 className="text-4xl md:text-5xl font-serif font-black text-[#332d2b] mb-10 leading-tight uppercase">{phase.title}</h3>
                  
                  <div className="space-y-12">
                    <div>
                      <h4 className="text-[#9c1c22] font-cinzel font-black text-xs uppercase tracking-widest mb-6">Strategic Goals</h4>
                      <ul className="space-y-4">
                        {phase.goals.map((goal, idx) => (
                          <li key={idx} className="flex gap-4 text-xl font-serif italic text-[#332d2b]/60 leading-relaxed uppercase">
                            <CheckCircle2 className="shrink-0 text-[#eeb053]" /> {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-[#fdfaf6] p-8 rounded-[2rem]">
                      <h4 className="text-[#332d2b] font-cinzel font-black text-xs uppercase tracking-widest mb-6">Targeted Outputs</h4>
                      <ul className="grid md:grid-cols-2 gap-4">
                        {phase.outputs.map((out, idx) => (
                          <li key={idx} className="flex gap-4 text-lg font-serif font-black text-[#332d2b] items-center uppercase">
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
        <h2 className="text-6xl md:text-[10rem] font-serif font-black text-white leading-none mb-8 uppercase">LUVWATTS</h2>
        <p className="text-2xl md:text-4xl font-serif italic text-white/60 max-w-4xl mx-auto leading-tight uppercase">
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
              <p className="text-xl font-serif italic opacity-60 group-hover:opacity-100 leading-relaxed uppercase">{item.definition}</p>
            </div>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap className="text-white" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 text-center p-20 bg-white text-[#1a1a1a] rounded-[5rem] shadow-[0_0_100px_rgba(238,176,83,0.2)]">
        <h3 className="text-4xl md:text-6xl font-serif font-black mb-10 leading-tight italic uppercase">The Kinetic Heartbeat of Restoration.</h3>
        <p className="text-2xl font-serif italic opacity-60 mb-12 max-w-2xl mx-auto uppercase">It is the energy that drives every program, every volunteer, and every life changed by the Foundation of Luv.</p>
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
                    <h3 className="text-white text-lg md:text-5xl font-serif italic font-bold uppercase">{HERO_IMAGES[currentSlide].caption}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-6 -right-6 md:-top-16 md:-right-16 w-24 h-24 md:w-56 md:h-56 z-40"><Logo className="w-full h-full drop-shadow-2xl" /></motion.div>
          </motion.div>
          
          <div className="mt-12">
            <h1 className="hero-text text-4xl md:text-[8rem] font-serif font-black leading-tight text-shine-crimson uppercase">Love in Action,<br /><span className="italic font-normal text-shine text-[#eeb053]">Change in Motion.</span></h1>
            <p className="mobile-p text-lg md:text-3xl text-[#332d2b]/70 mt-8 max-w-4xl mx-auto font-serif italic text-center uppercase">"We are the kinetic pulse of restoration, engineering pathways where human dignity is an unshakeable reality."</p>
            <div className="flex flex-col md:flex-row gap-6 justify-center mt-12">
              <button onClick={() => onNavigate('donate')} className="px-12 py-6 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-xl shadow-xl flex items-center gap-3 hover:bg-[#7a141a] transition-all uppercase">Show some Love <MoveRight /></button>
              <button onClick={() => onNavigate('aboutus')} className="px-12 py-6 glass-card rounded-full font-cinzel font-bold text-xl border border-[#eeb053]/50 flex items-center justify-center gap-3 hover:bg-white/60 transition-all uppercase">Explore Our Story <ArrowRight /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Mission & Vision Highlights */}
      <section className="py-24 md:py-40 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-[#fdfaf6] border-2 border-[#9c1c22]/10 flex flex-col items-center text-center shadow-lg"
          >
            <div className="mb-8">{MISSION_VISION.mission.icon}</div>
            <h3 className="text-4xl font-serif font-black text-[#332d2b] mb-6 uppercase tracking-tight">{MISSION_VISION.mission.title}</h3>
            <p className="text-xl font-serif italic text-[#332d2b]/60 leading-relaxed uppercase">{MISSION_VISION.mission.content}</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }}
            className="p-16 rounded-[4rem] bg-[#f9f5f0] border-2 border-[#eeb053]/20 flex flex-col items-center text-center shadow-lg"
          >
            <div className="mb-8">{MISSION_VISION.vision.icon}</div>
            <h3 className="text-4xl font-serif font-black text-[#332d2b] mb-6 uppercase tracking-tight">{MISSION_VISION.vision.title}</h3>
            <p className="text-xl font-serif italic text-[#332d2b]/60 leading-relaxed uppercase">{MISSION_VISION.vision.content}</p>
          </motion.div>
        </div>
      </section>

      {/* Intro Summary / The FOL Profile */}
      <section className="py-20 md:py-40 bg-[#fdfaf6] border-y border-[#332d2b]/5">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5">
            <div className="relative">
              <div className="p-4 bg-white rounded-[4rem] shadow-2xl border-4 border-[#eeb053]">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" className="rounded-[3.5rem] grayscale" alt="Foundation Origin" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-[#9c1c22] rounded-full flex items-center justify-center text-white shadow-xl">
                 <Anchor size={48} />
              </div>
            </div>
          </motion.div>
          <div className="lg:col-span-7">
            <span className="text-[#9c1c22] font-cinzel font-black tracking-widest text-xs uppercase mb-6 block">Our Heritage</span>
            <h2 className="text-4xl md:text-7xl font-serif font-black text-[#332d2b] leading-tight mb-8 uppercase">Engineering <span className="text-[#9c1c22] italic">Change</span> Since 2016.</h2>
            <p className="text-xl md:text-2xl text-[#332d2b]/80 font-serif leading-relaxed italic border-l-8 border-[#9c1c22] pl-10 uppercase mb-12">
              Foundation of Love (FOL) was created with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities. We bridge the gap between advocacy storytelling and systemic action.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-[#eeb053] shrink-0" />
                <p className="text-sm font-serif font-black uppercase">Independent Stewardship</p>
              </div>
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="text-[#eeb053] shrink-0" />
                <p className="text-sm font-serif font-black uppercase">Programmatic Innovation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Restore - Shoe Drive Highlight */}
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
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white p-6 rounded-full shadow-2xl border-4 border-[#9c1c22] w-48 h-48 flex items-center justify-center">
                    <Footprints size={80} className="text-[#9c1c22]" />
                  </div>
                </div>
              </motion.div>
            </div>
            <div>
              <span className="text-[#9c1c22] font-cinzel font-black tracking-widest text-xs uppercase mb-6 block">Community Outreach</span>
              <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-10 leading-tight uppercase">Let's Give <br />Those Feet <span className="text-[#9c1c22] italic">Shoes.</span></h2>
              <p className="text-2xl font-serif italic text-[#332d2b]/60 mb-12 uppercase leading-relaxed">
                Our community efforts where we show love and help those in need. Simple acts of restoration create waves of progress. Providing dignity through direct assistance is the first step toward lasting community empowerment.
              </p>
              <div className="bg-[#eeb053]/20 p-8 rounded-[2rem] border-l-8 border-[#eeb053]">
                <p className="text-xl font-serif font-bold italic text-[#332d2b] uppercase">"We believe humanity deserves more than awareness; it deserves a system that acts."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 Luv Acts - Core Architecture */}
      <section className="py-24 md:py-40 bg-[#f9f5f0] border-y border-[#332d2b]/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.4em] text-xs uppercase mb-4 block">Institutional Compassion</span>
          <h2 className="text-5xl md:text-[7rem] font-serif font-black text-[#332d2b] uppercase leading-none mb-12">The <span className="text-[#9c1c22]">7</span> Luv Acts</h2>
          <p className="text-2xl font-serif italic text-[#332d2b]/50 max-w-4xl mx-auto mb-20 uppercase">Our foundational framework for community restoration and individual empowerment.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LUV_ACT_PROGRAMS.map((act, i) => (
              <motion.div 
                key={act.id} 
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-12 rounded-[4rem] border-2 border-transparent hover:border-[#eeb053] transition-all bg-white group shadow-xl text-left flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-8">
                  <span className="text-5xl font-cinzel font-black text-[#9c1c22]/20 group-hover:text-[#9c1c22] transition-colors uppercase">{act.id}</span>
                  <div className="w-10 h-1 bg-[#eeb053] group-hover:w-20 transition-all" />
                </div>
                <h3 className="text-3xl font-serif font-black text-[#332d2b] mb-6 uppercase tracking-tight leading-none">{act.title}</h3>
                <p className="text-lg text-[#332d2b]/60 font-serif italic leading-relaxed uppercase">{act.description}</p>
              </motion.div>
            ))}
          </div>
          <div className="mt-20">
            <button onClick={() => onNavigate('programs')} className="px-16 py-8 bg-[#1a1a1a] text-white rounded-full font-cinzel font-black text-xl hover:bg-[#9c1c22] transition-all uppercase flex items-center justify-center gap-4 mx-auto shadow-2xl">
              Deep Dive Into Our Programs <ArrowRight />
            </button>
          </div>
        </div>
      </section>

      {/* Leadership Full Quote Section */}
      <section className="py-24 md:py-48 bg-[#1a1a1a] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none grayscale brightness-50">
           <Logo className="w-full h-full scale-150" />
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <Quote className="w-24 h-24 mx-auto text-[#eeb053] opacity-20 mb-12" />
          <motion.h2 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-3xl md:text-6xl font-serif font-black leading-tight italic mb-16 uppercase"
          >
            "{LEADERSHIP_MESSAGE.content}"
          </motion.h2>
          <div className="flex items-center justify-center gap-8">
            <div className="h-px w-20 bg-[#9c1c22]" />
            <div>
               <p className="text-3xl font-cinzel font-black text-[#eeb053] uppercase">{LEADERSHIP_MESSAGE.author}</p>
               <p className="text-xl font-serif italic opacity-40 uppercase">{LEADERSHIP_MESSAGE.tagline}</p>
            </div>
            <div className="h-px w-20 bg-[#9c1c22]" />
          </div>
        </div>
      </section>

      {/* LUVWATTS Movement Section - Interactive Block */}
      <section className="py-24 md:py-40 bg-white border-y border-[#332d2b]/5 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="flex items-center gap-4 mb-8">
                <Zap className="text-[#eeb053] fill-[#eeb053]" />
                <span className="text-[#9c1c22] font-cinzel font-black tracking-widest text-xs uppercase">The Kinetic Heartbeat</span>
              </div>
              <h2 className="text-5xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-10 leading-none uppercase">LUVWATTS <span className="text-[#9c1c22] italic">ENERGY.</span></h2>
              <p className="text-2xl font-serif italic text-[#332d2b]/60 mb-12 uppercase leading-relaxed">
                {LUVWATTS_CONTENT.description} It represents the radiant energy of love when people come together. Our movement is structured to accelerate transformation.
              </p>
              <div className="grid grid-cols-2 gap-10 mb-16">
                 <div className="p-8 rounded-3xl bg-[#fdfaf6] border-l-4 border-[#9c1c22]">
                   <h4 className="text-xl font-cinzel font-black mb-2 uppercase">RESTORATION</h4>
                   <p className="text-sm font-serif italic opacity-50 uppercase">Active healing systems.</p>
                 </div>
                 <div className="p-8 rounded-3xl bg-[#f9f5f0] border-l-4 border-[#eeb053]">
                   <h4 className="text-xl font-cinzel font-black mb-2 uppercase">VELOCITY</h4>
                   <p className="text-sm font-serif italic opacity-50 uppercase">Fast-tracked progress.</p>
                 </div>
              </div>
              <button onClick={() => onNavigate('luvwatts')} className="px-14 py-8 bg-[#1a1a1a] text-white rounded-full font-cinzel font-black text-xl hover:bg-[#332d2b] transition-all flex items-center gap-6 uppercase shadow-xl">
                The LUVWATTS Movement <MoveRight />
              </button>
            </div>
            <div className="relative">
               {/* Visual Heart Pulse Element */}
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 whileInView={{ opacity: 1, scale: 1 }} 
                 viewport={{ once: true }}
                 className="aspect-square bg-gradient-to-br from-[#9c1c22] to-[#df8c3d] rounded-[6rem] shadow-3xl p-1 flex items-center justify-center relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-20 mix-blend-overlay"></div>
                 <div className="w-full h-full bg-[#1a1a1a] rounded-[5.8rem] flex items-center justify-center p-16 relative">
                   <div className="relative group cursor-pointer">
                      <Heart className="w-64 h-64 text-[#9c1c22] blur-xl absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity" />
                      <Heart className="w-64 h-64 text-[#eeb053] relative z-10 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                          <Zap className="text-white w-24 h-24 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
                        </motion.div>
                      </div>
                   </div>
                 </div>
                 <div className="absolute bottom-16 right-16 text-right">
                    <p className="font-cinzel font-black text-6xl text-white tracking-[0.2em] leading-none mb-2">017</p>
                    <p className="font-serif italic text-white/40 uppercase tracking-widest text-xs">Chapter Energy</p>
                 </div>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="py-24 md:py-48 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16">
            {STATS.map((stat, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-7xl md:text-9xl font-serif font-black text-[#9c1c22] mb-6 leading-none">
                  <AnimatedNumber value={stat.value} />
                  <span className="text-[#eeb053]">{stat.suffix}</span>
                </div>
                <h4 className="font-cinzel font-black text-[12px] tracking-[0.4em] uppercase mb-6 text-[#332d2b]">{stat.label}</h4>
                <div className="h-0.5 w-12 bg-[#9c1c22] mx-auto mb-6" />
                <p className="font-serif italic text-xl text-[#332d2b]/40 uppercase leading-snug">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Video Call to Action */}
      <section className="py-24 md:py-48 bg-[#f9f5f0] text-center overflow-hidden border-y border-black/5">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] uppercase mb-16 leading-none">Witness the <span className="text-[#9c1c22] italic">Love.</span></h2>
          <div className="relative aspect-video rounded-[5rem] overflow-hidden border-[24px] border-white shadow-2xl bg-black">
             <iframe className="w-full h-full" src="https://www.youtube.com/embed/XxfFvLERt7o" title="Impact Documentary" frameBorder="0" allowFullScreen></iframe>
          </div>
          <div className="mt-16">
             <button onClick={() => onNavigate('gallery')} className="text-2xl font-cinzel font-black text-[#9c1c22] uppercase tracking-widest hover:gap-8 transition-all flex items-center justify-center gap-4 mx-auto">
                Explore The Gallery <ArrowRight />
             </button>
          </div>
        </div>
      </section>

      {/* Roadmap Teaser */}
      <section className="py-24 md:py-48 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <Compass className="w-16 h-16 mx-auto text-[#eeb053] mb-12" />
          <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] uppercase mb-12 leading-none">Where We Are <span className="text-[#9c1c22]">Headed.</span></h2>
          <p className="text-2xl font-serif italic text-[#332d2b]/60 mb-16 uppercase">Our strategic trajectory is aimed at global restoration and sustainable empowerment.</p>
          <button onClick={() => onNavigate('roadmap')} className="px-16 py-8 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-xl hover:bg-[#1a1a1a] transition-all uppercase shadow-2xl">
             View Strategic Roadmap
          </button>
        </div>
      </section>
    </div>
  );
};

// ... DetailedAboutView, DonorView, GlobalServicesView, RoadmapView, LUVWATTSView, ProgramsPageView are now implemented above ...

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
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="grid lg:grid-cols-4 gap-16 mb-24 items-start">
            <div className="lg:col-span-2">
              <div onClick={() => handleNavigate('home')} className="cursor-pointer inline-block mb-10"><Logo className="w-24 h-24 md:w-56 md:h-56 brightness-110 drop-shadow-2xl mx-auto md:mx-0" /></div>
              <p className="text-2xl text-[#fdfaf6]/60 max-w-lg mb-10 font-serif italic uppercase mx-auto md:mx-0">"Restoring human dignity and transforming global communities through structured compassion."</p>
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
