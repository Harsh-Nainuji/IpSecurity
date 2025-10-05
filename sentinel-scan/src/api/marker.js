import axios from 'axios'

const MARKER_USERNAME = import.meta.env.VITE_MARKER_API_USERNAME || 'nexiscraft'
const MARKER_PASSWORD = import.meta.env.VITE_MARKER_API_PASSWORD || 'CqkbjtYwFJ'

/**
 * Search for trademarks using Marker API V2
 * @param {string} searchTerm - The trademark to search for (supports wildcards with *)
 * @param {string} status - 'active' or 'all' (default: 'active')
 * @param {number} start - Starting record number for pagination (default: 1)
 * @returns {Promise<Object>} - Trademark search results
 */
export async function searchTrademarks(searchTerm, status = 'active', start = 1) {
  if (MARKER_USERNAME === 'demo_username' || MARKER_PASSWORD === 'demo_password') {
    return {
      error: 'Please set VITE_MARKER_API_USERNAME and VITE_MARKER_API_PASSWORD in .env file',
      demo: true,
      trademarks: [
        {
          serialnumber: '12345678',
          wordmark: `Sample ${searchTerm} Trademark`,
          description: 'Sample trademark description for demonstration',
          code: '025',
          registrationdate: '2023-01-15',
          status: 'active',
          status_description: 'Active trademark registration'
        }
      ],
      count: 1,
      next: null
    }
  }

  // Try multiple API endpoint formats
  const endpoints = [
    // Format 1: Based on PHP example
    `/api/api/v2/trademarks/trademark/${encodeURIComponent(searchTerm)}/status/${status}/start/${start}/username/${encodeURIComponent(MARKER_USERNAME)}/password/${encodeURIComponent(MARKER_PASSWORD)}`,
    // Format 2: Based on documentation
    `/api/api/v2/trademarks/trademark/${encodeURIComponent(searchTerm)}/status/${status}/start/${start}/username/api ${encodeURIComponent(MARKER_USERNAME)}/password/api ${encodeURIComponent(MARKER_PASSWORD)}`
  ]

  for (const url of endpoints) {
    try {
      console.log('Trying API endpoint:', url)
      const response = await axios.get(url)

      if (response.data) {
        return response.data
      }
    } catch (error) {
      console.error('API endpoint failed:', url, error.message)
      if (error.response?.status === 404) {
        // Try next endpoint
        continue
      }
      throw error
    }
  }

  // If all endpoints fail, throw an error
  throw new Error('All API endpoints failed. Please check your credentials and API documentation.')
}

/**
 * Check trademark availability by searching for exact matches
 * @param {string} trademarkName - The trademark name to check
 * @returns {Promise<Object>} - Availability analysis with suggestions
 */
export async function checkTrademarkAvailability(trademarkName) {
  try {
    const results = await searchTrademarks(trademarkName, 'active', 1)

    if (results.error) {
      return results
    }

    // Filter for exact or very similar matches
    const exactMatches = results.trademarks?.filter(trademark =>
      (trademark.wordmark || trademark.trademark || '').toLowerCase() === trademarkName.toLowerCase()
    ) || []

    const similarMatches = results.trademarks?.filter(trademark => {
      const trademarkText = trademark.wordmark || trademark.trademark || ''
      return trademarkText.toLowerCase().includes(trademarkName.toLowerCase()) ||
             trademarkName.toLowerCase().includes(trademarkText.toLowerCase()) ||
             trademarkText.toLowerCase().replace(/\s+/g, '').includes(trademarkName.toLowerCase().replace(/\s+/g, '')) ||
             trademarkName.toLowerCase().replace(/\s+/g, '').includes(trademarkText.toLowerCase().replace(/\s+/g, ''))
    }) || []

    if (exactMatches.length > 0) {
      return {
        available: false,
        exact_matches: exactMatches,
        similar_matches: similarMatches,
        total_found: results.count || 0,
        risk_level: 'HIGH',
        suggestion: `The trademark "${trademarkName}" is already registered. Consider using a different name or consulting with a trademark attorney.`,
        ai_suggestion: await getGeminiSuggestion('trademark_unavailable', trademarkName, exactMatches)
      }
    } else if (similarMatches.length > 0) {
      return {
        available: false,
        exact_matches: [],
        similar_matches: similarMatches,
        total_found: results.count || 0,
        risk_level: 'MEDIUM',
        suggestion: `Similar trademarks found for "${trademarkName}". There may be trademark conflicts. Consider modifying your trademark or seeking legal advice.`,
        ai_suggestion: await getGeminiSuggestion('trademark_similar', trademarkName, similarMatches)
      }
    } else {
      return {
        available: true,
        exact_matches: [],
        similar_matches: [],
        total_found: 0,
        risk_level: 'LOW',
        suggestion: `No conflicting trademarks found for "${trademarkName}". However, this doesn't guarantee availability. Consider consulting a trademark attorney.`,
        ai_suggestion: await getGeminiSuggestion('trademark_available', trademarkName, [])
      }
    }
  } catch (error) {
    return {
      error: error.message,
      available: null,
      risk_level: 'UNKNOWN'
    }
  }
}

/**
 * Get AI suggestions for trademark results using Gemini API
 */
async function getGeminiSuggestion(type, trademarkName, matches) {
  const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'demo_key'

  if (GEMINI_KEY === 'demo_key') {
    return 'Please set VITE_GEMINI_API_KEY for AI suggestions'
  }

  let prompt = ''

  if (type === 'trademark_unavailable') {
    prompt = `The trademark "${trademarkName}" is already registered. Provide 2-3 sentences of advice for someone who wants to use this trademark, focusing on legal options and alternatives.`
  } else if (type === 'trademark_similar') {
    prompt = `Similar trademarks exist for "${trademarkName}". Give 2-3 sentences of advice about trademark conflicts and what steps to take next.`
  } else if (type === 'trademark_available') {
    prompt = `No conflicting trademarks found for "${trademarkName}". Provide 2-3 sentences of advice about next steps for trademark registration and protection.`
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
