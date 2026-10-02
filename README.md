# RDP Simulator
## **[Preview on Vercel](https://rdp-simulator.vercel.app/)**


Simulateur de réseau de Pétri (RDP) dans le navigateur. Landing page d'accueil,
éditeur visuel, simulation pas à pas animée, documentation intégrée et export
PDF. Tout se passe côté client, sans compte ni serveur.

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Lancement](#lancement)
- [Guide d'utilisation](#guide-dutilisation)
- [Démonstrations pré-chargées](#démonstrations-pré-chargées)
- [Structure du projet](#structure-du-projet)
- [Modèle de données](#modèle-de-données)
- [Stack technique](#stack-technique)
- [Palette & thèmes](#palette--thèmes)
- [Limites connues](#limites-connues)

---

## Présentation

RDP Simulator est un éditeur et un simulateur de réseaux de Pétri qui
fonctionne entièrement dans le navigateur. Il permet de :

- construire un diagramme (places, transitions, arcs pondérés, jetons) ;
- le simuler pas à pas avec animation des jetons le long des arcs ;
- documenter chaque élément via un panneau latéral structuré ;
- exporter le tout dans un PDF contenant la documentation et un schéma par
  étape de simulation.

L'interface adopte un style **glassmorphism minimaliste** : panneaux translucides,
arrière-plans avec motif pointillé, palette de couleurs osée et modes clair /
sombre.

---

## Fonctionnalités

### Landing page
- Navigation sticky avec ancres vers les sections et soulignement de la section
  active.
- Section **Hero** : titre, description, CTA « Commencer » / « Voir la démo »,
  aperçu animé d'un réseau en boucle (P1 « n » ↔ T1 ↔ P2 « n »).
- Section **Structure** : description du modèle + exemple de code.
- Section **Fonctionnalités** : quatre cartes (visualisation, simulation
  animée, documentation, export PDF).
- Section **Modéliser** : CTA vers le simulateur vide, la démo pré-chargée et
  la documentation.
- Bouton de bascule clair / sombre dans la barre de navigation.
- Footer sticky avec version et année courante.

### Simulateur
- **Barre d'outils** organisée en trois groupes :
  - **Objets** : Sélectionner, Place, Transition, Arc, Jeton, Supprimer.
  - **Affichage** : orientation LR / HB, bascule de thème, bouton d'aide « ? ».
  - **Actions** : durée d'animation, Play / Pause, Étape, Annuler, Refaire,
    Reset, Vider.
- **Playground** : arrière-plan dot grid façon Mermaid, pan, zoom, recentrage.
- **Panneau latéral** : documentation du projet (nom, description, tableaux des
  places et transitions), redimensionnable et pliable. En mobile, il devient un
  overlay plein écran.
- **Barre de statut** : message d'aide contextuel, statut de simulation,
  progression d'export.

### Édition
- Ajout de places et de transitions avec description obligatoire (modale).
- Création d'arcs orientés entre places et transitions.
- Poids des arcs configurable (défaut 1) via une zone cliquable au milieu de
  l'arc.
- Déformation des arcs par glisser-déposer de la poignée centrale.
- Déplacement des noeuds, pan du canevas.
- Suppression de noeuds et d'arcs.
- Orientation LR / HB.
- Marquage initial entier ou « n » (infini).
- Historique des 50 dernières actions, avec Ctrl+Z / Ctrl+Y.

### Simulation
- Play / Pause : exécution automatique des transitions franchissables.
- Étape : mode pas à pas avec Précédent / Suivant / Quitter.
- Reset : restauration du marquage initial.
- Vider : remise à zéro du canevas.
- Animation interpolée des jetons le long de la courbe exacte de chaque arc
  (droits ou courbés), avec easing cubic in-out et couleur distincte pour les
  jetons en transit.
- Durée d'animation réglable entre 0,5 s et 8 s (par défaut 3 s), persistée
  dans le navigateur.

### Documentation
- Nom du projet (par défaut « Sans titre ») et description.
- Tableau des places : identifiant, description, marquage initial.
- Tableau des transitions : identifiant, description, entrées avec poids,
  sorties avec poids (générés automatiquement au format `Px (poids)`).
- Champs texte redimensionnables verticalement.

### Export PDF
- Page 1 : documentation complète du projet.
- Pages suivantes : un schéma du diagramme par étape de simulation.
- Format A4, paysage si orientation LR, portrait si HB.
- Entête : nom du projet. Pied de page : `Page X / Y`.
- Compression JPEG qualité 72 %, résolution 1×, compression zlib agressive
  (poids réduit d'un facteur ~8 à 12 par rapport aux exports bruts).
- Barre de progression avec libellé d'étape et pourcentage.
- Refusé si une place utilise le marquage « n » (avertissement via modale).

### Thèmes
- Mode sombre (par défaut) et mode clair.
- Préférence persistée dans `localStorage`.
- Toutes les couleurs de l'interface s'adaptent au thème actif.

### Responsive
- Desktop : disposition complète avec panneau latéral fixe.
- Tablette : sections en une colonne, toolbar sur deux lignes.
- Mobile : toolbar multi-lignes, sidebar en overlay, sections empilées
  (texte d'abord, visuel ensuite).

---

## Prérequis

- **Node.js** 18 ou supérieur
- **npm** 9 ou supérieur

---

## Installation

```bash
git clone https://github.com/MamilalainaAdr/petri-net-simulator.git
cd petri-net-simulator
npm install
```

---

## Lancement

### Développement

```bash
npm run dev
```

L'application démarre sur `http://localhost:5173` et s'ouvre automatiquement.

- `/` : landing page.
- `/simulator` : simulateur vide.

### Build de production

```bash
npm run build
```

Les fichiers statiques sont générés dans `dist/`.

### Prévisualisation du build

```bash
npm run preview
```

---

## Guide d'utilisation

### 1. Construire le réseau

| Mode         | Action                                                                |
| ------------ | --------------------------------------------------------------------- |
| Sélectionner | Déplacer un noeud, franchir une transition, courber un arc, pan       |
| Place        | Cliquer sur le canevas pour ajouter une place (modale de description) |
| Transition   | Cliquer sur le canevas pour ajouter une transition                    |
| Arc          | Cliquer sur une place puis sur une transition (ou l'inverse)          |
| Jeton        | Cliquer sur une place pour y ajouter un jeton                         |
| Supprimer    | Cliquer sur un noeud ou un arc pour le supprimer                      |

### 2. Naviguer dans le playground

- **Pan** : en mode Sélectionner, cliquer-glisser sur une zone vide.
- **Zoom** : boutons loupe en bas au centre.
- **Recentrer** : bouton Maximize à côté des boutons de zoom.

### 3. Modifier un arc

- **Poids** : en mode Sélectionner, cliquer (sans glisser) sur le cercle au
  milieu de l'arc. Modale de saisie (entier >= 1).
- **Courbure** : glisser le cercle au milieu de l'arc perpendiculairement à la
  corde.

### 4. Marquage initial

Dans le tableau des places du panneau latéral, colonne « Marquage initial » :

- Saisir un entier positif.
- Saisir `n` (ou `N`) pour un marquage infini. La place affiche alors `n`, puis
  `n-1`, `n-2`, … à mesure que la simulation consomme des jetons.

### 5. Lancer la simulation

- **Play** : exécution automatique ; chaque transition franchissable est
  déclenchée à tour de rôle, à l'intervalle choisi.
- **Étape** : mode pas à pas avec Précédent / Suivant / Quitter.
- En mode Sélectionner (hors mode pas à pas), un clic sur une transition
  franchissable la déclenche immédiatement.

### 6. Exporter en PDF

Le bouton **Exporter** est disponible dans le header du panneau latéral. Il est
actif uniquement lorsque le projet est exécutable (au moins une transition
franchissable). Un clic lance la génération avec barre de progression.

### 7. Changer de thème

Bouton Soleil / Lune dans le groupe **Affichage** de la barre d'outils (ou dans
la navbar de la landing page).

### 8. Afficher le guide

Bouton **?** dans le groupe **Affichage**. Le guide interactif met en
surbrillance chaque zone de l'interface, étape par étape (Objets, Affichage,
Actions, Playground, Sidebar, Export).

### 9. Raccourcis clavier

| Raccourci               | Action   |
| ----------------------- | -------- |
| `Ctrl+Z` (ou `Cmd+Z`)   | Annuler  |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Refaire |

---

## Démonstrations pré-chargées

### `hero` — Exemple simple

Réseau en boucle minimale :

- Places P1 et P2 avec marquage initial « n » (infini).
- Une transition T1.
- Quatre arcs pondérés (1) formant une boucle P1 ↔ T1 ↔ P2.

Utile pour tester l'animation des jetons et la simulation infinie.

### `vending` — Distributeur automatique

Modèle complet d'un distributeur de boisson avec réapprovisionnement
automatique :

- 8 places (P1 à P8), 4 transitions (T1 à T4).
- Hypothèses : capacité 5 boissons, seuil de réapprovisionnement à 2, transfert
  de 3 boissons par cycle, un seul cycle à la fois.
- Layout aligné sur la documentation PDF de référence.

À l'ouverture d'une démo, un **guide interactif** s'affiche automatiquement :
chaque étape met en surbrillance un composant de l'interface et propose
Précédent / Suivant / C'est compris / Passer.

---

## Structure du projet

```
petri-net-simulator/
├── index.html
├── package.json
├── package-lock.json
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
        ├── OnboardingTour.jsx
        └── GuideModal.jsx
```

### Rôle des principaux fichiers

| Fichier                       | Rôle                                                            |
| ----------------------------- | --------------------------------------------------------------- |
| `App.jsx`                     | Routing, état global, historique, orchestration de la simulation |
| `pages/LandingPage.jsx`       | Landing page complète                                           |
| `components/Toolbar.jsx`      | Barre d'outils (Objets / Affichage / Actions)                   |
| `components/Playground.jsx`   | Canevas SVG, interactions (pan, zoom, drag, création)           |
| `components/AnimatedTokens.jsx` | Animation interpolée des jetons le long des arcs              |
| `components/Sidebar.jsx`      | Documentation du projet (nom, description, tableaux)            |
| `components/OnboardingTour.jsx` | Guide pas à pas avec spotlight                                |
| `components/GuideModal.jsx`   | Modale de documentation (raccourcis, rôle des boutons)          |
| `components/HeroMiniDiagram.jsx` | Aperçu animé de la landing page                              |
| `utils/petriNet.js`           | Logique métier : franchissement, géométrie des arcs             |
| `utils/exportPdf.js`          | Génération du PDF (documentation + schémas)                     |
| `utils/pdfOptimizer.js`       | Compression JPEG + zlib pour l'export                           |
| `hooks/useLocalStorage.js`    | Persistance des préférences (thème, durée d'animation)          |
| `data/demoProject.js`         | Projets pré-chargés (`hero`, `vending`)                         |

---

## Modèle de données

```js
project    = { name, description }
place      = {
  id, type: 'place', x, y, label, description,
  tokens,          // marquage courant
  initialTokens,   // marquage initial (nombre ou 'n')
}
transition = { id, type: 'transition', x, y, label, description }
arc        = { id, from, to, weight, bend }
```

- `arc.weight` : poids (entier >= 1), défaut 1.
- `arc.bend` : décalage perpendiculaire signé du milieu de l'arc, défaut 0.
- `place.tokens` : nombre entier ; vaut `INFINITE_TOKENS` lorsque
  `initialTokens === 'n'`.

---

## Stack technique

- **React 18** — UI déclarative.
- **Vite 5** — build et serveur de développement.
- **React Router 6** — routing (`/` et `/simulator`).
- **lucide-react** — iconographie.
- **jsPDF** — génération du PDF.
- **SVG natif** — rendu du graphe (pas de dépendance lourde type D3).

---

## Palette & thèmes

Chaque couleur a un rôle précis :

| Rôle         | Couleur                | Usage                                                       |
| ------------ | ---------------------- | ----------------------------------------------------------- |
| **Identité** | Violet `#8254ee`       | Marque, CTA principal, focus, soulignement nav active       |
| **Simulation** | Or `#e7c965`         | Jetons fixes, sélection active, bouton Play, aide, hover    |
| **Succès / transit** | Sauge `#c1cfc1` | Transitions franchissables, jetons en transit, hover neutre |
| **Structure** | Mauve `#82717b`       | Contours de places, arcs, légendes                          |
| **Danger**   | Rouge `#e06c75`        | Mode supprimer, bouton Vider, erreurs                       |
| **Fonds**    | Gris chaud `#3b353c`, Noir `#090909` | Panneaux, textes                       |

Les thèmes clair et sombre sont définis en variables CSS et basculés via
l'attribut `data-theme` sur `<html>`.

---

## Limites connues

- Une place ne peut pas contenir de capacité maximale.
- Pas d'export / import du fichier source (uniquement l'export PDF).
- L'historique est limité aux 50 dernières actions.
- L'export PDF est refusé lorsque le marquage initial contient « n ».

---
