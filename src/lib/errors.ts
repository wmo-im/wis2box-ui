import { useGlobalStateStore } from '@/stores/global'
import i18n from '@/locales/i18n'

/**
 * Take in error info, pass it to pinia for global state, and display it
 * Since app.vue watches for errors, this will trigger the error dialog popup
 * @param {string} errorMessage - the error message to display
 * @param {string} [url] - the URL of the error source
 * @param {number} [status] - the HTTP status code of the error
 */
export function catchAndDisplayError(
  errorMessage: string,
  url?: string,
  status?: number,
) {
  const globalState = useGlobalStateStore()

  const { t } = i18n.global // use the global i18n we defined at application startup to translate error messages

  globalState.clearError()

  let msg

  if (status) {
    switch (status) {
      case 401:
        msg = t('messages.not_authorized')
        break
      case 404:
        msg = t('messages.does_not_exist')
        break
      default:
        msg = errorMessage // fall back if the statuscode is not associated with a specific error message
    }
  } else {
    msg = errorMessage
  }

  globalState.setError(msg, url || null, status || null)

  console.error(errorMessage)
}
