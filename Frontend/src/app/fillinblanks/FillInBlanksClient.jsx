'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function FillInBlanksClient() {
  const [quiz, setQuiz] = useState(null);
  const [responses, setResponses] = useState({});
  const [score, setScore] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [bearerToken, setBearerToken] = useState(null);

  const searchParams = useSearchParams();
  const location = searchParams.get('topic');

  useEffect(() => {
    const token = localStorage.getItem('heritaQuestToken');
    setBearerToken(token);
  }, []);

  useEffect(() => {
    async function fetchQuiz() {
      if (!bearerToken || !location) return;

      setLoading(true);
      try {
        const res = await fetch('http://192.168.48.175:8080/ai/generate-fill-Quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({ location }),
        });

        if (!res.ok) throw new Error(`Failed to fetch quiz: ${res.statusText}`);

        const data = await res.json();
        setQuiz(data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Unknown error');
        setQuiz(null);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [bearerToken, location]);

  function handleChange(questionId, value) {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!quiz || !bearerToken) return;

    setSubmitLoading(true);
    setError(null);

    let calculatedScore = 0;
    quiz.questions.forEach((q) => {
      if (
        responses[q.id] &&
        responses[q.id].trim().toLowerCase() === q.correctAns.trim().toLowerCase()
      ) {
        calculatedScore++;
      }
    });
    setScore(calculatedScore);

    const putPayload = {
      id: quiz.id,
      marks: calculatedScore,
      response: responses,
    };

    try {
      const res = await fetch(
        'http://192.168.48.175:8080/FB-quiz/updateFbQuizResponse',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(putPayload),
        }
      );

      if (!res.ok) throw new Error(`Error submitting responses: ${res.statusText}`);

      alert(`Submitted! Your score: ${calculatedScore} / ${quiz.questions.length}`);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!quiz) return <p>No quiz available</p>;

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h1>{quiz.name}</h1>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((q, i) => (
          <div
            key={q.id}
            style={{ marginBottom: 24, borderBottom: '1px solid #ccc', paddingBottom: 12 }}
          >
            <label htmlFor={`question-${q.id}`} style={{ fontWeight: 'bold' }}>
              Q{i + 1}: {q.question}
            </label>
            <br />
            <input
              id={`question-${q.id}`}
              type="text"
              value={responses[q.id] || ''}
              onChange={(e) => handleChange(q.id, e.target.value)}
              placeholder="Fill in your answer"
              style={{ width: '100%', padding: 8, fontSize: 16, marginTop: 6 }}
              required
              autoComplete="off"
            />
            <small style={{ color: '#555' }}>Hint: {q.hint}</small>
          </div>
        ))}

        <button
          type="submit"
          disabled={submitLoading}
          style={{ padding: '10px 20px', fontSize: 18, cursor: submitLoading ? 'not-allowed' : 'pointer' }}
        >
          {submitLoading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {score !== null && (
        <p style={{ marginTop: 20, fontWeight: 'bold' }}>
          Your Score: {score} / {quiz.questions.length}
        </p>
      )}
    </div>
  );
}
