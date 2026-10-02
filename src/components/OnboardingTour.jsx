import { useEffect, useLayoutEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

const STEPS = [
  {
    target: 'toolbar-objs',
    title: "Barre d'outils — Objets",
    text: "Choisissez ici l'outil actif : Sélectionner (déplacer / franchir), Place, Transition, Arc, Jeton, Supprimer.",
  },
  {
    target: 'toolbar-display',
    title: "Barre d'outils — Affichage",
    text: "Changez l'orientation du diagramme. LR = gauche à droite, HB = haut en bas.",
  },
  {
    target: 'toolbar-actions',
    title: "Barre d'outils — Actions",
    text: "Réglez la durée des animations, lancez la simulation (Play / Étape), annulez/refaites vos actions, réinitialisez le marquage ou videz le canevas.",
  },
  {
    target: 'playground',
    title: 'Playground',
    text: "Zone de travail. Cliquez sur le fond pour créer l'élément sélectionné, glissez pour déplacer la vue, utilisez la loupe en bas pour zoomer.",
  },
  {
    target: 'sidebar',
    title: 'Panneau latéral',
    text: 'Documentez votre projet : nom, description, description des places et transitions, marquage initial. Le panneau est pliable et redimensionnable.',
  },
  {
    target: 'export',
    title: 'Export PDF',
    text: "Le bouton Exporter génère un PDF A4 contenant la documentation du projet suivie d'un schéma par étape de simulation.",
  },
]

export default function OnboardingTour({ onClose }) {
  const [step, setStep] = useState(0)
  const [rect, setRect] = useState(null)
  const current = STEPS[step]
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  const measure = () => {
    const el = document.querySelector(`[data-tour="${current.target}"]`)
    if (!el) {
      setRect(null)
      return
    }
    const r = el.getBoundingClientRect()
    setRect({
      top: r.top,
      left: r.left,
      width: r.width,
      height: r.height,
    })
  }

  useLayoutEffect(() => {
    measure()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  useEffect(() => {
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onResize, true)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onResize, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  // Padding du spotlight autour du composant ciblé
  const pad = 6
  const spotStyle = rect
    ? {
        top: Math.max(0, rect.top - pad),
        left: Math.max(0, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null

  return (
    <div className="onboarding" role="dialog" aria-label="Guide de démarrage">
      {/* Overlay sombre avec découpe en spotlight */}
      {spotStyle ? (
        <div className="onboarding__spotlight" style={spotStyle} />
      ) : (
        <div className="onboarding__fullscrim" />
      )}

      {/* Card centrée à l'écran */}
      <div className="onboarding__card">
        <div className="onboarding__header">
          <span className="onboarding__step">
            {step + 1} / {STEPS.length}
          </span>
          <h3 className="onboarding__title">{current.title}</h3>
        </div>
        <p className="onboarding__text">{current.text}</p>
        <div className="onboarding__progress">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`onboarding__dot ${i === step ? 'is-active' : ''}`}
            />
          ))}
        </div>
        <div className="onboarding__actions">
          <button
            type="button"
            className="btn btn--icon"
            onClick={() => setStep((s) => s - 1)}
            disabled={isFirst}
            aria-label="Étape précédente"
          >
            <ChevronLeft size={16} />
          </button>
          {isLast ? (
            <button
              type="button"
              className="btn btn--success"
              onClick={onClose}
            >
              <Check size={16} />
              C'est compris
            </button>
          ) : (
            <button
              type="button"
              className="btn btn--info"
              onClick={() => setStep((s) => s + 1)}
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          )}
          <button
            type="button"
            className="btn"
            onClick={onClose}
            aria-label="Passer le guide"
          >
            Passer
          </button>
        </div>
      </div>
    </div>
  )
}