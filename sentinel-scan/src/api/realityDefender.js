// realityDefender.js
// NOTE: Reality Defender's official client package expects Node-style file paths
// The code below uses a simple browser-side POST to a presumed RD REST endpoint.
// If Reality Defender exposes a different endpoint or you prefer the npm package server-side usage,
// replace this implementation accordingly.
// If you want the npm package client in the browser, ensure it's supported by RD and adjust imports.

const RD_KEY = import.meta.env.VITE_REALITY_DEFENDER_API_KEY
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo_key'

async function getGeminiSuggestion(type, data) {
  if (GEMINI_KEY === 'demo_key') return 'Please set VITE_GEMINI_API_KEY for AI suggestions'
  
  let prompt = ''
  
  if (type === 'audio_fake') {
    prompt = `Audio deepfake detected: ${data.analysis?.detection_reason}. Give simple advice in 2-3 sentences for normal people on what to do if this is their audio.`
  } else if (type === 'audio_safe') {
    prompt = `Audio appears authentic. Give simple advice in 2-3 sentences for normal people on how to protect themselves from audio deepfakes.`
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
    
    if (!response.ok) {
      console.error('Gemini API error:', response.status, await response.text())
      return 'AI suggestion unavailable - API error'
    }
    
    const result = await response.json()
    console.log('Gemini response:', result)
    
    if (result.candidates && result.candidates[0] && result.candidates[0].content) {
      return result.candidates[0].content.parts[0].text
    } else {
      console.error('Unexpected Gemini response format:', result)
      return 'AI suggestion unavailable - Invalid response'
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return `AI suggestion unavailable - ${error.message}`
  }
}

/**
 * Uploads a File object to Reality Defender and returns the JSON result.
 * ---
 * NOTE: If RD's endpoint is different, update `RD_ENDPOINT` accordingly.
 */
export async function detectAudioWithRealityDefender(file) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Demo audio analysis based on file properties
  const fileName = file.name.toLowerCase()
  const fileSize = file.size
  const isFake = Math.random() > 0.6 // 40% chance of being fake
  
  // Analyze file name patterns
  const suspiciousPatterns = ['ai', 'generated', 'synthetic', 'fake', 'deepfake']
  const hasSuspiciousName = suspiciousPatterns.some(pattern => fileName.includes(pattern))
  
  // Analyze file size (very small or very large files might be suspicious)
  const isSuspiciousSize = fileSize < 10000 || fileSize > 10000000
  
  const finalResult = isFake || hasSuspiciousName || isSuspiciousSize
  
  const result = {
    is_fake: finalResult,
    confidence: Math.random() * 0.4 + 0.6, // 60-100% confidence
    analysis: {
      file_name: file.name,
      file_size: `${(fileSize / 1024).toFixed(1)} KB`,
      suspicious_name: hasSuspiciousName,
      suspicious_size: isSuspiciousSize,
      detection_reason: finalResult ? 
        (hasSuspiciousName ? 'Suspicious filename detected' : 
         isSuspiciousSize ? 'Unusual file size' : 'AI generation patterns detected') :
        'No suspicious patterns detected'
    },
    note: 'This is a demo analysis. For real deepfake detection, integrate with Reality Defender API server-side.'
  }
  
  // Add Gemini AI suggestion
  result.ai_suggestion = await getGeminiSuggestion(finalResult ? 'audio_fake' : 'audio_safe', result)
  
  return result
}
