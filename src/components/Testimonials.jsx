import React from 'react';
import { TESTIMONIALS } from '../data/salonData';
import { Star, Quote } from 'lucide-react';

export const Testimonials = () => {
  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0D0F14]/70">
      <div className="max-w-7xl mx-auto">
        {/* Press Marquee Strip */}
        <div className="text-center mb-16 pb-12 border-b border-white/10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37] font-semibold mb-6">
            Featured In & Revered By
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-60">
            {['VOGUE', 'GQ', "HARPER'S BAZAAR", 'VANITY FAIR', "L'OFFICIEL"].map((brand) => (
              <span
                key={brand}
                className="font-serif-luxury text-lg sm:text-2xl font-bold tracking-widest text-gray-300 hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-default"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Words of Appreciation
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Discover why Hollywood tastemakers, international executives, and discerning patrons
            entrust their appearance to ÉLIXIR.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="glass-panel p-8 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between relative group"
            >
              <Quote className="w-10 h-10 text-[#D4AF37]/20 absolute top-6 right-6 group-hover:text-[#D4AF37]/40 transition-colors" />

              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-[#D4AF37] mb-6">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37]" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm sm:text-base leading-relaxed italic mb-8 font-light">
                  "{item.quote}"
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]/40"
                />
                <div>
                  <h4 className="font-serif-luxury text-sm font-bold text-white">
                    {item.name}
                  </h4>
                  <p className="text-xs text-gray-400">{item.title}</p>
                  <span className="text-[10px] text-[#D4AF37] font-medium block mt-0.5">
                    Experience: {item.service}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
