import React, { useState, createContext, useContext, ReactNode, useMemo, useEffect, ErrorInfo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { AssessmentState, INITIAL_ASSESSMENT_STATE } from './types';
import OnboardingScreen from './screens/OnboardingScreen';
import AssessmentScreen from './screens/AssessmentScreen';
import HomeScreen from './screens/HomeScreen';
import ResultsScreen from './screens/ResultsScreen';
import FinalCheckScreen from './screens/FinalCheckScreen';
import HealthToolsScreen from './screens/HealthToolsScreen';
import AboutScreen from './screens/AboutScreen';
import SettingsScreen from './screens/SettingsScreen';
import HealthAssessmentScreen from './screens/HealthAssessmentScreen';
import VoiceAssistantScreen from './screens/VoiceAssistantScreen';
import MedicationTrackerScreen from './screens/MedicationTrackerScreen';
import AppointmentManagerScreen from './screens/AppointmentManagerScreen';
import HealthReportsScreen from './screens/HealthReportsScreen';
import { cn } from './lib/utils';
import { Home, Pill, PhoneCall, UserCircle, Globe, Settings, Info, LogOut, LogIn, AlertTriangle, Mic, Activity } from 'lucide-react';
import { translations, TranslationKeys } from './translations';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

interface AssessmentContextType {
  state: AssessmentState;
  setState: (state: AssessmentState | ((prev: AssessmentState) => AssessmentState)) => void;
  t: (key: TranslationKeys) => string;
  user: User | null;
  loading: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error('useAssessment must be used within an AssessmentProvider');
  return {
    ...context,
    logout,
    signInWithGoogle
  };
};

// Error Boundary Component
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      let errorMessage = "Something went wrong. Please try again later.";
      try {
        const parsedError = JSON.parse(this.state.error?.message || "{}");
        if (parsedError.error) {
          errorMessage = `Firestore Error: ${parsedError.error} during ${parsedError.operationType} on ${parsedError.path}`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-error/20 max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>
            <h1 className="text-2xl font-bold font-headline text-on-surface">Oops! An error occurred</h1>
            <p className="text-secondary leading-relaxed">{errorMessage}</p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { state, t, user, loading } = useAssessment();
  const isAssessment = location.pathname.startsWith('/assessment') || location.pathname === '/final-check';
  const isOnboarding = location.pathname === '/onboarding';

  // Apply root font size scaling
  useMemo(() => {
    const root = document.documentElement;
    if (state.fontSize === 'small') {
      root.style.fontSize = '14px';
    } else if (state.fontSize === 'medium') {
      root.style.fontSize = '16px';
    } else if (state.fontSize === 'large') {
      root.style.fontSize = '18px';
    }
  }, [state.fontSize]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-all duration-300 text-on-surface relative overflow-hidden"
    )}>
      {/* Neural Background */}
      <div className="neural-bg">
        <div className="neural-node w-[60vw] h-[60vw] -top-[20vh] -left-[20vw] opacity-60" />
        <div className="neural-node w-[50vw] h-[50vw] top-[30vh] -right-[10vw] [animation-delay:-5s] opacity-40" />
        <div className="neural-node w-[40vw] h-[40vw] -bottom-[10vh] left-[30vw] [animation-delay:-10s] opacity-50" />
      </div>

      {/* Navigation Bar */}
      {!isOnboarding && (
        <nav className="fixed top-0 w-full z-50 glass-nav">
          <div className="flex justify-between items-center px-6 py-4 w-full max-w-screen-2xl mx-auto">
            <Link to="/home" className="flex items-center gap-3 group">
              <div className="w-10 h-10 signature-gradient rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tighter text-on-surface font-headline">SYNAPSE</span>
            </Link>
            
            {!isAssessment && (
              <div className="hidden md:flex items-center space-x-2">
                <NavLink to="/home" label={t('home')} active={location.pathname === '/home'} />
                <NavLink to="/tools" label={t('healthTools')} active={location.pathname === '/tools'} />
                <NavLink to="/about" label={t('about')} active={location.pathname === '/about'} />
              </div>
            )}
            <div className="flex items-center gap-4">
              <Link to="/voice-assistant" className="w-10 h-10 flex items-center justify-center text-primary hover:bg-primary/10 rounded-full transition-all hover:scale-110" title="Voice Assistant">
                <Mic className="w-6 h-6" />
              </Link>
              <Link to="/onboarding" className="flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full hover:bg-white transition-colors border border-outline-variant/30">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-bold text-on-surface text-sm">{state.language}</span>
              </Link>
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/settings" className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary transition-colors">
                    <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </Link>
                  <button 
                    onClick={logout}
                    className="p-2 text-secondary hover:text-error transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={signInWithGoogle}
                  className="flex items-center gap-2 px-6 py-2.5 signature-gradient text-white rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <main className={cn("flex-grow", !isOnboarding && "pt-20")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation (Mobile) */}
      {!isOnboarding && !isAssessment && (
        <nav className="md:hidden fixed bottom-6 left-6 right-6 flex justify-around items-center px-4 py-4 bg-white/90 backdrop-blur-xl z-[60] border border-white/20 rounded-3xl shadow-2xl">
          <MobileNavLink to="/home" icon={<Home />} label={t('home')} active={location.pathname === '/home'} />
          <MobileNavLink to="/tools" icon={<Pill />} label={t('healthTools')} active={location.pathname === '/tools'} />
          <MobileNavLink to="/about" icon={<Info />} label={t('about')} active={location.pathname === '/about'} />
          <button 
            onClick={() => alert('Connecting to emergency services...')}
            className="flex flex-col items-center justify-center px-4 py-2 transition-all rounded-2xl text-error hover:scale-105"
          >
            <PhoneCall className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">SOS</span>
          </button>
        </nav>
      )}
    </div>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "text-xs tracking-tight transition-all px-6 py-2 rounded-full font-bold uppercase tracking-widest",
        active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-secondary hover:bg-primary/5 hover:text-primary"
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavLink({ to, icon, label, active }: { to: string; icon: ReactNode; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center px-4 py-2 transition-all rounded-2xl",
        active ? "bg-primary/10 text-primary scale-105" : "text-secondary hover:scale-105"
      )}
    >
      {React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5" })}
      <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label}</span>
    </Link>
  );
}

export default function App() {
  const [state, setState] = useState<AssessmentState>(INITIAL_ASSESSMENT_STATE);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const t = useMemo(() => {
    return (key: TranslationKeys) => {
      return translations[state.language][key] || translations.English[key];
    };
  }, [state.language]);

  return (
    <ErrorBoundary>
      <AssessmentContext.Provider value={{ state, setState, t, user, loading }}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/onboarding" element={<OnboardingScreen />} />
              <Route path="/assessment" element={<AssessmentScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/results" element={<ResultsScreen />} />
              <Route path="/final-check" element={<FinalCheckScreen />} />
              <Route path="/tools" element={<HealthToolsScreen />} />
              <Route path="/health-assessment" element={<HealthAssessmentScreen />} />
              <Route path="/voice-assistant" element={<VoiceAssistantScreen />} />
              <Route path="/medication-tracker" element={<MedicationTrackerScreen />} />
              <Route path="/appointment-manager" element={<AppointmentManagerScreen />} />
              <Route path="/health-reports" element={<HealthReportsScreen />} />
              <Route path="/about" element={<AboutScreen />} />
              <Route path="/settings" element={<SettingsScreen />} />
              <Route path="/" element={<Navigate to="/onboarding" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AssessmentContext.Provider>
    </ErrorBoundary>
  );
}
