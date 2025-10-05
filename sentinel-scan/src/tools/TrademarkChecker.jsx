import React, { useState } from 'react'
import { checkTrademarkAvailability } from '../api/marker'
import ResultCard from '../components/ResultCard'

export default function TrademarkChecker() {
  const [trademark, setTrademark] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!trademark.trim()) {
      return setError('Please enter a trademark name')
    }

    // Basic validation for trademark name
    if (trademark.length < 2) {
      return setError('Trademark name must be at least 2 characters long')
    }

    try {
      setLoading(true)
      const data = await checkTrademarkAvailability(trademark.trim())
      setResult(data)
    } catch (err) {
      console.error(err)
      setError(err.message || 'API error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <h3 className="font-semibold">Trademark Availability Checker</h3>
      <p className="text-sm text-slate-600 mt-1 mb-4">
        Check if a trademark is available for registration using the Marker API
      </p>

      <form className="mt-3 flex gap-3" onSubmit={submit}>
        <input
          className="flex-1 p-2 border rounded"
          placeholder="Enter trademark name (e.g., TechCorp)"
          value={trademark}
          onChange={e => setTrademark(e.target.value)}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-slate-800 text-white rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Checking...' : 'Check Availability'}
        </button>
      </form>

      {error && (
        <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <ResultCard title="Trademark Check Result" data={{...result, trademark}} />
    </div>
  )
}
