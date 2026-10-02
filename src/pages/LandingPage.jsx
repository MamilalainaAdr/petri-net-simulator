import { useEffect, useState } from 'react'
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
  BookOpen,
} from 'lucide-react'
import HeroMiniDiagram from '../components/HeroMiniDiagram'
import GuideModal from '../components/GuideModal'

const APP_VERSION = '1.0'

const DEMO_CODE = `// Réseau en boucle : P1 <-> T1 <-> P2
const net = {
  places: [
    { id: 'P1', tokens: 'n' },
    { id: 'P2', tokens: 'n' },
  ],
  transitions: [
    { id: 'T1' },
  ],
  arcs: [
    { from: 'P1', to: 'T1', weight: 1 },
    { from: 'T1', to: 'P2', weight: 1 },
    { from: 'P2', to: 'T1', weight: 1 },
    { from: 'T1', to: 'P1', weight: 1 },
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

const NAV_ITEMS = [
  { id: 'hero', label: 'RDP Simulator' },
  { id: 'structure', label: 'Structure' },
  { id: 'features', label: 'Fonctionnalités' },
  { id: 'cta', label: 'Modéliser' },
]

export default function LandingPage({ theme, onThemeToggle }) {
  const navigate = useNavigate()
  const currentYear = new Date().getFullYear()
  const [activeSection, setActiveSection] = useState('hero')
  const [guideOpen, setGuideOpen] = useState(false)

  const openSimulator = () => navigate('/simulator')
  const openVendingDemo = () => navigate('/simulator?demo=vending')

  const ThemeIcon = theme === 'dark' ? Sun : Moon

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + 220
      for (const { id } of NAV_ITEMS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.offsetTop
        const bottom = top + el.offsetHeight
        if (scrollY >= top && scrollY < bottom) {
          setActiveSection(id)
          return
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="landing">
      <header className="landing__nav">
        <button
          type="button"
          className="landing__brand"
          onClick={() => scrollTo('hero')}
          aria-label="Revenir en haut"
        >
          <GitBranch size={22} />
          <span>RDP Simulator</span>
        </button>

        <nav className="landing__nav-links" aria-label="Sections">
          {NAV_ITEMS.slice(1).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`landing__nav-link ${
                activeSection === id ? 'is-active' : ''
              }`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <button
          type="button"
          className="landing__nav-cta landing__nav-cta--primary"
          onClick={openSimulator}
        >
          Ouvrir le simulateur
        </button>

        <button
          type="button"
          className="landing__nav-theme"
          onClick={onThemeToggle}
          title={
            theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
          }
          aria-label={
            theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'
          }
        >
          <ThemeIcon size={18} />
        </button>
      </header>

      <main className="landing__main">
        {/* ---- [1] Hero ---- */}
        <section id="hero" className="landing__section landing__section--hero">
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
                  onClick={openVendingDemo}
                >
                  Voir la démo
                </button>
              </div>
            </div>

            <div className="landing__hero-visual">
              <HeroMiniDiagram />
            </div>
          </div>
        </section>

        {/* ---- [2] Structure ---- */}
        <section
          id="structure"
          className="landing__section landing__section--structure"
        >
          <div className="landing__section-inner landing__structure">
            <div className="landing__structure-text">
              <span className="landing__section-eyebrow">Structure</span>
              <h2>Un modèle simple, une simulation claire.</h2>
              <p>
                Décrivez votre réseau avec une structure minimale : des places
                avec un marquage initial, des transitions, et des arcs pondérés.
                Le simulateur s'occupe du reste : franchissement des
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
                <span className="landing__code-title">boucle-rdp.js</span>
              </div>
              <pre className="code-snippet code-snippet--fixed">
                <code>{DEMO_CODE}</code>
              </pre>
            </div>
          </div>
        </section>

        {/* ---- [3] Fonctionnalités ---- */}
        <section
          id="features"
          className="landing__section landing__section--features"
        >
          <div className="landing__section-inner">
            <header className="landing__section-header">
              <span className="landing__section-eyebrow">Fonctionnalités</span>
              <h2>Tout ce qu'il faut pour un RDP</h2>
              <p>
                Un éditeur et un simulateur complets, sans dépendance ni service
                externe.
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

        {/* ---- [4] CTA ---- */}
        <section id="cta" className="landing__section landing__section--cta">
          <div className="landing__section-inner landing__cta-block">
            <h2>Prêt à modéliser ?</h2>
            <p>
              Ouvrez le simulateur et construisez votre premier réseau — ou
              démarrez directement sur l'exemple du distributeur.
            </p>

            <div className="landing__actions landing__actions--split">
              <div className="landing__actions-group">
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
                  onClick={openVendingDemo}
                >
                  Lancer la démo
                </button>
              </div>

              <div className="landing__actions-group">
                <button
                  type="button"
                  className="landing__cta landing__cta--ghost"
                  onClick={() => setGuideOpen(true)}
                >
                  <BookOpen size={16} />
                  Documentation
                </button>
              </div>
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

      {guideOpen && <GuideModal onClose={() => setGuideOpen(false)} />}
    </div>
  )
}