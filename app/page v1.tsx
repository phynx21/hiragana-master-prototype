'use client'; // This tells Next.js we want interactivity!

import { useState } from 'react';

export default function HiraganaPrototype() {
  const [step, setStep] = useState(0); // 0 = A, 1 = I, etc.
  const [phase, setPhase] = useState('STORY'); // 'STORY' or 'TRACE'

  const characters = ['あ', 'い', 'う', 'え', 'お'];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black p-4">
      
      {/* Title Area */}
      <h1 className="text-4xl font-bold mb-10 text-indigo-600">
        Hiragana Mastery
      </h1>

      {/* The Content Card */}
      <div className="w-full max-w-md bg-gray-50 rounded-3xl p-8 shadow-2xl border border-gray-200 text-center">
        
        {phase === 'STORY' ? (
          <div>
            <h2 className="text-6xl mb-6">{characters[step]}</h2>
            <div className="bg-blue-100 rounded-xl h-64 flex items-center justify-center mb-6">
              <span className="text-gray-500 italic">[Your Procreate Story Image Here]</span>
            </div>
            <button 
              onClick={() => setPhase('TRACE')}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-indigo-700 transition"
            >
              Start Tracing
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Trace the character!</h2>
            <div className="bg-green-100 rounded-xl h-64 flex items-center justify-center mb-6 border-4 border-dashed border-green-300">
               <span className="text-6xl opacity-20">{characters[step]}</span>
            </div>
            <button 
              onClick={() => {
                if (step < 4) {
                  setStep(step + 1);
                  setPhase('STORY');
                } else {
                  alert("Chapter 1 Complete!");
                  setStep(0);
                  setPhase('STORY');
                }
              }}
              className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-xl hover:bg-green-700 transition"
            >
              I Finished!
            </button>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <p className="mt-8 text-gray-400">Progress: {step + 1} / 5</p>
    </main>
  );
}