import { useEffect, useState } from 'react'

const CYCLE_MS = 1500

// Layout fixe (coordonnées dans le viewBox 0 0 260 280)
const P1 = { x: 130, y: 60, r: 28 }
const T1 = { x: 130, y: 140, w: 64, h: 14 }
const P2 = { x: 130, y: 220, r: 28 }

// Arcs : P0 = start, P1 = control, P2 = end (quadratique)
const ARCS = [
  {
    id: 'a1',
    P0: { x: 130, y: 88 },
    P1: { x: 70, y: 110.5 },
    P2: { x: 130, y: 133 },
    weight: 1,
    mid: { x: 100, y: 110.5 },
  },
  {
    id: 'a2',
    P0: { x: 130, y: 133 },
    P1: { x: 190, y: 110.5 },
    P2: { x: 130, y: 88 },
    weight: 1,
    mid: { x: 160, y: 110.5 },
  },
  {
    id: 'a3',
    P0: { x: 130, y: 147 },
    P1: { x: 70, y: 169.5 },
    P2: { x: 130, y: 192 },
    weight: 1,
    mid: { x: 100, y: 169.5 },
  },
  {
    id: 'a4',
    P0: { x: 130, y: 192 },
    P1: { x: 190, y: 169.5 },
    P2: { x: 130, y: 147 },
    weight: 1,
    mid: { x: 160, y: 169.5 },
  },
]

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function quadBezier(p0, p1, p2, t) {
  const mt = 1 - t
  return {
    x: mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y,
  }
}

function pathForArc(arc) {
  return `M ${arc.P0.x} ${arc.P0.y} Q ${arc.P1.x} ${arc.P1.y} ${arc.P2.x} ${arc.P2.y}`
}

export default function HeroMiniDiagram() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const loop = (now) => {
      const t = ((now - start) % CYCLE_MS) / CYCLE_MS
      setProgress(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  // Positions des jetons animés
  let tokenA = null
  let tokenB = null
  if (progress < 0.5) {
    const t = easeInOutCubic(progress * 2)
    // Phase 1 : P1 -> T1 (a1) et P2 -> T1 (a4)
    tokenA = quadBezier(ARCS[0].P0, ARCS[0].P1, ARCS[0].P2, t)
    tokenB = quadBezier(ARCS[3].P0, ARCS[3].P1, ARCS[3].P2, t)
  } else {
    const t = easeInOutCubic((progress - 0.5) * 2)
    // Phase 2 : T1 -> P1 (a2) et T1 -> P2 (a3)
    tokenA = quadBezier(ARCS[1].P0, ARCS[1].P1, ARCS[1].P2, t)
    tokenB = quadBezier(ARCS[2].P0, ARCS[2].P1, ARCS[2].P2, t)
  }

  return (
    <svg
      className="hero-mini"
      viewBox="0 0 260 280"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Aperçu d'un réseau de Pétri simple en boucle"
    >
      <defs>
        <marker
          id="hero-mini-arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="hero-mini-arrow" />
        </marker>
      </defs>

      {/* Arcs */}
      {ARCS.map((arc) => (
        <path
          key={arc.id}
          d={pathForArc(arc)}
          className="hero-mini-arc"
          markerEnd="url(#hero-mini-arrow)"
        />
      ))}

      {/* Poids des arcs */}
      {ARCS.map((arc) => (
        <g key={`w-${arc.id}`} className="hero-mini-weight">
          <circle cx={arc.mid.x} cy={arc.mid.y} r={9} />
          <text
            x={arc.mid.x}
            y={arc.mid.y + 3.5}
            textAnchor="middle"
            className="hero-mini-weight-text"
          >
            {arc.weight}
          </text>
        </g>
      ))}

      {/* Transition T1 */}
      <rect
        x={T1.x - T1.w / 2}
        y={T1.y - T1.h / 2}
        width={T1.w}
        height={T1.h}
        rx={2}
        className="hero-mini-transition"
      />
      <text x={T1.x} y={T1.y + 28} textAnchor="middle" className="hero-mini-label">
        T1
      </text>

      {/* Places P1, P2 */}
      <g>
        <circle cx={P1.x} cy={P1.y} r={P1.r} className="hero-mini-place" />
        <text x={P1.x} y={P1.y + 4} textAnchor="middle" className="hero-mini-token">
          n
        </text>
        <text x={P1.x} y={P1.y + 46} textAnchor="middle" className="hero-mini-label">
          P1
        </text>
      </g>
      <g>
        <circle cx={P2.x} cy={P2.y} r={P2.r} className="hero-mini-place" />
        <text x={P2.x} y={P2.y + 4} textAnchor="middle" className="hero-mini-token">
          n
        </text>
        <text x={P2.x} y={P2.y + 46} textAnchor="middle" className="hero-mini-label">
          P2
        </text>
      </g>

      {/* Jetons animés */}
      {tokenA && (
        <circle
          cx={tokenA.x}
          cy={tokenA.y}
          r={6}
          className="hero-mini-anim-token"
        />
      )}
      {tokenB && (
        <circle
          cx={tokenB.x}
          cy={tokenB.y}
          r={6}
          className="hero-mini-anim-token"
        />
      )}
    </svg>
  )
}