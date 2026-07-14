import Waveform from './Waveform'
import { fmtTime } from '../utils/format'

const ICON_PLAY = (
  <svg viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
)
const ICON_PAUSE = (
  <svg viewBox="0 0 24 24">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
)

export default function PlaybackPanel({
  audioRef,
  analyserRef,
  dataArrayRef,
  hasAudio,
  playing,
  currentTime,
  duration,
  onTogglePlay,
  onDownload,
}) {
  return (
    <div className="panel playback-panel">
      <p className="panel-label">
        Output <span>{duration ? `— ${fmtTime(duration)}` : ''}</span>
      </p>
      <Waveform audioRef={audioRef} analyserRef={analyserRef} dataArrayRef={dataArrayRef} />
      <div className="transport">
        <button
          className="transport-btn"
          disabled={!hasAudio}
          onClick={onTogglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? ICON_PAUSE : ICON_PLAY}
        </button>
        <span className="time-readout">
          {fmtTime(currentTime)} / {fmtTime(duration)}
        </span>
        <button className="download-btn" disabled={!hasAudio} onClick={onDownload}>
          &#8595; Download MP3
        </button>
      </div>
    </div>
  )
}
