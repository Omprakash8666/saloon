import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  X,
  Search,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Download,
  CalendarCheck,
  ShieldCheck,
  Plus,
  Sparkles,
  Palette,
  ExternalLink,
  Maximize2,
} from 'lucide-react';

export const CustomerBookingsModal = () => {
  const {
    salonInfo,
    appointments,
    isCustomerBookingsOpen,
    closeCustomerBookings,
    openBookingModal,
    setActiveView,
    cancelAppointment,
  } = useSalon();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'confirmed' | 'completed' | 'cancelled'
  const [previewModalPhoto, setPreviewModalPhoto] = useState(null);

  if (!isCustomerBookingsOpen) return null;

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;

      // Search query (matches name, phone, email, booking code, or service names)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = apt.clientName.toLowerCase().includes(q);
        const matchesPhone = apt.clientPhone.toLowerCase().includes(q);
        const matchesCode = apt.bookingCode.toLowerCase().includes(q);
        const matchesEmail = (apt.clientEmail || '').toLowerCase().includes(q);
        const matchesService = apt.serviceNames.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesPhone && !matchesCode && !matchesEmail && !matchesService) {
          return false;
        }
      }

      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  // Download .ics file
  const downloadIcs = (apt) => {
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ELIXIR Luxury Atelier//Salon Booking//EN',
      'BEGIN:VEVENT',
      `UID:${apt.bookingCode}@elixirroyal.com`,
      `SUMMARY:ÉLIXIR Atelier - ${apt.serviceNames[0]}`,
      `DESCRIPTION:Booking ID: ${apt.bookingCode}\\nStylist: ${apt.stylistName}\\nPrice: ₹${apt.totalPrice.toLocaleString('en-IN')}`,
      `LOCATION:${salonInfo.address}`,
      `DTSTART:${apt.date.replace(/-/g, '')}T100000Z`,
      `DTEND:${apt.date.replace(/-/g, '')}T120000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${apt.bookingCode}-elixir-booking.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#12141C] border border-[#D4AF37]/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#151822]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B1B] text-black font-bold flex items-center justify-center text-sm shadow-md">
              <CalendarCheck className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg sm:text-xl font-bold text-white">
                  Customer Bookings & Appointments
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
                  {appointments.length} Registered
                </span>
              </div>
              <p className="text-xs text-gray-400">
                View, track, or verify reservations across our Bandra & Indiranagar salons.
              </p>
            </div>
          </div>

          <button
            onClick={closeCustomerBookings}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 bg-[#0E1016] border-b border-white/5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full sm:flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, +91 phone, or Booking ID (e.g. ELX-84192)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#161922] border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 max-h-[62vh] space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl border border-white/10">
              <Calendar className="w-12 h-12 text-[#D4AF37]/50 mx-auto mb-3" />
              <h4 className="font-serif-luxury text-lg font-bold text-white mb-1">
                No Customer Bookings Found
              </h4>
              <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6">
                No reservations match your current search query or filter. You can schedule a new
                luxurious appointment right away.
              </p>
              <button
                onClick={() => {
                  closeCustomerBookings();
                  openBookingModal();
                }}
                className="gold-shimmer-btn text-black font-bold text-xs px-6 py-2.5 rounded-full inline-flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Plus className="w-4 h-4 text-black" />
                <span>Book a New Appointment</span>
              </button>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
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
                  className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-[#D4AF37]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 group"
                >
                  {/* Left Column: Date, Slot & Customer Details */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
                    {/* Date & Time Badge */}
                    <div className="bg-[#181B26] p-3 rounded-xl border border-white/10 text-center min-w-[125px] shrink-0">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                        {apt.date}
                      </span>
                      <span className="text-lg font-bold text-[#D4AF37] font-display">
                        {apt.timeSlot}
                      </span>
                      <span className="text-[10px] text-gray-400 block">
                        {apt.totalDuration} mins
                      </span>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-white text-base">
                          {apt.clientName}
                        </span>
                        <span className="text-xs font-mono tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#F3E5AB] border border-white/15">
                          {apt.bookingCode}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeClass}`}
                        >
                          {apt.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {apt.clientPhone}
                        </span>
                        {apt.clientEmail && (
                          <span className="flex items-center gap-1.5 text-gray-400 truncate">
                            <Mail className="w-3.5 h-3.5 text-gray-500" />
                            {apt.clientEmail}
                          </span>
                        )}
                        <span className="text-gray-300">
                          Stylist: <strong className="text-white">{apt.stylistName}</strong>
                        </span>
                      </div>

                      {/* Treatments List & Price */}
                      <div className="text-xs text-gray-300 pt-1">
                        <span className="text-gray-400">Treatments: </span>
                        <span className="font-semibold text-white">
                          {apt.serviceNames.join(' + ')}
                        </span>
                        <span className="text-sm font-bold text-[#D4AF37] font-display ml-2">
                          ₹{apt.totalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Notes / Special Requests */}
                      {apt.notes && (
                        <div className="text-[11px] text-amber-200/90 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 mt-1 max-w-xl">
                          <strong>Note:</strong> {apt.notes}
                        </div>
                      )}

                      {/* Attached Moodboard Inspiration */}
                      {apt.moodboard &&
                        (apt.moodboard.photos?.length > 0 ||
                          apt.moodboard.links?.length > 0 ||
                          apt.moodboard.inspirationNotes) && (
                          <div className="mt-2.5 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 space-y-2 max-w-2xl">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-[#F3E5AB] flex items-center gap-1.5">
                                <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Attached Stylist Moodboard & References</span>
                              </span>
                              <span className="text-[10px] text-[#D4AF37] font-semibold bg-black/40 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                                {apt.moodboard.photos?.length || 0} Photos • {apt.moodboard.links?.length || 0} Links
                              </span>
                            </div>

                            {apt.moodboard.photos?.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-1">
                                {apt.moodboard.photos.map((photo) => (
                                  <div
                                    key={photo.id}
                                    onClick={() => setPreviewModalPhoto(photo)}
                                    className="relative group w-12 h-12 rounded-lg overflow-hidden border border-white/20 bg-black cursor-pointer hover:border-[#D4AF37]"
                                    title={`${photo.name} (Click to view)`}
                                  >
                                    <img
                                      src={photo.url}
                                      alt={photo.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Maximize2 className="w-3 h-3 text-white" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {apt.moodboard.links?.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {apt.moodboard.links.map((link) => (
                                  <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-[11px] text-gray-300 hover:text-white"
                                  >
                                    <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                                    <span className="truncate max-w-[180px]">{link.title || link.url}</span>
                                  </a>
                                ))}
                              </div>
                            )}

                            {apt.moodboard.inspirationNotes && (
                              <p className="text-[11px] text-amber-200/90 italic bg-black/20 p-2 rounded-lg border border-white/5">
                                "{apt.moodboard.inspirationNotes}"
                              </p>
                            )}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5 shrink-0">
                    {/* WhatsApp Action */}
                    <a
                      href={`https://wa.me/${apt.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Namaste ${apt.clientName}! Greetings from ÉLIXIR Royal Atelier. Your booking (${apt.bookingCode}) on ${apt.date} at ${apt.timeSlot} with ${apt.stylistName} is confirmed.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
                      title="Open WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Download .ics */}
                    <button
                      onClick={() => downloadIcs(apt)}
                      className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download Calendar (.ics)"
                    >
                      <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Calendar</span>
                    </button>

                    {/* Cancel action if not already cancelled */}
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Cancel reservation"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cancel</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-4 bg-[#151822] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <div>
            Showing <strong className="text-white">{filteredAppointments.length}</strong> of{' '}
            <strong className="text-white">{appointments.length}</strong> customer bookings
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                closeCustomerBookings();
                setActiveView('admin');
              }}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Open Staff Operations Portal</span>
            </button>

            <button
              onClick={() => {
                closeCustomerBookings();
                openBookingModal();
              }}
              className="gold-shimmer-btn text-black font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>Book Another</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Photo Preview */}
      {previewModalPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewModalPhoto(null)}
        >
          <div
            className="relative max-w-2xl max-h-[85vh] bg-[#12141A] rounded-2xl border border-[#D4AF37]/40 p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 px-1 border-b border-white/10 mb-3">
              <span className="text-xs text-white font-medium truncate max-w-sm">
                {previewModalPhoto.name}
              </span>
              <button
                onClick={() => setPreviewModalPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl max-h-[68vh] flex items-center justify-center bg-black">
              <img
                src={previewModalPhoto.url}
                alt={previewModalPhoto.name}
                className="max-h-[65vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="w-full pt-3 px-1 flex items-center justify-between text-xs text-gray-400">
              <span>Attached Moodboard Reference</span>
              <button
                onClick={() => setPreviewModalPhoto(null)}
                className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
