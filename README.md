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
- Orientation du graphe : LR (gauche à droite, transitions verticales) ou
  HB (haut-bas, transitions horizontales).
- Les flèches entrantes arrivent toujours sur la face d'entrée de la
  transition (gauche en LR, haut en HB), les flèches sortantes partent
  toujours de la face de sortie (droite en LR, bas en HB).

### Playground
- Zoom avant / arrière via deux boutons loupe en bas au centre.
- Le zoom s'applique à l'ensemble des noeuds, arcs, jetons et annotations.

### Historique
- Boutons Annuler / Refaire dans la barre d'outils.
- Raccourcis clavier Ctrl+Z et Ctrl+Y (ou Ctrl+Shift+Z).
- Historique limité aux 50 dernières actions.

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
  verticale de 44 px avec les boutons empilés verticalement.

### Export PDF
- Bouton Exporter dans le header de la sidebar, visible aussi quand le
  panneau est replié (icône seule). Étiquette au survol : « Exporter le
  projet ».
- Le bouton est actif uniquement lorsque le projet est exécutable (au
  moins une transition franchissable) — même condition que le bouton Play.
- **Contenu du PDF** :
  - Page 1 : contenu du panneau latéral (nom du projet, description,
    tableaux des places et transitions).
  - Pages suivantes : un schéma du diagramme à chaque étape d'exécution,
    jusqu'à ce qu'aucune transition ne soit franchissable.
- **Format des pages** : A4.
- **Orientation** : paysage si l'affichage du projet est en LR, portrait
  si l'affichage est en HB.
- **Entête** sur chaque page : nom du projet.
- **Pied de page** sur chaque page : numérotation `Page X / Y`.
- **Thème** : mode clair avec la couleur d'accentuation bleue du projet
  (`#4f8cff`), transitions grises, jetons orange.

### Barre d'outils
- Logo GitBranch suivi du texte « RDP Simulator » sur fond blanc.
- Groupe **Objets** encadré (sélectionner, place, transition, arc, jeton,
  supprimer).
- Groupe **Affichage** encadré (boutons LR / HB avec icônes et texte).
- Groupe **Actions** encadré (play / pause ou précédent / suivant / quitter,
  annuler, refaire, reset, vider).
- Intitulés de groupe en majuscules sur la bordure supérieure.
- Étiquettes d'aide au survol (tooltips) personnalisées, cohérentes avec
  le reste de l'interface.

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

- Utiliser les deux boutons loupe en bas au centre pour zoomer ou dézoomer.

### 3. Ajuster le panneau latéral

- Cliquer sur le bouton en haut à gauche du panneau pour le plier ou le
  déplier.
- Lorsqu'il est déplié, glisser sa bordure gauche pour ajuster sa largeur.

### 4. Modifier le poids d'un arc

En mode Sélectionner, cliquer (sans glisser) sur le cercle au milieu de
l'arc. Une modale permet de saisir la nouvelle valeur (entier >= 1).

### 5. Courber un arc

En mode Sélectionner, glisser le cercle au milieu de l'arc
perpendiculairement à la corde.

### 6. Choisir l'orientation

Les boutons LR et HB du groupe Affichage changent l'orientation du graphe.

### 7. Lancer la simulation

- Play lance l'exécution automatique (délai de 3 secondes).
- Étape active le mode pas à pas avec Précédent / Suivant / Quitter.
- En mode Sélectionner (hors mode pas à pas), un clic sur une transition
  franchissable la déclenche immédiatement.

### 8. Exporter en PDF

- Cliquer sur le bouton Exporter dans le header de la sidebar.
- Le navigateur télécharge un fichier PDF nommé d'après le nom du projet.
- Le PDF contient la documentation du projet puis un schéma par étape
  d'exécution simulée.

### 9. Annuler / Refaire

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
- `place.initialTokens` : marquage initial (restauré via Reset et utilisé
  pour l'export).
- `place.tokens` : marquage courant (modifié pendant la simulation).

## Limites du MVP

- Une place ne peut pas contenir de capacité maximale.
- Pas d'export / import de fichier source (uniquement l'export PDF).
- L'historique ne contient pas plus de 50 actions.
- Pas d'animation interpolée du déplacement des jetons.
- Le zoom est centré sur l'origine du SVG (coins supérieur gauche).
- L'export PDF part du marquage courant (après modifications éventuelles
  par clic Jeton ou après simulation) et simule jusqu'à épuisement.

## Stack technique

- React 18
- Vite 5
- lucide-react pour l'iconographie
- jsPDF pour la génération du PDF
- SVG natif pour le rendu du graphe