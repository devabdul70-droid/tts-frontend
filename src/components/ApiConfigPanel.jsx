import { useState } from 'react'

export default function ApiConfigPanel({ apiBase, onConnect }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(apiBase)

  return (
    <div className="panel config-panel">
      <button
        className="config-toggle"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{open ? '\u25BE' : '\u25B8'}</span> API endpoint
      </button>
      {open && (
        <div className="config-row">
          <input
            type="text"
            value={draft}
            spellCheck={false}
            placeholder="https://your-app.onrender.com"
            onChange={(e) => setDraft(e.target.value)}
          />
          <button className="btn-ghost" onClick={() => onConnect(draft)}>
            Connect
          </button>
        </div>
      )}
    </div>
  )
}
