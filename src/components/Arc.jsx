import { getEdgePoint } from '../utils/petriNet'

export default function Arc({ arc, source, target, mode, onDelete }) {
  const start = getEdgePoint(source, target)
  const end = getEdgePoint(target, source)
  const canDelete = mode === 'delete'

  const handlePointerDown = (e) => {
    if (!canDelete) return
    e.stopPropagation()
    onDelete(arc.id)
  }

  return (
    <g
      className={`arc ${canDelete ? 'arc--deletable' : ''}`}
      onPointerDown={handlePointerDown}
    >
      <line
        className="arc__line"
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        markerEnd="url(#arrow)"
      />
      <line
        className="arc__hit"
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
      />
    </g>
  )
}