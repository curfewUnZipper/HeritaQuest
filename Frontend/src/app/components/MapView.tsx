import { MapContainer, TileLayer, Marker, GeoJSON } from 'react-leaflet';
import LocationMarker from './LocationMarker';
import SearchBarControl from './SearchBarControl';
import { useEffect, useState } from 'react';
import '../../../lib/mapIconFix';
import { MenuProvider, useMenuContext } from '../context/MenuContext';

const DEFAULT_POSITION: [number, number] = [20.5937, 78.9629]; // Center of India

export default function MapView({
  position,
  setPosition,
  locationName,
  setLocationName,
}: {
  position: [number, number] | null;
  setPosition: (pos: [number, number] | null) => void;
  locationName: string;
  setLocationName: (name: string) => void;
}) {
  const { setIsUserMenuOpen, setIsGameMenuOpen } = useMenuContext();
  const handleClear = () => {
    setIsUserMenuOpen(false);
    setIsGameMenuOpen(false);
    setPosition(null);
    setLocationName('Click on the map or search for a location');
  };

  // World bounds
  const worldBounds: [[number, number], [number, number]] = [
    [-90, -180],  // Southwest corner (lat, lon)
    [90, 180],    // Northeast corner (lat, lon)
  ];

  // Function to clamp coordinates inside world bounds
  const clampToWorldBounds = ([lat, lon]: [number, number]): [number, number] => {
    const [[minLat, minLon], [maxLat, maxLon]] = worldBounds;

    const clampedLat = Math.min(Math.max(lat, minLat), maxLat);
    const clampedLon = Math.min(Math.max(lon, minLon), maxLon);

    return [clampedLat, clampedLon];
  };

  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  useEffect(() => {
    // Make sure india-composite.geojson is in your public folder
    fetch('/india-composite.geojson')
      .then((res) => res.json())
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error('Failed to load GeoJSON:', err));
  }, []);

  return (
    <div className="relative overflow-y-auto">
      <SearchBarControl
        onSelect={(lat, lon, name) => {
          const clampedPos = clampToWorldBounds([lat, lon]);
          setPosition(clampedPos);
          setLocationName(name);
        }}
      />

      {position && (
        <button
          onClick={handleClear}
          className="absolute top-25 left-2 bg-red-600 text-white text-sm px-3 py-1 rounded shadow z-[9999]"
        >
          Clear
        </button>
      )}

      <MapContainer
        center={position || DEFAULT_POSITION}
        zoom={position ? 13 : 4}
        scrollWheelZoom={true}
        maxBounds={worldBounds}          // restrict map to entire world
        maxBoundsViscosity={1.0}         // prevent dragging outside the world
        worldCopyJump={false}            // disables infinite horizontal wrapping
        minZoom={3}                      // Set minimum zoom level
        maxZoom={15}                     // Set maximum zoom level
        style={{ height: '84vh', width: '100%' }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* GeoJSON India Boundary */}
        {geoJsonData && (
          <GeoJSON
            data={geoJsonData}
            style={{
              color: 'rgb(160, 76, 175)',  // Boundary stroke color (matches default Leaflet)
              weight: 0.5,
              fillOpacity: 0,
            }}
          />
        )}

        <LocationMarker setPosition={setPosition} setLocationName={setLocationName} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
