import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { Language, ShareMode } from '../types';
import { cn } from '../lib/utils';
import { Globe, Languages, Mic, Keyboard, SearchCheck, Stethoscope, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OnboardingScreen() {
  const { state, setState, t } = useAssessment();
  const navigate = useNavigate();

  const languages: { id: Language; label: string; sub: string; icon: any }[] = [
    { id: 'English', label: 'English', sub: 'Standard', icon: Globe },
    { id: 'Telugu', label: 'తెలుగు', sub: 'Telugu', icon: Languages },
    { id: 'Hindi', label: 'हिंदी', sub: 'Hindi', icon: Languages },
  ];

  const shareModes: { id: ShareMode; label: string; sub: string; icon: any; color: string }[] = [
    { id: 'Voice', label: t('voiceMode'), sub: t('voiceSub'), icon: Mic, color: 'bg-secondary-container' },
    { id: 'Text', label: t('textMode'), sub: t('textSub'), icon: Keyboard, color: 'bg-primary' },
  ];

  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Section with Background Image */}
      <header className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-6 py-20 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/clinic/1920/1080" 
            alt="Clinical background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-surface" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-4 font-headline drop-shadow-sm"
          >
            {t('appName')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-primary-fixed-dim font-medium tracking-tight text-xl md:text-2xl mb-10 max-w-2xl mx-auto"
          >
            {t('tagline')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative group">
              {/* Gooey Filter SVG */}
              <svg className="absolute w-0 h-0" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <filter id="gooey">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                    <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
                    <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
                  </filter>
                </defs>
              </svg>

              <div style={{ filter: 'url(#gooey)' }} className="relative flex items-center justify-center">
                <div className="absolute w-full h-full bg-white/40 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
                <button 
                  onClick={() => navigate('/home')}
                  className="relative z-10 bg-white text-primary px-12 h-20 rounded-full text-2xl font-bold flex items-center justify-center gap-4 shadow-2xl hover:scale-[1.05] transition-all active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10">{t('startAssessment')}</span>
                  <ArrowRight className="w-8 h-8 relative z-10" />
                  {/* Liquid Blobs */}
                  <div className="absolute top-0 left-0 w-full h-full bg-white/10 group-hover:bg-white/20 transition-colors" />
                </button>
              </div>
            </div>
            <p className="text-white/80 font-medium text-sm uppercase tracking-widest">
              {t('empoweringText')}
            </p>
          </motion.div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-6 pb-24 mt-16">
        {/* Language Selection */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="col-span-full mb-4">
            <h2 className="text-3xl font-bold text-on-surface font-headline">{t('chooseLanguage')}</h2>
            <p className="text-secondary text-lg">{t('languageSub')}</p>
          </div>
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setState(prev => ({ ...prev, language: lang.id }))}
              className={cn(
                "group p-8 rounded-2xl bg-surface-container-lowest shadow-sm hover:shadow-xl transition-all border-b-8 active:scale-95 text-left",
                state.language === lang.id ? "border-primary translate-y-[-4px]" : "border-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
                  state.language === lang.id ? "bg-primary text-white" : "bg-surface-container text-primary"
                )}>
                  <lang.icon className="w-8 h-8" />
                </div>
                <CheckCircle2 className={cn(
                  "w-8 h-8 transition-colors",
                  state.language === lang.id ? "text-primary fill-primary/20" : "text-surface-variant group-hover:text-primary"
                )} />
              </div>
              <div className="text-3xl font-bold text-on-surface mb-1 font-headline">{lang.label}</div>
              <div className="text-sm text-secondary uppercase tracking-widest font-extrabold">{lang.sub}</div>
            </button>
          ))}
        </section>

        {/* Input Mode */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="col-span-full mb-4">
            <h2 className="text-3xl font-bold text-on-surface font-headline">{t('howShare')}</h2>
            <p className="text-secondary text-lg">{t('shareSub')}</p>
          </div>
          {shareModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setState(prev => ({ ...prev, shareMode: mode.id }))}
              className={cn(
                "flex items-center gap-8 p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all active:scale-95 text-left border-2",
                state.shareMode === mode.id 
                  ? "bg-primary text-on-primary border-primary shadow-primary/20" 
                  : "bg-surface-container-lowest border-transparent"
              )}
            >
              <div className={cn(
                "w-20 h-20 rounded-2xl flex items-center justify-center shrink-0",
                state.shareMode === mode.id ? "bg-white/20" : mode.color
              )}>
                <mode.icon className={cn(
                  "w-10 h-10",
                  state.shareMode === mode.id ? "text-white" : "text-primary"
                )} />
              </div>
              <div>
                <div className="text-2xl font-bold font-headline mb-1">{mode.label}</div>
                <p className={cn(
                  "text-lg",
                  state.shareMode === mode.id ? "text-primary-fixed-dim" : "text-secondary"
                )}>{mode.sub}</p>
              </div>
            </button>
          ))}
        </section>

        {/* Info Section */}
        <section className="bg-surface-container-low rounded-[3rem] p-12 mb-16 border border-outline-variant/10">
          <h2 className="text-4xl font-bold text-on-surface mb-12 font-headline text-center">{t('whatAppDoes')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <InfoItem 
              icon={<SearchCheck className="w-8 h-8" />} 
              title={t('identifySymptoms')} 
              desc={t('identifySymptomsDesc')}
              color="bg-primary-container text-on-primary-container"
            />
            <InfoItem 
              icon={<Stethoscope className="w-8 h-8" />} 
              title={t('doctorSuggestions')} 
              desc={t('doctorSuggestionsDesc')}
              color="bg-tertiary-fixed text-on-tertiary-fixed"
            />
            <InfoItem 
              icon={<Clock className="w-8 h-8" />} 
              title={t('saveTime')} 
              desc={t('saveTimeDesc')}
              color="bg-secondary-fixed text-on-secondary-fixed"
            />
          </div>
        </section>
      </main>

      <footer className="w-full py-12 text-center bg-surface-container-high">
        <div className="max-w-screen-xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-lg font-bold text-primary font-headline">{t('appName')}</p>
          <p className="text-sm font-medium text-secondary">© 2026 Clinical Health Systems • Safe • Private • Clinical Guidance</p>
          <div className="flex gap-8">
            <a href="#" className="text-secondary hover:text-primary font-bold transition-colors">Privacy</a>
            <a href="#" className="text-secondary hover:text-primary font-bold transition-colors">Terms</a>
            <a href="#" className="text-secondary hover:text-primary font-bold transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoItem({ icon, title, desc, color }: { icon: any; title: string; desc: string; color: string }) {
  return (
    <div className="space-y-6 text-center md:text-left">
      <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-lg", color)}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-on-surface font-headline">{title}</h3>
      <p className="text-secondary text-lg leading-relaxed">{desc}</p>
    </div>
  );
}
