export function fmtPercent(n) {
  return (n >= 0 ? '+' : '') + n + '%'
}

export function fmtHz(n) {
  return (n >= 0 ? '+' : '') + n + 'Hz'
}

export function fmtTime(seconds) {
  if (!isFinite(seconds)) return '00:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
}
