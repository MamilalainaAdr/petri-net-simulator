import { useCallback, useEffect, useMemo, useState } from 'react'
import Toolbar from './components/Toolbar'
import Playground from './components/Playground'
import {
  createId,
  fireTransition,
  getEnabledTransitions,
  isTransitionEnabled,
} from './utils/petriNet'

const HINTS = {
  select:
    "Cliquez sur une transition franchissable pour la déclencher, ou glissez un noeud pour le déplacer.",
  place: 'Cliquez sur le canevas pour ajouter une place.',
  transition: 'Cliquez sur le canevas pour ajouter une transition.',
  arc: "Cliquez sur une place puis sur une transition (ou l'inverse) pour créer un arc.",
  token: 'Cliquez sur une place pour ajouter un jeton.',
  delete: 'Cliquez sur un noeud ou un arc pour le supprimer.',
}

const STEP_DELAY = 700
const FIRE_FLASH = 400

export default function App() {
  const [mode, setMode] = useState('select')
  const [places, setPlaces] = useState([])
  const [transitions, setTransitions] = useState([])
  const [arcs, setArcs] = useState([])
  const [arcSource, setArcSource] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [lastFired, setLastFired] = useState(null)
  const [message, setMessage] = useState('')
  const [initialMarking, setInitialMarking] = useState(null)

  const enabledTransitions = useMemo(
    () => getEnabledTransitions(transitions, arcs, places),
    [transitions, arcs, places]
  )

  const enabledIds = useMemo(
    () => new Set(enabledTransitions.map((t) => t.id)),
    [enabledTransitions]
  )

  // Efface le surlignage de la dernière transition franchie
  useEffect(() => {
    if (!lastFired) return
    const timer = setTimeout(() => setLastFired(null), FIRE_FLASH)
    return () => clearTimeout(timer)
  }, [lastFired])

  const handleModeChange = (next) => {
    setMode(next)
    setArcSource(null)
    setMessage('')
  }

  const handleCanvasClick = (x, y) => {
    if (mode === 'place') {
      const id = createId('P')
      setPlaces((prev) => [
        ...prev,
        { id, type: 'place', x, y, tokens: 0, label: `P${prev.length + 1}` },
      ])
      setMessage('')
      return
    }

    if (mode === 'transition') {
      const id = createId('T')
      setTransitions((prev) => [
        ...prev,
        { id, type: 'transition', x, y, label: `T${prev.length + 1}` },
      ])
      setMessage('')
      return
    }

    if (mode === 'arc') {
      setArcSource(null)
      setMessage('')
    }
  }

  const handleMoveNode = (nodeType, nodeId, x, y) => {
    const setter = nodeType === 'place' ? setPlaces : setTransitions
    setter((prev) => prev.map((n) => (n.id === nodeId ? { ...n, x, y } : n)))
  }

  const deleteNode = (nodeType, nodeId) => {
    if (nodeType === 'place') {
      setPlaces((prev) => prev.filter((p) => p.id !== nodeId))
    } else {
      setTransitions((prev) => prev.filter((t) => t.id !== nodeId))
    }
    setArcs((prev) => prev.filter((a) => a.from !== nodeId && a.to !== nodeId))
    setIsPlaying(false)
    setMessage('Noeud supprimé')
  }

  const handleDeleteArc = (arcId) => {
    setArcs((prev) => prev.filter((a) => a.id !== arcId))
    setIsPlaying(false)
    setMessage('Arc supprimé')
  }

  const fireNode = (transitionId) => {
    const transition = transitions.find((t) => t.id === transitionId)
    if (!transition) return

    if (!isTransitionEnabled(transition, arcs, places)) {
      setMessage(`Transition ${transition.label} non franchissable`)
      return
    }

    setPlaces((prev) => fireTransition(transitionId, prev, arcs))
    setLastFired({ id: transitionId, at: Date.now() })
    setMessage(`Transition ${transition.label} franchie`)
  }

  const handleNodeClick = (nodeType, nodeId) => {
    if (mode === 'arc') {
      if (!arcSource) {
        setArcSource({ type: nodeType, id: nodeId })
        setMessage("Sélectionnez la cible de l'arc")
        return
      }

      if (arcSource.id === nodeId) {
        setArcSource(null)
        setMessage('')
        return
      }

      if (arcSource.type === nodeType) {
        setArcSource({ type: nodeType, id: nodeId })
        setMessage('Un arc doit relier une place à une transition')
        return
      }

      const from = arcSource.id
      const to = nodeId
      setArcs((prev) => {
        if (prev.some((a) => a.from === from && a.to === to)) return prev
        return [...prev, { id: createId('A'), from, to }]
      })
      setArcSource(null)
      setMessage('Arc ajouté')
      return
    }

    if (mode === 'token' && nodeType === 'place') {
      setPlaces((prev) =>
        prev.map((p) => (p.id === nodeId ? { ...p, tokens: p.tokens + 1 } : p))
      )
      return
    }

    if (mode === 'delete') {
      deleteNode(nodeType, nodeId)
      return
    }

    if (mode === 'select' && nodeType === 'transition') {
      fireNode(nodeId)
    }
  }

  const step = useCallback(() => {
    const enabled = getEnabledTransitions(transitions, arcs, places)
    if (enabled.length === 0) return false

    const transition = enabled[0]
    setPlaces((prev) => fireTransition(transition.id, prev, arcs))
    setLastFired({ id: transition.id, at: Date.now() })
    setMessage(`Transition ${transition.label} franchie`)
    return true
  }, [transitions, arcs, places])

  // Boucle de simulation automatique
  useEffect(() => {
    if (!isPlaying) return
    const timer = setTimeout(() => {
      const ok = step()
      if (!ok) {
        setIsPlaying(false)
        setMessage('Aucune transition franchissable, simulation terminée')
      }
    }, STEP_DELAY)
    return () => clearTimeout(timer)
  }, [isPlaying, step])

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false)
      setMessage('Simulation en pause')
      return
    }

    if (enabledTransitions.length === 0) {
      setMessage('Aucune transition franchissable')
      return
    }

    if (!initialMarking) {
      setInitialMarking(places.map((p) => ({ id: p.id, tokens: p.tokens })))
    }

    setIsPlaying(true)
    setMessage('Simulation en cours')
  }

  const handleStep = () => {
    if (!initialMarking) {
      setInitialMarking(places.map((p) => ({ id: p.id, tokens: p.tokens })))
    }
    const ok = step()
    if (!ok) setMessage('Aucune transition franchissable')
  }

  const handleReset = () => {
    setIsPlaying(false)
    setLastFired(null)

    if (!initialMarking) {
      setMessage('Aucun marquage initial enregistré')
      return
    }

    setPlaces((prev) =>
      prev.map((p) => {
        const saved = initialMarking.find((m) => m.id === p.id)
        return saved ? { ...p, tokens: saved.tokens } : p
      })
    )
    setMessage('Marquage initial restauré')
  }

  const handleClear = () => {
    setIsPlaying(false)
    setPlaces([])
    setTransitions([])
    setArcs([])
    setArcSource(null)
    setLastFired(null)
    setInitialMarking(null)
    setMessage('Canevas vidé')
  }

  return (
    <div className="app">
      <Toolbar
        mode={mode}
        onModeChange={handleModeChange}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onStep={handleStep}
        onReset={handleReset}
        onClear={handleClear}
        canStep={enabledTransitions.length > 0}
      />

      <Playground
        places={places}
        transitions={transitions}
        arcs={arcs}
        mode={mode}
        arcSource={arcSource}
        enabledIds={enabledIds}
        firedId={lastFired?.id ?? null}
        onCanvasClick={handleCanvasClick}
        onNodeClick={handleNodeClick}
        onMoveNode={handleMoveNode}
        onDeleteArc={handleDeleteArc}
      />

      <footer className="statusbar">
        <span className="statusbar__hint">{HINTS[mode]}</span>
        <span className="statusbar__message">
          {message ||
            `${places.length} place(s) · ${transitions.length} transition(s) · ${arcs.length} arc(s) · ${enabledTransitions.length} franchissable(s)`}
        </span>
      </footer>
    </div>
  )
}