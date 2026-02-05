import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Zap, ArrowRight, 
  ExternalLink, Sparkles, MoveRight, Heart
} from 'lucide-react';
import { 
  NAVIGATION, SERVICE_AREAS, STRATEGIC_PHASES, STATS 
} from './constants';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [logoError, setLogoError] = useState(false);
  const { scrollYProgress } = useScroll();

  // Root-relative path for reliable asset resolution
  const logoUrl = "logo.svg";

  return (
    <div className="min-h-screen selection:bg-[#df8c3d]/30 selection:text-[#801010]">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#801010] via-[#df8c3d] to-[#f6c453] z-[100] origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 glass border-b border-[#d8d8d8]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-28 md:h-32">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              {logoError ? (
                <div className="w-20 h-20 flex items-center justify-center bg-[#801010] text-white rounded-full font-cinzel font-black text-2xl tracking-tighter shadow-lg ring-4 ring-[#df8c3d]/20 transition-transform hover:scale-105 cursor-pointer">
                  FOL
                </div>
              ) : (
                <img 
                  src={logoUrl} 
                  alt="Foundation of Luv Seal" 
                  className="w-24 h-24 object-contain hover:scale-105 transition-transform duration-500 cursor-pointer drop-shadow-md"
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
                  className="text-[10px] font-cinzel font-bold uppercase tracking-[0.3em] text-[#433d3b] hover:text-[#df8c3d] transition-all relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#df8c3d] transition-all group-hover:w-full" />
                </a>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#a01515' }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#801010] text-white px-8 py-3 rounded-full text-[10px] font-cinzel font-black tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-[#801010]/20 transition-all"
              >
                DONATE
              </motion.button>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-[#433d3b]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
              className="md:hidden glass border-b border-[#d8d8d8] overflow-hidden shadow-2xl"
            >
              <div className="px-6 py-10 space-y-6">
                {NAVIGATION.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-xl font-cinzel font-bold tracking-widest text-[#433d3b] hover:text-[#801010]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button className="w-full bg-[#801010] text-white py-5 rounded-2xl font-cinzel font-black text-xl shadow-xl shadow-[#801010]/20">
                  DONATE NOW
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-64 pb-32 lg:pt-80 lg:pb-48 overflow-hidden bg-[#fdfdfd]">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
              x: [0, 100, 0]
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-30%] right-[-15%] w-[1000px] h-[1000px] bg-[#df8c3d]/10 rounded-full blur-[160px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              y: [0, -100, 0],
              rotate: [0, -45, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] left-[-15%] w-[800px] h-[800px] bg-[#801010]/8 rounded-full blur-[140px]" 
          />
          
          {/* Subtle Decorative Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#433d3b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-20 relative"
          >
            {/* Focal Point Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#df8c3d]/30 via-white to-[#f6c453]/20 rounded-full blur-[100px] -z-10 scale-[1.8] opacity-60" />
            
            <div className="relative group p-6 md:p-12">
              {logoError ? (
                <div className="w-80 h-80 md:w-[500px] md:h-[500px] mx-auto flex items-center justify-center bg-[#801010] text-white rounded-full font-cinzel font-black text-9xl md:text-[12rem] tracking-tighter shadow-[0_50px_100px_-20px_rgba(128,16,16,0.3)] ring-[24px] ring-[#df8c3d]/10 transition-transform group-hover:scale-105 duration-700">
                  FOL
                </div>
              ) : (
                <img 
                  src={logoUrl} 
                  alt="Foundation of Luv Seal" 
                  className="w-80 h-80 md:w-[520px] md:h-[520px] mx-auto drop-shadow-[0_45px_90px_rgba(223,140,61,0.45)] group-hover:drop-shadow-[0_60px_110px_rgba(223,140,61,0.6)] transition-all duration-1000 cursor-default group-hover:scale-[1.02]" 
                  onError={() => setLogoError(true)}
                />
              )}
              
              {/* Complex Kinetic Orbits */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[115%] h-[115%] border-[1px] border-dashed border-[#df8c3d]/30 rounded-full -z-10"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] border-[0.5px] border-[#801010]/15 rounded-full -z-10"
              />
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ rotate: { duration: 140, repeat: Infinity, ease: "linear" }, scale: { duration: 10, repeat: Infinity } }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[145%] h-[145%] border-[1px] border-dotted border-[#df8c3d]/10 rounded-full -z-10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div className="inline-flex items-center gap-4 px-8 py-3 rounded-full glass-card text-[#df8c3d] text-[11px] font-cinzel font-black tracking-[0.5em] mb-14 border border-[#df8c3d]/20 uppercase">
              <Sparkles size={16} className="animate-pulse" />
              The LUVWATTS Legacy
            </div>
            
            <h1 className="text-7xl md:text-[7.5rem] font-serif font-black leading-[0.9] tracking-tight mb-14">
              <span className="text-shine block pb-4">Love in Action,</span>
              <span className="italic font-normal text-shine-red block">Change in Motion.</span>
            </h1>

            <p className="text-xl md:text-3xl text-slate-500/80 mb-20 leading-relaxed max-w-3xl mx-auto font-serif italic font-medium">
              "Restoring the pulse of humanity through strategic compassion, dignified restoration, and the kinetic energy of global solidarity."
            </p>

            <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="group relative px-16 py-7 bg-[#df8c3d] text-white rounded-full font-cinzel font-bold text-xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(223,140,61,0.6)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                <span className="relative flex items-center gap-5">
                  Join the Movement <MoveRight className="group-hover:translate-x-3 transition-transform duration-500" />
                </span>
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="px-16 py-7 glass-card text-[#433d3b] rounded-full font-cinzel font-bold text-xl hover:bg-white transition-all shadow-lg flex items-center gap-4"
              >
                Our Sacred Mission <ArrowRight size={20} className="text-[#801010]" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-[#d8d8d8]/30 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #801010 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group"
              >
                <div className="text-6xl md:text-8xl font-serif font-black text-[#801010] mb-4 group-hover:scale-110 transition-transform duration-500">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-[12px] font-cinzel font-black tracking-[0.4em] text-[#433d3b] mb-3 uppercase">{stat.label}</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-[0.1em]">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Services Grid */}
      <section id="services" className="py-40 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-32 gap-12 text-center lg:text-left">
            <div className="max-w-3xl">
              <span className="text-[#801010] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-8 block">Foundational Pillars</span>
              <h2 className="text-6xl md:text-[5.5rem] font-serif font-black text-[#433d3b] leading-tight">Strategic Impact <br/><span className="italic font-normal text-[#df8c3d]">Channels.</span></h2>
            </div>
            <p className="text-xl text-slate-500/80 max-w-md font-serif italic leading-relaxed">
              "We don't just provide services; we engineer environments where dignity thrives and potential is awakened."
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {SERVICE_AREAS.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -15 }}
                className="bg-white p-14 rounded-[3rem] border border-slate-200 hover:border-[#df8c3d]/40 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-[0.15] transition-opacity">
                  <Heart className="w-24 h-24 text-[#801010]" />
                </div>
                <div className="w-20 h-20 bg-[#fcfcfc] text-[#df8c3d] rounded-3xl flex items-center justify-center mb-12 group-hover:bg-[#df8c3d] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100 group-hover:rotate-[10deg]">
                  {service.icon}
                </div>
                <h4 className="text-3xl font-serif font-black text-[#433d3b] mb-6 tracking-tight">{service.title}</h4>
                <p className="text-slate-500 text-lg leading-relaxed font-medium font-serif italic">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Roadmap */}
      <section id="roadmap" className="py-40 bg-[#433d3b] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-[#df8c3d]/10 rounded-full blur-[180px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-32">
            <span className="text-[#df8c3d] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-8 block">Projected Trajectory</span>
            <h2 className="text-6xl md:text-[6.5rem] font-serif font-black leading-tight">Visionary <br/><span className="italic font-normal text-[#df8c3d]">Benchmarks.</span></h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-4 flex flex-col gap-6">
              {STRATEGIC_PHASES.map((phase, i) => (
                <button
                  key={i}
                  onClick={() => setActiveRoadmap(i)}
                  className={`text-left p-10 rounded-[2.5rem] transition-all border-2 flex items-center justify-between group relative overflow-hidden ${
                    activeRoadmap === i 
                      ? 'bg-white text-[#433d3b] border-white shadow-[0_30px_70px_rgba(255,255,255,0.15)]' 
                      : 'bg-transparent text-white/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  {activeRoadmap === i && (
                    <motion.div layoutId="roadmapActive" className="absolute inset-0 bg-white" />
                  )}
                  <div className="relative z-10">
                    <div className={`text-[11px] font-cinzel font-black uppercase tracking-widest mb-2 ${activeRoadmap === i ? 'text-[#801010]' : 'text-[#df8c3d]'}`}>
                      {phase.years}
                    </div>
                    <div className="text-2xl font-serif font-black tracking-tight">{phase.title}</div>
                  </div>
                  <ChevronRight className={`relative z-10 transition-transform duration-500 ${activeRoadmap === i ? 'rotate-90 text-[#801010]' : 'group-hover:translate-x-2'}`} />
                </button>
              ))}
            </div>

            <motion.div
              key={activeRoadmap}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 bg-white/[0.04] backdrop-blur-3xl rounded-[4rem] p-12 md:p-20 border border-white/10 shadow-2xl"
            >
              <div className="grid md:grid-cols-2 gap-20">
                <div>
                  <h4 className="text-[#df8c3d] font-cinzel font-black uppercase tracking-[0.4em] text-[11px] mb-12">Core Objectives</h4>
                  <div className="space-y-10">
                    {STRATEGIC_PHASES[activeRoadmap].goals.map((goal, idx) => (
                      <div key={idx} className="flex gap-7 group/item">
                        <div className="w-8 h-8 rounded-full bg-[#df8c3d]/20 flex items-center justify-center flex-shrink-0 mt-1 border border-[#df8c3d]/40 group-hover/item:scale-110 transition-transform">
                          <div className="w-2 h-2 bg-[#df8c3d] rounded-full" />
                        </div>
                        <p className="text-xl text-white/80 font-serif italic leading-relaxed">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white text-[#433d3b] rounded-[3.5rem] p-12 md:p-14 shadow-2xl relative overflow-hidden group/box">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#df8c3d]/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover/box:scale-150 transition-transform duration-1000" />
                  <h4 className="text-[#801010] font-cinzel font-black uppercase tracking-[0.4em] text-[11px] mb-12">Target Outputs</h4>
                  <div className="space-y-12">
                    {STRATEGIC_PHASES[activeRoadmap].outputs.map((output, idx) => (
                      <div key={idx} className="flex gap-8 items-center">
                        <div className="text-6xl md:text-7xl font-serif font-black italic text-[#df8c3d]/20 leading-none group-hover/box:text-[#df8c3d]/40 transition-colors">{idx + 1}</div>
                        <p className="text-2xl font-serif font-black leading-tight tracking-tight">{output}</p>
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
      <section id="luvwatts" className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 md:gap-40 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative z-10 rounded-[4rem] md:rounded-[6rem] overflow-hidden shadow-[0_60px_120px_-20px_rgba(0,0,0,0.2)] border-[16px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000" 
                  alt="LUVWATTS Collective" 
                  className="w-full aspect-[4/5] object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100 transition-all duration-[1.5s] scale-[1.1] hover:scale-100" 
                />
              </div>
              <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[#df8c3d]/15 rounded-full -z-0 blur-[120px]" />
            </motion.div>

            <div className="order-1 lg:order-2">
              <span className="text-[#801010] font-cinzel font-black tracking-[0.5em] text-[11px] uppercase mb-10 block">Radical Identity</span>
              <h2 className="text-8xl md:text-[9.5rem] font-serif font-black italic tracking-tighter mb-12 text-[#433d3b] leading-[0.8]">
                LUV<br/><span className="text-shine-red font-cinzel font-black not-italic tracking-[0.1em]">WATTS</span>
              </h2>
              <p className="text-2xl md:text-3xl text-slate-500/80 mb-16 font-serif italic leading-relaxed">
                "LUVWATTS represents the kinetic voltage of love. It is the invisible energy that powers transformation across the globe."
              </p>
              <div className="space-y-10 mb-20">
                {["Voltage through Compassion", "Resonance without Borders", "High-Energy Restoration"].map((item, i) => (
                  <div key={i} className="flex items-center gap-8 group">
                    <div className="w-16 h-16 rounded-3xl bg-[#f8fafc] flex items-center justify-center border border-slate-100 group-hover:bg-[#df8c3d] group-hover:text-white transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110">
                      <Zap size={28} />
                    </div>
                    <span className="text-2xl font-serif font-black text-[#433d3b] tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, y: -5 }}
                className="px-16 py-8 bg-[#433d3b] text-white rounded-full font-cinzel font-black text-xl hover:bg-[#1a1a1a] transition-all flex items-center gap-6 group shadow-2xl relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                CONNECT WITH THE MOVEMENT <ArrowRight className="group-hover:translate-x-3 transition-transform duration-500" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#433d3b] text-white pt-48 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#801010]/10 rounded-full blur-[100px] -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-4 gap-24 mb-32 items-start">
            <div className="lg:col-span-2 text-center md:text-left">
              <div className="mb-14 flex justify-center md:justify-start">
                {logoError ? (
                  <div className="w-48 h-48 flex items-center justify-center bg-[#801010] text-white rounded-full font-cinzel font-black text-5xl tracking-tighter shadow-2xl brightness-125 ring-8 ring-white/5">
                    FOL
                  </div>
                ) : (
                  <img 
                    src={logoUrl} 
                    alt="Foundation of Luv Seal" 
                    className="w-48 h-48 brightness-125 drop-shadow-2xl object-contain hover:scale-105 transition-transform duration-500" 
                  />
                )}
              </div>
              <p className="text-2xl md:text-3xl text-white/40 max-w-lg mb-14 font-serif italic leading-relaxed">
                "Restoring human dignity and transforming global communities through strategic, love-led humanitarian action."
              </p>
              <div className="flex justify-center md:justify-start gap-6">
                {['Instagram', 'LinkedIn', 'YouTube'].map(social => (
                  <motion.button 
                    whileHover={{ scale: 1.1, backgroundColor: '#df8c3d' }}
                    key={social} 
                    className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group transition-all"
                  >
                    <ExternalLink size={22} className="group-hover:text-white transition-colors" />
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-[#df8c3d] font-cinzel font-black uppercase tracking-[0.5em] text-[11px] mb-14">The Architecture</h5>
              <ul className="space-y-8 text-xl font-serif italic text-white/60">
                {NAVIGATION.map(n => (
                  <li key={n.name}>
                    <a href={n.href} className="hover:text-white transition-colors flex items-center gap-3 group">
                      <span className="w-0 h-[1px] bg-[#df8c3d] group-hover:w-6 transition-all duration-300" />
                      {n.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-[#df8c3d] font-cinzel font-black uppercase tracking-[0.5em] text-[11px] mb-14">Global Connectivity</h5>
              <div className="text-xl font-serif italic text-white/60 space-y-6">
                <p className="hover:text-[#df8c3d] transition-colors cursor-pointer text-white text-2xl font-black font-cinzel not-italic">hello@foundationofluv.org</p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[#df8c3d] font-cinzel font-bold text-sm uppercase tracking-widest mb-3">Restoration Hub HQ</p>
                  <p>Global Advocacy Center<br/>Metropolitan Hub • International</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-white/20 text-[11px] font-cinzel font-black tracking-[0.6em] uppercase">
            <p>© 2025 FOUNDATION OF LUV (FOL). ALL RIGHTS RESERVED.</p>
            <div className="flex gap-16">
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