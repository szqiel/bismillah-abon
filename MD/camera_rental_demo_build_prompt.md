# Build Prompt: Camera Rental Demo Site (Cold-Pitch Template)

## Context

This is a demo build for a cold-pitch outreach strategy. The goal is to build a working, polished e-commerce-style website for a **camera rental business**, using dummy/placeholder data, deployable in minutes and sent directly to a prospect as a live link — before they've agreed to anything. If they respond positively, this same codebase gets upgraded with a real backend (Supabase) and their actual branding/inventory.

This means the build needs to work perfectly as a static-feeling demo with zero backend, but be structured so nothing needs to be rebuilt from scratch later — just swapped in.

## Objective

Build a **Next.js** web app for a fictional (or prospect-branded) camera rental business. Core interaction model: customer browses available camera gear, selects rental dates, and completes the booking via a **WhatsApp handoff** — no payment gateway, no login required. This mirrors how local Indonesian camera rental shops already operate (manual confirmation via WA), so it feels familiar and low-friction rather than foreign.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI:** React + Tailwind CSS
- **Animation:** Framer Motion (subtle only — product cards, page transitions, button states)
- **State management:** Zustand (cart/booking selection state)
- **Data layer:** Local dummy JSON/TS file for now — structured so it can be swapped for Supabase queries later with minimal refactor (see "Future Upgrade Path" below)
- **Deployment:** Vercel (free/Hobby tier for demo stage — see note below)

## Core Pages & Features

### 1. Homepage
- Hero section with business name, tagline, and a clear value prop (e.g. "Rent Professional Camera Gear, Booking via WhatsApp")
- Featured/popular gear grid (pulls from dummy data)
- Trust signals section: how rental works (browse → pick dates → confirm via WA → pickup/delivery), placeholder testimonials, placeholder rental terms summary

### 2. Catalog / Browse Page
- Grid of all camera gear (cameras, lenses, lighting, tripods, audio gear — mix of categories)
- Filter by category and availability
- Each item card: photo, name, price/day, short spec line, "View Details" button

### 3. Product Detail Page
- Full gear photos (placeholder images)
- Full specs, included accessories, rental terms specific to that item
- **Date range picker** for rental period
- Live price calculation based on selected date range (days × daily rate)
- "Book via WhatsApp" button — primary CTA

### 4. Booking Flow (WhatsApp Handoff)
- User selects item(s) + date range → adds to a simple cart/booking summary (Zustand state)
- Booking summary page shows: selected items, dates, total estimated price
- Final CTA button generates a **pre-filled WhatsApp message** (using `wa.me` link) containing: item name(s), rental dates, total price, and a placeholder customer name field
- No real payment or login — this mirrors the actual manual confirmation flow these businesses already use, so it should feel native, not like a missing feature

### 5. Admin/Owner View (dummy, static for demo)
- A simple, non-functional (or lightly functional) preview of what an admin dashboard *would* look like — inventory list, booking requests list — using dummy data
- Purpose: signal to the prospect that a real management system comes with the real version, without needing to build full CRUD for the demo

## Dummy Data Requirements

- 10-15 camera/gear items across categories (mirrorless bodies, DSLRs, lenses, lighting kits, tripods, gimbals, audio recorders)
- Realistic Indonesian rental pricing (per day, in Rupiah)
- Placeholder images (use free stock photography or generated placeholders — swappable later)
- 2-3 placeholder testimonials
- Placeholder business info: name, WA number (use a dummy/test number), operating hours, pickup location text

## Design Direction

- Clean, trustworthy, gear-focused — camera rental customers care about specs and trust (is this gear actually in good condition?), so prioritize clarity over decoration
- Dark or neutral base palette works well for a "pro gear" feel — avoid overly playful colors
- Mobile-first — most prospects will open this link on their phone via WhatsApp/Instagram, so mobile experience is the primary test, not desktop

## WhatsApp Integration Specifics

- Use `https://wa.me/<number>?text=<encoded message>` links — no API/business account needed for demo stage
- Pre-filled message template example:
  ```
  Halo! Saya mau booking:
  - [Item name] x [quantity]
  - Tanggal: [start date] - [end date]
  - Estimasi total: Rp [amount]

  Nama: [customer fills in]
  ```
- This should trigger from both the product detail page (quick single-item booking) and the cart/summary page (multi-item booking)

## Future Upgrade Path (build with this in mind, don't build it now)

Structure the codebase so these are swap-ins, not rewrites, if the prospect agrees to buy:

- **Data layer:** Replace dummy JSON with Supabase queries — keep data-fetching logic isolated (e.g. a single `lib/data.ts` or equivalent) so components don't need to change, only the data source behind them
- **Real inventory management:** Supabase-backed admin dashboard replacing the static dummy admin view
- **Real availability logic:** date-based availability checking against actual bookings (requires DB, not feasible with dummy data — flag this clearly as a "real version" feature, don't fake it in the demo)
- **Branding config:** business name, logo, colors, WA number, gear inventory should all be pulled from a single config layer so re-skinning for the *next* camera rental prospect (or finalizing this one's real branding) takes minutes, not hours
- **Optional additions if requested:** deposit/ID verification info section, rental agreement acceptance step, push notifications for booking confirmations (matches capability already built in the Restifashop-derived admin system)

## Hosting Note

Deploy the demo on Vercel's free Hobby tier — fine for pre-sale outreach since no payment is involved. Once a prospect actually converts to a paying client, the site needs to move to a plan that permits commercial use (Vercel Pro or an alternative host), since Hobby is explicitly non-commercial only. Factor this into the real project's hosting cost when it comes time to price the deal.

## Success Criteria for This Demo

- Loads fast and looks polished on mobile (this is what gets opened first)
- WhatsApp booking flow works end-to-end and produces a clean, readable pre-filled message
- Feels tailored to *a* camera rental business (not generic e-commerce) even before real branding is swapped in — the category-specific fields (rental dates, daily pricing, gear specs) are what make this land as "built for me" instead of "another template"
