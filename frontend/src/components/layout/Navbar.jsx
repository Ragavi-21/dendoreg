import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { CONTACT_EMAIL, CONTACT_PHONE, CONTACT_PHONE_HREF } from '../../data/contact.js'
import logo from '../../assets/Logo.png'
import './Navbar.css'

function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 8)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={() => setOpen(false)}>
          <img src={logo} alt={t('nav.brand')} className="navbar-logo" />
        </Link>

        <div className="navbar-actions">
          <LanguageSwitcher className="navbar-language" />

          <div className="navbar-join">
            <button
              type="button"
              className="navbar-join-trigger"
              aria-expanded={open}
              onClick={() => setOpen((value) => !value)}
            >
              {t('nav.joinUs')}
              <svg
                className={`navbar-join-chevron ${open ? 'is-open' : ''}`.trim()}
                role="presentation"
                aria-hidden="true"
              >
                <use href="/dendo-icons.svg#chevron-down"></use>
              </svg>
            </button>

            {open && (
              <div className="navbar-join-menu">
                <Link to="/register/rider" onClick={() => setOpen(false)}>
                  {t('nav.becomeRider')}
                </Link>
                <Link to="/register/vendor" onClick={() => setOpen(false)}>
                  {t('nav.registerShop')}
                </Link>
              </div>
            )}
          </div>

          <div className="navbar-support">
            <button
              type="button"
              className="navbar-support-trigger"
              aria-expanded={supportOpen}
              onClick={() => setSupportOpen((value) => !value)}
            >
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#phone"></use>
              </svg>
              {t('nav.support')}
              <svg
                className={`navbar-join-chevron ${supportOpen ? 'is-open' : ''}`.trim()}
                role="presentation"
                aria-hidden="true"
              >
                <use href="/dendo-icons.svg#chevron-down"></use>
              </svg>
            </button>

            {supportOpen && (
              <div className="navbar-join-menu navbar-support-menu">
                <a href={`mailto:${CONTACT_EMAIL}`} className="navbar-join-menu-contact">
                  <svg role="presentation" aria-hidden="true">
                    <use href="/dendo-icons.svg#mail"></use>
                  </svg>
                  {CONTACT_EMAIL}
                </a>
                <a href={`tel:${CONTACT_PHONE_HREF}`} className="navbar-join-menu-contact">
                  <svg role="presentation" aria-hidden="true">
                    <use href="/dendo-icons.svg#phone"></use>
                  </svg>
                  {CONTACT_PHONE}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
