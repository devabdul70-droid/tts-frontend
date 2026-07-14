export class ApiError extends Error {
  constructor(status, body) {
    super(`API error ${status}`)
    this.status = status
    this.body = body
  }
}

export const FALLBACK_VOICES = [
  'ur-PK-UzmaNeural',
  'ur-PK-AsadNeural',
  'ur-IN-GulNeural',
  'ur-IN-SalmanNeural',
  'hi-IN-SwaraNeural',
  'hi-IN-MadhurNeural',
  'bn-IN-TanishaNeural',
  'bn-BD-NabanitaNeural',
  'zh-CN-XiaoxiaoNeural',
  'ja-JP-NanamiNeural',
  'ko-KR-SunHiNeural',
  'en-US-AvaNeural',
  'en-US-GuyNeural',
  'en-GB-SoniaNeural',
]

function normalizeBase(apiBase) {
  return apiBase.trim().replace(/\/$/, '')
}

export async function checkHealth(apiBase) {
  const res = await fetch(`${normalizeBase(apiBase)}/health`)
  if (!res.ok) throw new Error('unhealthy')
  return res.json()
}

export async function fetchVoices(apiBase) {
  const res = await fetch(`${normalizeBase(apiBase)}/api/v1/voices`)
  if (!res.ok) throw new Error('failed to load voices')
  const voices = await res.json()
  if (!Array.isArray(voices) || voices.length === 0) throw new Error('empty voice list')
  return voices
}

export async function synthesize(apiBase, payload) {
  const res = await fetch(`${normalizeBase(apiBase)}/api/v1/tts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let body = {}
    try {
      body = await res.json()
    } catch {
      // response wasn't JSON — leave body empty
    }
    throw new ApiError(res.status, body)
  }

  return res.blob()
}
