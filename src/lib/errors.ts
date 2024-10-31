import { useGlobalStateStore } from '@/stores/global'

export function catchAndDisplayError(
  error: string,
  url?: string,
  status?: number,
) {
  const globalState = useGlobalStateStore()

  globalState.clearError()

  let msg

  if (status && status === 401) {
    msg = t('messages.not_authorized')
  }

  if (status) {
    switch (status) {
      case 401:
        msg = t('messages.not_authorized')
        break
      case 404:
        msg = t('messages.does_not_exist')
        break
      default:
        msg = error
    }
  }

  globalState.setError(msg, url || null, status || null)

  console.log(error)
}
