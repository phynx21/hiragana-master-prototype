'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const characters = [
  { char: 'あ', audio: 'a', word: 'あぁぁぁぁぁ！', japSentence: '勇者は崖から落ちた。', engSentence: 'Our hero fell from the cliff!', image: '/hero-cliff.png', hasVideo: true },
  { char: 'い', audio: 'i', word: 'いたい！', japSentence: '足を石にぶつけてしまった。', engSentence: 'He stubbed his toe on a rock.', image: '/hurt-leg.png', hasVideo: false },
  { char: 'う', audio: 'u', word: 'うれしい！', japSentence: '宝の地図を見つけた。', engSentence: 'He found a treasure map!', image: '/happy-hero.png', hasVideo: false },
  { char: 'え', audio: 'e', word: 'えがお', japSentence: '勇者は笑顔で歩き出す。', engSentence: 'The hero starts walking with a smile.', image: '/hero-smile.png', hasVideo: false },
  { char: 'お', audio: 'o', word: 'おいしい！', japSentence: 'お肉をたくさん食べた。', engSentence: 'He ate a lot of meat.', image: '/hero-eating.gif', hasVideo: false },
];

export default function HiraganaFinal() {
  const [step, setStep] = useState(0); 
  const [phase, setPhase] = useState('STORY'); 
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = characters[step];

  // --- AUDIO ENGINE ---
  const playLessonAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Using the filenames: audio-a.mp3, audio-i.mp3, etc.
    const audioPath = `/audio-${current.audio}.mp3`;
    audioRef.current = new Audio(audioPath);
    audioRef.current.play().catch(err => console.error("Audio Playback Error:", err));
  };

  const handleStart = () => {
    setHasInteracted(true);
    if (current.hasVideo) {
      setTimeout(() => videoRef.current?.play(), 100);
      // Autoplay: Wait for Gura's 5s clip, then play your Artlist audio
      setTimeout(() => playLessonAudio(), 5100);
    } else {
      playLessonAudio();
    }
  };

  // Autoplay on Step change
  useEffect(() => {
    if (hasInteracted && phase === 'STORY') {
      if (current.hasVideo) {
        const timer = setTimeout(() => playLessonAudio(), 5100);
        return () => clearTimeout(timer);
      } else {
        playLessonAudio();
      }
    }
  }, [step, phase, hasInteracted]);

  // Recording Simulation
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
    <main className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-700 ${!hasInteracted ? 'bg-indigo-950 cursor-pointer' : 'bg-slate-50'}`}>
      
      {!hasInteracted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white" onClick={handleStart}>
          <h1 className="text-6xl font-black mb-4 tracking-tighter">Hiragana Master</h1>
          <p className="text-xl mb-12 text-indigo-300">"A is for あぁぁぁぁぁ！"</p>
          <div className="bg-white text-indigo-900 px-12 py-6 rounded-full text-2xl font-black shadow-2xl">START LESSON</div>
        </motion.div>
      ) : (
        <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8 border border-slate-100 relative">
          
          <div className="flex justify-between items-center mb-6 px-2">
            <button 
              onClick={(e) => { e.stopPropagation(); playLessonAudio(); }}
              className="bg-indigo-600 text-white p-4 rounded-full hover:bg-indigo-700 transition-all active:scale-90 shadow-lg shadow-indigo-100"
            >
              <span className="text-xl">🔊</span>
            </button>
            <div className="text-xs font-black text-slate-300 tracking-widest uppercase">Unit 1: {step + 1}/{characters.length}</div>
          </div>

          <AnimatePresence mode="wait">
            {phase === 'STORY' && (
              <motion.div key="story" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center">
                
                <div className="relative w-full aspect-square rounded-[2rem] bg-slate-100 overflow-hidden mb-8 shadow-inner border-2 border-slate-50">
                  <img src={current.image} className="absolute inset-0 w-full h-full object-cover" alt="story" />
                  {current.hasVideo && (
                    <motion.div animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 5, times: [0, 0.6, 0.7, 0.9, 1] }} className="absolute inset-0 flex items-center justify-center bg-black/10">
                      <video ref={videoRef} playsInline className="w-full h-full object-contain mix-blend-screen">
                        <source src="/gura-clip.mp4" type="video/mp4" />
                      </video>
                    </motion.div>
                  )}
                </div>

                <div className="text-center w-full group relative min-h-[180px]">
                  <h2 className="text-8xl font-black text-indigo-600 mb-1 leading-none">{current.char}</h2>
                  <p className="text-2xl font-black text-indigo-400 mb-4 tracking-tight uppercase">for <span className="text-slate-800 lowercase">{current.word}</span></p>
                  
                  {/* Japanese stays visible, English appears underneath */}
                  <p className="text-xl font-bold text-slate-800 leading-relaxed px-4">
                    {current.japSentence}
                  </p>

                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="inline-block bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl text-lg font-bold border border-indigo-100 shadow-sm">
                      {current.engSentence}
                    </span>
                  </div>
                </div>

                <button onClick={() => setPhase('VOICE')} className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl hover:bg-indigo-700 shadow-lg active:scale-95 transition-all">NEXT: SPEAK</button>
              </motion.div>
            )}

            {phase === 'VOICE' && (
               <motion.div key="voice" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center">
                 <h2 className="text-sm font-black text-indigo-400 mb-10 uppercase tracking-widest">Voice Check</h2>
                 <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-12 border-4 border-white shadow-xl">
                   <span className="text-[10rem] font-black text-indigo-600/20">{current.char}</span>
                 </div>
                 <button onMouseDown={() => setIsRecording(true)} onMouseUp={() => setIsRecording(false)} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110 shadow-2xl shadow-red-200' : 'bg-slate-200'}`}>
                   <div className={`w-10 h-10 rounded-full ${isRecording ? 'bg-white' : 'bg-slate-400'}`} />
                 </button>
                 <p className="mt-8 text-slate-400 font-bold">{isRecording ? "Listening..." : "Hold to Record"}</p>
               </motion.div>
            )}

            {phase === 'TRACE' && (
              <motion.div key="trace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                <div className="w-full aspect-square bg-slate-50 rounded-[3rem] border-8 border-dashed border-slate-100 mb-10 flex items-center justify-center relative">
                  <span className="text-[16rem] font-black text-slate-100">{current.char}</span>
                  <p className="absolute text-slate-400 font-black text-2xl uppercase tracking-tighter">Drawing Lock</p>
                </div>
                <button onClick={() => { setStep((step + 1) % characters.length); setPhase('STORY'); }} className="w-full bg-emerald-500 text-white py-6 rounded-3xl font-black text-2xl shadow-xl hover:bg-emerald-600">MASTERED! ✨</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </main>
  );
}