import React, { useState, useEffect } from 'react';
import { useSalon } from '../context/SalonContext';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Phone,
  Clock,
  MapPin,
  ChevronRight,
  ShoppingBag,
  CalendarCheck,
} from 'lucide-react';

export const Navbar = () => {
  const {
    salonInfo,
    activeView,
    setActiveView,
    openBookingModal,
    bookingDraft,
    appointments,
    openCustomerBookings,
  } = useSalon();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const selectedCount = bookingDraft.selectedServices.length;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A0B0E]/90 backdrop-blur-md border-b border-white/10 shadow-2xl py-3'
          : 'bg-gradient-to-b from-[#0A0B0E]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Monogram */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-gradient-to-br from-[#1E2028] to-[#12141A] shadow-lg group-hover:border-[#D4AF37] transition-all duration-300">
              <span className="font-serif-luxury text-[#D4AF37] text-xl font-bold tracking-widest">
                É
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.2em] text-white group-hover:text-[#D4AF37] transition-colors">
                ÉLIXIR
              </span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/80 font-medium">
                Royal Indian Atelier
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7 text-sm tracking-wide">
            {activeView === 'client' ? (
              <>
                <a
                  href="#matcher"
                  className="text-[#D4AF37] hover:text-[#FFF1CA] transition-colors font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hair & Face Matcher</span>
                </a>
                <a
                  href="#services"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                >
                  Services & Pricing
                </a>
                <a
                  href="#stylists"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                >
                  Master Stylists
                </a>
                <a
                  href="#bookings"
                  className="text-[#D4AF37] hover:text-[#FFF1CA] transition-colors font-semibold flex items-center gap-1.5"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Customer Bookings</span>
                </a>
                <a
                  href="#experience"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                >
                  The Atelier
                </a>
                <a
                  href="#reviews"
                  className="text-gray-300 hover:text-[#D4AF37] transition-colors font-medium"
                >
                  Client Praise
                </a>
              </>
            ) : (
              <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-3 py-1 rounded-full border border-[#D4AF37]/30">
                Staff Management System
              </span>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Customer Bookings Trigger Button */}
            <button
              onClick={openCustomerBookings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#181B26] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold hover:bg-[#D4AF37]/15 transition-all shadow-sm cursor-pointer"
              title="View all customer bookings"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Customer Bookings</span>
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-black text-[10px] font-bold flex items-center justify-center">
                {appointments.length}
              </span>
            </button>

            {/* View Switcher: Client Experience vs Staff Dashboard */}
            <button
              onClick={() => setActiveView(activeView === 'client' ? 'admin' : 'client')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                activeView === 'admin'
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg shadow-[#D4AF37]/20 font-bold'
                  : 'bg-white/5 text-gray-300 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
              }`}
              title="Toggle between Client Booking and Staff Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{activeView === 'admin' ? 'Staff Portal (Active)' : 'Staff View'}</span>
            </button>

            {/* If services selected in draft, show quick bag trigger */}
            {selectedCount > 0 && activeView === 'client' && (
              <button
                onClick={() => openBookingModal()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1A1D26] border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/10 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{selectedCount} Selected</span>
              </button>
            )}

            {/* Primary Book CTA */}
            {activeView === 'client' && (
              <button
                onClick={() => openBookingModal()}
                className="gold-shimmer-btn text-black font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full flex items-center gap-2 shadow-lg tracking-wide cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg bg-white/5 border border-white/10"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0F14] border-b border-white/10 px-6 py-6 space-y-5 animate-in slide-in-from-top-4 shadow-2xl">
          <div className="flex flex-col space-y-4 text-base">
            <a
              href="#matcher"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4AF37] hover:text-white py-1 flex items-center justify-between font-semibold"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>30-Sec Hair & Face Matcher</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </a>
            <a
              href="#services"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-[#D4AF37] py-1 flex items-center justify-between"
            >
              <span>Services & Menu</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </a>
            <a
              href="#stylists"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-[#D4AF37] py-1 flex items-center justify-between"
            >
              <span>Master Stylists</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </a>
            <a
              href="#bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4AF37] hover:text-white py-1 flex items-center justify-between font-semibold"
            >
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Customer Bookings</span>
              </div>
              <span className="text-xs bg-[#D4AF37] text-black px-2 py-0.5 rounded-full font-bold">
                {appointments.length}
              </span>
            </a>
            <a
              href="#experience"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-[#D4AF37] py-1 flex items-center justify-between"
            >
              <span>The Atelier Experience</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </a>
            <a
              href="#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-[#D4AF37] py-1 flex items-center justify-between"
            >
              <span>Client Reviews</span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </a>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <button
              onClick={() => {
                openCustomerBookings();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-[#D4AF37]/50 bg-[#1A1D26] text-[#D4AF37] text-xs font-bold flex items-center justify-center gap-2 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>View Customer Bookings ({appointments.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveView(activeView === 'client' ? 'admin' : 'client');
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 rounded-xl border border-[#D4AF37]/30 bg-[#161922] text-gray-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Switch to {activeView === 'client' ? 'Staff Portal' : 'Client Mode'}</span>
            </button>

            <button
              onClick={() => {
                openBookingModal();
                setMobileMenuOpen(false);
              }}
              className="w-full gold-shimmer-btn py-3 rounded-xl text-black font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
