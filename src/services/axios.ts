import axios from 'axios';
import { getCookie, removeCookies } from 'cookies-next';
import Router from 'next/router';
const cookie = getCookie("organize.token")

const api = axios.create({

    baseURL: process.env.NEXT_PUBLIC_APP_URL_API,
    headers: {
        Authorization: `Bearer ${cookie}`
    }
})

api.interceptors.response.use(response => {

    return response

}, (error) => {
    if (error.response.status === 401) {

        removeCookies('organize.token')
        removeCookies('organize.user')

        Router.push("/auth/login")
    }

    return Promise.reject(error)

})

export default api