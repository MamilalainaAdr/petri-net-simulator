import { useMemo } from 'react'
import { computeArcGeometry, pathForArc } from '../utils/petriNet'

export default function Arc({
  arc,
  source,
  target,
  orientation,
  mode,
  onDelete,
  onWeightPointerDown,
  onWeightPointerMove,
  onWeightPointerUp,
}) {
  const geom = useMemo(
    () => computeArcGeometry(arc, source, target, orientation),
    [arc, source, target, orientation]
  )

  const canDelete = mode === 'delete'
  const weight = arc.weight ?? 1
  const d = pathForArc(geom)

  return (
    <g className={`arc ${canDelete ? 'arc--deletable' : ''}`}>
      <path className="arc__line" d={d} markerEnd="url(#arrow)" />
      <path
        className="arc__hit"
        d={d}
        onPointerDown={(e) => {
          if (!canDelete) return
          e.stopPropagation()
          onDelete(arc.id)
        }}
      />

      <g
        className="arc__weight"
        transform={`translate(${geom.mid.x}, ${geom.mid.y})`}
        onPointerDown={(e) => onWeightPointerDown(e, arc.id)}
        onPointerMove={onWeightPointerMove}
        onPointerUp={onWeightPointerUp}
      >
        <circle r={12} className="arc__weight-bg" />
        <text textAnchor="middle" dy="4" className="arc__weight-text">
          {weight}
        </text>
      </g>
    </g>
  )
}