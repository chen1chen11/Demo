import { ref } from 'vue'

export const eventLogs = ref([])

export const trackEvent = (eventName, params = {}) => {
  const fullParams = { ...params, timestamp: Date.now() }
  eventLogs.value.unshift({
    time: new Date().toLocaleTimeString('en-US', { hour12: false }),
    event: eventName,
    params: fullParams
  })
}

export const clearLogs = () => {
  eventLogs.value = []
}

export const sendMatomoEvent = (category, action, name, value = null) => {
  if (window._paq) {
    window._paq.push(['trackEvent', category, action, name, value])
  } else {
    console.warn('Matomo _paq not found')
  }
}

export const sendGA4Event = (eventName, params = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, params)
  } else {
    console.warn('gtag not found')
  }
}