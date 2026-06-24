import { useTranslation } from 'react-i18next'
import './HowItWorks.css'

const STEPS = [
  { key: 'step1', icon: 'search' },
  { key: 'step2', icon: 'arrow-right' },
  { key: 'step3', icon: 'bike' },
]

function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="how-it-works-heading">
        <p className="how-it-works-eyebrow">{t('howItWorks.eyebrow')}</p>
        <h2>{t('howItWorks.title')}</h2>
        <p className="how-it-works-intro">{t('howItWorks.intro')}</p>
      </div>

      <div className="how-it-works-grid">
        {STEPS.map((step, index) => (
          <div className="how-it-works-card" key={step.key}>
            <span className="how-it-works-index">{index + 1}</span>
            <span className="how-it-works-icon" aria-hidden="true">
              <svg role="presentation" aria-hidden="true">
                <use href={`/dendo-icons.svg#${step.icon}`}></use>
              </svg>
            </span>
            <h3>{t(`howItWorks.${step.key}.title`)}</h3>
            <p>{t(`howItWorks.${step.key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HowItWorks
