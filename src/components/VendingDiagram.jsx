/**
 * Aperçu statique (avec animation légère) du réseau de Pétri de la
 * démonstration. Sert d'illustration sur la landing page.
 */
import { useEffect, useState } from 'react'

const PLACES = {
  P1: { x: 170, y: 40 },
  P2: { x: 170, y: 110 },
  P3: { x: 170, y: 180 },
  P4: { x: 70, y: 180 },
  P5: { x: 280, y: 145 },
  P6: { x: 70, y: 250 },
  P7: { x: 170, y: 250 },
  P8: { x: 280, y: 285 },
}

const TRANSITIONS = {
  T1: { x: 170, y: 75 },
  T2: { x: 170, y: 145 },
  T3: { x: 170, y: 215 },
  T4: { x: 170, y: 285 },
}

const ARCS = [
  { from: 'P1', to: 'T1' },
  { from: 'T1', to: 'P2' },
  { from: 'P2', to: 'T2' },
  { from: 'P3', to: 'T2' },
  { from: 'T2', to: 'P5' },
  { from: 'T2', to: 'P4' },
  { from: 'P4', to: 'T3' },
  { from: 'P6', to: 'T3' },
  { from: 'T3', to: 'P7' },
  { from: 'P7', to: 'T4' },
  { from: 'P8', to: 'T4' },
]

const TOKEN_COUNTS = [
  // Cycle de 4 états pour simuler une animation
  { P1: 1, P2: 0, P3: 5, P4: 0, P5: 0, P6: 1, P7: 0, P8: 15 },
  { P1: 0, P2: 1, P3: 5, P4: 0, P5: 0, P6: 1, P7: 0, P8: 15 },
  { P1: 1, P2: 0, P3: 4, P4: 1, P5: 1, P6: 1, P7: 0, P8: 15 },
  { P1: 1, P2: 0, P3: 4, P4: 0, P5: 1, P6: 0, P7: 1, P8: 15 },
]

function renderTokens(x, y, count) {
  if (count <= 0) return null
  if (count > 5) {
    return (
      <text className="vending-token-count" x={x} y={y + 4} textAnchor="middle">
        {count}
      </text>
    )
  }
  if (count === 1) return <circle cx={x} cy={y} r={4} className="vending-token" />
  if (count === 2)
    return (
      <>
        <circle cx={x - 6} cy={y} r={4} className="vending-token" />
        <circle cx={x + 6} cy={y} r={4} className="vending-token" />
      </>
    )
  if (count === 3)
    return (
      <>
        <circle cx={x} cy={y - 6} r={4} className="vending-token" />
        <circle cx={x - 6} cy={y + 6} r={4} className="vending-token" />
        <circle cx={x + 6} cy={y + 6} r={4} className="vending-token" />
      </>
    )
  // 4 or 5
  return (
    <>
      <circle cx={x - 6} cy={y - 6} r={4} className="vending-token" />
      <circle cx={x + 6} cy={y - 6} r={4} className="vending-token" />
      <circle cx={x - 6} cy={y + 6} r={4} className="vending-token" />
      <circle cx={x + 6} cy={y + 6} r={4} className="vending-token" />
      {count === 5 && (
        <circle cx={x} cy={y} r={4} className="vending-token" />
      )}
    </>
  )
}

export default function VendingDiagram() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % TOKEN_COUNTS.length), 1400)
    return () => clearInterval(id)
  }, [])

  const counts = TOKEN_COUNTS[step]

  return (
    <svg
      className="vending-diagram"
      viewBox="0 0 360 340"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Aperçu du réseau de Pétri de la démonstration"
    >
      <defs>
        <marker
          id="vending-arrow"
          viewBox="0 0 10 10"
          refX="10"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" className="vending-arrow" />
        </marker>
      </defs>

      {/* Arcs */}
      {ARCS.map((arc, i) => {
        const a = PLACES[arc.from] || TRANSITIONS[arc.from]
        const b = PLACES[arc.to] || TRANSITIONS[arc.to]
        return (
          <line
            key={i}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className="vending-arc"
            markerEnd="url(#vending-arrow)"
          />
        )
      })}

      {/* Transitions */}
      {Object.entries(TRANSITIONS).map(([id, t]) => (
        <g key={id}>
          <rect
            x={t.x - 7}
            y={t.y - 4}
            width={14}
            height={8}
            rx={2}
            className="vending-transition"
          />
          <text x={t.x} y={t.y + 18} textAnchor="middle" className="vending-label">
            {id}
          </text>
        </g>
      ))}

      {/* Places */}
      {Object.entries(PLACES).map(([id, p]) => (
        <g key={id}>
          <circle cx={p.x} cy={p.y} r={20} className="vending-place" />
          {renderTokens(p.x, p.y, counts[id] ?? 0)}
          <text x={p.x} y={p.y + 34} textAnchor="middle" className="vending-label">
            {id}
          </text>
        </g>
      ))}
    </svg>
  )
}