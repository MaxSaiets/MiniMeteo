import { $host } from "./index";
import type { IWeatherResponse } from "../types"

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

interface IFetchForecastParams {
    q?: string;
    lat?: number;
    lon?: number;
    days?: number;
    dt?: string;
    hour?: number;
    aqi?: string;
    lang?: string;
    alerts?: string;
}

export const fetchForecastData = async ({q, lat, lon, days, dt, hour, aqi, lang, alerts}: IFetchForecastParams ): Promise<IWeatherResponse> => {
    console.log("Fetching weather data.")
    try {
        const response = await $host.get<IWeatherResponse>('/forecast.json', {
            params: {
                key: API_KEY,
                q: q || lat + ',' + lon,
                days: days,
                lan: lat,
                lon: lon,
                dt: dt,
                hour: hour,
                aqi: aqi,
                lang: lang,
                alerts: alerts,
            }
        });
    
        return response.data;
    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error; // Re-throw the error to handle it in the calling function
        
    }
}