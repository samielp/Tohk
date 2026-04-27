// ─────────────────────────────────────────────────────────────────────────────
// Flight API Utility
//
// HOW COMMISSIONS WORK:
//   This site earns via affiliate programs. When a user clicks "Book Now",
//   they are redirected to the airline / OTA with YOUR affiliate tracking
//   link embedded. You earn a commission (typically 1–7%) on every booking.
//
// AFFILIATE PROGRAMS TO JOIN (free):
//   1. Skyscanner Partners  → https://partners.skyscanner.net
//   2. Kiwi.com Affiliate   → https://www.kiwi.com/us/pages/affiliate
//   3. Booking.com Flights  → https://www.booking.com/affiliate-program
//   4. Travelpayouts        → https://www.travelpayouts.com  (best for flights)
//
// SETUP:
//   1. Sign up for Travelpayouts (they aggregate many programs in one).
//   2. Copy your affiliate marker/token into the .env file:
//      VITE_TRAVELPAYOUTS_MARKER=your_marker_here
//      VITE_SKYSCANNER_PARTNER_ID=your_partner_id_here
//   3. The buildBookingUrl() function below will auto-embed your tracking.
//
// FOR REAL FLIGHT DATA (optional upgrade):
//   - Amadeus for Developers (free tier): https://developers.amadeus.com
//     Set VITE_AMADEUS_API_KEY and VITE_AMADEUS_API_SECRET in .env
//   - Or use RapidAPI's "Sky Scrapper" API for Skyscanner data.
// ─────────────────────────────────────────────────────────────────────────────

const TRAVELPAYOUTS_MARKER = import.meta.env.VITE_TRAVELPAYOUTS_MARKER || 'YOUR_MARKER'
const SKYSCANNER_PARTNER   = import.meta.env.VITE_SKYSCANNER_PARTNER_ID || 'YOUR_PARTNER'

// Popular airports for autocomplete
export const AIRPORTS = [
  { code: 'JFK', city: 'New York', country: 'US', name: 'John F. Kennedy Intl' },
  { code: 'LGA', city: 'New York', country: 'US', name: 'LaGuardia' },
  { code: 'EWR', city: 'Newark',   country: 'US', name: 'Newark Liberty Intl' },
  { code: 'LAX', city: 'Los Angeles', country: 'US', name: 'Los Angeles Intl' },
  { code: 'ORD', city: 'Chicago',  country: 'US', name: "O'Hare Intl" },
  { code: 'MDW', city: 'Chicago',  country: 'US', name: 'Midway Intl' },
  { code: 'SFO', city: 'San Francisco', country: 'US', name: 'San Francisco Intl' },
  { code: 'MIA', city: 'Miami',    country: 'US', name: 'Miami Intl' },
  { code: 'BOS', city: 'Boston',   country: 'US', name: 'Logan Intl' },
  { code: 'SEA', city: 'Seattle',  country: 'US', name: 'Seattle-Tacoma Intl' },
  { code: 'DFW', city: 'Dallas',   country: 'US', name: 'Dallas/Fort Worth Intl' },
  { code: 'DEN', city: 'Denver',   country: 'US', name: 'Denver Intl' },
  { code: 'ATL', city: 'Atlanta',  country: 'US', name: 'Hartsfield-Jackson Intl' },
  { code: 'LHR', city: 'London',   country: 'GB', name: 'Heathrow' },
  { code: 'LGW', city: 'London',   country: 'GB', name: 'Gatwick' },
  { code: 'CDG', city: 'Paris',    country: 'FR', name: 'Charles de Gaulle' },
  { code: 'AMS', city: 'Amsterdam',country: 'NL', name: 'Schiphol' },
  { code: 'FRA', city: 'Frankfurt',country: 'DE', name: 'Frankfurt Airport' },
  { code: 'MAD', city: 'Madrid',   country: 'ES', name: 'Adolfo Suárez' },
  { code: 'BCN', city: 'Barcelona',country: 'ES', name: 'El Prat' },
  { code: 'FCO', city: 'Rome',     country: 'IT', name: 'Leonardo da Vinci' },
  { code: 'DXB', city: 'Dubai',    country: 'AE', name: 'Dubai Intl' },
  { code: 'SIN', city: 'Singapore',country: 'SG', name: 'Changi Airport' },
  { code: 'NRT', city: 'Tokyo',    country: 'JP', name: 'Narita Intl' },
  { code: 'HND', city: 'Tokyo',    country: 'JP', name: 'Haneda' },
  { code: 'ICN', city: 'Seoul',    country: 'KR', name: 'Incheon Intl' },
  { code: 'HKG', city: 'Hong Kong',country: 'HK', name: 'Hong Kong Intl' },
  { code: 'SYD', city: 'Sydney',   country: 'AU', name: 'Kingsford Smith' },
  { code: 'MEL', city: 'Melbourne',country: 'AU', name: 'Melbourne Airport' },
  { code: 'YYZ', city: 'Toronto',  country: 'CA', name: 'Pearson Intl' },
  { code: 'YVR', city: 'Vancouver',country: 'CA', name: 'Vancouver Intl' },
  { code: 'GRU', city: 'São Paulo',country: 'BR', name: 'Guarulhos Intl' },
  { code: 'MEX', city: 'Mexico City', country: 'MX', name: 'Benito Juárez Intl' },
  { code: 'IST', city: 'Istanbul', country: 'TR', name: 'Istanbul Airport' },
  { code: 'BKK', city: 'Bangkok',  country: 'TH', name: 'Suvarnabhumi' },
  { code: 'DEL', city: 'New Delhi',country: 'IN', name: 'Indira Gandhi Intl' },
  { code: 'BOM', city: 'Mumbai',   country: 'IN', name: 'Chhatrapati Shivaji Intl' },
  { code: 'CPT', city: 'Cape Town',country: 'ZA', name: 'Cape Town Intl' },
  { code: 'JNB', city: 'Johannesburg', country: 'ZA', name: 'O.R. Tambo Intl' },
  { code: 'CAI', city: 'Cairo',    country: 'EG', name: 'Cairo Intl' },
]

export function searchAirports(query) {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  return AIRPORTS.filter(a =>
    a.code.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.name.toLowerCase().includes(q)
  ).slice(0, 8)
}

// ─── Affiliate Booking URLs ───────────────────────────────────────────────────
export function buildBookingUrl(flight, searchParams) {
  const { origin, destination, departDate, returnDate, passengers, tripType } = searchParams
  const dep = departDate ? formatDateForUrl(departDate) : ''
  const ret = returnDate ? formatDateForUrl(returnDate) : ''

  // Travelpayouts / Aviasales deeplink (earns ~2-5% commission)
  // Replace marker with yours from travelpayouts.com
  const travelpayoutsUrl =
    `https://www.aviasales.com/search/${origin}${dep}${destination}${ret}1?marker=${TRAVELPAYOUTS_MARKER}&currency=USD`

  // Skyscanner deeplink (earns per-click ~$0.20-1.50)
  const skyscannerUrl =
    `https://www.skyscanner.com/transport/flights/${origin.toLowerCase()}/${destination.toLowerCase()}/${dep}/${ret || ''}` +
    `?adults=${passengers.adults}&children=${passengers.children || 0}&infants=${passengers.infants || 0}` +
    `&rtn=${tripType === 'roundtrip' ? 1 : 0}&partnerId=${SKYSCANNER_PARTNER}`

  // Google Flights (no affiliate, but good for trust signal)
  const googleFlightsUrl =
    `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${destination}+on+${dep}`

  // Return the best affiliate URL
  return TRAVELPAYOUTS_MARKER !== 'YOUR_MARKER' ? travelpayoutsUrl : skyscannerUrl
}

function formatDateForUrl(date) {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

// ─── Mock Flight Data (replace with real API for production) ──────────────────
// For production: integrate Amadeus, Kiwi.com, or Travelpayouts Flight Search API
const AIRLINES = [
  { name: 'United Airlines',   code: 'UA', logo: '✈' },
  { name: 'Delta Air Lines',   code: 'DL', logo: '✈' },
  { name: 'American Airlines', code: 'AA', logo: '✈' },
  { name: 'Southwest',         code: 'WN', logo: '✈' },
  { name: 'JetBlue',          code: 'B6', logo: '✈' },
  { name: 'Spirit Airlines',   code: 'NK', logo: '✈' },
  { name: 'Frontier',          code: 'F9', logo: '✈' },
  { name: 'Alaska Airlines',   code: 'AS', logo: '✈' },
  { name: 'British Airways',   code: 'BA', logo: '✈' },
  { name: 'Lufthansa',         code: 'LH', logo: '✈' },
  { name: 'Emirates',          code: 'EK', logo: '✈' },
  { name: 'Singapore Airlines',code: 'SQ', logo: '✈' },
  { name: 'Qatar Airways',     code: 'QR', logo: '✈' },
  { name: 'Air France',        code: 'AF', logo: '✈' },
  { name: 'KLM',               code: 'KL', logo: '✈' },
]

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function addMinutes(dateStr, minutes) {
  const d = new Date(dateStr)
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

function formatTime(date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export async function searchFlights(params) {
  // Simulate API latency
  await new Promise(r => setTimeout(r, 1800))

  const { origin, destination, departDate, passengers } = params
  const totalPassengers = (passengers.adults || 1) + (passengers.children || 0)
  const basePrice = randomBetween(120, 900)
  const depDate = new Date(departDate)

  const results = []
  const numResults = randomBetween(8, 16)

  for (let i = 0; i < numResults; i++) {
    const airline = AIRLINES[randomBetween(0, AIRLINES.length - 1)]
    const stops = randomBetween(0, 2)
    const durationMin = randomBetween(90, 720)
    const priceMultiplier = stops === 0 ? randomBetween(100, 150) / 100 : randomBetween(70, 100) / 100
    const price = Math.round(basePrice * priceMultiplier * (1 + i * 0.04))
    const priceTotal = price * totalPassengers

    const depHour = randomBetween(5, 22)
    const depMinute = randomBetween(0, 59)
    depDate.setHours(depHour, depMinute)

    const arrDate = addMinutes(depDate, durationMin)

    const flight = {
      id: `${airline.code}-${randomBetween(100,9999)}-${i}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${randomBetween(100, 9999)}`,
      origin,
      destination,
      departureTime: formatTime(depDate),
      arrivalTime: formatTime(arrDate),
      duration: formatDuration(durationMin),
      durationMin,
      stops,
      stopLocations: stops > 0 ? ['ORD', 'DFW', 'ATL', 'LAX', 'LHR'].slice(0, stops) : [],
      price,
      priceTotal,
      currency: 'USD',
      seatsLeft: randomBetween(1, 12),
      baggage: stops === 0 && price > 300 ? 'Carry-on + 1 checked' : 'Carry-on only',
      refundable: price > 400 && Math.random() > 0.5,
      class: price > 600 ? 'Business' : 'Economy',
      emissions: randomBetween(80, 400),
      bookingUrl: '',
    }

    results.push(flight)
  }

  // Sort cheapest first
  results.sort((a, b) => a.price - b.price)

  // Add booking URLs
  results.forEach(f => {
    f.bookingUrl = buildBookingUrl(f, params)
  })

  return results
}
