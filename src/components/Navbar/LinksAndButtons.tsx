import { Link } from "react-router-dom";
import { MAIN_ROUTE } from "../../consts/routePaths";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { FaMapMarkedAlt } from "react-icons/fa";

interface Props {
    handleToggleTheme: () => void;
    handleAccurateGeo: () => void;
    handleLocPickerModalOpen: () => void;
    isDarkMode: boolean;
    isMobile: boolean;
}

const LinksAndButtons = ({handleToggleTheme, handleAccurateGeo, handleLocPickerModalOpen, isDarkMode, isMobile}: Props) => {
  return (
    <>
        <button className="border p-2 cursor-pointer border-accent rounded-lg flex items-center gap-2 text-text"
            onClick={() => handleToggleTheme()}
        >
            {isDarkMode ? (
                <SunIcon className="w-4 h-4 text-text" />
            ) :(
                <MoonIcon className="w-4 h-4 text-text" />
            )}
            {isMobile ? "Theme mode" : null}
        </button>

        <button className="border p-1 cursor-pointer border-accent rounded-lg text-text"
            onClick={() => handleAccurateGeo()}
        >
            Enable accurate geolocation
        </button>

        <button className="border p-2 cursor-pointer border-accent rounded-lg flex items-center gap-2 text-text"
            onClick={() => handleLocPickerModalOpen()}
        >
            <FaMapMarkedAlt  className="w-4 h-4 text-text" />
            {isMobile ? "Location Picker" : null}
        </button>

        <Link 
            to={MAIN_ROUTE}
            className="bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
        >
            Main
        </Link>
    </>
  );
};

export default LinksAndButtons;