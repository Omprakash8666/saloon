import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  CalendarCheck,
  Search,
  Clock,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const CustomerBookingsSection = () => {
  const { appointments, openCustomerBookings, openBookingModal } = useSalon();
  const [searchQuery, setSearchQuery] = useState('');

  // Show top 4 upcoming/confirmed appointments on the page or filtered by search
  const displayedAppointments = useMemo(() => {
    if (!searchQuery.trim()) {
      return appointments.slice(0, 4);
    }
    const q = searchQuery.toLowerCase().trim();
    return appointments.filter((apt) => {
      return (
        apt.clientName.toLowerCase().includes(q) ||
        apt.clientPhone.toLowerCase().includes(q) ||
        apt.bookingCode.toLowerCase().includes(q) ||
        apt.serviceNames.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [appointments, searchQuery]);

  return (
    <section id="bookings" className="py-20 px-4 sm:px-6 lg:px-8 relative bg-[#090A0D] border-t border-b border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-3">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Real-Time Appointment Register</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-white tracking-tight mb-2">
              Customer Bookings
            </h2>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl">
              Track live scheduled reservations, check appointment status, or look up your reservation using your phone number or reference ID.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone or ID..."
                className="w-full pl-10 pr-3 py-2 rounded-full bg-[#13151D] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              onClick={openCustomerBookings}
              className="gold-shimmer-btn text-black font-bold text-xs px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg cursor-pointer whitespace-nowrap"
            >
              <span>View All ({appointments.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {displayedAppointments.map((apt) => {
            let statusBadgeClass =
              'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
            if (apt.status === 'completed') {
              statusBadgeClass = 'bg-sky-500/15 text-sky-400 border-sky-500/30';
            } else if (apt.status === 'cancelled') {
              statusBadgeClass = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
            }

            return (
              <div
                key={apt.id}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Top Bar with Booking Code & Status */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#F3E5AB] border border-white/15">
                        {apt.bookingCode}
                      </span>
                      <span className="text-xs text-gray-400">• {apt.stylistName}</span>
                    </div>
                    <span
                      className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeClass}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  {/* Customer Name & Phone */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <h4 className="font-serif-luxury text-lg font-bold text-white group-hover:text-[#D4AF37] transition-colors">
                        {apt.clientName}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                        <Phone className="w-3 h-3 text-[#D4AF37]" />
                        <span>{apt.clientPhone}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-gray-400 block">Total Due</span>
                      <span className="text-base font-bold text-[#D4AF37] font-display">
                        ₹{apt.totalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Date & Time Slot Banner */}
                  <div className="p-3 rounded-2xl bg-[#141720] border border-white/5 flex items-center justify-between text-xs text-gray-300 mb-3">
                    <span className="flex items-center gap-1.5 font-medium text-white">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>{apt.date} at {apt.timeSlot}</span>
                    </span>
                    <span className="text-gray-400">({apt.totalDuration} mins)</span>
                  </div>

                  {/* Treatments List */}
                  <div className="space-y-1 mb-2">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold block">
                      Reserved Treatments:
                    </span>
                    <p className="text-xs text-gray-300 font-medium">
                      {apt.serviceNames.join(' • ')}
                    </p>
                  </div>

                  {/* Note */}
                  {apt.notes && (
                    <div className="text-[11px] text-amber-200/90 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/15 mt-2">
                      "{apt.notes}"
                    </div>
                  )}

                  {/* Attached Stylist Moodboard */}
                  {apt.moodboard &&
                    (apt.moodboard.photos?.length > 0 || apt.moodboard.inspirationNotes) && (
                      <div className="mt-2.5 p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[11px] space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                          Stylist Moodboard Attached:
                        </span>
                        {apt.moodboard.photos?.length > 0 && (
                          <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {apt.moodboard.photos.map((p) => (
                              <img
                                key={p.id}
                                src={p.url}
                                alt={p.name}
                                className="w-9 h-9 rounded-lg object-cover border border-white/20 shrink-0"
                                title={p.name}
                              />
                            ))}
                          </div>
                        )}
                        {apt.moodboard.inspirationNotes && (
                          <p className="text-gray-300 italic line-clamp-1">
                            "{apt.moodboard.inspirationNotes}"
                          </p>
                        )}
                      </div>
                    )}
                </div>

                {/* Bottom WhatsApp / View trigger */}
                <div className="pt-4 mt-3 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`https://wa.me/${apt.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Namaste ${apt.clientName}! Greetings from ÉLIXIR Royal Atelier. Your booking (${apt.bookingCode}) on ${apt.date} at ${apt.timeSlot} is confirmed.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Concierge</span>
                  </a>

                  <button
                    onClick={openCustomerBookings}
                    className="text-xs font-semibold text-[#D4AF37] hover:underline"
                  >
                    Full Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
