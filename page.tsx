'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA ---
const characters = [
  { char: 'あ', audio: 'a', word: 'あぁぁぁぁぁ！', japSentence: '勇者は崖から落ちた。', engSentence: 'Our hero fell from the cliff!', image: '/hero-cliff.png', hasVideo: true, romaji: 'a', distractors: ['お', 'め'] },
  { char: 'い', audio: 'i', word: 'いたい！', japSentence: '足を石にぶつけてしまった。', engSentence: 'He stubbed his toe on a rock.', image: '/hurt-leg.png', hasVideo: false, romaji: 'i', distractors: ['り', 'こ'] },
  { char: 'う', audio: 'u', word: 'うれしい！', japSentence: '宝の地図を見つけた。', engSentence: 'He found a treasure map!', image: '/happy-hero.png', hasVideo: false, romaji: 'u', distractors: ['つ', 'ら'] },
  { char: 'え', audio: 'e', word: 'えがお', japSentence: '勇者は笑顔で歩き出す。', engSentence: 'The hero starts walking with a smile.', image: '/hero-smile.png', hasVideo: false, romaji: 'e', distractors: ['ん', 'ろ'] },
  { char: 'お', audio: 'o', word: 'おいしい！', japSentence: 'お肉をたくさん食べた。', engSentence: 'He ate a lot of meat.', image: '/hero-eating.gif', hasVideo: false, romaji: 'o', distractors: ['あ', 'め'] },
];

const jukugoChallenges = [
  { word: 'あい', meaning: 'Love', parts: ['あ', 'い'] },
  { word: 'うえ', meaning: 'Up', parts: ['う', 'え'] },
];

export default function HiraganaFinal() {
  // NAVIGATION CONTROL
  const [view, setView] = useState<'LEARN' | 'TEST'>('LEARN');

  // --- LEARNING STATE ---
  const [step, setStep] = useState(0); 
  const [phase, setPhase] = useState('STORY'); 
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = characters[step];

  // --- TESTING STATE ---
  const [testStep, setTestStep] = useState(0); // 0: Visual, 1: Audio, 2: Typing, 3: Jukugo, 4: Win
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'IDLE' | 'CORRECT' | 'WRONG'>('IDLE');

  // --- AUDIO ENGINE ---
  const playSfx = (file: string) => {
    const sfx = new Audio(file);
    sfx.volume = 0.4;
    sfx.play().catch(() => {});
  };

  const playLessonAudio = (charKey: string) => {
    const audio = new Audio(`/audio-${charKey}.mp3`);
    audio.play().catch(() => {});
  };

  // --- HANDLERS ---
  const handleStart = () => {
    playSfx('/press-button-effect.mp3');
    setHasInteracted(true);
    if (current.hasVideo) {
      setTimeout(() => videoRef.current?.play(), 100);
      setTimeout(() => playLessonAudio(current.audio), 5100);
    } else {
      playLessonAudio(current.audio);
    }
  };

  const handleTestCorrect = () => {
    setFeedback('CORRECT');
    playSfx('/press-button-effect.mp3');
    setTimeout(() => {
      setFeedback('IDLE');
      if (currentQuestion < characters.length - 1 && testStep < 3) {
        setCurrentQuestion(prev => prev + 1);
        setUserInput('');
      } else {
        setTestStep(prev => prev + 1);
        setCurrentQuestion(0);
        setUserInput('');
      }
    }, 1000);
  };

  // Autoplay Logic
  useEffect(() => {
    if (hasInteracted && view === 'LEARN' && phase === 'STORY') {
      if (current.hasVideo) {
        const timer = setTimeout(() => playLessonAudio(current.audio), 5100);
        return () => clearTimeout(timer);
      } else {
        playLessonAudio(current.audio);
      }
    }
  }, [step, phase, hasInteracted, view]);

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
    <main className={`flex flex-col items-center justify-center min-h-screen p-6 transition-all duration-700 ${!hasInteracted ? 'bg-indigo-950' : 'bg-slate-50'}`}>
      
      {!hasInteracted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-white">
          <h1 className="text-6xl font-black mb-4 tracking-tighter">Hiragana Master</h1>
          <p className="text-xl mb-12 text-indigo-300 italic">"A is for あぁぁぁぁぁ！"</p>
          <button onClick={handleStart} className="bg-white text-indigo-900 px-12 py-6 rounded-full text-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-transform">
            START LESSON
          </button>
        </motion.div>
      ) : (
        <div className="w-full max-w-lg bg-white rounded-[3rem] shadow-2xl p-8 border border-slate-100 relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            {/* --- VIEW 1: LEARNING PHASE --- */}
            {view === 'LEARN' && (
              <motion.div key="learning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ x: -100, opacity: 0 }}>
                <div className="flex justify-between items-center mb-6 px-2">
                  <button onClick={() => { playSfx('/press-button-effect.mp3'); playLessonAudio(current.audio); }} className="bg-indigo-600 text-white p-4 rounded-full shadow-lg">🔊</button>
                  <div className="text-xs font-black text-slate-300 tracking-widest uppercase">Learn: {step + 1}/{characters.length}</div>
                </div>

                {phase === 'STORY' && (
                  <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-square rounded-[2rem] bg-slate-100 overflow-hidden mb-8 shadow-inner">
                      <img src={current.image} className="absolute inset-0 w-full h-full object-cover" />
                      {current.hasVideo && (
                        <motion.div animate={{ opacity: [0, 0, 1, 1, 0] }} transition={{ duration: 5, times: [0, 0.6, 0.7, 0.9, 1] }} className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <video ref={videoRef} playsInline className="w-full h-full object-contain mix-blend-screen">
                            <source src="/gura-clip.mp4" type="video/mp4" />
                          </video>
                        </motion.div>
                      )}
                    </div>
                    <div className="text-center w-full group min-h-[180px]">
                      <h2 className="text-8xl font-black text-indigo-600 mb-1 leading-none">{current.char}</h2>
                      <p className="text-2xl font-black text-indigo-400 mb-4 uppercase">for {current.word}</p>
                      <p className="text-xl font-bold text-slate-800 px-4">{current.japSentence}</p>
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="inline-block bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl text-lg font-bold border border-indigo-100 shadow-sm">{current.engSentence}</span>
                      </div>
                    </div>
                    <button onClick={() => { playSfx('/press-button-effect.mp3'); setPhase('VOICE'); }} className="w-full mt-10 bg-indigo-600 text-white py-5 rounded-3xl font-black text-xl shadow-lg">次</button>
                  </div>
                )}

                {phase === 'VOICE' && (
                  <div className="flex flex-col items-center py-10">
                    <h2 className="text-sm font-black text-indigo-400 mb-10 uppercase tracking-widest">Voice Check</h2>
                    <div className="w-64 h-64 bg-slate-50 rounded-full flex items-center justify-center mb-12 border-4 border-white shadow-xl">
                      <span className="text-[10rem] font-black text-indigo-600/20">{current.char}</span>
                    </div>
                    <button onMouseDown={() => { playSfx('/press-button-effect.mp3'); setIsRecording(true); }} onMouseUp={() => setIsRecording(false)} className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-red-500 scale-110' : 'bg-slate-200'}`}>
                      <div className={`w-10 h-10 rounded-full ${isRecording ? 'bg-white' : 'bg-slate-400'}`} />
                    </button>
                  </div>
                )}

                {phase === 'TRACE' && (
                  <div className="flex flex-col items-center py-10">
                    <div className="w-full aspect-square bg-slate-50 rounded-[3rem] border-8 border-dashed border-slate-100 mb-10 flex items-center justify-center">
                      <span className="text-[16rem] font-black text-slate-100">{current.char}</span>
                    </div>
                    <button 
                      onClick={() => { 
                        playSfx('/press-button-effect.mp3'); 
                        if (step === characters.length - 1) setView('TEST'); 
                        else { setStep(step + 1); setPhase('STORY'); }
                      }} 
                      className="w-full bg-emerald-500 text-white py-6 rounded-3xl font-black text-2xl shadow-xl"
                    >
                      {step === characters.length - 1 ? "ENTER THE GATEKEEPER 🛡️" : "次"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* --- VIEW 2: THE GATEKEEPER --- */}
            {view === 'TEST' && (
              <motion.div key="testing" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                <div className="text-center">
                  <div className="flex gap-1 justify-center mb-8">
                    {[0, 1, 2, 3].map(s => <div key={s} className={`h-1.5 w-10 rounded-full ${testStep >= s ? 'bg-indigo-500' : 'bg-slate-100'}`} />)}
                  </div>

                  {/* 1. Visual Recognition */}
                  {testStep === 0 && (
                    <div className="animate-in fade-in duration-500">
                      <h2 className="text-xl font-bold text-slate-400 mb-8">Find the character for <span className="text-indigo-600">"{characters[currentQuestion].romaji}"</span></h2>
                      <div className="grid grid-cols-3 gap-4">
                        {[characters[currentQuestion].char, ...characters[currentQuestion].distractors].sort().map(choice => (
                          <button key={choice} onClick={() => choice === characters[currentQuestion].char ? handleTestCorrect() : setFeedback('WRONG')} className="h-24 bg-white border-2 border-slate-100 rounded-2xl text-4xl font-black hover:border-indigo-400 active:scale-95 transition-all">{choice}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Audio Recognition */}
                  {testStep === 1 && (
                    <div className="animate-in fade-in">
                      <h2 className="text-xl font-bold text-slate-400 mb-8">Listen and Match</h2>
                      <button onClick={() => playLessonAudio(characters[currentQuestion].audio)} className="w-32 h-32 bg-indigo-600 text-white rounded-full mb-12 text-4xl shadow-xl">🔊</button>
                      <div className="grid grid-cols-5 gap-2">
                        {characters.map(c => <button key={c.char} onClick={() => c.char === characters[currentQuestion].char ? handleTestCorrect() : setFeedback('WRONG')} className="h-16 bg-slate-50 rounded-xl text-2xl font-black">{c.char}</button>)}
                      </div>
                    </div>
                  )}

                  {/* 3. Typing Production */}
                  {testStep === 2 && (
                    <div className="animate-in fade-in">
                      <h2 className="text-xl font-bold text-slate-400 mb-8">Type the Romaji</h2>
                      <div className="text-[10rem] font-black text-indigo-600 mb-8 leading-none">{characters[currentQuestion].char}</div>
                      <input autoFocus type="text" value={userInput} onChange={(e) => { setUserInput(e.target.value.toLowerCase()); if(e.target.value.toLowerCase() === characters[currentQuestion].romaji) handleTestCorrect(); }} className="w-full text-center text-4xl font-black py-4 border-b-4 border-indigo-100 outline-none" placeholder="?" />
                    </div>
                  )}

                  {/* 4. Jukugo Reward */}
                  {testStep === 3 && (
                    <div className="animate-in fade-in">
                      <h2 className="text-xl font-bold text-slate-400 mb-4">Final Challenge: Build "{jukugoChallenges[currentQuestion].meaning}"</h2>
                      <div className="flex justify-center gap-4 mb-12">
                        {jukugoChallenges[currentQuestion].parts.map((p, i) => (
                          <div key={i} className="w-20 h-20 bg-slate-50 rounded-2xl border-4 border-dashed border-slate-200 flex items-center justify-center text-3xl font-black text-indigo-600">{userInput.includes(p) ? p : ''}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {characters.map(c => <button key={c.char} onClick={() => { playSfx('/press-button-effect.mp3'); const next = userInput + c.char; setUserInput(next); if (next === jukugoChallenges[currentQuestion].word) handleTestCorrect(); else if (!jukugoChallenges[currentQuestion].word.startsWith(next)) setUserInput(''); }} className="h-16 rounded-xl text-2xl font-black bg-white border border-slate-200">{c.char}</button>)}
                      </div>
                    </div>
                  )}

                  {/* 5. Win Screen */}
                  {testStep === 4 && (
                    <div className="py-10">
                      <div className="text-8xl mb-8">🏆</div>
                      <h2 className="text-4xl font-black text-slate-800 mb-4">Gatekeeper Passed!</h2>
                      <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-10 py-5 rounded-full font-black text-xl shadow-xl">RESTART UNIT</button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feedback Overlay */}
          {feedback === 'WRONG' && (
            <motion.div initial={{ x: -10 }} animate={{ x: 10 }} transition={{ repeat: 3, duration: 0.05 }} onAnimationComplete={() => setFeedback('IDLE')} className="absolute inset-0 bg-red-500/10 pointer-events-none" />
          )}
        </div>
      )}
    </main>
  );
}