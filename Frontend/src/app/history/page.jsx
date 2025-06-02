'use client';

import React, { useEffect, useState } from 'react';

export default function HistoryPage() {
  const [quizHistory, setQuizHistory] = useState([]);
  const [fillHistory, setFillHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('quiz');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('heritaQuestToken');
    if (!token) {
      setError('No auth token found');
      return;
    }

    setLoading(true);
    setError(null);

    // Fetch quiz history
    fetch('https://heritaquest-ip4c.onrender.com/LocationQuiz/getHistory', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch quiz history');
        return res.json();
      })
      .then((data) => setQuizHistory(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    // Fetch fill in the blanks history
    fetch('https://heritaquest-ip4c.onrender.com/FB-quiz/getHistory', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch fill-in-blanks history');
        return res.json();
      })
      .then((data) => setFillHistory(data))
      .catch((err) => setError(err.message));
  }, []);

  const historyToShow = activeTab === 'quiz' ? quizHistory : fillHistory;

  return (
    <div className="max-w-3xl text-white mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Game History</h1>

      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeTab === 'quiz' ? 'bg-blue-600 text-black' : 'bg-gray-200 text-black'}`}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz History
        </button>
        <button
          className={`px-4 py-2 rounded ${activeTab === 'fill' ? 'bg-blue-600 text-black' : 'bg-gray-200 text-black' }`}
          onClick={() => setActiveTab('fill')}
        >
          Fill in the Blanks History
        </button>
      </div>

      {loading && <p>Loading history...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && !error && (
        <>
          {historyToShow.length === 0 ? (
            <p className="text-gray-500">No history found.</p>
          ) : (
            <ul className="space-y-4">
              {historyToShow.reverse().map((item, idx) => (
                <li key={idx} className="p-4 border  rounded shadow-sm">
                  <p className="font-semibold">Game ID: {item.id}</p>
                  <p>Score: {item.marks}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
