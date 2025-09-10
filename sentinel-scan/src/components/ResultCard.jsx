import React from 'react'

export default function ResultCard({ title, data }) {
  if (!data) return null

  const getEmailStatus = (data) => {
    if (data.error) return { status: 'error', message: data.error }
    if (data.deliverability === 'DELIVERABLE') return { status: 'safe', message: 'Email is safe and deliverable' }
    if (data.deliverability === 'UNDELIVERABLE') {
      return { 
        status: 'danger', 
        message: 'Email is dangerous/undeliverable',
        details: data.danger_details,
        suggestion: data.ai_suggestion
      }
    }
    return { status: 'warning', message: 'Email status unclear' }
  }

  const getIPStatus = (data) => {
    if (data.error) return { status: 'error', message: data.error }
    if (data.threat_types && data.threat_types.length > 0) {
      return { 
        status: 'danger', 
        message: `Dangerous IP - Threats: ${data.threat_types.join(', ')}`,
        details: data.danger_details,
        suggestion: data.ai_suggestion
      }
    }
    return { status: 'safe', message: 'IP appears safe' }
  }

  const getAudioStatus = (data) => {
    if (data.error) return { status: 'error', message: data.error }
    if (data.is_fake) return { status: 'danger', message: 'Audio is likely AI-generated/deepfake' }
    return { status: 'safe', message: 'Audio appears authentic' }
  }

  const getStatus = () => {
    if (title.includes('Email')) return getEmailStatus(data)
    if (title.includes('IP')) return getIPStatus(data)
    if (title.includes('Audio')) return getAudioStatus(data)
    return { status: 'info', message: 'Result received' }
  }

  const status = getStatus()
  const statusColors = {
    safe: 'text-green-600 bg-green-50',
    danger: 'text-red-600 bg-red-50',
    warning: 'text-yellow-600 bg-yellow-50',
    error: 'text-red-600 bg-red-50',
    info: 'text-blue-600 bg-blue-50'
  }

  return (
    <div className="mt-6 bg-white p-4 rounded shadow">
      <div className={`p-3 rounded ${statusColors[status.status]}`}>
        <h4 className="font-medium">{title}</h4>
        <p className="text-sm mt-1">{status.message}</p>
        
        {status.details && (
          <div className="mt-3 p-2 bg-red-100 rounded">
            <p className="text-xs font-medium text-red-800">Risk Level: {status.details.risk_level}</p>
            <p className="text-xs text-red-700 mt-1">{status.details.reason}</p>
            <ul className="text-xs text-red-600 mt-2 list-disc list-inside">
              {status.details.issues.map((issue, i) => <li key={i}>{issue}</li>)}
            </ul>
          </div>
        )}
        
        {status.suggestion && (
          <div className="mt-3 p-2 bg-blue-50 rounded">
            <p className="text-xs font-medium text-blue-800">AI Suggestion:</p>
            <p className="text-xs text-blue-700 mt-1">{status.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  )
}
