import { useRef, useEffect } from 'react'

export default function Waveform({ audioRef, analyserRef, dataArrayRef }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx2d = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1

    function resize() {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    resize()
    window.addEventListener('resize', resize)

    function drawIdle(t) {
      const w = canvas.width
      const h = canvas.height
      ctx2d.clearRect(0, 0, w, h)
      ctx2d.strokeStyle = '#3A424A'
      ctx2d.lineWidth = 1.5 * dpr
      ctx2d.beginPath()
      const midY = h / 2
      for (let x = 0; x <= w; x += 4 * dpr) {
        const y = midY + Math.sin(x * 0.02 + t * 0.001) * 2 * dpr
        if (x === 0) ctx2d.moveTo(x, y)
        else ctx2d.lineTo(x, y)
      }
      ctx2d.stroke()
    }

    function drawActive() {
      const analyser = analyserRef.current
      const dataArray = dataArrayRef.current
      const w = canvas.width
      const h = canvas.height
      analyser.getByteFrequencyData(dataArray)
      ctx2d.clearRect(0, 0, w, h)
      const barCount = dataArray.length
      const barWidth = w / barCount
      for (let i = 0; i < barCount; i++) {
        const v = dataArray[i] / 255
        const barH = Math.max(2 * dpr, v * h * 0.9)
        const x = i * barWidth
        const y = (h - barH) / 2
        ctx2d.fillStyle = i % 5 === 0 ? '#FF9F1C' : '#4ECDC4'
        ctx2d.globalAlpha = 0.85
        ctx2d.fillRect(x, y, Math.max(1, barWidth - 2 * dpr), barH)
      }
      ctx2d.globalAlpha = 1
    }

    let rafId
    function loop(t) {
      const audio = audioRef.current
      if (analyserRef.current && audio && !audio.paused && !audio.ended) {
        drawActive()
      } else {
        drawIdle(t)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [audioRef, analyserRef, dataArrayRef])

  return <canvas ref={canvasRef} className="wave" />
}
