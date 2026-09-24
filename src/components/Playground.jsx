import { useMemo, useRef, useState } from 'react'
import PlaceNode from './PlaceNode'
import TransitionNode from './TransitionNode'
import Arc from './Arc'
import { getEdgePoint } from '../utils/petriNet'

export default function Playground({
  places,
  transitions,
  arcs,
  mode,
  arcSource,
  enabledIds,
  firedId,
  onCanvasClick,
  onNodeClick,
  onMoveNode,
  onDeleteArc,
}) {
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const [hoverPoint, setHoverPoint] = useState(null)

  const nodeMap = useMemo(() => {
    const map = new Map()
    places.forEach((p) => map.set(p.id, p))
    transitions.forEach((t) => map.set(t.id, t))
    return map
  }, [places, transitions])

  const pointFromEvent = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const handleCanvasPointerDown = (e) => {
    if (e.button !== 0) return
    const p = pointFromEvent(e)
    onCanvasClick(p.x, p.y)
  }

  const handleNodePointerDown = (e, nodeType, nodeId) => {
    e.stopPropagation()
    if (e.button !== 0) return

    if (mode !== 'select') {
      onNodeClick(nodeType, nodeId)
      return
    }

    const node = nodeMap.get(nodeId)
    if (!node) return

    const p = pointFromEvent(e)
    dragRef.current = {
      nodeType,
      nodeId,
      offsetX: p.x - node.x,
      offsetY: p.y - node.y,
      startX: p.x,
      startY: p.y,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleNodePointerMove = (e) => {
    const drag = dragRef.current
    if (!drag) return
    const p = pointFromEvent(e)
    if (!drag.moved && Math.hypot(p.x - drag.startX, p.y - drag.startY) > 3) {
      drag.moved = true
    }
    if (drag.moved) {
      onMoveNode(drag.nodeType, drag.nodeId, p.x - drag.offsetX, p.y - drag.offsetY)
    }
  }

  const handleNodePointerUp = () => {
    const drag = dragRef.current
    if (!drag) return
    dragRef.current = null
    if (!drag.moved) {
      onNodeClick(drag.nodeType, drag.nodeId)
    }
  }

  const handleSvgPointerMove = (e) => {
    if (!arcSource) return
    setHoverPoint(pointFromEvent(e))
  }

  const handleSvgPointerLeave = () => {
    setHoverPoint(null)
  }

  const arcSourceNode = arcSource ? nodeMap.get(arcSource.id) : null

  return (
    <div className="playground">
      <svg
        ref={svgRef}
        className={`playground__svg mode-${mode}`}
        onPointerMove={handleSvgPointerMove}
        onPointerLeave={handleSvgPointerLeave}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="10"
            markerHeight="10"
            markerUnits="userSpaceOnUse"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" className="arc__arrow" />
          </marker>
        </defs>

        <rect
          className="playground__bg"
          x="0"
          y="0"
          width="100%"
          height="100%"
          onPointerDown={handleCanvasPointerDown}
        />

        <g className="layer-arcs">
          {arcs.map((arc) => {
            const source = nodeMap.get(arc.from)
            const target = nodeMap.get(arc.to)
            if (!source || !target) return null
            return (
              <Arc
                key={arc.id}
                arc={arc}
                source={source}
                target={target}
                mode={mode}
                onDelete={onDeleteArc}
              />
            )
          })}

          {arcSourceNode && hoverPoint && (
            <line
              className="arc__preview"
              x1={getEdgePoint(arcSourceNode, hoverPoint).x}
              y1={getEdgePoint(arcSourceNode, hoverPoint).y}
              x2={hoverPoint.x}
              y2={hoverPoint.y}
            />
          )}
        </g>

        <g className="layer-nodes">
          {places.map((place) => (
            <PlaceNode
              key={place.id}
              place={place}
              mode={mode}
              isArcSource={arcSource?.id === place.id}
              onPointerDown={handleNodePointerDown}
              onPointerMove={handleNodePointerMove}
              onPointerUp={handleNodePointerUp}
            />
          ))}

          {transitions.map((transition) => (
            <TransitionNode
              key={transition.id}
              transition={transition}
              mode={mode}
              isArcSource={arcSource?.id === transition.id}
              isEnabled={enabledIds.has(transition.id)}
              isFired={firedId === transition.id}
              onPointerDown={handleNodePointerDown}
              onPointerMove={handleNodePointerMove}
              onPointerUp={handleNodePointerUp}
            />
          ))}
        </g>
      </svg>
    </div>
  )
}