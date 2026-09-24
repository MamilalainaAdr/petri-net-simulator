import { TRANSITION_W, TRANSITION_H } from '../utils/petriNet'

export default function TransitionNode({
  transition,
  mode,
  isArcSource,
  isEnabled,
  isFired,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  const classes = ['node', 'node--transition']
  if (isArcSource) classes.push('is-source')
  if (isEnabled) classes.push('is-enabled')
  if (isFired) classes.push('is-fired')

  return (
    <g
      transform={`translate(${transition.x}, ${transition.y})`}
      className={classes.join(' ')}
      style={{ cursor: mode === 'select' ? 'grab' : 'pointer' }}
      onPointerDown={(e) => onPointerDown(e, 'transition', transition.id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Zone cliquable élargie */}
      <rect
        x={-22}
        y={-TRANSITION_H / 2 - 6}
        width={44}
        height={TRANSITION_H + 12}
        fill="transparent"
      />
      <rect
        x={-TRANSITION_W / 2}
        y={-TRANSITION_H / 2}
        width={TRANSITION_W}
        height={TRANSITION_H}
        rx={2}
        className="transition__bar"
      />
      <text y={TRANSITION_H / 2 + 20} textAnchor="middle" className="node__label">
        {transition.label}
      </text>
    </g>
  )
}