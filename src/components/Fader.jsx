export default function Fader({ label, value, formattedValue, min, max, onChange }) {
  return (
    <div className="control">
      <label className="control-label">
        {label} <span className="value">{formattedValue}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
      />
    </div>
  )
}
