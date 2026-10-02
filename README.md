# Simulateur RDP — Réseau de Pétri

Simulateur de réseau de Pétri (RDP) dans le navigateur.
Construction d'un diagramme dans un playground (places, transitions, arcs
pondérés, jetons), simulation pas à pas avec animation interpolée du
déplacement des jetons, documentation via un panneau latéral redimensionnable
et pliable, thème clair / sombre, et export PDF optimisé.

## Fonctionnalités

### Édition du graphe
- Ajout de places et de transitions avec description obligatoire (modale).
- Création d'arcs orientés entre places et transitions.
- Poids des arcs configurable (défaut 1) via la zone cliquable au milieu de
  l'arc.
- Déformation des arcs par glisser-déposer de la poignée centrale.
- Déplacement des noeuds par glisser-déposer.
- Suppression de noeuds et d'arcs.
- Orientation du graphe : LR (gauche à droite) ou HB (haut-bas).
- Les flèches entrantes arrivent toujours sur la face d'entrée de la
  transition, les flèches sortantes partent toujours de la face de sortie.

### Playground
- **Pan** : en mode Sélectionner, un clic-glisser sur une zone vide du
  canevas déplace toute la vue du diagramme (curseur main ouverte /
  main fermée).
- **Zoom** avant / arrière via deux boutons loupe en bas au centre.
- **Recentrage** : bouton Maximize pour restaurer zoom et position.
- **Création** : un clic simple (sans déplacement > 3 px) sur le fond
  déclenche l'action du mode courant (placer une place, une transition…).
  Le seuil distingue un clic d'un pan sans ambiguïté.
- Les noeuds restent prioritaires sur le fond : cliquer sur une place ou
  une transition n'initie pas de pan.

### Marquage initial
- Le champ de marquage initial de chaque place accepte un entier positif
  ou la lettre `n` (majuscule ou minuscule) pour représenter un marquage
  « infini ».

### Simulation et animation
- Bouton **Play / Pause** : exécution automatique.
- Bouton **Étape** : mode pas à pas avec Précédent / Suivant / Quitter.
- Bouton **Reset** : restauration du marquage initial.
- Bouton **Vider** : remise à zéro complète du canevas.
- **Durée des animations** : sélecteur à côté du bouton Play (valeurs :
  0.5 s, 1 s, 1.5 s, 2 s, 3 s (défaut), 5 s, 8 s). La durée est persistée
  entre les sessions et pilote à la fois l'animation des jetons et
  l'intervalle entre deux franchissements en mode Play.
- **Animation interpolée des jetons** : lors du franchissement d'une
  transition, les jetons sont animés depuis les places d'entrée vers la
  transition (phase 1), puis de la transition vers les places de sortie
  (phase 2), avec un easing cubic in-out.

### Thèmes
- **Mode sombre (défaut)** et **mode clair**.
- Bouton de bascule (icône Soleil / Lune) dans la barre d'outils.
- Préférence persistée dans `localStorage`.
- Toutes les couleurs de l'interface (panneaux, boutons, noeuds, arcs,
  jetons, tooltips) s'adaptent au thème actif.

### Documentation (side panel droit)
- Nom du projet et description (redimensionnables verticalement).
- Tableau des places : identifiant, description, marquage initial.
- Tableau des transitions : identifiant, description, entrées et poids,
  sorties et poids (générés automatiquement).
- Largeur ajustable par glisser-déposer de sa bordure gauche.
- Panneau pliable via un bouton (< / >) : replié, il devient une barre
  verticale de 44 px.

### Historique
- Boutons Annuler / Refaire dans la barre d'outils.
- Raccourcis clavier Ctrl+Z et Ctrl+Y (ou Ctrl+Shift+Z).

### Export PDF
- Bouton Exporter dans le header de la sidebar, visible aussi quand le
  panneau est replié (icône seule).
- Actif uniquement lorsque le projet est exécutable (au moins une
  transition franchissable).
- Si le marquage initial contient la valeur `n`, l'export est refusé avec
  une modale d'avertissement.
- **Contenu** : page 1 = documentation du projet ; pages suivantes = un
  schéma du diagramme par étape d'exécution.
- **Format** : A4, paysage si l'affichage est en LR sinon portrait.
- **Entête / pied** : nom du projet, numérotation `Page X / Y`.
- **Compression** : JPEG qualité 72 %, résolution 1×, compression zlib
  agressive, précision des coordonnées limitée. Le poids final est
  réduit d'un facteur ~8 à 12 par rapport à la version initiale.
- **Barre de progression** pendant la génération (libellé d'étape +
  pourcentage).

### Barre d'outils
- Logo GitBranch + « RDP Simulator » sur fond contrasté.
- Groupes encadrés : **Objets**, **Affichage** (LR / HB), **Actions**
  (durée, simulation, historique, reset/vider, thème).

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

L'application est disponible sur `http://localhost:5173` et s'ouvre
automatiquement dans le navigateur.

## Build de production

```bash
npm run build
```

## Prévisualisation du build

```bash
npm run preview
```

## Guide d'utilisation

### 1. Construire le réseau

| Mode        | Action                                                              |
| ----------- | ------------------------------------------------------------------- |
| Sélectionner| Déplacer un noeud, franchir une transition, courber un arc, pan     |
| Place       | Cliquer sur le canevas pour ajouter une place                       |
| Transition  | Cliquer sur le canevas pour ajouter une transition                  |
| Arc         | Cliquer sur une place puis sur une transition (ou l'inverse)        |
| Jeton       | Cliquer sur une place pour ajouter un jeton                         |
| Supprimer   | Cliquer sur un noeud ou un arc pour le supprimer                    |

### 2. Naviguer dans le playground

- **Pan** : cliquer-glisser sur une zone vide (mode Sélectionner).
- **Zoom** : boutons loupe en bas au centre.
- **Recentrer** : bouton Maximize à côté des boutons de zoom.

### 3. Choisir la durée d'animation

Dans la barre d'outils, groupe Actions, utiliser le sélecteur « Durée »
à côté du bouton Play. Le choix s'applique immédiatement et est mémorisé.

### 4. Changer de thème

Cliquer sur l'icône Soleil / Lune en bout du groupe Actions.

### 5. Exporter en PDF

Le bouton Exporter est grisé tant qu'aucune transition n'est franchissable.
Un clic génère un PDF compressé, avec barre de progression dans la barre
de statut.

### 6. Annuler / Refaire

Ctrl+Z pour annuler, Ctrl+Y (ou Ctrl+Shift+Z) pour refaire.

## Structure du projet

```
petri-net-simulator/
├── index.html                  Point d'entrée HTML
├── package.json                Dépendances et scripts npm
├── vite.config.js              Configuration Vite
├── README.md                   Ce fichier
└── src/
    ├── main.jsx                Point d'entrée React
    ├── App.jsx                 État global, historique, orchestration
    ├── styles.css              Styles globaux + thèmes
    ├── hooks/
    │   └── useLocalStorage.js  Persistance légère
    ├── utils/
    │   ├── petriNet.js         Logique métier (franchissement, géométrie)
    │   ├── exportPdf.js        Génération du PDF (jsPDF + rendu SVG)
    │   └── pdfOptimizer.js     Compression d'image pour le PDF
    └── components/
        ├── Toolbar.jsx         Barre d'outils (lucide-react)
        ├── Playground.jsx      Canevas SVG, pan, zoom, interactions
        ├── PlaceNode.jsx       Rendu d'une place et de ses jetons
        ├── TransitionNode.jsx  Rendu d'une transition
        ├── Arc.jsx             Rendu d'un arc orienté (bézier)
        ├── AnimatedTokens.jsx  Animation interpolée des jetons
        ├── Sidebar.jsx         Documentation du projet
        ├── Modal.jsx           Modale générique
        └── Tooltip.jsx         Tooltip via portail React
```

## Modèle de données

```js
project    = { name, description }
place      = { id, type: 'place',      x, y, label, description, tokens, initialTokens }
transition = { id, type: 'transition', x, y, label, description }
arc        = { id, from, to, weight, bend }
```

- `place.initialTokens` : entier positif, ou la chaîne `"n"` pour un
  marquage infini.
- `place.tokens` : marquage courant (nombre entier ; vaut `INFINITE_TOKENS`
  lorsque le marquage initial est `"n"`).
- `arc.weight` : poids (entier >= 1), défaut 1.
- `arc.bend` : décalage perpendiculaire signé du milieu de l'arc, défaut 0.

## Limites connues

- Une place ne peut pas contenir de capacité maximale.
- Pas d'export / import de fichier source (uniquement l'export PDF).
- L'historique ne contient pas plus de 50 actions.
- L'export PDF est refusé lorsque le marquage initial contient `n`.

## Stack technique

- React 18
- Vite 5
- lucide-react pour l'iconographie
- jsPDF pour la génération du PDF
- SVG natif pour le rendu du graphe