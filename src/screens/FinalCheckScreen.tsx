import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { CheckCircle2, ChevronRight, Info, AlertCircle, ClipboardCheck, Activity, Pill, Move, Clock } from 'lucide-react';

export default function FinalCheckScreen() {
  const { state, t } = useAssessment();
  const navigate = useNavigate();

  const questions = [
    { 
      id: 'painLevel', 
      label: 'Pain Level', 
      value: `${state.painLevel}/10`, 
      icon: Activity,
      color: 'bg-error/10 text-error'
    },
    { 
      id: 'stiffness', 
      label: 'Morning Stiffness', 
      value: state.mobility.stiffness, 
      icon: Clock,
      color: 'bg-primary/10 text-primary'
    },
    { 
      id: 'support', 
      label: 'Mobility Support', 
      value: state.mobility.support, 
      icon: Move,
      color: 'bg-tertiary/10 text-tertiary'
    },
    { 
      id: 'meds', 
      label: 'Medication Adherence', 
      value: state.medicationAdherence, 
      icon: Pill,
      color: 'bg-secondary/10 text-secondary'
    },
  ];

  return (
    <div className="bg-background min-h-screen pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-nav shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-primary font-headline flex items-center gap-2">
            {t('appName')}
          </div>
          <div className="flex items-center gap-2 text-primary font-bold bg-primary-fixed px-4 py-2 rounded-full">
            <ClipboardCheck className="w-5 h-5" />
            <span>{t('finalCheck')}</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-28 space-y-10">
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-on-surface font-headline tracking-tight">{t('reviewDetails')}</h1>
          <p className="text-secondary text-lg">{t('reviewSub')}</p>
        </section>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6">
                <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center shrink-0", q.color)}>
                  <q.icon className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">{q.label}</h3>
                  <p className="text-xl font-bold text-on-surface font-headline mt-1">{q.value}</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary hover:bg-primary hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Clinical Note */}
        <div className="bg-primary-container/5 border border-primary/10 rounded-2xl p-8 space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Info className="w-6 h-6" />
            <h3 className="text-xl font-bold font-headline">{t('clinicalSummary')}</h3>
          </div>
          <p className="text-on-surface-variant leading-relaxed text-lg italic">
            "Patient reports {state.duration || 'persistent'} discomfort in the {state.selectedBodyPart || 'affected area'} with a pain intensity of {state.painLevel}/10. Mobility is {state.mobility.stiffness.toLowerCase()} affected, currently using {state.mobility.support.toLowerCase()} for support. Patient is {state.medicationAdherence.toLowerCase()} with current medications."
          </p>
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-4 p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <AlertCircle className="w-6 h-6 text-secondary shrink-0 mt-1" />
          <p className="text-sm text-secondary leading-relaxed">
            By proceeding, you agree that this assessment is for informational purposes and does not constitute a medical diagnosis. Always follow the advice of your healthcare provider.
          </p>
        </div>
      </main>

      {/* Bottom Action Bar */}
      <footer className="fixed bottom-0 w-full glass-nav pt-6 pb-10 px-6 border-t border-outline-variant/15 z-50">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button 
            onClick={() => navigate('/results')}
            className="flex-1 h-[64px] rounded-full bg-surface-container text-on-surface font-headline font-bold text-lg flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors"
          >
            {t('back')}
          </button>
          <button 
            onClick={() => navigate('/tools')}
            className="flex-[2] h-[64px] rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            {t('generateReport')}
          </button>
        </div>
      </footer>
    </div>
  );
}
