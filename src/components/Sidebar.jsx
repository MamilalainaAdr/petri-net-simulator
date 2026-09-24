import { useEffect, useState } from 'react'

function EditableText({ value, onChange, multiline, placeholder }) {
  const [local, setLocal] = useState(value ?? '')
  useEffect(() => setLocal(value ?? ''), [value])

  const commit = () => {
    if (local !== (value ?? '')) onChange(local)
  }

  if (multiline) {
    return (
      <textarea
        value={local}
        placeholder={placeholder}
        onChange={(e) => setLocal(e.target.value)}
        onBlur={commit}
        rows={3}
      />
    )
  }
  return (
    <input
      type="text"
      value={local}
      placeholder={placeholder}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
    />
  )
}

function EditableNumber({ value, onChange, min = 0 }) {
  const [local, setLocal] = useState(String(value ?? 0))
  useEffect(() => setLocal(String(value ?? 0)), [value])

  const commit = () => {
    const n = Math.max(min, Math.floor(Number(local)) || 0)
    if (n !== value) onChange(n)
    else setLocal(String(value ?? 0))
  }

  return (
    <input
      type="number"
      min={min}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur()
      }}
    />
  )
}

export default function Sidebar({
  project,
  places,
  transitions,
  arcs,
  onProjectChange,
  onPlaceChange,
  onTransitionChange,
}) {
  const labelFor = (id) => {
    const p = places.find((x) => x.id === id)
    const t = transitions.find((x) => x.id === id)
    return p?.label || t?.label || id
  }

  return (
    <aside className="sidebar">
      <section className="sidebar__section">
        <h3>Projet</h3>
        <label className="field">
          <span>Nom du projet</span>
          <EditableText
            value={project.name}
            onChange={(v) => onProjectChange({ name: v })}
            placeholder="Sans titre"
          />
        </label>
        <label className="field">
          <span>Description</span>
          <EditableText
            value={project.description}
            onChange={(v) => onProjectChange({ description: v })}
            multiline
            placeholder="Brève description du projet"
          />
        </label>
      </section>

      <section className="sidebar__section">
        <h3>Description des places</h3>
        {places.length === 0 ? (
          <p className="sidebar__empty">Aucune place</p>
        ) : (
          <table className="sidebar__table">
            <thead>
              <tr>
                <th>Place</th>
                <th>Description</th>
                <th>Marquage initial</th>
              </tr>
            </thead>
            <tbody>
              {places.map((p) => (
                <tr key={p.id}>
                  <td className="cell-label">{p.label}</td>
                  <td>
                    <EditableText
                      value={p.description}
                      onChange={(v) => onPlaceChange(p.id, { description: v })}
                      placeholder="—"
                    />
                  </td>
                  <td className="cell-number">
                    <EditableNumber
                      value={p.initialTokens ?? 0}
                      onChange={(v) => onPlaceChange(p.id, { initialTokens: v })}
                      min={0}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="sidebar__section">
        <h3>Description des transitions</h3>
        {transitions.length === 0 ? (
          <p className="sidebar__empty">Aucune transition</p>
        ) : (
          <table className="sidebar__table">
            <thead>
              <tr>
                <th>Transition</th>
                <th>Description</th>
                <th>Entrées</th>
                <th>Sorties</th>
              </tr>
            </thead>
            <tbody>
              {transitions.map((t) => {
                const inputs = arcs.filter((a) => a.to === t.id)
                const outputs = arcs.filter((a) => a.from === t.id)
                const format = (list, side) => {
                  if (list.length === 0) return '—'
                  return list
                    .map((a) => {
                      const pid = side === 'in' ? a.from : a.to
                      return `{${labelFor(pid)} (${a.weight ?? 1})}`
                    })
                    .join(', ')
                }
                return (
                  <tr key={t.id}>
                    <td className="cell-label">{t.label}</td>
                    <td>
                      <EditableText
                        value={t.description}
                        onChange={(v) =>
                          onTransitionChange(t.id, { description: v })
                        }
                        placeholder="—"
                      />
                    </td>
                    <td className="cell-arcs">{format(inputs, 'in')}</td>
                    <td className="cell-arcs">{format(outputs, 'out')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>
    </aside>
  )
}