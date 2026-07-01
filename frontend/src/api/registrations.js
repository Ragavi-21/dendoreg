async function submitFormData(endpoint, formData) {
  let response
  try {
    response = await fetch(endpoint, { method: 'POST', body: formData })
  } catch {
    // Network error — server unreachable or no internet
    throw new Error('Cannot reach the server. Please check your internet connection and try again.')
  }

  // Try to parse JSON — nginx/proxy errors return HTML so this may be null
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    // Give a specific, helpful message for each common status code
    if (response.status === 413) {
      throw new Error('File too large. Please upload files smaller than 5 MB each.')
    }
    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('Server is temporarily unavailable. Please try again in a moment.')
    }
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
