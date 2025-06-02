'use client';

import { useState, useEffect } from 'react';

interface Props {
  onSelect: (lat: number, lon: number, name: string) => void;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export default function SearchBarControl({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [typedQuery, setTypedQuery] = useState(''); // track last typed text

  useEffect(() => {
  const controller = new AbortController();

  const debounce = setTimeout(() => {
    if (query.length >= 3) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: Suggestion[]) => {
          setSuggestions(data.slice(0, 5));
        })
        .catch((err) => {
          if (err.name !== 'AbortError') console.error(err);
        });
    } else {
      setSuggestions([]);
    }
  }, 300); // debounce delay

  return () => {
    clearTimeout(debounce);
    controller.abort();
  };
}, [query]);


  const handleSearchClick = () => {
    if (typedQuery.length < 3) return;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${typedQuery}&limit=1`)

      .then((res) => res.json())
      .then((data: Suggestion[]) => {
        if (data.length > 0) {
          const bestMatch = data[0];
          onSelect(parseFloat(bestMatch.lat), parseFloat(bestMatch.lon), bestMatch.display_name);
          setQuery(bestMatch.display_name);
          setSuggestions([]);
        } else {
          setQuery(typedQuery); // trigger regular suggestion fallback
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="absolute z-[1000] top-2 left-1/2 transform text-black -translate-x-1/2 bg-white rounded shadow-lg p-3 w-96">
      <div className="flex gap-2">
        <input
  type="text"
  value={typedQuery}
  placeholder="Search for a place..."
  className="flex-1 p-2 border border-gray-300 rounded"
  onChange={(e) => {
    const val = e.target.value;
    setTypedQuery(val);
    setQuery(val);
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  }}
/>

        <button
          onClick={handleSearchClick}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="mt-2 border border-gray-300 rounded max-h-48 overflow-y-auto">
          {suggestions.map((sug, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setTypedQuery(sug.display_name);
                setSuggestions([]);
                onSelect(parseFloat(sug.lat), parseFloat(sug.lon), sug.display_name);
              }}
            >
              {sug.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
