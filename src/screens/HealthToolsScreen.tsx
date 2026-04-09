import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { Pill, Calendar, FileText, Phone, Activity, Bell, ShieldCheck, ChevronRight, Mic, Settings } from 'lucide-react';

export default function HealthToolsScreen() {
  const { t } = useAssessment();
  const navigate = useNavigate();

  const tools = [
    { icon: Activity, label: 'Vital Analysis', desc: 'Check your BP, sugar stages, and more with AI.', color: 'bg-primary/10 text-primary', path: '/health-assessment' },
    { icon: Mic, label: 'Voice Assistant', desc: 'Talk to Synapse in real-time for health guidance.', color: 'bg-accent/10 text-accent', path: '/voice-assistant' },
    { icon: Pill, label: 'Medication Tracker', desc: 'Manage your prescriptions and set reminders.', color: 'bg-error/10 text-error', path: '/medication-tracker' },
    { icon: Calendar, label: 'Appointment Manager', desc: 'Keep track of your clinical visits.', color: 'bg-primary/10 text-primary', path: '/appointment-manager' },
    { icon: FileText, label: 'Health Reports', desc: 'View and share your assessment history.', color: 'bg-accent/10 text-accent', path: '/health-reports' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-48 px-6 max-w-7xl mx-auto w-full space-y-20 relative z-10">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Settings className="w-4 h-4" />
            <span>Diagnostic Suite</span>
          </motion.div>
          <h2 className="text-5xl md:text-8xl font-extrabold text-on-surface font-headline tracking-tight leading-[1]">Advanced <span className="text-primary">Health Tools</span></h2>
          <p className="text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">Empower your health journey with our suite of AI-driven diagnostic and tracking tools.</p>
        </header>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tools.map((tool, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(tool.path)}
              className="flex flex-col items-start gap-10 p-12 glass-card rounded-[4rem] border-white/60 shadow-premium hover:shadow-premium-hover hover:-translate-y-2 transition-all text-left group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[6rem] pointer-events-none" />
              
              <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform", tool.color)}>
                <tool.icon className="w-10 h-10" />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-4xl font-extrabold text-on-surface font-headline tracking-tight">{tool.label}</h3>
                <p className="text-secondary text-lg leading-relaxed font-medium">{tool.desc}</p>
              </div>

              <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-[0.15em] text-xs">
                <span>Launch Tool</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* Featured Section */}
        <section className="signature-gradient rounded-[5rem] p-16 text-white flex flex-col md:flex-row items-center gap-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -mr-48 -mt-48" />
          <div className="flex-grow space-y-10 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/20 rounded-full text-sm font-bold backdrop-blur-md border border-white/20">
              <ShieldCheck className="w-6 h-6" />
              <span>Premium Feature</span>
            </div>
            <h2 className="text-6xl md:text-7xl font-extrabold font-headline leading-[1] tracking-tight">Smart Health Monitoring</h2>
            <p className="text-primary-fixed-dim text-2xl leading-relaxed max-w-2xl font-medium">
              Connect your wearable devices to automatically sync vitals and get real-time health insights.
            </p>
            <button 
              onClick={() => alert('Redirecting to smart monitoring setup...')}
              className="px-14 py-6 bg-white text-primary rounded-3xl font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              Learn More
            </button>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white/10 rounded-[4rem] backdrop-blur-md flex items-center justify-center relative z-10 border border-white/20 shadow-inner">
            <Bell className="w-48 h-48 text-white/40 animate-bounce" />
          </div>
        </section>
      </main>
    </div>
  );
}
