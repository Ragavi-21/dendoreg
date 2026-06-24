import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import RegisterHeader from './components/RegisterHeader.jsx'
import './RegisterChoice.css'

const OPTIONS = [
  { key: 'rider', icon: 'bike', to: '/register/rider' },
  { key: 'vendor', icon: 'store', to: '/register/vendor' },
]

function RegisterChoice() {
  const { t } = useTranslation()

  return (
    <div className="register-choice">
      <RegisterHeader />
      <div className="register-choice-body">
        <h1>{t('registerChoice.title')}</h1>
        <p>{t('registerChoice.subtitle')}</p>

        <div className="register-choice-grid">
          {OPTIONS.map((option) => (
            <Link to={option.to} className="register-choice-card" key={option.to}>
              <span className="register-choice-icon" aria-hidden="true">
                <svg role="presentation" aria-hidden="true">
                  <use href={`/dendo-icons.svg#${option.icon}`}></use>
                </svg>
              </span>
              <h2>{t(`registerChoice.${option.key}.title`)}</h2>
              <p>{t(`registerChoice.${option.key}.description`)}</p>
              <span className="register-choice-cta">
                {t(`registerChoice.${option.key}.cta`)}
                <svg role="presentation" aria-hidden="true">
                  <use href="/dendo-icons.svg#arrow-right"></use>
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RegisterChoice
