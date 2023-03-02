import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5002/',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

//post requests
export const sendOtp = async(data) => {return await api.post('/users/send-otp', data)}
export const verifyOtp = async(data) => api.post('/users/verify-otp', data)
export const activate = async(data) => api.post('/users/activate', data)
export const logout = async(data) => api.post('/users/logout',data)
export const createRoom = async(data) => api.post('/rooms/create',data)

//get requests
export const fetchRooms = async() => api.get('/rooms/')

// Interceptors
api.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config
        if (error.response.status === 401 && (error.response.message==="jwt expired" || error.response.data.message==="jwt expired" ) && !originalRequest._retry) { // idk something changed , temporary fix
            originalRequest._retry = true
            try {
                const response = await api.get('/users/refresh')
                if (response.status === 200) {
                    return api.request(originalRequest)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        throw error;
            
    })
export default api