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
  GitBranch,
  ArrowRightLeft,
  ArrowUpDown,
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
}) {
  return (
    <header className="toolbar">
      <div className="toolbar__brand">
        <GitBranch size={20} />
        <span>RDP Simulator</span>
      </div>

      <fieldset className="toolbar__group">
        <legend>Objets</legend>
        <div className="toolbar__group-body">
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
                data-tooltip={m.label}
                aria-label={m.label}
              >
                <Icon size={16} />
              </button>
            )
          })}
        </div>
      </fieldset>

      <fieldset className="toolbar__group toolbar__group--display">
        <legend>Affichage</legend>
        <div className="toolbar__group-body">
          <button
            type="button"
            className={`btn btn--label ${orientation === 'LR' ? 'is-active' : ''}`}
            onClick={() => onOrientationChange('LR')}
            data-tooltip="Orientation gauche à droite"
            aria-label="Orientation gauche à droite"
          >
            <ArrowRightLeft size={14} />
          </button>
          <button
            type="button"
            className={`btn btn--label ${orientation === 'TB' ? 'is-active' : ''}`}
            onClick={() => onOrientationChange('TB')}
            data-tooltip="Orientation haut en bas"
            aria-label="Orientation haut en bas"
          >
            <ArrowUpDown size={14} />
          </button>
        </div>
      </fieldset>

      <fieldset className="toolbar__group toolbar__group--actions">
        <legend>Actions</legend>
        <div className="toolbar__group-body">
          {stepMode ? (
            <>
              <button
                type="button"
                className="btn btn--icon btn--info"
                onClick={onStepPrev}
                disabled={!canStepPrev}
                data-tooltip="Étape précédente"
                aria-label="Étape précédente"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn btn--icon btn--info"
                onClick={onStepNext}
                disabled={!canStep}
                data-tooltip="Étape suivante"
                aria-label="Étape suivante"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                className="btn btn--icon"
                onClick={onStepExit}
                data-tooltip="Quitter le mode pas à pas"
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
                data-tooltip={isPlaying ? 'Pause' : 'Lancer la simulation'}
                aria-label={isPlaying ? 'Pause' : 'Lancer la simulation'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                type="button"
                className="btn btn--icon btn--info"
                onClick={onStepEnter}
                disabled={!canStep}
                data-tooltip="Lancer en mode pas à pas"
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
            data-tooltip="Annuler (Ctrl+Z)"
            aria-label="Annuler"
          >
            <Undo2 size={16} />
          </button>
          <button
            type="button"
            className="btn btn--icon"
            onClick={onRedo}
            disabled={!canRedo}
            data-tooltip="Refaire (Ctrl+Y)"
            aria-label="Refaire"
          >
            <Redo2 size={16} />
          </button>

          <div className="toolbar__separator" />

          <button
            type="button"
            className="btn btn--icon btn--warning"
            onClick={onReset}
            data-tooltip="Restaurer le marquage initial"
            aria-label="Reset"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            className="btn btn--icon btn--danger"
            onClick={onClear}
            data-tooltip="Vider le canevas"
            aria-label="Vider"
          >
            <Eraser size={16} />
          </button>
        </div>
      </fieldset>
    </header>
  )
}