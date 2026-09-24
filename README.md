# Simulateur RDP — Réseau de Pétri

Simulateur minimaliste de réseau de Pétri (RDP) dans le navigateur.
Il permet de construire un diagramme dans un playground (places, transitions,
arcs pondérés, jetons), de lancer une simulation pas à pas avec visualisation
du déplacement des jetons, de documenter le projet via un panneau latéral
redimensionnable, et d'exporter le tout en PDF.

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
- Zoom avant / arrière via deux boutons loupe en bas au centre.

### Marquage initial
- Le champ de marquage initial de chaque place accepte un entier positif
  ou la lettre `n` (majuscule ou minuscule) pour représenter un marquage
  « infini ».
- Lorsqu'une place est en mode `n` :
  - la place affiche `n`, puis `n-1`, `n-2`, … à mesure que la simulation
    consomme des jetons.
  - l'ajout manuel de jetons via le mode Jeton est ignoré.
  - `Reset` restaure la place à l'état `n`.
- L'export PDF est refusé si une place utilise `n` (voir section Export).

### Historique
- Boutons Annuler / Refaire dans la barre d'outils.
- Raccourcis clavier Ctrl+Z et Ctrl+Y (ou Ctrl+Shift+Z).

### Simulation
- Play / Pause : exécution automatique (délai de 3 secondes entre étapes).
- Étape : mode pas à pas avec Précédent / Suivant / Quitter.
- Reset : restauration du marquage initial.
- Vider : remise à zéro complète du canevas.
- Les transitions franchissables sont mises en évidence (vert).

### Documentation (side panel droit)
- Nom du projet et description (redimensionnables verticalement).
- Tableau des places : identifiant, description, marquage initial.
- Tableau des transitions : identifiant, description, entrées et poids,
  sorties et poids (générés automatiquement).
- Largeur ajustable par glisser-déposer de sa bordure gauche.
- Panneau pliable via un bouton (< / >) : replié, il devient une barre
  verticale de 44 px.

### Export PDF
- Bouton Exporter dans le header de la sidebar, visible aussi quand le
  panneau est replié (icône seule). Étiquette au survol : « Exporter le
  projet ».
- Le bouton est actif uniquement lorsque le projet est exécutable (au
  moins une transition franchissable) — même condition que le bouton Play.
- **Si le marquage initial contient la valeur `n`**, une modale s'affiche
  pour prévenir : « Veuillez remplacer n par un nombre valide ».
- **Contenu du PDF** :
  - Page 1 : contenu du panneau latéral (nom, description, tableaux).
  - Pages suivantes : un schéma du diagramme par étape d'exécution, jusqu'à
    ce qu'aucune transition ne soit franchissable.
- **Format** : A4, paysage si l'affichage est en LR sinon portrait.
- **Diagramme** : réduit d'un facteur de sécurité (85 % de la zone utile)
  pour ne jamais déborder ou être rogné, y compris lorsque des arcs sont
  fortement courbés.
- **Entête** : nom du projet. **Pied de page** : `Page X / Y`.
- **Thème** : mode clair, accent bleu (`#4f8cff`), transitions grises,
  jetons orange.
- **Barre de progression** : pendant la génération, la barre de statut
  affiche une barre de progression avec le libellé de l'étape courante
  (initialisation, rédaction, rendu des diagrammes, entêtes/pieds,
  finalisation) et le pourcentage d'avancement.

### Barre d'outils
- Logo GitBranch + « RDP Simulator » sur fond blanc.
- Groupes encadrés : **Objets**, **Affichage** (LR / HB), **Actions**.
- Intitulés de groupe en majuscules sur la bordure supérieure.

### Étiquettes au survol (tooltips)
- Les tooltips de la barre d'outils utilisent un pseudo-élément `::after`.
- Les tooltips de la sidebar (bouton de repli, bouton Exporter) et du
  playground (boutons de zoom) utilisent un composant React qui rend le
  tooltip dans un portail au niveau de `document.body`. Cela garantit
  l'affichage au-dessus de tout, y compris hors de conteneurs avec
  `overflow: hidden`.

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
| Sélectionner| Déplacer un noeud, franchir une transition, courber ou éditer un arc |
| Place       | Cliquer sur le canevas pour ajouter une place                       |
| Transition  | Cliquer sur le canevas pour ajouter une transition                  |
| Arc         | Cliquer sur une place puis sur une transition (ou l'inverse)        |
| Jeton       | Cliquer sur une place pour ajouter un jeton                         |
| Supprimer   | Cliquer sur un noeud ou un arc pour le supprimer                    |

### 2. Utiliser le marquage « n »

Dans le tableau des places du panneau latéral, saisir `n` (ou `N`) dans la
colonne « Marquage initial ». La place affiche alors `n` sur le diagramme,
puis `n-1`, `n-2`, … à chaque jeton consommé.

### 3. Exporter en PDF

Le bouton Exporter est grisé tant qu'aucune transition n'est franchissable.
S'il est actif, un clic génère un fichier PDF :

- La barre de statut remplace le message habituel par une barre de
  progression affichant le pourcentage et l'étape courante.
- À la fin, le navigateur télécharge un fichier PDF nommé d'après le nom
  du projet.
- Si une place utilise `n` dans son marquage initial, une modale s'affiche
  et l'export est bloqué.

### 4. Annuler / Refaire

- Boutons dédiés dans la barre d'outils.
- Ctrl+Z pour annuler, Ctrl+Y (ou Ctrl+Shift+Z) pour refaire.

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
    ├── styles.css              Styles globaux
    ├── utils/
    │   ├── petriNet.js         Logique métier (franchissement, géométrie)
    │   └── exportPdf.js        Génération du PDF (jsPDF + rendu SVG)
    └── components/
        ├── Toolbar.jsx         Barre d'outils (lucide-react)
        ├── Playground.jsx      Canevas SVG, interactions, zoom
        ├── PlaceNode.jsx       Rendu d'une place et de ses jetons
        ├── TransitionNode.jsx  Rendu d'une transition
        ├── Arc.jsx             Rendu d'un arc orienté (bézier)
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

## Limites du MVP

- Une place ne peut pas contenir de capacité maximale.
- Pas d'export / import de fichier source (uniquement l'export PDF).
- L'historique ne contient pas plus de 50 actions.
- Pas d'animation interpolée du déplacement des jetons.
- L'export PDF est refusé lorsque le marquage initial contient `n`.

## Stack technique

- React 18
- Vite 5
- lucide-react pour l'iconographie
- jsPDF pour la génération du PDF
- SVG natif pour le rendu du graphe