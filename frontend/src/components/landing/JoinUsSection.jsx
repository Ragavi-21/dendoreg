import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import './JoinUsSection.css'

const CARDS = [
  { key: 'rider', icon: 'bike', to: '/register/rider' },
  { key: 'vendor', icon: 'store', to: '/register/vendor' },
]

function JoinUsSection() {
  const { t } = useTranslation()

  return (
    <section className="join-us-section" id="join-us">
      <div className="join-us-heading">
        <p className="join-us-eyebrow">{t('joinUs.eyebrow')}</p>
        <h2>{t('joinUs.title')}</h2>
        <p className="join-us-intro">{t('joinUs.intro')}</p>
      </div>

      <div className="join-us-grid">
        {CARDS.map((card) => (
          <Link to={card.to} className="join-us-card" key={card.key}>
            <span className="join-us-icon" aria-hidden="true">
              <svg role="presentation" aria-hidden="true">
                <use href={`/dendo-icons.svg#${card.icon}`}></use>
              </svg>
            </span>
            <h3>{t(`joinUs.${card.key}.title`)}</h3>
            <p>{t(`joinUs.${card.key}.description`)}</p>
            <span className="join-us-cta">
              {t(`joinUs.${card.key}.cta`)}
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#arrow-right"></use>
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default JoinUsSection
