export default function TopBar({ status }) {
  return (
    <div className="topbar">
      <div className="brand">
        <div className="rec-dot" aria-hidden="true" />
        <div>
          <div className="brand-text">TTS Console</div>
          <div className="brand-sub">edge-tts synthesis engine</div>
        </div>
      </div>
      <div className="status">
        <div className={`status-dot ${status}`} />
        <span>{status}</span>
      </div>
    </div>
  )
}
