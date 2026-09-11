import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Clock } from 'lucide-react'
import { formatMinutes } from '../utils/geo'

const MODE_LABEL = { driving: 'drive', walking: 'walk', cycling: 'cycle' }

export default function HospitalCard({ hospital, mode }) {
  return (
    <Link to={`/hospitals/${hospital.id}`} className="card-link">
      <div className="hospital-card">
        <div className="hospital-thumb">
          <img
            src={`https://picsum.photos/seed/${encodeURIComponent(hospital.id)}/120/120`}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="hospital-info">
          <span className="hospital-tag">{hospital.emergency ? 'Emergency care' : 'Hospital'}</span>
          <p className="hospital-name">{hospital.name}</p>
          <div className="hospital-meta">
            <MapPin size={12} />
            <span>{hospital.address} · {hospital.distKm.toFixed(1)} km</span>
          </div>
          <div className="hospital-eta">
            <Clock size={13} />
            {formatMinutes(hospital.etaMin)} {MODE_LABEL[mode]}
          </div>
        </div>
      </div>
    </Link>
  )
}
