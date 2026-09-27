import React from 'react';
import { Coffee, Sparkles, Eye, Shield, Gem } from 'lucide-react';

export const LuxuryExperience = () => {
  const experiences = [
    {
      icon: <Gem className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Private Shirodhara & Styling Suites',
      desc: 'Quiet sanctuaries equipped with authentic copper Shirodhara vessels, acoustic soundproofing, warm ambient lighting, and private hair wash stations.',
    },
    {
      icon: <Coffee className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Royal Chai & Kahwa Hospitality',
      desc: 'Sip artisanal Kashmiri saffron kahwa, slow-brewed cardamom masala chai, fresh tender coconut water, or chilled vintage champagne while our artisans craft your look.',
    },
    {
      icon: <Eye className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Tridosha & Scalp Prakriti Analysis',
      desc: 'Diagnostic consultation before every appointment to determine your Vata, Pitta, or Kapha scalp balance and prescribe customized cold-pressed herbal oils.',
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#D4AF37]" />,
      title: 'Sacred Ayurvedic Botanicals',
      desc: 'We exclusively formulate with 100% natural Indian herbs: certified organic Sojat henna, wild Kasturi Manjal turmeric, Mysore Chandan, and amla extracts.',
    },
  ];

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Visual Collage */}
          <div className="relative">
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80"
                alt="Ayurvedic Luxury Spa Interior"
                className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                  Royal Indian Sanctuary
                </span>
                <h3 className="font-serif-luxury text-2xl font-bold text-white">
                  Designed for Meditative Rejuvenation & Quiet Splendor
                </h3>
              </div>
            </div>

            {/* Floating luxury stat pill */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 z-20 glass-panel-gold p-4 rounded-2xl shadow-2xl border border-[#D4AF37]/50 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black font-bold flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-serif-luxury">
                    100% Private & Serene
                  </div>
                  <div className="text-[11px] text-[#F3E5AB]">
                    Individual suite booking with custom Ayurvedic aroma settings
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative & Feature Cards */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Royal Atelier Standard</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight mb-6">
              Ancient Vedic Wisdom Meets Modern Coiffure
            </h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-8">
              At ÉLIXIR, every haircut, champi, and Shirodhara session is crafted as a holistic wellness ritual.
              Generous buffer times ensure our artisans devote their complete attention to your rejuvenation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-[#D4AF37]/30 transition-colors"
                >
                  <div className="mb-3">{exp.icon}</div>
                  <h4 className="font-serif-luxury text-base font-bold text-white mb-1.5">
                    {exp.title}
                  </h4>
                  <p className="text-gray-400 text-xs leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
