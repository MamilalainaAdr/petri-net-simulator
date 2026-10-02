import { INFINITE_TOKENS } from '../utils/petriNet'

/**
 * Exemple simple : P1 (n) <-> T1 <-> P2 (n), en boucle.
 */
export const HERO_PROJECT = {
  project: {
    name: 'Exemple simple',
    description:
      "Réseau élémentaire en boucle avec deux places marquées « n » (infini) et une transition.",
  },
  orientation: 'TB',
  places: [
    {
      id: 'p1',
      type: 'place',
      x: 260,
      y: 100,
      label: 'P1',
      description: 'Source A',
      tokens: INFINITE_TOKENS,
      initialTokens: 'n',
    },
    {
      id: 'p2',
      type: 'place',
      x: 260,
      y: 320,
      label: 'P2',
      description: 'Source B',
      tokens: INFINITE_TOKENS,
      initialTokens: 'n',
    },
  ],
  transitions: [
    {
      id: 't1',
      type: 'transition',
      x: 260,
      y: 210,
      label: 'T1',
      description: 'Transition cyclique',
    },
  ],
  arcs: [
    { id: 'a1', from: 'p1', to: 't1', weight: 1, bend: 60 },
    { id: 'a2', from: 't1', to: 'p1', weight: 1, bend: 60 },
    { id: 'a3', from: 't1', to: 'p2', weight: 1, bend: 60 },
    { id: 'a4', from: 'p2', to: 't1', weight: 1, bend: 60 },
  ],
}

/**
 * Distributeur automatique de boisson — layout aligné sur le PDF de
 * référence : flux vertical principal P1 -> T1 -> P2 -> T2 -> P4 -> T3 ->
 * P7 -> T4, avec places latérales P3 / P5 à droite de T2, P6 à gauche de
 * T3, P8 à droite de T4, et arcs de bouclage (T2 -> P1, T4 -> P3, T4 -> P6).
 */
export const DEMO_PROJECT = {
  project: {
    name: 'Distributeur automatique de boisson',
    description:
      "Modèle d'un distributeur automatique vendant un seul type de boisson, avec réapprovisionnement automatique.\n\nHypothèses : capacité maximale 5 boissons, seuil de réapprovisionnement à 2 boissons, transfert de 3 boissons par cycle, un seul cycle à la fois.",
  },
  orientation: 'TB',
  places: [
    { id: 'p1', type: 'place', x: 400, y: 60, label: 'P1', description: 'Distributeur_Disponible', tokens: 1, initialTokens: 1 },
    { id: 'p2', type: 'place', x: 400, y: 200, label: 'P2', description: 'Pièce_Insérée', tokens: 0, initialTokens: 0 },
    { id: 'p3', type: 'place', x: 620, y: 240, label: 'P3', description: 'Stock_Distributeur', tokens: 5, initialTokens: 5 },
    { id: 'p4', type: 'place', x: 400, y: 350, label: 'P4', description: 'Emplacement_Libre', tokens: 0, initialTokens: 0 },
    { id: 'p5', type: 'place', x: 620, y: 320, label: 'P5', description: 'Boisson_Servie', tokens: 0, initialTokens: 0 },
    { id: 'p6', type: 'place', x: 180, y: 420, label: 'P6', description: 'Réappro_Disponible', tokens: 1, initialTokens: 1 },
    { id: 'p7', type: 'place', x: 400, y: 490, label: 'P7', description: 'Réappro_En_Cours', tokens: 0, initialTokens: 0 },
    { id: 'p8', type: 'place', x: 620, y: 560, label: 'P8', description: 'Stock_Entrepôt', tokens: 15, initialTokens: 15 },
  ],
  transitions: [
    { id: 't1', type: 'transition', x: 400, y: 130, label: 'T1', description: 'Insérer_Pièce' },
    { id: 't2', type: 'transition', x: 400, y: 280, label: 'T2', description: 'Distribuer_Boisson' },
    { id: 't3', type: 'transition', x: 400, y: 420, label: 'T3', description: 'Déclencher_Réapprovisionnement' },
    { id: 't4', type: 'transition', x: 400, y: 560, label: 'T4', description: 'Terminer_Réapprovisionnement' },
  ],
  arcs: [
    // Flux vertical principal
    { id: 'a1', from: 'p1', to: 't1', weight: 1, bend: 0 },
    { id: 'a2', from: 't1', to: 'p2', weight: 1, bend: 0 },
    { id: 'a3', from: 'p2', to: 't2', weight: 1, bend: 0 },
    { id: 'a4', from: 't2', to: 'p4', weight: 1, bend: 0 },
    { id: 'a5', from: 'p4', to: 't3', weight: 3, bend: 0 },
    { id: 'a6', from: 't3', to: 'p7', weight: 1, bend: 0 },
    { id: 'a7', from: 'p7', to: 't4', weight: 1, bend: 0 },

    // Arcs latéraux T2
    { id: 'a8', from: 'p3', to: 't2', weight: 1, bend: 0 },
    { id: 'a9', from: 't2', to: 'p5', weight: 1, bend: 0 },
    // Bouclage T2 -> P1 (grande courbe à gauche)
    { id: 'a10', from: 't2', to: 'p1', weight: 1, bend: -260 },

    // Arc latéral T3 (entrée P6)
    { id: 'a11', from: 'p6', to: 't3', weight: 1, bend: 0 },

    // Arcs latéraux T4
    { id: 'a12', from: 'p8', to: 't4', weight: 3, bend: 0 },
    // T4 -> P6 (courbe à gauche)
    { id: 'a13', from: 't4', to: 'p6', weight: 1, bend: -140 },
    // T4 -> P3 (grande courbe à droite)
    { id: 'a14', from: 't4', to: 'p3', weight: 3, bend: 220 },
  ],
}

export const DEMO_PROJECTS = {
  hero: HERO_PROJECT,
  vending: DEMO_PROJECT,
}