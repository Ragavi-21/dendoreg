import { useTranslation } from 'react-i18next'
import './Stats.css'

const STAT_ITEMS = [
  { key: 'vendors', value: '100+' },
  { key: 'riders', value: '100+' },
  { key: 'cities', value: '7+' },
  { key: 'orders', value: '1000+' },
]

function Stats() {
  const { t } = useTranslation()

  return (
    <div className="stats-strip">
      <div className="stats-strip-inner">
        {STAT_ITEMS.map((item) => (
          <div className="stat-card" key={item.key}>
            <span className="stat-value">{item.value}</span>
            <span className="stat-label">{t(`stats.${item.key}`)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
