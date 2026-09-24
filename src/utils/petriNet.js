export const PLACE_RADIUS = 28
export const TRANSITION_W = 14
export const TRANSITION_H = 64

let idCounter = 0

export function createId(prefix) {
  idCounter += 1
  return `${prefix}_${Date.now().toString(36)}_${idCounter}`
}

/**
 * Calcule le point d'intersection entre le bord d'un noeud et la droite
 * reliant son centre à `toward`.
 */
export function getEdgePoint(node, toward) {
  const dx = toward.x - node.x
  const dy = toward.y - node.y
  const dist = Math.hypot(dx, dy) || 1
  const ux = dx / dist
  const uy = dy / dist

  if (node.type === 'place') {
    return { x: node.x + ux * PLACE_RADIUS, y: node.y + uy * PLACE_RADIUS }
  }

  const hw = TRANSITION_W / 2
  const hh = TRANSITION_H / 2
  const tx = ux !== 0 ? hw / Math.abs(ux) : Infinity
  const ty = uy !== 0 ? hh / Math.abs(uy) : Infinity
  const t = Math.min(tx, ty)
  return { x: node.x + ux * t, y: node.y + uy * t }
}

/**
 * Une transition est franchissable si toutes ses places d'entrée
 * possèdent au moins un jeton.
 */
export function isTransitionEnabled(transition, arcs, places) {
  const inputArcs = arcs.filter((a) => a.to === transition.id)
  return inputArcs.every((arc) => {
    const place = places.find((p) => p.id === arc.from)
    return place && place.tokens > 0
  })
}

export function getEnabledTransitions(transitions, arcs, places) {
  return transitions.filter((t) => isTransitionEnabled(t, arcs, places))
}

/**
 * Franchit une transition : retire un jeton sur chaque place d'entrée
 * et ajoute un jeton sur chaque place de sortie.
 * Retourne le tableau de places inchangé si la transition n'est pas franchissable.
 */
export function fireTransition(transitionId, places, arcs) {
  const inputs = arcs.filter((a) => a.to === transitionId).map((a) => a.from)
  const outputs = arcs.filter((a) => a.from === transitionId).map((a) => a.to)

  for (const placeId of inputs) {
    const place = places.find((p) => p.id === placeId)
    if (!place || place.tokens < 1) return places
  }

  return places.map((place) => {
    let tokens = place.tokens
    if (inputs.includes(place.id)) tokens -= 1
    if (outputs.includes(place.id)) tokens += 1
    return tokens === place.tokens ? place : { ...place, tokens }
  })
}