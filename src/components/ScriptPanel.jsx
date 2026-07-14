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
                // Pin priority regions to top
                if (a === 'ur-PK') return -1
                if (b === 'ur-PK') return 1
                if (a === 'hi-IN') return -0.5
                if (b === 'hi-IN') return 0.5
                return a.localeCompare(b)
              })
              .map(([locale, group]) => {
                const localeLabels = {
                  'ur-PK': 'Urdu (Pakistan)',
                  'ur-IN': 'Urdu (India)',
                  'hi-IN': 'Hindi (India)',
                  'bn-BD': 'Bangla (Bangladesh)',
                  'bn-IN': 'Bangla (India)',
                  'ar-SA': 'Arabic (Saudi Arabia)',
                  'ar-AE': 'Arabic (UAE)',
                  'tr-TR': 'Turkish',
                  'id-ID': 'Indonesian',
                  'ms-MY': 'Malay',
                  'fa-IR': 'Persian (Iran)',
                  'en-US': 'English (US)',
                  'en-GB': 'English (UK)',
                }
                
                return (
                  <optgroup key={locale} label={localeLabels[locale] || locale}>
                    {group.map((v) => {
                      const name = v.label || v.value || ''
                      let label = name
                      
                      // Clean up Neural/ShortName strings for normal users
                      label = label.replace(/en-US-|ur-PK-|hi-IN-|bn-BD-|ar-SA-|tr-TR-|id-ID-|ms-MY-|fa-IR-|Neural/g, '')
                      
                      if (name.includes('Uzma')) label = 'Uzma (Best for Urdu)'
                      else if (name.includes('Asad')) label = 'Asad (Male)'
                      else if (name.includes('Gul')) label = 'Gul (Female)'
                      else if (name.includes('Salman')) label = 'Salman (Male)'
                      else if (name.includes('Swara')) label = 'Swara (Female)'
                      else if (name.includes('Madhur')) label = 'Madhur (Male)'
                      else if (name.includes('Nabanita')) label = 'Nabanita (Female)'
                      else if (name.includes('Tanisha')) label = 'Tanisha (Female)'
                      else if (name.includes('Zariyah')) label = 'Zariyah (Female)'
                      else if (name.includes('Fatima')) label = 'Fatima (Female)'
                      else if (name.includes('Emel')) label = 'Emel (Female)'
                      else if (name.includes('Gadis')) label = 'Gadis (Female)'
                      else if (name.includes('Yasmin')) label = 'Yasmin (Female)'
                      else if (name.includes('Dilara')) label = 'Dilara (Female)'
                      
                      return (
                        <option key={v.value} value={v.value}>
                          {label}
                        </option>
                      )
                    })}
                  </optgroup>
                )
              })}
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
