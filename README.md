# Simulateur RDP — Réseau de Pétri

Simulateur minimaliste de réseau de Pétri (RDP) dans le navigateur.
Il permet de construire un diagramme dans un playground (places, transitions,
arcs pondérés, jetons) puis de lancer une simulation pas à pas avec
visualisation du déplacement des jetons. Un side panel redimensionnable
permet de documenter le projet (nom, description, tableaux des places et
transitions).

## Fonctionnalités

### Édition du graphe
- Ajout de places et de transitions avec description obligatoire (modale).
- Création d'arcs orientés entre places et transitions.
- Poids des arcs configurable (défaut 1) via la zone cliquable au milieu de
  l'arc.
- Déformation des arcs : la zone du poids sert également de poignée pour
  courber l'arc (glisser-déposer).
- Déplacement des noeuds par glisser-déposer.
- Suppression de noeuds et d'arcs.
- Orientation du graphe configurable : LR (gauche à droite, transitions
  verticales) ou HB (haut-bas, transitions horizontales).
- Les flèches entrantes arrivent toujours sur la face d'entrée de la
  transition (gauche en LR, haut en HB), les flèches sortantes partent
  toujours de la face de sortie (droite en LR, bas en HB).

### Playground
- Zoom avant / arrière via deux boutons loupe en bas au centre du
  playground. Le zoom s'applique à l'ensemble des noeuds, arcs, jetons et
  annotations.

### Historique
- Boutons Annuler et Refaire dans la barre d'outils.
- Raccourcis clavier Ctrl+Z (annuler) et Ctrl+Y / Ctrl+Shift+Z (refaire).
- L'historique couvre les ajouts, suppressions, déplacements, éditions de
  poids, courbures d'arcs et éditions de la documentation.

### Simulation
- Bouton Play / Pause : exécution automatique pas à pas, avec un délai de
  3 secondes entre chaque franchissement.
- Bouton Étape : active le mode pas à pas avec boutons Précédent / Suivant /
  Quitter pour naviguer dans l'historique des franchissements.
- Bouton Reset : restauration du marquage initial.
- Bouton Vider : remise à zéro complète du canevas.
- Les transitions franchissables sont mises en évidence (vert).

### Documentation (side panel droit)
- Nom du projet (par défaut « Sans titre ») et description, tous deux
  redimensionnables verticalement.
- Tableau Description des places : identifiant, description, marquage
  initial (éditable).
- Tableau Description des transitions : identifiant, description, places
  d'entrée et poids (généré automatiquement au format `Px (poids)`),
  places de sortie et poids (généré automatiquement).
- Largeur du panneau ajustable par glisser-déposer de sa bordure gauche.
- Panneau affichable / masquable via le bouton burger de la barre d'outils.

### Barre d'outils
- Logo GitBranch suivi du texte « RDP Simulator » en gras bleu.
- Bouton burger pour afficher / masquer le panneau latéral.
- Groupe **Objets** encadré : sélectionner, place, transition, arc, jeton,
  supprimer.
- Bloc central **Orientation** avec deux boutons texte LR et HB.
- Groupe **Actions** encadré : play / pause (ou précédent / suivant / quitter
  en mode pas à pas), annuler, refaire, reset, vider.
- Les intitulés de groupe (Objets / Actions) apparaissent sur la bordure
  supérieure, en majuscules, de petite taille, décalés vers la gauche.
- Les boutons n'affichent que leur icône ; la description est fournie par
  l'infobulle (attribut `title`).
- Tailles minimales de la fenêtre (1080 × 600) pour éviter les ruptures
  d'affichage.

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

| Mode        | Action                                                              |
| ----------- | ------------------------------------------------------------------- |
| Sélectionner| Déplacer un noeud, franchir une transition, courber ou éditer un arc |
| Place       | Cliquer sur le canevas pour ajouter une place (modale de description) |
| Transition  | Cliquer sur le canevas pour ajouter une transition (modale de description) |
| Arc         | Cliquer sur une place puis sur une transition (ou l'inverse)        |
| Jeton       | Cliquer sur une place pour ajouter un jeton                         |
| Supprimer   | Cliquer sur un noeud ou un arc pour le supprimer                    |

### 2. Naviguer dans le playground

- Utiliser les deux boutons loupe en bas au centre pour zoomer ou
  dézoomer.

### 3. Ajuster le panneau latéral

- Glisser la bordure gauche du panneau pour ajuster sa largeur.
- Cliquer sur l'icône burger dans la barre d'outils pour le masquer /
  l'afficher.

### 4. Modifier le poids d'un arc

En mode Sélectionner, cliquer (sans glisser) sur le cercle au milieu de
l'arc. Une modale permet de saisir la nouvelle valeur (entier >= 1).

### 5. Courber un arc

En mode Sélectionner, glisser le cercle au milieu de l'arc
perpendiculairement à la corde.

### 6. Choisir l'orientation

Les boutons LR et HB changent l'orientation du graphe :
- LR : transitions verticales, entrées à gauche, sorties à droite.
- HB : transitions horizontales, entrées en haut, sorties en bas.

### 7. Lancer la simulation

- Play lance l'exécution automatique (délai de 3 secondes entre étapes).
- Étape active le mode pas à pas avec Précédent / Suivant / Quitter.
- En mode Sélectionner (hors mode pas à pas), un clic sur une transition
  franchissable la déclenche immédiatement.

### 8. Annuler / Refaire

- Boutons dédiés dans la barre d'outils.
- Ctrl+Z pour annuler, Ctrl+Y (ou Ctrl+Shift+Z) pour refaire.
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
        ├── Playground.jsx      Canevas SVG, interactions, zoom
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
- L'historique ne contient pas plus de 50 actions.
- Pas d'animation interpolée du déplacement des jetons.
- Le zoom est centré sur l'origine du SVG (coins supérieur gauche).

## Stack technique

- React 18
- Vite 5
- lucide-react pour l'iconographie
- SVG natif pour le rendu du graphe