'use client';
import { Gamepad2 } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { useMenuContext } from '../context/MenuContext';
import GameSelectMenu from './GameSelectMenu';

export default function GameButton({ className }: { className?: string }) {
  const { isGameMenuOpen, setIsGameMenuOpen, closeAllMenus } = useMenuContext();

  const handleClick = () => {
    if (!isGameMenuOpen) closeAllMenus();
    setIsGameMenuOpen(!isGameMenuOpen);
  };

  return (
    <button
      onClick={handleClick}
      className={`${className} bg-green-600 text-white font-bold p-1 rounded-full shadow hover:bg-green-700`}
      aria-label="Open Game Menu"
    >
      <Gamepad2 className="w-6 h-6" />
    </button>
  );
}