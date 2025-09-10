import React, { useState } from 'react'
import { checkIP } from '../api/abstract'
import ResultCard from '../components/ResultCard'

export default function IPChecker(){
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!ip) return setError('Please enter an IP address')
    try {
      setLoading(true)
      const data = await checkIP(ip)
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
      <h3 className="font-semibold">IP Checker</h3>
      <form className="mt-3 flex gap-3" onSubmit={submit}>
        <input
          className="flex-1 p-2 border rounded"
          placeholder="8.8.8.8"
          value={ip}
          onChange={e=>setIp(e.target.value)}
        />
        <button className="px-4 py-2 bg-slate-800 text-white rounded" type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <ResultCard title="IP Result" data={result} />
    </div>
  )
}
