'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface DevUser {
  name: string;
  avatar?: string;
}

export default function SignInPage() {
  const router = useRouter();

  // Single field for username or email
  const [username, setUserOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // TODO: Replace with your auth context or global state setter
  const fakeSetUser = (user: DevUser) => {
    // Here you would store user info in a global auth provider or localStorage
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://heritaquest-ip4c.onrender.com/public/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Sign in failed');
      } else {
        // On success, store user and redirect home
        const tokenWithQuotes = await response.text();
        const token = tokenWithQuotes.replace(/^"|"$/g, '')
        localStorage.setItem("heritaQuestToken",token)
        console.log(token);
        fakeSetUser({ name: username, avatar: '' });
        router.push('/');  // Redirect to home page
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <h1 className="text-3xl text-black font-bold mb-6">Sign In</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md mb-4">
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <label htmlFor="userOrEmail" className="block mb-2 text-black font-semibold">
          Username or Email
        </label>
        <input
          id="userOrEmail"
          type="text"
          value={username}
          onChange={e => setUserOrEmail(e.target.value)}
          className="w-full p-2 border text-black rounded mb-4"
          placeholder="Enter username or email"
          required
        />

        <label htmlFor="password" className="block mb-2 text-black font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full text-black p-2 border rounded mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

    </div>
  );
}
