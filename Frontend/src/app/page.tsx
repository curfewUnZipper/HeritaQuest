'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import UserMenu from './components/UserMenu';
import GameSelectMenu from './components/GameSelectMenu';
import GameButton from './components/GameButton';
import { ReduxProviderWrapper } from './context/ReduxProviderWrapper';
import { MenuProvider, useMenuContext } from './context/MenuContext';
import Quiz from './quiz/page';
const MapView = dynamic(() => import('./components/MapView'), { ssr: false });
// const Quiz = dynamic(() => import('./quiz/page'), { ssr: false });  // lazy load

function PageContent() {
  const { isGameMenuOpen, setIsGameMenuOpen } = useMenuContext();

  const [position, setPosition] = useState<[number, number] | null>(null);
  const [locationName, setLocationName] = useState('Click on the map or search for a location');

  const handleSetPosition = (newPosition: [number, number] | null) => {
    setPosition(newPosition);
    if (newPosition !== null) {
      setIsGameMenuOpen(true);
    }
  };

  const formattedLocation =
    position && locationName !== 'Click on the map or search for a location'
      ? `${locationName}  Lat: ${position[0].toFixed(4)}, Lng: ${position[1].toFixed(4)}`
      : '';

  return (
    <>
      <UserMenu />
      <GameButton className="absolute top-4 right-18" />

      {isGameMenuOpen && (
        <div className="fixed top-16 right-4 z-[10000]">
          <GameSelectMenu
            onClose={() => setIsGameMenuOpen(false)}
            locationName={locationName}
            coordinates={position}
          />
        </div>
      )}

      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="p-4 bg-[#1c5366] text-white font-bold text-xl">Herita Quest</header>

        <div className="px-4 py-2 bg-[#badbde] text-[#1e40af] font-semibold">
          {locationName}
          {position && (
            <div className="font-normal text-sm">
              Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <MapView
            position={position}
            setPosition={handleSetPosition}
            locationName={locationName}
            setLocationName={setLocationName}
          />
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <ReduxProviderWrapper>
      <MenuProvider>
        <PageContent />
      </MenuProvider>
    </ReduxProviderWrapper>
  );
}
