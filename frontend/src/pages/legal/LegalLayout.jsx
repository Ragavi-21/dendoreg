import Navbar from '../../components/layout/Navbar.jsx'
import Footer from '../../components/layout/Footer.jsx'
import './LegalLayout.css'

function LegalLayout({ title, intro, children }) {
  return (
    <div className="legal-layout">
      <Navbar />
      <div className="legal-page">
        <div className="legal-card">
          <h1>{title}</h1>
          {intro && <p className="legal-intro">{intro}</p>}
          <p className="legal-language-note">
            This document is provided in English. For questions in your preferred language, contact us at
            support@dendo.store.
          </p>
          {children}
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default LegalLayout
