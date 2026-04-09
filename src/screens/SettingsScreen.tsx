import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { 
  ArrowLeft, 
  Globe, 
  Mic, 
  Eye, 
  Database, 
  Bell, 
  Check, 
  ChevronRight,
  Trash2,
  History,
  Settings
} from 'lucide-react';
import { Language, ShareMode } from '../types';

export default function SettingsScreen() {
  const navigate = useNavigate();
  const { state, setState, t } = useAssessment();

  const languages: { id: Language; label: string }[] = [
    { id: 'English', label: 'English' },
    { id: 'Telugu', label: 'తెలుగు' },
    { id: 'Hindi', label: 'हिंदी' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-32 space-y-10 relative z-10 w-full">
        <header className="text-center space-y-6 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-on-surface font-headline tracking-tight leading-[1]">App <span className="text-primary">Settings</span></h2>
          <p className="text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">Customize your Synapse experience for better accessibility and performance.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Language Card */}
          <section className="glass-card rounded-[3rem] p-10 border-white/60 shadow-premium space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Globe className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">Language</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setState(prev => ({ ...prev, language: lang.id }))}
                  className={cn(
                    "w-full h-16 px-8 rounded-2xl font-bold transition-all flex items-center justify-between border-2",
                    state.language === lang.id 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-background/50 text-secondary border-outline-variant/30 hover:border-primary/30"
                  )}
                >
                  <span className="text-lg">{lang.label}</span>
                  {state.language === lang.id && <Check className="w-6 h-6" />}
                </button>
              ))}
            </div>
          </section>

          {/* Accessibility Card */}
          <section className="glass-card rounded-[3rem] p-10 border-white/60 shadow-premium space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">Accessibility</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-secondary uppercase tracking-widest ml-2">Text Size</span>
                <div className="flex gap-3">
                  {[
                    { id: 'large', label: 'A+' },
                    { id: 'medium', label: 'A' },
                    { id: 'small', label: 'A-' }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setState(prev => ({ ...prev, fontSize: size.id as any }))}
                      className={cn(
                        "flex-1 h-16 rounded-2xl font-bold transition-all flex items-center justify-center text-xl border-2",
                        state.fontSize === size.id 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                          : "bg-background/50 text-secondary border-outline-variant/30 hover:border-primary/30"
                      )}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                onClick={() => alert('High Contrast Mode toggled!')}
                className="w-full h-16 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 flex items-center justify-between group hover:border-primary/30 transition-all"
              >
                <span className="font-bold text-secondary text-lg">High Contrast</span>
                <div className="w-12 h-6 bg-outline-variant/20 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </button>
            </div>
          </section>

          {/* Data & Privacy */}
          <section className="glass-card rounded-[3rem] p-10 border-white/60 shadow-premium space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Database className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">Data & Privacy</h2>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => alert('Your data history is being retrieved...')}
                className="w-full h-16 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 flex items-center gap-4 hover:bg-primary/5 hover:border-primary/30 transition-all group"
              >
                <History className="w-6 h-6 text-primary" />
                <span className="font-bold text-secondary text-lg">View History</span>
              </button>
              <button 
                onClick={() => alert('Are you sure you want to clear all data? This action is irreversible.')}
                className="w-full h-16 px-8 bg-error/5 rounded-2xl border border-error/20 flex items-center gap-4 hover:bg-error/10 transition-all group"
              >
                <Trash2 className="w-6 h-6 text-error" />
                <span className="font-bold text-error text-lg">Clear My Data</span>
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="glass-card rounded-[3rem] p-10 border-white/60 shadow-premium space-y-8">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                <Bell className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold font-headline text-on-surface tracking-tight">Notifications</h2>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => alert('Notification settings updated!')}
                className="w-full h-16 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 flex items-center justify-between group hover:border-primary/30 transition-all"
              >
                <span className="font-bold text-secondary text-lg">Push Notifications</span>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </button>
              <button 
                onClick={() => alert('Email preferences updated!')}
                className="w-full h-16 px-8 bg-background/50 rounded-2xl border border-outline-variant/30 flex items-center justify-between group hover:border-primary/30 transition-all"
              >
                <span className="font-bold text-secondary text-lg">Email Updates</span>
                <div className="w-12 h-6 bg-outline-variant/20 rounded-full relative">
                  <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                </div>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
