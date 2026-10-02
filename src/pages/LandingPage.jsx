import { useNavigate } from 'react-router-dom'
import { Play, FileDown, GitBranch, Zap, Eye, Code } from 'lucide-react'
import HeroDiagram from '../components/HeroDiagram'
import CodeSnippet from '../components/CodeSnippet'

const DEMO_CODE = `// Réseau de Pétri minimal
const net = {
  places: [
    { id: 'P1', tokens: 2, description: 'Source' },
    { id: 'P2', tokens: 0, description: 'Résultat' },
  ],
  transitions: [
    { id: 'T1', description: 'Traitement' },
  ],
  arcs: [
    { from: 'P1', to: 'T1', weight: 1 },
    { from: 'T1', to: 'P2', weight: 1 },
  ],
}

// Simulation pas à pas
for (const step of simulate(net)) {
  render(step)
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
      "Lancez la simulation et observez les jetons se déplacer le long des arcs, à la vitesse que vous choisissez.",
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
      "Générez un PDF complet : documentation du projet suivie d'un schéma par étape d'exécution, compressé et rapide.",
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing">
      <header className="landing__nav">
        <div className="landing__brand">
          <GitBranch size={22} />
          <span>RDP Simulator</span>
        </div>
        <button
          type="button"
          className="landing__nav-cta"
          onClick={() => navigate('/simulator')}
        >
          Ouvrir le simulateur
        </button>
      </header>

      <main className="landing__main">
        <section className="landing__hero">
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
                onClick={() => navigate('/simulator')}
              >
                <Play size={16} />
                Commencer
              </button>
              <button
                type="button"
                className="landing__cta landing__cta--ghost"
                onClick={() => navigate('/simulator')}
              >
                Voir une démo
              </button>
            </div>
          </div>

          <div className="landing__hero-visual">
            <HeroDiagram />
          </div>
        </section>

        <section className="landing__code">
          <div className="landing__code-text">
            <h2>Un modèle simple, une simulation claire.</h2>
            <p>
              Décrivez votre réseau avec une structure minimale : des places
              avec un marquage initial, des transitions, et des arcs pondérés.
              Le simulateur s'occupe du reste : franchissement des
              transitions, animation des jetons, export du diagramme.
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
              <span className="landing__code-title">petri-net.js</span>
            </div>
            <CodeSnippet code={DEMO_CODE} language="javascript" />
          </div>
        </section>

        <section className="landing__features">
          <h2>Tout ce qu'il faut pour un RDP</h2>
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
        </section>

        <section className="landing__cta-bottom">
          <h2>Prêt à modéliser ?</h2>
          <p>Ouvrez le simulateur et construisez votre premier réseau.</p>
          <button
            type="button"
            className="landing__cta landing__cta--primary"
            onClick={() => navigate('/simulator')}
          >
            <Play size={16} />
            Lancer le simulateur
          </button>
        </section>
      </main>

      <footer className="landing__footer">
        <span>RDP Simulator</span>
        <span>By Mamilalaina Adr</span>
      </footer>
    </div>
  )
}