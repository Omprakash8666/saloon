import React from 'react';
import { useSalon } from '../context/SalonContext';
import { Star, Award, Sparkles, Calendar, CheckCircle } from 'lucide-react';

export const StylistProfiles = () => {
  const { stylists, openBookingModal } = useSalon();

  // Exclude 'stylist-any' for the showcase section
  const showcaseStylists = stylists.filter((s) => !s.isAny);

  return (
    <section id="stylists" className="py-24 px-4 sm:px-6 lg:px-8 relative bg-[#0D0F15]/60">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>European Masters & Artists</span>
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Meet Our Resident Artists
          </h2>
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Every master stylist at ÉLIXIR brings over a decade of international backstage, salon, and
            editorial mastery to tailor your individual signature style.
          </p>
        </div>

        {/* Stylists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {showcaseStylists.map((stylist) => (
            <div
              key={stylist.id}
              className="glass-panel group rounded-3xl overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
            >
              <div>
                {/* Stylist Portrait */}
                <div className="relative h-72 w-full overflow-hidden bg-gray-900">
                  <img
                    src={stylist.image}
                    alt={stylist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14161E] via-transparent to-black/30" />

                  {/* Rating Badge */}
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-[#F3E5AB]">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
                    <span>{stylist.rating}</span>
                    <span className="text-gray-400 font-normal">({stylist.reviews})</span>
                  </div>

                  {/* Experience Tag */}
                  <div className="absolute bottom-3 left-3 text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#D4AF37]/90 text-black">
                    {stylist.experience}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-serif-luxury text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors mb-1">
                    {stylist.name}
                  </h3>
                  <div className="text-xs uppercase tracking-wider text-[#D4AF37] font-medium mb-3">
                    {stylist.role}
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 mb-4 leading-relaxed">
                    {stylist.bio}
                  </p>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {stylist.specialties.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Book with Stylist Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => openBookingModal({ stylist, step: 1 })}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black border border-white/10 hover:border-[#D4AF37] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Reserve with {stylist.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
