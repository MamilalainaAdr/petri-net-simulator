import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react'
import Toolbar from './components/Toolbar'
import Playground from './components/Playground'
import Sidebar from './components/Sidebar'
import Modal from './components/Modal'
import {
  createId,
  fireTransition,
  getEnabledTransitions,
  isTransitionEnabled,
} from './utils/petriNet'
import { exportProjectToPdf } from './utils/exportPdf'

const INITIAL_DOC = {
  project: { name: 'Sans titre', description: '' },
  orientation: 'LR',
  places: [],
  transitions: [],
  arcs: [],
}

const HINTS = {
  select:
    "Cliquez sur une transition franchissable pour la déclencher, glissez un noeud pour le déplacer, glissez le poids d'un arc pour le courber.",
  place: 'Cliquez sur le canevas pour ajouter une place.',
  transition: 'Cliquez sur le canevas pour ajouter une transition.',
  arc: "Cliquez sur une place puis sur une transition (ou l'inverse) pour créer un arc.",
  token: 'Cliquez sur une place pour ajouter un jeton.',
  delete: 'Cliquez sur un noeud ou un arc pour le supprimer.',
}

const STEP_DELAY = 3000
const FIRE_FLASH = 400

const SIDEBAR_MIN = 260
const SIDEBAR_MAX = 700
const SIDEBAR_DEFAULT = 360
const SIDEBAR_COLLAPSED = 44

// --- Modales ---

function DescriptionDialog({ title, onClose, onConfirm }) {
  const [value, setValue] = useState('')
  return (
    <Modal
      title={title}
      onClose={onClose}
      onConfirm={() => onConfirm(value.trim())}
    >
      <label className="field">
        <span>Description</span>
        <textarea
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={3}
          placeholder="Description courte"
        />
      </label>
    </Modal>
  )
}

function WeightDialog({ initial, onClose, onConfirm }) {
  const [value, setValue] = useState(String(initial ?? 1))
  const submit = () => {
    const n = Math.max(1, Math.floor(Number(value)) || 1)
    onConfirm(n)
  }
  return (
    <Modal title="Poids de l'arc" onClose={onClose} onConfirm={submit}>
      <label className="field">
        <span>Poids (entier supérieur ou égal à 1)</span>
        <input
          type="number"
          min={1}
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
      </label>
    </Modal>
  )
}

// --- App ---

export default function App() {
  const [state, setState] = useState({
    doc: INITIAL_DOC,
    past: [],
    future: [],
  })
  const docRef = useRef(state.doc)
  useEffect(() => {
    docRef.current = state.doc
  }, [state.doc])

  const doc = state.doc

  const [mode, setMode] = useState('select')
  const [arcSource, setArcSource] = useState(null)
  const [message, setMessage] = useState('')
  const [modal, setModal] = useState(null)
  const [sim, setSim] = useState({
    running: false,
    stepMode: false,
    states: [],
    index: 0,
    lastFired: null,
  })
  const [exporting, setExporting] = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT)

  const { places, transitions, arcs, orientation, project } = doc

  const enabledTransitions = useMemo(
    () => getEnabledTransitions(transitions, arcs, places),
    [transitions, arcs, places]
  )
  const enabledIds = useMemo(
    () => new Set(enabledTransitions.map((t) => t.id)),
    [enabledTransitions]
  )

  // --------- Historique ---------

  const resetSim = useCallback(() => {
    setSim({
      running: false,
      stepMode: false,
      states: [],
      index: 0,
      lastFired: null,
    })
  }, [])

  const applyDoc = useCallback(
    (newDoc, history = true, keepSim = false) => {
      if (newDoc === docRef.current) return
      docRef.current = newDoc
      if (history && !keepSim) resetSim()
      setState((s) => {
        if (!history) return { ...s, doc: newDoc }
        return {
          doc: newDoc,
          past: [...s.past.slice(-49), s.doc],
          future: [],
        }
      })
    },
    [resetSim]
  )

  const undo = useCallback(() => {
    resetSim()
    setState((s) => {
      if (s.past.length === 0) return s
      const prev = s.past[s.past.length - 1]
      docRef.current = prev
      return {
        doc: prev,
        past: s.past.slice(0, -1),
        future: [s.doc, ...s.future].slice(0, 50),
      }
    })
    setMessage('Action annulée')
  }, [resetSim])

  const redo = useCallback(() => {
    resetSim()
    setState((s) => {
      if (s.future.length === 0) return s
      const next = s.future[0]
      docRef.current = next
      return {
        doc: next,
        past: [...s.past, s.doc].slice(-50),
        future: s.future.slice(1),
      }
    })
    setMessage('Action rétablie')
  }, [resetSim])

  // --------- Raccourcis clavier ---------

  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const meta = e.ctrlKey || e.metaKey
      if (!meta) return
      if (e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [undo, redo])

  // --------- Extinction du flash ---------

  useEffect(() => {
    if (!sim.lastFired) return
    const id = sim.lastFired.id
    const t = setTimeout(() => {
      setSim((s) => (s.lastFired?.id === id ? { ...s, lastFired: null } : s))
    }, FIRE_FLASH)
    return () => clearTimeout(t)
  }, [sim.lastFired])

  // --------- Drag helpers ---------

  const dragBeforeRef = useRef(null)
  const beginEdit = useCallback(() => {
    dragBeforeRef.current = docRef.current
  }, [])
  const endEdit = useCallback(() => {
    const before = dragBeforeRef.current
    dragBeforeRef.current = null
    if (!before || before === docRef.current) return
    setState((s) => ({
      ...s,
      past: [...s.past.slice(-49), before],
      future: [],
    }))
  }, [])

  // --------- Resize sidebar ---------

  const handleSidebarResizer = useCallback(
    (e) => {
      e.preventDefault()
      const startX = e.clientX
      const startWidth = sidebarWidth
      const onMove = (ev) => {
        const delta = startX - ev.clientX
        const next = Math.max(
          SIDEBAR_MIN,
          Math.min(SIDEBAR_MAX, startWidth + delta)
        )
        setSidebarWidth(next)
      }
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [sidebarWidth]
  )

  // --------- Simulation ---------

  const snapshotTokens = (placesList) => {
    const tokens = {}
    placesList.forEach((p) => {
      tokens[p.id] = p.tokens
    })
    return tokens
  }

  const doStepNext = useCallback(() => {
    const current = docRef.current
    const enabled = getEnabledTransitions(
      current.transitions,
      current.arcs,
      current.places
    )
    if (enabled.length === 0) return false

    const t = enabled[0]
    const newPlaces = fireTransition(t.id, current.places, current.arcs)
    const newDoc = { ...current, places: newPlaces }
    docRef.current = newDoc

    setSim((s) => {
      let states = s.states
      let index = s.index
      if (states.length === 0) {
        states = [{ tokens: snapshotTokens(current.places), firedId: null }]
        index = 0
      } else {
        states = states.slice(0, index + 1)
      }
      states = [...states, { tokens: snapshotTokens(newPlaces), firedId: t.id }]
      return {
        ...s,
        states,
        index: index + 1,
        lastFired: { id: t.id, at: Date.now() },
      }
    })
    setState((s) => ({ ...s, doc: newDoc }))
    setMessage(`Transition ${t.label} franchie`)
    return true
  }, [])

  useEffect(() => {
    if (!sim.running) return
    const t = setTimeout(() => {
      const ok = doStepNext()
      if (!ok) {
        setSim((s) => ({ ...s, running: false }))
        setMessage('Aucune transition franchissable, simulation terminée')
      }
    }, STEP_DELAY)
    return () => clearTimeout(t)
  }, [sim.running, sim.index, doStepNext])

  // --------- Actions UI ---------

  const handleModeChange = (next) => {
    setMode(next)
    setArcSource(null)
    setMessage('')
  }

  const handleOrientationChange = (next) => {
    if (next === orientation) return
    applyDoc({ ...docRef.current, orientation: next }, true, true)
    setMessage(
      `Orientation ${next === 'LR' ? 'gauche à droite' : 'haut en bas'}`
    )
  }

  const handleCanvasClick = (x, y) => {
    if (mode === 'place') {
      setModal({ type: 'newPlace', data: { x, y } })
      return
    }
    if (mode === 'transition') {
      setModal({ type: 'newTransition', data: { x, y } })
      return
    }
    if (mode === 'arc') {
      setArcSource(null)
      setMessage('')
    }
  }

  const handleMoveNode = useCallback(
    (nodeType, nodeId, x, y) => {
      const current = docRef.current
      const list = nodeType === 'place' ? current.places : current.transitions
      const newList = list.map((n) => (n.id === nodeId ? { ...n, x, y } : n))
      const newDoc =
        nodeType === 'place'
          ? { ...current, places: newList }
          : { ...current, transitions: newList }
      applyDoc(newDoc, false)
    },
    [applyDoc]
  )

  const handleBendChange = useCallback(
    (arcId, bend) => {
      const current = docRef.current
      const newArcs = current.arcs.map((a) =>
        a.id === arcId ? { ...a, bend } : a
      )
      applyDoc({ ...current, arcs: newArcs }, false)
    },
    [applyDoc]
  )

  const handleDeleteArc = (arcId) => {
    applyDoc({
      ...docRef.current,
      arcs: docRef.current.arcs.filter((a) => a.id !== arcId),
    })
    setMessage('Arc supprimé')
  }

  const handleEditArcWeight = (arcId) => {
    const arc = docRef.current.arcs.find((a) => a.id === arcId)
    if (!arc) return
    setModal({
      type: 'editWeight',
      data: { arcId, initial: arc.weight ?? 1 },
    })
  }

  const deleteNode = (nodeType, nodeId) => {
    const current = docRef.current
    const newDoc =
      nodeType === 'place'
        ? {
            ...current,
            places: current.places.filter((p) => p.id !== nodeId),
            arcs: current.arcs.filter(
              (a) => a.from !== nodeId && a.to !== nodeId
            ),
          }
        : {
            ...current,
            transitions: current.transitions.filter((t) => t.id !== nodeId),
            arcs: current.arcs.filter(
              (a) => a.from !== nodeId && a.to !== nodeId
            ),
          }
    applyDoc(newDoc)
    setMessage('Noeud supprimé')
  }

  const fireNode = (transitionId) => {
    const current = docRef.current
    const transition = current.transitions.find((t) => t.id === transitionId)
    if (!transition) return
    if (!isTransitionEnabled(transition, current.arcs, current.places)) {
      setMessage(`Transition ${transition.label} non franchissable`)
      return
    }
    const newPlaces = fireTransition(transitionId, current.places, current.arcs)
    const newDoc = { ...current, places: newPlaces }
    docRef.current = newDoc
    setSim((s) => ({ ...s, lastFired: { id: transitionId, at: Date.now() } }))
    setState((s) => ({ ...s, doc: newDoc }))
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
      const current = docRef.current
      if (current.arcs.some((a) => a.from === from && a.to === to)) {
        setArcSource(null)
        setMessage('Cet arc existe déjà')
        return
      }
      applyDoc({
        ...current,
        arcs: [
          ...current.arcs,
          { id: createId('A'), from, to, weight: 1, bend: 0 },
        ],
      })
      setArcSource(null)
      setMessage('Arc ajouté')
      return
    }

    if (mode === 'token' && nodeType === 'place') {
      const current = docRef.current
      applyDoc({
        ...current,
        places: current.places.map((p) =>
          p.id === nodeId
            ? {
                ...p,
                tokens: p.tokens + 1,
                initialTokens: (p.initialTokens ?? 0) + 1,
              }
            : p
        ),
      })
      return
    }

    if (mode === 'delete') {
      deleteNode(nodeType, nodeId)
      return
    }

    if (mode === 'select' && nodeType === 'transition' && !sim.stepMode) {
      fireNode(nodeId)
    }
  }

  // --------- Modales : confirmations ---------

  const confirmNewPlace = (description) => {
    const current = docRef.current
    const { x, y } = modal.data
    const id = createId('P')
    const label = `P${current.places.length + 1}`
    const newPlace = {
      id,
      type: 'place',
      x,
      y,
      label,
      description,
      tokens: 0,
      initialTokens: 0,
    }
    applyDoc({ ...current, places: [...current.places, newPlace] })
    setModal(null)
    setMessage(`Place ${label} ajoutée`)
  }

  const confirmNewTransition = (description) => {
    const current = docRef.current
    const { x, y } = modal.data
    const id = createId('T')
    const label = `T${current.transitions.length + 1}`
    const newTransition = {
      id,
      type: 'transition',
      x,
      y,
      label,
      description,
    }
    applyDoc({
      ...current,
      transitions: [...current.transitions, newTransition],
    })
    setModal(null)
    setMessage(`Transition ${label} ajoutée`)
  }

  const confirmWeight = (weight) => {
    const current = docRef.current
    const { arcId } = modal.data
    applyDoc({
      ...current,
      arcs: current.arcs.map((a) => (a.id === arcId ? { ...a, weight } : a)),
    })
    setModal(null)
    setMessage(`Poids de l'arc modifié : ${weight}`)
  }

  // --------- Simulation : contrôles ---------

  const handleStepEnter = () => {
    if (enabledTransitions.length === 0) {
      setMessage('Aucune transition franchissable')
      return
    }
    setSim({
      running: false,
      stepMode: true,
      states: [{ tokens: snapshotTokens(places), firedId: null }],
      index: 0,
      lastFired: null,
    })
    setMessage('Mode pas à pas activé')
  }

  const handleStepExit = () => {
    setSim((s) => ({ ...s, stepMode: false, running: false }))
    setMessage('Mode pas à pas quitté')
  }

  const handleStepPrev = () => {
    if (sim.index <= 0) return
    const newIndex = sim.index - 1
    const snap = sim.states[newIndex]
    const current = docRef.current
    const newPlaces = current.places.map((p) => ({
      ...p,
      tokens: snap.tokens[p.id] ?? p.tokens,
    }))
    const newDoc = { ...current, places: newPlaces }
    docRef.current = newDoc
    setState((s) => ({ ...s, doc: newDoc }))
    setSim((s) => ({ ...s, index: newIndex, lastFired: null }))
    setMessage('Étape précédente')
  }

  const handleStepNext = () => {
    const ok = doStepNext()
    if (!ok) setMessage('Aucune transition franchissable')
  }

  const handlePlayPause = () => {
    if (sim.running) {
      setSim((s) => ({ ...s, running: false }))
      setMessage('Simulation en pause')
      return
    }
    if (enabledTransitions.length === 0) {
      setMessage('Aucune transition franchissable')
      return
    }
    setSim((s) => {
      if (s.states.length === 0) {
        return {
          ...s,
          running: true,
          states: [{ tokens: snapshotTokens(places), firedId: null }],
          index: 0,
        }
      }
      return { ...s, running: true }
    })
    setMessage('Simulation en cours')
  }

  const handleReset = () => {
    resetSim()
    const current = docRef.current
    const newPlaces = current.places.map((p) => ({
      ...p,
      tokens: p.initialTokens ?? 0,
    }))
    applyDoc({ ...current, places: newPlaces }, true, true)
    setMessage('Marquage initial restauré')
  }

  const handleClear = () => {
    const currentOrientation = docRef.current.orientation
    applyDoc({ ...INITIAL_DOC, orientation: currentOrientation })
    setArcSource(null)
    setModal(null)
    setMessage('Canevas vidé')
  }

  // --------- Export PDF ---------

  const canExport = enabledTransitions.length > 0

  const handleExport = useCallback(async () => {
    if (exporting || !canExport) return
    setExporting(true)
    setMessage('Préparation du PDF...')
    try {
      await exportProjectToPdf(docRef.current)
      setMessage('Export PDF terminé')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setMessage("Erreur lors de l'export PDF")
    } finally {
      setExporting(false)
    }
  }, [exporting, canExport])

  // --------- Sidebar ---------

  const handleProjectChange = (patch) => {
    const current = docRef.current
    applyDoc(
      { ...current, project: { ...current.project, ...patch } },
      true,
      true
    )
  }

  const handlePlaceChange = (placeId, patch) => {
    const current = docRef.current
    const touchesMarking = 'initialTokens' in patch
    applyDoc(
      {
        ...current,
        places: current.places.map((p) => {
          if (p.id !== placeId) return p
          const next = { ...p, ...patch }
          if (touchesMarking) next.tokens = patch.initialTokens
          return next
        }),
      },
      true,
      !touchesMarking
    )
  }

  const handleTransitionChange = (transitionId, patch) => {
    const current = docRef.current
    applyDoc(
      {
        ...current,
        transitions: current.transitions.map((t) =>
          t.id === transitionId ? { ...t, ...patch } : t
        ),
      },
      true,
      true
    )
  }

  const canUndo = state.past.length > 0
  const canRedo = state.future.length > 0

  return (
    <div className="app">
      <Toolbar
        mode={mode}
        onModeChange={handleModeChange}
        orientation={orientation}
        onOrientationChange={handleOrientationChange}
        isPlaying={sim.running}
        onPlayPause={handlePlayPause}
        stepMode={sim.stepMode}
        onStepEnter={handleStepEnter}
        onStepPrev={handleStepPrev}
        onStepNext={handleStepNext}
        onStepExit={handleStepExit}
        canStep={enabledTransitions.length > 0}
        canStepPrev={sim.index > 0}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onReset={handleReset}
        onClear={handleClear}
      />

      <div className="app__body">
        <Playground
          places={places}
          transitions={transitions}
          arcs={arcs}
          orientation={orientation}
          mode={mode}
          arcSource={arcSource}
          enabledIds={enabledIds}
          firedId={sim.lastFired?.id ?? null}
          onCanvasClick={handleCanvasClick}
          onNodeClick={handleNodeClick}
          onMoveNode={handleMoveNode}
          onDeleteArc={handleDeleteArc}
          onEditArcWeight={handleEditArcWeight}
          onBendChange={handleBendChange}
          onEditBegin={beginEdit}
          onEditEnd={endEdit}
        />

        <div
          className={`sidebar-shell ${sidebarOpen ? 'is-open' : 'is-collapsed'}`}
          style={{ width: sidebarOpen ? sidebarWidth : SIDEBAR_COLLAPSED }}
        >
          <div className="sidebar-shell__header">
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarOpen((v) => !v)}
              data-tooltip={
                sidebarOpen ? 'Masquer le panneau' : 'Afficher le panneau'
              }
              data-tooltip-pos="left"
              aria-label={
                sidebarOpen ? 'Masquer le panneau' : 'Afficher le panneau'
              }
            >
              {sidebarOpen ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>

            <button
              type="button"
              className="sidebar-export"
              onClick={handleExport}
              disabled={!canExport || exporting}
              data-tooltip="Exporter le projet"
              data-tooltip-pos="left"
              aria-label="Exporter le projet"
            >
              <FileDown size={16} />
              {sidebarOpen && <span>Exporter</span>}
            </button>
          </div>

          {sidebarOpen && (
            <div className="sidebar-shell__body">
              <div
                className="sidebar-shell__resizer"
                onPointerDown={handleSidebarResizer}
                role="separator"
                aria-orientation="vertical"
              />
              <Sidebar
                project={project}
                places={places}
                transitions={transitions}
                arcs={arcs}
                onProjectChange={handleProjectChange}
                onPlaceChange={handlePlaceChange}
                onTransitionChange={handleTransitionChange}
              />
            </div>
          )}
        </div>
      </div>

      <footer className="statusbar">
        <span className="statusbar__hint">{HINTS[mode]}</span>
        <span className="statusbar__message">
          {message ||
            `${places.length} place(s) · ${transitions.length} transition(s) · ${arcs.length} arc(s) · ${enabledTransitions.length} franchissable(s)`}
        </span>
      </footer>

      {modal?.type === 'newPlace' && (
        <DescriptionDialog
          title="Nouvelle place"
          onClose={() => setModal(null)}
          onConfirm={confirmNewPlace}
        />
      )}
      {modal?.type === 'newTransition' && (
        <DescriptionDialog
          title="Nouvelle transition"
          onClose={() => setModal(null)}
          onConfirm={confirmNewTransition}
        />
      )}
      {modal?.type === 'editWeight' && (
        <WeightDialog
          initial={modal.data.initial}
          onClose={() => setModal(null)}
          onConfirm={confirmWeight}
        />
      )}
    </div>
  )
}