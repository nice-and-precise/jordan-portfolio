"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface LocationData {
    id: string;
    city: string;
    coords: [number, number]; // Lat, Lng
    marketStatus: "growth" | "stable" | "volatile";
}

interface MapWrapperProps {
    locations: LocationData[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    layerStyle: "dark" | "satellite";
}

// Component to handle map view updates
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

// Custom Marker Icon (approximate to the previous CSS ones using DivIcon?)
// For now, let's use standard pins but maybe colorized.
// To keep it simple and robust, we'll stick to standard Leaflet functionality first, 
// possibly using custom DivIcons if we want to match the exact previous aesthetic.
// Let's implement a simple DivIcon to keep the "dot" look.

const createCustomIcon = (status: string, selected: boolean) => {
    let colorClass = "bg-blue-500";
    if (status === "growth") colorClass = "bg-emerald-500";
    if (status === "volatile") colorClass = "bg-amber-500";

    return L.divIcon({
        className: "custom-pin",
        html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-lg ${colorClass} ${selected ? 'scale-125' : ''}">
                 <div class="absolute inset-0 rounded-full animate-ping opacity-50 ${colorClass}"></div>
               </div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
    });
};


const MapWrapper: React.FC<MapWrapperProps> = ({ locations, selectedId, onSelect, layerStyle }) => {

    // Config for different layers
    const layers = {
        dark: {
            url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        },
        satellite: {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }
    };

    const currentLayer = layers[layerStyle];
    const center: [number, number] = [39.8283, -98.5795]; // USA Center

    return (
        <MapContainer
            center={center}
            zoom={4}
            scrollWheelZoom={true}
            className="w-full h-full bg-[#090b10]"
            style={{ background: '#090b10' }} // Prevent white flash
        >
            <TileLayer
                attribution={currentLayer.attribution}
                url={currentLayer.url}
            />

            {locations.map(loc => (
                <Marker
                    key={loc.id}
                    position={loc.coords}
                    icon={createCustomIcon(loc.marketStatus, loc.id === selectedId)}
                    eventHandlers={{
                        click: () => onSelect(loc.id),
                    }}
                >
                    {/* Tooltip on hover is implied by Leaflet or we can add <Tooltip> */}
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapWrapper;
