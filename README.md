# ÉLIXIR Atelier & Spa — Luxury Salon & Slot Booking Platform

A modern, responsive, luxury salon appointment and slot booking platform built with **React**, **Vite**, **Tailwind CSS v4**, and **Lucide Icons**, featuring an interactive 5-step booking engine and real-time staff schedule management.

---

## 🌟 Key Features

### 1. Editorial Luxury Design & Brand Identity
- Curated luxury dark aesthetic with warm gold gradients (`#D4AF37`), champagne tones, and glassmorphic cards.
- Refined typography utilizing Google Fonts (`Playfair Display`, `Cormorant Garamond`, `Plus Jakarta Sans`, and `Outfit`).
- Ambient background glows, card hover micro-interactions, and celebratory confetti upon appointment confirmation.

### 2. Curated Indian Treatment Menu & Ayurvedic Spas
- Filter by category: *All Indian Rituals*, *Indian Haircuts & Styling*, *Ayurvedic Head Spa & Shirodhara*, *Nawabi Barber & Beard Craft*, *Desi Bridal & Gajra Artistry*, *Kumkumadi & Chandan Facials*, and *Royal Haldi-Chandan Ubtan*.
- Authentically crafted treatments with Indian Rupee (₹) pricing:
  - *Bollywood Red Carpet Volume Layers & Blowout* (₹1,850)
  - *Authentic Kerala Shirodhara & Kesh Raksha Spa* (₹3,200)
  - *Royal Nawabi Shahi Haircut & Sandalwood Champi* (₹1,250)
  - *Royal Indian Champi & Kansa Vatki Scalp Detox* (₹1,650)
  - *Desi Bridal / Sangeet Hair & Mogra Gajra Artistry* (₹4,800)
  - *Kesh Sanskar Organic Sojat Henna & Hibiscus Gloss* (₹2,400)
  - *Kumkumadi Tailam & 24K Kashmiri Saffron Radiance Facial* (₹3,600)
  - *Shahi Haldi-Chandan (Turmeric & Sandalwood) Royal Ubtan Spa* (₹3,400)
  - *Executive Ustara Shave & Beard Architecture* (₹850)
  - *Modern Desi Precision Fade & Textured Crop* (₹950)
- Real-time search, duration breakdown, and perks checklist (saffron tea/cardamom kahwa, Tridosha scalp consultation, etc.).

### 3. Interactive 5-Step Booking Engine
- **Step 1: Treatments Selection** — Multi-select treatments with live subtotal (₹) and aggregate duration calculation.
- **Step 2: Stylist / Barber Selection** — Dedicated cards for Indian master artists (*Priya Sundaram, Aarav Kapoor, Vaidya Rajeshwar Nair, Devika Sen*) or "Any Available Master Stylist".
- **Step 3: Dynamic Date & Time Slot Grid** — Horizontal 14-day date picker and dynamic Morning/Afternoon/Evening time slot grid calculating available vs. booked vs. staff-blocked slots.
- **Step 4: Guest Information Form** — Full name, phone (`+91`), email, concierge notes (allergies, quiet chair, beverage preference), and VIP loyalty promo codes (`VIP10`, `HAUTE20`).
- **Step 5: Review & Instant Confirmation** — Comprehensive summary breakdown in Indian Rupees (₹), instant confirmation screen with unique Booking Reference ID (e.g. `ELX-84192`), 1-click **Add to Google Calendar**, and **Download Apple / Outlook (.ics)** file.

### 4. Staff & Admin Operations Portal
- Dedicated **Staff Portal** toggle right in the navigation header.
- **KPI Metrics:** Today's Appointments, Projected Daily Revenue, Blocked Slots, and Active Stylists.
- **Booked Slots & Schedule:** Filter appointments by date, stylist, or status (*Confirmed*, *Completed*, *Cancelled*). Direct triggers for **WhatsApp Client** messaging and status changes.
- **Slot Blocker & Time-Off Management:** Staff can select any date, stylist (or salon-wide), and time slot with a custom reason (e.g., *Sanitization*, *Lunch Break*, *VIP Private Suite*) to instantly lock slots. Blocked slots are immediately disabled on the client booking engine in real time.
- **Quick Walk-In Entry:** Receptionists can quickly schedule phone or walk-in reservations on the spot.

### 5. Mock Backend & State Persistence
- All bookings, blocked slots, and statuses persist across page refreshes via `localStorage` with realistic pre-populated data.

---

## 📁 Repository Structure

```
saloon/
├── index.html                   # Luxury typography, meta tags, and favicon
├── package.json                 # React 19, Vite, Tailwind CSS v4, Lucide React, Canvas Confetti
├── vite.config.js               # Vite config with Tailwind CSS v4 plugin
├── website_requirements_sow.md  # Option 2: Freelancer / Web Agency Brief & SOW
├── nocode_builder_guide.md      # Option 3: No-Code / AI Builder Layout (Framer/Webflow)
├── src/
│   ├── main.jsx                 # React root
│   ├── App.jsx                  # Main application layout & view switcher
│   ├── index.css                # Tailwind CSS v4 imports, luxury themes & glassmorphism
│   ├── data/
│   │   └── salonData.js         # Services, Stylists, Time Slots, Initial Bookings, Testimonials
│   ├── context/
│   │   └── SalonContext.jsx     # Global state: Booking Draft, Appointments, Slot Blocker, Toasts
│   └── components/
│       ├── Navbar.jsx           # Sticky glass header, staff toggle, mobile menu
│       ├── Hero.jsx             # Luxury hero section with prestige badges & CTAs
│       ├── ServiceCatalog.jsx   # Filterable service menu, search, add-to-booking
│       ├── StylistProfiles.jsx  # Master stylist cards with ratings & specialties
│       ├── LuxuryExperience.jsx # Private suites, champagne bar, scalp diagnostic details
│       ├── Testimonials.jsx     # Client reviews, 5-star ratings, press accolades
│       ├── BookingEngine.jsx    # 5-step modal booking engine & calendar export
│       ├── AdminDashboard.jsx   # Staff portal: Schedule list, slot blocker, walk-in form
│       ├── Footer.jsx           # Atelier hours, addresses, VIP newsletter
│       └── ToastContainer.jsx   # Real-time alert notifications
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
```bash
npm run build
```

---

## 📑 Included Briefs & Specifications

1. **[website_requirements_sow.md](website_requirements_sow.md)**: Full Website Requirements Document (Scope of Work) with database schemas (PostgreSQL), third-party integrations (Twilio, Stripe, Google Calendar), and milestone breakdowns.
2. **[nocode_builder_guide.md](nocode_builder_guide.md)**: Architecture and component layout for no-code builders (Framer, Webflow, Wix Studio).
