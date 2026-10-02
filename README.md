# Simulateur RDP — Réseau de Pétri

Simulateur de réseau de Pétri (RDP) dans le navigateur.
Construction d'un diagramme dans un playground (places, transitions, arcs
pondérés, jetons), simulation pas à pas avec animation interpolée du
déplacement des jetons **le long des arcs (droits ou courbés)**, documentation
via un panneau latéral redimensionnable et pliable, thème clair / sombre,
export PDF optimisé, et **landing page d'accueil**.

## Fonctionnalités

### Landing page
- Page d'accueil inspirée de Mermaid.js : en-tête avec logo et CTA, section
  héro avec diagramme animé, section de démonstration avec éditeur de code,
  grille de fonctionnalités, et section d'appel à l'action finale.
- Navigation vers le simulateur via React Router (`/` → landing,
  `/simulator` → application).

### Édition du graphe
- Ajout de places et de transitions avec description obligatoire (modale).
- Création d'arcs orientés entre places et transitions.
- Poids des arcs configurable (défaut 1).
- Déformation des arcs par glisser-déposer de la poignée centrale.
- Déplacement des noeuds par glisser-déposer.
- Suppression de noeuds et d'arcs.
- Orientation du graphe : LR (gauche à droite) ou HB (haut-bas).

### Playground
- **Pan** : en mode Sélectionner, clic-glisser sur une zone vide pour
  déplacer la vue.
- **Zoom** : boutons loupe en bas au centre.
- **Recentrage** : bouton Maximize.
- **Création** : un clic simple sur le fond déclenche le mode courant.
- **Bug corrigé** : le `<rect>` de fond capte toujours le clic de création,
  même en mode `place` ou `transition`, tout en laissant le pan actif en
  mode `select`.

### Marquage initial
- Entier positif ou lettre `n` pour un marquage infini.
- Affichage `n`, `n-1`, `n-2`, … à mesure de la simulation.

### Simulation et animation
- **Play / Pause**, **Étape** (avec Précédent / Suivant / Quitter),
  **Reset**, **Vider**.
- **Durée des animations** : sélecteur (0,5 s à 8 s, défaut 3 s),
  persistée dans `localStorage`.
- **Animation le long des arcs** : les jetons suivent la courbe réelle de
  chaque arc (droits ou courbés) en utilisant la formule de Bézier
  quadratique. Deux phases : place d'entrée → transition, puis transition →
  place de sortie.

### Thèmes
- Mode sombre (défaut) et mode clair.
- Bascule via l'icône Soleil / Lune dans la barre d'outils.
- Préférence persistée.

### Documentation (side panel droit)
- Nom du projet et description (redimensionnables verticalement).
- Tableaux des places et des transitions (générés automatiquement).
- Largeur ajustable, panneau pliable.

### Historique
- Boutons Annuler / Refaire.
- Raccourcis Ctrl+Z / Ctrl+Y (ou Ctrl+Shift+Z).

### Export PDF
- Page 1 : documentation du projet.
- Pages suivantes : schéma par étape d'exécution.
- Format A4, orientation paysage si LR sinon portrait.
- Compression JPEG qualité 72 %, zlib agressif, précision limitée.
- Barre de progression dans la barre de statut.

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur

## Installation

```bash
cd petri-net-simulator
npm install
```

## Lancement en développement

```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

## Build de production

```bash
npm run build
```

## Prévisualisation du build

```bash
npm run preview
```

## Structure du projet

```
petri-net-simulator/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles.css
    ├── hooks/
    │   └── useLocalStorage.js
    ├── utils/
    │   ├── petriNet.js
    │   ├── exportPdf.js
    │   └── pdfOptimizer.js
    ├── pages/
    │   └── LandingPage.jsx
    └── components/
        ├── Toolbar.jsx
        ├── Playground.jsx
        ├── PlaceNode.jsx
        ├── TransitionNode.jsx
        ├── Arc.jsx
        ├── AnimatedTokens.jsx
        ├── Sidebar.jsx
        ├── Modal.jsx
        ├── Tooltip.jsx
        ├── HeroDiagram.jsx
        └── CodeSnippet.jsx
```

## Notes techniques

### Animation le long des arcs
- `buildAnimation` dans `App.jsx` calcule la géométrie complète de chaque
  arc (`computeArcGeometry`) : points de départ, de contrôle et d'arrivée.
- `AnimatedTokens.jsx` utilise la formule de Bézier quadratique
  `B(t) = (1-t)²P₀ + 2(1-t)t·P₁ + t²P₂` pour positionner les jetons
  exactement sur la courbe, quel que soit le `bend`.
- Un décalage perpendiculaire évite le chevauchement quand `weight > 1`.

### Landing page
- Rendu via `react-router-dom` : `/` pour la landing, `/simulator` pour
  l'application.
- `HeroDiagram` : SVG animé en CSS/JS léger, sans dépendance.
- `CodeSnippet` : coloration syntaxique basique par expressions régulières.
- Thème appliqué via `data-theme` sur `<html>`, partagé avec le simulateur.

## Stack technique

- React 18
- Vite 5
- React Router 6
- lucide-react
- jsPDF
- SVG natif