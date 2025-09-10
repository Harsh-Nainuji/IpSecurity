import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home(){
  const nav = useNavigate()
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold mb-4">SentinelScan</h1>
      <p className="text-lg text-slate-600 mb-6">Quick checks for Email reputation, IP intelligence, and Audio deepfake detection.</p>
      <div className="space-x-3">
        <button onClick={() => nav('/dashboard')} className="px-6 py-3 bg-slate-800 text-white rounded">Start Scanning</button>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold">Email Checker</h3>
          <p className="text-sm text-slate-600 mt-2">Validate email and check reputation via Abstract.</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold">IP Checker</h3>
          <p className="text-sm text-slate-600 mt-2">Geolocation, ASN, and reputation via Abstract.</p>
        </div>
        <div className="p-6 bg-white rounded shadow">
          <h3 className="font-semibold">Audio Checker</h3>
          <p className="text-sm text-slate-600 mt-2">Upload audio to Reality Defender for deepfake detection.</p>
        </div>
      </div>
    </div>
  )
}
