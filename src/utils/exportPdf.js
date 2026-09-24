import jsPDF from 'jspdf'
import {
  PLACE_RADIUS,
  transitionSize,
  computeArcGeometry,
  getEnabledTransitions,
  fireTransition,
} from './petriNet'

// ------------------------------------------------------------------
// Palette claire pour le rendu PDF
// ------------------------------------------------------------------
const LIGHT = {
  bg: '#ffffff',
  nodeFill: '#f7fafc',
  stroke: '#4a5568',
  text: '#2d3748',
  muted: '#718096',
  token: '#dd6b20',
  transition: '#4a5568',
  transitionStroke: '#2d3748',
  arc: '#4a5568',
  weightBg: '#ffffff',
  weightStroke: '#cbd5e0',
}

const RGB = {
  accent: [79, 140, 255],
  text: [45, 55, 72],
  muted: [113, 128, 150],
  border: [203, 213, 224],
}

const TOKEN_LAYOUTS = {
  1: [[0, 0]],
  2: [[-8, 0], [8, 0]],
  3: [[0, -9], [-9, 7], [9, 7]],
  4: [[-8, -8], [8, -8], [-8, 8], [8, 8]],
  5: [[0, 0], [-8, -8], [8, -8], [-8, 8], [8, 8]],
}

function escapeXml(s) {
  return String(s ?? '').replace(/[<>&'"]/g, (c) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  }[c]))
}

// ------------------------------------------------------------------
// Rendu SVG autonome (thème clair, sans styles externes)
// ------------------------------------------------------------------
function computeBounds(places, transitions, orientation) {
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity
  const push = (x, y) => {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }

  places.forEach((p) => {
    push(p.x - PLACE_RADIUS - 10, p.y - PLACE_RADIUS - 10)
    push(p.x + PLACE_RADIUS + 10, p.y + PLACE_RADIUS + 30)
  })
  transitions.forEach((t) => {
    const { w, h } = transitionSize(orientation)
    push(t.x - w / 2 - 10, t.y - h / 2 - 10)
    push(t.x + w / 2 + 10, t.y + h / 2 + 30)
  })

  if (!isFinite(minX)) {
    minX = 0
    minY = 0
    maxX = 400
    maxY = 300
  }
  return { minX, minY, maxX, maxY }
}

function renderDiagramSvg(places, transitions, arcs, orientation) {
  const { minX, minY, maxX, maxY } = computeBounds(
    places,
    transitions,
    orientation
  )
  const pad = 20
  const width = Math.max(1, maxX - minX + pad * 2)
  const height = Math.max(1, maxY - minY + pad * 2)
  const viewX = minX - pad
  const viewY = minY - pad

  const out = []
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewX} ${viewY} ${width} ${height}" width="${width}" height="${height}">`
  )
  out.push(
    `<defs><marker id="pdf-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10" markerHeight="10" markerUnits="userSpaceOnUse" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="${LIGHT.arc}"/></marker></defs>`
  )
  out.push(
    `<rect x="${viewX}" y="${viewY}" width="${width}" height="${height}" fill="${LIGHT.bg}"/>`
  )

  // Arcs (derrière les noeuds)
  arcs.forEach((arc) => {
    const source =
      places.find((p) => p.id === arc.from) ||
      transitions.find((t) => t.id === arc.from)
    const target =
      places.find((p) => p.id === arc.to) ||
      transitions.find((t) => t.id === arc.to)
    if (!source || !target) return
    const geom = computeArcGeometry(arc, source, target, orientation)
    out.push(
      `<path d="M ${geom.start.x} ${geom.start.y} Q ${geom.control.x} ${geom.control.y} ${geom.end.x} ${geom.end.y}" stroke="${LIGHT.arc}" stroke-width="2" fill="none" marker-end="url(#pdf-arrow)"/>`
    )
    const w = arc.weight ?? 1
    out.push(
      `<circle cx="${geom.mid.x}" cy="${geom.mid.y}" r="11" fill="${LIGHT.weightBg}" stroke="${LIGHT.weightStroke}" stroke-width="1"/>`
    )
    out.push(
      `<text x="${geom.mid.x}" y="${geom.mid.y + 4}" text-anchor="middle" fill="${LIGHT.text}" font-size="11" font-weight="600" font-family="Helvetica, Arial, sans-serif">${w}</text>`
    )
  })

  // Transitions
  transitions.forEach((t) => {
    const { w, h } = transitionSize(orientation)
    out.push(
      `<rect x="${t.x - w / 2}" y="${t.y - h / 2}" width="${w}" height="${h}" rx="2" fill="${LIGHT.transition}" stroke="${LIGHT.transitionStroke}" stroke-width="2"/>`
    )
    out.push(
      `<text x="${t.x}" y="${t.y + h / 2 + 18}" text-anchor="middle" fill="${LIGHT.muted}" font-size="12" font-family="Helvetica, Arial, sans-serif">${escapeXml(t.label)}</text>`
    )
  })

  // Places
  places.forEach((p) => {
    out.push(
      `<circle cx="${p.x}" cy="${p.y}" r="${PLACE_RADIUS}" fill="${LIGHT.nodeFill}" stroke="${LIGHT.stroke}" stroke-width="2"/>`
    )
    const tokens = p.tokens ?? 0
    if (tokens > 5) {
      out.push(
        `<text x="${p.x}" y="${p.y + 5}" text-anchor="middle" fill="${LIGHT.token}" font-size="16" font-weight="700" font-family="Helvetica, Arial, sans-serif">${tokens}</text>`
      )
    } else if (tokens > 0) {
      TOKEN_LAYOUTS[tokens].forEach(([dx, dy]) => {
        out.push(
          `<circle cx="${p.x + dx}" cy="${p.y + dy}" r="5" fill="${LIGHT.token}"/>`
        )
      })
    }
    out.push(
      `<text x="${p.x}" y="${p.y + PLACE_RADIUS + 16}" text-anchor="middle" fill="${LIGHT.muted}" font-size="12" font-family="Helvetica, Arial, sans-serif">${escapeXml(p.label)}</text>`
    )
  })

  out.push('</svg>')
  return { svg: out.join(''), width, height }
}

// ------------------------------------------------------------------
// Conversion SVG -> PNG data URL (via canvas)
// ------------------------------------------------------------------
function svgToPngDataUrl(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.onload = () => {
      const scale = 2
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(width * scale))
      canvas.height = Math.max(1, Math.round(height * scale))
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      try {
        resolve(canvas.toDataURL('image/png'))
      } catch (err) {
        reject(err)
      }
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })
}

// ------------------------------------------------------------------
// Simulation : liste des marquages successifs
// ------------------------------------------------------------------
function computeSimulationSteps(doc) {
  const steps = []
  let current = doc.places.map((p) => ({ ...p, tokens: p.tokens ?? 0 }))
  steps.push(current)

  let guard = 500
  while (guard-- > 0) {
    const enabled = getEnabledTransitions(doc.transitions, doc.arcs, current)
    if (enabled.length === 0) break
    current = fireTransition(enabled[0].id, current, doc.arcs)
    steps.push(current)
  }
  return steps
}

// ------------------------------------------------------------------
// Export principal
// ------------------------------------------------------------------
export async function exportProjectToPdf(doc) {
  const { orientation, project, places, transitions, arcs } = doc
  const isLandscape = orientation === 'LR'

  const pdf = new jsPDF({
    orientation: isLandscape ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageW = pdf.internal.pageSize.getWidth()
  const pageH = pdf.internal.pageSize.getHeight()
  const margin = 15
  const contentTop = 32
  const contentBottom = pageH - 26
  const contentW = pageW - margin * 2
  const contentH = contentBottom - contentTop

  const labelOf = (id) => {
    const p = places.find((x) => x.id === id)
    const t = transitions.find((x) => x.id === id)
    return p?.label || t?.label || id
  }

  let y = contentTop
  const ensureSpace = (needed) => {
    if (y + needed > contentBottom) {
      pdf.addPage()
      y = contentTop
    }
  }

  // ================================================================
  // Page 1 : contenu du sidebar
  // ================================================================
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(...RGB.text)
  pdf.text('Projet', margin, y + 4)
  y += 9

  pdf.setFontSize(10)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...RGB.muted)
  pdf.text('Nom du projet', margin, y + 3)
  y += 5
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...RGB.text)
  pdf.text(project.name || 'Sans titre', margin, y + 3)
  y += 8

  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...RGB.muted)
  pdf.text('Description', margin, y + 3)
  y += 5
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(...RGB.text)
  if (project.description) {
    const lines = pdf.splitTextToSize(project.description, contentW)
    pdf.text(lines, margin, y + 3)
    y += lines.length * 5 + 2
  } else {
    pdf.setTextColor(...RGB.muted)
    pdf.text('—', margin, y + 3)
    pdf.setTextColor(...RGB.text)
    y += 5
  }
  y += 8

  // --- Tableau des places ---
  ensureSpace(28)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(...RGB.text)
  pdf.text('Description des places', margin, y + 4)
  y += 9

  const placeCol2 = margin + 18
  const placeCol3Right = pageW - margin

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...RGB.muted)
  pdf.text('Place', margin, y + 3)
  pdf.text('Description', placeCol2, y + 3)
  pdf.text('Marquage initial', placeCol3Right, y + 3, { align: 'right' })
  y += 5
  pdf.setDrawColor(...RGB.border)
  pdf.setLineWidth(0.2)
  pdf.line(margin, y, pageW - margin, y)
  y += 4

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  if (places.length === 0) {
    pdf.setTextColor(...RGB.muted)
    pdf.text('Aucune place', margin, y + 3)
    y += 6
  } else {
    places.forEach((p) => {
      const desc = p.description || '—'
      const descLines = pdf.splitTextToSize(
        desc,
        placeCol3Right - placeCol2 - 30
      )
      const rowH = Math.max(6, descLines.length * 4.5)
      ensureSpace(rowH + 4)
      pdf.setTextColor(...RGB.text)
      pdf.text(p.label, margin, y + 3)
      pdf.text(descLines, placeCol2, y + 3)
      pdf.text(String(p.initialTokens ?? 0), placeCol3Right, y + 3, {
        align: 'right',
      })
      y += rowH
      pdf.setDrawColor(...RGB.border)
      pdf.line(margin, y, pageW - margin, y)
      y += 2
    })
  }
  y += 8

  // --- Tableau des transitions ---
  ensureSpace(28)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(12)
  pdf.setTextColor(...RGB.text)
  pdf.text('Description des transitions', margin, y + 4)
  y += 9

  const transCol2 = margin + 18
  const transCol3 = margin + contentW * 0.42
  const transCol4 = margin + contentW * 0.72

  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(...RGB.muted)
  pdf.text('Trans.', margin, y + 3)
  pdf.text('Description', transCol2, y + 3)
  pdf.text('Entrées', transCol3, y + 3)
  pdf.text('Sorties', transCol4, y + 3)
  y += 5
  pdf.setDrawColor(...RGB.border)
  pdf.line(margin, y, pageW - margin, y)
  y += 4

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(9)
  if (transitions.length === 0) {
    pdf.setTextColor(...RGB.muted)
    pdf.text('Aucune transition', margin, y + 3)
    y += 6
  } else {
    transitions.forEach((t) => {
      const inputs =
        arcs
          .filter((a) => a.to === t.id)
          .map((a) => `${labelOf(a.from)} (${a.weight ?? 1})`)
          .join(', ') || '—'
      const outputs =
        arcs
          .filter((a) => a.from === t.id)
          .map((a) => `${labelOf(a.to)} (${a.weight ?? 1})`)
          .join(', ') || '—'
      const desc = t.description || '—'
      const descLines = pdf.splitTextToSize(desc, transCol3 - transCol2 - 4)
      const inLines = pdf.splitTextToSize(inputs, transCol4 - transCol3 - 4)
      const outLines = pdf.splitTextToSize(outputs, pageW - margin - transCol4)
      const rowH =
        Math.max(descLines.length, inLines.length, outLines.length, 1) * 4.5
      ensureSpace(rowH + 4)
      pdf.setTextColor(...RGB.text)
      pdf.text(t.label, margin, y + 3)
      pdf.text(descLines, transCol2, y + 3)
      pdf.text(inLines, transCol3, y + 3)
      pdf.text(outLines, transCol4, y + 3)
      y += rowH
      pdf.setDrawColor(...RGB.border)
      pdf.line(margin, y, pageW - margin, y)
      y += 2
    })
  }

  // ================================================================
  // Pages 2..N : diagramme à chaque étape
  // ================================================================
  const steps = computeSimulationSteps(doc)

  for (let i = 0; i < steps.length; i += 1) {
    const stepPlaces = steps[i]
    const { svg, width, height } = renderDiagramSvg(
      stepPlaces,
      transitions,
      arcs,
      orientation
    )
    const pngDataUrl = await svgToPngDataUrl(svg, width, height)

    pdf.addPage()

    // Titre de l'étape (sous l'entête)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(...RGB.muted)
    pdf.text(`Étape ${i + 1} / ${steps.length}`, margin, contentTop - 6)

    const availTop = contentTop
    const availH = contentBottom - contentTop
    const ratio = Math.min(contentW / width, availH / height)
    const drawW = width * ratio
    const drawH = height * ratio
    const drawX = margin + (contentW - drawW) / 2
    const drawY = availTop + (availH - drawH) / 2

    pdf.addImage(pngDataUrl, 'PNG', drawX, drawY, drawW, drawH, undefined, 'FAST')
  }

  // ================================================================
  // Entête + pied de page sur toutes les pages
  // ================================================================
  const total = pdf.getNumberOfPages()
  const headerTextY = 20
  const headerLineY = 24
  const footerLineY = pageH - 22
  const footerTextY = pageH - 15

  for (let p = 1; p <= total; p += 1) {
    pdf.setPage(p)

    // Entête
    pdf.setDrawColor(...RGB.border)
    pdf.setLineWidth(0.2)
    pdf.line(margin, headerLineY, pageW - margin, headerLineY)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(10)
    pdf.setTextColor(...RGB.accent)
    pdf.text(project.name || 'Sans titre', margin, headerTextY)

    // Pied de page
    pdf.line(margin, footerLineY, pageW - margin, footerLineY)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(9)
    pdf.setTextColor(...RGB.muted)
    pdf.text(`Page ${p} / ${total}`, pageW / 2, footerTextY, {
      align: 'center',
    })
  }

  const safeName =
    (project.name || 'projet').replace(/[^\w\-]+/g, '_') || 'projet'
  pdf.save(`${safeName}.pdf`)
}