// realityDefender.js
// NOTE: Reality Defender's official client package expects Node-style file paths
// The code below uses a simple browser-side POST to a presumed RD REST endpoint.
// If Reality Defender exposes a different endpoint or you prefer the npm package server-side usage,
// replace this implementation accordingly.
// If you want the npm package client in the browser, ensure it's supported by RD and adjust imports.

const RD_KEY = import.meta.env.VITE_REALITY_DEFENDER_API_KEY

/**
 * Uploads a File object to Reality Defender and returns the JSON result.
 * ---
 * NOTE: If RD's endpoint is different, update `RD_ENDPOINT` accordingly.
 */
export async function detectAudioWithRealityDefender(file) {
  // Replace this URL with the official RD endpoint if different:
  const RD_ENDPOINT = 'https://api.realitydefender.ai/v1/detect' // <-- update if RD uses different URL

  const form = new FormData()
  form.append('file', file)
  // sometimes provider expects additional fields; add them here if required:
  // form.append('type', 'audio')

  const resp = await fetch(RD_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RD_KEY}`,
      // do NOT set Content-Type; browser sets correct multipart boundary
    },
    body: form
  })

  if (!resp.ok) {
    const txt = await resp.text()
    throw new Error(`Reality Defender API error: ${resp.status} ${txt}`)
  }
  const json = await resp.json()
  return json
}
