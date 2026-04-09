import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { Pill, Plus, Clock, Bell, Trash2, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
}

export default function MedicationTrackerScreen() {
  const { t } = useAssessment();
  const navigate = useNavigate();
  const [meds, setMeds] = useState<Medication[]>([
    { id: '1', name: 'Metformin', dosage: '500mg', time: '08:00 AM', taken: true },
    { id: '2', name: 'Lisinopril', dosage: '10mg', time: '09:00 AM', taken: false },
    { id: '3', name: 'Atorvastatin', dosage: '20mg', time: '08:00 PM', taken: false },
  ]);

  const toggleTaken = (id: string) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const removeMed = (id: string) => {
    setMeds(meds.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-48 px-6 max-w-4xl mx-auto w-full space-y-12 relative z-10">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Pill className="w-4 h-4" />
            <span>Prescription Management</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-on-surface font-headline tracking-tight leading-[1]">Medication <span className="text-secondary">Tracker</span></h2>
          <p className="text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">Stay on top of your health by managing your daily prescriptions and reminders.</p>
        </header>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-bold font-headline text-on-surface">Today's Schedule</h3>
            <button 
              onClick={() => alert('Add medication feature coming soon!')}
              className="flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Add New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {meds.map((med) => (
                <motion.div
                  key={med.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    "glass-card p-6 rounded-[2.5rem] border-white/60 shadow-premium flex items-center justify-between group transition-all",
                    med.taken ? "bg-success/5 border-success/20" : ""
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner transition-colors",
                      med.taken ? "bg-success/20 text-success" : "bg-secondary/10 text-secondary"
                    )}>
                      <Pill className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-extrabold text-on-surface font-headline">{med.name}</h4>
                      <div className="flex items-center gap-4 text-secondary font-medium mt-1">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          {med.dosage}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {med.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTaken(med.id)}
                      className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                        med.taken ? "bg-success text-white" : "bg-white text-secondary hover:bg-secondary/10"
                      )}
                    >
                      <CheckCircle2 className="w-7 h-7" />
                    </button>
                    <button
                      onClick={() => removeMed(med.id)}
                      className="w-14 h-14 bg-white text-error/40 hover:text-error rounded-2xl flex items-center justify-center transition-all hover:bg-error/5"
                    >
                      <Trash2 className="w-6 h-6" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Adherence Stats */}
        <section className="bg-secondary/5 rounded-[4rem] p-12 border border-secondary/10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-grow space-y-6">
            <h3 className="text-3xl font-extrabold font-headline text-on-surface">Weekly Adherence</h3>
            <p className="text-secondary text-lg font-medium leading-relaxed">
              You've taken 92% of your medications this week. Keep up the great work for optimal health results!
            </p>
            <div className="h-4 w-full bg-white/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '92%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-secondary shadow-[0_0_20px_rgba(236,72,153,0.4)]"
              />
            </div>
          </div>
          <div className="w-48 h-48 rounded-full border-8 border-secondary/20 flex items-center justify-center relative">
            <span className="text-4xl font-black text-secondary">92%</span>
            <div className="absolute inset-0 border-8 border-secondary border-t-transparent rounded-full -rotate-45" />
          </div>
        </section>
      </main>
    </div>
  );
}
