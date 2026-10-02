import { useEffect, useState } from 'react'

/**
 * Petit diagramme animé de démonstration pour la landing page.
 * Simule un réseau de Pétri minimal avec un jeton qui se déplace.
 */
const NODES = {
  p1: { x: 80, y: 80, type: 'place', label: 'P1', tokens: 1 },
  t1: { x: 220, y: 80, type: 'transition', label: 'T1' },
  p2: { x: 360, y: 80, type: 'place', label: 'P2', tokens: 0 },
  p3: { x: 80, y: 200, type: 'place', label: 'P3', tokens: 1 },
  t2: { x: 220, y: 200, type: 'transition', label: 'T2' },
  p4: { x: 360, y: 200, type: 'place', label: 'P4', tokens: 0 },
}

const ARCS = [
  { from: 'p1', to: 't1' },
  { from: 't1', to: 'p2' },
  { from: 'p3', to: 't2' },
  { from: 't2', to: 'p4' },
]

export default function HeroDiagram() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % 4), 1200)
    return () => clearInterval(id)
  }, [])

  const activeTransition = tick < 2 ? 't1' : 't2'

  return (
    <svg
      className="hero-diagram"
      viewBox="0 0 440 280"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Aperçu d'un réseau de Pétri"
    >
      <defs>
        <marker
          id="hero-arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="10"
          markerHeight="10"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="hero-arrow" />
        </marker>
      </defs>

      {/* Arcs */}
      {ARCS.map((arc, i) => {
        const a = NODES[arc.from]
        const b = NODES[arc.to]
        const isActive =
          (arc.from === 'p1' && arc.to === 't1' && tick === 0) ||
          (arc.from === 't1' && arc.to === 'p2' && tick === 1) ||
          (arc.from === 'p3' && arc.to === 't2' && tick === 2) ||
          (arc.from === 't2' && arc.to === 'p4' && tick === 3)
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className={`hero-arc ${isActive ? 'is-active' : ''}`}
            markerEnd="url(#hero-arrow)"
          />
        )
      })}

      {/* Transitions */}
      {Object.entries(NODES)
        .filter(([, n]) => n.type === 'transition')
        .map(([id, n]) => (
          <g key={id}>
            <rect
              x={n.x - 7}
              y={n.y - 30}
              width={14}
              height={60}
              rx={2}
              className={`hero-transition ${
                id === activeTransition ? 'is-enabled' : ''
              }`}
            />
            <text x={n.x} y={n.y + 48} textAnchor="middle" className="hero-label">
              {n.label}
            </text>
          </g>
        ))}

      {/* Places */}
      {Object.entries(NODES)
        .filter(([, n]) => n.type === 'place')
        .map(([id, n]) => {
          const visibleTokens =
            id === 'p1' ? (tick >= 1 ? 0 : 1)
            : id === 'p2' ? (tick >= 2 ? 1 : tick === 1 ? 1 : 0)
            : id === 'p3' ? (tick >= 3 ? 0 : 1)
            : id === 'p4' ? (tick >= 4 ? 1 : 0)
            : n.tokens
          return (
            <g key={id}>
              <circle cx={n.x} cy={n.y} r={26} className="hero-place" />
              {visibleTokens > 0 && (
                <circle cx={n.x} cy={n.y} r={5} className="hero-token" />
              )}
              <text
                x={n.x}
                y={n.y + 44}
                textAnchor="middle"
                className="hero-label"
              >
                {n.label}
              </text>
            </g>
          )
        })}
    </svg>
  )
}