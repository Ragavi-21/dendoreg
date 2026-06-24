import { useTranslation } from 'react-i18next'
import './Services.css'

const SERVICE_ITEMS = [
  { key: 'food', icon: 'utensils' },
  { key: 'grocery', icon: 'cart' },
  { key: 'ecommerce', icon: 'bag' },
  { key: 'parcel', icon: 'box' },
]

function Services() {
  const { t } = useTranslation()

  return (
    <section className="services-section">
      <div className="services-heading">
        <p className="services-eyebrow">{t('services.eyebrow')}</p>
        <h2>{t('services.title')}</h2>
        <p className="services-intro">{t('services.intro')}</p>
      </div>
      <div className="services-grid">
        {SERVICE_ITEMS.map((item) => (
          <div className="service-card" key={item.key}>
            <span className="service-icon" aria-hidden="true">
              <svg role="presentation" aria-hidden="true">
                <use href={`/dendo-icons.svg#${item.icon}`}></use>
              </svg>
            </span>
            <h3>{t(`services.${item.key}.title`)}</h3>
            <p>{t(`services.${item.key}.description`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services
