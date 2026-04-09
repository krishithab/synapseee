import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { Mic, Edit3, ArrowRight, Rotate3d, ZoomIn, MicOff } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';

export default function HomeScreen() {
  const { state, setState, t } = useAssessment();
  const navigate = useNavigate();
  const [inputText, setInputText] = useState('');
  const { isListening, transcript, startListening, stopListening } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      setInputText(transcript);
    }
  }, [transcript]);

  const hotspots = [
    { id: 'head', label: 'Head', top: '15%', left: '50%', color: 'border-primary/30 bg-primary/10' },
    { id: 'chest', label: 'Chest', top: '32%', left: '50%', color: 'border-error/30 bg-error/10' },
    { id: 'stomach', label: 'Abdomen', top: '50%', left: '50%', color: 'border-warning/30 bg-warning/10' },
    { id: 'left_arm', label: 'Left Arm', top: '40%', left: '28%', color: 'border-primary/20 bg-primary/5' },
    { id: 'right_arm', label: 'Right Arm', top: '40%', left: '72%', color: 'border-primary/20 bg-primary/5' },
    { id: 'left_leg', label: 'Left Leg', top: '80%', left: '42%', color: 'border-primary/20 bg-primary/5' },
    { id: 'right_leg', label: 'Right Leg', top: '80%', left: '58%', color: 'border-primary/20 bg-primary/5' },
  ];

  const handleSpotClick = (spot: typeof hotspots[0]) => {
    setState(prev => ({ ...prev, selectedBodyPart: spot.label }));
    if (!inputText) {
      setInputText(`${spot.label} discomfort`);
    }
  };

  const handleStart = () => {
    if (inputText.trim()) {
      setState(prev => ({ 
        ...prev, 
        symptoms: [...prev.symptoms, inputText],
        selectedBodyPart: state.selectedBodyPart || 'General'
      }));
    }
    navigate('/assessment');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-48 px-6 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-20">
        {/* Left Content: Hero */}
        <div className="flex-1 space-y-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Rotate3d className="w-4 h-4" />
            <span>Interactive Neural Map</span>
          </motion.div>
          
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-extrabold text-on-surface tracking-tight leading-[1] font-headline"
            >
              Where do you feel <span className="text-primary">discomfort?</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-secondary text-xl max-w-xl leading-relaxed font-medium"
            >
              Tap on the interactive model to pinpoint your symptoms, or use our voice assistant for a natural consultation.
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4"
          >
            <button 
              onClick={() => navigate('/voice-assistant')}
              className="h-16 px-10 bg-white text-on-surface rounded-2xl text-lg font-bold shadow-premium hover:shadow-premium-hover hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-4 border border-outline-variant/30 group"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                <Mic className="w-5 h-5" />
              </div>
              <span>Talk to Synapse</span>
            </button>
            <div className="flex items-center gap-3 text-secondary font-bold text-sm uppercase tracking-widest">
              <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <span>AI Active</span>
            </div>
          </motion.div>
        </div>

        {/* Right Content: Body Map */}
        <div className="flex-1 relative w-full max-w-lg aspect-[3/4] flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full h-full glass-card rounded-[4rem] p-10 flex items-center justify-center overflow-hidden border-white/60 shadow-2xl group/map"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            {/* SVG Body Map */}
            <svg viewBox="0 0 400 600" className="h-full w-auto drop-shadow-[0_0_40px_rgba(37,99,235,0.15)]">
              {/* Head */}
              <motion.path
                d="M170,50 Q200,30 230,50 L230,100 Q200,120 170,100 Z"
                fill={state.selectedBodyPart === 'Head' ? 'var(--color-primary)' : '#E2E8F0'}
                stroke={state.selectedBodyPart === 'Head' ? 'var(--color-primary)' : '#CBD5E1'}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-500"
                onClick={() => handleSpotClick({ id: 'head', label: 'Head' } as any)}
                whileHover={{ scale: 1.05, fill: state.selectedBodyPart === 'Head' ? 'var(--color-primary)' : '#F1F5F9' }}
              />
              
              {/* Torso */}
              <motion.path
                d="M140,140 L260,140 L250,350 L150,350 Z"
                fill={['Chest', 'Abdomen'].includes(state.selectedBodyPart || '') ? 'var(--color-primary)' : '#E2E8F0'}
                stroke={['Chest', 'Abdomen'].includes(state.selectedBodyPart || '') ? 'var(--color-primary)' : '#CBD5E1'}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-500"
                onClick={() => handleSpotClick({ id: 'chest', label: 'Chest' } as any)}
              />

              {/* Arms & Legs */}
              <path d="M130,140 L80,350 L120,350 L140,180 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              <path d="M270,140 L320,350 L280,350 L260,180 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              <path d="M155,420 L145,580 L195,580 L200,420 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
              <path d="M205,420 L210,580 L260,580 L250,420 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="2" />
            </svg>
            
            {/* Interactive Hotspots */}
            {hotspots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => handleSpotClick(spot)}
                className={cn(
                  "absolute w-14 h-14 rounded-full border-2 transition-all flex items-center justify-center group/spot hover:scale-125 z-20",
                  state.selectedBodyPart === spot.label 
                    ? "bg-primary border-primary shadow-[0_0_30px_rgba(37,99,235,0.6)] text-white scale-110" 
                    : "bg-white/90 border-white shadow-xl"
                )}
                style={{ top: spot.top, left: spot.left }}
              >
                <div className={cn(
                  "w-3.5 h-3.5 rounded-full transition-all duration-500",
                  state.selectedBodyPart === spot.label ? "bg-white scale-150" : "bg-primary/40 group-hover/spot:scale-125"
                )} />
                
                {/* Tooltip */}
                <span className="absolute -top-14 bg-on-surface text-white text-xs py-2 px-4 rounded-xl opacity-0 group-hover/spot:opacity-100 transition-all whitespace-nowrap font-bold pointer-events-none shadow-2xl">
                  {spot.label}
                </span>
              </button>
            ))}

            {/* Controls */}
            <div className="absolute right-8 bottom-8 flex flex-col gap-4">
              <ControlButton icon={<ZoomIn className="w-6 h-6" />} label="Zoom" />
              <ControlButton icon={<Rotate3d className="w-6 h-6" />} label="Rotate" />
            </div>
          </motion.div>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 w-full z-50 px-6 pb-10">
        <div className="max-w-5xl mx-auto glass-card rounded-[3rem] p-5 flex flex-col md:flex-row gap-5 items-center border-white/60 shadow-2xl">
          <div className="relative flex-grow w-full group">
            <Edit3 className="absolute left-7 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-18 pl-18 pr-20 bg-background/50 border-none rounded-[2rem] text-xl font-medium text-on-surface placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              placeholder={t('describePain')}
            />
            <button
              onClick={isListening ? stopListening : startListening}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl flex items-center justify-center transition-all",
                isListening ? "bg-error text-white animate-pulse shadow-lg shadow-error/20" : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>
            {isListening && (
              <div className="absolute right-24 top-1/2 -translate-y-1/2 flex gap-1.5 items-center">
                <div className="waveform-bar h-5" />
                <div className="waveform-bar h-8 [animation-delay:0.2s]" />
                <div className="waveform-bar h-5 [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          <button 
            onClick={handleStart}
            className="w-full md:w-auto h-18 px-14 signature-gradient text-white rounded-[2rem] text-xl font-bold tracking-tight shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            <span>{t('start')}</span>
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ControlButton({ icon, label }: { icon: any, label: string }) {
  return (
    <button 
      onClick={() => alert(`${label} feature coming soon!`)}
      className="w-14 h-14 bg-white shadow-premium rounded-2xl flex items-center justify-center hover:bg-background transition-all hover:scale-110 active:scale-95 text-primary border border-outline-variant/30"
    >
      {icon}
    </button>
  );
}
