import Axios from 'axios'

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not set')
}

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    withCredentials: true,
    withXSRFToken: true,
})

export default axios