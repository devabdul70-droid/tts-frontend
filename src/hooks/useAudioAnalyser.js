import { useRef, useCallback } from 'react'

/**
 * Lazily builds a MediaElementSource -> AnalyserNode -> destination graph
 * for the given <audio> element ref. Must be created after a user gesture
 * (browsers block AudioContext creation otherwise), so call ensureGraph()
 * from a 'play' event handler.
 */
export function useAudioAnalyser(audioRef) {
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const dataArrayRef = useRef(null)

  const ensureGraph = useCallback(() => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume()
      return
    }
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext
      const ctx = new AudioContextClass()
      const source = ctx.createMediaElementSource(audioRef.current)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      source.connect(analyser)
      analyser.connect(ctx.destination)

      audioCtxRef.current = ctx
      analyserRef.current = analyser
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount)
    } catch {
      // Web Audio unavailable — waveform will fall back to idle animation only
      analyserRef.current = null
    }
  }, [audioRef])

  return { analyserRef, dataArrayRef, ensureGraph }
}
