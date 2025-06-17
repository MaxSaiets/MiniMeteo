import { useState } from "react";
import { MapContainer, TileLayer, Popup, Marker, useMapEvents } from "react-leaflet";
import { Cross1Icon } from "@radix-ui/react-icons";
import type { LatLngTuple } from "leaflet";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../store/store";
import { fetchWeatherForecast } from "../../../store/weather/weatherSlice";

import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerModalProps {
    onClose: () => void;
}

const LocationPickerModal = ({ onClose }: LocationPickerModalProps) => {
    const weather = useSelector((state: RootState) => state.weather);
    const dispatch = useDispatch<AppDispatch>();

    const [markerPos] = useState<LatLngTuple>(weather.userGeoPos || [50.44953037519583, 30.525402421683072]);

    const handleMapClick = (lat: number, lng: number) => {
        dispatch(fetchWeatherForecast({ lat, lon: lng })).unwrap();
        onClose();
    };
    
    function ClickHandler() {
        useMapEvents({
            click(e) {
                handleMapClick(e.latlng.lat, e.latlng.lng);
            },
        });
        return null;
    }

    return (
        <div
            onClick={onClose}
            className="fixed inset-0 flex items-center justify-center h-[100dvh] backdrop-blur-md z-100 animate-fadeIn"
            style={{
                animation: "fadeIn 0.2s ease-in-out",
                animationFillMode: "forwards",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-lg p-1 md:p-2 w-[92vw] md:w-[80vw] h-[80vh] flex flex-col items-center justify-center "
            >
                <div className="w-full h-full rounded-lg overflow-hidden bg-gray-200">
                    <MapContainer
                        center={markerPos}
                        zoom={12}
                        scrollWheelZoom={true}
                        className="w-full h-full"
                        style={{ width: "100%", height: "100%" }}
                        >
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                        <ClickHandler />
                        {markerPos && (
                            <Marker position={markerPos}>
                                <Popup>
                                    {markerPos[0].toFixed(8)}, {markerPos[1].toFixed(8)}
                                </Popup>
                            </Marker>
                        )}
                    </MapContainer>
                </div>
                
                <div className="flex text-center items-center justify-between w-full">
                    <div className="text-sm text-gray-700 text-center">
                        Натисніть на карту, щоб вибрати координати.
                    </div>

                    <button
                        className="flex items-center justify-center hover:bg-gray-500 bg-gray-300 w-8 h-8 rounded leading-none"
                        onClick={onClose}
                        aria-label="Закрити"
                        type="button"
                    >
                        <Cross1Icon className="w-4 h-4 text-text hover:text-black text-2xl" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationPickerModal;