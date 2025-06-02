'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordAgain, setPasswordAgain] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!name || !username || !email || !password || !passwordAgain) {
      setError('Please fill in all the fields.');
      return;
    }

    if (password !== passwordAgain) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL; 
      console.log(baseUrl, name, email, password);
      
      const response = await fetch('https://heritaquest-ip4c.onrender.com/public/Signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to sign up');
      } else {
        setSuccessMsg('Sign up successful! Check your email for next steps.');
        setName('');
        setUsername('');
        setEmail('');
        setPassword('');
        setPasswordAgain('');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center text-black items-center p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

        <label htmlFor="name" className="block mb-2 text-black font-semibold">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border text-black rounded mb-4"
          required
        />

        <label htmlFor="username" className="block mb-2 text-black font-semibold">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full p-2 border text-black rounded mb-4"
          required
        />

        <label htmlFor="email" className="block mb-2 text-black font-semibold">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full p-2 border text-black rounded mb-4"
          required
        />

        <label htmlFor="password" className="block mb-2 text-black font-semibold">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full p-2 border text-black rounded mb-4"
          required
        />

        <label htmlFor="passwordAgain" className="block mb-2 text-black font-semibold">Confirm Password</label>
        <input
          id="passwordAgain"
          type="password"
          value={passwordAgain}
          onChange={e => setPasswordAgain(e.target.value)}
          className="w-full p-2 border text-black rounded mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded text-white ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {loading ? 'Submitting...' : 'Sign Up'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-700">
        Already a user?{' '}
        <Link href="/signin">
          <span className="text-blue-600 hover:underline cursor-pointer">Sign in instead</span>
        </Link>
      </p>
    </div>
  );
}
