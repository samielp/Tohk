import React, { useState } from 'react'
import { Luggage, Leaf, RotateCcw, ChevronDown, ChevronUp, ExternalLink, Zap } from 'lucide-react'
import styles from './FlightCard.module.css'

const AIRLINE_COLORS = {
  UA: '#005daa', DL: '#e01933', AA: '#cc0000', WN: '#304cb2',
  B6: '#0033a0', NK: '#ffed00', F9: '#68b430', AS: '#00538b',
  BA: '#2e5fa3', LH: '#05164d', EK: '#c60c30', SQ: '#f0a500',
  QR: '#5c0632', AF: '#002157', KL: '#00a1de',
}

function AirlineLogo({ code, name }) {
  const color = AIRLINE_COLORS[code] || '#2563EB'
  return (
    <div className={styles.logo} style={{ background: color }}>
      {code}
    </div>
  )
}

export default function FlightCard({ flight, index = 0, isBest = false }) {
  const [expanded, setExpanded] = useState(false)

  const stopLabel = flight.stops === 0
    ? 'Nonstop'
    : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`

  function handleBook() {
    window.open(flight.bookingUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div
      className={`${styles.card} ${isBest ? styles.best : ''}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {isBest && (
        <div className={styles.bestBadge}>
          <Zap size={12} /> Best Deal
        </div>
      )}

      <div className={styles.main}>
        {/* Airline */}
        <div className={styles.airlineCol}>
          <AirlineLogo code={flight.airlineCode} name={flight.airline} />
          <div className={styles.airlineInfo}>
            <span className={styles.airlineName}>{flight.airline}</span>
            <span className={styles.flightNum}>{flight.flightNumber}</span>
          </div>
        </div>

        {/* Times */}
        <div className={styles.timesCol}>
          <div className={styles.time}>{flight.departureTime}</div>
          <div className={styles.airport}>{flight.origin}</div>
        </div>

        {/* Route */}
        <div className={styles.routeCol}>
          <div className={styles.duration}>{flight.duration}</div>
          <div className={styles.routeLine}>
            <div className={styles.dot} />
            <div className={styles.line} />
            {flight.stops > 0 && (
              <div className={styles.stopDots}>
                {flight.stopLocations.map(s => (
                  <div key={s} className={styles.stopDot} title={s} />
                ))}
              </div>
            )}
            <div className={styles.line} />
            <div className={styles.plane}>✈</div>
          </div>
          <div className={`${styles.stopLabel} ${flight.stops === 0 ? styles.nonstop : ''}`}>
            {stopLabel}
          </div>
        </div>

        {/* Arrival */}
        <div className={styles.timesCol}>
          <div className={styles.time}>{flight.arrivalTime}</div>
          <div className={styles.airport}>{flight.destination}</div>
        </div>

        {/* Badges */}
        <div className={styles.badgesCol}>
          {flight.refundable && (
            <span className="tag tag-green"><RotateCcw size={10} /> Refundable</span>
          )}
          <span className="tag tag-blue"><Luggage size={10} /> {flight.baggage.split(' ')[0]}</span>
          <span className="tag" style={{background:'rgba(100,116,139,.12)', color:'#94a3b8', fontSize:'11px'}}>
            {flight.class}
          </span>
        </div>

        {/* Price & CTA */}
        <div className={styles.priceCol}>
          {flight.seatsLeft <= 5 && (
            <span className="tag tag-red" style={{marginBottom:'6px', fontSize:'11px'}}>
              Only {flight.seatsLeft} left!
            </span>
          )}
          <div className={styles.price}>${flight.price.toLocaleString()}</div>
          <div className={styles.priceSub}>per person</div>
          <button className={`btn btn-primary ${styles.bookBtn}`} onClick={handleBook}>
            Book Now <ExternalLink size={13} />
          </button>
          <button
            className={styles.detailsToggle}
            onClick={() => setExpanded(e => !e)}
          >
            {expanded ? <><ChevronUp size={14}/> Hide</> : <><ChevronDown size={14}/> Details</>}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className={styles.details}>
          <div className={styles.detailsGrid}>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Total (all passengers)</span>
              <span className={styles.detailValue}>${flight.priceTotal.toLocaleString()}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Baggage</span>
              <span className={styles.detailValue}>{flight.baggage}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Refundable</span>
              <span className={styles.detailValue}>{flight.refundable ? '✓ Yes' : '✗ No'}</span>
            </div>
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}>Cabin</span>
              <span className={styles.detailValue}>{flight.class}</span>
            </div>
            {flight.stops > 0 && (
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Layovers</span>
                <span className={styles.detailValue}>{flight.stopLocations.join(', ')}</span>
              </div>
            )}
            <div className={styles.detailItem}>
              <span className={styles.detailLabel}><Leaf size={12}/> CO₂ est.</span>
              <span className={styles.detailValue}>{flight.emissions} kg</span>
            </div>
          </div>
          <div className={styles.disclaimer}>
            Prices shown are per person. Final price confirmed at booking. Clicking "Book Now" takes you to the airline's or partner's booking page.
          </div>
        </div>
      )}
    </div>
  )
}
