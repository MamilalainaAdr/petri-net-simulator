# Simulateur RDP — Réseau de Pétri

Simulateur minimaliste de réseau de Pétri (RDP) dans le navigateur.
Il permet de construire un diagramme dans un playground (places, transitions,
arcs pondérés, jetons) puis de lancer une simulation pas à pas avec
visualisation du déplacement des jetons. Un side panel permet de documenter
le projet (nom, description, tableaux des places et transitions).

## Fonctionnalités

### Édition du graphe
- Ajout de places et de transitions avec **description obligatoire** (modale).
- Création d'arcs orientés entre places et transitions.
- Poids des arcs configurable (par défaut 1) via une zone cliquable au milieu
  de l'arc.
- Déformation des arcs : le poids au milieu de l'arc sert également de poignée
  pour courber l'arc (glisser-déposer).
- Déplacement des noeuds par glisser-déposer.
- Suppression de noeuds et d'arcs.
- Orientation du graphe configurable : **LR** (gauche à droite, transitions
  verticales) ou **TB** (haut en bas, transitions horizontales).
- Les flèches entrantes arrivent toujours sur la face d'entrée de la
  transition (gauche en LR, haut en TB), les flèches sortantes partent
  toujours de la face de sortie (droite en LR, bas en TB).

### Historique
- Boutons **Annuler** et **Refaire** dans la barre d'outils.
- Raccourcis clavier **Ctrl+Z** (annuler) et **Ctrl+Y** ou **Ctrl+Shift+Z**
  (refaire).
- L'historique couvre les ajouts, suppressions, déplacements, éditions de
  poids, courbures d'arcs et éditions de la documentation.

### Simulation
- Bouton **Play / Pause** : exécution automatique pas à pas.
- Bouton **Étape** : active le mode pas à pas avec boutons
  **Précédent / Suivant / Quitter** pour naviguer dans l'historique des
  franchissements.
- Bouton **Reset** : restauration du marquage initial.
- Bouton **Vider** : remise à zéro complète du canevas.
- Les transitions franchissables sont mises en évidence (vert).

### Documentation (side panel droit)
- Nom du projet (par défaut « Sans titre »).
- Description du projet.
- Tableau **Description des places** : identifiant, description, marquage
  initial (éditable).
- Tableau **Description des transitions** : identifiant, description,
  places d'entrée et poids (généré automatiquement au format
  `{Px (poids)}`), places de sortie et poids (généré automatiquement).

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

Les fichiers générés se trouvent dans le dossier `dist/`.

## Prévisualisation du build

```bash
npm run preview
```

## Guide d'utilisation

### 1. Construire le réseau

| Mode          | Action                                                              |
| ------------- | ------------------------------------------------------------------- |
| Sélectionner  | Déplacer un noeud, franchir une transition, courber ou éditer un arc |
| Place         | Cliquer sur le canevas pour ajouter une place (modale de description) |
| Transition    | Cliquer sur le canevas pour ajouter une transition (modale de description) |
| Arc           | Cliquer sur une place puis sur une transition (ou l'inverse)        |
| Jeton         | Cliquer sur une place pour ajouter un jeton                         |
| Supprimer     | Cliquer sur un noeud ou un arc pour le supprimer                    |

Un arc relie toujours une place et une transition. Les arcs place vers
transition sont des arcs d'entrée, les arcs transition vers place sont
des arcs de sortie.

### 2. Modifier le poids d'un arc

En mode **Sélectionner**, cliquer (sans glisser) sur le cercle au milieu
de l'arc. Une modale permet de saisir la nouvelle valeur (entier >= 1).
Le poids est utilisé lors du franchissement : il faut au moins `poids`
jetons dans chaque place d'entrée, et le franchissement ajoute `poids`
jetons dans chaque place de sortie.

### 3. Courber un arc

En mode **Sélectionner**, glisser le cercle au milieu de l'arc
perpendiculairement à la corde. La courbure est conservée lors du
déplacement des noeuds.

### 4. Choisir l'orientation

Les boutons **LR** et **TB** de la barre d'outils changent l'orientation du
graphe :
- LR (gauche à droite) : les transitions sont représentées par des barres
  verticales. Les entrées arrivent par la gauche, les sorties partent à
  droite.
- TB (haut en bas) : les transitions sont représentées par des barres
  horizontales. Les entrées arrivent par le haut, les sorties partent par
  le bas.

### 5. Lancer la simulation

- **Play** lance l'exécution automatique.
- **Étape** active le mode pas à pas avec **Précédent**, **Suivant**,
  **Quitter**.
- En mode **Sélectionner** (hors mode pas à pas), un clic sur une
  transition franchissable la déclenche immédiatement.

### 6. Annuler / Refaire

- Boutons **Annuler** et **Refaire** dans la barre d'outils.
- **Ctrl+Z** pour annuler, **Ctrl+Y** (ou **Ctrl+Shift+Z**) pour refaire.
- L'historique est limité aux 50 dernières actions.

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
    │   └── petriNet.js         Logique métier (franchissement, géométrie)
    └── components/
        ├── Toolbar.jsx         Barre d'outils (lucide-react)
        ├── Playground.jsx      Canevas SVG et interactions
        ├── PlaceNode.jsx       Rendu d'une place et de ses jetons
        ├── TransitionNode.jsx  Rendu d'une transition
        ├── Arc.jsx             Rendu d'un arc orienté (bézier)
        ├── Sidebar.jsx         Documentation du projet
        └── Modal.jsx           Modale générique
```

## Modèle de données

```js
project    = { name, description }
place      = { id, type: 'place',      x, y, label, description, tokens, initialTokens }
transition = { id, type: 'transition', x, y, label, description }
arc        = { id, from, to, weight, bend }
```

- `arc.weight` : poids (entier >= 1), défaut 1.
- `arc.bend` : décalage perpendiculaire signé du milieu de l'arc, défaut 0.
- `place.initialTokens` : marquage initial (éditable dans le side panel,
  restauré via Reset).
- `place.tokens` : marquage courant (modifié pendant la simulation).

## Limites du MVP

- Une place ne peut pas contenir de capacité maximale.
- Pas d'export / import de fichier.
- L'historique ne contient pas les 50 dernières actions au-delà de cette
  limite.
- Pas d'animation interpolée du déplacement des jetons.

## Stack technique

- React 18
- Vite 5
- lucide-react pour l'iconographie
- SVG natif pour le rendu du graphe