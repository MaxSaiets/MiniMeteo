import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { fetchWeatherForecast, getUserGeoDataFromIP } from "../../store/weather/weatherSlice"; // Assuming you have a fetchWeather action
import Spinner from "../Spinner/LoadingSpinner";
import type { IForecastDay, IHourForecast } from "../../types";
import { useNavigate } from "react-router-dom";
import type { LatLngTuple } from "leaflet";

const Dashboard = () => {
    const userGeoPosFromLocalStorage = localStorage.getItem('userGeoPos');
    
    const weather = useSelector((state: RootState) => state.weather);
    const dispatch = useDispatch<AppDispatch>();
    const [forecastData, setforecastData] = useState<IForecastDay[]>([]);
    const [forecastDays, setForecastDays] = useState<number>(3);

    const navigate = useNavigate();

    const [geoPosition, setGeoPosition] = useState<LatLngTuple | null>(null);

    useEffect(() => {
        const fetchUserIpData = async () => {
            try {
                const data = await dispatch(getUserGeoDataFromIP()).unwrap();

                setGeoPosition([data.lat, data.lon]);
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
            }
        }
        
        if(!userGeoPosFromLocalStorage){
            fetchUserIpData();
        } else{
            try {
                const parsed = JSON.parse(userGeoPosFromLocalStorage);
                if (Array.isArray(parsed) && parsed.length === 2 && typeof parsed[0] === "number" && typeof parsed[1] === "number") {
                    setGeoPosition(parsed as LatLngTuple);
                }
            } catch {
                //ignore
            }
        }
    }, [dispatch, userGeoPosFromLocalStorage]);

    useEffect(() => {
        const fetchData = async () => {
            if(weather.weatherData === null && weather.userGeoPos && geoPosition){
                try {
                    await dispatch(fetchWeatherForecast({ lat: geoPosition[0] , lon: geoPosition[1] })).unwrap();
                } catch (error) {
                    console.error("Failed to fetch weather data:", error);
                }
            }
        };
        
        fetchData();
    }, [dispatch, weather.weatherData, weather.userGeoPos, geoPosition]);

    useEffect(() => {
        console.log("Weather data:", weather.weatherData);
        if (weather.weatherData) {
            const slicedForecast = weather.weatherData.forecast.forecastday.slice(0, forecastDays);
            console.log("Sliced data:", slicedForecast);
            setforecastData(slicedForecast);
        }
    }, [weather.weatherData, forecastDays]);

    const handleForecastDays = async (days: number) => {
        setForecastDays(days);
    }

    if (weather.loading) {
        return <Spinner />;
    }

    return (
        <div className="relative bg-background flex flex-col justify-between ">
            <div className="flex max-w-[100vw] h-full flex-row md:gap-3 justify-around items-center m-2">
                <button 
                    className={`hover:bg-gray-300 text-gray-600 hover:text-gray-900 px-3 py-3 md:px-4 md:py-4 rounded-md text-sm font-medium transition-colors mb-2 ${forecastDays === 1 ? "bg-green-300" : "bg-gray-200"}`}
                    onClick={() => handleForecastDays(1)}    
                >
                    Today
                </button>
                <button 
                    className={`hover:bg-gray-300 text-gray-600 hover:text-gray-900 px-3 py-3 md:px-4 md:py-4 rounded-md text-sm font-medium transition-colors mb-2 ${forecastDays === 3 ? "bg-green-300" : "bg-gray-200"}`}
                    onClick={() => handleForecastDays(3)}    
                >
                    3-Days
                </button>
                <button 
                    className={`hover:bg-gray-300 text-gray-600 hover:text-gray-900 px-3 py-3 md:px-4 md:py-4 rounded-md text-sm font-medium transition-colors mb-2 ${forecastDays === 7 ? "bg-green-300" : "bg-gray-200"}`}
                    onClick={() => handleForecastDays(7)}    
                >
                    7-Days
                </button>
                <button 
                    className={`hover:bg-gray-300 text-gray-600 hover:text-gray-900 px-3 py-3 md:px-4 md:py-4 rounded-md text-sm font-medium transition-colors mb-2 ${forecastDays === 14 ? "bg-green-300" : "bg-gray-200"}`}
                    onClick={() => handleForecastDays(14)}    
                >
                    14-Days
                </button>
           </div>

            <div className=" text-text min-h-screen p-4">

                <h1 className="text-2xl font-bold mb-8 text-center">{`Погода в ${weather.weatherData?.location.name}, ${weather.weatherData?.location.region}, ${weather.weatherData?.location.country} (lat: ${weather.weatherData?.location.lat}, lon: ${weather.weatherData?.location.lon})`}</h1>
        
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {forecastData.map((day: IForecastDay, index: number) => (
                    <div 
                        key={index} 
                        className={`bg-secondary p-4 rounded-lg cursor-pointer transition-all}`}
                        onClick={() => navigate(`/day/${day.date}`)}
                    >
                        <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">{new Date(day.date).toLocaleDateString('uk-UA', { weekday: "short", day: "2-digit", month: "2-digit" })}</h2>
                            <p className="text-text">Температура: {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C</p>
                            <p className="text-text">Опади: {day.day.totalprecip_mm} мм</p>
                        </div>
                        <img 
                            src={day.day.condition.icon} 
                            alt={day.day.condition.text}
                            className="w-16 h-16"
                        />
                        </div>

                        <div className="mt-4 pt-4 border-t border-secondary">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="text-text">Схід сонця</p>
                                <p>{day.astro.sunrise}</p>
                            </div>
                            <div>
                                <p className="text-text">Захід сонця</p>
                                <p>{day.astro.sunset}</p>
                            </div>
                            </div>

                            <div className="mb-4">
                            <p className="text-text">Місяць:</p>
                            <p>{day.astro.moon_phase} ({day.astro.moon_illumination}% освітлення)</p>
                            </div>

                            <div className="mb-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-text">Ймовірність дощу</p>
                                    <div className="w-2/3 bg-secondary rounded-full h-2.5">
                                        <div 
                                            className="h-2.5 rounded-full"
                                            style={{ width: `${day.day.daily_chance_of_rain}%` }}
                                        >
                                        </div>
                                    </div>
                                    <span className="ml-2">{day.day.daily_chance_of_rain}%</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <div className="flex gap-2 overflow-x-auto pb-2">
                                    {day.hour.map((hour: IHourForecast, hourIndex: number) => (
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
                    ))}
                </div>
            </div>

        </div>
    );
}; 

export default Dashboard;