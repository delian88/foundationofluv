import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { 
  Menu, X, ChevronRight, Zap, ArrowRight, 
  ExternalLink, Sparkles, MoveRight
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
                <div className="w-24 h-24 flex items-center justify-center bg-[#801010] text-white rounded-full font-black text-2xl tracking-tighter shadow-lg ring-4 ring-[#df8c3d]/20 transition-transform hover:scale-105 cursor-pointer">
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
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-[#433d3b] hover:text-[#df8c3d] transition-all relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#df8c3d] transition-all group-hover:w-full" />
                </a>
              ))}
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#a01515' }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#801010] text-white px-8 py-3 rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-[#801010]/20 transition-all"
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
                    className="block text-xl font-black tracking-tight text-[#433d3b] hover:text-[#801010]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button className="w-full bg-[#801010] text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-[#801010]/20">
                  DONATE NOW
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-56 pb-24 lg:pt-64 lg:pb-32 overflow-hidden bg-[#fcfcfc]">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 45, 0],
              x: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-[#df8c3d]/5 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              y: [0, -50, 0]
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#801010]/5 rounded-full blur-[100px]" 
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 relative"
          >
            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#df8c3d]/20 to-[#f6c453]/10 rounded-full blur-3xl -z-10 scale-150" />
            
            <div className="relative group p-4 md:p-8">
              {logoError ? (
                <div className="w-72 h-72 md:w-[480px] md:h-[480px] mx-auto flex items-center justify-center bg-[#801010] text-white rounded-full font-black text-8xl md:text-[10rem] tracking-tighter shadow-2xl ring-[16px] ring-[#df8c3d]/10 transition-transform cursor-default">
                  FOL
                </div>
              ) : (
                <img 
                  src={logoUrl} 
                  alt="Foundation of Luv Seal" 
                  className="w-72 h-72 md:w-[480px] md:h-[480px] mx-auto drop-shadow-[0_35px_80px_rgba(223,140,61,0.4)] group-hover:drop-shadow-[0_45px_100px_rgba(223,140,61,0.6)] transition-all duration-1000 cursor-default" 
                  onError={() => setLogoError(true)}
                />
              )}
              
              {/* Outer Decorative Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%] h-[112%] border-[2px] border-dashed border-[#df8c3d]/25 rounded-full -z-10"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[128%] h-[128%] border-[1px] border-dotted border-[#801010]/20 rounded-full -z-10"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#df8c3d]/10 text-[#df8c3d] text-[10px] font-black tracking-[0.4em] mb-12 border border-[#df8c3d]/20 uppercase">
              <Sparkles size={14} />
              The LUVWATTS Movement
            </div>
            
            <h1 className="text-6xl md:text-8xl font-serif text-[#433d3b] mb-12 leading-[1] tracking-tight">
              Love in Action, <br />
              <span className="italic text-[#801010]">Change in Motion.</span>
            </h1>

            <p className="text-lg md:text-2xl text-slate-500 mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
              A professional global force dedicated to human dignity, community restoration, and sustainable empowerment through strategic action.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <motion.button 
                whileHover={{ scale: 1.05, x: 5 }}
                className="group px-14 py-6 bg-[#df8c3d] text-white rounded-full font-black text-xl hover:bg-[#c67a32] transition-all flex items-center gap-4 shadow-[0_20px_45px_-15px_rgba(223,140,61,0.5)]"
              >
                Join the Movement <MoveRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
              <button className="px-14 py-6 bg-white text-[#433d3b] border border-slate-200 rounded-full font-black text-xl hover:bg-slate-50 transition-all shadow-sm">
                Our Mission
              </button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="py-24 bg-white border-y border-[#d8d8d8]/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-5xl md:text-7xl font-serif text-[#801010] mb-3">{stat.value}{stat.suffix}</div>
                <div className="text-[10px] uppercase tracking-[0.3em] font-black text-[#433d3b] mb-2">{stat.label}</div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Services Grid */}
      <section id="services" className="py-32 bg-[#f9fafb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-[#801010] font-black tracking-[0.4em] text-[10px] uppercase mb-6 block">Foundation Pillars</span>
              <h2 className="text-5xl md:text-7xl font-serif text-[#433d3b]">Strategic Channels.</h2>
            </div>
            <p className="text-lg text-slate-500 max-w-md font-medium text-center lg:text-left leading-relaxed">
              Targeted humanitarian services engineered to restore stability and ignite long-term community transformation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {SERVICE_AREAS.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white p-12 rounded-[2.5rem] border border-slate-200 hover:border-[#df8c3d]/30 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 group"
              >
                <div className="w-16 h-16 bg-[#fcfcfc] text-[#df8c3d] rounded-2xl flex items-center justify-center mb-10 group-hover:bg-[#df8c3d] group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                  {service.icon}
                </div>
                <h4 className="text-2xl font-black text-[#433d3b] mb-4 tracking-tight">{service.title}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Roadmap */}
      <section id="roadmap" className="py-32 bg-[#433d3b] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#df8c3d]/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-24">
            <span className="text-[#df8c3d] font-black tracking-[0.4em] text-[10px] uppercase mb-6 block">Global Trajectory</span>
            <h2 className="text-5xl md:text-8xl font-serif">Roadmap to Restoration.</h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="lg:col-span-4 flex flex-col gap-4">
              {STRATEGIC_PHASES.map((phase, i) => (
                <button
                  key={i}
                  onClick={() => setActiveRoadmap(i)}
                  className={`text-left p-8 rounded-3xl transition-all border-2 flex items-center justify-between group ${
                    activeRoadmap === i 
                      ? 'bg-white text-[#433d3b] border-white shadow-[0_20px_50px_rgba(255,255,255,0.1)]' 
                      : 'bg-transparent text-white/50 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div>
                    <div className={`text-[10px] font-black uppercase tracking-widest mb-1 ${activeRoadmap === i ? 'text-[#801010]' : 'text-[#df8c3d]'}`}>
                      {phase.years}
                    </div>
                    <div className="text-xl font-bold">{phase.title}</div>
                  </div>
                  <ChevronRight className={`transition-transform duration-500 ${activeRoadmap === i ? 'rotate-90 text-[#801010]' : 'group-hover:translate-x-1'}`} />
                </button>
              ))}
            </div>

            <motion.div
              key={activeRoadmap}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8 bg-white/[0.03] backdrop-blur-xl rounded-[3rem] md:rounded-[4rem] p-10 md:p-16 border border-white/10"
            >
              <div className="grid md:grid-cols-2 gap-12 md:gap-16">
                <div>
                  <h4 className="text-[#df8c3d] text-[10px] font-black uppercase tracking-[0.3em] mb-10">Strategic Roots</h4>
                  <div className="space-y-8">
                    {STRATEGIC_PHASES[activeRoadmap].goals.map((goal, idx) => (
                      <div key={idx} className="flex gap-5 group/item">
                        <div className="w-6 h-6 rounded-full bg-[#df8c3d]/20 flex items-center justify-center flex-shrink-0 mt-1 border border-[#df8c3d]/40 group-hover/item:scale-110 transition-transform">
                          <div className="w-1.5 h-1.5 bg-[#df8c3d] rounded-full" />
                        </div>
                        <p className="text-lg text-white/80 font-medium leading-relaxed">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white text-[#433d3b] rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#df8c3d]/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <h4 className="text-[#801010] text-[10px] font-black uppercase tracking-[0.3em] mb-10">Impact Outputs</h4>
                  <div className="space-y-10">
                    {STRATEGIC_PHASES[activeRoadmap].outputs.map((output, idx) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="text-5xl md:text-6xl font-serif italic text-[#df8c3d]/20 leading-none">{idx + 1}</div>
                        <p className="text-xl font-black leading-tight tracking-tight">{output}</p>
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
      <section id="luvwatts" className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 md:gap-32 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative z-10 rounded-[3rem] md:rounded-[5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-[12px] border-white">
                <img 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=1000" 
                  alt="LUVWATTS Collective" 
                  className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-1000 scale-105 hover:scale-100" 
                />
              </div>
              <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#df8c3d]/10 rounded-full -z-0 blur-3xl" />
            </motion.div>

            <div className="order-1 lg:order-2">
              <span className="text-[#801010] font-black tracking-[0.4em] text-[10px] uppercase mb-8 block">Cultural Identity</span>
              <h2 className="text-7xl md:text-9xl font-black italic tracking-tighter mb-10 text-[#433d3b]">
                LUV<br/><span className="text-[#df8c3d]">WATTS</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-500 mb-12 font-medium leading-relaxed">
                LUVWATTS is more than an identity; it's the kinetic energy of human compassion amplified globally. A movement dedicated to lighting up lives through active love.
              </p>
              <div className="space-y-6 mb-16">
                {["Energy through Compassion", "Solidarity without Borders", "Radical Empowerment"].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 group">
                    <div className="w-14 h-14 rounded-2xl bg-[#f8fafc] flex items-center justify-center border border-slate-100 group-hover:bg-[#df8c3d] group-hover:text-white transition-all duration-300">
                      <Zap size={24} />
                    </div>
                    <span className="text-xl font-bold text-[#433d3b] tracking-tight">{item}</span>
                  </div>
                ))}
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="px-12 py-6 bg-[#433d3b] text-white rounded-full font-black text-xl hover:bg-[#1a1a1a] transition-all flex items-center gap-4 group shadow-2xl"
              >
                EXPLORE THE MOVEMENT <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#433d3b] text-white pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-20 mb-24 items-start">
            <div className="lg:col-span-2 text-center md:text-left">
              <div className="mb-12 flex justify-center md:justify-start">
                {logoError ? (
                  <div className="w-40 h-40 flex items-center justify-center bg-[#801010] text-white rounded-full font-black text-4xl tracking-tighter shadow-xl brightness-110">
                    FOL
                  </div>
                ) : (
                  <img 
                    src={logoUrl} 
                    alt="Foundation of Luv Seal" 
                    className="w-40 h-40 brightness-110 drop-shadow-lg object-contain" 
                    onError={() => setLogoError(true)}
                  />
                )}
              </div>
              <p className="text-xl md:text-2xl text-white/50 max-w-lg mb-12 font-medium leading-relaxed">
                Restoring human dignity and transforming global communities through strategic, love-led humanitarian action.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                {['Instagram', 'LinkedIn', 'YouTube'].map(social => (
                  <button key={social} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#df8c3d] transition-all border border-white/10 group">
                    <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-[#df8c3d] font-black uppercase tracking-[0.3em] text-[10px] mb-12">Core Navigation</h5>
              <ul className="space-y-6 text-lg font-bold text-white/60">
                {NAVIGATION.map(n => (
                  <li key={n.name}><a href={n.href} className="hover:text-white transition-colors">{n.name}</a></li>
                ))}
              </ul>
            </div>

            <div className="text-center md:text-left">
              <h5 className="text-[#df8c3d] font-black uppercase tracking-[0.3em] text-[10px] mb-12">HQ Connectivity</h5>
              <div className="text-lg font-bold text-white/60 space-y-4">
                <p className="hover:text-[#df8c3d] transition-colors cursor-pointer text-white">hello@foundationofluv.org</p>
                <p>Global Restoration Hub<br/>Advocacy HQ • International</p>
              </div>
            </div>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-white/20 text-[10px] font-black tracking-[0.5em] uppercase">
            <p>© 2025 FOUNDATION OF LUV (FOL). ALL RIGHTS RESERVED.</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;