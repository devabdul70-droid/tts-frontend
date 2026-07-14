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
            {/* Categorize voices by Locale */}
            {Object.entries(
              voices.reduce((acc, v) => {
                const locale = v.locale || 'Other'
                if (!acc[locale]) acc[locale] = []
                acc[locale].push(v)
                return acc
              }, {})
            )
              .sort(([a], [b]) => {
                // Pin ur-PK to top
                if (a === 'ur-PK') return -1
                if (b === 'ur-PK') return 1
                return a.localeCompare(b)
              })
              .map(([locale, group]) => (
                <optgroup key={locale} label={locale === 'ur-PK' ? 'Urdu (Recommended)' : locale}>
                  {group.map((v) => (
                    <option key={v.value} value={v.value}>
                      {(v.label || '').includes('Uzma') ? 'Uzma (Recommended)' : 
                       (v.label || '').includes('Asad') ? 'Asad (Male)' : 
                       (v.label || '').includes('Gul') ? 'Gul (Female)' :
                       (v.label || '').includes('Salman') ? 'Salman (Male)' : (v.label || v.value)}
                    </option>
                  ))}
                </optgroup>
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
