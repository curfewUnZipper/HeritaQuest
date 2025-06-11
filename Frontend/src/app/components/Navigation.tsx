import React from 'react';
import UserMenu from './UserMenu';
import GameButton from './GameButton';
import GameSelectMenu from './GameSelectMenu';

interface NavigationProps {
  isGameMenuOpen: boolean;
  setIsGameMenuOpen: (open: boolean) => void;
  locationName: string;
  position?: [number, number] | null;
}

const Navigation: React.FC<NavigationProps> = ({
  isGameMenuOpen,
  setIsGameMenuOpen,
  locationName,
  position,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <UserMenu />
      <GameButton className="absolute top-4 right-18" />

      {isGameMenuOpen && (
        <div className="absolute top-16 right-4 z-[10000]">
          <GameSelectMenu
            onClose={() => setIsGameMenuOpen(false)}
            locationName={locationName}
            coordinates={position}
          />
        </div>
      )}

      <header className="p-4 bg-[#1c5366] text-white font-bold text-xl">
        Herita Quest
      </header>

      <div className="px-4 py-2 bg-[#badbde] text-[#1e40af] font-semibold">
        {locationName}
        {position && (
          <div className="font-normal text-sm">
            Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
