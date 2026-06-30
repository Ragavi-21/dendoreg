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
import { submitRiderRegistration } from '../../api/registrations.js'
import './RegistrationPage.css'

const FEATURE_KEYS = ['free', 'dailyBonus', 'weeklyBonus', 'noUniform', 'flexibleHours', 'petrolAllowance']
const VEHICLE_TYPE_KEYS = ['twoWheeler', 'threeWheeler', 'fourWheeler', 'evScooter', 'tataAce', 'threeWheelerAce', 'pickup8ft', 'tata407']
const ID_PROOF_TYPE_KEYS = ['aadhaar', 'pan', 'voterId', 'passport']
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
  profilePicture: [],
  firstName: '',
  lastName: '',
  mobileNumber: '',
  email: '',
  gender: '',
  genderOther: '',
  state: '',
  city: '',
  fullAddress: '',
  location: null,
  vehicleType: '',
  idProofType: '',
  idProofFile: [],
  drivingLicenseNumber: '',
  drivingLicenseFile: [],
}

function RiderRegistration() {
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

  const features = FEATURE_KEYS.map((key) => t(`riderForm.features.${key}`))
  const vehicleTypes = VEHICLE_TYPE_KEYS.map((key) => t(`form.vehicleTypes.${key}`))
  const idProofTypes = ID_PROOF_TYPE_KEYS.map((key) => t(`form.idProofTypes.${key}`))
  const districts = DISTRICTS.map((key) => t(`form.cities.${key}`))
  const currentDistrictKey = getDistrictKey(form.state)
  const areas = currentDistrictKey
    ? DISTRICT_AREAS[currentDistrictKey].map((key) => t(`form.areas.${key}`))
    : []

  const genderValid = form.gender && (form.gender !== 'Other' || form.genderOther.trim())

  const step1Valid = Boolean(
    form.firstName.trim() && form.lastName.trim() && form.mobileNumber.trim().length >= 10 && form.email.trim() && genderValid,
  )
  const step2Valid = Boolean(
    form.state && form.city && form.fullAddress.trim() && form.location?.lat && form.location?.lng,
  )
  const step3Valid = Boolean(
    form.vehicleType &&
      form.idProofType &&
      form.idProofFile.length > 0 &&
      form.drivingLicenseNumber.trim() &&
      form.drivingLicenseFile.length > 0,
  )

  const stepValidity = [step1Valid, step2Valid, step3Valid]
  const canSubmit = step1Valid && step2Valid && step3Valid

  const steps = [t('riderForm.step1.title'), t('riderForm.step2.title'), t('riderForm.step3.title')]

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
      await submitRiderRegistration(form)
      trackEvent('Lead', { content_name: 'Rider Registration' })
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message || t('form.submitError'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="registration-page">
      <RegisterHeader subLabelKey="registerHeader.subLabelRider" />
      <div className="registration-page-body">
        <RegistrationIntro
          title={t('riderForm.pageTitle')}
          welcomeHeading={t('riderForm.welcomeHeading')}
          features={features}
          closingInstruction={t('riderForm.closingInstruction')}
        />

        {submitted ? (
          <div className="registration-success">
            <span className="registration-success-icon" aria-hidden="true">
              <svg role="presentation" aria-hidden="true">
                <use href="/dendo-icons.svg#check-circle"></use>
              </svg>
            </span>
            <h2>{t('riderForm.successTitle')}</h2>
            <p>{t('riderForm.successBody', { name: form.firstName })}</p>
            <p className="registration-success-note">{t('riderForm.successNote')}</p>
          </div>
        ) : (
          <form className="registration-wizard" onSubmit={handleSubmit}>
            <div className="wizard-progress-row">
              <p className="wizard-step-label">{t('form.stepOf', { current: step + 1, total: steps.length })}</p>
              <StepProgress steps={steps} currentStep={step} onStepClick={setStep} />
            </div>

            <p className="required-note">{t('form.requiredNote')}</p>

            {step === 0 && (
              <WizardStep title={t('riderForm.step1.title')} description={t('riderForm.step1.description')}>
                <FileUploadField
                  label={t('riderForm.profilePictureLabel')}
                  hint={t('riderForm.profilePictureHint')}
                  files={form.profilePicture}
                  onChange={(files) => set('profilePicture', files)}
                  maxFiles={1}
                  maxSizeMB={1}
                  accept="image/*"
                />

                <div className="field-row">
                  <TextField
                    label={t('form.firstName')}
                    required
                    hint={t('form.firstNameHint')}
                    value={form.firstName}
                    onChange={(value) => set('firstName', value)}
                  />
                  <TextField label={t('form.lastName')} required value={form.lastName} onChange={(value) => set('lastName', value)} />
                </div>

                <div className="field-row">
                  <TextField
                    label={t('form.mobileNumber')}
                    required
                    hint={t('form.mobileHint')}
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(value) => set('mobileNumber', value)}
                  />
                  <TextField label={t('form.email')} required type="email" value={form.email} onChange={(value) => set('email', value)} />
                </div>

                <RadioGroup
                  label={t('form.gender')}
                  required
                  options={[t('form.male'), t('form.female')]}
                  allowOther
                  otherLabel={t('form.other')}
                  value={form.gender}
                  onChange={(value) => set('gender', value)}
                  otherValue={form.genderOther}
                  onOtherChange={(value) => set('genderOther', value)}
                />
              </WizardStep>
            )}

            {step === 1 && (
              <WizardStep title={t('riderForm.step2.title')} description={t('riderForm.step2.description')}>
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
                  label={t('form.fullAddress')}
                  required
                  multiline
                  value={form.fullAddress}
                  onChange={(value) => set('fullAddress', value)}
                />

                <LocationPicker
                  label={t('map.label')}
                  required
                  value={form.location}
                  onChange={(location) => set('location', location)}
                  onUseAddress={(address) => set('fullAddress', address)}
                />
              </WizardStep>
            )}

            {step === 2 && (
              <WizardStep title={t('riderForm.step3.title')} description={t('riderForm.step3.description')}>
                <SelectField
                  label={t('form.vehicleTypeLabel')}
                  required
                  options={vehicleTypes}
                  value={form.vehicleType}
                  onChange={(value) => set('vehicleType', value)}
                />

                <SelectField
                  label={t('form.idProofTypeLabel')}
                  required
                  options={idProofTypes}
                  value={form.idProofType}
                  onChange={(value) => set('idProofType', value)}
                />

                <FileUploadField
                  label={t('riderForm.uploadIdProofLabel')}
                  required
                  files={form.idProofFile}
                  onChange={(files) => set('idProofFile', files)}
                  maxFiles={1}
                  maxSizeMB={1}
                  accept="image/*,.pdf"
                />

                <TextField
                  label={t('riderForm.drivingLicenseNumberLabel')}
                  required
                  value={form.drivingLicenseNumber}
                  onChange={(value) => set('drivingLicenseNumber', value)}
                />

                <FileUploadField
                  label={t('riderForm.uploadLicenseLabel')}
                  required
                  files={form.drivingLicenseFile}
                  onChange={(files) => set('drivingLicenseFile', files)}
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

export default RiderRegistration
