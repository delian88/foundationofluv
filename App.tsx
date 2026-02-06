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
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[300] bg-[#fdfaf6] flex flex-col items-center justify-center overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="relative"
      >
        {/* Soft pulsing glow behind the logo */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#eeb053] blur-[100px] rounded-full"
        />
        
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-48 h-48 md:w-64 md:h-64"
        >
          <Logo className="w-full h-full drop-shadow-3xl" />
        </motion.div>
      </motion.div>

      <div className="mt-16 w-64 md:w-80 relative h-0.5 bg-[#332d2b]/10 overflow-hidden rounded-full">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "0%" }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 bg-[#9c1c22]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-8 text-center"
      >
        <span className="block text-[#9c1c22] font-cinzel font-black tracking-[0.4em] text-[10px] md:text-[12px] uppercase">
          Initializing Restoration
        </span>
        <span className="block mt-2 text-[#332d2b]/40 font-serif italic text-lg md:text-xl uppercase">
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

// --- New Rich Content Components ---

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

// --- Contact Page View ---

const ContactView = ({ onSubmitSuccess }: { onSubmitSuccess: () => void }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitSuccess();
  };

  return (
    <section className="pt-48 pb-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="text-center mb-24">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Reach Out</motion.span>
          <h2 className="text-6xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-12 uppercase leading-none tracking-tighter">
            Contact <span className="text-[#eeb053] italic">Us.</span>
          </h2>
          <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">
            Let's forge pathways of restoration together. Our team is ready to respond to your inquiries.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 md:gap-32 items-start">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="space-y-16">
            <div>
              <h3 className="text-3xl font-serif font-black uppercase mb-8">Headquarters</h3>
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[#fdfaf6] rounded-2xl text-[#9c1c22] shadow-sm"><MapPin size={24} /></div>
                  <div>
                    <p className="text-[10px] font-cinzel font-black uppercase tracking-widest text-[#eeb053] mb-2">Location</p>
                    <p className="text-xl font-serif italic text-[#332d2b] uppercase">#9960 Raven Hurst Road, Middle River MD 21221</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[#fdfaf6] rounded-2xl text-[#9c1c22] shadow-sm"><Phone size={24} /></div>
                  <div>
                    <p className="text-[10px] font-cinzel font-black uppercase tracking-widest text-[#eeb053] mb-2">Voice</p>
                    <p className="text-xl font-serif italic text-[#332d2b] uppercase">443-402-5802</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-[#fdfaf6] rounded-2xl text-[#9c1c22] shadow-sm"><Mail size={24} /></div>
                  <div>
                    <p className="text-[10px] font-cinzel font-black uppercase tracking-widest text-[#eeb053] mb-2">Correspondence</p>
                    <p className="text-xl font-serif italic text-[#332d2b] uppercase">hello@foundationofluv.org</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-12 bg-[#f9f5f0] rounded-[4rem] border-2 border-[#eeb053]/20 shadow-xl">
              <h4 className="text-2xl font-cinzel font-black text-[#9c1c22] mb-6 uppercase">Operating Hours</h4>
              <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase leading-relaxed">
                Monday — Friday: 9:00 AM – 6:00 PM EST<br />
                Saturday: 10:00 AM – 2:00 PM EST<br />
                Sunday: Emergency Response Only
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-10 md:p-16 rounded-[4rem] shadow-3xl border border-black/5">
            <h3 className="text-3xl font-serif font-black uppercase mb-12">Send a Message</h3>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-cinzel font-black uppercase tracking-widest opacity-40 ml-4">Full Name</label>
                  <input required type="text" placeholder="YOUR NAME" className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-5 rounded-full font-serif italic uppercase outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-cinzel font-black uppercase tracking-widest opacity-40 ml-4">Email Address</label>
                  <input required type="email" placeholder="EMAIL@DOMAIN.COM" className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-5 rounded-full font-serif italic uppercase outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-cinzel font-black uppercase tracking-widest opacity-40 ml-4">Subject of Interest</label>
                <select className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-5 rounded-full font-serif italic uppercase outline-none appearance-none transition-all cursor-pointer">
                  <option>GENERAL INQUIRY</option>
                  <option>VOLUNTEER OPPORTUNITIES</option>
                  <option>CORPORATE PARTNERSHIPS</option>
                  <option>PROGRAM ASSISTANCE</option>
                  <option>PRESS & MEDIA</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-cinzel font-black uppercase tracking-widest opacity-40 ml-4">Message Content</label>
                <textarea required rows={5} placeholder="TELL US HOW WE CAN RESTORE TOGETHER..." className="w-full bg-[#fdfaf6] border-2 border-transparent focus:border-[#eeb053] px-8 py-6 rounded-[2rem] font-serif italic uppercase outline-none transition-all resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-[#9c1c22] text-white py-6 rounded-full font-cinzel font-black uppercase tracking-[0.3em] shadow-xl hover:bg-[#1a1a1a] transition-all flex items-center justify-center gap-4">
                Send Message <Send size={20} />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// --- Video Component ---
const VideoSection = ({ videoId, title, description }: { videoId: string, title: string, description?: string }) => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      {title && (
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-5xl font-serif font-black text-[#332d2b] uppercase mb-4">{title}</h3>
          {description && <p className="text-xl font-serif italic text-[#332d2b]/60 uppercase">{description}</p>}
        </div>
      )}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative aspect-video rounded-[3rem] overflow-hidden shadow-3xl border-[12px] md:border-[20px] border-white group"
      >
        <iframe 
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <div className="absolute inset-0 pointer-events-none border-[1px] border-black/5 rounded-[2rem] md:rounded-[4rem]"></div>
      </motion.div>
    </div>
  );
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
              <button onClick={() => onNavigate('donate')} className="px-10 py-5 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-lg shadow-xl flex items-center gap-3 hover:bg-[#7a141a] transition-all uppercase">Show some Love <MoveRight /></button>
              <button onClick={() => onNavigate('aboutus')} className="px-10 py-5 glass-card rounded-full font-cinzel font-bold text-lg border border-[#eeb053]/50 flex items-center justify-center gap-3 hover:bg-white/60 transition-all uppercase">Explore Our Story <ArrowRight /></button>
            </div>
          </div>
        </div>
      </header>

      {/* Partners Showcase */}
      <PartnersMarquee />

      {/* LET'S GIVE THOSE FEET Shoes Section */}
      <section className="min-h-screen py-16 md:py-24 bg-white relative overflow-hidden border-y border-black/5 flex items-center">
        <div className="max-w-7xl mx-auto px-4 relative z-10 w-full">
          <div className="text-center mb-10 md:mb-16 relative">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl md:text-[6rem] font-black text-[#1a1a1a] leading-[0.8] mb-0 uppercase tracking-[-0.05em] drop-shadow-md">
                LET'S GIVE <br className="hidden md:block" /> THOSE FEET
              </h2>
              <div className="relative inline-block mt-1 md:mt-[-2rem]">
                <h3 className="text-2xl md:text-[5rem] font-serif italic text-[#9c1c22] leading-none uppercase drop-shadow-sm font-bold">
                  Shoes
                </h3>
              </div>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-square max-w-[240px] md:max-w-[450px] mx-auto p-4 md:p-8 bg-white rounded-full shadow-inner border-[1px] border-black/5">
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative w-full h-full">
                      {[
                        { url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400", pos: "top-0 left-1/2 -translate-x-1/2" },
                        { url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=400", pos: "top-1/4 right-0" },
                        { url: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&q=80&w=400", pos: "bottom-0 right-1/4" },
                        { url: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=400", pos: "bottom-0 left-1/4" },
                        { url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&q=80&w=400", pos: "top-1/4 left-0" },
                        { url: "https://images.unsplash.com/photo-1533681904393-9ab6eba7b4d0?auto=format&fit=crop&q=80&w=400", pos: "bottom-1/4 left-0" },
                      ].map((img, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.5 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          whileHover={{ scale: 1.1, zIndex: 50 }}
                          className={`absolute w-10 h-10 md:w-28 md:h-28 rounded-full overflow-hidden border-2 md:border-4 border-white shadow-lg transition-all duration-500 cursor-pointer ${img.pos}`}
                        >
                          <img src={img.url} className="w-full h-full object-cover grayscale hover:grayscale-0" alt="Shoe drive donation" />
                        </motion.div>
                      ))}
                   </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <motion.div 
                    animate={{ scale: [1, 1.05, 1] }} 
                    className="w-16 h-16 md:w-44 md:h-44 bg-white rounded-full shadow-[0_0_40px_rgba(156,28,34,0.1)] flex items-center justify-center p-2 md:p-5 border-[1px] border-[#eeb053] relative"
                  >
                    <Logo className="w-full h-full z-10" />
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-4 md:space-y-8 relative">
              <motion.div 
                initial={{ rotate: -5, scale: 0.8, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                className="relative z-20"
              >
                <div className="bg-[#eeb053] text-[#9c1c22] p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                  <h4 className="text-lg md:text-3xl font-black uppercase leading-tight italic text-center text-shine-crimson">
                    Our Community efforts <br /> where we show love <br /> and help
                  </h4>
                </div>
              </motion.div>
              <div className="pl-6 border-l-4 border-[#9c1c22]">
                <p className="text-xl font-serif italic text-[#332d2b]/60 uppercase leading-relaxed">
                  "At Foundation of Luv (FOL), providing dignity is the first step toward lasting community empowerment."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Vision */}
      <LeadershipVision />

      {/* Featured Video Section */}
      <section className="bg-[#f9f5f0] border-y border-[#332d2b]/5">
        <VideoSection 
          videoId={VIDEO_RESOURCES[0].id} 
          title="Featured Impact Story" 
          description={VIDEO_RESOURCES[0].description} 
        />
      </section>

      {/* SOLID GROWTH - Poster Section */}
      <section className="min-h-screen py-12 md:py-16 bg-[#1a0c1a] text-white relative overflow-hidden flex items-center border-y border-[#ffffff]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b4d] via-[#8b1a1a] to-[#df8c3d] opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#1a0c1a_100%)] opacity-80" />
        
        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 flex flex-col h-full max-h-screen justify-between">
           <div className="flex justify-between items-center opacity-40 px-2 mb-6">
             <div className="flex items-center gap-2">
               <Logo className="w-5 h-5 md:w-6 md:h-6 rounded-full" />
               <span className="text-[6px] md:text-[9px] font-cinzel tracking-[0.2em] md:tracking-[0.4em] uppercase">FOL Profile</span>
             </div>
             <div className="h-px flex-grow mx-4 md:mx-10 bg-white/20" />
             <span className="text-[6px] md:text-[9px] font-cinzel tracking-[0.2em] md:tracking-[0.4em] uppercase">LUVWATTS</span>
           </div>

           <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center flex-grow">
             <div className="lg:col-span-4 flex flex-col items-center lg:items-end">
                <motion.h2 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-2xl md:text-[4.5rem] font-serif font-black leading-[0.85] tracking-tighter text-center lg:text-right uppercase flex flex-col gap-1 md:gap-2"
                >
                  <span className="text-white">Solid</span>
                  <span className="text-white">Growth,</span>
                  <span className="text-[#eeb053] italic">Love in</span>
                  <span className="text-white">Action,</span>
                  <span className="text-white">Change</span>
                  <span className="text-[#9c1c22] italic">in Motion</span>
                </motion.h2>
             </div>

             <div className="lg:col-span-4 flex justify-center relative">
               <motion.div 
                 animate={{ scale: [1, 1.03, 1] }}
                 transition={{ duration: 5, repeat: Infinity }}
                 className="relative w-full max-w-[200px] md:max-w-[340px] aspect-[4/5] flex items-center justify-center"
               >
                 <svg viewBox="0 0 400 500" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] md:drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
                    <filter id="neonGlowS">
                      <feGaussianBlur stdDeviation="6" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <path d="M200,450 C100,350 50,250 50,150 C50,80 120,50 200,120 C280,50 350,80 350,150 C350,250 300,350 200,450 Z" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
                    <path d="M200,440 C110,345 60,245 60,155 C60,95 125,65 200,130 C275,65 340,95 340,155 C340,245 290,345 200,440 Z" fill="none" stroke="#eeb053" strokeWidth="4" filter="url(#neonGlowS)" opacity="0.7" />
                    <path d="M200,440 C110,345 60,245 60,155 C60,95 125,65 200,130 C275,65 340,95 340,155 C340,245 290,345 200,440 Z" fill="none" stroke="#ffffff" strokeWidth="1.5" />
                 </svg>
                 <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                   <Logo className="w-12 h-12 md:w-24 md:h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                 </div>
               </motion.div>
             </div>
           </div>
        </div>
      </section>

      {/* Engagement Pathways */}
      <EngagementPathways />

      {/* Impact Stats */}
      <section className="py-24 md:py-48 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <div className="text-6xl md:text-9xl font-serif font-black text-[#9c1c22] mb-4 md:mb-6 leading-none">
                  <AnimatedNumber value={stat.value} />
                  <span className="text-[#eeb053]">{stat.suffix}</span>
                </div>
                <h4 className="font-cinzel font-black text-[10px] md:text-[12px] tracking-[0.4em] uppercase mb-4 md:mb-6 text-[#332d2b]">{stat.label}</h4>
                <div className="h-0.5 w-10 md:w-12 bg-[#9c1c22] mx-auto mb-4 md:mb-6" />
                <p className="font-serif italic text-lg md:text-xl text-[#332d2b]/40 uppercase leading-snug">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

const DetailedAboutView = () => {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.05]);

  return (
    <section className="bg-white pt-48 pb-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <header className="text-center mb-32">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Organizational Profile</motion.span>
          <h2 className="text-5xl md:text-[8rem] font-serif font-black text-[#332d2b] mb-12 uppercase leading-none tracking-tighter">
            {DETAILED_ABOUT.header.split(' ')[0]} <span className="text-[#9c1c22] italic">{DETAILED_ABOUT.header.split(' ').slice(1).join(' ')}</span>
          </h2>
          <div className="h-2 w-32 bg-[#eeb053] mx-auto rounded-full mb-12" />
          <p className="text-2xl md:text-3xl font-serif italic text-[#332d2b]/70 max-w-5xl mx-auto uppercase leading-relaxed">
            {DETAILED_ABOUT.intro}
          </p>
        </header>

        {/* Problem Statement Section */}
        <div className="grid lg:grid-cols-12 gap-20 mb-40 items-center">
          <div className="lg:col-span-7">
            <h3 className="text-4xl font-serif font-black text-[#332d2b] mb-8 uppercase flex items-center gap-4">
              <ShieldAlert className="text-[#9c1c22]" size={40} />
              {DETAILED_ABOUT.problemStatement.title}
            </h3>
            <p className="text-2xl font-serif italic text-[#332d2b]/70 mb-10 leading-relaxed uppercase">
              {DETAILED_ABOUT.problemStatement.summary}
            </p>
            <ul className="space-y-6">
              {DETAILED_ABOUT.problemStatement.crises.map((crisis, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 text-xl font-serif italic text-[#332d2b]/60 uppercase"
                >
                  <div className="w-1.5 h-1.5 bg-[#9c1c22] rounded-full mt-3 shrink-0" />
                  {crisis}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 relative">
            <motion.div style={{ scale }} className="rounded-[4rem] overflow-hidden shadow-2xl border-4 border-[#eeb053]">
               <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200" alt="Foundation Community" className="w-full h-full grayscale hover:grayscale-0 transition-all duration-1000" />
            </motion.div>
          </div>
        </div>

        {/* Mission & Vision & Values */}
        <div className="grid lg:grid-cols-2 gap-16 mb-40">
           <div className="p-16 bg-[#fdfaf6] rounded-[4rem] border-2 border-[#9c1c22]/10 shadow-xl">
             <div className="mb-8">{MISSION_VISION.mission.icon}</div>
             <h3 className="text-4xl font-serif font-black mb-6 uppercase">{MISSION_VISION.mission.title}</h3>
             <p className="text-2xl font-serif italic text-[#332d2b]/70 uppercase leading-relaxed">{MISSION_VISION.mission.content}</p>
           </div>
           <div className="p-16 bg-[#fdfaf6] rounded-[4rem] border-2 border-[#eeb053]/10 shadow-xl">
             <div className="mb-8">{MISSION_VISION.vision.icon}</div>
             <h3 className="text-4xl font-serif font-black mb-6 uppercase">{MISSION_VISION.vision.title}</h3>
             <p className="text-2xl font-serif italic text-[#332d2b]/70 uppercase leading-relaxed">{MISSION_VISION.vision.content}</p>
           </div>
        </div>

        {/* Core Values */}
        <div className="mb-40">
          <div className="text-center mb-20">
             <h3 className="text-4xl font-serif font-black text-[#332d2b] uppercase">Our Core Values</h3>
             <div className="h-1 w-20 bg-[#9c1c22] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_VALUES.map((value, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="p-10 bg-white shadow-lg rounded-3xl border border-black/5">
                <h4 className="text-xl font-cinzel font-black text-[#9c1c22] mb-4 uppercase">{value.term}</h4>
                <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase">{value.definition}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Organizational Purpose */}
        <div className="mb-40">
          <div className="text-center mb-20">
             <h3 className="text-5xl font-serif font-black text-[#332d2b] uppercase">{DETAILED_ABOUT.purpose.title}</h3>
             <div className="h-1 w-20 bg-[#eeb053] mx-auto mt-4" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
               <div className="flex items-center gap-6 mb-10">
                 <div className="p-5 bg-[#9c1c22] rounded-2xl text-white shadow-lg"><Activity size={32} /></div>
                 <h4 className="text-3xl font-serif font-black uppercase">1. Programmatic Nonprofit</h4>
               </div>
               <div className="grid gap-4">
                 {DETAILED_ABOUT.purpose.programmatic.map((item, i) => (
                   <div key={i} className="p-6 bg-[#fdfaf6] rounded-2xl border-l-4 border-[#9c1c22] text-xl font-serif italic text-[#332d2b]/70 uppercase">
                     {item}
                   </div>
                 ))}
               </div>
            </div>
            <div className="space-y-8">
               <div className="flex items-center gap-6 mb-10">
                 <div className="p-5 bg-[#eeb053] rounded-2xl text-white shadow-lg"><ShieldCheck size={32} /></div>
                 <h4 className="text-3xl font-serif font-black uppercase">2. Holding & Stewardship</h4>
               </div>
               <div className="grid gap-4">
                 {DETAILED_ABOUT.purpose.stewardship.map((item, i) => (
                   <div key={i} className="p-6 bg-[#fdfaf6] rounded-2xl border-l-4 border-[#eeb053] text-xl font-serif italic text-[#332d2b]/70 uppercase">
                     {item}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* 5 Program Pillars */}
        <div className="mb-40">
          <div className="text-center mb-20">
            <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Strategic Impact</span>
            <h3 className="text-5xl md:text-7xl font-serif font-black text-[#332d2b] uppercase leading-none">The 5 Program <span className="text-[#eeb053] italic">Pillars.</span></h3>
          </div>
          <div className="space-y-12">
            {DETAILED_ABOUT.pillars.map((pillar, i) => (
              <motion.div 
                key={pillar.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group p-12 bg-[#fdfaf6] rounded-[4rem] border-2 border-transparent hover:border-[#9c1c22]/20 transition-all shadow-xl flex flex-col lg:flex-row gap-12 items-center"
              >
                <div className="lg:w-1/4 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-[#9c1c22] shadow-md group-hover:scale-110 transition-transform mb-6">
                      {React.cloneElement(pillar.icon as React.ReactElement<any>, { size: 40 })}
                   </div>
                   <h4 className="text-2xl font-serif font-black uppercase text-[#9c1c22] leading-tight">Pillar {pillar.id}</h4>
                </div>
                <div className="lg:w-3/4">
                  <h3 className="text-3xl font-serif font-black uppercase text-[#332d2b] mb-4">{pillar.title}</h3>
                  <p className="text-xl font-serif italic text-[#332d2b]/70 mb-8 uppercase leading-relaxed font-bold">Objective: {pillar.objective}</p>
                  <div className="flex flex-wrap gap-3">
                    {pillar.initiatives.map((init, idx) => (
                      <span key={idx} className="px-6 py-3 bg-white border border-[#eeb053]/30 rounded-full text-sm font-serif italic text-[#332d2b]/60 uppercase shadow-sm">
                        {init}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Closing Statement */}
        <footer className="text-center py-20 bg-[#1a1a1a] rounded-[5rem] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <Logo className="w-full h-full scale-125 rotate-12" />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl font-serif italic uppercase mb-6 opacity-60">{DETAILED_ABOUT.closing.statement}</h3>
            <h2 className="text-4xl md:text-7xl font-serif font-black uppercase text-[#eeb053] leading-none mb-4">
              {DETAILED_ABOUT.closing.tagline.split('.').slice(0,1)}.
              <br />
              {DETAILED_ABOUT.closing.tagline.split('.').slice(1,2)}.
              <br />
              {DETAILED_ABOUT.closing.tagline.split('.').slice(2,3)}.
            </h2>
            <div className="h-px w-24 bg-[#9c1c22] mx-auto my-10" />
            <p className="font-cinzel font-black text-xs tracking-[0.6em] uppercase text-white/40">Foundation of Luv Institutional Philosophy</p>
          </div>
        </footer>
      </div>
    </section>
  );
};

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
      <div className="space-y-12">
        {STRATEGIC_PHASES.map((phase, i) => (
          <motion.div key={i} className="p-12 bg-white rounded-[4rem] shadow-xl">
             <h3 className="text-3xl font-serif font-black uppercase text-[#9c1c22] mb-2">{phase.title}</h3>
             <p className="text-xl font-cinzel font-black text-[#eeb053] uppercase mb-8">{phase.years}</p>
             <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h4 className="text-xl font-serif font-black uppercase mb-4">Strategic Goals</h4>
                  <ul className="space-y-2">
                    {phase.goals.map((g, idx) => <li key={idx} className="text-lg font-serif italic text-[#332d2b]/60 uppercase">• {g}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-serif font-black uppercase mb-4">Projected Outputs</h4>
                  <ul className="space-y-2">
                    {phase.outputs.map((o, idx) => <li key={idx} className="text-lg font-serif italic text-[#332d2b]/60 uppercase">• {o}</li>)}
                  </ul>
                </div>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// --- LUVWATTS Component ---
const LUVWATTSView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">The Kinetic Pulse</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">
          {LUVWATTS_CONTENT.title.split(' ')[0]} <span className="text-[#eeb053] italic">{LUVWATTS_CONTENT.title.split(' ').slice(1).join(' ')}</span>
        </h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">
          {LUVWATTS_CONTENT.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {LUVWATTS_CONTENT.acronym.map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="bg-[#fdfaf6] p-10 rounded-[3rem] border border-black/5 flex flex-col items-center text-center group hover:border-[#9c1c22]/20 transition-all shadow-sm hover:shadow-xl"
          >
            <div className="text-6xl md:text-8xl font-serif font-black text-[#9c1c22] mb-6 opacity-20 group-hover:opacity-100 transition-opacity">
              {item.letter}
            </div>
            <h3 className="text-2xl font-cinzel font-black text-[#332d2b] mb-4 uppercase">{item.term}</h3>
            <p className="text-lg font-serif italic text-[#332d2b]/60 uppercase leading-relaxed">{item.definition}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const DonorView = () => (
  <section className="py-24 md:py-48 bg-white pt-48 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Support Our Mission</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Give <span className="text-[#eeb053] italic">Luv.</span></h2>
        <p className="text-2xl font-serif italic text-[#332d2b]/60 max-w-3xl mx-auto uppercase">{DONOR_PAGE_CONTENT.different.content}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 mb-32">
        {DONOR_PAGE_CONTENT.impactPillars.map((p, i) => (
          <div key={i} className="p-12 bg-[#fdfaf6] rounded-[4rem] border border-black/5">
            <h3 className="text-2xl font-serif font-black uppercase mb-4">{p.title}</h3>
            <p className="text-xl font-serif italic text-[#332d2b]/60 uppercase">{p.description}</p>
          </div>
        ))}
      </div>
      <div className="p-20 bg-[#9c1c22] text-white rounded-[5rem] text-center">
        <h3 className="text-4xl font-serif font-black uppercase mb-10">{DONOR_PAGE_CONTENT.promise.title}</h3>
        <div className="space-y-4 mb-12">
          {DONOR_PAGE_CONTENT.promise.points.map((p, i) => <p key={i} className="text-2xl font-serif italic uppercase">{p}</p>)}
        </div>
        <button className="px-16 py-6 bg-white text-[#9c1c22] rounded-full font-cinzel font-black text-xl hover:bg-[#eeb053] transition-all">INITIATE CONTRIBUTION</button>
      </div>
    </div>
  </section>
);

const GalleryPageView = () => (
  <section className="py-24 md:py-48 bg-white pt-48">
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-32">
        <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">Visual Narrative</span>
        <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Impact <span className="text-[#eeb053] italic">Gallery.</span></h2>
      </div>

      <div className="mb-32">
        <VideoSection 
          videoId={VIDEO_RESOURCES[0].id} 
          title="Motion Gallery" 
          description="A journey through our mission and global movement." 
        />
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {GALLERY_IMAGES.map((img, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative group rounded-[3rem] overflow-hidden break-inside-avoid">
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

const ProgramsPageView = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const getIcon = (id: string): any => {
    switch(id) {
      case "01": return UsersRound;
      case "02": return SchoolIcon;
      case "03": return HomeIcon;
      case "04": return Utensils;
      case "05": return HeartPulse;
      case "06": return Coins;
      case "07": return Award;
      default: return Sparkles;
    }
  };

  return (
    <section className="py-24 md:py-48 bg-[#fdfaf6] pt-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[12px] uppercase mb-8 block">The 7 Luv Acts</span>
          <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] mb-12 uppercase">Our <span className="text-[#9c1c22] italic">Programs.</span></h2>
          <p className="text-xl md:text-2xl font-serif italic text-[#332d2b]/60 max-w-4xl mx-auto uppercase">A deeper look at the specific initiatives driving our mission of restoration.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-16 md:space-y-24"
        >
          {LUV_ACT_PROGRAMS.map((program) => {
            const IconComponent = getIcon(program.id);
            return (
              <motion.div 
                key={program.id} 
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  transition: { duration: 0.4 }
                }}
                className="group bg-white rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_120px_rgba(0,0,0,0.1)] flex flex-col lg:flex-row border-b-[15px] md:border-b-[20px] transition-all duration-500" 
                style={{ borderColor: program.color }}
              >
                <div className="lg:w-1/3 bg-[#f9f5f0] p-12 md:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 0.05, scale: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span className="text-[20rem] font-cinzel font-black" style={{ color: program.color }}>{program.id}</span>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.8 }}
                    className="mb-8 p-6 bg-white rounded-full shadow-lg relative z-10"
                    style={{ color: program.color }}
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center">
                      <IconComponent size={48} className="text-inherit" />
                    </div>
                  </motion.div>

                  <h3 className="text-3xl md:text-4xl font-serif font-black uppercase leading-tight relative z-10 group-hover:scale-105 transition-transform" style={{ color: program.color }}>{program.title}</h3>
                  <div className="mt-4 h-1 w-0 group-hover:w-20 bg-[#eeb053] transition-all duration-500" />
                </div>

                <div className="lg:w-2/3 p-12 md:p-20 flex flex-col justify-center relative bg-white">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <p className="text-xl md:text-3xl font-serif italic text-[#332d2b]/70 leading-relaxed uppercase group-hover:text-[#332d2b] transition-colors duration-500">
                      {program.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    // Elegant loading delay to ensure brand impact
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (pageId: string) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleContactSubmit = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
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
      case 'contact': return <ContactView onSubmitSuccess={handleContactSubmit} />;
      default: return <HomeView onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden selection:bg-[#9c1c22]/20 selection:text-[#9c1c22] bg-[#fdfaf6] relative">
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
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
              <button className="md:hidden p-2 text-[#332d2b]" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
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
          
          <main className="relative z-10">
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPage} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }} 
                transition={{ duration: 0.5, ease: "anticipate" }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>

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

          <ScrollToTopButton />

          <AnimatePresence>
            {showToast && (
              <Toast message="Message Sent Successfully!" onClose={() => setShowToast(false)} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default App;
