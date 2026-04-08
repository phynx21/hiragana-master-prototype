'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA MAPPING ---
const characters = [
  { char: 'あ', story: 'The hero is falling off a cliff: "Aaaaah!"', japSentence: '勇者が崖から落ちています。', image: '/hero-cliff.png', hasVideo: true },
  { char: 'い', story: 'Ouch! He stubbed his toe: "Itai!"', japSentence: '足を石にぶつけて「いたい！」。', image: '/hurt-leg.png', hasVideo: false },
  { char: 'う', story: 'Success! He found the map: "Ureshii!"', japSentence: '宝の地図を見つけて「うれしい！」。', image: '/happy-hero.png', hasVideo: false },
  { char: 'え', story: 'Keep going with a smile: "Egao!"', japSentence: '笑顔で歩き続けます。', image: '/hero-smile.png', hasVideo: false },
  { char: 'お', story: 'Delicious! He finally found food: "Oishii!"', japSentence: 'お肉が「おいしい！」です。', image: '/hero-eating.gif', hasVideo: false },
];

export default function HiraganaV4() {
  const [step, setStep] = useState(0); 
  const [phase, setPhase] = useState('STORY'); 
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const current = characters[step];

  // --- AI VOICEOVER FUNCTION ---
  const speakJapanese = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.9; // Slightly slower for learners
    window.speechSynthesis.speak(utterance);
  };

  const handleStart = () => {
    setHasInteracted(true);
    if (current.hasVideo) {
      setTimeout(() => {
        if (videoRef.current) videoRef.current.play();
      }, 100);
      // Wait for Gura to finish (5s) then speak the sentence
      setTimeout(() => speakJapanese(current.japSentence), 5000);
    } else {
      speakJapanese(current.japSentence);
    }
  };

  // Trigger voiceover when moving to a new character (if already interacted)
  useEffect(() => {
    if (hasInteracted && phase === 'STORY') {
      if (current.hasVideo) {
        // Video will autoplay, wait for it to finish
        const timer = setTimeout(() => speakJapanese(current.japSentence), 5000);
        return () => clearTimeout(timer);
      } else {
        speakJapanese(current.japSentence);
      }
    }
  }, [step, phase, hasInteracted]);

  useEffect(() => {
    let timer: any;
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
      className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-700 ${!hasInteracted ? 'bg-indigo-950 cursor-pointer' : 'bg-slate-50'}`}
    >
      
      {!hasInteracted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
          <h1 className="text-6xl font-black mb-4 tracking-tighter">Hiragana Master</h1>
          <p className="text-xl mb-12 text-indigo-300">Click to Initialize AI Voiceover</p>
          <div className="bg-white text-indigo-900 px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-105 transition-transform">
            START LESSON
          </div>
        </motion.div>
      ) : (
        <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8 border border-slate-100 relative">
          
          <div className="absolute top-8 right-10 text-xs font-black text-slate-300 tracking-widest">
            {step + 1} / {characters.length}
          </div>

          <AnimatePresence mode="wait">
            {phase === 'STORY' && (
              <motion.div key="story" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center">
                
                <div className="relative w-full aspect-square rounded-[2rem] bg-slate-100 overflow-hidden mb-8 shadow-inner border-2 border-slate-50">
                  <img src={current.image} className="absolute inset-0 w-full h-full object-cover" alt="story" />
                  
                  {current.hasVideo && (
                    <motion.div
                      animate={{ opacity: [0, 0, 1, 1, 0] }}
                      transition={{ duration: 5, times: [0, 0.6, 0.7, 0.9, 1] }}
                      className="absolute inset-0 flex items-center justify-center bg-black/10"
                    >
                      <video ref={videoRef} playsInline className="w-full h-full object-contain mix-blend-screen">
                        <source src="/gura-clip.mp4" type="video/mp4" />
                      </video>
                    </motion.div>
                  )}
                </div>

                <div className="text-center w-full group cursor-help">
                  <h2 className="text-7xl font-black text-indigo-600 mb-4">{current.char}</h2>
                  
                  {/* JAPANESE SENTENCE (PRIMARY) */}
                  <p className="text-2xl font-bold text-slate-800 leading-relaxed transition-all group-hover:blur-sm group-hover:opacity-20">
                    {current.japSentence}
                  </p>

                  {/* ENGLISH HOVER (SECONDARY) */}
                  <div className="absolute left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center translate-y-[-40px]">
                    <span className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-lg font-bold shadow-xl">
                      {current.story}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setPhase('VOICE'); }} 
                  className="w-full mt-14 bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all"
                >
                  NEXT: SPEAK
                </button>
              </motion.div>
            )}

            {/* VOICE AND TRACE PHASES REMAIN THE SAME AS PREVIOUS SCRIPT */}
            {phase === 'VOICE' && (
               <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
                 <h2 className="text-sm font-black text-indigo-400 mb-10 uppercase tracking-widest">Acoustic Check</h2>
                 <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-12 border-4 border-white shadow-xl">
                   <span className="text-[10rem] font-black text-indigo-600/20">{current.char}</span>
                 </div>
                 <button 
                   onMouseDown={() => setIsRecording(true)} onMouseUp={() => setIsRecording(false)}
                   className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? 'bg-red-500 scale-110 shadow-2xl shadow-red-200' : 'bg-slate-200'}`}
                 >
                   <div className={`w-8 h-8 rounded-full ${isRecording ? 'bg-white' : 'bg-slate-400'}`} />
                 </button>
               </motion.div>
            )}

            {phase === 'TRACE' && (
              <motion.div key="trace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="w-full aspect-square bg-slate-50 rounded-[2rem] border-8 border-dashed border-slate-100 mb-10 relative flex items-center justify-center">
                  
                  {/* Character */}
                  <span className="text-[16rem] font-black text-slate-100">
                    {current.char}
                  </span>

                  {/* Centered Overlay */}
                  <p className="absolute inset-0 flex items-center justify-center z-10 text-slate-400 font-black text-2xl">
                    Coming Soon
                  </p>

                </div>
                <button onClick={() => { setStep((step + 1) % characters.length); setPhase('STORY'); }} className="w-full bg-emerald-500 text-white py-6 rounded-2xl font-black text-2xl shadow-xl">
                  MASTERED!
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}