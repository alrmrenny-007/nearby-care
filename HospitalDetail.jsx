import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Phone, Share2, Navigation, Clock, Route } from 'lucide-react'
import { useLocationData } from '../context/LocationContext'
import { formatMinutes } from '../utils/geo'

export default function HospitalDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { hospitals, mode, getRoute } = useLocationData()
  const [route, setRoute] = useState(null)
  const [routeLoading, setRouteLoading] = useState(false)

  const hospital = hospitals.find((h) => h.id === id)

  useEffect(() => {
    setRoute(null)
  }, [id, mode])

  if (!hospital) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="icon-btn-light" onClick={() => navigate(-1)}><ArrowLeft size={17} /></button>
          <h1>Hospital</h1>
          <div style={{ width: 38 }} />
        </div>
        <div className="empty-state">
          <div className="big">🏥</div>
          We couldn't find that hospital. It may have dropped out of your current search radius.
        </div>
      </div>
    )
  }

  async function handleDirections() {
    setRouteLoading(true)
    const r = await getRoute(hospital)
    setRoute(r)
    setRouteLoading(false)
  }

  return (
    <div className="page">
      <div className="detail-photo">
        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(hospital.id)}/700/500`}
          alt=""
        />
        <button className="detail-back" onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowLeft size={18} />
        </button>
        <span className="detail-tag">{hospital.emergency ? 'Emergency care' : 'General hospital'}</span>
      </div>

      <div className="detail-body">
        <h1 className="detail-name">{hospital.name}</h1>
        <div className="detail-row">
          <MapPin size={16} />
          <span>{hospital.address} · {hospital.distKm.toFixed(1)} km away</span>
        </div>
        <div className="detail-row">
          <Clock size={16} />
          <span>~{formatMinutes(hospital.etaMin)} by {mode}</span>
        </div>

        <div className="detail-actions">
          <button className="pill-btn orange" onClick={handleDirections} disabled={routeLoading}>
            <Navigation size={15} /> {routeLoading ? 'Finding route…' : 'Directions'}
          </button>
          {hospital.phone ? (
            <a className="icon-btn-circle" style={{ background: '#1C1B29' }} href={`tel:${hospital.phone}`} aria-label="Call hospital">
              <Phone size={16} />
            </a>
          ) : null}
          <button
            className="icon-btn-circle"
            style={{ background: '#1C1B29' }}
            aria-label="Share this hospital"
            onClick={() => {
              const text = `${hospital.name} — https://www.openstreetmap.org/?mlat=${hospital.lat}&mlon=${hospital.lon}#map=17/${hospital.lat}/${hospital.lon}`
              if (navigator.share) navigator.share({ title: hospital.name, text })
              else {
                navigator.clipboard.writeText(text)
                alert('Link copied to clipboard.')
              }
            }}
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {route && (
        <div className="route-sheet">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.85rem' }}>
            <Route size={15} /> Route summary {route.isFallback ? '(estimated)' : ''}
          </div>
          <div className="route-stats">
            <div>
              <div className="num">{formatMinutes(route.minutes)}</div>
              <div className="lbl">time</div>
            </div>
            <div>
              <div className="num">{route.km.toFixed(1)} km</div>
              <div className="lbl">distance</div>
            </div>
            <div>
              <div className="num" style={{ textTransform: 'capitalize' }}>{mode}</div>
              <div className="lbl">mode</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
