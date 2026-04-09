import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { X, ArrowLeft, ArrowRight, Info, Calendar, CalendarDays, CalendarRange, History, Check } from 'lucide-react';

export default function AssessmentScreen() {
  const { state, setState, t } = useAssessment();
  const navigate = useNavigate();

  const durationOptions = [
    { id: 'Today', label: 'Today', icon: Calendar },
    { id: '2-3 Days', label: '2-3 Days', icon: CalendarDays },
    { id: 'More than a week', label: 'More than a week', icon: CalendarRange },
    { id: 'Intermittent', label: 'Intermittent', icon: History },
  ];

  const medicationOptions = [
    { id: 'None', label: 'None' },
    { id: 'Occasional', label: 'Occasional' },
    { id: 'Regular', label: 'Regular' },
    { id: 'Fully Compliant', label: 'Fully Compliant' },
  ];

  const handleContinue = () => {
    if (state.step < 4) {
      setState(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      navigate('/results');
    }
  };

  const handleBack = () => {
    if (state.step > 1) {
      setState(prev => ({ ...prev, step: prev.step - 1 }));
    } else {
      navigate('/home');
    }
  };

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-lowest rounded-xl p-8 atmospheric-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
              <p className="font-headline text-2xl text-on-surface leading-snug">
                {t('durationQuestion')}
              </p>
              <p className="text-secondary mt-2 text-lg">{t('durationSub')}</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {durationOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState(prev => ({ ...prev, duration: opt.id }))}
                  className={cn(
                    "group flex items-center justify-between p-6 rounded-xl transition-all scale-100 active:scale-95 text-left",
                    state.duration === opt.id 
                      ? "bg-primary-container text-on-primary-container ring-2 ring-primary" 
                      : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  <div className="flex items-center gap-6">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center",
                      state.duration === opt.id ? "bg-white/20" : "bg-surface-container"
                    )}>
                      <opt.icon className={cn("w-6 h-6", state.duration === opt.id ? "text-white" : "text-primary")} />
                    </div>
                    <span className="font-headline text-xl font-bold">{opt.label}</span>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    state.duration === opt.id ? "bg-white border-white" : "border-outline-variant group-hover:border-primary"
                  )}>
                    {state.duration === opt.id && <div className="w-3 h-3 rounded-full bg-primary" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-lowest rounded-xl p-8 atmospheric-shadow"
            >
              <p className="font-headline text-2xl text-on-surface leading-snug">
                {t('painLevelQuestion')}
              </p>
              <p className="text-secondary mt-2 text-lg">{t('painLevelSub')}</p>
            </motion.div>

            <div className="bg-surface-container-lowest rounded-xl p-10 space-y-10">
              <div className="flex justify-between text-4xl font-bold text-primary">
                <span>1</span>
                <span className="text-6xl">{state.painLevel}</span>
                <span>10</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={state.painLevel}
                onChange={(e) => setState(prev => ({ ...prev, painLevel: parseInt(e.target.value) }))}
                className="w-full h-4 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-secondary font-bold uppercase tracking-widest text-xs">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-lowest rounded-xl p-8 atmospheric-shadow"
            >
              <p className="font-headline text-2xl text-on-surface leading-snug">
                {t('mobilityQuestion')}
              </p>
            </motion.div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-lg font-bold text-on-surface ml-2">{t('stiffnessLabel')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['None', 'Minimal', 'Moderate', 'Severe'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setState(prev => ({ ...prev, mobility: { ...prev.mobility, stiffness: level } }))}
                      className={cn(
                        "p-4 rounded-xl font-bold transition-all",
                        state.mobility.stiffness === level ? "bg-primary text-white" : "bg-surface-container-lowest text-secondary border border-outline-variant"
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-lg font-bold text-on-surface ml-2">{t('supportLabel')}</label>
                <div className="grid grid-cols-2 gap-3">
                  {['None', 'Cane', 'Walker', 'Wheelchair'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setState(prev => ({ ...prev, mobility: { ...prev.mobility, support: type } }))}
                      className={cn(
                        "p-4 rounded-xl font-bold transition-all",
                        state.mobility.support === type ? "bg-primary text-white" : "bg-surface-container-lowest text-secondary border border-outline-variant"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-surface-container-lowest rounded-xl p-8 atmospheric-shadow"
            >
              <p className="font-headline text-2xl text-on-surface leading-snug">
                {t('medicationQuestion')}
              </p>
              <p className="text-secondary mt-2 text-lg">{t('medicationSub')}</p>
            </motion.div>

            <div className="grid grid-cols-1 gap-4">
              {medicationOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setState(prev => ({ ...prev, medicationAdherence: opt.id }))}
                  className={cn(
                    "p-6 rounded-xl font-bold text-xl transition-all text-left flex items-center justify-between",
                    state.medicationAdherence === opt.id ? "bg-primary text-white" : "bg-surface-container-lowest text-on-surface border border-outline-variant"
                  )}
                >
                  {opt.label}
                  {state.medicationAdherence === opt.id && <Check className="w-6 h-6" />}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="fixed top-0 w-full z-50 glass-nav shadow-sm">
        <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-primary font-headline flex items-center gap-2">
            {t('appName')}
          </div>
          <button 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2 text-secondary font-medium px-4 py-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
            <span>{t('cancel')}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-32 px-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl space-y-12">
          {/* Progress Indicator */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <span className="text-primary font-bold tracking-tight font-label uppercase text-sm">{t('step')} {state.step} {t('of')} 4</span>
                <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight mt-1">
                  {state.step === 1 && t('symptomDuration')}
                  {state.step === 2 && t('painLevelTitle')}
                  {state.step === 3 && t('mobilityTitle')}
                  {state.step === 4 && t('medicationTitle')}
                </h1>
              </div>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4].map((s) => (
                  <div 
                    key={s} 
                    className={cn(
                      "w-10 h-1.5 rounded-full transition-colors",
                      s < state.step ? "bg-primary-container" : s === state.step ? "bg-primary" : "bg-surface-container-high"
                    )} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Question & Options */}
          <section className="min-h-[400px]">
            {renderStep()}
          </section>
        </div>
      </main>

      {/* Action Anchor */}
      <footer className="fixed bottom-0 w-full glass-nav pt-6 pb-10 px-6 border-t border-outline-variant/15">
        <div className="max-w-2xl mx-auto flex gap-4">
          <button 
            onClick={handleBack}
            className="flex-1 h-[64px] rounded-full bg-secondary-container text-on-secondary-container font-headline font-bold text-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('back')}
          </button>
          <button 
            onClick={handleContinue}
            disabled={state.step === 1 && !state.duration}
            className="flex-[2] h-[64px] rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {t('continue')}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

      {/* Sidebar Info (Desktop) */}
      <aside className="hidden xl:block fixed right-12 top-1/2 -translate-y-1/2 w-80 space-y-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-l-4 border-primary">
          <div className="flex items-center gap-3 mb-4 text-primary">
            <Info className="w-5 h-5 fill-primary/10" />
            <span className="font-bold font-label">Why we ask</span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Duration helps our clinical team distinguish between acute conditions and chronic issues that may require different diagnostic paths.
          </p>
        </div>
        <div className="rounded-xl overflow-hidden shadow-sm aspect-square bg-surface-container relative">
          <img 
            src="https://picsum.photos/seed/doctor/400/400" 
            alt="Professional healthcare consultant" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
        </div>
      </aside>
    </div>
  );
}
