import React from 'react';
import { SalonProvider, useSalon } from './context/SalonContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HairFaceMatcher } from './components/HairFaceMatcher';
import { ServiceCatalog } from './components/ServiceCatalog';
import { StylistProfiles } from './components/StylistProfiles';
import { CustomerBookingsSection } from './components/CustomerBookingsSection';
import { LuxuryExperience } from './components/LuxuryExperience';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { BookingEngine } from './components/BookingEngine';
import { CustomerBookingsModal } from './components/CustomerBookingsModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ToastContainer } from './components/ToastContainer';

const MainLayout = () => {
  const { activeView } = useSalon();

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-[#F3F4F6] flex flex-col selection:bg-[#D4AF37]/30 selection:text-[#FFF1CA]">
      {/* Navigation Header */}
      <Navbar />

      {/* Dynamic View: Client Experience or Staff Portal */}
      <main className="flex-1">
        {activeView === 'client' ? (
          <>
            <Hero />
            {/* Visual Hair/Face Matcher (30-Sec Interactive Mini-Quiz) */}
            <HairFaceMatcher />
            <ServiceCatalog />
            <StylistProfiles />
            {/* Direct Customer Bookings Register on Page */}
            <CustomerBookingsSection />
            <LuxuryExperience />
            <Testimonials />
          </>
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Footer (Client Mode) */}
      {activeView === 'client' && <Footer />}

      {/* Interactive Multi-Step Booking Modal */}
      <BookingEngine />

      {/* Dedicated Customer Bookings Lookup & Viewer Modal */}
      <CustomerBookingsModal />

      {/* Real-time Toasts & Alerts */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <SalonProvider>
      <MainLayout />
    </SalonProvider>
  );
}
