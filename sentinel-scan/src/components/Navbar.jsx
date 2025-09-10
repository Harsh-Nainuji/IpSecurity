import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar(){
  const loc = useLocation()
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-slate-900">SentinelScan</Link>
        <div className="flex items-center gap-4">
          <Link to="/" className={`py-2 px-3 rounded ${loc.pathname==='/' ? 'bg-slate-100' : ''}`}>Home</Link>
          <Link to="/dashboard" className={`py-2 px-3 rounded ${loc.pathname==='/dashboard' ? 'bg-slate-100' : ''}`}>Dashboard</Link>
        </div>
      </div>
    </nav>
  )
}
