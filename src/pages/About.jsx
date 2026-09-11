import React from 'react'
import { HeartPulse } from 'lucide-react'

export default function About() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>About</h1>
        <div />
      </div>
      <div className="section">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <span className="ico-wrap" style={{ width: 44, height: 44 }}><HeartPulse size={20} /></span>
          <h2 className="section-title" style={{ margin: 0 }}>Nearby Care</h2>
        </div>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Nearby Care helps you find the closest hospitals and get a real, routed
          travel time by car, on foot, or by bike — built with React, OpenStreetMap
          data, and the OSRM routing engine.
        </p>
        <p style={{ color: 'var(--ink-soft)', fontSize: '0.82rem', lineHeight: 1.6, marginTop: 12 }}>
          Hospital listings come from OpenStreetMap contributors and may be
          incomplete or out of date. In a real emergency, always call your local
          emergency number first.
        </p>
      </div>
    </div>
  )
}
