/**
 * Helpers de compression d'images pour jsPDF.
 * Objectif : réduire drastiquement le poids du PDF final.
 *
 * Stratégie :
 *  1. Réduire la résolution de rendu (devicePixelRatio effectif limité).
 *  2. Convertir en JPEG (beaucoup plus léger que PNG pour un rendu de
 *     diagramme sur fond blanc uni).
 *  3. Baisser la qualité JPEG.
 *  4. Utiliser la compression 'SLOW' de jsPDF (zlib agressif).
 */

export const PDF_IMAGE = {
  // Facteur de résolution : 1 = 96 dpi effectif environ.
  // Un diagramme vectoriel reste lisible à 1.0 ; au-delà, le gain visuel
  // est négligeable une fois imprimé en A4.
  scale: 1.0,
  // Qualité JPEG (0-1). 0.72 conserve une bonne netteté pour du texte
  // fin et des arcs, tout en divisant le poids par ~4 par rapport à 1.0.
  quality: 0.72,
  // Format de sortie.
  mime: 'image/jpeg',
  // Compression jsPDF pour addImage (NONE | FAST | MEDIUM | SLOW).
  compression: 'SLOW',
  // Format court attendu par jsPDF pour addImage.
  format: 'JPEG',
}

/**
 * Convertit un SVG en data URL JPEG fortement compressée.
 *
 * @param {string} svgString  Contenu SVG autonome (avec xmlns).
 * @param {number} width      Largeur logique en pixels.
 * @param {number} height     Hauteur logique en pixels.
 * @returns {Promise<string>} data URL `data:image/jpeg;base64,...`
 */
export function svgToCompressedJpegDataUrl(svgString, width, height) {
  return new Promise((resolve, reject) => {
    const blob = new Blob([svgString], {
      type: 'image/svg+xml;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const img = new Image()

    img.onload = () => {
      try {
        const scale = PDF_IMAGE.scale
        const canvas = document.createElement('canvas')
        canvas.width = Math.max(1, Math.round(width * scale))
        canvas.height = Math.max(1, Math.round(height * scale))

        const ctx = canvas.getContext('2d', { alpha: false })
        // Fond blanc opaque : évite le canal alpha (inutile ici) qui
        // alourdirait l'encodage.
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        URL.revokeObjectURL(url)
        resolve(canvas.toDataURL(PDF_IMAGE.mime, PDF_IMAGE.quality))
      } catch (err) {
        URL.revokeObjectURL(url)
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