import { useEffect } from "react";
import type { RootState, AppDispatch } from "../../store/store";
import type { IForecastDay, IHourForecast } from "../../types";
import { useParams } from "react-router-dom";
import { useGeolocation } from "../../hooks/useGeolocation";
import LoadingSpinner from "../Spinner/LoadingSpinner";
import { useSelector, useDispatch } from "react-redux";
import { fetchWeatherForecast } from "../../store/weather/weatherSlice"; // Assuming you have a fetchWeather action

const DayView = () => {
    const weather = useSelector((state: RootState) => state.weather);
    const dispatch = useDispatch<AppDispatch>();
    const { date } = useParams<{ date: string }>();
    const { lat, lon, loading, error } = useGeolocation();
    
    useEffect(() => {
        
        if (!weather.weatherData && lat && lon) {
            dispatch(fetchWeatherForecast({ lat, lon, days: 14 }));
        }
        
    }, [dispatch, weather.weatherData, lat, lon, date]);
    
    if (!weather.weatherData) {
        return <div className="text-red-500 text-2xl text-center mt-4">Дані про погоду не знайдено</div>;
    }

    const data = weather.weatherData.forecast.forecastday.find((day: IForecastDay) => day.date === date);



    if (weather.loading  || loading) {
        return <LoadingSpinner />;
    }
    if (error) {
        return <div className="text-red-500 text-2xl text-center mt-4">{error}</div>;
    }
    if (!data) {
        return <div className="text-red-500 text-2xl text-center mt-4">Дані про погоду для цієї дати не знайдено</div>;
    }
    
    return (
        <div className=" bg-background text-white min-h-screen p-4">

            <h1 className="text-2xl font-bold mb-8 text-center">{`Погода в ${weather.weatherData?.location.name}, ${weather.weatherData?.location.region}, ${weather.weatherData?.location.country} (lat: ${weather.weatherData?.location.lat}, lon: ${weather.weatherData?.location.lon})`}</h1>
    
            <div className="flex justify-around gap-6 mb-8">
                <div 
                    className={`bg-secondary p-4 rounded-lg cursor-pointer transition-all}`}
                >
                    <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">{new Date(data.date).toLocaleDateString('uk-UA', { weekday: "short", day: "2-digit", month: "2-digit" })}</h2>
                        <p className="text-gray-400">Температура: {data.day.mintemp_c}°C - {data.day.maxtemp_c}°C</p>
                        <p className="text-gray-400">Опади: {data.day.totalprecip_mm} мм</p>
                    </div>
                    <img 
                        src={data.day.condition.icon} 
                        alt={data.day.condition.text}
                        className="w-16 h-16"
                    />
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <p className="text-text">Схід сонця</p>
                            <p>{data.astro.sunrise}</p>
                        </div>
                        <div>
                            <p className="text-text">Захід сонця</p>
                            <p>{data.astro.sunset}</p>
                        </div>
                        </div>

                        <div className="mb-4">
                        <p className="text-text">Місяць:</p>
                        <p>{data.astro.moon_phase} ({data.astro.moon_illumination}% освітлення)</p>
                        </div>

                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <p className="text-tetx">Ймовірність дощу</p>
                                <div className="w-2/3 bg-gray-700 rounded-full h-2.5">
                                    <div 
                                        className="h-2.5 rounded-full"
                                        style={{ width: `${data.day.daily_chance_of_rain}%` }}
                                    >
                                    </div>
                                </div>
                                <span className="ml-2">{data.day.daily_chance_of_rain}%</span>
                            </div>
                        </div>

                        <div className="mt-4 max-w-[80vw] md:max-w-[80vw]">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {data.hour.map((hour: IHourForecast, hourIndex: number) => (
                                <div key={hourIndex} className="bg-accent p-2 rounded text-center">
                                    <p className="text-sm">{hour.time.split(' ')[1]}</p>
                                    <img src={hour.condition.icon} alt={hour.condition.text} className="w-8 h-8 mx-auto" />
                                    <p className="text-sm">{hour.temp_c}°C</p>
                                    <p className="text-xs text-text">{hour.wind_kph} км/год</p>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayView;