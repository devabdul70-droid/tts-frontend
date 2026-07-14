import { useState, useCallback, useEffect } from 'react'
import { fetchVoices, FALLBACK_VOICES } from '../api/ttsClient'

export function useVoices(apiBase) {
  const [voices, setVoices] = useState(FALLBACK_VOICES)
  const [usingFallback, setUsingFallback] = useState(true)

  const refresh = useCallback(() => {
    fetchVoices(apiBase)
      .then((list) => {
        const englishOnly = list.filter((v) => v.locale?.startsWith('en-'))
        const chosen = (englishOnly.length ? englishOnly : list).slice(0, 60)
        setVoices(chosen.map((v) => v.short_name))
        setUsingFallback(false)
      })
      .catch(() => {
        setVoices(FALLBACK_VOICES)
        setUsingFallback(true)
      })
  }, [apiBase])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { voices, usingFallback, refresh }
}
