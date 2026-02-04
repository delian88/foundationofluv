
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Menu, X, ChevronRight, Users, Globe, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { 
  NAVIGATION, SERVICE_AREAS, PROGRAMS, STRATEGIC_PHASES, 
  PARTNERS, STATS, COLORS 
} from './constants';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeRoadmap, setActiveRoadmap] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-indigo-950 block leading-none">FOUNDATION OF LUV</span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-indigo-500">Love In Action</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAVIGATION.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                Donate Now
              </button>
            </div>

            {/* Mobile Toggle */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
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
              className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {NAVIGATION.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-lg font-semibold text-gray-700 hover:text-indigo-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <button className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold">
                  Donate Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[100px] opacity-50" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-100 rounded-full blur-[100px] opacity-50" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold mb-6"
            >
              <Zap className="w-4 h-4" />
              <span>THE LUVWATTS MOVEMENT</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-serif text-indigo-950 mb-8 leading-tight"
            >
              Love in Action, <br />
              <span className="italic text-indigo-600">Change in Motion.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto"
            >
              Empowering the vulnerable and bridging societal divides through humanitarian service, advocacy, and holistic community support.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200">
                Join the Movement <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold text-lg hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                Our Mission
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Partners Marquee */}
      <section className="bg-white py-12 border-y border-gray-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <h2 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400">Collaborating with Global Leaders</h2>
        </div>
        <div className="flex whitespace-nowrap animate-marquee">
          {[...PARTNERS, ...PARTNERS].map((partner, i) => (
            <div key={i} className="flex items-center mx-12 text-2xl font-black text-gray-300 hover:text-indigo-200 transition-colors cursor-default select-none uppercase tracking-tighter">
              {partner}
            </div>
          ))}
        </div>
        {/* Using dangerouslySetInnerHTML to prevent parser issues with curly braces in style tag */}
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 30s linear infinite;
          }
        ` }} />
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src="https://picsum.photos/seed/fol-about/800/1000" alt="Foundation of Love in Action" className="w-full h-full object-cover aspect-[4/5]" />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-indigo-600 text-white p-12 rounded-3xl hidden md:block shadow-2xl">
                <p className="text-4xl font-serif italic mb-2">"Love transcends barriers."</p>
                <div className="w-12 h-1 bg-white/30 rounded-full" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-indigo-600 font-bold uppercase tracking-wider mb-4">Our Background</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-indigo-950 mb-8">Rooted in Humanitarian Service.</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                The Foundation of Love (FOL) was created with a simple yet profound belief: that love, dignity, and compassion can transform individuals and communities. Rooted in humanitarian service, advocacy, and holistic support, FOL was established to bridge societal divides and empower the vulnerable.
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Since inception, the foundation has touched lives across diverse demographics through outreach, capacity-building, mentorship, and community-centered initiatives. At FOL, we believe love is an energy that transcends barriers.
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="text-xl font-bold text-indigo-950 mb-3">Our Vision</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">A world rooted in love, dignity, and shared humanity—where every person lives with purpose and hope.</p>
                </div>
                <div className="p-6 bg-pink-50 rounded-2xl border border-pink-100">
                  <h4 className="text-xl font-bold text-indigo-950 mb-3">Our Mission</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">To transform lives by spreading compassion, empowering communities, and fostering enduring hope.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <h3 className="text-indigo-600 font-bold uppercase tracking-wider mb-4">Service Areas</h3>
          <h2 className="text-4xl md:text-5xl font-serif text-indigo-950 mb-6">What We Do.</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Providing a legacy of equity, wellness, and empowerment through diverse service channels.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICE_AREAS.map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h4 className="text-xl font-bold text-indigo-950 mb-4">{service.title}</h4>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* LUVWATTS Identity */}
      <section id="luvwatts" className="py-24 bg-indigo-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-800 rounded-full blur-[200px] -z-0 translate-x-1/2 -translate-y-1/2 opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-bold mb-8 backdrop-blur-md border border-indigo-400/20">
                <Zap className="w-4 h-4" />
                <span>SIGNATURE IDENTITY</span>
              </div>
              <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-br from-white to-indigo-400">
                LUVWATTS
              </h2>
              <p className="text-xl text-indigo-100 leading-relaxed mb-8">
                LUVWATTS represents the radiant energy of love when people come together. It embodies the heartbeat of the Foundation of Love—our movement, our community, and our voice. 
              </p>
              <div className="space-y-6">
                {[
                  "Love as Energy: The unifying force for transformation.",
                  "A Fashion-Forward Advocacy Initiative for global impact.",
                  "Driving fundraising and uniting supporters worldwide."
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                      <ChevronRight className="w-6 h-6 text-indigo-300" />
                    </div>
                    <span className="text-lg font-medium">{text}</span>
                  </div>
                ))}
              </div>
              <button className="mt-12 px-10 py-5 bg-white text-indigo-900 rounded-full font-black text-xl hover:bg-indigo-50 transition-all shadow-2xl shadow-white/10">
                SHOP THE COLLECTION
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="https://picsum.photos/seed/luvwatts-fashion/800/1000" 
                alt="LUVWATTS Fashion" 
                className="rounded-3xl shadow-2xl border border-white/10 relative z-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent z-30 opacity-60" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section id="impact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-indigo-600 font-bold uppercase tracking-wider mb-4">Our Impact</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-indigo-950">Projected Outcomes.</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-3xl bg-slate-50 border border-slate-100"
              >
                <div className="text-5xl font-black text-indigo-600 mb-2 font-serif">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-lg font-bold text-indigo-950 mb-2 uppercase tracking-tight">{stat.label}</div>
                <div className="text-sm text-gray-500 leading-tight">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Roadmap */}
      <section id="roadmap" className="py-24 bg-indigo-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h3 className="text-indigo-600 font-bold uppercase tracking-wider mb-4">Strategic Goals</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-indigo-950">Future Engagement Pathways.</h2>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {STRATEGIC_PHASES.map((phase, i) => (
              <button
                key={i}
                onClick={() => setActiveRoadmap(i)}
                className={`px-6 py-3 rounded-full font-bold transition-all border ${
                  activeRoadmap === i 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                }`}
              >
                {phase.title}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoadmap}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-indigo-200/50 border border-white"
            >
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <div className="text-indigo-600 font-bold text-xl mb-2">{STRATEGIC_PHASES[activeRoadmap].years}</div>
                  <h3 className="text-4xl font-serif text-indigo-950 mb-8">{STRATEGIC_PHASES[activeRoadmap].title}</h3>
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-[0.2em] font-black text-gray-400">Core Objectives</h4>
                    {STRATEGIC_PHASES[activeRoadmap].goals.map((goal, idx) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-6 h-6 bg-indigo-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        </div>
                        <p className="text-gray-600">{goal}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-indigo-50 rounded-3xl p-8 md:p-12">
                  <h4 className="text-xs uppercase tracking-[0.2em] font-black text-indigo-400 mb-8">Expected Outputs</h4>
                  <div className="space-y-8">
                    {STRATEGIC_PHASES[activeRoadmap].outputs.map((output, idx) => (
                      <div key={idx} className="flex gap-6 items-center">
                        <div className="text-5xl font-serif italic text-indigo-200">{idx + 1}</div>
                        <p className="text-xl font-bold text-indigo-900 leading-tight">{output}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Programs Quick Look */}
      <section id="programs" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-indigo-600 font-bold uppercase tracking-wider mb-4">Programs & Projects</h3>
            <h2 className="text-4xl md:text-5xl font-serif text-indigo-950">Empowerment in Practice.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((program, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 rounded-3xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/50 transition-all flex flex-col h-full"
              >
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-indigo-950 mb-3">{program.name}</h4>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{program.description}</p>
                <a href="#" className="inline-flex items-center gap-2 text-indigo-600 font-bold text-sm hover:gap-3 transition-all">
                  Learn More <ChevronRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-950 text-white pt-24 pb-12 border-t border-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 lg:col-span-1">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Heart className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold tracking-tight">FOUNDATION OF LUV</span>
              </div>
              <p className="text-indigo-200 leading-relaxed mb-8">
                “Love in Action, Change in Motion” — Building sustainable models of service delivery through global partnerships.
              </p>
              <div className="flex gap-4">
                {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(social => (
                  <div key={social} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border border-white/10">
                    <span className="sr-only">{social}</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">Our Focus</h5>
              <ul className="space-y-4 text-indigo-300">
                <li><a href="#" className="hover:text-white transition-colors">Wraparound Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Youth Mentorship</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Housing & Shelter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Financial Literacy</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">Resources</h5>
              <ul className="space-y-4 text-indigo-300">
                <li><a href="#" className="hover:text-white transition-colors">LUVWATTS Store</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Global Tours</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Partner Hub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reports & Data</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8">Stay Connected</h5>
              <p className="text-indigo-300 mb-6">Join our newsletter to receive updates on our global advocacy programs.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex-grow focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button className="bg-indigo-600 px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors">Join</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-indigo-400 text-sm">
            <p>© 2025 Foundation of Luv (FOL). All rights reserved.</p>
            <div className="flex gap-8">
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
