import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, ArrowRight, Sparkles, MoveRight, ChevronLeft, Calendar, Award, 
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Image as LucideImage,
  Target, Eye, ShieldCheck, TrendingUp, AlertCircle, Building2, Workflow, Lightbulb, Heart, Info, Phone, MapPin,
  CheckCircle2, Footprints, Zap, Star, Activity, LayoutGrid, Newspaper, MessageSquare, Shield, PenTool,
  Quote, Compass, Anchor, Mic2, UsersRound, Wallet, Stethoscope, Baby, Wallet2, Crosshair,
  Users2 as DemographyIcon, TrendingUp as GrowthIcon, Briefcase, Home as HomeIcon, HeartPulse, GraduationCap as SchoolIcon, Coins,
  Play, Mail, Handshake, HeartHandshake, Send, ChevronUp, Cpu, ShieldAlert
} from 'lucide-react';
import { 
  NAVIGATION, STRATEGIC_PHASES, STATS, COLORS, HERO_IMAGES, GALLERY_IMAGES,
  MISSION_VISION, DETAILED_ABOUT, DONOR_PAGE_CONTENT, LUV_ACT_PROGRAMS, LEADERSHIP_MESSAGE, LUVWATTS_CONTENT,
  GLOBAL_SERVICES_DATA, VIDEO_RESOURCES, CORE_VALUES
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
  if (error) return <LogoFallback className={className} style={style} />;
  return (
    <img src="logo.svg" alt="Foundation of Luv" className={className} style={style} onError={() => setError(true)} />
  );
};

const LoadingScreen = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const burstInterval = setInterval(() => {
      setBursts(prev => [...prev, { id: Date.now(), x: Math.random() * 100, y: Math.random() * 100 }]);
      setTimeout(() => {
        setBursts(prev => prev.slice(1));
      }, 2000);
    }, 600);
    return () => clearInterval(burstInterval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      animate={{ 
        backgroundColor: ["#fdfaf6", "#9c1c22", "#122d4f", "#eeb053", "#fdfaf6"],
      }}
      transition={{ 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1],
        backgroundColor: { duration: 8, repeat: Infinity, ease: "linear" } 
      }}
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none opacity-30">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 0, scale: 0.5 }}
            animate={{ y: "-10vh", opacity: [0, 1, 1, 0], rotate: 360 }}
            transition={{ 
              duration: 4 + Math.random() * 4, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear" 
            }}
            className="absolute text-white"
          >
            <Heart size={20 + Math.random() * 40} fill="currentColor" />
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {bursts.map(burst => (
            <div key={burst.id} className="absolute" style={{ left: `${burst.x}%`, top: `${burst.y}%` }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1.5, 0], 
                    opacity: 0,
                    x: Math.cos((i * 45) * Math.PI / 180) * 100,
                    y: Math.sin((i * 45) * Math.PI / 180) * 100
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]"
                />
              ))}
            </div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative z-10"
      >
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-white blur-[80px] rounded-full"
        />
        
        <motion.div
          animate={{ rotateY: [0, 360], scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 md:w-64 md:h-64"
        >
          <Logo className="w-full h-full drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
        </motion.div>
      </motion.div>

      <div className="mt-16 w-64 md:w-80 relative h-1 bg-white/20 overflow-hidden rounded-full z-10">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 bg-white shadow-[0_0_15px_white]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-8 text-center z-10"
      >
        <span className="block text-white font-cinzel font-black tracking-[0.5em] text-[12px] md:text-[14px] uppercase drop-shadow-lg">
          LUV-ACT INITIALIZING
        </span>
        <span className="block mt-2 text-white/70 font-serif italic text-xl md:text-2xl uppercase">
          Love in Action, Change in Motion.
        </span>
      </motion.div>
    </motion.div>
  );
};

const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9 }}
    className="fixed bottom-10 right-4 md:right-10 z-[200] flex items-center gap-4 bg-[#9c1c22] text-white px-8 py-4 rounded-2xl shadow-2xl border-2 border-[#eeb053]"
  >
    <CheckCircle2 className="text-[#eeb053]" size={24} />
    <p className="font-cinzel font-bold text-sm tracking-wider uppercase">{message}</p>
    <button onClick={onClose} className="ml-4 opacity-50 hover:opacity-100 transition-opacity">
      <X size={20} />
    </button>
  </motion.div>
);

const ScrollToTopButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisible = () => {
      if (window.scrollY > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisible);
    return () => window.removeEventListener('scroll', toggleVisible);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-4 md:right-10 z-[190] w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-[#9c1c22] text-[#9c1c22] rounded-full flex items-center justify-center shadow-2xl hover:bg-[#9c1c22] hover:text-white transition-all group"
          aria-label="Return to top"
        >
          <ChevronUp className="group-hover:-translate-y-1 transition-transform" size={28} />
        </motion.button>
      )}
    </AnimatePresence>
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

// --- Rich Content Components ---

const PartnersMarquee = () => {
  const partners = ["Microsoft", "Amazon", "OpenAI", "Anthropic", "Google", "Meta", "Harvard", "MIT", "Stanford", "UNICEF", "WHO", "USAID"];
  return (
    <div className="py-20 bg-white border-y border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.4em] text-[10px] uppercase">Institutional Alliances & Strategic Partners</span>
      </div>
      <div className="relative flex overflow-x-hidden">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 py-4 items-center"
        >
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-3xl md:text-5xl font-serif font-black uppercase text-[#332d2b]/10 hover:text-[#9c1c22] transition-colors cursor-default select-none tracking-tighter">
              {p}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const LeadershipVision = () => {
  return (
    <section className="py-24 md:py-40 bg-[#fdfaf6] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-20 items-center">
        <div className="lg:col-span-5 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="aspect-[3/4] rounded-[5rem] overflow-hidden shadow-3xl border-8 border-white relative z-10 flex items-center justify-center bg-white p-12 md:p-20"
          >
            <Logo className="w-full h-auto drop-shadow-2xl" />
          </motion.div>
          <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[#eeb053] rounded-full flex items-center justify-center p-8 shadow-2xl z-20">
            <Logo className="w-full h-full invert brightness-0" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <Quote className="w-16 h-16 text-[#eeb053] mb-8 opacity-20" />
          <h3 className="text-3xl md:text-5xl font-serif font-black text-[#332d2b] leading-tight uppercase mb-10">
            {LEADERSHIP_MESSAGE.title}
          </h3>
          <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/70 leading-relaxed uppercase mb-12">
            "{LEADERSHIP_MESSAGE.content}"
          </p>
          <div className="flex items-center gap-6">
            <div className="h-px w-12 bg-[#9c1c22]" />
            <div>
              <p className="font-cinzel font-black text-sm uppercase tracking-widest text-[#9c1c22]">{LEADERSHIP_MESSAGE.author}</p>
              <p className="font-serif italic text-lg uppercase text-[#eeb053]">{LEADERSHIP_MESSAGE.tagline}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const EngagementPathways = () => {
  const pathways = [
    { title: "Volunteer", icon: <Users size={32} />, desc: "Join our kinetic pulse on the frontlines of restoration." },
    { title: "Corporate", icon: <Handshake size={32} />, desc: "Institutionalize impact through strategic philanthropy." },
    { title: "Sustainer", icon: <HeartHandshake size={32} />, desc: "Fuel long-term change with recurring monthly support." }
  ];
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
        {pathways.map((p, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="p-12 rounded-[4rem] bg-[#fdfaf6] border-2 border-transparent hover:border-[#eeb053] transition-all shadow-xl group text-center"
          >
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 text-[#9c1c22] shadow-md group-hover:scale-110 transition-transform">
              {p.icon}
            </div>
            <h4 className="text-2xl font-serif font-black uppercase mb-4">{p.title}</h4>
            <p className="text-lg font-serif italic text-[#332d2b]/50 uppercase mb-8">{p.desc}</p>
            <button className="text-[10px] font-cinzel font-black text-[#9c1c22] uppercase tracking-[0.4em] flex items-center gap-3 mx-auto">
              Get Started <MoveRight size={14} />
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const NewsletterSection = () => (
  <section className="py-24 bg-[#9c1c22] relative overflow-hidden">
    <div className="absolute inset-0 opacity-5">
      <Logo className="w-full h-full scale-150 rotate-12" />
    </div>
    <div className="max-w-4xl mx-auto px-4 text-center relative z-10 text-white">
      <Mail className="w-12 h-12 mx-auto mb-8 text-[#eeb053]" />
      <h3 className="text-4xl md:text-6xl font-serif font-black uppercase mb-8 leading-none">Stay In <span className="text-[#eeb053] italic">Motion.</span></h3>
      <p className="text-xl font-serif italic uppercase mb-12 opacity-70 tracking-widest">Join the LUV-MAIL movement for monthly restoration insights.</p>
      <div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
        <input 
          type="email" 
          placeholder="ENTER YOUR CORRESPONDENCE EMAIL" 
          className="flex-grow bg-white/10 border-2 border-white/20 px-8 py-5 rounded-full text-white font-cinzel text-xs tracking-widest focus:outline-none focus:border-[#eeb053] transition-all"
        />
        <button className="bg-white text-[#9c1c22] px-12 py-5 rounded-full font-cinzel font-black tracking-widest text-xs hover:bg-[#1a1a1a] hover:text-white transition-all">ENROLL</button>
      </div>
    </div>
  </section>
);

// --- Detailed Views ---

const HomeView = ({ onNavigate }: { onNavigate: (id: string) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length), 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative z-10">
      <header className="relative w-full pt-32 pb-16 md:pt-64 md:pb-32 lg:pt-72 lg:pb-40 min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative group p-0 md:p-12 w-full max-w-[850px]">
            <div className="relative aspect-video rounded-[2rem] md:rounded-[4rem] overflow-hidden border-[6px] md:border-[16px] border-white shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="absolute inset-0">
                  <img src={HERO_IMAGES[currentSlide].url} alt={HERO_IMAGES[currentSlide].caption} className="w-full h-full object-cover brightness-75" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/80 to-transparent text-left">
                    <span className="text-[#eeb053] font-cinzel font-black tracking-[0.4em] text-[8px] md:text-[10px] uppercase">Movement Chapter</span>
                    <h3 className="text-white text-base md:text-4xl font-serif italic font-bold uppercase">{HERO_IMAGES[currentSlide].caption}</h3>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-4 -right-4 md:-top-12 md:-right-12 w-16 h-16 md:w-44 md:h-44 z-40"><Logo className="w-full h-full drop-shadow-2xl" /></motion.div>
          </motion.div>
          <div className="mt-8 md:mt-12">
            <h1 className="hero-text text-3xl md:text-[6rem] font-serif font-black leading-tight text-shine-crimson uppercase">Love in Action,<br /><span className="italic font-normal text-shine text-[#eeb053]">Change in Motion.</span></h1>
            <p className="mobile-p text-sm md:text-2xl text-[#332d2b]/70 mt-6 max-w-4xl mx-auto font-serif italic text-center uppercase">"We are the kinetic pulse of restoration, engineering pathways where human dignity is an unshakeable reality."</p>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center mt-8 md:mt-12">
              <button onClick={() => on