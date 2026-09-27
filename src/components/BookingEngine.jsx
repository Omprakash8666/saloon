import React, { useState, useMemo, useRef } from 'react';
import { useSalon } from '../context/SalonContext';
import { INSPIRATION_PRESETS } from '../data/salonData';
import {
  X,
  Check,
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Download,
  Share2,
  Star,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Trash2,
  Camera,
  Maximize2,
  Eye,
  Link as LinkIcon,
  Compass,
  Palette,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const BookingEngine = () => {
  const {
    salonInfo,
    services,
    stylists,
    timeSlots,
    bookingDraft,
    isBookingModalOpen,
    closeBookingModal,
    resetBookingDraft,
    completedBooking,
    goToStep,
    nextStep,
    prevStep,
    toggleServiceInDraft,
    setDraftStylist,
    setDraftDate,
    setDraftTimeSlot,
    setDraftCustomer,
    // Moodboard helpers
    addDraftMoodboardPhoto,
    removeDraftMoodboardPhoto,
    addDraftMoodboardLink,
    removeDraftMoodboardLink,
    setDraftMoodboardNotes,
    confirmBooking,
    checkSlotStatus,
    setActiveView,
  } = useSalon();

  const [dateFilterDays, setDateFilterDays] = useState(14); // Next 14 days
  const [loyaltyDiscount, setLoyaltyDiscount] = useState(0);
  const [discountError, setDiscountError] = useState('');

  // Moodboard state
  const [pastedLink, setPastedLink] = useState('');
  const [pastedLinkTitle, setPastedLinkTitle] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [activeMoodboardTab, setActiveMoodboardTab] = useState('upload'); // 'upload' | 'link' | 'presets'
  const [previewModalPhoto, setPreviewModalPhoto] = useState(null);
  const fileInputRef = useRef(null);

  // Generate date array for the next 14 days starting today
  const availableDates = useMemo(() => {
    const list = [];
    const today = new Date();
    for (let i = 0; i < dateFilterDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.toLocaleDateString('en-US', { day: 'numeric' });
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      list.push({ iso, weekday, dayNum, month, isToday: i === 0 });
    }
    return list;
  }, [dateFilterDays]);

  if (!isBookingModalOpen) return null;

  // Totals calculations
  const totalDuration = bookingDraft.selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const subtotal = bookingDraft.selectedServices.reduce((sum, s) => sum + s.price, 0);
  const discountAmount = Math.round((subtotal * loyaltyDiscount) / 100);
  const finalPrice = Math.max(0, subtotal - discountAmount);

  const formatDuration = (mins) => {
    const hours = Math.floor(mins / 60);
    const m = mins % 60;
    if (hours > 0 && m > 0) return `${hours}h ${m}m`;
    if (hours > 0) return `${hours}h`;
    return `${m} mins`;
  };

  const handleApplyPromo = (code) => {
    if (!code) return;
    const clean = code.trim().toUpperCase();
    if (clean === 'VIP10' || clean === 'ELIXIR10') {
      setLoyaltyDiscount(10);
      setDiscountError('');
    } else if (clean === 'FIRST20' || clean === 'HAUTE20') {
      setLoyaltyDiscount(20);
      setDiscountError('');
    } else {
      setDiscountError('Invalid code. Try "VIP10" or "HAUTE20"');
    }
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (booking) => {
    if (!booking) return '#';
    const title = encodeURIComponent(`ÉLIXIR Atelier: ${booking.serviceNames.join(' & ')}`);
    const details = encodeURIComponent(
      `Appointment Code: ${booking.bookingCode}\nStylist: ${booking.stylistName}\nLocation: ${salonInfo.address}\nClient: ${booking.clientName} (${booking.clientPhone})\nTotal: ₹${booking.totalPrice.toLocaleString('en-IN')}`
    );
    const location = encodeURIComponent(salonInfo.address);
    // Rough date format YYYYMMDD
    const dateFormatted = booking.date.replace(/-/g, '');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dateFormatted}T100000Z/${dateFormatted}T120000Z&details=${details}&location=${location}`;
  };

  // Download iCal (.ics) file
  const downloadIcsFile = (booking) => {
    if (!booking) return;
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ELIXIR Luxury Atelier//Salon Booking//EN',
      'BEGIN:VEVENT',
      `UID:${booking.bookingCode}@elixiratelier.com`,
      `SUMMARY:ÉLIXIR Luxury Salon - ${booking.serviceNames[0]}`,
      `DESCRIPTION:Booking Code: ${booking.bookingCode}\\nStylist: ${booking.stylistName}\\nPrice: ₹${booking.totalPrice.toLocaleString('en-IN')}`,
      `LOCATION:${salonInfo.address}`,
      `DTSTART:${booking.date.replace(/-/g, '')}T100000Z`,
      `DTEND:${booking.date.replace(/-/g, '')}T120000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${booking.bookingCode}-elixir-appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Moodboard Upload Handler
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const currentPhotos = bookingDraft.moodboard?.photos || [];
    if (currentPhotos.length + files.length > 6) {
      setUploadError('Maximum 6 reference photos allowed.');
      return;
    }
    setUploadError('');

    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select image files only (PNG, JPG, WEBP).');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setUploadError('Image size exceeds 8MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const photoObj = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          url: event.target.result,
          name: file.name,
          source: 'upload',
          sizeKb: Math.round(file.size / 1024),
          addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        addDraftMoodboardPhoto(photoObj);
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // Add Instagram / Pinterest / Direct URL Link
  const handleAddSocialLink = (e) => {
    if (e) e.preventDefault();
    if (!pastedLink.trim()) return;

    const url = pastedLink.trim();
    let platform = 'web';
    if (url.includes('instagram.com') || url.includes('instagr.am')) {
      platform = 'instagram';
    } else if (url.includes('pinterest.com') || url.includes('pin.it')) {
      platform = 'pinterest';
    }

    const newLink = {
      id: `link-${Date.now()}`,
      url,
      platform,
      title:
        pastedLinkTitle.trim() ||
        (platform === 'instagram'
          ? 'Instagram Reference Post'
          : platform === 'pinterest'
          ? 'Pinterest Moodboard Pin'
          : 'Web Look Reference'),
      addedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    addDraftMoodboardLink(newLink);
    setPastedLink('');
    setPastedLinkTitle('');
  };

  // 1-Click Add Preset Inspiration
  const handleAddPreset = (preset) => {
    const photoObj = {
      id: `preset-${Date.now()}-${preset.id}`,
      url: preset.image,
      name: `${preset.title} (${preset.platform})`,
      source: preset.platform.toLowerCase(),
      tag: preset.tag,
    };
    addDraftMoodboardPhoto(photoObj);

    const currentNotes = bookingDraft.moodboard?.inspirationNotes || '';
    if (!currentNotes.trim()) {
      setDraftMoodboardNotes(`Inspiration: ${preset.suggestedNotes}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl bg-[#12141C] border border-[#D4AF37]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#151822]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B1B] text-black font-bold flex items-center justify-center text-sm shadow-md">
              É
            </div>
            <div>
              <h3 className="font-serif-luxury text-lg font-bold text-white">
                Bespoke Appointment Booking
              </h3>
              <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]">
                ÉLIXIR Atelier & Spa • Rodeo Drive
              </p>
            </div>
          </div>

          <button
            onClick={closeBookingModal}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Multi-Step Flow or Completed Screen */}
        {!completedBooking ? (
          <>
            {/* Stepper Progress Indicator */}
            <div className="px-6 py-4 bg-[#0F1117] border-b border-white/5">
              <div className="grid grid-cols-5 gap-2">
                {[
                  { num: 1, label: 'Services' },
                  { num: 2, label: 'Stylist' },
                  { num: 3, label: 'Date & Slot' },
                  { num: 4, label: 'Guest & Moodboard' },
                  { num: 5, label: 'Review' },
                ].map((s) => {
                  const isActive = bookingDraft.step === s.num;
                  const isCompleted = bookingDraft.step > s.num;
                  return (
                    <button
                      key={s.num}
                      onClick={() => {
                        // Allow clicking back to earlier steps or current step
                        if (isCompleted || isActive) {
                          goToStep(s.num);
                        }
                      }}
                      disabled={!isCompleted && !isActive}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-center transition-all ${
                        isActive
                          ? 'bg-[#D4AF37]/15 border border-[#D4AF37] text-[#D4AF37] font-semibold'
                          : isCompleted
                          ? 'text-gray-300 hover:text-white cursor-pointer'
                          : 'text-gray-600 opacity-60 cursor-not-allowed'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive
                            ? 'bg-[#D4AF37] text-black'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-white/5 text-gray-400'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                      </div>
                      <span className="text-[11px] sm:text-xs truncate">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Modal Body Container with Smooth Scroll */}
            <div className="p-6 overflow-y-auto flex-1 max-h-[62vh]">
              {/* STEP 1: SERVICE SELECTION */}
              {bookingDraft.step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-xl font-bold text-white">
                        Step 1: Select Your Treatments
                      </h4>
                      <p className="text-xs text-gray-400">
                        Choose one or combine multiple services for your visit.
                      </p>
                    </div>
                    {bookingDraft.selectedServices.length > 0 && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30">
                        {bookingDraft.selectedServices.length} Selected (₹{subtotal.toLocaleString('en-IN')})
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {services.map((service) => {
                      const isSelected = bookingDraft.selectedServices.some(
                        (s) => s.id === service.id
                      );
                      return (
                        <div
                          key={service.id}
                          onClick={() => toggleServiceInDraft(service)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-start ${
                            isSelected
                              ? 'bg-[#1E2230] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <img
                            src={service.image}
                            alt={service.name}
                            className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h5 className="font-serif-luxury text-sm font-bold text-white truncate">
                                {service.name}
                              </h5>
                              <span className="text-sm font-bold text-[#D4AF37]">
                                ₹{service.price.toLocaleString('en-IN')}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                              <span className="text-gray-300 font-medium">
                                {service.categoryName}
                              </span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#D4AF37]" />
                                {service.duration} mins
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-1 mt-1">
                              {service.description}
                            </p>
                          </div>
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-1 border transition-all ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37]'
                                : 'border-white/20 text-transparent'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: STYLIST SELECTION */}
              {bookingDraft.step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h4 className="font-serif-luxury text-xl font-bold text-white">
                      Step 2: Choose Your Stylist / Barber
                    </h4>
                    <p className="text-xs text-gray-400">
                      Select your preferred master artisan or opt for Any Available Specialist.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {stylists.map((stylist) => {
                      const isSelected = bookingDraft.selectedStylist?.id === stylist.id;
                      return (
                        <div
                          key={stylist.id}
                          onClick={() => setDraftStylist(stylist)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#1E2230] border-[#D4AF37] shadow-lg shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                          }`}
                        >
                          <div>
                            <div className="relative h-32 rounded-xl overflow-hidden mb-3 bg-gray-800">
                              <img
                                src={stylist.image}
                                alt={stylist.name}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[11px] font-semibold text-[#F3E5AB]">
                                <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                                <span>{stylist.rating}</span>
                                <span className="text-gray-400">({stylist.reviews})</span>
                              </div>
                            </div>

                            <h5 className="font-serif-luxury text-base font-bold text-white mb-0.5">
                              {stylist.name}
                            </h5>
                            <div className="text-[11px] text-[#D4AF37] font-medium mb-2">
                              {stylist.role}
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                              {stylist.bio}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-gray-400">
                              {stylist.experience}
                            </span>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                isSelected
                                  ? 'bg-[#D4AF37] text-black'
                                  : 'bg-white/5 text-gray-400'
                              }`}
                            >
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: DATE & DYNAMIC TIME SLOT GRID */}
              {bookingDraft.step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h4 className="font-serif-luxury text-xl font-bold text-white">
                      Step 3: Select Date & Time Slot
                    </h4>
                    <p className="text-xs text-gray-400">
                      Slots are updated in real time based on stylist availability and buffer intervals.
                    </p>
                  </div>

                  {/* Horizontal Date Picker Strip */}
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2.5 flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Select Appointment Date</span>
                    </div>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                      {availableDates.map((item) => {
                        const isSelected = bookingDraft.selectedDate === item.iso;
                        return (
                          <button
                            key={item.iso}
                            onClick={() => setDraftDate(item.iso)}
                            className={`min-w-[76px] py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-lg shadow-[#D4AF37]/20 scale-105'
                                : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
                            }`}
                          >
                            <span className="text-[11px] uppercase tracking-wider opacity-80">
                              {item.weekday}
                            </span>
                            <span className="text-lg font-bold font-display leading-tight my-0.5">
                              {item.dayNum}
                            </span>
                            <span className="text-[10px] uppercase opacity-70">
                              {item.month}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Time Slot Grid with Morning, Afternoon, Evening groups */}
                  <div className="space-y-5 pt-2">
                    {['Morning', 'Afternoon', 'Evening'].map((period) => {
                      const periodSlots = timeSlots.filter((t) => t.period === period);
                      return (
                        <div key={period} className="space-y-2">
                          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Clock className="w-3 h-3 text-[#D4AF37]" />
                            <span>{period} Slots</span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
                            {periodSlots.map((slot) => {
                              const isSelected = bookingDraft.selectedTimeSlot === slot.time;
                              const status = checkSlotStatus(
                                bookingDraft.selectedDate,
                                slot.time,
                                bookingDraft.selectedStylist?.id
                              );

                              // Slot is available or not
                              if (!status.isAvailable) {
                                return (
                                  <div
                                    key={slot.id}
                                    title={status.reason || 'Unavailable'}
                                    className="py-2.5 px-3 rounded-xl bg-white/5 border border-white/5 text-gray-600 text-xs text-center flex flex-col items-center justify-center opacity-40 cursor-not-allowed"
                                  >
                                    <span className="line-through">{slot.time}</span>
                                    <span className="text-[9px] uppercase tracking-tighter text-rose-400/80">
                                      {status.status === 'blocked' ? 'Blocked' : 'Booked'}
                                    </span>
                                  </div>
                                );
                              }

                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => setDraftTimeSlot(slot.time)}
                                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-gradient-to-r from-[#D4AF37] to-[#E6C665] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/25 font-bold scale-102'
                                      : 'bg-[#181B26] text-gray-200 border-white/10 hover:border-[#D4AF37]/50 hover:bg-[#202433]'
                                  }`}
                                >
                                  <span>{slot.time}</span>
                                  <span
                                    className={`text-[9px] font-normal ${
                                      isSelected ? 'text-black/80' : 'text-emerald-400'
                                    }`}
                                  >
                                    Available
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Slot Legend */}
                  <div className="flex items-center gap-4 text-xs text-gray-400 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#181B26] border border-white/20" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-white/10 opacity-40" />
                      <span>Booked / Reserved</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: GUEST INFORMATION & STYLIST MOODBOARD */}
              {bookingDraft.step === 4 && (
                <div className="space-y-8 animate-in fade-in duration-300">
                  {/* Step Header */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                        Step 4 of 5
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Stylist Preparation Portal
                      </span>
                    </div>
                    <h4 className="font-serif-luxury text-xl sm:text-2xl font-bold text-white">
                      Guest Information & Stylist Moodboard
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      Enter your contact details and upload hairstyle inspiration photos from Instagram or Pinterest
                      so our master stylists can study your desired vision before you arrive.
                    </p>
                  </div>

                  {/* Primary Contact Details */}
                  <div className="p-5 rounded-2xl bg-[#141720] border border-white/10 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold block">
                      1. Client Contact Details
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Full Name <span className="text-[#D4AF37]">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="text"
                            required
                            value={bookingDraft.customer.name}
                            onChange={(e) => setDraftCustomer('name', e.target.value)}
                            placeholder="e.g. Genevieve Sterling"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Phone Number <span className="text-[#D4AF37]">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="tel"
                            required
                            value={bookingDraft.customer.phone}
                            onChange={(e) => setDraftCustomer('phone', e.target.value)}
                            placeholder="+91 98200 48291"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Email Address (Calendar Sync & Confirmation)
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                          <input
                            type="email"
                            value={bookingDraft.customer.email}
                            onChange={(e) => setDraftCustomer('email', e.target.value)}
                            placeholder="genevieve@sterling.com"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          General Concierge Requests (Beverage, Allergies, Quiet Suite)
                        </label>
                        <div className="relative">
                          <FileText className="w-4 h-4 absolute left-3.5 top-3 text-gray-500" />
                          <textarea
                            rows={2}
                            value={bookingDraft.customer.notes}
                            onChange={(e) => setDraftCustomer('notes', e.target.value)}
                            placeholder="e.g. Prefer saffron tea, sensitive scalp, attending gala in the evening..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#181B26] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. DEDICATED STYLIST MOODBOARD & REFERENCE SECTION */}
                  <div className="p-5 rounded-2xl bg-gradient-to-b from-[#181B28] to-[#12141F] border border-[#D4AF37]/35 shadow-xl space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center shadow-md">
                          <Palette className="w-4 h-4 text-black" />
                        </div>
                        <div>
                          <h5 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2">
                            <span>Stylist Moodboard & Visual Inspiration</span>
                            <span className="text-[10px] uppercase font-display bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded-md border border-[#D4AF37]/30">
                              Instagram & Pinterest
                            </span>
                          </h5>
                          <p className="text-[11px] text-gray-400">
                            Upload photos or paste URLs so your stylist reviews inspiration notes prior to your appointment.
                          </p>
                        </div>
                      </div>

                      {/* Active count badge */}
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto">
                        {(bookingDraft.moodboard?.photos?.length || 0)}/6 Photos Attached
                      </span>
                    </div>

                    {/* AI / Matcher Quiz profile callout if applied */}
                    {bookingDraft.moodboard?.matcherResult && (
                      <div className="p-3.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                          <div>
                            <span className="font-bold text-[#F3E5AB]">
                              Harmonized 30-Sec Hair & Face Profile Attached:
                            </span>{' '}
                            <span className="text-gray-300">
                              {bookingDraft.moodboard.matcherResult.faceShape} Face •{' '}
                              {bookingDraft.moodboard.matcherResult.hairLength} •{' '}
                              {bookingDraft.moodboard.matcherResult.hairTexture}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          Active
                        </span>
                      </div>
                    )}

                    {/* Moodboard Input Tabs */}
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                      <button
                        type="button"
                        onClick={() => setActiveMoodboardTab('upload')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeMoodboardTab === 'upload'
                            ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                            : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Reference Photos</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMoodboardTab('link')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeMoodboardTab === 'link'
                            ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                            : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Instagram / Pinterest Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMoodboardTab('presets')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          activeMoodboardTab === 'presets'
                            ? 'bg-[#D4AF37] text-black font-bold shadow-md'
                            : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Curated Looks</span>
                      </button>
                    </div>

                    {/* TAB 1: DIRECT FILE UPLOAD */}
                    {activeMoodboardTab === 'upload' && (
                      <div className="space-y-3">
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] bg-black/20 hover:bg-black/40 rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center group"
                        >
                          <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center mb-2.5 transition-colors">
                            <Camera className="w-6 h-6 text-[#D4AF37]" />
                          </div>
                          <span className="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors">
                            Click to upload reference photos from your device or camera
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Supports JPG, PNG, WEBP (Up to 6 reference photos, 8MB each)
                          </span>
                          <input
                            type="file"
                            ref={fileInputRef}
                            multiple
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </div>
                        {uploadError && (
                          <p className="text-xs text-rose-400 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>{uploadError}</span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* TAB 2: INSTAGRAM & PINTEREST URL IMPORTER */}
                    {activeMoodboardTab === 'link' && (
                      <div className="space-y-3 p-4 rounded-xl bg-black/30 border border-white/5">
                        <div className="flex items-center gap-2 text-xs text-gray-300 mb-1">
                          <span className="w-2 h-2 rounded-full bg-pink-500" />
                          <span>Paste an Instagram post URL or Pinterest pin/board link:</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <input
                            type="url"
                            value={pastedLink}
                            onChange={(e) => setPastedLink(e.target.value)}
                            placeholder="https://instagram.com/p/... or https://pinterest.com/pin/..."
                            className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-[#141720] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                          />
                          <input
                            type="text"
                            value={pastedLinkTitle}
                            onChange={(e) => setPastedLinkTitle(e.target.value)}
                            placeholder="Title (e.g. Curtain bangs)"
                            className="px-3.5 py-2.5 rounded-xl bg-[#141720] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-gray-400">
                            Stylists can open Instagram and Pinterest directly from their workstation iPad.
                          </span>
                          <button
                            type="button"
                            onClick={handleAddSocialLink}
                            disabled={!pastedLink.trim()}
                            className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E5C378] disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Pin Link to Board</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* TAB 3: CURATED LOOKS PRESETS */}
                    {activeMoodboardTab === 'presets' && (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                          Click any trending salon aesthetic to instantly attach it as inspiration for your stylist:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {INSPIRATION_PRESETS.map((preset) => (
                            <div
                              key={preset.id}
                              className="p-3 rounded-xl bg-[#141722] border border-white/10 hover:border-[#D4AF37]/50 flex gap-3 items-center group transition-all"
                            >
                              <img
                                src={preset.image}
                                alt={preset.title}
                                className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#D4AF37] block">
                                  {preset.platform} • {preset.tag}
                                </span>
                                <h6 className="text-xs font-bold text-white truncate group-hover:text-[#D4AF37] transition-colors">
                                  {preset.title}
                                </h6>
                                <button
                                  type="button"
                                  onClick={() => handleAddPreset(preset)}
                                  className="mt-1.5 text-[10px] font-bold text-[#D4AF37] hover:text-white flex items-center gap-1 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  <span>Add to Moodboard</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ATTACHED MOODBOARD GALLERY */}
                    {bookingDraft.moodboard?.photos?.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                          Attached Reference Photos ({bookingDraft.moodboard.photos.length})
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {bookingDraft.moodboard.photos.map((photo) => (
                            <div
                              key={photo.id}
                              className="relative group rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black/40 aspect-square shadow-md"
                            >
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />

                              {/* Platform or Source Badge */}
                              <div className="absolute top-1.5 left-1.5 z-10">
                                <span className="text-[9px] font-bold uppercase tracking-wider bg-black/80 backdrop-blur-md text-[#F3E5AB] px-1.5 py-0.5 rounded-md border border-white/20">
                                  {photo.source || 'Photo'}
                                </span>
                              </div>

                              {/* Hover Overlay with View / Delete */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setPreviewModalPhoto(photo)}
                                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"
                                  title="Enlarge preview"
                                >
                                  <Maximize2 className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeDraftMoodboardPhoto(photo.id)}
                                  className="w-8 h-8 rounded-full bg-rose-500/80 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                                  title="Remove photo"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-1.5">
                                <p className="text-[10px] text-gray-200 truncate">{photo.name}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ATTACHED SOCIAL REFERENCE LINKS */}
                    {bookingDraft.moodboard?.links?.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                          Pinned Reference Links ({bookingDraft.moodboard.links.length})
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {bookingDraft.moodboard.links.map((link) => (
                            <div
                              key={link.id}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-xs text-gray-200"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:underline truncate max-w-[200px]"
                              >
                                {link.title || link.url}
                              </a>
                              <button
                                type="button"
                                onClick={() => removeDraftMoodboardLink(link.id)}
                                className="text-gray-400 hover:text-rose-400 ml-1 cursor-pointer"
                                title="Remove link"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* INSPIRATION NOTES SPECIFICALLY FOR STYLIST */}
                    <div className="pt-2 border-t border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Inspiration Notes for Stylist</span>
                        </label>
                        <span className="text-[11px] text-gray-500">
                          Reviewed before your appointment
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        value={bookingDraft.moodboard?.inspirationNotes || ''}
                        onChange={(e) => setDraftMoodboardNotes(e.target.value)}
                        placeholder="e.g. I want to keep the length below collarbone, curtain bangs sweeping outwards like in photo 1, warm golden balayage tones, avoid blunt ends..."
                        className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-[#D4AF37] leading-relaxed"
                      />

                      {/* Quick Tag Pills to tap */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-gray-400 self-center mr-1">Quick ideas:</span>
                        {[
                          'Keep current length',
                          'Face-framing curtain bangs',
                          'Warm caramel undertones',
                          'High bounce blowout',
                          'Avoid heavy hairspray',
                          'Voluminous crown lift',
                        ].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              const curr = bookingDraft.moodboard?.inspirationNotes || '';
                              setDraftMoodboardNotes(curr ? `${curr}, ${tag}` : tag);
                            }}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-[#D4AF37] border border-white/10 transition-colors"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* VIP Promo Code Section */}
                  <div className="p-4 rounded-2xl bg-[#141720] border border-white/10 space-y-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                      VIP / Loyalty Invitation Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bookingDraft.customer.loyaltyCode}
                        onChange={(e) => setDraftCustomer('loyaltyCode', e.target.value)}
                        placeholder="Try VIP10 or HAUTE20"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#181B26] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37] uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyPromo(bookingDraft.customer.loyaltyCode)}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/15 cursor-pointer"
                      >
                        Apply Code
                      </button>
                    </div>
                    {loyaltyDiscount > 0 && (
                      <p className="text-xs text-emerald-400 mt-1">
                        VIP Discount applied: {loyaltyDiscount}% OFF your appointment!
                      </p>
                    )}
                    {discountError && (
                      <p className="text-xs text-rose-400 mt-1">{discountError}</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: BOOKING REVIEW */}
              {bookingDraft.step === 5 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div>
                    <h4 className="font-serif-luxury text-xl font-bold text-white">
                      Step 5: Review & Confirm Your Reservation
                    </h4>
                    <p className="text-xs text-gray-400">
                      Please verify your reserved treatments, stylist, and time slot before finalizing.
                    </p>
                  </div>

                  <div className="glass-panel p-6 rounded-2xl space-y-4 border border-[#D4AF37]/30">
                    {/* Stylist & Datetime summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          Dedicated Stylist
                        </span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {bookingDraft.selectedStylist?.name}
                        </div>
                        <div className="text-xs text-[#D4AF37]">
                          {bookingDraft.selectedStylist?.role}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          Appointment Date
                        </span>
                        <div className="text-sm font-bold text-white mt-0.5">
                          {bookingDraft.selectedDate}
                        </div>
                        <div className="text-xs text-gray-400">Beverly Hills Atelier</div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                          Reserved Slot
                        </span>
                        <div className="text-sm font-bold text-[#D4AF37] mt-0.5">
                          {bookingDraft.selectedTimeSlot}
                        </div>
                        <div className="text-xs text-gray-400">
                          Est. Duration: {formatDuration(totalDuration)}
                        </div>
                      </div>
                    </div>

                    {/* Selected services list */}
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                        Selected Treatments ({bookingDraft.selectedServices.length})
                      </span>
                      {bookingDraft.selectedServices.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between text-sm py-1.5 border-b border-white/5"
                        >
                          <div>
                            <span className="font-medium text-white">{service.name}</span>
                            <span className="text-xs text-gray-400 ml-2">
                              ({service.duration} mins)
                            </span>
                          </div>
                          <span className="font-bold text-[#D4AF37]">₹{service.price.toLocaleString('en-IN')}</span>
                        </div>
                      ))}
                    </div>

                    {/* Pricing breakdown */}
                    <div className="pt-2 space-y-1.5 text-sm">
                      <div className="flex items-center justify-between text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {loyaltyDiscount > 0 && (
                        <div className="flex items-center justify-between text-emerald-400">
                          <span>VIP Loyalty ({loyaltyDiscount}%)</span>
                          <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-base font-bold text-white pt-2 border-t border-white/10">
                        <span>Total Due</span>
                        <span className="text-xl text-[#D4AF37] font-display">
                          ₹{finalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 italic">
                        * Payment can be completed upon arrival at salon concierge. No upfront charge required.
                      </p>
                    </div>

                    {/* Client Information Review */}
                    <div className="pt-3 border-t border-white/10 text-xs text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                          Client Name
                        </span>
                        <span>{bookingDraft.customer.name}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                          Contact Phone
                        </span>
                        <span>{bookingDraft.customer.phone}</span>
                      </div>
                      {bookingDraft.customer.notes && (
                        <div className="sm:col-span-2">
                          <span className="text-gray-500 font-semibold uppercase text-[10px] block">
                            Concierge Notes
                          </span>
                          <span>{bookingDraft.customer.notes}</span>
                        </div>
                      )}
                    </div>

                    {/* Stylist Moodboard & Inspiration Review */}
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-wider text-[#D4AF37] font-semibold flex items-center gap-1.5">
                          <Palette className="w-3.5 h-3.5" />
                          <span>Stylist Moodboard & Visual References</span>
                        </span>
                        {(bookingDraft.moodboard?.photos?.length > 0 || bookingDraft.moodboard?.links?.length > 0) && (
                          <span className="text-[10px] bg-[#D4AF37]/15 text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30 font-medium">
                            {(bookingDraft.moodboard?.photos?.length || 0)} Photos • {(bookingDraft.moodboard?.links?.length || 0)} Links
                          </span>
                        )}
                      </div>

                      {/* Photo Previews */}
                      {bookingDraft.moodboard?.photos?.length > 0 ? (
                        <div className="flex flex-wrap gap-2.5">
                          {bookingDraft.moodboard.photos.map((photo) => (
                            <div
                              key={photo.id}
                              onClick={() => setPreviewModalPhoto(photo)}
                              className="relative group w-16 h-16 rounded-xl overflow-hidden border border-white/20 bg-black cursor-pointer hover:border-[#D4AF37] shadow-sm"
                              title={`${photo.name} (Click to enlarge)`}
                            >
                              <img
                                src={photo.url}
                                alt={photo.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-3.5 h-3.5 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          No reference photos attached (stylist will conduct visual in-person consultation).
                        </p>
                      )}

                      {/* Pinned Links */}
                      {bookingDraft.moodboard?.links?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {bookingDraft.moodboard.links.map((link) => (
                            <a
                              key={link.id}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-xs text-gray-300 hover:text-white transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                              <span className="truncate max-w-[200px]">{link.title || link.url}</span>
                            </a>
                          ))}
                        </div>
                      )}

                      {/* Stylist Inspiration Notes */}
                      {bookingDraft.moodboard?.inspirationNotes && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 space-y-1">
                          <strong className="text-[#F3E5AB] block font-semibold">
                            Inspiration Notes for Stylist:
                          </strong>
                          <p className="whitespace-pre-line leading-relaxed">
                            {bookingDraft.moodboard.inspirationNotes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="px-6 py-4 bg-[#151822] border-t border-white/10 flex items-center justify-between">
              <div>
                {bookingDraft.step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <button
                    onClick={closeBookingModal}
                    className="text-xs text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {bookingDraft.step === 1 && (
                  <button
                    disabled={bookingDraft.selectedServices.length === 0}
                    onClick={nextStep}
                    className="gold-shimmer-btn disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Choose Stylist</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {bookingDraft.step === 2 && (
                  <button
                    onClick={nextStep}
                    className="gold-shimmer-btn text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Select Date & Slot</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {bookingDraft.step === 3 && (
                  <button
                    disabled={!bookingDraft.selectedTimeSlot}
                    onClick={nextStep}
                    className="gold-shimmer-btn disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Guest Information</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {bookingDraft.step === 4 && (
                  <button
                    disabled={
                      !bookingDraft.customer.name.trim() ||
                      !bookingDraft.customer.phone.trim()
                    }
                    onClick={nextStep}
                    className="gold-shimmer-btn disabled:opacity-40 disabled:pointer-events-none text-black font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer"
                  >
                    <span>Review Booking</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {bookingDraft.step === 5 && (
                  <button
                    onClick={confirmBooking}
                    className="gold-shimmer-btn text-black font-bold text-sm px-7 py-3 rounded-xl flex items-center gap-2 shadow-2xl cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5 text-black" />
                    <span>Confirm & Finalize Reservation</span>
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* STEP 5 RESULT: INSTANT LUXURY CONFIRMATION SCREEN */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-400">
            {/* Success Checkmark with Gold Glow */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FFF1CA] text-black flex items-center justify-center shadow-2xl animate-gold-glow">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold">
                Reservation Confirmed
              </span>
              <h4 className="font-serif-luxury text-3xl font-bold text-white mt-1">
                We Look Forward to Welcoming You
              </h4>
              <p className="text-gray-400 text-sm max-w-md mx-auto mt-2">
                A confirmation concierge message has been registered. Your private styling suite is reserved.
              </p>
            </div>

            {/* Booking Reference Code Card */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-[#1A1D26] border border-[#D4AF37]/40 shadow-xl flex items-center justify-between">
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">
                  Booking Reference ID
                </span>
                <span className="text-2xl font-bold tracking-widest text-[#D4AF37] font-display">
                  {completedBooking.bookingCode}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Summary Details */}
            <div className="max-w-md mx-auto text-left p-4 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-400">Guest:</span>
                <span className="font-semibold text-white">{completedBooking.clientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Stylist:</span>
                <span className="font-semibold text-white">{completedBooking.stylistName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date & Slot:</span>
                <span className="font-semibold text-[#D4AF37]">
                  {completedBooking.date} at {completedBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Treatments:</span>
                <span className="font-semibold text-white text-right">
                  {completedBooking.serviceNames.join(', ')}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold">
                <span className="text-gray-300">Amount Due at Salon:</span>
                <span className="text-sm text-[#D4AF37] font-display">
                  ₹{completedBooking.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Attached Moodboard Confirmation Pill */}
            {completedBooking.moodboard &&
              (completedBooking.moodboard.photos?.length > 0 ||
                completedBooking.moodboard.links?.length > 0 ||
                completedBooking.moodboard.inspirationNotes) && (
                <div className="max-w-md mx-auto text-left p-4 rounded-xl bg-[#141722] border border-[#D4AF37]/30 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F3E5AB] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Stylist Moodboard & Inspiration Transmitted</span>
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                      Stylist Notified
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300">
                    Your reference photos and consultation notes have been delivered to {completedBooking.stylistName}'s workstation.
                  </p>
                  {completedBooking.moodboard.photos?.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {completedBooking.moodboard.photos.map((p) => (
                        <img
                          key={p.id}
                          src={p.url}
                          alt={p.name}
                          onClick={() => setPreviewModalPhoto(p)}
                          className="w-12 h-12 rounded-lg object-cover border border-white/20 hover:border-[#D4AF37] cursor-pointer"
                          title={`${p.name} (Click to enlarge)`}
                        />
                      ))}
                    </div>
                  )}
                  {completedBooking.moodboard.inspirationNotes && (
                    <div className="text-[11px] text-gray-300 italic bg-white/5 p-2 rounded-lg border border-white/5 mt-1">
                      "{completedBooking.moodboard.inspirationNotes}"
                    </div>
                  )}
                </div>
              )}

            {/* Calendar & Share Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={getGoogleCalendarUrl(completedBooking)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-colors"
              >
                <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
                <span>Add to Google Calendar</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>

              <button
                onClick={() => downloadIcsFile(completedBooking)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#D4AF37]" />
                <span>Download Apple / Outlook (.ics)</span>
              </button>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 flex items-center justify-center gap-4">
              <button
                onClick={() => {
                  resetBookingDraft();
                  closeBookingModal();
                }}
                className="px-6 py-2.5 rounded-xl text-xs text-gray-400 hover:text-white cursor-pointer"
              >
                Close Window
              </button>

              <button
                onClick={() => {
                  closeBookingModal();
                  setActiveView('admin');
                }}
                className="gold-shimmer-btn text-black font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-black" />
                <span>View in Staff Admin Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full-Screen Lightbox Preview Modal for Reference Photos */}
      {previewModalPhoto && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewModalPhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-[#12141A] rounded-2xl border border-[#D4AF37]/40 p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 px-1 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded">
                  {previewModalPhoto.source || 'Reference Photo'}
                </span>
                <span className="text-xs text-white font-medium truncate max-w-sm">
                  {previewModalPhoto.name}
                </span>
              </div>
              <button
                onClick={() => setPreviewModalPhoto(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
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
              <span>Stylist Inspiration Reference</span>
              <button
                onClick={() => setPreviewModalPhoto(null)}
                className="text-xs text-[#D4AF37] hover:underline cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
