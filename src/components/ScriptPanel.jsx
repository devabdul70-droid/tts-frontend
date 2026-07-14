import Fader from './Fader'
import { fmtPercent, fmtHz } from '../utils/format'

export default function ScriptPanel({
  text,
  onTextChange,
  voice,
  onVoiceChange,
  voices,
  rate,
  onRateChange,
  pitch,
  onPitchChange,
  volume,
  onVolumeChange,
  onSynthesize,
  loading,
  errorMessage,
}) {
  const len = text.length
  const countClass = len > 5000 ? 'over' : len > 4000 ? 'warn' : ''

  function handleKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onSynthesize()
  }

  return (
    <div className="panel">
      <p className="panel-label">Script</p>
      <textarea
        value={text}
        maxLength={5000}
        placeholder="Type or paste what you want the voice to say…"
        onChange={(e) => onTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className={`char-count ${countClass}`}>{len} / 5000</div>

      <div className="controls-grid">
        <div className="control">
          <label className="control-label" htmlFor="voiceSelect">
            Voice
          </label>
          <select id="voiceSelect" value={voice} onChange={(e) => onVoiceChange(e.target.value)}>
            {voices.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <Fader
          label="Rate"
          value={rate}
          formattedValue={fmtPercent(rate)}
          min={-50}
          max={50}
          onChange={onRateChange}
        />
        <Fader
          label="Pitch"
          value={pitch}
          formattedValue={fmtHz(pitch)}
          min={-20}
          max={20}
          onChange={onPitchChange}
        />
        <Fader
          label="Volume"
          value={volume}
          formattedValue={fmtPercent(volume)}
          min={-50}
          max={50}
          onChange={onVolumeChange}
        />
      </div>

      <button className="synth-btn" disabled={loading} onClick={onSynthesize}>
        {loading ? 'Processing…' : 'Synthesize'}
      </button>

      {errorMessage && (
        <div className="fault show">
          <span className="fault-title">Signal fault</span>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
