import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../../../components/layout/LanguageSwitcher.jsx'
import logoIcon from '../../../assets/logo-icon.png'
import './RegisterHeader.css'

function RegisterHeader({ subLabelKey = 'registerHeader.subLabelPartner' }) {
  const { t } = useTranslation()

  return (
    <header className="register-header">
      <Link to="/" className="register-brand">
        <img src={logoIcon} alt="" className="register-brand-logo" />
        <span className="register-brand-text">
          <span className="register-brand-name">{t('nav.brand')}</span>
          <span className="register-brand-sub">{t(subLabelKey)}</span>
        </span>
      </Link>
      <div className="register-header-actions">
        <a className="register-help" href="mailto:support@dendo.store">
          {t('registerHeader.helpText')}
        </a>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default RegisterHeader
