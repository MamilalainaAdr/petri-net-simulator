import {
  Hand,
  Circle,
  RectangleHorizontal,
  ArrowRight,
  CircleDot,
  Trash2,
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Eraser,
  Undo2,
  Redo2,
  ArrowRightLeft,
  Sun,
  FileDown,
  ChevronRight,
  X,
} from 'lucide-react'

const SECTIONS = [
  {
    title: "Barre d'outils — Objets",
    items: [
      { icon: Hand, title: 'Sélectionner', text: 'Déplacer un noeud, franchir une transition, courber un arc, déplacer la vue.' },
      { icon: Circle, title: 'Place', text: 'Cliquer sur le canevas pour ajouter une place.' },
      { icon: RectangleHorizontal, title: 'Transition', text: 'Cliquer sur le canevas pour ajouter une transition.' },
      { icon: ArrowRight, title: 'Arc', text: 'Cliquer sur une place puis sur une transition (ou inversement).' },
      { icon: CircleDot, title: 'Jeton', text: 'Cliquer sur une place pour y ajouter un jeton.' },
      { icon: Trash2, title: 'Supprimer', text: 'Cliquer sur un noeud ou un arc pour le supprimer.' },
    ],
  },
  {
    title: "Barre d'outils — Affichage",
    items: [
      { icon: ArrowRightLeft, title: 'Orientation LR / HB', text: 'Change le sens du diagramme : gauche-droite ou haut-bas.' },
      { icon: Sun, title: 'Thème', text: 'Bascule entre mode sombre et mode clair.' },
    ],
  },
  {
    title: "Barre d'outils — Actions",
    items: [
      { icon: Play, title: 'Play / Pause', text: 'Lance ou met en pause la simulation automatique.' },
      { icon: StepForward, title: 'Étape', text: 'Active le mode pas à pas (Précédent / Suivant / Quitter).' },
      { icon: Undo2, title: 'Annuler', text: 'Annule la dernière action (Ctrl+Z).' },
      { icon: Redo2, title: 'Refaire', text: "Rétablit l'action annulée (Ctrl+Y)." },
      { icon: RotateCcw, title: 'Reset', text: 'Restaure le marquage initial.' },
      { icon: Eraser, title: 'Vider', text: 'Efface tout le canevas.' },
    ],
  },
  {
    title: 'Panneau latéral',
    items: [
      { icon: ChevronRight, title: 'Pliage', text: 'Masquer ou afficher le panneau.' },
      { icon: FileDown, title: 'Exporter', text: 'Génère un PDF du projet et de la simulation.' },
    ],
  },
]

export default function GuideModal({ onClose }) {
  return (
    <div className="guide-modal" onPointerDown={onClose}>
      <div
        className="guide-modal__panel"
        onPointerDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Guide d'utilisation"
      >
        <div className="guide-modal__header">
          <h2>Guide d'utilisation</h2>
          <button
            type="button"
            className="guide-modal__close"
            onClick={onClose}
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="guide-modal__body">
          {SECTIONS.map((section) => (
            <section key={section.title} className="guide-modal__section">
              <h3>{section.title}</h3>
              <div className="guide-modal__grid">
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="guide-modal__item">
                      <span className="guide-modal__item-icon">
                        <Icon size={18} />
                      </span>
                      <div className="guide-modal__item-body">
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}