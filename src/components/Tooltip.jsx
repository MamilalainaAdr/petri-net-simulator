import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Tooltip rendu via un portail React au niveau de document.body.
 * Permet un affichage au-dessus de tout, y compris hors de conteneurs
 * avec overflow: hidden (ex : sidebar-shell, playground).
 */
export default function Tooltip({ content, position = 'left', children }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const wrapperRef = useRef(null)

  const updateCoords = () => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    let top
    let left
    switch (position) {
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + 8
        break
      case 'top':
        top = rect.top - 8
        left = rect.left + rect.width / 2
        break
      case 'bottom':
        top = rect.bottom + 8
        left = rect.left + rect.width / 2
        break
      case 'left':
      default:
        top = rect.top + rect.height / 2
        left = rect.left - 8
        break
    }
    setCoords({ top, left })
  }

  const show = () => {
    updateCoords()
    setVisible(true)
  }
  const hide = () => setVisible(false)

  useEffect(() => {
    if (!visible) return
    const onAny = () => hide()
    window.addEventListener('scroll', onAny, true)
    window.addEventListener('resize', onAny)
    return () => {
      window.removeEventListener('scroll', onAny, true)
      window.removeEventListener('resize', onAny)
    }
  }, [visible])

  return (
    <>
      <span
        ref={wrapperRef}
        className="tooltip-anchor"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            className={`app-tooltip app-tooltip--${position}`}
            style={{ top: coords.top, left: coords.left }}
            role="tooltip"
          >
            {content}
          </div>,
          document.body
        )}
    </>
  )
}