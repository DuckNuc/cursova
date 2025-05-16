import axios from "axios"
import https from "https"
const API_URL = "https://moth-bright-frankly.ngrok-free.app" // For Android emulator

export const api = axios.create({
  baseURL: API_URL,
    headers: {
    "Content-Type": "application/json"
  }
})



// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    if (response && response.data && response.data.message) {
      // Use the error message from the API
      return Promise.reject(new Error(response.data.message))
    }

    if (!response) {
      return Promise.reject(new Error("Network error. Please check your connection."))
    }

    return Promise.reject(error)
  },
)
