import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import LocationMarker from './LocationMarker';
import SearchBarControl from './SearchBarControl';
import '../../../lib/mapIconFix';

const DEFAULT_POSITION: [number, number] = [20.5937, 78.9629]; // India center

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
  const handleClear = () => {
    setPosition(null);
    setLocationName('Click on the map or search for a location');
  };

  return (
    <div className="relative ">
      <SearchBarControl
        onSelect={(lat, lon, name) => {
          setPosition([lat, lon]);
          setLocationName(name);
        }}
      />

      {/* Clear button overlay */}
      {position && (
        <button
          onClick={handleClear}
          className="absolute top-25 left-2 text-white text-sm px-3 py-1 rounded shadow"
        >
          X
        </button>
      )}

      <MapContainer
        center={position || DEFAULT_POSITION}
        zoom={position ? 13 : 4}
        scrollWheelZoom={true}
        style={{ height: '84vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker setPosition={setPosition} setLocationName={setLocationName} />
        {position && <Marker position={position} />}
      </MapContainer>
    </div>
  );
}
