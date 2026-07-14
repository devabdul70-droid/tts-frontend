import { useState, useCallback, useEffect } from 'react'
import { fetchVoices, FALLBACK_VOICES } from '../api/ttsClient'

export function useVoices(apiBase) {
  const [voices, setVoices] = useState(() => 
    FALLBACK_VOICES.map(v => ({
      label: v,
      value: v,
      locale: v.substring(0, 5)
    }))
  )
  const [usingFallback, setUsingFallback] = useState(true)

  const refresh = useCallback(() => {
    fetchVoices(apiBase)
      .then((list) => {
        if (!Array.isArray(list)) throw new Error('Invalid voice list')
        
        // Map all voices into objects with label and value
        const allMapped = list.map((v) => {
          // Handle object or string from API
          const name = typeof v === 'string' ? v : (v.short_name || v.name || 'Unknown')
          const locale = typeof v === 'string' ? v.substring(0, 5) : (v.locale || 'Other')
          return {
            label: name,
            value: name,
            locale: locale,
          }
        })
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
