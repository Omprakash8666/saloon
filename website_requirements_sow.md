# Website Requirements Document (Scope of Work)
## Project: Luxury Salon & Spa Appointment Booking Web Application

### 1. Project Overview & Objectives
- **Project Name:** ÉLIXIR Luxury Atelier & Spa Booking Platform
- **Objective:** Design, develop, and deploy an omnichannel, mobile-responsive web booking engine and management dashboard for a premier salon. The platform must elevate brand prestige, streamline appointment scheduling, minimize no-shows, and provide real-time schedule management for salon staff.
- **Target Audience:** High-net-worth clients, professionals seeking grooming/styling services, bridal/event parties, and internal salon stylists/administrators.

---

### 2. Client & Admin User Flows

#### 2.1 Client User Journey
1. **Discovery & Exploration:**
   - Client visits responsive landing page with brand hero, social proof, and video/imagery.
   - Browses filterable Service Catalog (Hair, Color, Beard, Spa, Facials, VIP packages) with duration, pricing, and detailed benefits.
   - Explores Stylist Profiles with specialties, portfolio photos, and verified reviews.
2. **Booking Flow (Multi-Step Engine):**
   - **Step 1 - Service Selection:** Add one or multiple services. Dynamic cart recalculates total price and aggregate appointment duration.
   - **Step 2 - Stylist Selection:** Select a dedicated master stylist or "Any Available Specialist" for optimized time slots.
   - **Step 3 - Date & Dynamic Time Slot:** Select date via calendar. Available slots are calculated based on stylist working hours, existing appointments, buffer times (15 mins), and blocked slots.
   - **Step 4 - Guest/Customer Details:** Input Full Name, Phone number, Email, and special requests (e.g., allergies, drink preference, quiet appointment).
   - **Step 5 - Review & Instant Confirmation:** Summary with breakdown, deposit/loyalty code input, and instant confirmation generating a unique Booking Reference ID (e.g., `ELX-84920`).
3. **Post-Booking Engagement:**
   - WhatsApp and SMS confirmation + Google Calendar / Apple iCal sync link.
   - Automated 24-hour and 2-hour reminder notifications.

#### 2.2 Admin & Staff Workflow
1. **Staff Portal Access:** Secure authentication for salon receptionists and stylists.
2. **Interactive Calendar & Appointment Grid:** Day, Week, and Month views showing real-time booked, pending, and completed slots color-coded by stylist.
3. **Slot Blocking / Time-Off Management:** Ability to block specific time windows (e.g., lunch breaks, sanitation, emergency leaves) which immediately locks availability on client booking engine.
4. **Walk-in & Manual Booking:** Receptionists can quickly schedule walk-in clients over the phone into open slots.
5. **Customer Management (CRM):** View appointment history, lifetime spend, notes, and direct WhatsApp contact trigger.

---

### 3. Database Schema Requirements (Relational / NoSQL)

```sql
-- Users (Clients & Staff)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(30) NOT NULL,
  role VARCHAR(20) DEFAULT 'client' CHECK (role IN ('client', 'stylist', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stylists / Staff Profiles
CREATE TABLE stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL, -- e.g. "Senior Colorist", "Master Barber"
  bio TEXT,
  avatar_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.00,
  review_count INT DEFAULT 0,
  specialties TEXT[], -- e.g. ['Balayage', 'Precision Fade', 'Keratin']
  is_active BOOLEAN DEFAULT true
);

-- Service Categories & Services
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL, -- e.g. 'Haircuts', 'Coloring', 'Spa'
  description TEXT,
  duration_minutes INT NOT NULL DEFAULT 45,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  is_featured BOOLEAN DEFAULT false
);

-- Working Hours & Availability
CREATE TABLE stylist_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylist_id UUID REFERENCES stylists(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_working BOOLEAN DEFAULT true
);

-- Blocked Slots (Breaks, Maintenance, VIP Private)
CREATE TABLE blocked_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylist_id UUID REFERENCES stylists(id) ON DELETE SET NULL, -- NULL means salon-wide block
  start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  end_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
  reason VARCHAR(255) NOT NULL,
  created_by UUID REFERENCES users(id)
);

-- Appointments / Bookings
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_code VARCHAR(20) UNIQUE NOT NULL,
  client_id UUID REFERENCES users(id),
  stylist_id UUID REFERENCES stylists(id),
  appointment_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_duration_minutes INT NOT NULL,
  total_price NUMERIC(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'completed', 'cancelled', 'no_show')),
  special_notes TEXT,
  payment_status VARCHAR(20) DEFAULT 'pay_at_salon' CHECK (payment_status IN ('paid', 'pending', 'pay_at_salon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Appointment Services Junction (Support multi-service bookings)
CREATE TABLE appointment_services (
  appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  service_price NUMERIC(10, 2) NOT NULL,
  PRIMARY KEY (appointment_id, service_id)
);
```

---

### 4. Third-Party Integrations

1. **Messaging & Notifications (Twilio / Meta WhatsApp Cloud API):**
   - Instant WhatsApp booking confirmation with location pin and calendar link.
   - SMS reminders triggered 24 hours and 2 hours prior to scheduled time slot.
   - 2-way SMS confirmation: "Reply 1 to confirm, 2 to reschedule".
2. **Calendar Synchronization (Google Calendar API & Apple iCal):**
   - Automatically generates `.ics` file download on confirmation screen.
   - Google Calendar 1-click sync link pre-populated with location, service details, and notes.
   - Staff-side two-way Google Calendar synchronization for stylists.
3. **Payment Gateways (Stripe & Razorpay):**
   - Supports online booking deposits (e.g., 20% deposit or full prepay) or "Pay at Venue" option.
   - PCI-DSS compliant checkout with Apple Pay, Google Pay, Cards, and UPI.
   - Webhook handlers for `checkout.session.completed` and `charge.refunded`.

---

### 5. Milestone Breakdown & Delivery Schedule

| Milestone | Deliverables | Timeline | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **M1: UI/UX & Design System** | High-fidelity Figma designs, mobile responsive prototypes, design tokens | Week 1 - 2 | Signed off by stakeholders; WCAG 2.1 AA compliant. |
| **M2: Frontend & Multi-Step Engine** | Responsive landing page, dynamic service catalog, 5-step booking flow, stylist cards | Week 3 - 4 | Zero layout shift; smooth transitions; < 1.5s mobile LCP. |
| **M3: Backend, DB & Slot Engine** | PostgreSQL database, slot conflict algorithm, buffer times, CRUD APIs | Week 5 - 6 | 100% prevention of double-booking under concurrency tests. |
| **M4: Admin Dashboard & Slot Blocking** | Calendar/list views, slot blocker, appointment status manager, customer notes | Week 7 | Staff can block/unblock slots with instant client reflection. |
| **M5: Integrations & Payments** | Stripe/Razorpay checkout, Twilio SMS/WhatsApp, Google Calendar sync | Week 8 | End-to-end test payments and message deliveries verified. |
| **M6: QA, Audit & Deployment** | Security audit, Lighthouse 90+ score, CI/CD pipeline, staging & production deploy | Week 9 | Full end-to-end sign-off on iOS, Android, and Desktop. |

---

### 6. Mobile Responsiveness & Performance Standards
- **Responsive Breakpoints:** Mobile (360px - 640px), Tablet (641px - 1024px), Desktop (1025px+).
- **Core Web Vitals:**
  - Largest Contentful Paint (LCP) < 2.0s
  - Cumulative Layout Shift (CLS) < 0.05
  - First Input Delay (FID) / Interaction to Next Paint (INP) < 100ms
- **Touch Targets:** Minimum 48px x 48px touch targets on mobile booking buttons and time slot selectors.
