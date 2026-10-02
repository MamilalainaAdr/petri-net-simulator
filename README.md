# Simulateur RDP — Réseau de Pétri

Simulateur de réseau de Pétri (RDP) dans le navigateur : landing page,
éditeur visuel, simulation pas à pas animée, documentation intégrée et export
PDF.

## Fonctionnalités

### Landing page
- Navigation sticky avec ancres vers les 4 sections, soulignement actif.
- **[1] Hero** — accroche + diagramme animé (2 places, 1 transition,
  marquage initial « n », cycle d'animation 1,5 s, poids des arcs).
- **[2] Structure** — bloc de code non scrollable et description du modèle.
- **[3] Fonctionnalités** — 4 cartes centrées.
- **[4] CTA** — boutons « Ouvrir le simulateur », « Lancer la démo »
  (charge le distributeur automatique) et « Guide d'utilisation » (ouvre
  une modale riche avec icônes).
- Footer : `RDP Simulator` / `v1.0 · année courante · Tous droits réservés`.

### Démonstrations pré-chargées
- `/simulator?demo=hero` — exemple simple (2 places, 1 transition).
- `/simulator?demo=vending` — distributeur automatique (8 places,
  4 transitions).
- À l'arrivée sur la démo, un **guide interactif étape par étape** (Précédent
  / Suivant / C'est compris / Passer) décrit le rôle des éléments de l'UI.

### Édition du graphe
- Ajout de places / transitions avec description obligatoire.
- Arcs orientés pondérés, courbables.
- Déplacement des noeuds, pan du canevas, zoom.
- Suppression de noeuds et d'arcs.
- Orientation LR / HB.
- Marquage initial entier ou « n » (infini).

### Simulation
- Play / Pause, mode pas à pas, Reset, Vider.
- Animation interpolée des jetons **le long de la courbe exacte** des arcs
  (droits ou courbés), via une Bézier quadratique.
- Durée d'animation configurable (0,5 s à 8 s).

### Documentation (side panel)
- Nom du projet, description, marquage initial.
- Tableaux des places et transitions générés automatiquement.
- Panneau pliable et redimensionnable.

### Export PDF
- Page 1 : documentation.
- Pages suivantes : schéma par étape d'exécution.
- A4 paysage si LR sinon portrait.
- Compression JPEG + zlib agressif.
- Barre de progression dans la barre de statut.

### Thèmes
- Mode sombre (défaut) / clair, persisté.

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
cd petri-net-simulator
npm install
```

## Lancement

```bash
npm run dev
```

- `http://localhost:5173/` : landing page.
- `http://localhost:5173/simulator` : simulateur vide.
- `http://localhost:5173/simulator?demo=hero` : exemple simple.
- `http://localhost:5173/simulator?demo=vending` : distributeur automatique.

## Build

```bash
npm run build
npm run preview
```

## Structure

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
    ├── data/
    │   └── demoProject.js
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
        ├── HeroMiniDiagram.jsx
        ├── GuideModal.jsx
        └── OnboardingTour.jsx
```
