# Simulateur RDP — Réseau de Pétri

Simulateur minimaliste de réseau de Pétri (RDP) dans le navigateur.
Il permet de construire un diagramme dans un playground (places, transitions,
arcs, jetons) puis de lancer une simulation pas à pas avec visualisation
du déplacement des jetons.

## Fonctionnalités

- Ajout de places (cercles) et de transitions (barres) sur un canevas SVG.
- Création d'arcs orientés entre places et transitions.
- Ajout de jetons dans les places.
- Déplacement des noeuds par glisser-déposer.
- Suppression de noeuds et d'arcs.
- Bouton **Play** : exécution automatique pas à pas.
- Bouton **Étape** : franchissement manuel d'une transition.
- Bouton **Reset** : restauration du marquage initial.
- Bouton **Vider** : remise à zéro complète du canevas.
- Les transitions franchissables sont mises en évidence (vert).

## Prérequis

- Node.js 18 ou supérieur
- npm 9 ou supérieur

## Installation

```bash
# Se placer dans le dossier du projet
cd petri-net-simulator

# Installer les dépendances
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

Utilisez la barre d'outils pour choisir un mode, puis cliquez sur le canevas.

| Mode          | Action                                                              |
| ------------- | ------------------------------------------------------------------- |
| Sélectionner  | Déplacer un noeud (glisser-déposer) ou franchir une transition      |
| Place         | Cliquer sur le canevas pour ajouter une place                       |
| Transition    | Cliquer sur le canevas pour ajouter une transition                  |
| Arc           | Cliquer sur une place puis sur une transition (ou l'inverse)        |
| Jeton         | Cliquer sur une place pour ajouter un jeton                         |
| Supprimer     | Cliquer sur un noeud ou un arc pour le supprimer                    |

Un arc relie toujours une place et une transition. Les arcs place vers
transition sont des arcs d'entrée, les arcs transition vers place sont
des arcs de sortie.

### 2. Lancer la simulation

- **Play** lance l'exécution automatique. À chaque étape, la première
  transition franchissable est déclenchée (une transition est franchissable
  si toutes ses places d'entrée contiennent au moins un jeton).
- **Étape** déclenche manuellement une seule transition franchissable.
- En mode **Sélectionner**, un clic sur une transition franchissable
  la déclenche immédiatement.

Le franchissement d'une transition retire un jeton de chaque place
d'entrée et ajoute un jeton dans chaque place de sortie.

### 3. Réinitialiser

- **Reset** restaure le marquage tel qu'il était lors du dernier lancement
  de la simulation.
- **Vider** supprime l'intégralité du réseau.

## Structure du projet

```
petri-net-simulator/
├── index.html                  Point d'entrée HTML
├── package.json                Dépendances et scripts npm
├── vite.config.js              Configuration Vite
├── README.md                   Ce fichier
└── src/
    ├── main.jsx                Point d'entrée React
    ├── App.jsx                 État global et orchestration
    ├── styles.css              Styles globaux
    ├── utils/
    │   └── petriNet.js         Logique métier (franchissement, géométrie)
    └── components/
        ├── Toolbar.jsx         Barre d'outils (lucide-react)
        ├── Playground.jsx      Canevas SVG et interactions
        ├── PlaceNode.jsx       Rendu d'une place et de ses jetons
        ├── TransitionNode.jsx  Rendu d'une transition
        └── Arc.jsx             Rendu d'un arc orienté
```

## Modèle de données

```js
place      = { id, type: 'place',      x, y, tokens, label }
transition = { id, type: 'transition', x, y, label }
arc        = { id, from, to }   // from et to sont des identifiants de noeuds
```

## Limites du MVP

- Une place ne peut pas contenir de capacité maximale.
- Un arc ne porte pas de poids (toujours 1 jeton consommé / produit).
- Aucune animation interpolée du déplacement des jetons.
- Pas de sauvegarde ni de chargement de fichier.

## Stack technique

- React 18
- Vite 5
- lucide-react pour l'iconographie
- SVG natif pour le rendu du graphe