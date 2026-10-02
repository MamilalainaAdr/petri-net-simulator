# Simulateur RDP — Réseau de Pétri

Simulateur de réseau de Pétri (RDP) dans le navigateur, avec landing page
d'accueil, éditeur visuel, simulation pas à pas animée, documentation
intégrée et export PDF.

## Fonctionnalités

### Landing page
- Sections plein écran, chacune avec un fond distinct :
  1. **Hero** — accroche + aperçu animé du réseau de démonstration.
  2. **Démonstration** — présentation du projet du distributeur automatique
     (8 places, 4 transitions, 14 arcs) avec bouton « Lancer la démo ».
     Contient également un guide d'utilisation sous forme de message boxes
     décrivant le rôle de chaque bouton et section.
  3. **Structure** — exemple de code décrivant le même réseau.
  4. **Fonctionnalités** — quatre cartes synthétiques.
  5. **Appel à l'action** — boutons « Ouvrir le simulateur » et
     « Charger l'exemple ».
- Chargement de la démo via `/simulator?demo=1`.
- Thème sombre / clair respecté sur toutes les sections.

### Édition du graphe
- Ajout de places et de transitions (description obligatoire via modale).
- Création d'arcs orientés entre places et transitions.
- Poids des arcs configurable (défaut 1).
- Déformation des arcs par glisser-déposer.
- Déplacement des noeuds, pan du canevas.
- Suppression de noeuds et d'arcs.
- Orientation LR / HB.
- Marqueur « n » (infini) pour le marquage initial.

### Playground
- Pan (clic-glisser sur le fond, mode Sélectionner).
- Zoom avant / arrière + recentrage.
- Création par clic simple sur le fond (mode Place / Transition).

### Simulation
- Play / Pause (délai configurable via le sélecteur Durée).
- Mode pas à pas avec Précédent / Suivant / Quitter.
- Reset / Vider.
- Animation interpolée des jetons le long des arcs (droits ou courbés),
  avec easing cubic in-out.

### Historique
- Boutons Annuler / Refaire + raccourcis Ctrl+Z / Ctrl+Y.

### Documentation
- Panneau latéral redimensionnable et pliable.
- Nom du projet, description, marquage initial par place.
- Tableaux des places et transitions générés automatiquement.

### Export PDF
- Page 1 : documentation du projet.
- Pages suivantes : un schéma par étape d'exécution.
- A4, paysage si LR sinon portrait.
- Compression JPEG qualité 72 %, résolution 1×, zlib agressif.
- Barre de progression dans la barre de statut.
- Refusé si une place utilise « n ».

### Thèmes
- Mode sombre (défaut) / mode clair, persisté dans `localStorage`.

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur

## Installation

```bash
cd petri-net-simulator
npm install
```

## Lancement

```bash
npm run dev
```

L'application est disponible sur `http://localhost:5173`.

- `http://localhost:5173/` : landing page.
- `http://localhost:5173/simulator` : simulateur vide.
- `http://localhost:5173/simulator?demo=1` : simulateur avec le projet du
  distributeur automatique pré-chargé.

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
        ├── HeroDiagram.jsx
        ├── VendingDiagram.jsx
        ├── InfoBox.jsx
        └── CodeSnippet.jsx
```
