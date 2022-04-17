import {http} from './axios-config'

export async function signIn(email: string, password: string) {
    return await http.post(
        '/users/authenticate',
        {email, password}
    )
}

export function addSignInInterceptor(token: string) {
    return http.interceptors.request.use(request => {
        if (request.headers) {
            request.headers['Authorization'] = `Basic ${token}`
        }
        return request
    })
}

export function removeInterceptor(id: number) {
    return http.interceptors.request.eject(id)
}

export function addErrorInterceptor(logout: () => void) {
    return http.interceptors.response.use(res => res, err => {
        if (err?.response?.status === 401) {
            logout()
        } else {
            throw err
        }
    })
}