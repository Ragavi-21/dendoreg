import { useTranslation } from 'react-i18next'
import { APP_LINKS } from '../../../data/appLinks.js'
import './RegistrationIntro.css'

function RegistrationIntro({ title, welcomeHeading, features, closingInstruction }) {
  const { t } = useTranslation()

  return (
    <div className="registration-intro">
      <h1>{title}</h1>
      <p className="intro-welcome">{welcomeHeading}</p>

      <p>{t('intro.paragraph1')}</p>
      <p>{t('intro.paragraph2')}</p>
      <p>{t('intro.paragraph3')}</p>

      <h2>{t('intro.applicationsHeading')}</h2>
      <ul className="intro-apps">
        {APP_LINKS.map((app) => (
          <li key={app.key}>
            <span className="intro-app-icon" aria-hidden="true">
              <svg role="presentation" aria-hidden="true">
                <use href={`/dendo-icons.svg#${app.icon}`}></use>
              </svg>
            </span>
            <div>
              <strong>{t(`apps.${app.key}.name`)}</strong>
              <p>{t(`apps.${app.key}.description`)}</p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="intro-heading-with-icon">
        <svg role="presentation" aria-hidden="true">
          <use href="/dendo-icons.svg#smartphone"></use>
        </svg>
        {t('intro.appLinksHeading')}
      </h2>
      <ul className="intro-app-links">
        {APP_LINKS.map((app) => (
          <li key={app.key}>
            <strong>
              <svg role="presentation" aria-hidden="true">
                <use href={`/dendo-icons.svg#${app.icon}`}></use>
              </svg>
              {t(`apps.${app.key}.name`)}
            </strong>
            <span className="app-link-row">
              <a href={app.android} target="_blank" rel="noopener noreferrer">
                {t('apps.android')}
              </a>
              <a href={app.ios} target="_blank" rel="noopener noreferrer">
                {t('apps.ios')}
              </a>
            </span>
          </li>
        ))}
      </ul>

      <p className="intro-website">
        <svg role="presentation" aria-hidden="true">
          <use href="/dendo-icons.svg#globe"></use>
        </svg>
        {t('intro.websiteLabel')}{' '}
        <a href="https://dendo.space" target="_blank" rel="noopener noreferrer">
          https://dendo.space
        </a>
      </p>

      <ul className="intro-features">
        {features.map((feature) => (
          <li key={feature}>
            <svg role="presentation" aria-hidden="true">
              <use href="/dendo-icons.svg#check-circle"></use>
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <p>{t('intro.closingThanks')}</p>
      <p className="intro-closing">{closingInstruction}</p>
    </div>
  )
}

export default RegistrationIntro
