import { useEffect, useRef, useState } from 'react'
import { PLACE_RADIUS, computeArcGeometry } from '../utils/petriNet'

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Position sur une courbe de Bézier quadratique définie par P0, P1, P2.
 */
function quadBezier(p0, p1, p2, t) {
  const mt = 1 - t
  const x = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x
  const y = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y
  return { x, y }
}

/**
 * Animation interpolée du déplacement des jetons.
 *
 * Les jetons suivent exactement la courbe des arcs (droits ou courbés) :
 *  - phase 1 (t ∈ [0, 0.5]) : de chaque place d'entrée vers la transition
 *  - phase 2 (t ∈ [0.5, 1]) : de la transition vers chaque place de sortie
 *
 * Le composant reçoit `animation` avec :
 *  - `input`  : [{ arc, fromPlace, toTransition, weight }]
 *  - `output` : [{ arc, fromTransition, toPlace, weight }]
 *  - `transition` : { x, y }
 *  - `orientation` : 'LR' | 'TB'
 *  - `durationMs`
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

  const { input, output, orientation } = animation

  // Géométrie de chaque arc (déjà calculée côté App pour éviter le recalcul)
  // Format : { start, control, end, mid }

  const tokens = []

  // Phase 1 : places d'entrée -> transition
  if (progress < 0.5) {
    const t = easeInOutCubic(progress / 0.5)
    input.forEach((entry, ai) => {
      const geom = entry.geometry
      const from = geom.start
      const to = geom.end
      const ctrl = geom.control

      // Position le long de la courbe
      const pos = quadBezier(from, ctrl, to, t)

      // Décalage perpendiculaire pour séparer plusieurs jetons
      const dx = to.x - from.x
      const dy = to.y - from.y
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len
      const py = dx / len

      for (let i = 0; i < entry.weight; i += 1) {
        const offset = (i - (entry.weight - 1) / 2) * 6
        tokens.push({
          key: `in-${ai}-${i}`,
          x: pos.x + px * offset,
          y: pos.y + py * offset,
        })
      }
    })
  }

  // Phase 2 : transition -> places de sortie
  if (progress >= 0.5) {
    const t = easeInOutCubic((progress - 0.5) / 0.5)
    output.forEach((entry, ai) => {
      const geom = entry.geometry
      const from = geom.start
      const to = geom.end
      const ctrl = geom.control

      const pos = quadBezier(from, ctrl, to, t)

      const dx = to.x - from.x
      const dy = to.y - from.y
      const len = Math.hypot(dx, dy) || 1
      const px = -dy / len
      const py = dx / len

      for (let i = 0; i < entry.weight; i += 1) {
        const offset = (i - (entry.weight - 1) / 2) * 6
        tokens.push({
          key: `out-${ai}-${i}`,
          x: pos.x + px * offset,
          y: pos.y + py * offset,
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