import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { ArrowLeft, BookOpen, Stethoscope, Settings, AlertTriangle, Lightbulb } from 'lucide-react';

export default function AboutScreen() {
  const navigate = useNavigate();
  const { t } = useAssessment();

  const sections = [
    {
      icon: <BookOpen className="w-8 h-8 text-primary" />,
      title: t('aboutTitle'),
      content: t('aboutDesc')
    },
    {
      icon: <Stethoscope className="w-8 h-8 text-primary" />,
      title: t('whatItDoesTitle'),
      bullets: [
        t('whatItDoes1'),
        t('whatItDoes2'),
        t('whatItDoes3'),
        t('whatItDoes4')
      ]
    },
    {
      icon: <Settings className="w-8 h-8 text-primary" />,
      title: t('howItWorksTitle'),
      steps: [
        t('howItWorks1'),
        t('howItWorks2'),
        t('howItWorks3'),
        t('howItWorks4')
      ]
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-error" />,
      title: t('disclaimerTitle'),
      content: t('disclaimerDesc')
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-primary" />,
      title: t('whyAppTitle'),
      content: t('whyAppDesc')
    }
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
            <BookOpen className="w-4 h-4" />
            <span>Project Information</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-on-surface font-headline tracking-tight leading-[1]">About <span className="text-primary">Synapse</span></h2>
          <p className="text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">Learn more about our mission to revolutionize healthcare through artificial intelligence.</p>
        </header>

        <div className="space-y-8">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card rounded-[3rem] p-10 border-white/60 shadow-premium space-y-6"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner">
                  {section.icon}
                </div>
                <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight">{section.title}</h2>
              </div>
              
              {section.content && (
                <p className="text-secondary leading-relaxed text-xl font-medium">
                  {section.content}
                </p>
              )}

              {section.bullets && (
                <ul className="space-y-4">
                  {section.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4 text-secondary text-lg font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0 shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.steps && (
                <ol className="space-y-5">
                  {section.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-5 text-secondary text-lg font-medium">
                      <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary font-bold text-lg shrink-0 shadow-inner">
                        {i + 1}
                      </span>
                      <span className="pt-1">{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="signature-gradient rounded-[4rem] p-16 text-white text-center space-y-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32" />
          <h3 className="text-4xl md:text-5xl font-extrabold font-headline tracking-tight relative z-10">Ready to start?</h3>
          <p className="text-primary-fixed-dim text-xl font-medium max-w-xl mx-auto relative z-10">Experience the future of healthcare today with our AI-powered diagnostics.</p>
          <button 
            onClick={() => navigate('/home')}
            className="px-14 py-6 bg-white text-primary rounded-3xl font-bold text-xl shadow-2xl hover:scale-105 active:scale-95 transition-all relative z-10"
          >
            Get Started Now
          </button>
        </motion.div>
      </main>
    </div>
  );
}
