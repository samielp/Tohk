import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { MapPin, Calendar, Users, Search, ArrowLeftRight } from 'lucide-react'
import { searchAirports } from '../utils/flightApi'
import styles from './SearchForm.module.css'

const TRIP_TYPES = ['Round Trip', 'One Way', 'Multi-City']
const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First Class']

function AirportInput({ label, placeholder, value, onChange, icon }) {
  const [query, setQuery]       = useState(value?.city ? `${value.city} (${value.code})` : '')
  const [results, setResults]   = useState([])
  const [focused, setFocused]   = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (value && !focused) {
      setQuery(value.city ? `${value.city} (${value.code})` : '')
    }
  }, [value, focused])

  function handleInput(e) {
    const q = e.target.value
    setQuery(q)
    setResults(searchAirports(q))
  }

  function handleSelect(airport) {
    setQuery(`${airport.city} (${airport.code})`)
    setResults([])
    setFocused(false)
    onChange(airport)
  }

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setResults([])
        setFocused(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div className={styles.field} ref={ref}>
      <label className={styles.label}>
        <span className={styles.labelIcon}>{icon}</span>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInput}
          onFocus={() => { setFocused(true); setResults(searchAirports(query)) }}
          autoComplete="off"
          spellCheck={false}
        />
        {value?.code && <span className={styles.airportCode}>{value.code}</span>}
      </div>
      {results.length > 0 && focused && (
        <div className={styles.dropdown}>
          {results.map(a => (
            <button key={a.code} className={styles.dropdownItem} onMouseDown={() => handleSelect(a)}>
              <span className={styles.dropdownCode}>{a.code}</span>
              <span className={styles.dropdownInfo}>
                <span className={styles.dropdownCity}>{a.city}</span>
                <span className={styles.dropdownName}>{a.name}</span>
              </span>
              <span className={styles.dropdownCountry}>{a.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchForm({ compact = false, initialValues = {} }) {
  const navigate = useNavigate()

  const [tripType,  setTripType]  = useState(initialValues.tripType  || 'Round Trip')
  const [cabin,     setCabin]     = useState(initialValues.cabin      || 'Economy')
  const [origin,    setOrigin]    = useState(initialValues.origin     || null)
  const [dest,      setDest]      = useState(initialValues.dest       || null)
  const [depDate,   setDepDate]   = useState(initialValues.depDate    ? new Date(initialValues.depDate) : null)
  const [retDate,   setRetDate]   = useState(initialValues.retDate    ? new Date(initialValues.retDate) : null)
  const [adults,    setAdults]    = useState(initialValues.adults     || 1)
  const [children,  setChildren]  = useState(initialValues.children   || 0)
  const [infants,   setInfants]   = useState(initialValues.infants    || 0)
  const [paxOpen,   setPaxOpen]   = useState(false)
  const [error,     setError]     = useState('')
  const paxRef = useRef()

  useEffect(() => {
    function onClick(e) {
      if (paxRef.current && !paxRef.current.contains(e.target)) setPaxOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function swapAirports() {
    setOrigin(dest)
    setDest(origin)
  }

  function validate() {
    if (!origin) return 'Please select an origin airport.'
    if (!dest)   return 'Please select a destination airport.'
    if (origin.code === dest.code) return 'Origin and destination must differ.'
    if (!depDate) return 'Please select a departure date.'
    if (tripType === 'Round Trip' && !retDate) return 'Please select a return date.'
    return ''
  }

  function handleSearch(e) {
    e.preventDefault()
    const err = validate()
    if (err) { setError(err); return }
    setError('')
    const params = new URLSearchParams({
      origin:      origin.code,
      originCity:  origin.city,
      dest:        dest.code,
      destCity:    dest.city,
      depDate:     depDate.toISOString(),
      retDate:     retDate ? retDate.toISOString() : '',
      adults, children, infants,
      tripType: tripType.toLowerCase().replace(' ', '-'),
      cabin,
    })
    navigate(`/search?${params.toString()}`)
  }

  const paxCount = adults + children + infants

  return (
    <form className={`${styles.form} ${compact ? styles.compact : ''}`} onSubmit={handleSearch} noValidate>
      {!compact && (
        <div className={styles.topBar}>
          <div className={styles.tripTypes}>
            {TRIP_TYPES.map(t => (
              <button key={t} type="button"
                className={`${styles.tripBtn} ${tripType === t ? styles.active : ''}`}
                onClick={() => setTripType(t)}>
                {t}
              </button>
            ))}
          </div>
          <select value={cabin} onChange={e => setCabin(e.target.value)} className={styles.cabinSelect}>
            {CABIN_CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      )}

      <div className={styles.row}>
        <AirportInput
          label="From"
          placeholder="City or airport"
          value={origin}
          onChange={setOrigin}
          icon={<MapPin size={14} />}
        />

        <button type="button" className={styles.swapBtn} onClick={swapAirports} title="Swap airports">
          <ArrowLeftRight size={16} />
        </button>

        <AirportInput
          label="To"
          placeholder="City or airport"
          value={dest}
          onChange={setDest}
          icon={<MapPin size={14} />}
        />

        <div className={styles.field}>
          <label className={styles.label}>
            <span className={styles.labelIcon}><Calendar size={14} /></span>
            Departure
          </label>
          <DatePicker
            selected={depDate}
            onChange={date => { setDepDate(date); if (retDate && date > retDate) setRetDate(null) }}
            minDate={new Date()}
            placeholderText="Select date"
            dateFormat="MMM d, yyyy"
          />
        </div>

        {tripType === 'Round Trip' && (
          <div className={styles.field}>
            <label className={styles.label}>
              <span className={styles.labelIcon}><Calendar size={14} /></span>
              Return
            </label>
            <DatePicker
              selected={retDate}
              onChange={setRetDate}
              minDate={depDate || new Date()}
              placeholderText="Select date"
              dateFormat="MMM d, yyyy"
            />
          </div>
        )}

        <div className={styles.field} ref={paxRef}>
          <label className={styles.label}>
            <span className={styles.labelIcon}><Users size={14} /></span>
            Passengers
          </label>
          <button type="button" className={styles.paxBtn} onClick={() => setPaxOpen(o => !o)}>
            <Users size={15} />
            {paxCount} Passenger{paxCount !== 1 ? 's' : ''}
          </button>
          {paxOpen && (
            <div className={styles.paxDropdown}>
              {[
                { label: 'Adults', sub: '12+ years', val: adults, set: setAdults, min: 1, max: 9 },
                { label: 'Children', sub: '2–11 years', val: children, set: setChildren, min: 0, max: 8 },
                { label: 'Infants', sub: 'Under 2', val: infants, set: setInfants, min: 0, max: adults },
              ].map(({ label, sub, val, set, min, max }) => (
                <div key={label} className={styles.paxRow}>
                  <div>
                    <div className={styles.paxLabel}>{label}</div>
                    <div className={styles.paxSub}>{sub}</div>
                  </div>
                  <div className={styles.counter}>
                    <button type="button" onClick={() => set(v => Math.max(min, v - 1))}
                      disabled={val <= min}>−</button>
                    <span>{val}</span>
                    <button type="button" onClick={() => set(v => Math.min(max, v + 1))}
                      disabled={val >= max}>+</button>
                  </div>
                </div>
              ))}
              <button type="button" className="btn btn-primary" style={{width:'100%',marginTop:'8px'}}
                onClick={() => setPaxOpen(false)}>Done</button>
            </div>
          )}
        </div>

        <button type="submit" className={`btn btn-primary ${styles.searchBtn}`}>
          <Search size={18} />
          Search
        </button>
      </div>

      {error && <p className={styles.error}>⚠ {error}</p>}
    </form>
  )
}
