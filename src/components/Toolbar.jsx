import {
  MousePointer2,
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
} from 'lucide-react'

const MODES = [
  { id: 'select', label: 'Sélectionner', icon: MousePointer2 },
  { id: 'place', label: 'Place', icon: Circle },
  { id: 'transition', label: 'Transition', icon: RectangleHorizontal },
  { id: 'arc', label: 'Arc', icon: ArrowRight },
  { id: 'token', label: 'Jeton', icon: CircleDot },
  { id: 'delete', label: 'Supprimer', icon: Trash2 },
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
      <div className="toolbar__brand">Simulateur RDP</div>

      <div className="toolbar__group">
        {MODES.map((m) => {
          const Icon = m.icon
          const active = mode === m.id
          return (
            <button
              key={m.id}
              type="button"
              className={`btn ${active ? 'is-active' : ''}`}
              onClick={() => onModeChange(m.id)}
              title={m.label}
            >
              <Icon size={16} />
              <span>{m.label}</span>
            </button>
          )
        })}
      </div>

      <div className="toolbar__group">
        <span className="toolbar__label">Orientation</span>
        <button
          type="button"
          className={`btn ${orientation === 'LR' ? 'is-active' : ''}`}
          onClick={() => onOrientationChange('LR')}
          title="Graphe orienté gauche à droite"
        >
          <ArrowRightLeft size={16} />
          <span>LR</span>
        </button>
        <button
          type="button"
          className={`btn ${orientation === 'TB' ? 'is-active' : ''}`}
          onClick={() => onOrientationChange('TB')}
          title="Graphe orienté de haut en bas"
        >
          <ArrowUpDown size={16} />
          <span>TB</span>
        </button>
      </div>

      <div className="toolbar__group toolbar__group--right">
        <button
          type="button"
          className="btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Annuler la dernière action (Ctrl+Z)"
        >
          <Undo2 size={16} />
          <span>Annuler</span>
        </button>
        <button
          type="button"
          className="btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Rétablir l'action annulée (Ctrl+Y)"
        >
          <Redo2 size={16} />
          <span>Refaire</span>
        </button>

        <div className="toolbar__separator" />

        {stepMode ? (
          <>
            <button
              type="button"
              className="btn"
              onClick={onStepPrev}
              disabled={!canStepPrev}
              title="Revenir à l'étape précédente"
            >
              <ChevronLeft size={16} />
              <span>Précédent</span>
            </button>
            <button
              type="button"
              className="btn btn--primary"
              onClick={onStepNext}
              disabled={!canStep}
              title="Franchir la transition suivante"
            >
              <ChevronRight size={16} />
              <span>Suivant</span>
            </button>
            <button
              type="button"
              className="btn"
              onClick={onStepExit}
              title="Quitter le mode pas à pas"
            >
              <XIcon size={16} />
              <span>Quitter</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn"
              onClick={onPlayPause}
              disabled={!isPlaying && !canStep}
              title="Lancer ou mettre en pause la simulation"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              type="button"
              className="btn"
              onClick={onStepEnter}
              disabled={!canStep}
              title="Lancer en mode pas à pas"
            >
              <StepForward size={16} />
              <span>Étape</span>
            </button>
          </>
        )}

        <div className="toolbar__separator" />

        <button type="button" className="btn" onClick={onReset} title="Restaurer le marquage initial">
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>
        <button type="button" className="btn btn--danger" onClick={onClear} title="Vider le canevas">
          <Eraser size={16} />
          <span>Vider</span>
        </button>
      </div>
    </header>
  )
}