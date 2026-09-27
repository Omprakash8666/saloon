import React, { useState, useMemo } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Ban,
  Unlock,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  DollarSign,
  Users,
  Check,
  MessageSquare,
  Sparkles,
  AlertTriangle,
  Palette,
  ExternalLink,
  Eye,
  Maximize2,
  FileText,
  X,
} from 'lucide-react';

export const AdminDashboard = () => {
  const {
    salonInfo,
    stylists,
    services,
    timeSlots,
    appointments,
    blockedSlots,
    setActiveView,
    blockSlot,
    unblockSlot,
    updateAppointmentStatus,
    cancelAppointment,
    addManualAppointment,
  } = useSalon();

  const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'blocker' | 'walkin'
  const [filterDate, setFilterDate] = useState('all'); // 'all' | 'today' | 'tomorrow'
  const [filterStylist, setFilterStylist] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Stylist Moodboard dossier review state
  const [selectedMoodboardApt, setSelectedMoodboardApt] = useState(null);
  const [activeZoomImage, setActiveZoomImage] = useState(null);

  // Blocker form state
  const [blockForm, setBlockForm] = useState({
    date: new Date().toISOString().split('T')[0],
    stylistId: 'all',
    timeSlot: '02:00 PM',
    reason: 'Staff Lunch & Lab Restock',
  });

  // Walk-in form state
  const [walkinForm, setWalkinForm] = useState({
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    stylistId: stylists[1]?.id || 'stylist-1',
    serviceId: services[0]?.id || 'srv-1',
    date: new Date().toISOString().split('T')[0],
    timeSlot: '03:00 PM',
    notes: 'Walk-in client registered at reception desk.',
  });

  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowStr = tomorrowDate.toISOString().split('T')[0];

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Date filter
      if (filterDate === 'today' && apt.date !== todayStr) return false;
      if (filterDate === 'tomorrow' && apt.date !== tomorrowStr) return false;

      // Stylist filter
      if (filterStylist !== 'all' && apt.stylistId !== filterStylist) return false;

      // Status filter
      if (filterStatus !== 'all' && apt.status !== filterStatus) return false;

      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesName = apt.clientName.toLowerCase().includes(q);
        const matchesCode = apt.bookingCode.toLowerCase().includes(q);
        const matchesPhone = apt.clientPhone.toLowerCase().includes(q);
        const matchesService = apt.serviceNames.some((s) => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCode && !matchesPhone && !matchesService) return false;
      }

      return true;
    });
  }, [appointments, filterDate, filterStylist, filterStatus, searchTerm, todayStr, tomorrowStr]);

  // Metrics
  const todayAppointments = appointments.filter((a) => a.date === todayStr);
  const todayRevenue = todayAppointments.reduce((sum, a) => sum + a.totalPrice, 0);
  const activeStylistCount = stylists.filter((s) => !s.isAny).length;

  const handleBlockSubmit = (e) => {
    e.preventDefault();
    const stylistObj = stylists.find((s) => s.id === blockForm.stylistId);
    const stylistName =
      blockForm.stylistId === 'all'
        ? 'All Staff (Salon-wide)'
        : stylistObj?.name || 'Stylist';

    blockSlot(
      blockForm.stylistId,
      stylistName,
      blockForm.date,
      blockForm.timeSlot,
      blockForm.reason
    );
  };

  const handleWalkinSubmit = (e) => {
    e.preventDefault();
    if (!walkinForm.clientName || !walkinForm.clientPhone) return;

    const stylistObj = stylists.find((s) => s.id === walkinForm.stylistId);
    const serviceObj = services.find((s) => s.id === walkinForm.serviceId);

    addManualAppointment({
      clientName: walkinForm.clientName,
      clientPhone: walkinForm.clientPhone,
      clientEmail: walkinForm.clientEmail || 'reception-walkin@salon.com',
      notes: walkinForm.notes,
      serviceIds: [serviceObj.id],
      serviceNames: [serviceObj.name],
      services: [serviceObj],
      stylistId: stylistObj.id,
      stylistName: stylistObj.name,
      date: walkinForm.date,
      timeSlot: walkinForm.timeSlot,
      totalDuration: serviceObj.duration,
      totalPrice: serviceObj.price,
      status: 'confirmed',
      paymentStatus: 'pay_at_salon',
    });

    setWalkinForm({
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      stylistId: stylists[1]?.id || 'stylist-1',
      serviceId: services[0]?.id || 'srv-1',
      date: new Date().toISOString().split('T')[0],
      timeSlot: '03:00 PM',
      notes: '',
    });

    setActiveTab('appointments');
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0B0C10]">
      <div className="max-w-7xl mx-auto">
        {/* Top Header & Mode Return */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] uppercase tracking-widest font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30">
                Staff & Concierge Management
              </span>
              <span className="text-xs text-gray-500">• Rodeo Drive HQ</span>
            </div>
            <h1 className="font-serif-luxury text-2xl sm:text-4xl font-bold text-white">
              Salon Operations & Schedule Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('client')}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
              <span>Back to Client View</span>
            </button>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-[#D4AF37]">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider">Today's Bookings</span>
              <CalendarIcon className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-display">
              {todayAppointments.length}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              {appointments.length} Total Registered
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider">Projected Revenue (Today)</span>
              <span className="text-base font-bold text-emerald-400 leading-none">₹</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display">
              ₹{todayRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">From scheduled appointments</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-amber-500">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider">Blocked Slots</span>
              <Ban className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-display">
              {blockedSlots.length}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Locked from client engine</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-l-4 border-l-sky-500">
            <div className="flex items-center justify-between text-gray-400 text-xs mb-1">
              <span className="font-semibold uppercase tracking-wider">Active Stylists</span>
              <Users className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white font-display">
              {activeStylistCount}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">All suites operational</div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-white/10 mb-6 gap-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'appointments'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Booked Slots & Schedule ({appointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('blocker')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'blocker'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Ban className="w-4 h-4" />
            <span>Block Time Slots ({blockedSlots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('walkin')}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'walkin'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Quick Walk-In Entry</span>
          </button>
        </div>

        {/* TAB 1: APPOINTMENTS LIST & SCHEDULE */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#13161F] p-4 rounded-2xl border border-white/10">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search client, ID, service..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Date Filter */}
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">All Dates</option>
                <option value="today">Today Only ({todayStr})</option>
                <option value="tomorrow">Tomorrow ({tomorrowStr})</option>
              </select>

              {/* Stylist Filter */}
              <select
                value={filterStylist}
                onChange={(e) => setFilterStylist(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">All Stylists</option>
                {stylists
                  .filter((s) => !s.isAny)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
              </select>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="all">All Statuses</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Appointments Card List */}
            {filteredAppointments.length === 0 ? (
              <div className="glass-panel p-12 text-center rounded-3xl">
                <p className="text-gray-400 text-base mb-2">
                  No appointments match the selected filters.
                </p>
                <button
                  onClick={() => {
                    setFilterDate('all');
                    setFilterStylist('all');
                    setFilterStatus('all');
                    setSearchTerm('');
                  }}
                  className="text-xs text-[#D4AF37] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredAppointments.map((apt) => {
                  let statusBadgeClass =
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  if (apt.status === 'completed') {
                    statusBadgeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20';
                  } else if (apt.status === 'cancelled') {
                    statusBadgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
                  }

                  return (
                    <div
                      key={apt.id}
                      className="glass-panel p-5 rounded-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border hover:border-white/20 transition-all"
                    >
                      {/* Left: Time & Client Details */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                        <div className="bg-[#181B26] p-3 rounded-xl border border-white/10 text-center min-w-[120px] shrink-0">
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

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-base">
                              {apt.clientName}
                            </span>
                            <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-[#F3E5AB]">
                              {apt.bookingCode}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${statusBadgeClass}`}
                            >
                              {apt.status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                            <span className="flex items-center gap-1 text-gray-300">
                              <Phone className="w-3 h-3 text-[#D4AF37]" />
                              {apt.clientPhone}
                            </span>
                            {apt.clientEmail && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-gray-500" />
                                {apt.clientEmail}
                              </span>
                            )}
                            <span className="text-gray-300">
                              Stylist: <strong className="text-white">{apt.stylistName}</strong>
                            </span>
                          </div>

                          <div className="text-xs text-gray-300 pt-1">
                            <span className="text-gray-400">Treatments: </span>
                            <span className="font-medium text-white">
                              {apt.serviceNames.join(' + ')}
                            </span>
                            <span className="text-[#D4AF37] font-bold ml-2">
                              ₹{apt.totalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {apt.notes && (
                            <div className="text-[11px] text-amber-300/80 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 mt-1">
                              <strong>Client Note:</strong> {apt.notes}
                            </div>
                          )}

                          {/* Stylist Moodboard Preview Strip */}
                          {apt.moodboard &&
                            (apt.moodboard.photos?.length > 0 ||
                              apt.moodboard.links?.length > 0 ||
                              apt.moodboard.inspirationNotes) && (
                              <div className="mt-2.5 p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/25 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold text-[#F3E5AB] flex items-center gap-1.5">
                                    <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                                    <span>Client Inspiration Moodboard Attached</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setSelectedMoodboardApt(apt)}
                                    className="text-[11px] font-bold text-[#D4AF37] hover:text-white flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <span>Open Dossier ({apt.moodboard.photos?.length || 0} Photos)</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                </div>

                                {apt.moodboard.photos?.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-2">
                                    {apt.moodboard.photos.map((p) => (
                                      <img
                                        key={p.id}
                                        src={p.url}
                                        alt={p.name}
                                        onClick={() => setSelectedMoodboardApt(apt)}
                                        className="w-10 h-10 rounded-lg object-cover border border-white/20 hover:border-[#D4AF37] cursor-pointer hover:scale-105 transition-transform"
                                        title={`${p.name} (Click to inspect)`}
                                      />
                                    ))}
                                    {apt.moodboard.links?.length > 0 && (
                                      <span className="text-[10px] text-gray-300 bg-black/40 px-2 py-1 rounded-md border border-white/10 flex items-center gap-1">
                                        <ExternalLink className="w-3 h-3 text-[#D4AF37]" />
                                        <span>+{apt.moodboard.links.length} Links</span>
                                      </span>
                                    )}
                                  </div>
                                )}

                                {apt.moodboard.inspirationNotes && (
                                  <p className="text-[11px] text-amber-200/90 italic line-clamp-1 bg-black/20 px-2 py-1 rounded">
                                    "{apt.moodboard.inspirationNotes}"
                                  </p>
                                )}
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Right: Quick Concierge Actions */}
                      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                        {/* Review Stylist Moodboard Button */}
                        {apt.moodboard &&
                          (apt.moodboard.photos?.length > 0 ||
                            apt.moodboard.links?.length > 0 ||
                            apt.moodboard.inspirationNotes) && (
                            <button
                              type="button"
                              onClick={() => setSelectedMoodboardApt(apt)}
                              className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] hover:text-[#FFF1CA] text-xs font-semibold border border-[#D4AF37]/40 flex items-center gap-1.5 cursor-pointer shadow-sm"
                              title="Review inspiration photos, Instagram/Pinterest links, and notes before client arrives"
                            >
                              <Palette className="w-3.5 h-3.5 text-[#D4AF37]" />
                              <span>Stylist Moodboard ({(apt.moodboard.photos?.length || 0)})</span>
                            </button>
                          )}

                        {/* Direct WhatsApp client trigger */}
                        <a
                          href={`https://wa.me/${apt.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${apt.clientName}, greeting from ÉLIXIR Atelier. Confirming your appointment on ${apt.date} at ${apt.timeSlot}. Ref: ${apt.bookingCode}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5"
                          title="WhatsApp client"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                            className="px-3 py-1.5 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 text-sky-400 text-xs font-semibold border border-sky-500/30 flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complete</span>
                          </button>
                        )}

                        {apt.status !== 'cancelled' && (
                          <button
                            onClick={() => cancelAppointment(apt.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SLOT BLOCKER (TIME-OFF / UNAVAILABILITY MANAGEMENT) */}
        {activeTab === 'blocker' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Blocker Form */}
            <div className="glass-panel p-6 rounded-3xl border border-[#D4AF37]/30 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Ban className="w-5 h-5 text-[#D4AF37]" />
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  Block an Appointment Slot
                </h3>
              </div>
              <p className="text-xs text-gray-400 mb-6">
                Prevent online client bookings for specific intervals due to lunch breaks,
                maintenance, VIP sessions, or staff time-off.
              </p>

              <form onSubmit={handleBlockSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    required
                    value={blockForm.date}
                    onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Stylist / Scope
                  </label>
                  <select
                    value={blockForm.stylistId}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, stylistId: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    <option value="all">Entire Salon (All Staff)</option>
                    {stylists
                      .filter((s) => !s.isAny)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role.split('&')[0]})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <select
                    value={blockForm.timeSlot}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, timeSlot: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.time}>
                        {slot.time} ({slot.period})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Reason for Hold
                  </label>
                  <input
                    type="text"
                    required
                    value={blockForm.reason}
                    onChange={(e) =>
                      setBlockForm({ ...blockForm, reason: e.target.value })
                    }
                    placeholder="e.g. Sanitization, Staff Meeting, VIP Suite"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-[#D4AF37] text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer flex items-center justify-center gap-2 mt-4"
                >
                  <Ban className="w-4 h-4" />
                  <span>Lock Time Slot</span>
                </button>
              </form>
            </div>

            {/* Currently Blocked Slots List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white">
                    Active Blocked Slots ({blockedSlots.length})
                  </h3>
                  <p className="text-xs text-gray-400">
                    These time intervals are instantly disabled in the client booking engine.
                  </p>
                </div>
              </div>

              {blockedSlots.length === 0 ? (
                <div className="glass-panel p-10 text-center rounded-2xl">
                  <Unlock className="w-8 h-8 text-[#D4AF37] mx-auto mb-2 opacity-50" />
                  <p className="text-gray-400 text-sm">
                    No time slots are currently blocked. All slots follow standard schedule.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {blockedSlots.map((block) => (
                    <div
                      key={block.id}
                      className="p-4 rounded-2xl bg-[#161922] border border-amber-500/20 flex items-start justify-between gap-3 shadow-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">
                            {block.timeSlot}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            {block.date}
                          </span>
                        </div>
                        <div className="text-xs text-gray-300">
                          Scope: <strong>{block.stylistName}</strong>
                        </div>
                        <div className="text-xs text-gray-400 italic">
                          "{block.reason}"
                        </div>
                      </div>

                      <button
                        onClick={() => unblockSlot(block.id)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 border border-white/10 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                        title="Restore slot to available"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unblock</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: QUICK WALK-IN ENTRY */}
        {activeTab === 'walkin' && (
          <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-[#D4AF37]/30">
            <div className="flex items-center gap-3 mb-6">
              <Plus className="w-6 h-6 text-[#D4AF37]" />
              <div>
                <h3 className="font-serif-luxury text-xl font-bold text-white">
                  Add Walk-In / Phone Reservation
                </h3>
                <p className="text-xs text-gray-400">
                  Instantly reserve an appointment directly at the front concierge desk.
                </p>
              </div>
            </div>

            <form onSubmit={handleWalkinSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Client Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={walkinForm.clientName}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, clientName: e.target.value })
                    }
                    placeholder="e.g. Ananya Singhania"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={walkinForm.clientPhone}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, clientPhone: e.target.value })
                    }
                    placeholder="+91 98200 12345"
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Primary Service
                  </label>
                  <select
                    value={walkinForm.serviceId}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, serviceId: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} (₹{s.price.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Assigned Stylist
                  </label>
                  <select
                    value={walkinForm.stylistId}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, stylistId: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {stylists
                      .filter((s) => !s.isAny)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={walkinForm.date}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, date: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Time Slot
                  </label>
                  <select
                    value={walkinForm.timeSlot}
                    onChange={(e) =>
                      setWalkinForm({ ...walkinForm, timeSlot: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot.id} value={slot.time}>
                        {slot.time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                  Desk Notes / Hospitality Requests
                </label>
                <textarea
                  rows={2}
                  value={walkinForm.notes}
                  onChange={(e) =>
                    setWalkinForm({ ...walkinForm, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white text-xs focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-shimmer-btn text-black font-bold text-xs uppercase tracking-wider shadow-xl cursor-pointer"
              >
                Schedule & Confirm Walk-In
              </button>
            </form>
          </div>
        )}
      </div>

      {/* STYLIST PRE-ARRIVAL INSPIRATION DOSSIER MODAL */}
      {selectedMoodboardApt && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
          <div className="relative w-full max-w-3xl bg-[#12141C] border border-[#D4AF37]/35 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#151822]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6B1B] text-black font-bold flex items-center justify-center shadow-md">
                  <Palette className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg font-bold text-white flex items-center gap-2">
                    <span>Stylist Pre-Arrival Inspiration Dossier</span>
                    <span className="text-[10px] font-display bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">
                      Workstation View
                    </span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Client: <strong className="text-white">{selectedMoodboardApt.clientName}</strong> • Ref:{' '}
                    <span className="font-mono text-[#F3E5AB]">{selectedMoodboardApt.bookingCode}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMoodboardApt(null)}
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dossier"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Appointment Context Ribbon */}
              <div className="p-4 rounded-2xl bg-[#171A25] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-gray-500 uppercase text-[10px] tracking-wider block font-semibold">
                    Assigned Stylist
                  </span>
                  <span className="font-bold text-white text-sm">{selectedMoodboardApt.stylistName}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[10px] tracking-wider block font-semibold">
                    Appointment Slot
                  </span>
                  <span className="font-bold text-[#D4AF37] text-sm">
                    {selectedMoodboardApt.date} at {selectedMoodboardApt.timeSlot}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase text-[10px] tracking-wider block font-semibold">
                    Reserved Treatments
                  </span>
                  <span className="font-medium text-white truncate block">
                    {selectedMoodboardApt.serviceNames.join(', ')}
                  </span>
                </div>
              </div>

              {/* Client's Inspiration Notes */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#1C1F2C] to-[#12141F] border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Client Inspiration Notes for Stylist</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    Direct from Guest
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed italic bg-black/20 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                  "{selectedMoodboardApt.moodboard?.inspirationNotes || 'No specific written instructions provided; refer to visual photo attachments.'}"
                </p>
              </div>

              {/* Hair & Face Matcher Profile (if attached) */}
              {selectedMoodboardApt.moodboard?.matcherResult && (
                <div className="p-4 rounded-2xl bg-[#161924] border border-[#D4AF37]/30 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>30-Second Hair & Face Matcher Profile</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-300 pt-1">
                    <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block">Face Shape</span>
                      <strong className="text-white">{selectedMoodboardApt.moodboard.matcherResult.faceShape}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block">Hair Length</span>
                      <strong className="text-white">{selectedMoodboardApt.moodboard.matcherResult.hairLength}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-black/30 border border-white/5">
                      <span className="text-[10px] text-gray-500 uppercase block">Texture / Prakriti</span>
                      <strong className="text-white">{selectedMoodboardApt.moodboard.matcherResult.hairTexture}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Reference Photos Gallery */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif-luxury text-base font-bold text-white flex items-center gap-2">
                    <span>Uploaded Reference Photos</span>
                    <span className="text-xs text-gray-400 font-sans font-normal">
                      ({selectedMoodboardApt.moodboard?.photos?.length || 0} attached)
                    </span>
                  </h4>
                  <span className="text-[11px] text-gray-400">Click any image to enlarge</span>
                </div>

                {selectedMoodboardApt.moodboard?.photos?.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedMoodboardApt.moodboard.photos.map((photo) => (
                      <div
                        key={photo.id}
                        onClick={() => setActiveZoomImage(photo)}
                        className="relative group rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-black aspect-square cursor-pointer hover:border-[#D4AF37] shadow-lg"
                      >
                        <img
                          src={photo.url}
                          alt={photo.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-1.5 left-1.5 z-10">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-black/80 text-[#F3E5AB] px-1.5 py-0.5 rounded border border-white/20">
                            {photo.source || 'Photo'}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5">
                            <Maximize2 className="w-3.5 h-3.5" />
                            <span>Zoom</span>
                          </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-1.5">
                          <p className="text-[10px] text-gray-200 truncate">{photo.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic p-4 rounded-xl bg-white/5 border border-white/10">
                    Client did not attach photo uploads. Proceed with verbal & physical consultation at the styling station.
                  </p>
                )}
              </div>

              {/* Instagram & Pinterest Links */}
              {selectedMoodboardApt.moodboard?.links?.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <h4 className="font-serif-luxury text-sm font-bold text-white">
                    Pinned Instagram & Pinterest Links ({selectedMoodboardApt.moodboard.links.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMoodboardApt.moodboard.links.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-gray-200 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="font-medium">{link.title || link.url}</span>
                        <span className="text-[10px] text-gray-400 uppercase">({link.platform})</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#151822] border-t border-white/10 flex items-center justify-between">
              <a
                href={`https://wa.me/${selectedMoodboardApt.clientPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Namaste ${selectedMoodboardApt.clientName}! Greetings from ÉLIXIR Atelier. ${selectedMoodboardApt.stylistName} has reviewed your inspiration photos for your appointment on ${selectedMoodboardApt.date} at ${selectedMoodboardApt.timeSlot}. We have your private suite and formula prepared.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Message Client on WhatsApp</span>
              </a>

              <button
                onClick={() => setSelectedMoodboardApt(null)}
                className="px-5 py-2 rounded-xl gold-shimmer-btn text-black font-bold text-xs cursor-pointer shadow-md"
              >
                Mark as Reviewed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL-SIZE ZOOM LIGHTBOX MODAL */}
      {activeZoomImage && (
        <div
          className="fixed inset-0 z-60 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveZoomImage(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] bg-[#12141A] rounded-2xl border border-[#D4AF37]/40 p-4 overflow-hidden shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 px-1 border-b border-white/10 mb-3">
              <span className="text-xs text-white font-medium truncate max-w-sm">
                {activeZoomImage.name}
              </span>
              <button
                onClick={() => setActiveZoomImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-xl max-h-[68vh] flex items-center justify-center bg-black">
              <img
                src={activeZoomImage.url}
                alt={activeZoomImage.name}
                className="max-h-[65vh] max-w-full object-contain rounded-lg"
              />
            </div>

            <div className="w-full pt-3 px-1 flex items-center justify-between text-xs text-gray-400">
              <span>High-Resolution Stylist Review Canvas</span>
              <button
                onClick={() => setActiveZoomImage(null)}
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
