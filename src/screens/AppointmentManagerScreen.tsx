import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAssessment } from '../App';
import { cn } from '../lib/utils';
import { Calendar, Plus, MapPin, User, Clock, ChevronRight, Bell, Video } from 'lucide-react';

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  type: 'In-person' | 'Virtual';
}

export default function AppointmentManagerScreen() {
  const { t } = useAssessment();
  const navigate = useNavigate();
  const [appointments] = useState<Appointment[]>([
    { id: '1', doctor: 'Dr. Sarah Wilson', specialty: 'Cardiologist', date: 'Oct 24, 2026', time: '10:30 AM', location: 'City Health Center', type: 'In-person' },
    { id: '2', doctor: 'Dr. James Miller', specialty: 'Neurologist', date: 'Oct 28, 2026', time: '02:00 PM', location: 'Zoom Meeting', type: 'Virtual' },
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-48 px-6 max-w-5xl mx-auto w-full space-y-16 relative z-10">
        <header className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-[0.2em]"
          >
            <Calendar className="w-4 h-4" />
            <span>Clinical Schedule</span>
          </motion.div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-on-surface font-headline tracking-tight leading-[1]">Appointment <span className="text-primary">Manager</span></h2>
          <p className="text-secondary text-xl max-w-2xl mx-auto font-medium leading-relaxed">Keep track of your upcoming clinical visits and virtual consultations with ease.</p>
        </header>

        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-extrabold font-headline text-on-surface">Upcoming Visits</h3>
            <button 
              onClick={() => alert('Schedule appointment feature coming soon!')}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="w-6 h-6" />
              <span>Book New</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {appointments.map((apt, i) => (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-[3.5rem] border-white/60 shadow-premium flex flex-col md:flex-row items-center justify-between gap-10 group hover:shadow-premium-hover transition-all"
              >
                <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-[2rem] bg-background/50 flex items-center justify-center overflow-hidden border-2 border-primary/10 shadow-inner">
                    <img 
                      src={`https://picsum.photos/seed/${apt.doctor}/200/200`} 
                      alt={apt.doctor} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="text-3xl font-extrabold text-on-surface font-headline">{apt.doctor}</h4>
                      <span className={cn(
                        "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                        apt.type === 'Virtual' ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                      )}>
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-primary font-bold text-lg">{apt.specialty}</p>
                    <div className="flex flex-wrap gap-6 pt-2">
                      <span className="flex items-center gap-2 text-secondary font-medium">
                        <Calendar className="w-5 h-5 text-primary/60" />
                        {apt.date}
                      </span>
                      <span className="flex items-center gap-2 text-secondary font-medium">
                        <Clock className="w-5 h-5 text-primary/60" />
                        {apt.time}
                      </span>
                      <span className="flex items-center gap-2 text-secondary font-medium">
                        {apt.type === 'Virtual' ? <Video className="w-5 h-5 text-accent/60" /> : <MapPin className="w-5 h-5 text-primary/60" />}
                        {apt.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => alert('Setting reminder...')}
                    className="flex-1 md:flex-none h-16 px-8 bg-background/50 text-secondary rounded-2xl font-bold hover:bg-primary/10 hover:text-primary transition-all flex items-center justify-center gap-3 border border-outline-variant/30"
                  >
                    <Bell className="w-5 h-5" />
                    Remind Me
                  </button>
                  <button className="flex-1 md:flex-none h-16 px-10 bg-primary text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-3">
                    Details
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Banner */}
        <section className="signature-gradient rounded-[4rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48" />
          <div className="flex-grow space-y-6 relative z-10">
            <h3 className="text-4xl font-extrabold font-headline tracking-tight">Need a consultation?</h3>
            <p className="text-primary-fixed-dim text-xl font-medium max-w-xl">
              Our AI specialists are available 24/7 for virtual assessments and guidance.
            </p>
            <button 
              onClick={() => navigate('/voice-assistant')}
              className="px-12 py-5 bg-white text-primary rounded-3xl font-bold text-lg shadow-xl hover:scale-105 transition-all"
            >
              Start AI Consultation
            </button>
          </div>
          <div className="w-48 h-48 bg-white/10 rounded-[3rem] backdrop-blur-md flex items-center justify-center relative z-10 border border-white/20">
            <Video className="w-24 h-24 text-white/40" />
          </div>
        </section>
      </main>
    </div>
  );
}
