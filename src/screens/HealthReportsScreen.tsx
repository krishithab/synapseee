import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { FileText, Download, Share2, Search, Filter, ChevronRight, Activity, Calendar, ShieldCheck } from 'lucide-react';

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  severity: 'Healthy' | 'Moderate' | 'High';
}

export default function HealthReportsScreen() {
  const { t } = useAssessment();
  const navigate = useNavigate();
  const [reports] = useState<Report[]>([
    { id: '1', title: 'General Health Assessment', date: 'Oct 08, 2026', type: 'Full Scan', severity: 'Healthy' },
    { id: '2', title: 'Cardiovascular Analysis', date: 'Sep 24, 2026', type: 'Targeted', severity: 'Moderate' },
    { id: '3', title: 'Neurological Screening', date: 'Aug 12, 2026', type: 'Full Scan', severity: 'Healthy' },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-48 px-6 max-w-5xl mx-auto w-full space-y-16 relative z-10">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            <FileText className="w-4 h-4" />
            <span>Medical Archives</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-on-surface font-headline tracking-tight leading-[1]">Health <span className="text-accent">Reports</span></h2>
          <p className="text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">Access and manage your complete history of AI-driven health assessments and diagnostic reports.</p>
        </header>

        <div className="space-y-8">
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-grow relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                placeholder="Search reports..." 
                className="w-full h-16 pl-16 pr-8 bg-white rounded-3xl border border-outline-variant/30 focus:ring-4 focus:ring-accent/10 transition-all outline-none font-medium"
              />
            </div>
            <button className="h-16 px-8 bg-white rounded-3xl border border-outline-variant/30 flex items-center gap-3 font-bold text-secondary hover:bg-accent/5 hover:text-accent transition-all">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {reports.map((report, i) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-8 rounded-[3rem] border-white/60 shadow-premium flex flex-col md:flex-row items-center justify-between gap-8 group hover:shadow-premium-hover transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                    report.severity === 'Healthy' ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                  )}>
                    <Activity className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-2xl font-extrabold text-on-surface font-headline">{report.title}</h4>
                    <div className="flex items-center gap-4 text-secondary font-medium text-sm">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {report.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" />
                        {report.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => alert('Downloading report...')}
                    className="flex-1 md:flex-none h-14 w-14 bg-background/50 text-secondary rounded-2xl flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-all border border-outline-variant/30"
                    title="Download PDF"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => alert('Sharing report...')}
                    className="flex-1 md:flex-none h-14 w-14 bg-background/50 text-secondary rounded-2xl flex items-center justify-center hover:bg-accent/10 hover:text-accent transition-all border border-outline-variant/30"
                    title="Share Report"
                  >
                    <Share2 className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => navigate('/results')}
                    className="flex-[2] md:flex-none h-14 px-8 bg-accent text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    View
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <section className="bg-surface-container-low rounded-[3rem] p-10 border border-outline-variant/10 flex items-start gap-6">
          <div className="w-14 h-14 bg-success/10 rounded-2xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8 text-success" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold font-headline text-on-surface">End-to-End Encrypted</h3>
            <p className="text-secondary font-medium leading-relaxed">
              Your medical data is encrypted and stored securely. Only you and authorized healthcare providers can access these reports.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
