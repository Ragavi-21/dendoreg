import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { APP_LINKS } from '../../data/appLinks.js'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../../data/contact.js'
import './Footer.css'

const FOOTER_LINKS = [
  { key: 'privacy', href: '/privacy' },
  { key: 'terms', href: '/terms' },
  { key: 'joinUs', href: '/register' },
]

function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-brand-name">DENDO</span>
          <p>{t('footer.tagline1')}</p>
          <p>{t('footer.tagline2')}</p>
        </div>

        <div className="footer-column">
          <h4>{t('footer.companyHeading')}</h4>
          <ul className="footer-links">
            {FOOTER_LINKS.map((link) => (
              <li key={link.key}>
                {link.href.startsWith('/') ? (
                  <Link to={link.href}>{t(`footer.links.${link.key}`)}</Link>
                ) : (
                  <a href={link.href}>{t(`footer.links.${link.key}`)}</a>
                )}
              </li>
            ))}
          </ul>

          <h4 className="footer-contact-heading">{t('footer.links.contact')}</h4>
          <ul className="footer-contact">
            <li>
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#mail"></use>
              </svg>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#phone"></use>
              </svg>
              <a href={`tel:${CONTACT_PHONE_HREF}`}>{CONTACT_PHONE}</a>
            </li>
          </ul>
        </div>

        <div className="footer-column footer-column-apps">
          <h4>{t('footer.getAppHeading')}</h4>
          <ul className="footer-app-links">
            {APP_LINKS.map((app) => (
              <li key={app.key}>
                <span className="footer-app-name">
                  <svg role="presentation" aria-hidden="true">
                    <use href={`/dendo-icons.svg#${app.icon}`}></use>
                  </svg>
                  {t(`apps.${app.key}.name`)}
                </span>
                <span className="footer-app-stores">
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
        </div>
      </div>

      <p className="footer-copyright">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
    </footer>
  )
}

export default Footer
