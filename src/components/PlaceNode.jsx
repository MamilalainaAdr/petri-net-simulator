import { PLACE_RADIUS } from '../utils/petriNet'

const TOKEN_LAYOUTS = {
  1: [[0, 0]],
  2: [[-8, 0], [8, 0]],
  3: [[0, -9], [-9, 7], [9, 7]],
  4: [[-8, -8], [8, -8], [-8, 8], [8, 8]],
  5: [[0, 0], [-8, -8], [8, -8], [-8, 8], [8, 8]],
}

function Tokens({ count }) {
  if (count <= 0) return null

  if (count > 5) {
    return (
      <text className="place__token-count" textAnchor="middle" dy="5">
        {count}
      </text>
    )
  }

  return TOKEN_LAYOUTS[count].map(([dx, dy], index) => (
    <circle key={index} cx={dx} cy={dy} r={5} className="token" />
  ))
}

export default function PlaceNode({
  place,
  mode,
  isArcSource,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  const classes = ['node', 'node--place']
  if (isArcSource) classes.push('is-source')

  return (
    <g
      transform={`translate(${place.x}, ${place.y})`}
      className={classes.join(' ')}
      style={{ cursor: mode === 'select' ? 'grab' : 'pointer' }}
      onPointerDown={(e) => onPointerDown(e, 'place', place.id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <circle r={PLACE_RADIUS} className="place__circle" />
      <Tokens count={place.tokens} />
      <text y={PLACE_RADIUS + 18} textAnchor="middle" className="node__label">
        {place.label}
      </text>
    </g>
  )
}