import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Calendar, Sparkles, Star, Clock, Award, Shield, ArrowDown } from 'lucide-react';

export const Hero = () => {
  const { openBookingModal } = useSalon();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Ambient background light gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-[#997525]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle architectural grid pattern */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(212, 175, 55, 0.25) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-6xl mx-auto w-full text-center">
        {/* Top Prestige Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/5 border border-[#D4AF37]/30 backdrop-blur-md mb-8 animate-in fade-in duration-700">
          <div className="flex items-center text-[#D4AF37]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
            ))}
          </div>
          <span className="text-xs uppercase tracking-[0.2em] text-[#F3E5AB] font-semibold">
            Bespoke Indian Luxury & Ayurvedic Spas • Rated 4.98 / 5
          </span>
        </div>

        {/* Grand Headline */}
        <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Haute Indian Coiffure Meets{' '}
          <span className="gold-gradient-text italic font-normal">Sacred Ayurvedic Spas</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-10">
          Experience voluminous Bollywood hair artistry, authentic Kerala Shirodhara head rituals,
          and royal Nawabi grooming. Reserve your dedicated appointment slot in real time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto gold-shimmer-btn text-black font-bold text-sm sm:text-base px-8 py-4 rounded-full flex items-center justify-center gap-3 shadow-2xl cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-black" />
            <span>Book an Appointment</span>
          </button>

          <a
            href="#matcher"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#D4AF37]/15 hover:bg-[#D4AF37]/25 text-[#FFF1CA] font-semibold text-sm sm:text-base border border-[#D4AF37]/40 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>30-Sec Hair/Face Matcher</span>
          </a>

          <a
            href="#services"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-white/5 hover:bg-white/10 text-white font-medium text-sm sm:text-base border border-white/15 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Menu & Pricing (₹)</span>
            <ArrowDown className="w-4 h-4 text-[#D4AF37]" />
          </a>
        </div>

        {/* Trust & Prestige Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto pt-6 border-t border-white/10">
          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center">
            <Award className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-lg font-bold text-white font-display">15+ Years</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Master Artistry</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center">
            <Clock className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-lg font-bold text-white font-display">Real-Time</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Instant Slot Booking</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center">
            <Shield className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-lg font-bold text-white font-display">Private Suites</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">VIP Confidentiality</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl flex flex-col items-center text-center">
            <Sparkles className="w-6 h-6 text-[#D4AF37] mb-2" />
            <span className="text-lg font-bold text-white font-display">Ayurvedic</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider">Cold-Pressed Herbs</span>
          </div>
        </div>
      </div>
    </section>
  );
};
