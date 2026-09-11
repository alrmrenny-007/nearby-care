import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { LocationProvider } from './context/LocationContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Hospitals from './pages/Hospitals'
import HospitalDetail from './pages/HospitalDetail'
import About from './pages/About'

export default function App() {
  return (
    <LocationProvider>
      <div className="frame-wrap">
        <div className="frame">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/hospitals/:id" element={<HospitalDetail />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <BottomNav />
        </div>
      </div>
    </LocationProvider>
  )
}
