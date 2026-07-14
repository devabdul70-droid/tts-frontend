import { useState, useCallback, useEffect } from 'react'
import { fetchVoices, FALLBACK_VOICES } from '../api/ttsClient'

export function useVoices(apiBase) {
  const [voices, setVoices] = useState(FALLBACK_VOICES)
  const [usingFallback, setUsingFallback] = useState(true)

  const refresh = useCallback(() => {
    fetchVoices(apiBase)
      .then((list) => {
        // Map all voices into objects with label and value
        const allMapped = list.map((v) => ({
          label: v.short_name,
          value: v.short_name,
          locale: v.locale,
        }))
        setVoices(allMapped)
        setUsingFallback(false)
      })
      .catch(() => {
        const fallbacks = FALLBACK_VOICES.map((v) => ({
          label: v,
          value: v,
          locale: v.substring(0, 5),
        }))
        setVoices(fallbacks)
        setUsingFallback(true)
      })
  }, [apiBase])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { voices, usingFallback, refresh }
}
