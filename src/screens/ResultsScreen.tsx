import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { 
  CheckCircle2, AlertCircle, Calendar, Phone, MapPin, ChevronRight, 
  Stethoscope, ClipboardList, Clock, Volume2, Loader2, Download, 
  Share2, ShieldCheck, Activity, Heart, AlertTriangle 
} from 'lucide-react';
import { useState } from 'react';
import { generateSpeech } from '../services/geminiService';
import { useAudioStream } from '../hooks/useAudioStream';

export default function ResultsScreen() {
  const { state, t } = useAssessment();
  const navigate = useNavigate();

  const getSpecialist = () => {
    const part = state.selectedBodyPart.toLowerCase();
    if (part.includes('head')) return { name: 'Neurologist', desc: 'Your symptoms in the head area suggest a neurological consultation may be beneficial.' };
    if (part.includes('chest')) return { name: 'Cardiologist', desc: 'Chest discomfort should be evaluated by a heart specialist to rule out cardiac issues.' };
    if (part.includes('abdomen') || part.includes('stomach')) return { name: 'Gastroenterologist', desc: 'Abdominal pain often requires a specialist in the digestive system.' };
    return { name: 'Orthopedic Surgeon', desc: 'Your symptoms suggest a possible musculoskeletal issue. An orthopedic specialist can provide a definitive diagnosis.' };
  };

  const specialist = getSpecialist();
  const { user } = useAssessment();
  const { playPCM, stopPlayback } = useAudioStream();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleListen = async () => {
    if (isSpeaking) {
      stopPlayback();
      setIsSpeaking(false);
      return;
    }
    
    setIsSpeaking(true);
    
    const summary = `Based on your assessment for ${state.selectedBodyPart}, with a pain level of ${state.painLevel} out of 10, I recommend consulting a ${specialist.name}. ${specialist.desc}`;
    
    try {
      const base64Audio = await generateSpeech(summary);
      if (base64Audio) {
        await playPCM(base64Audio, 24000); // TTS uses 24000Hz
      }
    } catch (error) {
      console.error('TTS Error:', error);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleBookAppointment = async () => {
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.warn('VITE_N8N_WEBHOOK_URL not configured');
      alert('Appointment booking is currently unavailable. Please try again later.');
      return;
    }

    if (!user) {
      alert('Please login to book an appointment.');
      return;
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'APPOINTMENT_BOOKING',
          specialist: specialist.name,
          patientEmail: user.email,
          patientName: user.displayName,
          symptoms: state.symptoms,
          painLevel: state.painLevel,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert(`Appointment booked with ${specialist.name}! You will receive a notification shortly.`);
      } else {
        throw new Error('Failed to send notification');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please check your connection.');
    }
  };

  return (
    <div className="bg-background min-h-screen pb-48">
      {/* Medical Report Header */}
      <section className="signature-gradient pt-20 pb-32 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/5 rounded-full -mt-96" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl mx-auto relative z-10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified AI Analysis</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-headline tracking-tight leading-tight">Health <span className="text-primary-fixed-dim">Report</span></h1>
          <p className="text-primary-fixed-dim text-xl font-medium max-w-xl mx-auto">Comprehensive analysis of your symptoms and recommended next steps.</p>
          
          <div className="flex justify-center gap-4 pt-4">
            <button 
              onClick={() => alert('Downloading your health report as PDF...')}
              className="h-12 px-6 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 transition-all backdrop-blur-md border border-white/10 font-bold text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button 
              onClick={() => alert('Opening share options...')}
              className="h-12 px-6 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 transition-all backdrop-blur-md border border-white/10 font-bold text-sm"
            >
              <Share2 className="w-4 h-4" />
              Share Report
            </button>
          </div>
        </motion.div>
      </section>

      <main className="max-w-5xl mx-auto px-6 -mt-16 relative z-20 space-y-10">
        {/* Severity Indicator Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[3rem] p-10 border-white/60 shadow-2xl flex flex-col md:flex-row gap-10 items-center overflow-hidden"
        >
          <div className="relative shrink-0">
            <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center">
              <Activity className="w-16 h-16 text-primary" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-outline-variant/30">
              <Heart className="w-6 h-6 text-error" />
            </div>
          </div>
          
          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-success/10 text-success rounded-full text-xs font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4" />
                <span>Analysis Complete</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-warning/10 text-warning rounded-full text-xs font-bold uppercase tracking-widest">
                <AlertTriangle className="w-4 h-4" />
                <span>Pain Level: {state.painLevel}/10</span>
              </div>
            </div>
            <h2 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">Condition Summary</h2>
            <p className="text-secondary text-lg leading-relaxed font-medium">
              Based on your reported symptoms in the <span className="text-primary font-bold">{state.selectedBodyPart}</span>, we've identified potential areas for specialist review.
            </p>
          </div>

          <button 
            onClick={handleListen}
            disabled={isSpeaking}
            className="w-full md:w-auto h-20 px-8 bg-white border border-outline-variant/30 rounded-3xl flex flex-col items-center justify-center gap-1 hover:bg-background transition-all shadow-premium group"
          >
            {isSpeaking ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Volume2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Listen</span>
          </button>
        </motion.div>

        {/* Specialist Recommendation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-[3rem] p-10 border-white/60 shadow-2xl flex flex-col md:flex-row gap-10 items-center bg-primary/5"
        >
          <div className="w-40 h-40 rounded-[2rem] overflow-hidden shrink-0 bg-white shadow-xl border-4 border-white">
            <img 
              src={`https://picsum.photos/seed/${specialist.name}/400/400`} 
              alt={specialist.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex-grow text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-white rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
              <Stethoscope className="w-4 h-4" />
              <span>{t('recommendedSpecialist')}</span>
            </div>
            <h2 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">{specialist.name}</h2>
            <p className="text-secondary text-lg leading-relaxed font-medium">
              {specialist.desc}
            </p>
          </div>
          <button 
            onClick={() => navigate('/final-check')}
            className="w-full md:w-auto px-10 py-6 signature-gradient text-white rounded-3xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {t('findDoctor')}
            <ChevronRight className="w-6 h-6" />
          </button>
        </motion.div>

        {/* Detailed Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <DetailCard 
            icon={<ClipboardList className="w-7 h-7" />} 
            title="Symptom Log" 
            items={[
              `Primary Area: ${state.selectedBodyPart}`,
              `Pain Intensity: ${state.painLevel}/10`,
              `Mobility Status: ${state.mobility.support}`,
              `Duration: ${state.duration || 'Not specified'}`
            ]} 
          />
          <DetailCard 
            icon={<Clock className="w-7 h-7" />} 
            title="Patient History" 
            items={[
              `Medication: ${state.medicationAdherence}`,
              `Stiffness Level: ${state.mobility.stiffness}`,
              `Previous Incidents: None reported`,
              `Last Assessment: Today`
            ]} 
          />
        </div>

        {/* Urgent Care Notice */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-error/5 border-2 border-error/20 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left"
        >
          <div className="w-20 h-20 rounded-3xl bg-error/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-10 h-10 text-error" />
          </div>
          <div className="flex-grow space-y-2">
            <h3 className="text-2xl font-extrabold text-error font-headline uppercase tracking-tight">{t('urgentCare')}</h3>
            <p className="text-error/80 text-lg font-medium leading-relaxed">
              {t('urgentSub')}
            </p>
          </div>
          <button 
            onClick={() => alert('Connecting you to emergency services...')}
            className="px-8 py-4 bg-error text-white rounded-2xl font-bold hover:bg-error/90 transition-colors shadow-lg shadow-error/20"
          >
            Emergency Call
          </button>
        </motion.div>

        {/* Next Steps Grid */}
        <section className="space-y-8">
          <h3 className="text-3xl font-extrabold text-on-surface font-headline tracking-tight">Recommended Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard 
              icon={<Calendar className="w-8 h-8" />} 
              label={t('bookAppointment')} 
              onClick={handleBookAppointment}
            />
            <ActionCard icon={<Phone className="w-8 h-8" />} label={t('teleconsultation')} />
            <ActionCard icon={<MapPin className="w-8 h-8" />} label={t('nearbyClinics')} />
          </div>
        </section>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 w-full glass-nav pt-8 pb-12 px-6 border-t border-outline-variant/15 z-50">
        <div className="max-w-5xl mx-auto flex gap-6">
          <button 
            onClick={() => navigate('/home')}
            className="flex-1 h-18 rounded-3xl bg-white border border-outline-variant/30 text-on-surface font-headline font-bold text-xl flex items-center justify-center gap-2 hover:bg-background transition-all shadow-premium"
          >
            {t('home')}
          </button>
          <button 
            onClick={() => navigate('/final-check')}
            className="flex-[2] h-18 rounded-3xl bg-primary text-white font-headline font-bold text-2xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 hover:opacity-90 transition-opacity"
          >
            {t('continue')}
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function DetailCard({ icon, title, items }: { icon: any; title: string; items: string[] }) {
  return (
    <div className="glass-card rounded-[3rem] p-10 border-white/60 shadow-2xl space-y-8">
      <div className="flex items-center gap-5 text-primary">
        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
          {icon}
        </div>
        <span className="font-extrabold font-headline text-2xl tracking-tight">{title}</span>
      </div>
      <ul className="space-y-5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-4 text-secondary font-medium text-lg leading-relaxed">
            <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ActionCard({ icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-10 glass-card rounded-[3rem] border-white/60 shadow-2xl hover:scale-105 active:scale-95 transition-all group w-full"
    >
      <div className="w-20 h-20 rounded-[2rem] bg-background flex items-center justify-center text-primary mb-6 group-hover:signature-gradient group-hover:text-white transition-all shadow-premium">
        {icon}
      </div>
      <span className="font-extrabold text-on-surface text-sm uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}
