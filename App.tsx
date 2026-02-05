import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useInView, animate } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Zap, ArrowRight, 
  ExternalLink, Sparkles, MoveRight, Heart, ChevronLeft, Calendar, Award, Play, Star,
  Instagram, Linkedin, Youtube, Globe, Brain, Users, Home, Utensils, GraduationCap, Shield, Quote
} from 'lucide-react';
import { 
  NAVIGATION, SERVICE_AREAS, STRATEGIC_PHASES, STATS, PARTNERS, PROGRAMS 
} from './constants';

const HERO_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200",
    caption: "Community Restoration"
  },
  {
    url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200",
    caption: "Education & Empowerment"
  },
  {
    url: "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&q=80&w=1200",
    caption: "Global Solidarity"
  },
  {
    url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200",
    caption: "Humanity in Motion"
  }
];

const COLORS = ['#9c1c22', '#e2a744', '#ffffff', '#df8c3d'];

/**
 * Robust Logo Component with a high-fidelity CSS Fallback
 * Mimics the seal design: Gold outer ring, bicolor inner ring, copper core, and crimson heart.
 */
const Logo = ({ className, style, alt }: { className?: string; style?: React.CSSProperties; alt?: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div 
        className={`relative rounded-full aspect-square overflow-hidden border-[1px] border-[#e2a744] bg-white shadow-xl flex items-center justify-center group/logo ${className}`}
        style={style}
      >
        {/* Outer Gold Ring */}
        <div className="absolute inset-0 border-[3px] md:border-[6px] border-[#e2a744] rounded-full z-30 pointer-events-none" />
        
        {/* White Inner Border */}
        <div className="absolute inset-[3px] md:inset-[6px] border-[1px] md:border-[2px] border-white rounded-full z-30 pointer-events-none" />

        {/* Bicolor Split Background */}
        <div className="absolute inset-0 flex flex-col z-0">
          <div className="h-1/2 w-full bg-[#f2e9e4]" />
          <div className="h-1/2 w-full bg-[#332d2b]" />
        </div>

        {/* Typography Top (Simulated) */}
        <div className="absolute top-[12%] left-0 right-0 text-center z-20 flex flex-col items-center">
          <span className="font-cinzel font-black text-[#332d2b] leading-none uppercase tracking-[0.1em]" style={{ fontSize: '12%' }}>FOUNDATION</span>
          <span className="font-cinzel font-black text-[#332d2b] leading-none uppercase tracking-[0.2em]" style={{ fontSize: '9%' }}>OF LUV</span>
        </div>

        {/* Side Stars */}
        <Star fill="#e2a744" stroke="none" className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[12%] h-[12%] z-30" />
        <Star fill="#e2a744" stroke="none" className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[12%] h-[12%] z-30" />

        {/* Central Copper/Orange Circle */}
        <div className="absolute inset-[25%] bg-[#df8c3d] rounded-full border-[1.5px] md:border-[3px] border-[#332d2b] flex items-center justify-center z-10 shadow-inner overflow-hidden">
          {/* Heart Emblem */}
          <Heart fill="#9c1c22" stroke="none" className="w-[70%] h-[70%] drop-shadow-lg transform -translate-y-[5%]" />
        </div>

        {/* Typography Bottom (Simulated) */}
        <div className="absolute bottom-[10%] left-0 right-0 text-center z-20 px-2">
          <span className="font-cinzel font-bold text-white/90 leading-tight uppercase tracking-widest whitespace-nowrap block" style={{ fontSize: '7%' }}>LOVE IN ACTION</span>
          <span className="font-cinzel font-bold text-white/90 leading-tight uppercase tracking-widest whitespace-nowrap block" style={{ fontSize: '7%' }}>CHANGE IN MOTION</span>
        </div>
      </div>
    );
  }

  return (
    <img 
      src="logo.svg" 
      alt={alt || "Foundation of Luv"} 
      className={className} 
      style={style}
      onError={() => setError(true)} 
    />
  );
};

const FireworkBurst = ({ x, y, color }: { x: number; y: number; color: string }) => {
  const particles = Array.from({ length: 12 });
  return (
    <div className="absolute" style={{ left: `${x}%`, top: `${y}%` }}>
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: Math.cos((i * 30) * (Math.PI / 180)) * 150,
            y: Math.sin((i * 30) * (Math.PI / 180)) * 150,
            opacity: 0,
            scale: [0, 1, 0.5],
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

const Fireworks = () => {
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const spawnBurst = useCallback(() => {
    const id = Date.now();
    const x = 20 + Math.random() * 60; 
    const y = 30 + Math.random() * 40;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    setBursts(prev => [...prev, { id, x, y, color }]);
    setTimeout(() => {
      setBursts(prev => prev.filter(b => b.id !== id));
    }, 2000);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) spawnBurst();
    }, 1200);
    return () => clearInterval(interval);
  }, [spawnBurst]);

  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <AnimatePresence>
        {bursts.map(burst => (
          <FireworkBurst key={burst.id} {...burst} />
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

  useEffect(() => {
    if (isInView) {
      animate(count, numericValue, { duration: 2.5, ease: [0.32, 1, 0.2, 1] });
    }
  }, [isInView, numericValue]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const logoUrl = "logo.svg";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div className="min-h-screen w-full overflow-x-hidden selection:bg-[#9c1c22]/20 selection:text-[#9c1c22]">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#9c1c22] via-[#e2a744] to-[#fdfaf6] z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-[#332d2b]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-28">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Logo className="w-14 h-14 md:w-24 md:h-24 transition-transform duration-500 cursor-pointer" />
              <div className="ml-4 hidden sm:block">
                <span className="block font-cinzel font-black text-xs md:text-sm tracking-widest text-[#9c1c22]">FOUNDATION</span>
                <span className="block font-serif italic text-xs md:text-sm text-[#332d2b]/60">OF LUV</span>
              </div>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-10">
              {NAVIGATION.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[10px] font-cinzel font-bold uppercase tracking-[0.3em] text-[#332d2b] hover:text-[#9c1c22] transition-all relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#9c1c22] transition-all group-hover:w-full" />
                </a>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#7a141a' }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#9c1c22] text-white px-8 py-3 rounded-full text-[10px] font-cinzel font-black tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-[#9c1c22]/20 transition-all"
              >
                DONATE
              </motion.button>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-[#332d2b]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-b border-[#332d2b]/10 overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-10 space-y-6">
                {NAVIGATION.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-xl font-cinzel font-bold tracking-widest text-[#332d2b] hover:text-[#9c1c22]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button className="w-full bg-[#9c1c22] text-white py-5 rounded-2xl font-cinzel font-black text-xl shadow-xl shadow-[#9c1c22]/20">
                  DONATE NOW
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full pt-32 pb-16 md:pt-64 md:pb-32 lg:pt-80 lg:pb-48 overflow-hidden bg-[#fdfaf6]">
        <Fireworks />

        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.4, 1], rotate: [0, 90, 0], x: [0, 100, 0] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] md:w-[1200px] md:h-[1200px] bg-[#9c1c22]/5 rounded-full blur-[80px] md:blur-[180px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.3, 1], y: [0, -100, 0], rotate: [0, -45, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] md:w-[900px] md:h-[900px] bg-[#e2a744]/8 rounded-full blur-[70px] md:blur-[160px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 md:mb-24 relative w-full flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#9c1c22]/10 via-white to-[#e2a744]/10 rounded-full blur-[60px] md:blur-[140px] -z-10 scale-[1.2] md:scale-[1.8] opacity-60" />
            
            <div className="relative group p-0 md:p-12 w-full max-w-[900px] z-10">
              <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] md:rounded-[5rem] overflow-hidden border-[8px] md:border-[32px] border-white shadow-[0_40px_80px_-20px_rgba(156,28,34,0.3)] md:shadow-[0_80px_160px_-30px_rgba(156,28,34,0.4)] group/slider ring-1 ring-[#332d2b]/5">
                <div className="absolute inset-[2px] md:inset-[8px] border-[1px] md:border-[2px] border-[#e2a744]/30 rounded-[1.8rem] md:rounded-[4.4rem] z-20 pointer-events-none" />
                <div className="absolute inset-[0.5px] md:inset-[3px] border-[0.5px] md:border-[1px] border-white/40 rounded-[1.9rem] md:rounded-[4.8rem] z-20 pointer-events-none" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <img src={HERO_IMAGES[currentSlide].url} alt={HERO_IMAGES[currentSlide].caption} className="w-full h-full object-cover brightness-[0.8] contrast-[1.05]" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-14 bg-gradient-to-t from-black/80 via-black/20 to-transparent text-left">
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                        <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                          <div className="h-[1px] w-4 md:w-8 bg-[#e2a744]" />
                          <span className="text-[#e2a744] font-cinzel font-black tracking-[0.3em] md:tracking-[0.4em] text-[8px] md:text-[12px] uppercase">Movement Chapter</span>
                        </div>
                        <h3 className="text-white text-lg md:text-5xl font-serif italic font-bold tracking-tight">
                          {HERO_IMAGES[currentSlide].caption}
                        </h3>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 flex items-center justify-between px-2 md:px-12 z-30 opacity-100 md:opacity-0 group-hover/slider:opacity-100 transition-all duration-500">
                  <button onClick={prevSlide} className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center hover:bg-white hover:text-[#9c1c22] transition-all border border-white/20 shadow-xl">
                    <ChevronLeft size={24} className="md:size-[32px]" />
                  </button>
                  <button onClick={nextSlide} className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-lg text-white flex items-center justify-center hover:bg-white hover:text-[#9c1c22] transition-all border border-white/20 shadow-xl">
                    <ChevronRight size={24} className="md:size-[32px]" />
                  </button>
                </div>

                <div className="absolute bottom-4 md:bottom-14 right-4 md:right-14 flex items-center gap-2 md:gap-4 z-30">
                  {HERO_IMAGES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-1 md:h-2 transition-all duration-500 rounded-full ${
                        currentSlide === i ? 'w-6 md:w-12 bg-[#e2a744]' : 'w-1 md:w-2 bg-white/30 hover:bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -right-6 md:-top-16 md:-right-16 w-20 h-20 md:w-56 md:h-56 z-40 drop-shadow-2xl"
              >
                <Logo className="w-full h-full filter drop-shadow-xl" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="max-w-6xl mx-auto px-4"
          >
            <div className="inline-flex items-center gap-2 md:gap-4 px-5 md:px-8 py-2 md:py-3 rounded-full glass-card text-[#9c1c22] text-[8px] md:text-[13px] font-cinzel font-black tracking-[0.3em] md:tracking-[0.4em] mb-8 md:mb-12 border border-[#9c1c22]/10 uppercase shadow-sm">
              <Sparkles size={12} className="animate-pulse md:size-[16px] text-[#e2a744]" />
              Establishing Global Sovereignty of Love
            </div>
            
            <h1 className="hero-text text-4xl md:text-[8.5rem] font-serif font-black leading-tight md:leading-[0.85] tracking-tight mb-8 md:mb-16">
              <span className="text-shine-crimson block pb-1 md:pb-6">Love in Action,</span>
              <span className="italic font-normal text-shine block opacity-90">Change in Motion.</span>
            </h1>

            <p className="mobile-p text-lg md:text-4xl text-[#332d2b]/70 mb-12 md:mb-24 leading-relaxed max-w-4xl mx-auto font-serif italic font-medium">
              "We are the kinetic pulse of restoration, engineering pathways where human dignity is an unshakeable reality."
            </p>

            <div className="flex flex-col md:flex-row gap-4 md:gap-14 justify-center items-center w-full max-w-2xl mx-auto md:max-w-none">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative w-full md:w-auto px-8 md:px-24 py-5 md:py-9 bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-lg md:text-2xl shadow-xl"
              >
                Join the Movement <MoveRight className="inline-block ml-3 group-hover:translate-x-3 transition-transform w-6 h-6 md:w-8 md:h-8" />
              </motion.button>
              
              <a href="#about" className="w-full md:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="w-full px-8 md:px-20 py-5 md:py-9 glass-card text-[#332d2b] rounded-full font-cinzel font-bold text-lg md:text-2xl hover:shadow-xl transition-all border border-[#9c1c22]/15 flex items-center justify-center gap-3 md:gap-6"
                >
                  Explore Our Story <ArrowRight size={20} className="md:size-[24px] text-[#9c1c22]" />
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Partners & Clients Sliding Bar */}
      <section className="py-12 md:py-24 bg-white border-y border-[#332d2b]/5 overflow-hidden">
        <div className="w-full">
          <p className="text-center font-cinzel font-black text-[9px] md:text-[12px] text-[#332d2b]/40 tracking-[0.5em] uppercase mb-12 md:mb-20">Partners and Clients</p>
          <div className="relative flex overflow-hidden">
            <motion.div 
              className="flex items-center whitespace-nowrap gap-12 md:gap-32"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              {[...PARTNERS, ...PARTNERS].map((partner, i) => (
                <span key={i} className="font-cinzel font-bold text-2xl md:text-4xl tracking-tighter text-[#332d2b] opacity-40 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-500 cursor-default">
                  {partner}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-40 bg-[#fdfaf6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {STATS.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl md:text-8xl font-serif font-black text-[#9c1c22] mb-4">
                  <AnimatedNumber value={stat.value} />
                  <span className="text-[#e2a744]">{stat.suffix}</span>
                </div>
                <h4 className="font-cinzel font-black text-[10px] md:text-[12px] tracking-[0.3em] uppercase mb-4 text-[#332d2b]">{stat.label}</h4>
                <p className="font-serif italic text-lg md:text-xl text-[#332d2b]/50">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 md:py-40 bg-[#f9f5f0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 relative">
              <div className="relative z-10 p-2 md:p-4 bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="Foundation of Luv History" className="w-full aspect-[3/4] object-cover rounded-[1.8rem] md:rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
                <div className="absolute top-6 left-6 md:top-10 md:left-10 w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-[#e2a744] z-20">
                  <Calendar size={18} className="text-[#9c1c22] mb-1 md:size-[20px]" />
                  <span className="text-[8px] md:text-[10px] font-cinzel font-black tracking-widest text-[#332d2b]">EST.</span>
                  <span className="text-sm md:text-lg font-serif font-black text-[#9c1c22]">2016</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#9c1c22]/5 text-[#9c1c22] text-[9px] md:text-[10px] font-cinzel font-black tracking-[0.3em] mb-8 border border-[#9c1c22]/10 uppercase">
                <Award size={14} /> THE FOUNDATION LEGACY
              </div>
              <h2 className="text-4xl md:text-7xl font-serif font-black text-[#332d2b] leading-tight mb-8 md:mb-12">About <br/><span className="italic font-normal text-shine-crimson">Foundation of Luv.</span></h2>
              <div className="space-y-6 md:space-y-8">
                <p className="text-xl md:text-3xl text-[#332d2b]/80 font-serif italic leading-relaxed">"Foundation of Love (FOL) was created in 2016 with a belief that love, dignity, and compassion can transform individuals and communities."</p>
                <div className="h-0.5 w-16 md:w-24 bg-gradient-to-r from-[#e2a744] to-transparent" />
                <p className="text-lg md:text-xl text-[#332d2b]/70 font-medium leading-relaxed font-serif">Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides and empower the vulnerable.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 md:py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 md:mb-24">
            <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] uppercase mb-6 block">Kinetic Resonance</span>
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

      {/* Global Services Grid */}
      <section id="services" className="py-20 md:py-40 bg-[#fdfaf6]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 md:mb-32 gap-10 text-center lg:text-left">
            <div className="max-w-3xl">
              <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.3em] text-[10px] md:text-[11px] uppercase mb-6 block">Foundational Pillars</span>
              <h2 className="text-3xl md:text-[5.5rem] font-serif font-black text-[#332d2b] leading-tight">Strategic Impact <br/><span className="italic font-normal text-[#9c1c22]">Channels.</span></h2>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {SERVICE_AREAS.map((service, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="bg-white p-8 md:p-14 rounded-[2rem] border border-[#332d2b]/10 hover:border-[#9c1c22]/20 hover:shadow-2xl transition-all duration-700">
                <div className="w-14 h-14 md:w-20 md:h-20 bg-[#fdfaf6] text-[#9c1c22] rounded-2xl flex items-center justify-center mb-8 border border-[#332d2b]/5">
                   {service.title === "Global Advocacy" && <Globe size={32} />}
                   {service.title === "Mental Wellness" && <Brain size={32} />}
                   {service.title === "Family Solidarity" && <Users size={32} />}
                   {service.title === "Safe Havens" && <Home size={32} />}
                   {service.title === "Nutrition Equity" && <Utensils size={32} />}
                   {service.title === "Workforce Readiness" && <GraduationCap size={32} />}
                </div>
                <h4 className="text-xl md:text-3xl font-serif font-black text-[#332d2b] mb-4">{service.title}</h4>
                <p className="text-[#332d2b]/60 text-base md:text-lg leading-relaxed font-serif italic">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LUVWATTS Movement Section */}
      <section id="luvwatts" className="py-20 md:py-40 bg-[#9c1c22] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Logo className="w-full h-full opacity-10 scale-150 rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="font-cinzel font-black tracking-[0.5em] text-[10px] md:text-[12px] uppercase mb-8 block text-[#e2a744]">Movement Chapter</span>
              <h2 className="text-5xl md:text-9xl font-serif font-black leading-tight mb-12">LUV<br/><span className="italic font-normal">WATTS.</span></h2>
              <p className="text-2xl md:text-4xl font-serif italic mb-16 leading-relaxed opacity-90">"The kinetic energy of human compassion, amplified through high-impact fashion and global tours."</p>
              <button className="px-12 py-6 bg-white text-[#9c1c22] rounded-full font-cinzel font-black text-xl hover:bg-[#e2a744] hover:text-white transition-all shadow-2xl">JOIN THE ENERGY</button>
            </motion.div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border-8 border-white/20 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000" alt="LUVWATTS Movement" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 md:w-64 md:h-64 glass p-6 rounded-[2rem] border border-white/20 hidden md:block">
                 <Logo className="w-full h-full animate-spin-slow" style={{ animationDuration: '20s' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strategic Roadmap */}
      <section id="roadmap" className="py-24 md:py-40 bg-[#332d2b] text-[#fdfaf6] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-[#9c1c22]/10 rounded-full blur-[120px] md:blur-[180px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="mb-16 md:mb-32">
            <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] uppercase mb-6 md:mb-8 block">Projected Trajectory</span>
            <h2 className="text-4xl md:text-[6.5rem] font-serif font-black leading-tight">Visionary <br/><span className="italic font-normal text-[#9c1c22]">Benchmarks.</span></h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-16 items-start text-left">
            <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
              {STRATEGIC_PHASES.map((phase, i) => (
                <button key={i} onClick={() => setActiveRoadmap(i)} className={`text-left p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] transition-all border-2 flex items-center justify-between group relative overflow-hidden ${activeRoadmap === i ? 'bg-[#fdfaf6] text-[#332d2b] border-[#fdfaf6] shadow-2xl' : 'bg-transparent text-[#fdfaf6]/50 border-[#fdfaf6]/5 hover:border-[#fdfaf6]/20'}`}>
                  {activeRoadmap === i && <motion.div layoutId="roadmapActive" className="absolute inset-0 bg-[#fdfaf6]" />}
                  <div className="relative z-10">
                    <div className={`text-[9px] md:text-[11px] font-cinzel font-black uppercase tracking-widest mb-1 md:mb-2 ${activeRoadmap === i ? 'text-[#9c1c22]' : 'text-[#e2a744]'}`}>{phase.years}</div>
                    <div className="text-xl md:text-2xl font-serif font-black tracking-tight">{phase.title}</div>
                  </div>
                  <ChevronRight className={`relative z-10 transition-transform duration-500 ${activeRoadmap === i ? 'rotate-90 text-[#9c1c22]' : 'group-hover:translate-x-2'}`} />
                </button>
              ))}
            </div>

            <motion.div key={activeRoadmap} initial={{ opacity: 0, x: 50, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="lg:col-span-8 bg-[#fdfaf6]/[0.05] backdrop-blur-3xl rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-20 border border-[#fdfaf6]/10 shadow-2xl">
              <div className="grid md:grid-cols-2 gap-12 md:gap-20">
                <div>
                  <h4 className="text-[#e2a744] font-cinzel font-black uppercase tracking-[0.3em] text-[10px] mb-8 md:mb-12">Core Objectives</h4>
                  <div className="space-y-6 md:space-y-10">
                    {STRATEGIC_PHASES[activeRoadmap].goals.map((goal, idx) => (
                      <div key={idx} className="flex gap-4 md:gap-7 group/item">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#9c1c22]/20 flex items-center justify-center flex-shrink-0 mt-1 border border-[#9c1c22]/40 group-hover/item:scale-110 transition-transform"><div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#9c1c22] rounded-full" /></div>
                        <p className="text-lg md:text-xl text-[#fdfaf6]/80 font-serif italic leading-relaxed">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#fdfaf6] text-[#332d2b] rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-14 shadow-2xl relative overflow-hidden group/box">
                  <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-[#9c1c22]/5 rounded-full -mr-16 -mt-16 md:-mr-24 md:-mt-24 blur-3xl group-hover/box:scale-150 transition-transform duration-1000" />
                  <h4 className="text-[#9c1c22] font-cinzel font-black uppercase tracking-[0.3em] text-[10px] mb-8 md:mb-12">Target Outputs</h4>
                  <div className="space-y-8 md:space-y-12">
                    {STRATEGIC_PHASES[activeRoadmap].outputs.map((output, idx) => (
                      <div key={idx} className="flex gap-6 md:gap-8 items-center">
                        <div className="text-5xl md:text-7xl font-serif font-black italic text-[#9c1c22]/10 leading-none group-hover/box:text-[#9c1c22]/20 transition-colors">{idx + 1}</div>
                        <p className="text-xl md:text-2xl font-serif font-black leading-tight tracking-tight">{output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#332d2b] text-[#fdfaf6] pt-20 md:pt-48 pb-10 md:pb-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-4 gap-12 md:gap-24 mb-16 md:mb-32 items-start text-center md:text-left">
            <div className="lg:col-span-2">
              <div className="mb-8 md:mb-14 flex justify-center md:justify-start">
                <Logo className="w-24 h-24 md:w-48 md:h-48 brightness-110 drop-shadow-2xl" />
              </div>
              <p className="text-lg md:text-3xl text-[#fdfaf6]/40 max-w-lg mb-8 md:mb-14 font-serif italic leading-relaxed">"Restoring human dignity and transforming global communities through strategic action."