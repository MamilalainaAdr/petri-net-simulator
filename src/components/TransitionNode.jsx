import { transitionSize } from '../utils/petriNet'

export default function TransitionNode({
  transition,
  orientation,
  mode,
  isArcSource,
  isEnabled,
  isFired,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}) {
  const { w, h } = transitionSize(orientation)
  const hw = w / 2
  const hh = h / 2
  const hitW = Math.max(w + 30, 44)
  const hitH = Math.max(h + 30, 44)

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
      <rect
        x={-hitW / 2}
        y={-hitH / 2}
        width={hitW}
        height={hitH}
        fill="transparent"
      />
      <rect
        x={-hw}
        y={-hh}
        width={w}
        height={h}
        rx={2}
        className="transition__bar"
      />
      <text y={hh + 20} textAnchor="middle" className="node__label">
        {transition.label}
      </text>
    </g>
  )
}