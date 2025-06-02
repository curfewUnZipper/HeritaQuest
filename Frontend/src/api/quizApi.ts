export type RawQuizData = Array<{
  "question 1": string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  "correct option": string;
}>;

// ✅ Accept one string and pass it directly
export async function fetchQuizQuestions(metadata: string) {
  const res = await fetch('/api/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ metadata }) // ✅ wrap in object
  });

  if (!res.ok) throw new Error('Failed to fetch quiz questions');
  return res.json();
}
