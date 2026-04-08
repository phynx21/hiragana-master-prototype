'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA MAPPING ---
// Make sure these exact filenames are in your /public folder!
const characters = [
  { char: 'あ', story: 'The hero is falling off a cliff... "Aaaaah!"', color: 'indigo', image: '/hero-cliff.png' },
  { char: 'い', story: 'Ouch! He stubbed his toe... "Itai!"', color: 'red', image: '/hurt-leg.png' },
  { char: 'う', story: 'Success! He found the map... "Ureshii!"', color: 'yellow', image: '/happy-hero.png' },
  { char: 'え', story: 'Keep going with a smile... "Egao!"', color: 'green', image: '/hero-smile.png' },
  { char: 'お', story: 'Delicious! He finally found food... "Oishii!"', color: 'orange', image: '/hero-eating.gif' },
];

export default function HiraganaV3() {
  const [step, setStep] = useState(0); 
  const [phase, setPhase] = useState('STORY'); 
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = characters[step];

  // Logic to unlock the browser audio context
  const handleStart = () => {
    setHasInteracted(true);
    // Timeout ensures the video element is ready before we play
    setTimeout(() => {
      if (videoRef.current) videoRef.current.play();
    }, 100);
  };

  // Simulate voice recording success (Hold for 2 seconds)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setTimeout(() => {
        setIsRecording(false);
        setPhase('TRACE'); 
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isRecording]);

  return (
    <main 
      onClick={!hasInteracted ? handleStart : undefined}
      className={`flex flex-col items-center justify-center min-h-screen p-6 font-sans transition-all duration-700 ${!hasInteracted ? 'bg-indigo-950 cursor-pointer' : 'bg-slate-50'}`}
    >
      
      {!hasInteracted ? (
        // --- WELCOME SCREEN ---
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
          <h1 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-white">
            Hiragana Master
          </h1>
          <p className="text-xl mb-12 text-indigo-200/60 uppercase tracking-[0.3em]">Subcommittee Prototype v3</p>
          <div className="bg-white text-indigo-900 px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-110 transition-transform">
            TAP TO BEGIN
          </div>
        </motion.div>
      ) : (
        // --- MAIN APP CARD ---
        <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl shadow-indigo-200/50 p-8 border border-slate-100 overflow-hidden relative">
          
          <div className="absolute top-8 right-10 text-xs font-black text-slate-300 tracking-tighter uppercase">
            Unit 01 — {step + 1}/5
          </div>

          <AnimatePresence mode="wait">
            {phase === 'STORY' && (
              <motion.div key="story" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center">
                
                <div className="relative w-full aspect-square rounded-[2rem] bg-slate-100 overflow-hidden mb-8 shadow-inner border-2 border-slate-50">
                  <img src={current.image} className="absolute inset-0 w-full h-full object-cover" alt="story" />
                  
                  {/* Gura Overlay - Loop is False */}
                  <motion.div
                    animate={{ opacity: [0, 0, 1, 1, 0] }}
                    transition={{ duration: 5, repeat: 0, times: [0, 0.6, 0.7, 0.9, 1] }}
                    className="absolute inset-0 flex items-center justify-center bg-indigo-500/10"
                  >
                    <video ref={videoRef} playsInline className="w-full h-full object-contain mix-blend-screen">
                      <source src="/gura-clip.mp4" type="video/mp4" />
                    </video>
                  </motion.div>
                </div>

                <div className="text-center px-4">
                  <h2 className="text-6xl font-black text-indigo-600 mb-4">{current.char}</h2>
                  <p className="text-lg font-bold text-slate-700 leading-relaxed">{current.story}</p>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setPhase('VOICE'); }} 
                  className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  NEXT: SPEAK IT
                </button>
              </motion.div>
            )}

            {phase === 'VOICE' && (
              <motion.div key="voice" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="flex flex-col items-center text-center">
                <h2 className="text-sm font-black text-indigo-400 mb-10 uppercase tracking-widest">Acoustic Check</h2>
                
                <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-12 border-4 border-white shadow-xl">
                  <span className="text-[10rem] font-black text-indigo-600/20">{current.char}</span>
                </div>

                <p className="text-xl font-bold text-slate-700 mb-12 px-6">
                  Hold the button and say <br/>
                  <span className="text-3xl text-indigo-600">"{current.char}"</span>
                </p>

                <button 
                  onMouseDown={() => setIsRecording(true)}
                  onMouseUp={() => setIsRecording(false)}
                  onTouchStart={() => setIsRecording(true)}
                  onTouchEnd={() => setIsRecording(false)}
                  className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${isRecording ? 'bg-red-500 scale-110 shadow-red-200 shadow-2xl' : 'bg-slate-200 shadow-inner'}`}
                >
                  <div className={`w-8 h-8 rounded-full ${isRecording ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                  {isRecording && <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping" />}
                </button>
                <p className="mt-6 text-slate-400 text-sm">{isRecording ? "Listening..." : "Hold to Record"}</p>
              </motion.div>
            )}

            {phase === 'TRACE' && (
              <motion.div key="trace" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                <h2 className="text-sm font-black text-emerald-500 mb-10 uppercase tracking-widest">Writing Phase</h2>
                
                <div className="w-full aspect-square bg-slate-50 rounded-[2rem] border-8 border-dashed border-slate-100 flex items-center justify-center mb-10 relative">
                  <span className="text-[16rem] font-black text-slate-100 absolute select-none">{current.char}</span>
                  <div className="z-10 text-center">
                     <p className="text-slate-400 font-black text-xl mb-2 italic">Touchscreen Tracing</p>
                     <p className="text-slate-300 font-medium">Coming in Version 4.0</p>
                  </div>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (step < characters.length - 1) {
                      setStep(step + 1);
                      setPhase('STORY');
                    } else {
                      alert("You've mastered the first set! Sending report to Director...");
                      setStep(0);
                      setPhase('STORY');
                    }
                  }}
                  className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-2xl shadow-xl hover:bg-emerald-600 transition-transform active:scale-95"
                >
                  FINISHED!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}