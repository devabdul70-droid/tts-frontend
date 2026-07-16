export default function TopBar({ status }) {
  return <header className="topbar">
    <div className="brand">
      <div className="brand-mark" aria-hidden="true"><span /></div>
      <div><div className="brand-text">Vocalis</div><div className="brand-sub">voice studio</div></div>
    </div>
    <div className="status"><div className={`status-dot ${status}`} /><span>{status === 'online' ? 'Ready' : status}</span></div>
  </header>
}
