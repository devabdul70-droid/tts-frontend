import { useState, useCallback, useEffect } from 'react'
import { checkHealth } from '../api/ttsClient'

export function useHealthStatus(apiBase) {
  const [status, setStatus] = useState('checking') // 'checking' | 'online' | 'offline'

  const refresh = useCallback(() => {
    setStatus('checking')
    checkHealth(apiBase)
      .then(() => setStatus('online'))
      .catch(() => setStatus('offline'))
  }, [apiBase])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { status, setStatus, refresh }
}
