import React, { useState } from 'react';
import { User, updateProfile } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, CheckCircle, Loader2, Sparkles } from 'lucide-react';

interface ProfileSetupProps {
  address: string;
  onComplete: (user: User) => void;
}

export default function ProfileSetup({ address, onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const colors = ['#0f172a', '#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a name or organization title.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const profile = await updateProfile({
        address,
        name,
        bio,
        avatarColor: selectedColor
      });
      onComplete(profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-[3rem] w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="p-10 space-y-8">
          <div className="space-y-4">
             <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
             </div>
             <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Identity Configuration</h2>
             <p className="text-slate-500 font-medium">Define your cryptographic alias and professional bio for the ledger registry.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Display Name / Organization</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Parineetha Narayan"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Global Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Architect of decentralized solutions..."
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold resize-none"
              />
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Identity Color Accent</label>
              <div className="flex gap-4">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-10 h-10 rounded-full transition-transform border-4 ${selectedColor === c ? 'border-slate-100 scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest">{error}</p>}

            <button
              disabled={loading}
              className="w-full bg-slate-900 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-slate-900/20 active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Establish My Identity
                  <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
