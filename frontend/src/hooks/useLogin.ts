import { useMutation } from '@tanstack/react-query'
import { login } from '../api'

export const useLogin = (onSuccess: (token: string) => void) => {
  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      login(username, password),
    onSuccess: (data) => {
      onSuccess(data.access_token)
    },
  })
}
