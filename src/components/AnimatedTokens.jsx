import { useEffect, useRef, useState } from 'react'
import { PLACE_RADIUS, getTransitionAttachment } from '../utils/petriNet'

function lerp(a, b, t) {
  return a + (b - a) * t
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Anime le déplacement des jetons lors d'un franchissement.
 *
 * Deux phases :
 *   - [0.0, 0.5] : les jetons partent des places d'entrée vers la transition
 *   - [0.5, 1.0] : les jetons partent de la transition vers les places de sortie
 *
 * Le composant est rendu à l'intérieur du groupe transformé du playground,
 * donc suit automatiquement le pan et le zoom.
 */
export default function AnimatedTokens({ animation, onComplete }) {
  const [progress, setProgress] = useState(0)
  const doneRef = useRef(false)

  useEffect(() => {
    if (!animation) return
    doneRef.current = false
    setProgress(0)

    const start = performance.now()
    let raf
    const tick = (now) => {
      const t = Math.min(1, (now - start) / animation.durationMs)
      setProgress(t)
      if (t < 1 && !doneRef.current) {
        raf = requestAnimationFrame(tick)
      } else if (!doneRef.current) {
        doneRef.current = true
        onComplete?.(animation.id)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [animation, onComplete])

  if (!animation) return null

  const { input, output, transition, orientation } = animation
  const inAttach = getTransitionAttachment(transition, orientation, 'in')
  const outAttach = getTransitionAttachment(transition, orientation, 'out')

  const phase1 = Math.min(1, progress / 0.5)
  const phase2 = Math.max(0, (progress - 0.5) / 0.5)

  const tokens = []

  if (progress < 0.5) {
    input.forEach((arc, ai) => {
      const from = arc.place
      const dx = inAttach.x - from.x
      const dy = inAttach.y - from.y
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len
      const py = dx / len
      const sx = from.x + (dx / len) * PLACE_RADIUS
      const sy = from.y + (dy / len) * PLACE_RADIUS
      const t = easeInOutCubic(phase1)
      for (let i = 0; i < arc.weight; i += 1) {
        const offset = (i - (arc.weight - 1) / 2) * 6
        tokens.push({
          key: `in-${ai}-${i}`,
          x: lerp(sx, inAttach.x, t) + px * offset,
          y: lerp(sy, inAttach.y, t) + py * offset,
        })
      }
    })
  }

  if (progress >= 0.5) {
    output.forEach((arc, ai) => {
      const to = arc.place
      const dx = to.x - outAttach.x
      const dy = to.y - outAttach.y
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len
      const py = dx / len
      const ex = to.x - (dx / len) * PLACE_RADIUS
      const ey = to.y - (dy / len) * PLACE_RADIUS
      const t = easeInOutCubic(phase2)
      for (let i = 0; i < arc.weight; i += 1) {
        const offset = (i - (arc.weight - 1) / 2) * 6
        tokens.push({
          key: `out-${ai}-${i}`,
          x: lerp(outAttach.x, ex, t) + px * offset,
          y: lerp(outAttach.y, ey, t) + py * offset,
        })
      }
    })
  }

  return (
    <g className="animated-tokens" pointerEvents="none">
      {tokens.map((tok) => (
        <circle
          key={tok.key}
          cx={tok.x}
          cy={tok.y}
          r={6}
          className="animated-token"
        />
      ))}
    </g>
  )
}