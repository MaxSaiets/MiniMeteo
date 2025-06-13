import axios, {type InternalAxiosRequestConfig} from 'axios';

const API_URL = import.meta.env.VITE_WEATHER_API_URL;

const $host = axios.create({
    baseURL: API_URL
})

const optionalAuthInterceptor = (config: InternalAxiosRequestConfig ) => {
    return config;
}

$host.interceptors.request.use(optionalAuthInterceptor);

export {$host}