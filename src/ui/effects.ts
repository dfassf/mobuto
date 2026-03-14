import confetti from 'canvas-confetti'

export function fireConfetti(element?: HTMLElement | null) {
  if (!element) {
    confetti({ particleCount: 60, spread: 55, origin: { y: 0.7 } })
    return
  }

  const rect = element.getBoundingClientRect()
  const x = (rect.left + rect.width / 2) / window.innerWidth
  const y = (rect.top + rect.height / 2) / window.innerHeight

  confetti({
    particleCount: 40,
    spread: 50,
    origin: { x, y },
    startVelocity: 20,
    gravity: 0.8,
    ticks: 80,
    colors: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24'],
  })
}

export function showToast(message: string, durationMs = 2000) {
  const el = document.createElement('div')
  el.textContent = message
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '140px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(30, 41, 59, 0.9)',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    zIndex: '9999',
    opacity: '0',
    transition: 'opacity 0.3s ease',
    pointerEvents: 'none',
  })

  document.body.appendChild(el)
  requestAnimationFrame(() => { el.style.opacity = '1' })

  setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 300)
  }, durationMs)
}
