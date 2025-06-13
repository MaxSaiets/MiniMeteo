import { Link } from "react-router-dom";
import { MAIN_ROUTE } from "../../consts/routePaths";
import { useState } from "react";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";

const Navbar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

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

    return (
        <nav className="sticky top-0 z-100 bg-secondary shadow-sm">
            <div className="max-w-screen mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                            <p className="text-base md:text-xl font-bold text-text">MiniMeteo</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-1 md:space-x-4">
                        <button className="border p-2 cursor-pointer border-accent rounded-lg"
                            onClick={() => handleToggleTheme()}
                        >
                            {isDarkMode ? (
                                <SunIcon className="w-4 h-4 text-text" />
                            ) :(
                                <MoonIcon className="w-4 h-4 text-text" />
                            )}
                        </button>
                        <Link 
                            to={MAIN_ROUTE}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Main
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;