import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  MapPinned,
  Siren,
  Pill,
  Video,
  MessageCircle,
  Share2,
  Building2,
  Clock,
} from 'lucide-react'
import { useLocationData } from '../context/LocationContext'
import { formatMinutes } from '../utils/geo'
import HospitalCard from '../components/HospitalCard'
import SearchOverlay from '../components/SearchOverlay'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { location, hospitals, mode, loading, error, locateMe } = useLocationData()
  const [showSearch, setShowSearch] = useState(false)
  const navigate = useNavigate()
  const nearest = hospitals[0]

  function shareLocation() {
    if (!location) return
    const text = `My location: https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}#map=16/${location.lat}/${location.lon}`
    if (navigator.share) {
      navigator.share({ title: 'My location', text })
    } else {
      navigator.clipboard.writeText(text)
      alert('Location link copied to clipboard.')
    }
  }

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-top">
          <div>
            <p className="hero-greet-label">{greeting()}</p>
            <h1 className="greet-name">Let's find you care</h1>
          </div>
          <button className="icon-btn-circle" onClick={() => setShowSearch(true)} aria-label="Search a location">
            <MapPinned size={18} />
          </button>
        </div>

        <button className="hero-chip" onClick={location ? () => navigate('/hospitals') : locateMe}>
          <span className="chip-icon"><Building2 size={17} /></span>
          <span className="chip-text">
            {loading
              ? 'Finding hospitals near you…'
              : location
              ? `${hospitals.length} hospitals within 8km`
              : 'Share your location to get started'}
          </span>
          <ChevronRight size={18} />
        </button>
      </div>

      {location && nearest && (
        <div className="stat-card">
          <div className="stat-card-top">
            <div>
              <p className="stat-label">Nearest hospital</p>
              <p className="stat-name">{nearest.name}</p>
            </div>
            <div className="stat-icon-box"><Building2 size={20} color="#E8563B" /></div>
          </div>
          <div className="stat-card-bottom">
            <div className="stat-eta">
              <Clock size={16} />
              <span className="num">{formatMinutes(nearest.etaMin)}</span>
              <span className="unit">by {mode}</span>
            </div>
            <button className="pill-btn" onClick={() => navigate(`/hospitals/${nearest.id}`)}>
              Get directions
            </button>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="status-row" style={{ margin: '20px 20px 0' }}>{error}</div>
      )}

      <div className="section">
        <h2 className="section-title">Services</h2>
        <div className="services-grid">
          <button className="service-item" onClick={() => navigate('/hospitals')}>
            <span className="ico-wrap"><Building2 size={18} /></span>
            <span>Find hospitals</span>
          </button>
          <a className="service-item" href="tel:911">
            <span className="ico-wrap"><Siren size={18} /></span>
            <span>Call ambulance</span>
          </a>
          <button className="service-item" onClick={shareLocation} disabled={!location}>
            <span className="ico-wrap"><Share2 size={18} /></span>
            <span>Share location</span>
          </button>
          <button className="service-item">
            <span className="soon-badge">Soon</span>
            <span className="ico-wrap"><Pill size={18} /></span>
            <span>Pharmacies</span>
          </button>
          <button className="service-item">
            <span className="soon-badge">Soon</span>
            <span className="ico-wrap"><Video size={18} /></span>
            <span>Video consult</span>
          </button>
          <button className="service-item">
            <span className="soon-badge">Soon</span>
            <span className="ico-wrap"><MessageCircle size={18} /></span>
            <span>Chat support</span>
          </button>
        </div>
      </div>

      {location && hospitals.length > 0 && (
        <div className="section" style={{ paddingBottom: 20 }}>
          <h2 className="section-title">Closest to you</h2>
          {hospitals.slice(0, 3).map((h) => (
            <HospitalCard key={h.id} hospital={h} mode={mode} />
          ))}
        </div>
      )}

      {showSearch && <SearchOverlay onClose={() => setShowSearch(false)} />}
    </div>
  )
}
