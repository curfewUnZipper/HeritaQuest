'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useMenuContext } from '../context/MenuContext';

const placeholderAvatar = 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';

interface User {
  name: string;
  avatar?: string;
}

export default function UserMenu() {
  const { isUserMenuOpen, setIsUserMenuOpen, closeAllMenus } = useMenuContext();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
  function handleClickOutside(e: MouseEvent) {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setIsUserMenuOpen(false);
    }
  }
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, [setIsUserMenuOpen]);


  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Sign out function
  const signOut = () => {
  localStorage.removeItem('heritaQuestToken');
  localStorage.removeItem('user');
  setCurrentUser(null);
  setIsUserMenuOpen(false);
};


  return (
    <div ref={menuRef} className="absolute text-black top-4 right-4 z-[1000]">
      <button
  onClick={() => {
    if (!isUserMenuOpen) closeAllMenus();
    setIsUserMenuOpen(!isUserMenuOpen);
  }}
>
  <Image
    src={currentUser?.avatar || placeholderAvatar}
    alt="User Avatar"
    width={32}
    height={32}
    className="rounded-full cursor-pointer"
  />
</button>


      {isUserMenuOpen && (
        <div className="mt-1 right-0 w-48 bg-white border rounded shadow-lg absolute">
          {!currentUser ? (
            <>
              <Link href="/signin">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign In</div>
              </Link>
              <Link href="/signup">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Sign Up</div>
              </Link>
            </>
          ) : (
            <>
              <Link href="/profile">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">View Profile</div>
              </Link>
              <Link href="/leaderboard">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Leaderboard</div>
              </Link>
              <Link href="/history">
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Games History</div>
              </Link>
              <div
                className="px-4 py-2 hover:bg-red-100 cursor-pointer text-red-600"
                onClick={signOut}
              >
                Sign Out
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
