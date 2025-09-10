import React from 'react'

export default function ToolCard({ title, desc, onClick }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow hover:shadow-lg transition">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-600 mb-4">{desc}</p>
      <button onClick={onClick} className="px-4 py-2 bg-slate-800 text-white rounded">Open</button>
    </div>
  )
}
