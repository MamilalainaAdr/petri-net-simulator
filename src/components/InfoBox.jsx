export default function InfoBox({ group, title, text }) {
  return (
    <div className="info-box">
      {group && <span className="info-box__group">{group}</span>}
      <h4 className="info-box__title">{title}</h4>
      <p className="info-box__text">{text}</p>
    </div>
  )
}