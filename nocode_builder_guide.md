# No-Code / AI Website Builder Guide
## Luxury Salon & Spa Booking Platform Layout Specification
*(Optimized for Wix Studio, Framer, Webflow, and Squarespace)*

### 1. Visual Hierarchy & Architecture

```
[Sticky Header: Logo | Services | Stylists | Testimonials | "Book Now" Gold Button]
       │
[Hero Section: Video/Editorial Photo, Luxury Tagline, Star Badges, Instant Booking CTA]
       │
[Brand Marquee / Trust Badges: Vogue, GQ, Forbes Beauty, L'Oréal Haute Coiffure]
       │
[Categorized Pricing Menu: Hair, Skin, Color, Spa, Men's Grooming with "Book" CTAs]
       │
[Interactive Multi-Step Booking Widget / Embedded Calendar]
       │
[Stylist & Artisan Showcase: Editorial Portraits, Accreditations, Direct Booking]
       │
[Client Testimonials & Press Mentions: Star Ratings & Before/After Showcase]
       │
[Footer: Opening Hours, Interactive Google Map Pin, Socials, VIP Newsletter]
```

---

### 2. Component Specifications for No-Code Builders

#### A. Sticky Navigation Bar
- **Desktop:** Semi-transparent glassmorphism (`backdrop-filter: blur(16px)`, `rgba(18, 19, 22, 0.85)`), hairline gold border (`#D4AF37` at 20% opacity).
- **Branding:** Elegant serif font logo (e.g. *ÉLIXIR Atelier*).
- **Nav Links:** Smooth scroll anchors `#services`, `#stylists`, `#pricing`, `#contact`.
- **CTA:** High-contrast button with gold gradient background (`linear-gradient(135deg, #D4AF37 0%, #AA771C 100%)`) jumping directly to the booking widget.

#### B. Hero Header
- **Layout:** Split 60/40 desktop, single-column stacked on mobile.
- **Copy:**
  - *Eyebrow Badge:* "Paris & New York Trained Hair Artists • Rated 4.98/5"
  - *Headline (H1):* "The Art of Haute Coiffure & Bespoke Wellness"
  - *Subtext:* "Experience bespoke styling, luxury scalp rituals, and precision grooming in a private sanctuary designed for your rejuvenation."
- **Social Proof Strip:** 5-star Google review pill (`★ 4.9 (850+ reviews)`), client avatars.

#### C. Categorized Pricing Menu
- **Tabs / Pill Filter:** "Haircut & Styling", "Balayage & Color", "Scalp Spa", "Grooming & Beard", "VIP Packages".
- **Card Design:**
  - Floating card with dark stone texture (`#1A1C20`) and gold accent hover.
  - Left: Service title, estimated duration tag (`e.g., 60 mins`), list of included perks.
  - Right: Price in bold gold font (`$120`) and "Add to Appointment" button.

#### D. Embedded Booking Widget
- **Embed Mechanism:** Responsive iframe or custom web component (React / Embed code).
- **Features:**
  1. Service checklist with running subtotal.
  2. Stylist avatar selection.
  3. Responsive date picker + dynamic slot pill selector (Morning, Afternoon, Evening).
  4. Instant booking confirmation modal with `.ics` calendar download.

#### E. Footer & Location Section
- **Business Hours:** Clean 2-column tabular layout (Mon-Sat: 9:00 AM – 8:00 PM, Sun: 10:00 AM – 6:00 PM).
- **Interactive Map:** Dark-mode Google Maps embed centered on salon location with custom gold pin.
- **Direct Contacts:** One-click WhatsApp chat button, telephone call link, and valet parking advisory.
