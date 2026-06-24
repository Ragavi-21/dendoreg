import './WizardStep.css'

function WizardStep({ title, description, children }) {
  return (
    <div className="wizard-step">
      <div className="wizard-step-heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className="wizard-step-fields">{children}</div>
    </div>
  )
}

export default WizardStep
