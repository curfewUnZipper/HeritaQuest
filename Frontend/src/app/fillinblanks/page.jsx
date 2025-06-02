import React, { Suspense } from 'react';
import FillInBlanksClient from './FillInBlanksClient';

export default function FillInBlanksPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FillInBlanksClient />
    </Suspense>
  );
}
