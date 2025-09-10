import React from 'react'

export default function ResultCard({ title, data }) {
  if (!data) return null

  const getEmailStatus = (data) => {
    if (data.error) return { status: 'error', message: data.error }
    
    // Check for Abstract API response format
    if (data.email_address) {
      const deliverability = data.email_deliverability
      const risk = data.email_risk
      const quality = data.email_quality
      
      // Check if email is deliverable
      if (deliverability?.status === 'deliverable') {
        const riskLevel = risk?.address_risk_status === 'high' ? 'HIGH' : 
                         risk?.address_risk_status === 'medium' ? 'MEDIUM' : 'LOW'
        
        return { 
          status: 'safe', 
          message: 'Email is safe and deliverable',
          details: {
            risk_level: riskLevel,
            reason: 'Email address is valid and can receive messages',
            issues: [
              `Format valid: ${deliverability.is_format_valid ? 'Yes' : 'No'}`,
              `SMTP valid: ${deliverability.is_smtp_valid ? 'Yes' : 'No'}`,
              `MX valid: ${deliverability.is_mx_valid ? 'Yes' : 'No'}`,
              `Free email: ${quality.is_free_email ? 'Yes' : 'No'}`,
              `Disposable: ${quality.is_disposable ? 'Yes' : 'No'}`
            ]
          },
          suggestion: data.ai_suggestion
        }
      }
      
      // Check if email is undeliverable
      if (deliverability?.status === 'undeliverable') {
        return { 
          status: 'danger', 
          message: 'Email is undeliverable',
          details: {
            risk_level: 'HIGH',
            reason: 'Email cannot be delivered',
            issues: [
              `Status: ${deliverability.status_detail}`,
              `Format valid: ${deliverability.is_format_valid ? 'Yes' : 'No'}`,
              `SMTP valid: ${deliverability.is_smtp_valid ? 'Yes' : 'No'}`,
              `MX valid: ${deliverability.is_mx_valid ? 'Yes' : 'No'}`
            ]
          },
          suggestion: data.ai_suggestion
        }
      }
      
      // Show what we know
      return { 
        status: 'info', 
        message: `Email analysis completed for ${data.email_address}`,
        details: {
          risk_level: 'MEDIUM',
          reason: 'Email validation completed with mixed results',
          issues: [
            `Status: ${deliverability?.status || 'Unknown'}`,
            `Format valid: ${deliverability?.is_format_valid ? 'Yes' : 'No'}`,
            `Domain: ${data.email_domain?.domain || 'Unknown'}`,
            `Risk: ${risk?.address_risk_status || 'Unknown'}`
          ]
        },
        suggestion: data.ai_suggestion
      }
    }
    
    return { 
      status: 'warning', 
      message: 'Email validation failed',
      details: {
        risk_level: 'UNKNOWN',
        reason: 'No email data received',
        issues: ['API response empty', 'Check email format', 'Try again later']
      }
    }
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
    return { 
      status: 'safe', 
      message: 'IP appears safe',
      details: {
        risk_level: 'LOW',
        reason: 'No security threats detected for this IP address',
        issues: ['No malware detected', 'No phishing activity', 'No botnet involvement', 'Clean reputation']
      },
      suggestion: data.ai_suggestion
    }
  }

  const getAudioStatus = (data) => {
    if (data.error) return { status: 'error', message: data.error }
    if (data.is_fake) {
      return { 
        status: 'danger', 
        message: 'Audio is likely AI-generated/deepfake',
        details: {
          risk_level: 'HIGH',
          reason: 'Audio shows signs of artificial generation',
          issues: ['Voice synthesis detected', 'Artificial speech patterns', 'Potential deepfake technology']
        },
        suggestion: data.ai_suggestion
      }
    }
    return { 
      status: 'safe', 
      message: 'Audio appears authentic',
      details: {
        risk_level: 'LOW',
        reason: 'No signs of artificial generation detected',
        issues: ['Natural speech patterns', 'No synthesis detected', 'Authentic human voice']
      },
      suggestion: data.ai_suggestion
    }
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
    <div className="p-4 mt-6 bg-white rounded shadow">
      <div className={`p-3 rounded ${statusColors[status.status]}`}>
        <h4 className="font-medium">{title}</h4>
        <p className="mt-1 text-sm">{status.message}</p>
        
        {status.details && (
          <div className={`mt-3 p-2 rounded ${
            status.status === 'danger' ? 'bg-red-100' : 
            status.status === 'safe' ? 'bg-green-100' : 
            'bg-blue-100'
          }`}>
            <p className={`text-xs font-medium ${
              status.status === 'danger' ? 'text-red-800' : 
              status.status === 'safe' ? 'text-green-800' : 
              'text-blue-800'
            }`}>Risk Level: {status.details.risk_level}</p>
            <p className={`text-xs mt-1 ${
              status.status === 'danger' ? 'text-red-700' : 
              status.status === 'safe' ? 'text-green-700' : 
              'text-blue-700'
            }`}>{status.details.reason}</p>
            <ul className={`text-xs mt-2 list-disc list-inside ${
              status.status === 'danger' ? 'text-red-600' : 
              status.status === 'safe' ? 'text-green-600' : 
              'text-blue-600'
            }`}>
              {status.details.issues.map((issue, i) => <li key={i}>{issue}</li>)}
            </ul>
          </div>
        )}
        
        {status.suggestion && (
          <div className="p-2 mt-3 rounded bg-blue-50">
            <p className="text-xs font-medium text-blue-800">AI Suggestion:</p>
            <p className="mt-1 text-xs text-blue-700">{status.suggestion}</p>
          </div>
        )}
      </div>
    </div>
  )
}
