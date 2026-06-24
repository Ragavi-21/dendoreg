import { Routes, Route } from 'react-router-dom'
import PartnerRegister from './pages/PartnerRegister.jsx'
import RegisterChoice from './pages/register/RegisterChoice.jsx'
import RiderRegistration from './pages/register/RiderRegistration.jsx'
import VendorRegistration from './pages/register/VendorRegistration.jsx'
import TermsAndConditions from './pages/legal/TermsAndConditions.jsx'
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PartnerRegister />} />
      <Route path="/register" element={<RegisterChoice />} />
      <Route path="/register/rider" element={<RiderRegistration />} />
      <Route path="/register/vendor" element={<VendorRegistration />} />
      <Route path="/terms" element={<TermsAndConditions />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
  )
}

export default App
