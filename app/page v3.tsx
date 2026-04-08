'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HiraganaPrototype() {
  const [step, setStep] = useState(0); 
  const [phase, setPhase] = useState('STORY');
  const [hasInteracted, setHasInteracted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const characters = [
    { char: 'あ', story: '勇者が山から「あぁぁぁ！」と叫んでいる。' },
    { char: 'い', story: 'いたい！足（あし）を石（いし）にぶつけました。' },
    { char: 'う', story: 'うれしい！宝地図（たからちず）を見つけました。' },
    { char: 'え', story: 'えがおで歩（ある）き続（つづ）けます。' },
    { char: 'お', story: 'おいしい！やっと食（た）べ物（もの）がありました。' },
  ];

  const current = characters[step];

  // Function to unlock audio (Browsers block autoplay with sound by default)
  const handleInteraction = () => {
    setHasInteracted(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  return (
    <main 
      onClick={handleInteraction} 
      className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-6 font-sans cursor-pointer"
    >
      {/* 1. Header & Progress */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-black tracking-tight text-indigo-600">HIRAGANA MASTER V2.0</h1>
        <div className="flex gap-2 mt-4 justify-center">
          {characters.map((_, i) => (
            <div key={i} className={`h-2 w-8 rounded-full transition-all duration-500 ${i <= step ? 'bg-indigo-500 w-12' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* 2. Main Interaction Card */}
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100 p-8 border border-slate-100 overflow-hidden">
        
        <AnimatePresence mode="wait">
          {phase === 'STORY' ? (
            <motion.div 
              key="story"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              {/* STACKED MEDIA AREA */}
              <div className="relative w-full aspect-square rounded-3xl bg-slate-100 overflow-hidden mb-6 shadow-inner border-4 border-slate-50">
                
                {/* BOTTOM LAYER: Procreate Drawing */}
                <img 
                  src="/hero-cliff.png" 
                  alt="Mnemonic Background" 
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* TOP LAYER: The Gura Video with Precision Sync */}
                <motion.div
                  animate={{ 
                    opacity: [0, 0, 1, 1, 0] // Stays invisible, flashes in for the "A!", then out
                  }}
                  transition={{ 
                    duration: 5, // Matches your 5s video length
                    ease: "easeInOut"
                  }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <video
                    ref={videoRef}
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-contain mix-blend-screen" 
                  >
                    <source src="/gura-clip.mp4" type="video/mp4" />
                  </video>
                </motion.div>

                {/* CHARACTER BADGE */}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-5 py-2 rounded-2xl shadow-sm border border-slate-100">
                  <span className="text-4xl font-bold text-indigo-600">{current.char}</span>
                </div>
              </div>

              {!hasInteracted && (
                <p className="text-xs text-indigo-400 mb-2 animate-pulse font-bold uppercase">
                  Click anywhere to enable sound 🔊
                </p>
              )}

              <p className="text-xl font-medium text-slate-700 text-center mb-8 px-4 leading-relaxed">
                {current.story}
              </p>

              <button 
                onClick={(e) => {
                  e.stopPropagation(); // Prevents triggering the background click
                  setPhase('TRACE');
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg active:scale-95"
              >
                Start Tracing ✍️
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="trace"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
            >
              <h2 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-[0.2em]">Muscle Memory Phase</h2>
              
              {/* TRACING PLACEHOLDER */}
              <div className="w-full aspect-square bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 flex items-center justify-center mb-8 relative group">
                <span className="text-[14rem] font-bold text-slate-100 absolute select-none transition-all group-hover:text-slate-200">
                  {current.char}
                </span>
                <div className="z-10 text-center px-6">
                   <p className="text-slate-400 font-bold text-lg mb-1">Canvas Locked</p>
                   <p className="text-slate-300 text-sm italic">MVP: Integration Pending</p>
                </div>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (step < 4) {
                    setStep(step + 1);
                    setPhase('STORY');
                  } else {
                    alert("Training Session Complete! You've mastered the first set.");
                    setStep(0);
                    setPhase('STORY');
                  }
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-bold text-xl transition-all shadow-lg active:scale-95"
              >
                I Finished! ✨
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-12 text-slate-300 text-sm font-medium">
        Monash MJC IT Subcommittee Prototype v2.0
      </p>
    </main>
  );
}