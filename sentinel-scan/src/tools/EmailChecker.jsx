import React, { useState } from 'react'
import { checkEmail } from '../api/abstract'
import ResultCard from '../components/ResultCard'

export default function EmailChecker(){
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!email) return setError('Please enter an email')
    try {
      setLoading(true)
      const data = await checkEmail(email)
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
      <h3 className="font-semibold">Email Checker</h3>
      <form className="mt-3 flex gap-3" onSubmit={submit}>
        <input
          className="flex-1 p-2 border rounded"
          placeholder="email@example.com"
          value={email}
          onChange={e=>setEmail(e.target.value)}
        />
        <button className="px-4 py-2 bg-slate-800 text-white rounded" type="submit" disabled={loading}>
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <ResultCard title="Email Result" data={result} />
    </div>
  )
}
