'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState('quiz');
  const [quizData, setQuizData] = useState([]);
  const [fillData, setFillData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data function
  const fetchData = (tab) => {
    const token = localStorage.getItem('heritaQuestToken');
    if (!token) {
      setError('No auth token found');
      return;
    }

    setLoading(true);
    setError(null);
const endpoint =
  tab === 'quiz'
    ? 'http://192.168.48.175:8080/LocationQuiz/getLeaderboard'
    : 'http://192.168.48.175:8080/FB-quiz/getLeaderboard';

fetch(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => {
    if (!res.ok) throw new Error('Failed to fetch leaderboard data');
    return res.json();
  })
  .then((data) => {
    if (tab === 'quiz') setQuizData(data);
    else setFillData(data);
  })
  .catch((err) => setError(err.message))
  .finally(() => setLoading(false));
  };
  // Fetch initial data for the default tab
  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

function handleQuizHistory(){
  setActiveTab('quiz');
}
function handleFillHistory(){
  setActiveTab('fill');

}
  // Render leaderboard list
  const renderList = (data) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-400">No leaderboard data found.</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 text-black">
      <div className="grid grid-cols-3 font-semibold border-b pb-2 mb-2">
        <span>Rank</span>
        <span>Name</span>
        <span>Score</span>
      </div>
      {data.map((entry, index) => (
        <div key={index} className="grid grid-cols-3 py-2 border-b">
          <span>{index + 1}</span>
          <span>{entry.username || 'N/A'}</span>
          <span>{entry.marks ?? '0'}</span>
        </div>
      ))}
    </div>
  );
};



  return (
    <div className="max-w-3xl text-white mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-white text-center">Leaderboard</h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-6 mb-6">
        <button
          onClick={() => handleQuizHistory()}
          className={`px-4 py-2 text-white rounded ${
            activeTab === 'quiz'
              ? 'bg-green-600 text-white font-semibold'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Quiz Leaderboard
        </button>
        <button
          onClick={() => handleFillHistory()}
          className={`px-4 py-2 text-white rounded ${
            activeTab === 'fill'
              ? 'bg-green-600 text-white font-semibold'
              : 'bg-gray-200 text-white hover:bg-gray-300'
          }`}
        >
          Fill in the Blanks Leaderboard
        </button>
      </div>

      {/* Content */}
      {loading && <p className="text-center">Loading leaderboard...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      {!loading && !error && (activeTab === 'quiz' ? renderList(quizData) : renderList(fillData))}
    </div>
  );
}
