/**
 * Meta Pixel helper utilities.
 * The base Pixel snippet (in index.html) handles PageView on every load.
 * Use these helpers to fire additional standard / custom events from React.
 */

/**
 * Fire a standard Meta Pixel event (e.g. 'Lead', 'CompleteRegistration').
 * @param {string} event  - Standard event name
 * @param {object} [params] - Optional event parameters
 */
export function trackEvent(event, params = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', event, params)
  }
}

/**
 * Fire a custom Meta Pixel event.
 * @param {string} event  - Custom event name
 * @param {object} [params] - Optional event parameters
 */
export function trackCustomEvent(event, params = {}) {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', event, params)
  }
}
