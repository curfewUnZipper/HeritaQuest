'use client';
import { createContext, useContext, useState } from 'react';

type MenuContextType = {
  isUserMenuOpen: boolean;
  setIsUserMenuOpen: (open: boolean) => void;
  isGameMenuOpen: boolean;
  setIsGameMenuOpen: (open: boolean) => void;
  closeAllMenus: () => void;
};

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenuContext must be used within MenuProvider');
  return context;
};

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isGameMenuOpen, setIsGameMenuOpen] = useState(false);

  const closeAllMenus = () => {
    setIsUserMenuOpen(false);
    setIsGameMenuOpen(false);
  };

  return (
    <MenuContext.Provider
      value={{
        isUserMenuOpen,
        setIsUserMenuOpen,
        isGameMenuOpen,
        setIsGameMenuOpen,
        closeAllMenus,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};
