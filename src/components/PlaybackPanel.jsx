import Waveform from './Waveform'
import { fmtTime } from '../utils/format'
const ICON_PLAY = <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
const ICON_PAUSE = <svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
export default function PlaybackPanel({ audioRef, analyserRef, dataArrayRef, hasAudio, playing, currentTime, duration, onTogglePlay, onDownload }) {
  return <section className="panel playback-panel" aria-labelledby="output-title">
    <div className="panel-heading"><div><p className="step">03 &mdash; Listen</p><h2 id="output-title">Your audio</h2></div><span className={`output-status ${hasAudio ? 'is-ready' : ''}`}>{hasAudio ? 'Ready to play' : 'Waiting for script'}</span></div>
    <Waveform audioRef={audioRef} analyserRef={analyserRef} dataArrayRef={dataArrayRef} />
    <div className="transport"><button className="transport-btn" disabled={!hasAudio} onClick={onTogglePlay} aria-label={playing ? 'Pause' : 'Play'}>{playing ? ICON_PAUSE : ICON_PLAY}</button><span className="time-readout">{fmtTime(currentTime)} <i>/</i> {fmtTime(duration)}</span><button className="download-btn" disabled={!hasAudio} onClick={onDownload}>↓ <span>Download MP3</span></button></div>
  </section>
}
