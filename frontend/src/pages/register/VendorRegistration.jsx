import { useState } from 'react'
import { trackEvent } from '../../utils/fbPixel.js'
import { useTranslation } from 'react-i18next'
import RegisterHeader from './components/RegisterHeader.jsx'
import RegistrationIntro from './components/RegistrationIntro.jsx'
import StepProgress from './components/StepProgress.jsx'
import WizardStep from './components/WizardStep.jsx'
import TextField from '../../components/form/TextField.jsx'
import SelectField from '../../components/form/SelectField.jsx'
import RadioGroup from '../../components/form/RadioGroup.jsx'
import FileUploadField from '../../components/form/FileUploadField.jsx'
import LocationPicker from '../../components/map/LocationPicker.jsx'
import { submitVendorRegistration } from '../../api/registrations.js'
import './RegistrationPage.css'

const FEATURE_KEYS = ['free', 'noCommission', 'freeMenu']
const DISTRICTS = ['bengaluru', 'coimbatore', 'dharmapuri']
const DISTRICT_AREAS = {
  bengaluru: [
    'whitefield', 'electronic_city', 'koramangala', 'indiranagar', 'hsr_layout',
    'jayanagar', 'jp_nagar', 'banashankari', 'btm_layout', 'marathahalli',
    'bellandur', 'yelahanka', 'hebbal', 'yeshwanthpur', 'rajajinagar',
    'malleshwaram', 'basavanagudi', 'kengeri', 'vijayanagar', 'kr_puram',
    'mahadevapura', 'hennur', 'sarjapur_road', 'banaswadi', 'rt_nagar',
    'nagawara', 'domlur', 'richmond_town', 'shivajinagar', 'mg_road',
    'frazer_town'
  ],
  coimbatore: [
    'gandhipuram', 'r_s__puram', 'saibaba_colony', 'race_course', 'peelamedu',
    'singanallur', 'saravanampatti', 'ganapathy', 'kalapatti', 'vilankurichi',
    'thudiyalur', 'vadavalli', 'ramanathapuram', 'ukkadam', 'podanur',
    'sundarapuram', 'kuniyamuthur', 'kovaipudur', 'selvapuram', 'town_hall',
    'tatabad', 'chinniampalayam', 'neelambur', 'irugur', 'sulur',
    'madukkarai', 'perur', 'mettupalayam', 'annur', 'pollachi'
  ],
  dharmapuri: [
    'dharmapuri_town', 'nallampalli', 'karimangalam', 'palacode', 'pennagaram',
    'harur', 'pappireddipatti', 'morappur', 'bommidi', 'thoppur',
    'hogenakkal', 'a__jettihalli', 'adhiyamankottai', 'kadagathur', 'papparapatti',
    'indur', 'marandahalli', 'kambainallur'
  ]
}

const INITIAL_STATE = {
  shopName: '',
  ownerName: '',
  ownerMobile: '',
  shopMobile: '',
  shopLogo: [],
  shopBanner: [],
  state: '',
  city: '',
  shopAddress: '',
  location: null,
  deliveryTime: '',
  menuFiles: [],
  openingTime: '',
  closingTime: '',
  gstRegistration: '',
  gstCertificate: [],
  fssaiNumber: '',
  fssaiExpiryDate: '',
  fssaiCertificate: [],
}

function VendorRegistration() {
  const { t } = useTranslation()
  const [form, setForm] = useState(INITIAL_STATE)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [step, setStep] = useState(0)

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const getDistrictKey = (translatedValue) => {
    if (!translatedValue) return ''
    for (const key of DISTRICTS) {
      if (t(`form.cities.${key}`) === translatedValue) {
        return key
      }
    }
    return ''
  }

  const features = FEATURE_KEYS.map((key) => t(`vendorForm.features.${key}`))
  const districts = DISTRICTS.map((key) => t(`form.cities.${key}`))
  const currentDistrictKey = getDistrictKey(form.state)
  const areas = currentDistrictKey
    ? DISTRICT_AREAS[currentDistrictKey].map((key) => t(`form.areas.${key}`))
    : []

  const step1Valid = Boolean(form.shopName.trim() && form.ownerName.trim() && form.ownerMobile.trim().length >= 10)
  const step2Valid = Boolean(
    form.state && form.city && form.shopAddress.trim() && form.location?.lat && form.location?.lng,
  )
  const step3Valid = Boolean(form.deliveryTime.trim() && form.menuFiles.length > 0 && form.openingTime && form.closingTime)
  const step4Valid = Boolean(form.fssaiNumber.trim() && form.fssaiExpiryDate && form.fssaiCertificate.length > 0)

  const stepValidity = [step1Valid, step2Valid, step3Valid, step4Valid]
  const canSubmit = step1Valid && step2Valid && step3Valid && step4Valid

  const steps = [
    t('vendorForm.step1.title'),
    t('vendorForm.step2.title'),
    t('vendorForm.step3.title'),
    t('vendorForm.step4.title'),
  ]

  function goNext() {
    if (!stepValidity[step]) return
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (step !== steps.length - 1) {
      goNext()
      return
    }
    if (!canSubmit || submitting) return

    setSubmitting(true)
    setSubmitError('')
    try {
      await submitVendorRegistration(form)
      trackEvent('Lead', { content_name: 'Vendor Registration' })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message || t('form.submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="registration-page">
      <RegisterHeader subLabelKey="registerHeader.subLabelVendor" />
      <div className="registration-page-body">
        <RegistrationIntro
          title={t('vendorForm.pageTitle')}
          welcomeHeading={t('vendorForm.welcomeHeading')}
          features={features}
          closingInstruction={t('vendorForm.closingInstruction')}
        />

        {submitted ? (
          <div className="registration-success">
            <span className="registration-success-icon" aria-hidden="true">
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#check-circle"></use>
              </svg>
            </span>
            <h2>{t('vendorForm.successTitle')}</h2>
            <p>{t('vendorForm.successBody', { name: form.ownerName })}</p>
            <p className="registration-success-note">{t('vendorForm.successNote')}</p>
          </div>
        ) : (
          <form className="registration-wizard" onSubmit={handleSubmit}>
            <div className="wizard-progress-row">
              <p className="wizard-step-label">{t('form.stepOf', { current: step + 1, total: steps.length })}</p>
              <StepProgress steps={steps} currentStep={step} onStepClick={setStep} />
            </div>

            <p className="required-note">{t('form.requiredNote')}</p>

            {step === 0 && (
              <WizardStep title={t('vendorForm.step1.title')} description={t('vendorForm.step1.description')}>
                <TextField label={t('vendorForm.shopNameLabel')} required value={form.shopName} onChange={(value) => set('shopName', value)} />
                <TextField label={t('vendorForm.ownerNameLabel')} required value={form.ownerName} onChange={(value) => set('ownerName', value)} />

                <div className="field-row">
                  <TextField
                    label={t('vendorForm.ownerMobileLabel')}
                    required
                    type="tel"
                    value={form.ownerMobile}
                    onChange={(value) => set('ownerMobile', value)}
                  />
                  <TextField
                    label={t('vendorForm.shopMobileLabel')}
                    type="tel"
                    value={form.shopMobile}
                    onChange={(value) => set('shopMobile', value)}
                  />
                </div>

                <FileUploadField
                  label={t('vendorForm.shopLogoLabel')}
                  files={form.shopLogo}
                  onChange={(files) => set('shopLogo', files)}
                  maxFiles={5}
                  maxSizeMB={1}
                  accept="image/*"
                />

                <FileUploadField
                  label={t('vendorForm.shopBannerLabel')}
                  files={form.shopBanner}
                  onChange={(files) => set('shopBanner', files)}
                  maxFiles={5}
                  maxSizeMB={1}
                  accept="image/*"
                />7D  
              </WizardStep>
            )}

            {step === 1 && (
              <WizardStep title={t('vendorForm.step2.title')} description={t('vendorForm.step2.description')}>
                <div className="field-row">
                  <SelectField
                    label={t('form.stateLabel')}
                    required
                    options={districts}
                    value={form.state}
                    onChange={(value) => {
                      setForm((prev) => ({ ...prev, state: value, city: '' }))
                    }}
                  />
                  <SelectField
                    label={t('form.cityLabel')}
                    required
                    options={areas}
                    value={form.city}
                    onChange={(value) => set('city', value)}
                  />
                </div>

                <TextField
                  label={t('vendorForm.shopAddressLabel')}
                  required
                  multiline
                  value={form.shopAddress}
                  onChange={(value) => set('shopAddress', value)}
                />

                <LocationPicker
                  label={t('map.label')}
                  required
                  value={form.location}
                  onChange={(location) => set('location', location)}
                  onUseAddress={(address) => set('shopAddress', address)}
                />
              </WizardStep>
            )}

            {step === 2 && (
              <WizardStep title={t('vendorForm.step3.title')} description={t('vendorForm.step3.description')}>
                <TextField
                  label={t('vendorForm.deliveryTimeLabel')}
                  required
                  placeholder={t('vendorForm.deliveryTimePlaceholder')}
                  value={form.deliveryTime}
                  onChange={(value) => set('deliveryTime', value)}
                />

                <FileUploadField
                  label={t('vendorForm.menuUploadLabel')}
                  required
                  files={form.menuFiles}
                  onChange={(files) => set('menuFiles', files)}
                  maxFiles={5}
                  maxSizeMB={1}
                  accept="image/*,.pdf"
                />

                <div className="field-row">
                  <TextField
                    label={t('vendorForm.openingTimeLabel')}
                    required
                    type="time"
                    value={form.openingTime}
                    onChange={(value) => set('openingTime', value)}
                  />
                  <TextField
                    label={t('vendorForm.closingTimeLabel')}
                    required
                    type="time"
                    value={form.closingTime}
                    onChange={(value) => set('closingTime', value)}
                  />
                </div>
              </WizardStep>
            )}

            {step === 3 && (
              <WizardStep title={t('vendorForm.step4.title')} description={t('vendorForm.step4.description')}>
                <RadioGroup
                  label={t('vendorForm.gstLabel')}
                  options={[t('vendorForm.yes'), t('vendorForm.no')]}
                  value={form.gstRegistration}
                  onChange={(value) => set('gstRegistration', value)}
                />

                <FileUploadField
                  label={t('vendorForm.gstCertificateLabel')}
                  files={form.gstCertificate}
                  onChange={(files) => set('gstCertificate', files)}
                  maxFiles={5}
                  maxSizeMB={1}
                  accept="image/*,.pdf"
                />

                <TextField
                  label={t('vendorForm.fssaiNumberLabel')}
                  required
                  value={form.fssaiNumber}
                  onChange={(value) => set('fssaiNumber', value)}
                />
                <TextField
                  label={t('vendorForm.fssaiExpiryLabel')}
                  required
                  type="date"
                  value={form.fssaiExpiryDate}
                  onChange={(value) => set('fssaiExpiryDate', value)}
                />

                <FileUploadField
                  label={t('vendorForm.fssaiCertificateLabel')}
                  required
                  files={form.fssaiCertificate}
                  onChange={(files) => set('fssaiCertificate', files)}
                  maxFiles={1}
                  maxSizeMB={1}
                  accept="image/*,.pdf"
                />
              </WizardStep>
            )}

            {submitError && <p className="file-error">{submitError}</p>}

            <div className="wizard-nav">
              {step > 0 && (
                <button type="button" className="back-button" onClick={goBack}>
                  {t('form.back')}
                </button>
              )}
              {step < steps.length - 1 ? (
                <button type="submit" className="submit-button" disabled={!stepValidity[step]}>
                  {t('form.next')}
                </button>
              ) : (
                <button type="submit" className="submit-button" disabled={!canSubmit || submitting}>
                  {submitting ? t('form.submitting') : t('form.submit')}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default VendorRegistration
