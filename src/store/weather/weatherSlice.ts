import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IWeatherResponse } from "../../types";
import { fetchForecastData } from "../../services/weather";

interface WeatherState {
  weatherData: IWeatherResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
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
  async ({location, days=7, lat, lon, dt}, thunkAPI) => {
    try {
      return await fetchForecastData({q: location, days, lat, lon, dt});
    } catch (error: any){
      const errMessage: string = error.response?.data?.error?.message || error.message || "Failed to load weather data";
      console.error("Error fetching weather data (fetchWeatherForecast):", errMessage);
      return thunkAPI.rejectWithValue(errMessage);
    }
  }
);

const initialState: WeatherState = {
  weatherData: null,
  loading: false,
  error: null,
  lastUpdated: null
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
      })
      .addCase(fetchWeatherForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.weatherData = null;
        state.lastUpdated = null;
        console.log("Error fetching weather data (rejected):", action.payload);
      })
  },
});

export const { clearWeatherData } = weatherSlice.actions;
export default weatherSlice.reducer;