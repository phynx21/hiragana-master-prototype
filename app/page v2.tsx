'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HiraganaPrototype() {
  const [step, setStep] = useState(0); 
  const [phase, setPhase] = useState('STORY');
  const videoRef = useRef<HTMLVideoElement>(null);

  const characters = [
    { char: 'あ', story: '勇者が山から「あぁぁぁ！」と叫んでいる。', color: 'indigo' },
    { char: 'い', story: 'いたい！足（あし）を石（いし）にぶつけました。', color: 'red' },
    { char: 'う', story: 'うれしい！宝地図（たからちず）を見つけました。', color: 'yellow' },
    { char: 'え', story: 'えがおで歩（ある）き続（つづ）けます。', color: 'green' },
    { char: 'お', story: 'おいしい！やっと食（た）べ物（もの）がありました。', color: 'orange' },
  ];

  const current = characters[step];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      
      {/* 1. Header Section */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-indigo-600">HIRAGANA MASTER V2.0</h1>
        <div className="flex gap-2 mt-2 justify-center">
          {characters.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* 2. Main Interaction Card */}
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-8 border border-slate-100 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {phase === 'STORY' ? (
            <motion.div 
              key="story"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex flex-col items-center"
            >
              {/* STACKED MEDIA AREA */}
              <div className="relative w-full aspect-square rounded-3xl bg-slate-100 overflow-hidden mb-6 border-4 border-slate-50 shadow-inner">
                
                {/* BOTTOM LAYER: Your Procreate Drawing */}
                <img 
                  src="/hero-cliff.png" 
                  alt="Mnemonic Background" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* TOP LAYER: The Gura MP4 with Fading Effect */}
                <motion.div
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-contain mix-blend-screen" 
                  >
                    <source src="/gura-clip.mp4" type="video/mp4" />
                  </video>
                </motion.div>

                {/* CHARACTER BADGE */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-sm">
                  <span className="text-4xl font-bold">{current.char}</span>
                </div>
              </div>

              <p className="text-xl font-medium text-slate-700 text-center mb-8 px-4">
                {current.story}
              </p>

              <button 
                onClick={() => setPhase('TRACE')}
                className="group relative w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg active:scale-95"
              >
                Start Tracing ✍️
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="trace"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-widest">Tracing Mode</h2>
              
              {/* TRACING PLACEHOLDER */}
              <div className="w-full aspect-square bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 flex items-center justify-center mb-8 relative">
                <span className="text-[12rem] font-bold text-slate-100 absolute select-none">
                  {current.char}
                </span>
                <p className="text-slate-400 z-10 font-medium bg-white/80 px-4 py-2 rounded-full shadow-sm">
                  [Interactive Canvas Engine Pending]
                </p>
              </div>

              <button 
                onClick={() => {
                  if (step < 4) {
                    setStep(step + 1);
                    setPhase('STORY');
                  } else {
                    alert("Training Session Complete!");
                    setStep(0);
                    setPhase('STORY');
                  }
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg active:scale-95"
              >
                I Mastered It! ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button className="mt-8 text-slate-400 font-medium hover:text-indigo-500 transition-colors">
        Skip to Quiz →
      </button>
    </main>
  );
}