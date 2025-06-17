import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IpApiResponse, IWeatherResponse } from "../../types";
import { fetchForecastData } from "../../services/weather";
import type { LatLngTuple } from "leaflet";

interface WeatherState {
  weatherData: IWeatherResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  userIpData: IpApiResponse | null;
  userGeoPos: LatLngTuple | null;
}

interface FetchWeatherParams {
  location?: string;
  days?: number;
  lat?: number;
  lon?: number;
  dt?: string; // YYYY-MM-DD
}

export const fetchWeatherForecast = createAsyncThunk<IWeatherResponse, FetchWeatherParams, { rejectValue: string } >(
  "weather/fetchForecast",
  async ({location, days=14, lat, lon, dt}, thunkAPI) => {
    try {
      return await fetchForecastData({q: location, days, lat, lon, dt});
    } catch (error: any){
      const errMessage: string = error.response?.data?.error?.message || error.message || "Failed to load weather data";
      console.error("Error fetching weather data (fetchWeatherForecast):", errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

export const getUserGeoDataFromIP = createAsyncThunk<IpApiResponse, void, { rejectValue: string } >(
  "geo/fetchByIP",
  async (_, thunkAPI) => {
    try {
      const ipRes = await fetch(`https://ipwho.is/`);
      if (!ipRes.ok) {
        const errorText = await ipRes.text();
        return thunkAPI.rejectWithValue(`Error fetching user IP: ${errorText}`);
      }
      const ipData = await ipRes.json() as { ip: string };
      
      const response = await fetch(`https://api.weatherapi.com/v1/ip.json?key=${import.meta.env.VITE_WEATHER_API_KEY}&q=${ipData.ip}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        return thunkAPI.rejectWithValue(`Error fetching geolocation data: ${errorText}`);
      }
      const data: IpApiResponse = await response.json();

      localStorage.setItem("userGeoPos", JSON.stringify([data.lat, data.lon]));
      
      return data;
    } catch (error: any){
      const errMessage: string = error.response?.data?.error?.message || error.message || "Failed to load weather data";
      console.error("Error fetching user ip data (getUserGeoDataFromIP):", errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

const initialState: WeatherState = {
  weatherData: null,
  loading: false,
  error: null,
  lastUpdated: null,
  userIpData: null,
  userGeoPos: [50.44953037519583, 30.525402421683072]
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    clearWeatherData: (state) => {
      state.weatherData = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
      state.userGeoPos = [50.44953037519583, 30.525402421683072];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.lastUpdated = null;
      })
      .addCase(fetchWeatherForecast.fulfilled, (state, action: PayloadAction<IWeatherResponse>) => {
        state.weatherData = action.payload;
        state.loading = false;
        state.error = null;
        state.lastUpdated = new Date().toISOString()
        state.userGeoPos = [action.payload.location?.lat, action.payload.location?.lon];
      })
      .addCase(fetchWeatherForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.weatherData = null;
        state.lastUpdated = null;
        console.log("Error fetching weather data (rejected):", action.payload);
      })
      
      .addCase(getUserGeoDataFromIP.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getUserGeoDataFromIP.fulfilled, (state, action) => {
        state.loading = false
        state.userIpData = action.payload
        state.userGeoPos = [action.payload.lat, action.payload.lon];
      })
      .addCase(getUserGeoDataFromIP.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload ?? action.error.message ?? 'Unknown error'
      })
  },
});

export const { clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;