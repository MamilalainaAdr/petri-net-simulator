# Simulateur RDP — Réseau de Pétri

Simulateur de réseau de Pétri (RDP) dans le navigateur : landing page,
éditeur visuel, simulation pas à pas animée, documentation intégrée et export
PDF.

## Fonctionnalités

### Landing page
- Navigation sticky : logo cliquable (retour en haut), ancres vers les
  3 sections suivantes avec soulignement actif, bouton thème clair/sombre.
- **[1] Hero** — diagramme en boucle P1 (n) ↔ T1 ↔ P2 (n), poids 1 affichés
  sur les arcs, animation de jetons à 1,5 s.
- **[2] Structure** — bloc de code non scrollable décrivant le même
  réseau.
- **[3] Fonctionnalités** — en-tête aligné à gauche, 4 cartes descriptives.
- **[4] Modéliser** — bloc centré avec boutons « Ouvrir le simulateur » et
  « Lancer la démo » (distributeur automatique).
- Footer : `RDP Simulator` · `v1.0 · année · Tous droits réservés`.

### Démonstrations pré-chargées
- `/simulator?demo=hero` — boucle simple.
- `/simulator?demo=vending` — distributeur automatique (8 places,
  4 transitions), layout aligné sur le PDF de référence (flux vertical
  principal avec boucles latérales).
- À l'ouverture d'une démo, un **tour guidé** s'affiche :
  - Composant ciblé surligné par un spotlight.
  - Card centrée à l'écran avec Précédent / Suivant / C'est compris /
    Passer.

### Éditeur
- Barre d'outils avec marque cliquable (retour au landing).
- Groupes **Objets**, **Affichage**, **Actions** encadrés.
- Thème sombre / clair partagé entre landing et simulateur.
- Durée d'animation (0,5 s à 8 s), préférence persistée.

### Simulation
- Play / Pause, mode pas à pas, Reset, Vider.
- Animation interpolée des jetons le long de la courbe des arcs.
- Marquage initial « n » (infini).

### Export PDF
- Page 1 documentation + un schéma par étape.
- A4 paysage si LR sinon portrait.
- Compression JPEG + zlib agressif, barre de progression.

## Prérequis

- Node.js 18+
- npm 9+

## Installation

```bash
npm install
```

## Lancement

```bash
npm run dev
```

- `/` : landing page.
- `/simulator` : simulateur vide.
- `/simulator?demo=hero` : exemple simple.
- `/simulator?demo=vending` : distributeur automatique.

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
        └── OnboardingTour.jsx
```

## Licence

Tous droits réservés.