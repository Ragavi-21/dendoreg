import { useTranslation } from 'react-i18next'
import './About.css'

const POINT_KEYS = ['point1', 'point2', 'point3']

function About() {
  const { t } = useTranslation()

  return (
    <section className="about-section" id="about-dendo">
      <div className="about-inner">
        <div className="about-copy">
          <p className="about-eyebrow">{t('about.eyebrow')}</p>
          <h2>{t('about.title')}</h2>
          <p className="about-paragraph">{t('about.paragraph1')}</p>
          <p className="about-paragraph">{t('about.paragraph2')}</p>
        </div>
        <ul className="about-points">
          {POINT_KEYS.map((key) => (
            <li key={key}>
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#check-circle"></use>
              </svg>
              <span>{t(`about.${key}`)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default About
