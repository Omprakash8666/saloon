import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  SALON_INFO,
  INITIAL_SERVICES,
  INITIAL_STYLISTS,
  TIME_SLOTS,
  INITIAL_APPOINTMENTS,
  INITIAL_BLOCKED_SLOTS,
  getTodayDateString,
} from '../data/salonData';

const SalonContext = createContext();

const STORAGE_KEYS = {
  APPOINTMENTS: 'elixir_salon_appointments_v3',
  BLOCKED_SLOTS: 'elixir_salon_blocked_slots_v3',
};

export const SalonProvider = ({ children }) => {
  // Navigation & View Mode: 'client' | 'admin'
  const [activeView, setActiveView] = useState('client');

  // Core Data
  const [services] = useState(INITIAL_SERVICES);
  const [stylists] = useState(INITIAL_STYLISTS);

  // Appointments (Persisted to localStorage)
  const [appointments, setAppointments] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  // Blocked Slots (Persisted to localStorage)
  const [blockedSlots, setBlockedSlots] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
      return saved ? JSON.parse(saved) : INITIAL_BLOCKED_SLOTS;
    } catch {
      return INITIAL_BLOCKED_SLOTS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error('Failed to save appointments:', e);
    }
  }, [appointments]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(blockedSlots));
    } catch (e) {
      console.error('Failed to save blocked slots:', e);
    }
  }, [blockedSlots]);

  // Notifications / Toast Queue
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Booking Modal / Engine State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [isCustomerBookingsOpen, setIsCustomerBookingsOpen] = useState(false);

  const openCustomerBookings = () => setIsCustomerBookingsOpen(true);
  const closeCustomerBookings = () => setIsCustomerBookingsOpen(false);

  // Default initial draft
  const defaultDraft = {
    selectedServices: [],
    selectedStylist: stylists[0], // "Any Available Master Stylist"
    selectedDate: getTodayDateString(),
    selectedTimeSlot: null,
    customer: {
      name: '',
      phone: '',
      email: '',
      notes: '',
      loyaltyCode: '',
    },
    moodboard: {
      photos: [],
      links: [],
      inspirationNotes: '',
      matcherResult: null,
    },
    step: 1, // 1 to 5
  };

  const [bookingDraft, setBookingDraft] = useState(defaultDraft);

  // Open booking with optional pre-selected service or stylist
  const openBookingModal = (options = {}) => {
    setBookingDraft((prev) => {
      let updated = { ...prev };
      if (options.service) {
        // Add if not already selected
        const exists = prev.selectedServices.some((s) => s.id === options.service.id);
        if (!exists) {
          updated.selectedServices = [...prev.selectedServices, options.service];
        }
      }
      if (options.stylist) {
        updated.selectedStylist = options.stylist;
      }
      if (options.step) {
        updated.step = options.step;
      }
      return updated;
    });
    setCompletedBooking(null);
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const resetBookingDraft = () => {
    setBookingDraft({
      ...defaultDraft,
      selectedDate: getTodayDateString(),
    });
    setCompletedBooking(null);
  };

  // Step Management
  const goToStep = (stepNumber) => {
    setBookingDraft((prev) => ({ ...prev, step: Math.max(1, Math.min(5, stepNumber)) }));
  };

  const nextStep = () => {
    setBookingDraft((prev) => ({ ...prev, step: Math.min(5, prev.step + 1) }));
  };

  const prevStep = () => {
    setBookingDraft((prev) => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  };

  // Service Selection
  const toggleServiceInDraft = (service) => {
    setBookingDraft((prev) => {
      const exists = prev.selectedServices.some((s) => s.id === service.id);
      const newServices = exists
        ? prev.selectedServices.filter((s) => s.id !== service.id)
        : [...prev.selectedServices, service];

      if (!exists) {
        addToast(`Added "${service.name}" to your booking experience`, 'success');
      }
      return { ...prev, selectedServices: newServices };
    });
  };

  const removeServiceFromDraft = (serviceId) => {
    setBookingDraft((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((s) => s.id !== serviceId),
    }));
  };

  // Stylist Selection
  const setDraftStylist = (stylist) => {
    setBookingDraft((prev) => ({ ...prev, selectedStylist: stylist }));
  };

  // Date Selection
  const setDraftDate = (dateStr) => {
    setBookingDraft((prev) => ({
      ...prev,
      selectedDate: dateStr,
      // Clear time slot when changing date to prevent invalid selection
      selectedTimeSlot: prev.selectedDate === dateStr ? prev.selectedTimeSlot : null,
    }));
  };

  // Time Slot Selection
  const setDraftTimeSlot = (slotStr) => {
    setBookingDraft((prev) => ({ ...prev, selectedTimeSlot: slotStr }));
  };

  // Customer Details
  const setDraftCustomer = (field, value) => {
    setBookingDraft((prev) => ({
      ...prev,
      customer: { ...prev.customer, [field]: value },
    }));
  };

  // Moodboard & Reference Photos (Step 4 of Checkout)
  const addDraftMoodboardPhoto = (photo) => {
    setBookingDraft((prev) => ({
      ...prev,
      moodboard: {
        ...prev.moodboard,
        photos: [...(prev.moodboard?.photos || []), photo],
      },
    }));
    addToast('Reference photo added to your stylist moodboard', 'success');
  };

  const removeDraftMoodboardPhoto = (photoId) => {
    setBookingDraft((prev) => ({
      ...prev,
      moodboard: {
        ...prev.moodboard,
        photos: (prev.moodboard?.photos || []).filter((p) => p.id !== photoId),
      },
    }));
  };

  const addDraftMoodboardLink = (link) => {
    setBookingDraft((prev) => ({
      ...prev,
      moodboard: {
        ...prev.moodboard,
        links: [...(prev.moodboard?.links || []), link],
      },
    }));
    addToast(
      `${link.platform === 'instagram' ? 'Instagram' : link.platform === 'pinterest' ? 'Pinterest' : 'Reference'} link pinned to moodboard`,
      'success'
    );
  };

  const removeDraftMoodboardLink = (linkId) => {
    setBookingDraft((prev) => ({
      ...prev,
      moodboard: {
        ...prev.moodboard,
        links: (prev.moodboard?.links || []).filter((l) => l.id !== linkId),
      },
    }));
  };

  const setDraftMoodboardNotes = (inspirationNotes) => {
    setBookingDraft((prev) => ({
      ...prev,
      moodboard: {
        ...prev.moodboard,
        inspirationNotes,
      },
    }));
  };

  const setDraftMatcherProfile = (matcherResult) => {
    setBookingDraft((prev) => ({
      ...prev,
      moodboard: {
        ...prev.moodboard,
        matcherResult,
      },
    }));
  };

  const applyMatcherRecommendation = ({ service, stylist, matcherProfile }) => {
    setBookingDraft((prev) => {
      let updatedServices = prev.selectedServices;
      if (service) {
        const alreadyInDraft = prev.selectedServices.some((s) => s.id === service.id);
        updatedServices = alreadyInDraft ? prev.selectedServices : [service];
      }
      const existingNotes = prev.moodboard?.inspirationNotes || '';
      const analysisBrief = matcherProfile?.summary
        ? `[Face Matcher Analysis: ${matcherProfile.faceShape} Face | ${matcherProfile.hairLength} ${matcherProfile.hairTexture} Hair]\nRecommendation: ${matcherProfile.summary}\n`
        : '';

      return {
        ...prev,
        selectedServices: updatedServices,
        selectedStylist: stylist || prev.selectedStylist,
        moodboard: {
          ...prev.moodboard,
          matcherResult: matcherProfile,
          inspirationNotes: existingNotes.includes('[Face Matcher Analysis')
            ? existingNotes
            : analysisBrief + (existingNotes ? `\n${existingNotes}` : ''),
        },
        step: 2, // Take directly to Stylist / Date selection
      };
    });
    setCompletedBooking(null);
    setIsBookingModalOpen(true);
    addToast(`Harmonized ritual selected: ${service?.name}`, 'success');
  };

  // Check Slot Availability: returns status: 'available' | 'booked' | 'blocked'
  const checkSlotStatus = (date, timeSlot, stylistId) => {
    // 1. Check if salon-wide blocked
    const salonWideBlock = blockedSlots.find(
      (b) => b.date === date && b.timeSlot === timeSlot && (b.stylistId === 'all' || !b.stylistId)
    );
    if (salonWideBlock) {
      return { status: 'blocked', reason: salonWideBlock.reason, isAvailable: false };
    }

    // 2. If specific stylist selected (not 'stylist-any')
    if (stylistId && stylistId !== 'stylist-any') {
      // Check stylist-specific block
      const stylistBlock = blockedSlots.find(
        (b) => b.date === date && b.timeSlot === timeSlot && b.stylistId === stylistId
      );
      if (stylistBlock) {
        return { status: 'blocked', reason: stylistBlock.reason, isAvailable: false };
      }

      // Check stylist appointment
      const isBooked = appointments.some(
        (a) =>
          a.date === date &&
          a.timeSlot === timeSlot &&
          a.stylistId === stylistId &&
          a.status !== 'cancelled'
      );
      if (isBooked) {
        return { status: 'booked', reason: 'Reserved with Stylist', isAvailable: false };
      }

      return { status: 'available', isAvailable: true };
    }

    // 3. If 'stylist-any' is selected: slot is available if AT LEAST ONE individual stylist is free
    const realStylists = stylists.filter((s) => !s.isAny);
    const availableStylistCount = realStylists.filter((s) => {
      const isBlocked = blockedSlots.some(
        (b) => b.date === date && b.timeSlot === timeSlot && b.stylistId === s.id
      );
      const isBooked = appointments.some(
        (a) =>
          a.date === date &&
          a.timeSlot === timeSlot &&
          a.stylistId === s.id &&
          a.status !== 'cancelled'
      );
      return !isBlocked && !isBooked;
    }).length;

    if (availableStylistCount > 0) {
      return { status: 'available', isAvailable: true, freeCount: availableStylistCount };
    } else {
      return { status: 'booked', reason: 'Fully Booked', isAvailable: false };
    }
  };

  // Confirm and Finalize Booking
  const confirmBooking = () => {
    if (bookingDraft.selectedServices.length === 0) {
      addToast('Please select at least one luxury service', 'error');
      return null;
    }
    if (!bookingDraft.selectedTimeSlot) {
      addToast('Please choose an available appointment slot', 'error');
      return null;
    }
    if (!bookingDraft.customer.name.trim() || !bookingDraft.customer.phone.trim()) {
      addToast('Please provide your name and phone number', 'error');
      return null;
    }

    // Generate unique luxury booking reference
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const bookingCode = `ELX-${randomNum}`;

    // Calculate totals
    const totalDuration = bookingDraft.selectedServices.reduce((sum, s) => sum + s.duration, 0);
    const totalPrice = bookingDraft.selectedServices.reduce((sum, s) => sum + s.price, 0);

    // Resolve assigned stylist if 'stylist-any'
    let assignedStylist = bookingDraft.selectedStylist;
    if (!assignedStylist || assignedStylist.isAny) {
      const realStylists = stylists.filter((s) => !s.isAny);
      // Pick first free stylist for this slot
      const free = realStylists.find((s) => {
        const status = checkSlotStatus(bookingDraft.selectedDate, bookingDraft.selectedTimeSlot, s.id);
        return status.isAvailable;
      });
      assignedStylist = free || realStylists[0];
    }

    const newAppointment = {
      id: `apt-${Date.now()}`,
      bookingCode,
      clientName: bookingDraft.customer.name.trim(),
      clientPhone: bookingDraft.customer.phone.trim(),
      clientEmail: bookingDraft.customer.email.trim() || 'guest@client.com',
      notes: bookingDraft.customer.notes.trim(),
      serviceIds: bookingDraft.selectedServices.map((s) => s.id),
      serviceNames: bookingDraft.selectedServices.map((s) => s.name),
      services: bookingDraft.selectedServices,
      stylistId: assignedStylist.id,
      stylistName: assignedStylist.name,
      date: bookingDraft.selectedDate,
      timeSlot: bookingDraft.selectedTimeSlot,
      totalDuration,
      totalPrice,
      status: 'confirmed',
      paymentStatus: 'pay_at_salon',
      createdAt: new Date().toISOString(),
      moodboard: bookingDraft.moodboard || {
        photos: [],
        links: [],
        inspirationNotes: '',
      },
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setCompletedBooking(newAppointment);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#FFF1CA', '#AA771C', '#E5C378'],
      });
    } catch {
      // safe fallback
    }

    addToast(`Appointment confirmed! Booking Reference: ${bookingCode}`, 'success');
    return newAppointment;
  };

  // Staff / Admin Actions: Block a Slot
  const blockSlot = (stylistId, stylistName, date, timeSlot, reason) => {
    const newBlock = {
      id: `blk-${Date.now()}`,
      stylistId: stylistId || 'all',
      stylistName: stylistName || 'All Staff',
      date,
      timeSlot,
      reason: reason.trim() || 'Staff Unavailable',
      createdAt: new Date().toISOString(),
    };
    setBlockedSlots((prev) => [newBlock, ...prev]);
    addToast(`Blocked ${timeSlot} on ${date} (${newBlock.stylistName})`, 'info');
  };

  // Staff / Admin Actions: Unblock a Slot
  const unblockSlot = (blockId) => {
    setBlockedSlots((prev) => prev.filter((b) => b.id !== blockId));
    addToast('Slot unlocked and restored to client availability', 'success');
  };

  // Staff / Admin Actions: Update Appointment Status
  const updateAppointmentStatus = (id, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus } : apt))
    );
    addToast(`Appointment marked as ${newStatus}`, 'info');
  };

  // Cancel Appointment
  const cancelAppointment = (id) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: 'cancelled' } : apt))
    );
    addToast('Appointment has been cancelled', 'info');
  };

  // Add Manual Appointment (Staff Walk-in / Phone booking)
  const addManualAppointment = (data) => {
    const bookingCode = `ELX-${Math.floor(10000 + Math.random() * 90000)}`;
    const newApt = {
      id: `apt-${Date.now()}`,
      bookingCode,
      ...data,
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newApt, ...prev]);
    addToast(`Manual appointment scheduled (${bookingCode})`, 'success');
  };

  return (
    <SalonContext.Provider
      value={{
        salonInfo: SALON_INFO,
        services,
        stylists,
        timeSlots: TIME_SLOTS,
        appointments,
        blockedSlots,
        activeView,
        setActiveView,
        toasts,
        addToast,
        removeToast,
        // Booking Draft & Flow
        bookingDraft,
        isBookingModalOpen,
        completedBooking,
        isCustomerBookingsOpen,
        openCustomerBookings,
        closeCustomerBookings,
        openBookingModal,
        closeBookingModal,
        resetBookingDraft,
        goToStep,
        nextStep,
        prevStep,
        toggleServiceInDraft,
        removeServiceFromDraft,
        setDraftStylist,
        setDraftDate,
        setDraftTimeSlot,
        setDraftCustomer,
        // Moodboard & Style Matcher Handlers (Step 4 Checkout)
        addDraftMoodboardPhoto,
        removeDraftMoodboardPhoto,
        addDraftMoodboardLink,
        removeDraftMoodboardLink,
        setDraftMoodboardNotes,
        setDraftMatcherProfile,
        applyMatcherRecommendation,
        confirmBooking,
        checkSlotStatus,
        // Staff Actions
        blockSlot,
        unblockSlot,
        updateAppointmentStatus,
        cancelAppointment,
        addManualAppointment,
      }}
    >
      {children}
    </SalonContext.Provider>
  );
};

export const useSalon = () => {
  const context = useContext(SalonContext);
  if (!context) {
    throw new Error('useSalon must be used within a SalonProvider');
  }
  return context;
};
