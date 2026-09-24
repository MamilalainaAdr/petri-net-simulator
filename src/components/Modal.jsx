import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({
  title,
  onClose,
  onConfirm,
  confirmLabel = 'Valider',
  cancelLabel = 'Annuler',
  hideCancel = false,
  children,
}) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal__backdrop" onPointerDown={onClose}>
      <div
        className="modal"
        onPointerDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <h3>{title}</h3>
          <button className="modal__close" onClick={onClose} aria-label="Fermer">
            <X size={16} />
          </button>
        </div>
        <div className="modal__body">{children}</div>
        <div className="modal__actions">
          {!hideCancel && (
            <button type="button" className="btn" onClick={onClose}>
              {cancelLabel}
            </button>
          )}
          <button type="button" className="btn btn--primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}