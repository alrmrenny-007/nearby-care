import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Building2, Info } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/hospitals" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <Building2 size={20} />
        <span>Hospitals</span>
      </NavLink>
      <NavLink to="/about" className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}>
        <Info size={20} />
        <span>About</span>
      </NavLink>
    </nav>
  )
}
