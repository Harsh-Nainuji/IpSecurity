import axios from 'axios'

const EMAIL_KEY = import.meta.env.VITE_ABSTRACT_EMAIL_API_KEY || 'demo_key'
const IP_KEY = import.meta.env.VITE_ABSTRACT_IP_API_KEY || 'demo_key'
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo_key' // Add your Gemini API key here

export async function checkEmail(email) {
  if (EMAIL_KEY === 'demo_key') {
    return { error: 'Please set VITE_ABSTRACT_EMAIL_API_KEY in .env file' }
  }
  const url = `https://emailreputation.abstractapi.com/v1/?api_key=${EMAIL_KEY}&email=${encodeURIComponent(email)}`
  const resp = await axios.get(url)
  const data = resp.data
  
  if (data.deliverability === 'UNDELIVERABLE') {
    data.danger_details = {
      reason: data.reason || 'Email cannot be delivered',
      risk_level: 'HIGH',
      issues: ['Email address does not exist', 'Domain may be invalid', 'Could be a temporary bounce']
    }
    data.ai_suggestion = await getGeminiSuggestion('email', data)
  } else if (data.deliverability === 'DELIVERABLE') {
    data.ai_suggestion = await getGeminiSuggestion('email_safe', data)
  }
  
  return data
}

export async function checkIP(ip) {
  if (IP_KEY === 'demo_key') {
    return { error: 'Please set VITE_ABSTRACT_IP_API_KEY in .env file' }
  }
  const url = `https://ip-intelligence.abstractapi.com/v1/?api_key=${IP_KEY}&ip_address=${encodeURIComponent(ip)}`
  const resp = await axios.get(url)
  const data = resp.data
  
  if (data.threat_types && data.threat_types.length > 0) {
    data.danger_details = {
      reason: `IP flagged for: ${data.threat_types.join(', ')}`,
      risk_level: 'HIGH',
      issues: data.threat_types.map(threat => {
        const threats = {
          'malware': 'This IP is known for spreading malware',
          'phishing': 'This IP is used for phishing attacks',
          'botnet': 'This IP is part of a botnet',
          'spam': 'This IP sends spam emails',
          'suspicious': 'This IP shows suspicious activity'
        }
        return threats[threat] || `This IP is flagged for ${threat}`
      })
    }
    data.ai_suggestion = await getGeminiSuggestion('ip', data)
  } else {
    data.ai_suggestion = await getGeminiSuggestion('ip_safe', data)
  }
  
  return data
}

async function getGeminiSuggestion(type, data) {
  if (GEMINI_KEY === 'demo_key') return 'Please set VITE_GEMINI_API_KEY for AI suggestions'
  
  let prompt = ''
  
  if (type === 'email') {
    prompt = `Email security issue: ${data.danger_details?.reason}. Give simple advice in 2-3 sentences for normal people on what to do if this is their email.`
  } else if (type === 'email_safe') {
    prompt = `Email is safe and deliverable. Give simple advice in 2-3 sentences for normal people on how to keep their email secure.`
  } else if (type === 'ip') {
    prompt = `IP security issue: ${data.danger_details?.reason}. Give simple advice in 2-3 sentences for normal people on what to do if this is their IP address.`
  } else if (type === 'ip_safe') {
    prompt = `IP address appears safe. Give simple advice in 2-3 sentences for normal people on how to keep their network secure.`
  } else if (type === 'audio_fake') {
    prompt = `Audio deepfake detected: ${data.analysis?.detection_reason}. Give simple advice in 2-3 sentences for normal people on what to do if this is their audio.`
  } else if (type === 'audio_safe') {
    prompt = `Audio appears authentic. Give simple advice in 2-3 sentences for normal people on how to protect themselves from audio deepfakes.`
  }
  
  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    })
    return response.data.candidates[0].content.parts[0].text
  } catch (error) {
    return 'AI suggestion unavailable'
  }
}
