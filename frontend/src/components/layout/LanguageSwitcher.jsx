import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../../i18n'
import './LanguageSwitcher.css'

function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  const current = SUPPORTED_LANGUAGES.find((language) => language.code === i18n.language) ?? SUPPORTED_LANGUAGES[0]

  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function selectLanguage(code) {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className={`language-switcher ${className}`.trim()} ref={rootRef}>
      <button
        type="button"
        className="language-switcher-trigger"
        aria-label={t('nav.languageLabel')}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <svg role="presentation" aria-hidden="true">
          <use href="/dendo-icons.svg#globe"></use>
        </svg>
        <span className="language-switcher-current">{current.label}</span>
        <svg
          className={`language-switcher-chevron ${open ? 'is-open' : ''}`.trim()}
          role="presentation"
          aria-hidden="true"
        >
          <use href="/dendo-icons.svg#chevron-down"></use>
        </svg>
      </button>

      {open && (
        <ul className="language-switcher-menu" role="listbox">
          {SUPPORTED_LANGUAGES.map((language) => (
            <li key={language.code}>
              <button
                type="button"
                className={language.code === current.code ? 'is-active' : ''}
                onClick={() => selectLanguage(language.code)}
                role="option"
                aria-selected={language.code === current.code}
              >
                {language.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LanguageSwitcher
