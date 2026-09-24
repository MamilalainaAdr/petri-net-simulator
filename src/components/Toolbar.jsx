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
  isPlaying,
  onPlayPause,
  onStep,
  onReset,
  onClear,
  canStep,
}) {
  return (
    <header className="toolbar">
      <div className="toolbar__brand">RDP Simulator</div>

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

      <div className="toolbar__group toolbar__group--right">
        <button type="button" className="btn" onClick={onPlayPause}>
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        <button
          type="button"
          className="btn"
          onClick={onStep}
          disabled={isPlaying || !canStep}
        >
          <StepForward size={16} />
          <span>Étape</span>
        </button>

        <button type="button" className="btn" onClick={onReset}>
          <RotateCcw size={16} />
          <span>Reset</span>
        </button>

        <button type="button" className="btn btn--danger" onClick={onClear}>
          <Eraser size={16} />
          <span>Vider</span>
        </button>
      </div>
    </header>
  )
}