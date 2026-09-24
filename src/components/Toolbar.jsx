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
  ChevronLeft,
  ChevronRight,
  X as XIcon,
  ArrowRightLeft,
  ArrowUpDown,
  GitBranch,
  Menu,
} from 'lucide-react'

const MODES = [
  { id: 'select', label: 'Sélectionner', icon: Hand },
  { id: 'place', label: 'Place', icon: Circle },
  { id: 'transition', label: 'Transition', icon: RectangleHorizontal },
  { id: 'arc', label: 'Arc', icon: ArrowRight },
  { id: 'token', label: 'Jeton', icon: CircleDot },
  { id: 'delete', label: 'Supprimer', icon: Trash2, danger: true },
]

export default function Toolbar({
  mode,
  onModeChange,
  orientation,
  onOrientationChange,
  isPlaying,
  onPlayPause,
  stepMode,
  onStepEnter,
  onStepPrev,
  onStepNext,
  onStepExit,
  canStep,
  canStepPrev,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onReset,
  onClear,
  sidebarOpen,
  onToggleSidebar,
}) {
  return (
    <header className="toolbar">
      <div className="toolbar__section toolbar__section--left">
        <span className="toolbar__brand" title="Simulateur RDP" aria-label="Simulateur RDP">
          <GitBranch size={18} />
        </span>

        <button
          type="button"
          className={`btn btn--icon ${sidebarOpen ? 'is-active' : ''}`}
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Masquer le panneau' : 'Afficher le panneau'}
          aria-label="Basculer le panneau latéral"
        >
          <Menu size={16} />
        </button>

        <div className="toolbar__separator" />

        {MODES.map((m) => {
          const Icon = m.icon
          const active = mode === m.id
          const cls = ['btn', 'btn--icon']
          if (active) cls.push('is-active')
          if (active && m.danger) cls.push('is-danger')
          return (
            <button
              key={m.id}
              type="button"
              className={cls.join(' ')}
              onClick={() => onModeChange(m.id)}
              title={m.label}
              aria-label={m.label}
            >
              <Icon size={16} />
            </button>
          )
        })}
      </div>

      <div className="toolbar__section toolbar__section--middle">
        <button
          type="button"
          className={`btn btn--icon ${orientation === 'LR' ? 'is-active' : ''}`}
          onClick={() => onOrientationChange('LR')}
          title="Orientation gauche à droite"
          aria-label="Orientation gauche à droite"
        >
          <ArrowRightLeft size={16} />
        </button>
        <button
          type="button"
          className={`btn btn--icon ${orientation === 'TB' ? 'is-active' : ''}`}
          onClick={() => onOrientationChange('TB')}
          title="Orientation haut en bas"
          aria-label="Orientation haut en bas"
        >
          <ArrowUpDown size={16} />
        </button>
      </div>

      <div className="toolbar__section toolbar__section--right">
        {stepMode ? (
          <>
            <button
              type="button"
              className="btn btn--icon btn--info"
              onClick={onStepPrev}
              disabled={!canStepPrev}
              title="Étape précédente"
              aria-label="Étape précédente"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="btn btn--icon btn--info"
              onClick={onStepNext}
              disabled={!canStep}
              title="Étape suivante"
              aria-label="Étape suivante"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              className="btn btn--icon"
              onClick={onStepExit}
              title="Quitter le mode pas à pas"
              aria-label="Quitter le mode pas à pas"
            >
              <XIcon size={16} />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className={`btn btn--icon ${isPlaying ? 'btn--warning' : 'btn--success'}`}
              onClick={onPlayPause}
              disabled={!isPlaying && !canStep}
              title={isPlaying ? 'Pause' : 'Lancer la simulation'}
              aria-label={isPlaying ? 'Pause' : 'Lancer la simulation'}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              type="button"
              className="btn btn--icon btn--info"
              onClick={onStepEnter}
              disabled={!canStep}
              title="Lancer en mode pas à pas"
              aria-label="Lancer en mode pas à pas"
            >
              <StepForward size={16} />
            </button>
          </>
        )}

        <div className="toolbar__separator" />

        <button
          type="button"
          className="btn btn--icon"
          onClick={onUndo}
          disabled={!canUndo}
          title="Annuler la dernière action (Ctrl+Z)"
          aria-label="Annuler"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          className="btn btn--icon"
          onClick={onRedo}
          disabled={!canRedo}
          title="Rétablir l'action annulée (Ctrl+Y)"
          aria-label="Refaire"
        >
          <Redo2 size={16} />
        </button>

        <div className="toolbar__separator" />

        <button
          type="button"
          className="btn btn--icon btn--warning"
          onClick={onReset}
          title="Restaurer le marquage initial"
          aria-label="Reset"
        >
          <RotateCcw size={16} />
        </button>
        <button
          type="button"
          className="btn btn--icon btn--danger"
          onClick={onClear}
          title="Vider le canevas"
          aria-label="Vider"
        >
          <Eraser size={16} />
        </button>
      </div>
    </header>
  )
}