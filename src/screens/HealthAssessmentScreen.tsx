import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { Activity, Heart, Droplets, ChevronLeft, AlertTriangle, CheckCircle2, Info, Volume2, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';
import { useAudioStream } from '../hooks/useAudioStream';

export default function HealthAssessmentScreen() {
  const { t } = useAssessment();
  const navigate = useNavigate();
  const [age, setAge] = useState<string>('');
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [sugar, setSugar] = useState<string>('');
  const [result, setResult] = useState<{ status: string; color: string; message: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { playPCM, stopPlayback } = useAudioStream();

  const handleListen = async () => {
    if (isSpeaking) {
      stopPlayback();
      setIsSpeaking(false);
      return;
    }
    if (!result) return;
    setIsSpeaking(true);
    try {
      const base64Audio = await generateSpeech(result.message);
      if (base64Audio) {
        await playPCM(base64Audio, 24000);
      }
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const assessHealth = () => {
    const s = parseInt(systolic);
    const d = parseInt(diastolic);
    const sug = parseInt(sugar);
    const a = parseInt(age);

    if (isNaN(s) || isNaN(d) || isNaN(sug) || isNaN(a)) {
      alert('Please enter valid numbers for all fields.');
      return;
    }

    let bpStatus = 'Normal';
    if (s >= 140 || d >= 90) bpStatus = 'Hypertension';
    else if (s >= 120 || d >= 80) bpStatus = 'Pre-hypertension';

    let sugarStatus = 'Normal';
    if (sug >= 126) sugarStatus = 'Diabetes Range';
    else if (sug >= 100) sugarStatus = 'Pre-diabetes Range';

    if (bpStatus === 'Hypertension' || sugarStatus === 'Diabetes Range') {
      setResult({
        status: 'High Risk',
        color: 'text-error bg-error/10 border-error/20',
        message: `Your readings indicate potential ${bpStatus === 'Hypertension' ? 'Hypertension' : ''} ${bpStatus === 'Hypertension' && sugarStatus === 'Diabetes Range' ? 'and' : ''} ${sugarStatus === 'Diabetes Range' ? 'Diabetes' : ''}. Please consult a doctor immediately.`
      });
    } else if (bpStatus === 'Pre-hypertension' || sugarStatus === 'Pre-diabetes Range') {
      setResult({
        status: 'Moderate Risk',
        color: 'text-tertiary bg-tertiary/10 border-tertiary/20',
        message: 'Your readings are slightly above normal. Consider lifestyle changes and monitor regularly.'
      });
    } else {
      setResult({
        status: 'Healthy',
        color: 'text-primary bg-primary/10 border-primary/20',
        message: 'Your readings are within the normal range. Keep up the healthy lifestyle!'
      });
    }
  };

  return (
    <div className="bg-background min-h-screen pb-32">
      <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm">
        <div className="flex items-center px-6 py-4 w-full max-w-screen-2xl mx-auto gap-4">
          <button onClick={() => navigate('/tools')} className="p-2 hover:bg-surface-container rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-2xl font-bold tracking-tighter text-primary font-headline">Health Assessment</h1>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 pt-32 space-y-8 relative z-10">
        <header className="space-y-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest"
          >
            <Activity className="w-4 h-4" />
            <span>Vital Analysis</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-on-surface font-headline tracking-tight">Check your <span className="text-primary">Vital Signs</span></h2>
          <p className="text-secondary text-lg max-w-lg mx-auto">Enter your blood pressure and blood sugar levels for a quick AI-powered risk assessment.</p>
        </header>

        <div className="glass-card rounded-[3rem] p-10 border-white/60 shadow-2xl space-y-10">
          {/* Age Input */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
              <Info className="w-4 h-4 text-primary" />
              Your Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 45"
              className="w-full h-18 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold transition-all shadow-inner"
            />
          </div>

          {/* BP Inputs */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
              <Heart className="w-4 h-4 text-error" />
              Blood Pressure (mmHg)
            </label>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-2">Systolic</span>
                <input
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="120"
                  className="w-full h-18 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] text-secondary font-bold uppercase tracking-widest ml-2">Diastolic</span>
                <input
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="80"
                  className="w-full h-18 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold transition-all shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Sugar Input */}
          <div className="space-y-4">
            <label className="text-xs font-bold text-secondary uppercase tracking-[0.2em] flex items-center gap-2 ml-2">
              <Droplets className="w-4 h-4 text-accent" />
              Blood Sugar (mg/dL - Fasting)
            </label>
            <input
              type="number"
              value={sugar}
              onChange={(e) => setSugar(e.target.value)}
              placeholder="e.g. 95"
              className="w-full h-18 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-xl font-bold transition-all shadow-inner"
            />
          </div>

          <button
            onClick={assessHealth}
            className="w-full h-18 signature-gradient text-white rounded-2xl font-bold text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
          >
            <Activity className="w-7 h-7" />
            Assess Risk
          </button>
        </div>

        {/* Result Display - Medical Report Card Look */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-10 rounded-[3rem] border-2 flex flex-col items-center text-center gap-8 relative shadow-2xl backdrop-blur-xl overflow-hidden",
              result.status === 'Healthy' ? "bg-success/5 border-success/20 text-success" : 
              result.status === 'Moderate Risk' ? "bg-warning/5 border-warning/20 text-warning" : 
              "bg-error/5 border-error/20 text-error"
            )}
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-current opacity-20" />
            
            <button 
              onClick={handleListen}
              disabled={isSpeaking}
              className="absolute top-6 right-6 p-4 bg-white/20 rounded-2xl hover:bg-white/30 transition-colors disabled:opacity-50 shadow-lg"
              title="Listen to result"
            >
              {isSpeaking ? <Loader2 className="w-6 h-6 animate-spin" /> : <Volume2 className="w-6 h-6" />}
            </button>

            <div className="w-24 h-24 rounded-3xl bg-white/20 flex items-center justify-center shadow-inner">
              {result.status === 'Healthy' ? (
                <CheckCircle2 className="w-14 h-14" />
              ) : (
                <AlertTriangle className="w-14 h-14" />
              )}
            </div>

            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest">
                Status: {result.status}
              </div>
              <h3 className="text-5xl font-extrabold font-headline tracking-tight leading-tight">{result.status}</h3>
              <p className="text-xl font-medium leading-relaxed opacity-90 max-w-md mx-auto">{result.message}</p>
            </div>

            <div className="w-full pt-6 border-t border-current/10 flex justify-center gap-8">
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">Severity</span>
                <span className="text-lg font-bold">{result.status === 'Healthy' ? 'Low' : result.status === 'Moderate Risk' ? 'Moderate' : 'High'}</span>
              </div>
              <div className="w-[1px] bg-current/10" />
              <div className="text-center">
                <span className="block text-[10px] font-bold uppercase tracking-widest opacity-60">Action</span>
                <span className="text-lg font-bold">{result.status === 'Healthy' ? 'Maintain' : 'Consult'}</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
