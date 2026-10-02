import { useNavigate } from 'react-router-dom'
import {
  Play,
  FileDown,
  GitBranch,
  Zap,
  Eye,
  Code,
  Sun,
  Moon,
} from 'lucide-react'
import VendingDiagram from '../components/VendingDiagram'
import InfoBox from '../components/InfoBox'

const APP_VERSION = '1.0'

const DEMO_CODE = `// Distributeur automatique de boisson
const net = {
  places: [
    { id: 'P1', tokens: 1,  description: 'Distributeur_Disponible' },
    { id: 'P2', tokens: 0,  description: 'Piece_Inseree' },
    { id: 'P3', tokens: 5,  description: 'Stock_Distributeur' },
    { id: 'P4', tokens: 0,  description: 'Emplacement_Libre' },
    { id: 'P5', tokens: 0,  description: 'Boisson_Servie' },
    { id: 'P6', tokens: 1,  description: 'Reappro_Disponible' },
    { id: 'P7', tokens: 0,  description: 'Reappro_En_Cours' },
    { id: 'P8', tokens: 15, description: 'Stock_Entrepot' },
  ],
  transitions: [
    { id: 'T1', description: 'Inserer_Piece' },
    { id: 'T2', description: 'Distribuer_Boisson' },
    { id: 'T3', description: 'Declencher_Reapprovisionnement' },
    { id: 'T4', description: 'Terminer_Reapprovisionnement' },
  ],
  arcs: [
    { from: 'P1', to: 'T1', weight: 1 },
    { from: 'T1', to: 'P2', weight: 1 },
    { from: 'P2', to: 'T2', weight: 1 },
    { from: 'P3', to: 'T2', weight: 1 },
    { from: 'T2', to: 'P1', weight: 1 },
    { from: 'T2', to: 'P4', weight: 1 },
    { from: 'T2', to: 'P5', weight: 1 },
    { from: 'P4', to: 'T3', weight: 3 },
    { from: 'P6', to: 'T3', weight: 1 },
    { from: 'T3', to: 'P7', weight: 1 },
    { from: 'P7', to: 'T4', weight: 1 },
    { from: 'P8', to: 'T4', weight: 3 },
    { from: 'T4', to: 'P6', weight: 1 },
    { from: 'T4', to: 'P3', weight: 3 },
  ],
}`

const FEATURES = [
  {
    icon: Eye,
    title: 'Visualisation interactive',
    description:
      'Construisez votre réseau de Pétri dans un playground intuitif : places, transitions, arcs pondérés et jetons.',
  },
  {
    icon: Play,
    title: 'Simulation animée',
    description:
      "Les jetons suivent la courbe exacte de chaque arc (droits ou courbés), à la vitesse que vous choisissez.",
  },
  {
    icon: Code,
    title: 'Documentation intégrée',
    description:
      'Décrivez chaque place et transition dans un panneau latéral structuré, prêt pour la documentation.',
  },
  {
    icon: FileDown,
    title: 'Export PDF',
    description:
      "Générez un PDF complet : documentation, puis un schéma par étape d'exécution. Compact et rapide.",
  },
]

const INFO_BOXES = [
  {
    group: 'Modes',
    title: 'Sélectionner',
    text: "Déplacer un noeud, franchir une transition, courber un arc ou déplacer la vue (pan) en cliquant-glissant sur le fond.",
  },
  {
    group: 'Modes',
    title: 'Place',
    text: 'Cliquer sur le canevas pour ajouter une place. Une description est demandée.',
  },
  {
    group: 'Modes',
    title: 'Transition',
    text: 'Cliquer sur le canevas pour ajouter une transition. Une description est demandée.',
  },
  {
    group: 'Modes',
    title: 'Arc',
    text: "Cliquer sur une place puis sur une transition (ou l'inverse) pour créer un arc orienté.",
  },
  {
    group: 'Modes',
    title: 'Jeton',
    text: 'Cliquer sur une place pour y ajouter un jeton.',
  },
  {
    group: 'Modes',
    title: 'Supprimer',
    text: 'Cliquer sur un noeud ou un arc pour le supprimer.',
  },
  {
    group: 'Simulation',
    title: 'Play / Pause',
    text: 'Lance la simulation automatique : chaque transition franchissable est déclenchée à tour de rôle.',
  },
  {
    group: 'Simulation',
    title: 'Étape',
    text: 'Active le mode pas à pas avec Précédent, Suivant et Quitter pour revenir sur chaque franchissement.',
  },
  {
    group: 'Simulation',
    title: 'Reset',
    text: 'Restaure le marquage initial de chaque place, tel que défini dans le panneau latéral.',
  },
  {
    group: 'Simulation',
    title: 'Durée',
    text: "Choisit la durée des animations et l'intervalle entre deux franchissements (0,5 s à 8 s).",
  },
  {
    group: 'Édition',
    title: 'Annuler / Refaire',
    text: 'Historique des 50 dernières actions. Raccourcis Ctrl+Z et Ctrl+Y.',
  },
  {
    group: 'Édition',
    title: 'Vider',
    text: "Efface l'intégralité du canevas et repart d'un projet vide.",
  },
  {
    group: 'Édition',
    title: 'Orientation LR / HB',
    text: 'Change le sens du diagramme : gauche-droite (LR) ou haut-bas (HB).',
  },
  {
    group: 'Édition',
    title: 'Thème',
    text: 'Bascule entre mode sombre et mode clair. La préférence est mémorisée.',
  },
  {
    group: 'Panneau',
    title: 'Documentation',
    text: 'Décrire le projet, chaque place (description, marquage initial) et chaque transition.',
  },
  {
    group: 'Panneau',
    title: 'Exporter PDF',
    text: 'Génère un PDF A4 : documentation du projet puis un schéma par étape de simulation.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()

  const openSimulator = () => navigate('/simulator')
  const openDemo = () => navigate('/simulator?demo=1')

  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__brand">
          <GitBranch size={22} />
          <span>RDP Simulator</span>
        </div>
        <div className="landing__nav-actions">
          <button
            type="button"
            className="landing__nav-cta"
            onClick={openDemo}
          >
            Voir la démo
          </button>
          <button
            type="button"
            className="landing__nav-cta landing__nav-cta--primary"
            onClick={openSimulator}
          >
            Ouvrir le simulateur
          </button>
        </div>
      </header>

      <main className="landing__main">
        {/* -------- Section 1 : Hero -------- */}
        <section className="landing__section landing__section--hero">
          <div className="landing__section-inner landing__hero">
            <div className="landing__hero-text">
              <span className="landing__eyebrow">
                <Zap size={14} />
                Simulateur de réseaux de Pétri
              </span>
              <h1>
                Modélisez, simulez et documentez vos
                <span className="landing__accent"> réseaux de Pétri</span>.
              </h1>
              <p>
                Un éditeur visuel léger pour construire des RDP, lancer une
                simulation pas à pas avec animation des jetons, et exporter le
                tout en PDF. Pas de compte, pas de serveur : tout se passe dans
                votre navigateur.
              </p>
              <div className="landing__actions">
                <button
                  type="button"
                  className="landing__cta landing__cta--primary"
                  onClick={openSimulator}
                >
                  <Play size={16} />
                  Commencer
                </button>
                <button
                  type="button"
                  className="landing__cta landing__cta--ghost"
                  onClick={openDemo}
                >
                  Essayer l'exemple
                </button>
              </div>
            </div>

            <div className="landing__hero-visual">
              <VendingDiagram />
            </div>
          </div>
        </section>

        {/* -------- Section 2 : Démo -------- */}
        <section className="landing__section landing__section--demo">
          <div className="landing__section-inner">
            <header className="landing__section-header">
              <span className="landing__section-eyebrow">Démonstration</span>
              <h2>Un exemple complet, prêt à lancer.</h2>
              <p>
                Un distributeur automatique de boisson avec réapprovisionnement
                automatique : 8 places, 4 transitions, prêt à être exécuté en
                un clic.
              </p>
            </header>

            <div className="landing__demo-grid">
              <div className="landing__demo-preview">
                <VendingDiagram />
                <div className="landing__demo-meta">
                  <span>8 places</span>
                  <span>4 transitions</span>
                  <span>14 arcs</span>
                  <span>P8 initial = 15</span>
                </div>
                <button
                  type="button"
                  className="landing__cta landing__cta--primary"
                  onClick={openDemo}
                >
                  <Play size={16} />
                  Lancer la démo
                </button>
              </div>

              <div className="landing__demo-description">
                <h3>Ce que fait ce réseau</h3>
                <p>
                  Le distributeur vend une boisson à la fois. Un client insère
                  une pièce, la boisson est servie et un emplacement se libère.
                  Dès que 3 emplacements sont disponibles et que le mécanisme
                  de réapprovisionnement est libre, un cycle est déclenché et
                  transfère 3 boissons depuis l'entrepôt central.
                </p>

                <ul className="landing__list">
                  <li>
                    <strong>T1</strong> — Insérer une pièce
                  </li>
                  <li>
                    <strong>T2</strong> — Distribuer une boisson
                  </li>
                  <li>
                    <strong>T3</strong> — Déclencher le réapprovisionnement
                  </li>
                  <li>
                    <strong>T4</strong> — Terminer le réapprovisionnement
                  </li>
                </ul>

                <p className="landing__demo-hint">
                  La démo démarre avec un marquage initial complet et le
                  panneau latéral déjà rempli (nom, description, tableaux des
                  places et transitions).
                </p>
              </div>
            </div>

            <div className="landing__demo-info-header">
              <h3>Guide d'utilisation</h3>
              <p>
                Rôle et fonctionnement de chaque bouton et de chaque section
                de l'interface.
              </p>
            </div>

            <div className="landing__info-grid">
              {INFO_BOXES.map((box, i) => (
                <InfoBox
                  key={i}
                  group={box.group}
                  title={box.title}
                  text={box.text}
                />
              ))}
            </div>
          </div>
        </section>

        {/* -------- Section 3 : Code -------- */}
        <section className="landing__section landing__section--code">
          <div className="landing__section-inner landing__code">
            <div className="landing__code-text">
              <span className="landing__section-eyebrow">Structure</span>
              <h2>Un modèle simple, une simulation claire.</h2>
              <p>
                Décrivez votre réseau avec une structure minimale : des places
                avec un marquage initial, des transitions, et des arcs
                pondérés. Le simulateur s'occupe du reste : franchissement des
                transitions, animation des jetons le long des arcs, export du
                diagramme.
              </p>
              <ul className="landing__list">
                <li>Marquage initial entier ou « n » (infini).</li>
                <li>Poids d'arc configurable et arcs courbables.</li>
                <li>Durée d'animation réglable entre 0,5 s et 8 s.</li>
                <li>Thème clair et sombre, préférence persistée.</li>
              </ul>
            </div>

            <div className="landing__code-window">
              <div className="landing__code-bar">
                <span className="landing__dot landing__dot--red" />
                <span className="landing__dot landing__dot--yellow" />
                <span className="landing__dot landing__dot--green" />
                <span className="landing__code-title">
                  distributeur-rdp.js
                </span>
              </div>
              <pre className="code-snippet">
                <code>{DEMO_CODE}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* -------- Section 4 : Fonctionnalités -------- */}
        <section className="landing__section landing__section--features">
          <div className="landing__section-inner">
            <header className="landing__section-header">
              <span className="landing__section-eyebrow">Fonctionnalités</span>
              <h2>Tout ce qu'il faut pour un RDP</h2>
              <p>
                Un éditeur et un simulateur complets, sans dépendance ni
                service externe.
              </p>
            </header>

            <div className="landing__features-grid">
              {FEATURES.map((f) => {
                const Icon = f.icon
                return (
                  <div key={f.title} className="landing__feature">
                    <span className="landing__feature-icon">
                      <Icon size={18} />
                    </span>
                    <h3>{f.title}</h3>
                    <p>{f.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* -------- Section 5 : CTA -------- */}
        <section className="landing__section landing__section--cta">
          <div className="landing__section-inner landing__cta-block">
            <h2>Prêt à modéliser ?</h2>
            <p>
              Ouvrez le simulateur et construisez votre premier réseau — ou
              démarrez directement sur l'exemple du distributeur.
            </p>
            <div className="landing__actions landing__actions--center">
              <button
                type="button"
                className="landing__cta landing__cta--primary"
                onClick={openSimulator}
              >
                <Play size={16} />
                Ouvrir le simulateur
              </button>
              <button
                type="button"
                className="landing__cta landing__cta--ghost"
                onClick={openDemo}
              >
                Charger l'exemple
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing__footer">
        <span>RDP Simulator</span>
        <span>
          v{APP_VERSION} · {currentYear} · Tous droits réservés
        </span>
      </footer>
    </div>
  )
}