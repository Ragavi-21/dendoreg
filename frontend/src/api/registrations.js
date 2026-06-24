async function submitFormData(endpoint, formData) {
  const response = await fetch(endpoint, { method: 'POST', body: formData })
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong. Please try again.')
  }

  return data
}

function appendFiles(formData, fieldName, files) {
  files.forEach((file) => formData.append(fieldName, file))
}

export function submitRiderRegistration(form) {
  const formData = new FormData()

  formData.append('firstName', form.firstName)
  formData.append('lastName', form.lastName)
  formData.append('mobileNumber', form.mobileNumber)
  formData.append('email', form.email)
  formData.append('gender', form.gender === 'Other' ? form.genderOther : form.gender)
  formData.append('state', form.state)
  formData.append('city', form.city)
  formData.append('fullAddress', form.fullAddress)
  formData.append('latitude', form.location.lat)
  formData.append('longitude', form.location.lng)
  formData.append('locationAddress', form.location.address || '')
  formData.append('vehicleType', form.vehicleType)
  formData.append('idProofType', form.idProofType)
  formData.append('drivingLicenseNumber', form.drivingLicenseNumber)

  appendFiles(formData, 'profilePicture', form.profilePicture)
  appendFiles(formData, 'idProofFile', form.idProofFile)
  appendFiles(formData, 'drivingLicenseFile', form.drivingLicenseFile)

  return submitFormData('/api/rider-registrations', formData)
}

export function submitVendorRegistration(form) {
  const formData = new FormData()

  formData.append('shopName', form.shopName)
  formData.append('ownerName', form.ownerName)
  formData.append('ownerMobile', form.ownerMobile)
  formData.append('shopMobile', form.shopMobile || '')
  formData.append('state', form.state)
  formData.append('city', form.city)
  formData.append('shopAddress', form.shopAddress)
  formData.append('latitude', form.location.lat)
  formData.append('longitude', form.location.lng)
  formData.append('locationAddress', form.location.address || '')
  formData.append('deliveryTime', form.deliveryTime)
  formData.append('openingTime', form.openingTime)
  formData.append('closingTime', form.closingTime)
  formData.append('gstRegistration', form.gstRegistration || '')
  formData.append('fssaiNumber', form.fssaiNumber)
  formData.append('fssaiExpiryDate', form.fssaiExpiryDate)

  appendFiles(formData, 'shopLogo', form.shopLogo)
  appendFiles(formData, 'shopBanner', form.shopBanner)
  appendFiles(formData, 'menuFiles', form.menuFiles)
  appendFiles(formData, 'gstCertificate', form.gstCertificate)
  appendFiles(formData, 'fssaiCertificate', form.fssaiCertificate)

  return submitFormData('/api/vendor-registrations', formData)
}
