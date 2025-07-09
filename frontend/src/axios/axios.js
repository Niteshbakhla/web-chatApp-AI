import axios from "axios"


const axiosinstance = axios.create({
            baseURL: import.meta.env.VITE_APP_API_URL,
            withCredentials: true
});

export default axiosinstance;