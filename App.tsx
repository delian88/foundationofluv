import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Zap, ArrowRight, 
  ExternalLink, Sparkles, MoveRight, Heart, ChevronLeft, Calendar, Award, Play
} from 'lucide-react';
import { 
  NAVIGATION, SERVICE_AREAS, STRATEGIC_PHASES, STATS 
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

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollYProgress } = useScroll();

  const logoUrl = "logo.svg";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);

  return (
    <div className="min-h-screen selection:bg-[#9c1c22]/20 selection:text-[#9c1c22]">
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
              {logoError ? (
                <div className="w-14 h-14 md:w-20 md:h-20 flex items-center justify-center bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-xl md:text-2xl tracking-tighter shadow-lg ring-2 ring-[#e2a744]/20 transition-transform hover:scale-105 cursor-pointer">
                  FOL
                </div>
              ) : (
                <img 
                  src={logoUrl} 
                  alt="Foundation of Luv Seal" 
                  className="w-16 h-16 md:w-24 md:h-24 object-contain hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-md"
                  onError={() => setLogoError(true)}
                />
              )}
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
      <header className="relative pt-40 pb-20 md:pt-64 md:pb-32 lg:pt-80 lg:pb-48 overflow-hidden bg-[#fdfaf6]">
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0], x: [0, 100, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-30%] right-[-15%] w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-[#9c1c22]/5 rounded-full blur-[120px] md:blur-[160px]" 
          />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], y: [0, -100, 0], rotate: [0, -45, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-15%] w-[500px] h-[500px] md:w-[800px] md:h-[800px] bg-[#e2a744]/8 rounded-full blur-[100px] md:blur-[140px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12 md:mb-20 relative w-full flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#9c1c22]/10 via-white to-[#e2a744]/10 rounded-full blur-[80px] md:blur-[100px] -z-10 scale-[1.5] md:scale-[1.8] opacity-60" />
            
            <div className="relative group p-4 md:p-12 w-full max-w-[800px]">
              <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] md:rounded-[4rem] overflow-hidden border-[8px] md:border-[16px] border-white shadow-[0_50px_100px_-20px_rgba(156,28,34,0.3)] group/slider">
                <div className="absolute inset-0 border-[2px] md:border-[4px] border-[#e2a744]/40 rounded-[1.5rem] md:rounded-[3.2rem] z-20 pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0"
                  >
                    <img src={HERO_IMAGES[currentSlide].url} alt={HERO_IMAGES[currentSlide].caption} className="w-full h-full object-cover brightness-[0.85]" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-black/60 to-transparent text-left">
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <span className="text-[#e2a744] font-cinzel font-black tracking-widest text-[10px] uppercase">Featured Movement</span>
                        <h3 className="text-white text-xl md:text-3xl font-serif italic mt-1">{HERO_IMAGES[currentSlide].caption}</h3>
                      </motion.div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8 z-30 opacity-0 group-hover/slider:opacity-100 transition-opacity duration-500">
                  <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#9c1c22] transition-all"><ChevronLeft size={24} /></button>
                  <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-[#9c1c22] transition-all"><ChevronRight size={24} /></button>
                </div>

                <div className="absolute bottom-6 md:bottom-10 right-6 md:right-10 flex gap-3 z-30">
                  {HERO_IMAGES.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)} className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-8 bg-[#e2a744]' : 'w-4 bg-white/30 hover:bg-white/50'}`} />
                  ))}
                </div>
              </div>

              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 -right-6 md:-top-10 md:-right-10 w-24 h-24 md:w-40 md:h-40 z-40">
                {logoError ? (
                  <div className="w-full h-full bg-[#9c1c22] text-white rounded-full flex items-center justify-center font-cinzel font-black text-2xl md:text-4xl shadow-2xl ring-4 md:ring-8 ring-[#e2a744]">FOL</div>
                ) : (
                  <img src={logoUrl} alt="FOL Seal" className="w-full h-full drop-shadow-2xl hover:scale-110 transition-transform duration-500" onError={() => setLogoError(true)} />
                )}
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.6 }} className="max-w-5xl mx-auto">
            <h1 className="hero-text text-5xl md:text-[7.5rem] font-serif font-black leading-tight md:leading-[0.9] tracking-tight mb-10 md:mb-14">
              <span className="text-shine-crimson block pb-2 md:pb-4">Love in Action,</span>
              <span className="italic font-normal text-shine block">Change in Motion.</span>
            </h1>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
              <motion.button whileHover={{ scale: 1.05, y: -5 }} className="group relative w-full md:w-auto px-12 md:px-16 py-5 md:py-7 bg-[#9c1c22] text-white rounded-full font-cinzel font-bold text-lg md:text-xl overflow-hidden shadow-xl md:shadow-[0_30px_60px_-15px_rgba(156,28,34,0.4)]">
                Join the Movement <MoveRight className="inline-block ml-3 group-hover:translate-x-3 transition-transform" />
              </motion.button>
              <a href="#about" className="w-full md:w-auto">
                <motion.button whileHover={{ scale: 1.05, y: -5 }} className="w-full px-12 md:px-16 py-5 md:py-7 glass-card text-[#332d2b] rounded-full font-cinzel font-bold text-lg md:text-xl hover:bg-white transition-all shadow-md flex items-center justify-center gap-4 border border-[#9c1c22]/10">
                  Our Sacred Story <ArrowRight size={20} className="text-[#9c1c22]" />
                </motion.button>
              </a>
            </div>
          </motion.div>
        </div>
      </header>

      {/* About Us Section */}
      <section id="about" className="py-24 md:py-40 bg-[#f9f5f0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 relative">
              <div className="relative z-10 p-4 bg-white rounded-[3rem] shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[#9c1c22]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000" alt="Foundation of Luv History" className="w-full aspect-[3/4] object-cover rounded-[2.5rem] grayscale group-hover:grayscale-0 transition-all duration-[2s]" />
                <div className="absolute top-10 left-10 w-24 h-24 bg-white/90 backdrop-blur-md rounded-full shadow-2xl flex flex-col items-center justify-center border-2 border-[#e2a744] z-20 group-hover:scale-110 transition-transform">
                  <Calendar size={20} className="text-[#9c1c22] mb-1" />
                  <span className="text-[10px] font-cinzel font-black tracking-widest text-[#332d2b]">EST.</span>
                  <span className="text-lg font-serif font-black text-[#9c1c22]">2016</span>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
              <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-[#9c1c22]/5 text-[#9c1c22] text-[10px] font-cinzel font-black tracking-[0.4em] mb-10 border border-[#9c1c22]/10 uppercase">
                <Award size={14} /> THE FOUNDATION LEGACY
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-black text-[#332d2b] leading-[1.1] mb-12">About <br/><span className="italic font-normal text-shine-crimson">Foundation of Luv.</span></h2>
              <div className="space-y-8">
                <p className="text-2xl md:text-3xl text-[#332d2b]/80 font-serif italic leading-relaxed">"Foundation of Love (FOL) was created in 2016 with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities."</p>
                <div className="h-0.5 w-24 bg-gradient-to-r from-[#e2a744] to-transparent" />
                <p className="text-xl text-[#332d2b]/70 font-medium leading-relaxed font-serif">Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides, empower the vulnerable, and create lasting pathways to opportunity. </p>
                <p className="text-xl text-[#332d2b]/70 font-medium leading-relaxed font-serif">Since inception, the foundation has touched lives across diverse demographics through outreach, capacity-building, mentorship, and community-centered initiatives.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-24 md:py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 md:mb-24"
          >
            <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-8 block">Kinetic Resonance</span>
            <h2 className="text-5xl md:text-8xl font-serif font-black text-[#332d2b] leading-tight mb-8">
              Love <span className="italic font-normal text-[#e2a744]">Witnessed.</span>
            </h2>
            <div className="h-1 w-32 bg-[#9c1c22] mx-auto rounded-full" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative group max-w-5xl mx-auto"
          >
            {/* Cinematic Frame */}
            <div className="relative aspect-video rounded-[2.5rem] md:rounded-[4rem] overflow-hidden border-[12px] md:border-[20px] border-white shadow-[0_60px_120px_-20px_rgba(156,28,34,0.3)] bg-slate-900">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/XxfFvLERt7o?autoplay=0&rel=0&modestbranding=1" 
                title="Foundation of Luv - Kinetic Action" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
              
              {/* Overlay Decor */}
              <div className="absolute inset-0 pointer-events-none border-[2px] border-[#e2a744]/30 rounded-[1.8rem] md:rounded-[3.2rem] z-10" />
            </div>

            {/* Decorative Orbits */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-[#e2a744]/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#9c1c22]/10 rounded-full blur-[120px] -z-10" />
          </motion.div>

          <div className="mt-16 md:mt-24">
            <p className="text-2xl md:text-4xl text-[#332d2b]/60 font-serif italic max-w-4xl mx-auto leading-relaxed">
              "Experience the kinetic energy of global solidarity—where compassion meets strategy to redefine humanity."
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 md:py-24 bg-white border-y border-[#332d2b]/10 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #9c1c22 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
            {STATS.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="group">
                <div className="text-4xl md:text-8xl font-serif font-black text-[#9c1c22] mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-500">{stat.value}{stat.suffix}</div>
                <div className="text-[10px] md:text-[12px] font-cinzel font-black tracking-[0.2em] md:tracking-[0.4em] text-[#332d2b] mb-2 uppercase">{stat.label}</div>
                <div className="text-xs md:text-sm text-[#332d2b]/40 font-medium uppercase tracking-[0.1em]">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Services Grid */}
      <section id="services" className="py-24 md:py-40 bg-[#fdfaf6]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-16 md:mb-32 gap-10 text-center lg:text-left">
            <div className="max-w-3xl">
              <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] uppercase mb-6 md:mb-8 block">Foundational Pillars</span>
              <h2 className="text-4xl md:text-[5.5rem] font-serif font-black text-[#332d2b] leading-tight">Strategic Impact <br/><span className="italic font-normal text-[#9c1c22]">Channels.</span></h2>
            </div>
            <p className="text-lg md:text-xl text-[#332d2b]/60 max-w-md font-serif italic leading-relaxed">"We don't just provide services; we engineer environments where dignity thrives and potential is awakened."</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {SERVICE_AREAS.map((service, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -15 }} className="bg-white p-8 md:p-14 rounded-[2rem] md:rounded-[3rem] border border-[#332d2b]/10 hover:border-[#9c1c22]/20 hover:shadow-2xl transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"><Heart className="w-20 h-20 md:w-24 md:h-24 text-[#9c1c22]" /></div>
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#fdfaf6] text-[#9c1c22] rounded-2xl md:rounded-3xl flex items-center justify-center mb-8 md:mb-12 group-hover:bg-[#9c1c22] group-hover:text-white transition-all duration-500 shadow-sm border border-[#332d2b]/5 group-hover:rotate-[10deg]">{service.icon}</div>
                <h4 className="text-2xl md:text-3xl font-serif font-black text-[#332d2b] mb-4 md:mb-6 tracking-tight">{service.title}</h4>
                <p className="text-[#332d2b]/60 text-base md:text-lg leading-relaxed font-medium font-serif italic">{service.description}</p>
              </motion.div>
            ))}
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

      {/* LUVWATTS Section */}
      <section id="luvwatts" className="py-24 md:py-40 bg-[#fdfaf6] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 md:gap-40 items-center">
            <motion.div initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative order-2 lg:order-1">
              <div className="relative z-10 rounded-[3rem] md:rounded-[6rem] overflow-hidden shadow-2xl border-[10px] md:border-[16px] border-white">
                <img src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000" alt="LUVWATTS Collective" className="w-full aspect-[4/5] object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-[1.5s] scale-[1.1] hover:scale-100" />
              </div>
              <div className="absolute -bottom-12 -left-12 md:-bottom-24 -left-24 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#9c1c22]/10 rounded-full -z-0 blur-[80px] md:blur-[120px]" />
            </motion.div>

            <div className="order-1 lg:order-2">
              <span className="text-[#9c1c22] font-cinzel font-black tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] uppercase mb-8 md:mb-10 block">Radical Identity</span>
              <h2 className="text-6xl md:text-[9.5rem] font-serif font-black italic tracking-tighter mb-10 md:mb-12 text-[#332d2b] leading-[0.85] md:leading-[0.8]">LUV<br/><span className="text-shine-crimson font-cinzel font-black not-italic tracking-[0.05em] md:tracking-[0.1em]">WATTS</span></h2>
              <p className="text-xl md:text-3xl text-[#332d2b]/60 mb-12 md:mb-16 font-serif italic leading-relaxed">"LUVWATTS represents the kinetic voltage of love. It is the invisible energy that powers transformation across the globe."</p>
              <div className="space-y-6 md:space-y-10 mb-12 md:mb-20">
                {["Voltage through Compassion", "Resonance without Borders", "High-Energy Restoration"].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 md:gap-8 group">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white flex items-center justify-center border border-[#332d2b]/5 group-hover:bg-[#9c1c22] group-hover:text-white transition-all duration-500 group-hover:rotate-[15deg]"><Zap size={22} className="md:size-[28px]" /></div>
                    <span className="text-xl md:text-2xl font-serif font-black text-[#332d2b] tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.05, y: -5 }} className="w-full md:w-auto px-10 md:px-16 py-6 md:py-8 bg-[#332d2b] text-white rounded-full font-cinzel font-black text-lg md:text-xl hover:bg-[#1a1817] transition-all flex items-center justify-center gap-6 group shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                CONNECT WITH THE MOVEMENT <ArrowRight className="group-hover:translate-x-3 transition-transform duration-500" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#332d2b] text-[#fdfaf6] pt-24 md:pt-48 pb-12 md:pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-[#9c1c22]/10 rounded-full blur-[80px] md:blur-[100px] -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-4 gap-16 md:gap-24 mb-20 md:mb-32 items-start">
            <div className="lg:col-span-2 text-center md:text-left">
              <div className="mb-10 md:mb-14 flex justify-center md:justify-start">
                {logoError ? (
                  <div className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center bg-[#9c1c22] text-white rounded-full font-cinzel font-black text-4xl md:text-5xl tracking-tighter shadow-2xl brightness-125 ring-8 ring-white/5">FOL</div>
                ) : (
                  <img src={logoUrl} alt="Foundation of Luv Seal" className="w-32 h-32 md:w-48 md:h-48 brightness-125 drop-shadow-2xl object-contain hover:scale-105 transition-transform duration-500" onError={() => setLogoError(true)} />
                )}
              </div>
              <p className="text-xl md:text-3xl text-[#fdfaf6]/40 max-w-lg mb-10 md:mb-14 font-serif italic leading-relaxed">"Restoring human dignity and transforming global communities through strategic, love-led humanitarian action."</p>
              <div className="flex justify-center md:justify-start gap-4 md:gap-6">
                <motion.a 
                  whileHover={{ scale: 1.1, backgroundColor: '#9c1c22' }}
                  href="https://www.instagram.com/p/DQyGzApDb9r/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group transition-all"
                >
                  <ExternalLink size={18} className="md:size-[22px] group-hover:text-white transition-colors" />
                </motion.a>
                {['LinkedIn', 'YouTube'].map(social => (
                  <motion.button whileHover={{ scale: 1.1, backgroundColor: '#9c1c22' }} key={social} className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group transition-all">
                    <ExternalLink size={18} className="md:size-[22px] group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-[#e2a744] font-cinzel font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] mb-10 md:mb-14">The Architecture</h5>
              <ul className="space-y-6 md:space-y-8 text-lg md:text-xl font-serif italic text-[#fdfaf6]/60">
                {NAVIGATION.map(n => (
                  <li key={n.name}><a href={n.href} className="hover:text-white transition-colors flex items-center justify-center md:justify-start gap-3 group"><span className="w-0 h-[1px] bg-[#9c1c22] group-hover:w-6 transition-all duration-300 hidden md:block" />{n.name}</a></li>
                ))}
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-[#e2a744] font-cinzel font-black uppercase tracking-[0.3em] md:tracking-[0.5em] text-[10px] md:text-[11px] mb-10 md:mb-14">Global Connectivity</h5>
              <div className="text-lg md:text-xl font-serif italic text-[#fdfaf6]/60 space-y-6">
                <p className="hover:text-[#e2a744] transition-colors cursor-pointer text-[#fdfaf6] text-xl md:text-2xl font-black font-cinzel not-italic break-words">hello@foundationofluv.org</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[#e2a744] font-cinzel font-bold text-xs md:text-sm uppercase tracking-widest mb-2 md:mb-3">Restoration Hub HQ</p>
                  <p className="text-base">Global Advocacy Center<br/>Metropolitan Hub • International</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 md:pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 md:gap-10 text-[#fdfaf6]/20 text-[9px] md:text-[11px] font-cinzel font-black tracking-[0.4em] md:tracking-[0.6em] uppercase text-center">
            <p>© 2025 FOUNDATION OF LUV (FOL). ALL RIGHTS RESERVED.</p>
            <div className="flex gap-8 md:gap-16">
              <a href="#" className="hover:text-white transition-colors">Privacy Ethics</a>
              <a href="#" className="hover:text-white transition-colors">Solidarity Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;