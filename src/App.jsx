import { useState, useRef, useEffect, useCallback } from 'react'
import TopBar from './components/TopBar'
import ScriptPanel from './components/ScriptPanel'
import PlaybackPanel from './components/PlaybackPanel'
import { useHealthStatus } from './hooks/useHealthStatus'
import { useVoices } from './hooks/useVoices'
import { useAudioAnalyser } from './hooks/useAudioAnalyser'
import { synthesize, ApiError } from './api/ttsClient'
import { fmtPercent, fmtHz } from './utils/format'

const DEFAULT_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://your-app.onrender.com'

export default function App() {
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE)
  const { status, setStatus, refresh: refreshHealth } = useHealthStatus(apiBase)
  const { voices, refresh: refreshVoices } = useVoices(apiBase)
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('en-US-AvaNeural')
  const [rate, setRate] = useState(-10)
  const [pitch, setPitch] = useState(0)
  const [volume, setVolume] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [hasAudio, setHasAudio] = useState(false)
  const audioRef = useRef(null)
  const blobUrlRef = useRef(null)
  const { analyserRef, dataArrayRef, ensureGraph } = useAudioAnalyser(audioRef)

  useEffect(() => { if (voices.length && !voices.some(v => v.value === voice)) setVoice(voices[0].value) }, [voices, voice])
  useEffect(() => { refreshHealth(); refreshVoices() }, [apiBase, refreshHealth, refreshVoices])

  const handleSynthesize = useCallback(() => {
    const trimmed = text.trim()
    setErrorMessage('')
    if (!trimmed) return setErrorMessage('The script is empty. Type something for the voice to say.')
    if (trimmed.length > 5000) return setErrorMessage('Script is over the 5,000 character limit — trim it down and try again.')
    setLoading(true)
    synthesize(apiBase, { text: trimmed, voice, rate: fmtPercent(rate), pitch: fmtHz(pitch), volume: fmtPercent(volume) })
      .then((blob) => {
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url
        audioRef.current.src = url
        setHasAudio(true)
        setStatus('online')
      })
      .catch((err) => {
        if (err instanceof ApiError) {
          if (err.status === 400) setErrorMessage("That voice isn't recognized. Pick another one and retry.")
          else if (err.status === 422) { const first = err.body?.errors?.[0]; setErrorMessage(`Input rejected — ${first ? `${first.field}: ${first.message}` : 'check your input values.'}`) }
          else if (err.status === 504) setErrorMessage('Synthesis timed out upstream. Try a shorter script or try again.')
          else setErrorMessage(`The synthesis engine failed (status ${err.status}). Try again in a moment.`)
          setStatus('online')
        } else { setErrorMessage("Can't reach the synthesis engine — confirm the backend is running."); setStatus('offline') }
      }).finally(() => setLoading(false))
  }, [text, voice, rate, pitch, volume, apiBase, setStatus])

  function handleTogglePlay() { const audio = audioRef.current; if (audio.paused) audio.play(); else audio.pause() }
  function handleDownload() { if (!blobUrlRef.current) return; const a = document.createElement('a'); a.href = blobUrlRef.current; a.download = 'speech.mp3'; document.body.appendChild(a); a.click(); document.body.removeChild(a) }

  return <div className="console">
    <TopBar status={status} />
    <main>
      <section className="hero" aria-labelledby="page-title">
        <div className="eyebrow"><span /> AI voice workspace</div>
        <h1 id="page-title">Turn your words into <em>natural speech.</em></h1>
        <p>Write a script, shape the voice, then create a studio-ready audio file in seconds.</p>
      </section>
      <div className="workspace">
        <ScriptPanel text={text} onTextChange={setText} voice={voice} onVoiceChange={setVoice} voices={voices} rate={rate} onRateChange={setRate} pitch={pitch} onPitchChange={setPitch} volume={volume} onVolumeChange={setVolume} onSynthesize={handleSynthesize} loading={loading} errorMessage={errorMessage} />
        <PlaybackPanel audioRef={audioRef} analyserRef={analyserRef} dataArrayRef={dataArrayRef} hasAudio={hasAudio} playing={playing} currentTime={currentTime} duration={duration} onTogglePlay={handleTogglePlay} onDownload={handleDownload} />
      </div>
    </main>
    <audio ref={audioRef} preload="auto" style={{ display: 'none' }} onPlay={() => { ensureGraph(); setPlaying(true) }} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)} onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)} />
    <footer>Private by design &middot; powered by your own edge-tts backend</footer>
  </div>
}
