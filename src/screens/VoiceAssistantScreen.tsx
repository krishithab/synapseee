import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, PhoneOff, MessageSquare, Volume2, VolumeX, Sparkles, UserCircle, History } from 'lucide-react';
import { useAssessment } from '../App';
import { connectToLiveAPI } from '../services/geminiService';
import { useAudioStream } from '../hooks/useAudioStream';
import { cn } from '../lib/utils';

export default function VoiceAssistantScreen() {
  const { t } = useAssessment();
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const sessionRef = useRef<any>(null);
  const { startRecording, stopRecording, playPCM, stopPlayback, isRecording } = useAudioStream();
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const handleMessage = useCallback(async (message: any) => {
    // Handle audio output
    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
    if (base64Audio) {
      playPCM(base64Audio, 16000);
    }

    // Handle transcription
    const modelText = message.serverContent?.modelTurn?.parts?.[0]?.text;
    if (modelText) {
      setIsAiThinking(false);
      setAiResponse(prev => prev + modelText);
      // We'll append to history when the turn is complete or after a timeout
    }

    const inputTranscription = message.serverContent?.userTurn?.parts?.[0]?.text;
    if (inputTranscription) {
      setTranscription(inputTranscription);
      setIsAiThinking(true);
      setHistory(prev => [...prev, { role: 'user', text: inputTranscription }]);
    }

    // When model turn is complete (simplified logic)
    if (message.serverContent?.modelTurn?.parts?.[0]?.text && !base64Audio) {
      setHistory(prev => [...prev, { role: 'ai', text: aiResponse + modelText }]);
      setAiResponse('');
    }

    // Handle interruption
    if (message.serverContent?.interrupted) {
      stopPlayback();
      setAiResponse('');
      setIsAiThinking(false);
    }
  }, [playPCM, stopPlayback, aiResponse]);

  const startSession = useCallback(async () => {
    try {
      const sessionPromise = connectToLiveAPI({
        onopen: () => {
          setIsConnected(true);
          startRecording((base64Data) => {
            if (!isMuted) {
              sessionPromise.then(session => {
                session.sendRealtimeInput({
                  audio: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            }
          });
        },
        onmessage: handleMessage,
        onerror: (err) => console.error('Live API Error:', err),
        onclose: () => {
          setIsConnected(false);
          stopRecording();
        }
      });
      sessionRef.current = sessionPromise;
    } catch (err) {
      console.error('Failed to connect to Live API:', err);
    }
  }, [handleMessage, startRecording, stopRecording, isMuted]);

  useEffect(() => {
    startSession();
    return () => {
      if (sessionRef.current) {
        sessionRef.current.then((session: any) => session.close());
      }
      stopRecording();
    };
  }, [startSession, stopRecording]);

  const toggleMute = () => setIsMuted(!isMuted);

  const endCall = () => {
    if (sessionRef.current) {
      sessionRef.current.then((session: any) => session.close());
    }
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
      
      {/* History Sidebar/Panel */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed right-0 top-0 h-full w-full md:w-96 bg-white/90 backdrop-blur-2xl z-50 shadow-2xl border-l border-white/20 flex flex-col"
          >
            <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="text-2xl font-extrabold font-headline text-on-surface">Consultation History</h3>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-surface-container rounded-full transition-colors">
                <PhoneOff className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {history.map((msg, i) => (
                <div key={i} className={cn(
                  "flex flex-col gap-2",
                  msg.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className={cn(
                    "max-w-[85%] p-4 rounded-2xl text-sm font-medium shadow-sm",
                    msg.role === 'user' ? "bg-primary text-white" : "bg-surface-container text-on-surface"
                  )}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">
                    {msg.role === 'user' ? 'You' : 'Synapse'}
                  </span>
                </div>
              ))}
              <div ref={historyEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-4xl flex flex-col items-center gap-12 relative z-10">
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-6 py-2 bg-white/50 backdrop-blur-md border border-white/40 rounded-full text-primary font-bold text-sm uppercase tracking-widest shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Neural Assistant</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight text-on-surface">Synapse <span className="text-primary">Voice</span></h1>
          <p className="text-secondary text-xl font-medium">
            {isConnected ? "Connected and listening..." : "Connecting to neural network..."}
          </p>
        </div>

        {/* Visualizer / Avatar */}
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{
              scale: isRecording && !isMuted ? [1, 1.4, 1] : 1,
              opacity: isRecording && !isMuted ? [0.2, 0.4, 0.2] : 0.2,
            }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute w-96 h-96 bg-primary rounded-full blur-[100px]"
          />
          <motion.div
            animate={{
              scale: isRecording && !isMuted ? [1, 1.2, 1] : 1,
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="relative w-72 h-72 glass-card rounded-full flex items-center justify-center border-white/60 shadow-2xl"
          >
            {/* Pulsing Rings */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 border-4 border-primary/20 rounded-full"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
              className="absolute inset-0 border-2 border-accent/20 rounded-full"
            />

            <div className="flex gap-2.5 items-center">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    height: isRecording && !isMuted ? [16, 64, 16] : 10,
                    opacity: isRecording && !isMuted ? [0.6, 1, 0.6] : 0.4,
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.4,
                    delay: i * 0.03,
                  }}
                  className="w-2.5 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                />
              ))}
            </div>
            {isMuted && (
              <div className="absolute inset-0 bg-error/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MicOff className="w-20 h-20 text-error" />
              </div>
            )}
          </motion.div>
          
          {/* Listening Indicator */}
          {isConnected && !isMuted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-16 flex items-center gap-3"
            >
              <div className="flex gap-1">
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              </div>
              <span className="text-primary font-bold text-sm uppercase tracking-widest">Listening...</span>
            </motion.div>
          )}
        </div>

        {/* Transcription Area */}
        <div className="w-full max-w-2xl glass-card rounded-[3rem] p-10 border-white/60 shadow-2xl min-h-[200px] flex flex-col justify-center gap-6">
          <AnimatePresence mode="wait">
            {transcription && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <UserCircle className="w-5 h-5 text-primary" />
                </div>
                <p className="text-lg font-medium text-secondary italic">
                  "{transcription}"
                </p>
              </motion.div>
            )}
            
            {(aiResponse || isAiThinking) ? (
              <motion.div
                key="response"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  {isAiThinking && !aiResponse && (
                    <div className="flex gap-1.5 pt-3">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-primary rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-primary rounded-full" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-primary rounded-full" />
                    </div>
                  )}
                  <p className="text-2xl font-bold leading-relaxed text-on-surface">
                    {aiResponse}
                  </p>
                </div>
              </motion.div>
            ) : !transcription && (
              <motion.p
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-secondary/50 italic text-xl text-center"
              >
                Start speaking to begin your health consultation...
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-12">
          <button
            onClick={toggleMute}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl",
              isMuted ? "bg-error text-white" : "bg-white text-on-surface hover:bg-surface-container-high"
            )}
          >
            {isMuted ? <VolumeX className="w-8 h-8" /> : <Volume2 className="w-8 h-8" />}
          </button>

          <button
            onClick={endCall}
            className="w-24 h-24 bg-error rounded-full flex items-center justify-center text-white shadow-2xl shadow-error/40 hover:scale-110 active:scale-95 transition-all"
          >
            <PhoneOff className="w-12 h-12" />
          </button>

          <button
            onClick={() => setShowHistory(!showHistory)}
            className={cn(
              "w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl",
              showHistory ? "bg-primary text-white" : "bg-white text-on-surface hover:bg-surface-container-high"
            )}
          >
            <History className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
