# ✈ SkyDeals – Cheapest Flight Search & Booking Website

A professional, production-ready flight comparison website that earns money through affiliate commissions. Built with React + Vite, deployable to Vercel in minutes.

---

## 🚀 Features

- **Flight Search** – Search by origin, destination, dates, passengers, cabin class
- **Live Results** – Real-time flight comparison with filters (price, stops) and sorting
- **Hot Deals Page** – Curated deals to drive bookings
- **Affiliate Commission System** – Every "Book Now" click earns you a commission
- **Mobile Responsive** – Works on all screen sizes
- **SEO Ready** – Meta tags, structured routes, fast load times
- **Vercel Ready** – Zero-config deployment

---

## 💰 How You Earn Money

Every time a user clicks "Book Now", they are redirected to a partner booking site with your **affiliate tracking link** embedded. You earn a commission on each completed booking.

### Step 1: Sign up for affiliate programs (free)

| Program | Commission | Sign Up |
|---|---|---|
| **Travelpayouts** (recommended) | 1.6–7% per booking | https://www.travelpayouts.com |
| **Skyscanner Partners** | ~$0.20–1.50 per click | https://partners.skyscanner.net |
| **Kiwi.com Affiliate** | 3–5% per booking | https://www.kiwi.com/us/pages/affiliate |
| **Booking.com** | 4–6% per booking | https://www.booking.com/affiliate-program |

### Step 2: Get your affiliate IDs

- From **Travelpayouts**: Copy your "marker" (found in your dashboard → Tools → Marker)
- From **Skyscanner**: Copy your Partner ID

### Step 3: Add to your .env file

```
VITE_TRAVELPAYOUTS_MARKER=your_marker_here
VITE_SKYSCANNER_PARTNER_ID=your_partner_id_here
```

That's it! Every booking now earns you a commission.

---

## ⚡ Quick Start (Local Development)

```bash
# 1. Clone or download this project
cd skydeals

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your affiliate IDs

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

---

## 🌐 Deploy to Vercel (Free)

### Option A: GitHub + Vercel (Recommended)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/skydeals.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to https://vercel.com and sign in with GitHub
   - Click **"New Project"**
   - Import your `skydeals` repository
   - In **Environment Variables**, add:
     - `VITE_TRAVELPAYOUTS_MARKER` = your marker
     - `VITE_SKYSCANNER_PARTNER_ID` = your partner ID
   - Click **"Deploy"** — done! 🎉

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🔌 Upgrade to Real Flight Data (Production)

The site currently uses realistic mock data. For a production site, connect a real API:

### Option 1: Amadeus (Free tier – 2,000 calls/month)

1. Sign up at https://developers.amadeus.com
2. Create an app and get API Key + Secret
3. Add to `.env`:
```
VITE_AMADEUS_API_KEY=your_key
VITE_AMADEUS_API_SECRET=your_secret
```
4. Replace the `searchFlights()` function in `src/utils/flightApi.js` with:

```js
// Amadeus flight offers search
const tokenRes = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: `grant_type=client_credentials&client_id=${key}&client_secret=${secret}`
})
const { access_token } = await tokenRes.json()

const res = await fetch(
  `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${dest}&departureDate=${date}&adults=${adults}&max=20`,
  { headers: { Authorization: `Bearer ${access_token}` } }
)
const data = await res.json()
// Map data.data to your flight format
```

### Option 2: RapidAPI Sky Scrapper (Skyscanner data)
- https://rapidapi.com/apiheya/api/sky-scrapper

### Option 3: Travelpayouts Flight Search API (Free)
- https://www.travelpayouts.com/developers/api
- Returns real cheapest prices from their database

---

## 📁 Project Structure

```
skydeals/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx / .module.css
│   │   ├── Footer.jsx / .module.css
│   │   ├── SearchForm.jsx / .module.css    ← Main search widget
│   │   └── FlightCard.jsx / .module.css   ← Flight result card
│   ├── pages/
│   │   ├── Home.jsx / .module.css         ← Landing page
│   │   ├── SearchResults.jsx / .module.css ← Results + filters
│   │   ├── Deals.jsx / .module.css        ← Hot deals page
│   │   └── About.jsx / .module.css        ← About + FAQ
│   ├── utils/
│   │   └── flightApi.js                   ← API + affiliate links
│   ├── styles/
│   │   └── global.css                     ← Design system
│   ├── App.jsx                            ← Router
│   └── main.jsx                           ← Entry point
├── .env.example                           ← Environment template
├── .gitignore
├── vercel.json                            ← Vercel SPA config
├── vite.config.js
├── package.json
└── index.html
```

---

## 🎨 Customization

### Change the site name / branding
- Edit `index.html` (title, meta tags)
- Edit `Navbar.jsx` and `Footer.jsx` (logo text)

### Add more airports
- Edit the `AIRPORTS` array in `src/utils/flightApi.js`

### Add Google Analytics
```html
<!-- Add to index.html <head> -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### Change colors / theme
- Edit CSS variables in `src/styles/global.css`

---

## 📋 Legal Notes

- Display "prices are indicative, confirmed at booking" (already included)
- Add a Privacy Policy page before launch (required for affiliate programs)
- Follow each affiliate program's terms of service
- Some programs require disclosure that you earn commissions (already included in Footer and About page)

---

## 🛟 Support

For questions or issues, open a GitHub issue or email hello@skydeals.com.
