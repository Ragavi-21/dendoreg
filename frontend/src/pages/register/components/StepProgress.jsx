import './StepProgress.css'

function StepProgress({ steps, currentStep, onStepClick }) {
  return (
    <ol className="step-progress">
      {steps.map((step, index) => {
        const status = index < currentStep ? 'completed' : index === currentStep ? 'current' : 'upcoming'
        const clickable = index < currentStep

        return (
          <li key={step} className={`step-progress-item is-${status}`}>
            <button
              type="button"
              className="step-progress-marker"
              disabled={!clickable}
              onClick={() => clickable && onStepClick(index)}
            >
              {status === 'completed' ? (
                <svg role="presentation" aria-hidden="true">
                  <use href="/dendo-icons.svg#check-circle"></use>
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </button>
            <span className="step-progress-title">{step}</span>
          </li>
        )
      })}
    </ol>
  )
}

export default StepProgress
