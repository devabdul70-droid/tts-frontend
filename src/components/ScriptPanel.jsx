import Fader from './Fader'
import { fmtPercent, fmtHz } from '../utils/format'

export default function ScriptPanel({ text, onTextChange, voice, onVoiceChange, voices, rate, onRateChange, pitch, onPitchChange, volume, onVolumeChange, onSynthesize, loading, errorMessage }) {
  const len = text.length
  const countClass = len > 5000 ? 'over' : len > 4000 ? 'warn' : ''
  const locales = { 'ur-PK': 'Urdu (Pakistan)', 'ur-IN': 'Urdu (India)', 'hi-IN': 'Hindi (India)', 'bn-BD': 'Bangla (Bangladesh)', 'ar-SA': 'Arabic (Saudi Arabia)', 'en-US': 'English (US)', 'en-GB': 'English (UK)' }
  const displayName = (name) => {
    if (name.includes('Uzma')) return 'Uzma · Urdu female'
    if (name.includes('Asad')) return 'Asad · Urdu male'
    return name.replace(/^[a-z]{2}-[A-Z]{2}-/, '').replace(/Neural/g, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim()
  }
  return <section className="panel script-panel" aria-labelledby="script-title">
    <div className="panel-heading"><div><p className="step">01 &mdash; Write</p><h2 id="script-title">Your script</h2></div><button className="text-btn" type="button" onClick={() => onTextChange('Welcome to Vocalis. Your ideas deserve a voice that feels as clear and human as they sound in your head.')}>Try an example</button></div>
    <div className="editor-wrap"><textarea value={text} maxLength={5000} placeholder="Start writing what you want to hear..." onChange={(e) => onTextChange(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onSynthesize() }} aria-label="Speech script" /><div className={`char-count ${countClass}`}>{len.toLocaleString()} / 5,000</div></div>
    <div className="voice-settings"><div className="settings-intro"><p className="step">02 &mdash; Shape</p><span>Voice settings</span></div><div className="controls-grid">
      <div className="control voice-control"><label className="control-label" htmlFor="voiceSelect">Voice</label><select id="voiceSelect" value={voice} onChange={(e) => onVoiceChange(e.target.value)}>{Object.entries(voices.reduce((acc, v) => { const locale = v.locale || 'Other'; (acc[locale] ||= []).push(v); return acc }, {})).sort(([a], [b]) => a.localeCompare(b)).map(([locale, group]) => <optgroup key={locale} label={locales[locale] || locale}>{group.map((v) => <option key={v.value} value={v.value}>{displayName(v.label || v.value)}</option>)}</optgroup>)}</select></div>
      <Fader label="Rate" value={rate} formattedValue={fmtPercent(rate)} min={-50} max={50} onChange={onRateChange} />
      <Fader label="Pitch" value={pitch} formattedValue={fmtHz(pitch)} min={-20} max={20} onChange={onPitchChange} />
      <Fader label="Volume" value={volume} formattedValue={fmtPercent(volume)} min={-50} max={50} onChange={onVolumeChange} />
    </div></div>
    <button className="synth-btn" disabled={loading} onClick={onSynthesize}><span className="synth-icon">{loading ? '...' : '✦'}</span>{loading ? 'Creating your audio…' : 'Generate audio'}</button>
    <p className="shortcut">Press <kbd>Ctrl</kbd> <span>+</span> <kbd>Enter</kbd> to generate</p>
    {errorMessage && <div className="fault"><span className="fault-title">Something needs attention</span><span>{errorMessage}</span></div>}
  </section>
}
