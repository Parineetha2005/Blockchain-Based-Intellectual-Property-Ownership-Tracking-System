import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Wallet, ArrowRight, Loader2, Sparkles, AlertCircle, Key, Cpu, Network } from 'lucide-react';

interface AuthProps {
  onConnect: () => void;
  onUseDemo: () => void;
  isConnecting: boolean;
  error: string | null;
}

export default function Auth({ onConnect, onUseDemo, isConnecting, error }: AuthProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-slate-900/40">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none italic">
            Welcome to <br />
            <span className="text-slate-400 not-italic">the Registry.</span>
          </h2>
          <p className="text-slate-500 font-medium">
            {mode === 'login' 
              ? "Access your cryptographic laboratory and ledger records." 
              : "Initialize your identity on the Stellar consensus network."}
          </p>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 space-y-8">
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Initialize Node
            </button>
          </div>

          <div className="space-y-4">
            <button
              onClick={onConnect}
              disabled={isConnecting}
              className="w-full flex items-center justify-between px-6 py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] group hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
            >
              <div className="flex items-center gap-4">
                {isConnecting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                <span>{mode === 'login' ? 'Auth with Freighter' : 'Link Your Wallet'}</span>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onUseDemo}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-100 text-slate-400 rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:border-slate-300 hover:text-slate-600 transition-all"
            >
              <Key className="w-4 h-4" />
              Demo Access Mode
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest leading-tight">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-50">
             <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-indigo-50 text-indigo-500">
                   <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Soroban</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-500">
                   <Network className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Chainlink</span>
             </div>
             <div className="flex flex-col items-center gap-1">
                <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                   <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">V2 Protocol</span>
             </div>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          Secured by Asymmetric Cryptography & Distributed Consensus
        </p>
      </motion.div>
    </div>
  );
}
