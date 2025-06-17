import { useState } from "react";
import LocationPickerModal from "../Popups/LocationPickerModal/LocationPickerModal";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { fetchWeatherForecast } from "../../store/weather/weatherSlice"; // Assuming you have a fetchWeather action
import LinksAndButtons from "./LinksAndButtons";
import { MAIN_ROUTE } from "../../consts/routePaths";
import { Link } from "react-router-dom";
const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return localStorage.getItem("selectedTheme") === "dark";
    });

    const handleAccurateGeo = () => {
        if(!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            ({ coords: { latitude, longitude } }) => {
                const position = [latitude, longitude];

                localStorage.setItem("userGeoPos", JSON.stringify(position));

                dispatch(fetchWeatherForecast({ lat: latitude, lon: longitude }));
            }, (error) => {
                console.error("Geolocation error:", error);
                alert("Failed to fetch geolocation. Please enable location services in your browser settings.");
            }
        );
    };

    const handleToggleTheme = () => {
        const newTheme = isDarkMode ? "light" : "dark";
        setIsDarkMode(!isDarkMode);
        localStorage.setItem("selectedTheme", newTheme);

        if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const [isLocPickerModalOpen, setLocPickerModalOpen] = useState<boolean>(false);

    const handleLocPickerModalOpen = () => {
        setLocPickerModalOpen(true);
    }

    return (
        <nav className="sticky top-0 z-100 bg-secondary shadow-sm">
            <div className="max-w-screen mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <Link 
                            to={MAIN_ROUTE}
                            className="flex-shrink-0"
                        >
                            <p className="text-base md:text-xl font-bold text-text">MiniMeteo</p>
                        </Link>
                    </div>

                    <button
                        className="sm:hidden text-text focus:outline-none cursor-pointer"
                        onClick={() => setIsMobileMenuOpen(prev => !prev)}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                        {isMobileMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                        </svg>
                    </button>
                    
                    {/* For full nav */}
                    <div className="hidden sm:flex items-center space-x-1 md:space-x-4">
                        <LinksAndButtons 
                            handleToggleTheme={handleToggleTheme}
                            handleAccurateGeo={handleAccurateGeo}
                            handleLocPickerModalOpen={handleLocPickerModalOpen}
                            isDarkMode={isDarkMode}
                            isMobile={false}
                        />
                    </div>

                    {/* Mobile menu */}
                    {isMobileMenuOpen && (
                        <div className="sm:hidden absolute top-0 right-0 w-full h-screen z-50"
                            onClick={() => setIsMobileMenuOpen(prev => !prev)}
                        >
                            <div className="sm:hidden fixed top-13 right-0 flex flex-col gap-2 px-4 py-4 bg-secondary border-gray-100 border-2 shadow-md rounded-md z-100">
                                <LinksAndButtons 
                                    handleToggleTheme={handleToggleTheme}
                                    handleAccurateGeo={handleAccurateGeo}
                                    handleLocPickerModalOpen={handleLocPickerModalOpen}
                                    isDarkMode={isDarkMode}
                                    isMobile={true}
                                />
                            </div>
                        </div>

                    )}
                </div>
            </div>

            {isLocPickerModalOpen && <LocationPickerModal
                onClose={() => setLocPickerModalOpen(false)}
            />}

        </nav>
    )
}

export default Navbar;