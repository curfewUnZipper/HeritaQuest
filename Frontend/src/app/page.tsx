'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navigation from './components/Navigation'
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
        <Navigation
  isGameMenuOpen={isGameMenuOpen}
  setIsGameMenuOpen={setIsGameMenuOpen}
  locationName={locationName}
  position={position ?? null}
/>

        <div style={{ flex: 1 }}>
          <MapView
            position={position}
            setPosition={handleSetPosition}
            locationName={locationName}
            setLocationName={setLocationName}
          />
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
