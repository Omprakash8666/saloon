import React, { useState } from 'react';
import { useSalon } from '../context/SalonContext';
import { MapPin, Phone, Mail, Clock, Send, Check, Globe } from 'lucide-react';

export const Footer = () => {
  const { salonInfo, openBookingModal } = useSalon();
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#07080A] border-t border-white/10 pt-20 pb-12 px-4 sm:px-6 lg:px-8 text-gray-400">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#14161E]">
                <span className="font-serif-luxury text-[#D4AF37] text-lg font-bold">É</span>
              </div>
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-white">
                ÉLIXIR
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              Bespoke Haute Coiffure, Master French Balayage, Scalp Trichology, and Precision Barbering.
              Private suites and real-time appointment scheduling.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openBookingModal()}
                className="gold-shimmer-btn text-black font-bold text-xs px-5 py-2.5 rounded-full cursor-pointer shadow-lg"
              >
                Reserve Your Appointment
              </button>
            </div>
          </div>

          {/* Locations & Contact */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white uppercase tracking-wider mb-2">
              Our Ateliers
            </h4>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{salonInfo.address}</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs sm:text-sm">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
              <span>{salonInfo.secondaryAddress}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm pt-2">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href={`tel:${salonInfo.phone}`} className="hover:text-white transition-colors">
                {salonInfo.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-xs sm:text-sm">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href={`mailto:${salonInfo.email}`} className="hover:text-white transition-colors">
                {salonInfo.email}
              </a>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <h4 className="font-serif-luxury text-base font-bold text-white uppercase tracking-wider mb-2">
              Concierge Hours
            </h4>
            {salonInfo.hours.map((h, i) => (
              <div key={i} className="text-xs sm:text-sm flex justify-between border-b border-white/5 pb-1.5">
                <span className="text-gray-400">{h.days}</span>
                <span className="text-white font-medium">{h.time}</span>
              </div>
            ))}
            <p className="text-[11px] text-[#D4AF37] italic pt-1">
              * Private after-hours VIP suites available upon advance request.
            </p>
          </div>

          {/* VIP Newsletter */}
          <div className="space-y-4">
            <h4 className="font-serif-luxury text-base font-bold text-white uppercase tracking-wider mb-1">
              VIP Privileges
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Subscribe to receive exclusive invitations to guest master stylist residencies and seasonal collections.
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>You have been added to the VIP Registry.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#14161E] border border-white/10 text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-[#D4AF37] text-black hover:bg-[#E5C378] transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs gap-4 text-gray-500">
          <div>
            © {new Date().getFullYear()} {salonInfo.name}. All Rights Reserved. Luxury Salon & Spa Booking System.
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-300">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300">Terms of Service</a>
            <a href="#" className="hover:text-gray-300">Valet & Parking</a>
            <a href="#" className="hover:text-gray-300">Staff Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
