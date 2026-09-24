export const PLACE_RADIUS = 28

export const INFINITE_TOKENS = 1e12

export function transitionSize(orientation) {
  return orientation === 'LR'
    ? { w: 14, h: 64 }
    : { w: 64, h: 14 }
}

let idCounter = 0
export function createId(prefix) {
  idCounter += 1
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`
}

/**
 * Vrai si la valeur de marquage initial est la chaîne "n" (infini).
 */
export function isInfiniteMarking(value) {
  return typeof value === 'string' && value.trim().toLowerCase() === 'n'
}

/**
 * Traduit une valeur de marquage initial en nombre exploitable.
 */
export function resolveInitialTokens(initialTokens) {
  if (isInfiniteMarking(initialTokens)) return INFINITE_TOKENS
  const n = Math.floor(Number(initialTokens))
  return Number.isFinite(n) && n >= 0 ? n : 0
}

/**
 * Point d'intersection entre le bord d'un noeud et la droite reliant son
 * centre à `toward`.
 */
export function getEdgePoint(node, toward, orientation) {
  const dx = toward.x - node.x
  const dy = toward.y - node.y
  const dist = Math.hypot(dx, dy) || 1
  const ux = dx / dist
  const uy = dy / dist

  if (node.type === 'place') {
    return { x: node.x + ux * PLACE_RADIUS, y: node.y + uy * PLACE_RADIUS }
  }

  const { w, h } = transitionSize(orientation)
  const hw = w / 2
  const hh = h / 2
  const tx = ux !== 0 ? hw / Math.abs(ux) : Infinity
  const ty = uy !== 0 ? hh / Math.abs(uy) : Infinity
  const t = Math.min(tx, ty)
  return { x: node.x + ux * t, y: node.y + uy * t }
}

export function getTransitionAttachment(transition, orientation, direction) {
  const { w, h } = transitionSize(orientation)
  const hw = w / 2
  const hh = h / 2

  if (orientation === 'LR') {
    return direction === 'in'
      ? { x: transition.x - hw, y: transition.y }
      : { x: transition.x + hw, y: transition.y }
  }
  return direction === 'in'
    ? { x: transition.x, y: transition.y - hh }
    : { x: transition.x, y: transition.y + hh }
}

export function computeArcGeometry(arc, source, target, orientation) {
  let start, end

  if (source.type === 'transition') {
    start = getTransitionAttachment(source, orientation, 'out')
    const dx = target.x - start.x
    const dy = target.y - start.y
    const d = Math.hypot(dx, dy) || 1
    end = {
      x: target.x - (dx / d) * PLACE_RADIUS,
      y: target.y - (dy / d) * PLACE_RADIUS,
    }
  } else {
    end = getTransitionAttachment(target, orientation, 'in')
    const dx = end.x - source.x
    const dy = end.y - source.y
    const d = Math.hypot(dx, dy) || 1
    start = {
      x: source.x + (dx / d) * PLACE_RADIUS,
      y: source.y + (dy / d) * PLACE_RADIUS,
    }
  }

  const mx = (start.x + end.x) / 2
  const my = (start.y + end.y) / 2
  const dx = end.x - start.x
  const dy = end.y - start.y
  const len = Math.hypot(dx, dy) || 1
  const px = -dy / len
  const py = dx / len
  const bend = arc.bend ?? 0
  const M = { x: mx + px * bend, y: my + py * bend }
  const C = {
    x: 2 * M.x - (start.x + end.x) / 2,
    y: 2 * M.y - (start.y + end.y) / 2,
  }

  return { start, end, control: C, mid: M }
}

export function pathForArc(geom) {
  return `M ${geom.start.x} ${geom.start.y} Q ${geom.control.x} ${geom.control.y} ${geom.end.x} ${geom.end.y}`
}

export function isTransitionEnabled(transition, arcs, places) {
  const inputArcs = arcs.filter((a) => a.to === transition.id)
  return inputArcs.every((arc) => {
    const place = places.find((p) => p.id === arc.from)
    return place && place.tokens >= (arc.weight ?? 1)
  })
}

export function getEnabledTransitions(transitions, arcs, places) {
  return transitions.filter((t) => isTransitionEnabled(t, arcs, places))
}

export function fireTransition(transitionId, places, arcs) {
  const inputArcs = arcs.filter((a) => a.to === transitionId)
  const outputArcs = arcs.filter((a) => a.from === transitionId)

  for (const arc of inputArcs) {
    const place = places.find((p) => p.id === arc.from)
    if (!place || place.tokens < (arc.weight ?? 1)) return places
  }

  return places.map((place) => {
    let tokens = place.tokens
    for (const arc of inputArcs) {
      if (arc.from === place.id) tokens -= arc.weight ?? 1
    }
    for (const arc of outputArcs) {
      if (arc.to === place.id) tokens += arc.weight ?? 1
    }
    return tokens === place.tokens ? place : { ...place, tokens }
  })
}