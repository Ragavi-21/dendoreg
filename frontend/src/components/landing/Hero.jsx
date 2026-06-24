import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button.jsx'
import './Hero.css'

function Hero({ ctaTo, secondaryCtaHref, backgroundImage }) {
  const { t } = useTranslation()

  return (
    <section className="hero-section" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="hero-overlay"></div>
      <div className="hero-inner">
        <h1 className="hero-title">{t('hero.title')}</h1>
        <p className="hero-subheading">{t('hero.subheading')}</p>
        <div className="hero-actions">
          <Button as={Link} to={ctaTo} variant="primary" className="hero-cta">
            {t('hero.ctaLabel')}
          </Button>
          {secondaryCtaHref && (
            <a className="hero-secondary-cta" href={secondaryCtaHref}>
              {t('hero.secondaryCta')}
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#arrow-right"></use>
              </svg>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
