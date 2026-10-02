import { INFINITE_TOKENS } from '../utils/petriNet'

/**
 * Projet d'exemple simple : boucle élémentaire à deux places et une
 * transition. Le marquage initial « n » permet une simulation infinie
 * (la transition se re-déclenche sans jamais épuiser les jetons).
 */
export const HERO_PROJECT = {
  project: {
    name: 'Exemple simple',
    description:
      "Réseau élémentaire avec deux places et une transition. Le marquage initial « n » (infini) permet une simulation qui boucle indéfiniment.",
  },
  orientation: 'TB',
  places: [
    {
      id: 'p1',
      type: 'place',
      x: 260,
      y: 100,
      label: 'P1',
      description: 'Source principale',
      tokens: INFINITE_TOKENS,
      initialTokens: 'n',
    },
    {
      id: 'p2',
      type: 'place',
      x: 260,
      y: 320,
      label: 'P2',
      description: 'Source secondaire',
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
 * Projet de démonstration : Distributeur automatique de boisson avec
 * réapprovisionnement automatique (8 places, 4 transitions).
 */
export const DEMO_PROJECT = {
  project: {
    name: 'Distributeur automatique de boisson',
    description:
      "Modèle d'un distributeur automatique vendant un seul type de boisson, avec réapprovisionnement automatique.\n\nHypothèses : capacité maximale 5 boissons, seuil de réapprovisionnement à 2 boissons, transfert de 3 boissons par cycle, un seul cycle à la fois.",
  },
  orientation: 'TB',
  places: [
    { id: 'p1', type: 'place', x: 340, y: 80, label: 'P1', description: 'Distributeur_Disponible', tokens: 1, initialTokens: 1 },
    { id: 'p2', type: 'place', x: 340, y: 220, label: 'P2', description: 'Pièce_Insérée', tokens: 0, initialTokens: 0 },
    { id: 'p3', type: 'place', x: 340, y: 360, label: 'P3', description: 'Stock_Distributeur', tokens: 5, initialTokens: 5 },
    { id: 'p4', type: 'place', x: 140, y: 360, label: 'P4', description: 'Emplacement_Libre', tokens: 0, initialTokens: 0 },
    { id: 'p5', type: 'place', x: 560, y: 290, label: 'P5', description: 'Boisson_Servie', tokens: 0, initialTokens: 0 },
    { id: 'p6', type: 'place', x: 140, y: 500, label: 'P6', description: 'Réappro_Disponible', tokens: 1, initialTokens: 1 },
    { id: 'p7', type: 'place', x: 340, y: 500, label: 'P7', description: 'Réappro_En_Cours', tokens: 0, initialTokens: 0 },
    { id: 'p8', type: 'place', x: 560, y: 570, label: 'P8', description: 'Stock_Entrepôt', tokens: 15, initialTokens: 15 },
  ],
  transitions: [
    { id: 't1', type: 'transition', x: 340, y: 150, label: 'T1', description: "Insérer_Pièce" },
    { id: 't2', type: 'transition', x: 340, y: 290, label: 'T2', description: 'Distribuer_Boisson' },
    { id: 't3', type: 'transition', x: 340, y: 430, label: 'T3', description: 'Déclencher_Réapprovisionnement' },
    { id: 't4', type: 'transition', x: 340, y: 570, label: 'T4', description: 'Terminer_Réapprovisionnement' },
  ],
  arcs: [
    { id: 'a1', from: 'p1', to: 't1', weight: 1, bend: 0 },
    { id: 'a2', from: 't1', to: 'p2', weight: 1, bend: 0 },
    { id: 'a3', from: 'p2', to: 't2', weight: 1, bend: 0 },
    { id: 'a4', from: 'p3', to: 't2', weight: 1, bend: 0 },
    { id: 'a5', from: 't2', to: 'p1', weight: 1, bend: -120 },
    { id: 'a6', from: 't2', to: 'p4', weight: 1, bend: 0 },
    { id: 'a7', from: 't2', to: 'p5', weight: 1, bend: 0 },
    { id: 'a8', from: 'p4', to: 't3', weight: 3, bend: -60 },
    { id: 'a9', from: 'p6', to: 't3', weight: 1, bend: 0 },
    { id: 'a10', from: 't3', to: 'p7', weight: 1, bend: 0 },
    { id: 'a11', from: 'p7', to: 't4', weight: 1, bend: 0 },
    { id: 'a12', from: 'p8', to: 't4', weight: 3, bend: 0 },
    { id: 'a13', from: 't4', to: 'p6', weight: 1, bend: 60 },
    { id: 'a14', from: 't4', to: 'p3', weight: 3, bend: 80 },
  ],
}

export const DEMO_PROJECTS = {
  hero: HERO_PROJECT,
  vending: DEMO_PROJECT,
}