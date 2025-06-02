'use client';
import { useMapEvents } from 'react-leaflet';

type LocationMarkerProps = {
  setPosition: (pos: [number, number]) => void;
  setLocationName: (name: string) => void;
};

export default function LocationMarker({ setPosition, setLocationName }: LocationMarkerProps) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
        .then((res) => res.json())
        .then((data) => {
          const name = data.display_name || 'Unknown location';
          setLocationName(name);
        });
    },
  });

  return null;
}
