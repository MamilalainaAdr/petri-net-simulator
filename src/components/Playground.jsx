import { useMemo, useRef, useState } from 'react'
import { ZoomIn, ZoomOut } from 'lucide-react'
import PlaceNode from './PlaceNode'
import TransitionNode from './TransitionNode'
import Arc from './Arc'
import Tooltip from './Tooltip'
import { getTransitionAttachment, PLACE_RADIUS } from '../utils/petriNet'

const ZOOM_MIN = 0.4
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.15

export default function Playground({
  places,
  transitions,
  arcs,
  orientation,
  mode,
  arcSource,
  enabledIds,
  firedId,
  onCanvasClick,
  onNodeClick,
  onMoveNode,
  onDeleteArc,
  onEditArcWeight,
  onBendChange,
  onEditBegin,
  onEditEnd,
}) {
  const svgRef = useRef(null)
  const dragRef = useRef(null)
  const bendRef = useRef(null)
  const [hoverPoint, setHoverPoint] = useState(null)
  const [zoom, setZoom] = useState(1)

  const nodeMap = useMemo(() => {
    const map = new Map()
    places.forEach((p) => map.set(p.id, p))
    transitions.forEach((t) => map.set(t.id, t))
    return map
  }, [places, transitions])

  const pointFromEvent = (e) => {
    const rect = svgRef.current.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / zoom,
      y: (e.clientY - rect.top) / zoom,
    }
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
    const d = dragRef.current
    if (!d) return
    const p = pointFromEvent(e)
    if (!d.moved && Math.hypot(p.x - d.startX, p.y - d.startY) > 3) {
      d.moved = true
      onEditBegin()
    }
    if (d.moved) {
      onMoveNode(d.nodeType, d.nodeId, p.x - d.offsetX, p.y - d.offsetY)
    }
  }

  const handleNodePointerUp = () => {
    const d = dragRef.current
    if (!d) return
    dragRef.current = null
    if (!d.moved) {
      onNodeClick(d.nodeType, d.nodeId)
    } else {
      onEditEnd()
    }
  }

  const handleWeightPointerDown = (e, arcId) => {
    if (e.button !== 0) return
    if (mode !== 'select') return
    e.stopPropagation()
    const p = pointFromEvent(e)
    bendRef.current = {
      arcId,
      startX: p.x,
      startY: p.y,
      moved: false,
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handleWeightPointerMove = (e) => {
    const d = bendRef.current
    if (!d) return
    const p = pointFromEvent(e)
    if (!d.moved && Math.hypot(p.x - d.startX, p.y - d.startY) > 4) {
      d.moved = true
      onEditBegin()
    }
    if (!d.moved) return

    const arc = arcs.find((a) => a.id === d.arcId)
    if (!arc) return
    const source = nodeMap.get(arc.from)
    const target = nodeMap.get(arc.to)
    if (!source || !target) return

    const mx = (source.x + target.x) / 2
    const my = (source.y + target.y) / 2
    const dx = target.x - source.x
    const dy = target.y - source.y
    const len = Math.hypot(dx, dy) || 1
    const px = -dy / len
    const py = dx / len
    const vx = p.x - mx
    const vy = p.y - my
    const bend = vx * px + vy * py
    onBendChange(d.arcId, bend)
  }

  const handleWeightPointerUp = () => {
    const d = bendRef.current
    if (!d) return
    bendRef.current = null
    if (d.moved) {
      onEditEnd()
    } else {
      onEditEnd()
      onEditArcWeight(d.arcId)
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
  let previewStart = null
  let previewEnd = null
  if (arcSourceNode && hoverPoint) {
    previewEnd = hoverPoint
    if (arcSourceNode.type === 'place') {
      const dx = previewEnd.x - arcSourceNode.x
      const dy = previewEnd.y - arcSourceNode.y
      const d = Math.hypot(dx, dy) || 1
      previewStart = {
        x: arcSourceNode.x + (dx / d) * PLACE_RADIUS,
        y: arcSourceNode.y + (dy / d) * PLACE_RADIUS,
      }
    } else {
      previewStart = getTransitionAttachment(arcSourceNode, orientation, 'out')
    }
  }

  const canZoomIn = zoom < ZOOM_MAX
  const canZoomOut = zoom > ZOOM_MIN

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

        <g transform={`scale(${zoom})`}>
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
                  orientation={orientation}
                  mode={mode}
                  onDelete={onDeleteArc}
                  onWeightPointerDown={handleWeightPointerDown}
                  onWeightPointerMove={handleWeightPointerMove}
                  onWeightPointerUp={handleWeightPointerUp}
                />
              )
            })}

            {previewStart && previewEnd && (
              <line
                className="arc__preview"
                x1={previewStart.x}
                y1={previewStart.y}
                x2={previewEnd.x}
                y2={previewEnd.y}
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
                orientation={orientation}
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
        </g>
      </svg>

      <div className="playground__zoom">
        <Tooltip content="Zoom arrière" position="top">
          <button
            type="button"
            className="btn btn--icon"
            onClick={() =>
              setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
            }
            disabled={!canZoomOut}
            aria-label="Zoom arrière"
          >
            <ZoomOut size={16} />
          </button>
        </Tooltip>
        <Tooltip content="Zoom avant" position="top">
          <button
            type="button"
            className="btn btn--icon"
            onClick={() =>
              setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
            }
            disabled={!canZoomIn}
            aria-label="Zoom avant"
          >
            <ZoomIn size={16} />
          </button>
        </Tooltip>
      </div>
    </div>
  )
}