import React, { useState } from 'react'
import { detectAudioWithRealityDefender } from '../api/realityDefender'
import ResultCard from '../components/ResultCard'

export default function AudioChecker(){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onFile = (e) => {
    setFile(e.target.files?.[0] || null)
    setResult(null)
    setError(null)
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)
    if (!file) return setError('Please upload an audio file (.wav, .mp3)')
    try {
      setLoading(true)
      const data = await detectAudioWithRealityDefender(file)
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
      <h3 className="font-semibold">Audio Deepfake Checker</h3>
      <form className="mt-3" onSubmit={submit}>
        <input type="file" accept="audio/*" onChange={onFile} />
        <div className="mt-3">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">
            {loading ? 'Scanning...' : 'Scan Audio'}
          </button>
        </div>
      </form>

      {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
      <ResultCard title="Audio Scan Result" data={result} />
    </div>
  )
}
