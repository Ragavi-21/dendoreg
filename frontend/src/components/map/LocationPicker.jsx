import { useEffect, useRef, useState } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { useTranslation } from 'react-i18next'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../form/Field.css'
import './LocationPicker.css'

const INDIA_CENTER = [22.97, 78.65]
const DEFAULT_ZOOM = 5
const PIN_ZOOM = 16
const SEARCH_DEBOUNCE_MS = 500

const pinIcon = L.divIcon({
  className: 'location-pin-icon',
  html:
    '<svg viewBox="0 0 24 30" width="34" height="34">' +
    '<path d="M12 0C5.4 0 0 5.4 0 12c0 8.5 12 18 12 18s12-9.5 12-18C24 5.4 18.6 0 12 0z" fill="#2563eb" stroke="#fff" stroke-width="1.5"/>' +
    '<circle cx="12" cy="12" r="4.5" fill="#fff"/>' +
    '</svg>',
  iconSize: [34, 30],
  iconAnchor: [17, 30],
})

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(event) {
      onSelect(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

function FlyToTarget({ target }) {
  const map = useMap()

  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], Math.max(map.getZoom(), PIN_ZOOM))
    }
  }, [target, map])

  return null
}

function LocationPicker({ label, required, value, onChange, onUseAddress }) {
  const { t } = useTranslation()
  const [position, setPosition] = useState(
    value?.lat && value?.lng ? { lat: value.lat, lng: value.lng } : null,
  )
  const [address, setAddress] = useState(value?.address ?? '')
  const [resolvingAddress, setResolvingAddress] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [flyTarget, setFlyTarget] = useState(null)
  const [error, setError] = useState('')
  const searchTimeoutRef = useRef(null)

  useEffect(() => {
    return () => clearTimeout(searchTimeoutRef.current)
  }, [])

  async function reverseGeocode(lat, lng) {
    setResolvingAddress(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      )
      const data = await response.json()
      const resolved = data?.display_name ?? ''
      setAddress(resolved)
      onChange({ lat, lng, address: resolved })
    } catch {
      setAddress('')
      onChange({ lat, lng, address: '' })
    } finally {
      setResolvingAddress(false)
    }
  }

  function commitPosition(lat, lng, { fly = false, knownAddress } = {}) {
    setPosition({ lat, lng })
    setError('')
    if (fly) setFlyTarget({ lat, lng })

    if (knownAddress !== undefined) {
      setAddress(knownAddress)
      onChange({ lat, lng, address: knownAddress })
    } else {
      reverseGeocode(lat, lng)
    }
  }

  function handleQueryChange(nextValue) {
    setQuery(nextValue)
    clearTimeout(searchTimeoutRef.current)

    if (!nextValue.trim()) {
      setResults([])
      return
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=in&q=${encodeURIComponent(nextValue)}`,
        )
        const data = await response.json()
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, SEARCH_DEBOUNCE_MS)
  }

  function selectResult(result) {
    commitPosition(parseFloat(result.lat), parseFloat(result.lon), {
      fly: true,
      knownAddress: result.display_name,
    })
    setQuery('')
    setResults([])
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError(t('map.locateError'))
      return
    }
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (geoPosition) => {
        setLocating(false)
        commitPosition(geoPosition.coords.latitude, geoPosition.coords.longitude, { fly: true })
      },
      (geoError) => {
        setLocating(false)
        setError(geoError.code === geoError.PERMISSION_DENIED ? t('map.permissionDenied') : t('map.locateError'))
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  return (
    <div className="field location-picker">
      {label && (
        <span className="field-label">
          {label} {required && <span className="required-mark">*</span>}
        </span>
      )}

      <div className="location-picker-controls">
        <div className="location-picker-search-input">
          <svg role="presentation" aria-hidden="true">
            <use href="/dendo-icons.svg#search"></use>
          </svg>
          <input
            type="text"
            value={query}
            placeholder={t('map.searchPlaceholder')}
            onChange={(event) => handleQueryChange(event.target.value)}
          />
        </div>
        <button type="button" className="location-picker-locate" onClick={useMyLocation} disabled={locating}>
          <svg role="presentation" aria-hidden="true">
            <use href="/dendo-icons.svg#locate"></use>
          </svg>
          {locating ? t('map.locating') : t('map.useMyLocation')}
        </button>
      </div>

      {searching && <p className="location-picker-status">{t('map.searching')}</p>}

      {results.length > 0 && (
        <ul className="location-picker-results">
          {results.map((result) => (
            <li key={result.place_id}>
              <button type="button" onClick={() => selectResult(result)}>
                {result.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="location-picker-map">
        <MapContainer
          center={position ? [position.lat, position.lng] : INDIA_CENTER}
          zoom={position ? PIN_ZOOM : DEFAULT_ZOOM}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution=""
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={(lat, lng) => commitPosition(lat, lng)} />
          <FlyToTarget target={flyTarget} />
          {position && (
            <Marker
              position={[position.lat, position.lng]}
              icon={pinIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const latlng = event.target.getLatLng()
                  commitPosition(latlng.lat, latlng.lng)
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <p className="location-picker-hint">{t('map.dragHint')}</p>

      {error && <p className="file-error">{error}</p>}

      <div className="location-picker-summary">
        {position ? (
          <>
            <svg role="presentation" aria-hidden="true">
              <use href="/dendo-icons.svg#map-pin"></use>
            </svg>
            <div>
              <strong>{t('map.selectedAddressLabel')}</strong>
              <p>{resolvingAddress ? t('map.searching') : address || `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}`}</p>
            </div>
          </>
        ) : (
          <p className="location-picker-empty">{t('map.noLocation')}</p>
        )}
      </div>

      {position && (
        <div className="location-picker-actions">
          {onUseAddress && address && (
            <button type="button" onClick={() => onUseAddress(address)}>
              {t('map.useThisAddress')}
            </button>
          )}
          <a
            href={`https://www.google.com/maps?q=${position.lat},${position.lng}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('map.openInGoogleMaps')}
          </a>
        </div>
      )}
    </div>
  )
}

export default LocationPicker
