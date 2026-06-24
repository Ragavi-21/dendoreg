import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'
import Hero from '../components/landing/Hero.jsx'
import Stats from '../components/landing/Stats.jsx'
import About from '../components/landing/About.jsx'
import Services from '../components/landing/Services.jsx'
import HowItWorks from '../components/landing/HowItWorks.jsx'
import JoinUsSection from '../components/landing/JoinUsSection.jsx'
import heroBg from '../assets/hero-bg.png'
import './PartnerRegister.css'

function PartnerRegister() {
  return (
    <div className="partner-register">
      <Navbar />
      <Hero ctaTo="/register" secondaryCtaHref="#how-it-works" backgroundImage={heroBg} />
      <Stats />
      <About />
      <Services />
      <HowItWorks />
      <JoinUsSection />
      <Footer />
    </div>
  )
}

export default PartnerRegister
