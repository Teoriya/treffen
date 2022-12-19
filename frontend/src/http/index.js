import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5002/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export const sendOtp = async(data) => {return await api.post('/users/send-otp', data)}
export const verifyOtp = async(data) => api.post('/users/verify-otp', data)
export default api