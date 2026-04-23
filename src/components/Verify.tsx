import React, { useState } from 'react';
import { verifyIdea } from '../lib/api';
import { Search, Loader2, XCircle, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Verify() {
  const [hashInput, setHashInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hashInput.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const data = await verifyIdea(hashInput.trim());
      setResult(data);
    } catch (error) {
      console.error(error);
      setResult({ found: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
           <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Step 02 / Identity Verification</span>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight font-heading text-slate-900 leading-tight">
          Blockchain Validation <span className="text-slate-400">Node</span>
        </h1>
        <p className="text-slate-500 font-medium max-w-2xl">
          Instantly audit the intellectual registry to verify ownership and timestamp integrity using the asset's cryptographic fingerprint.
        </p>
      </div>

      <form onSubmit={handleVerify} className="relative mb-20 group">
        <div className="absolute inset-0 bg-slate-900/5 rounded-[2rem] blur-xl group-focus-within:bg-slate-900/10 transition-all opacity-0 group-focus-within:opacity-100" />
        <input
          value={hashInput}
          onChange={(e) => setHashInput(e.target.value)}
          placeholder="Enter SHA-256 asset hash..."
          className="relative w-full bg-white border border-slate-200 rounded-[2rem] pl-10 pr-52 py-7 text-sm font-mono focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-300 shadow-xl shadow-slate-200/40"
        />
        <button
          disabled={loading}
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white h-14 px-10 text-xs uppercase tracking-widest font-extrabold hover:bg-slate-800 transition-all disabled:bg-slate-200 rounded-[1.5rem] flex items-center gap-3"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-4 h-4" />
              Verify Record
            </>
          )}
        </button>
      </form>

      <AnimatePresence>
        {hasSearched && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-10"
          >
            {result?.found ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: "Verification Status", value: "Verified Ledger Match", accent: "text-emerald-600" },
                    { label: "Settlement Time", value: new Date(result.timestamp).toLocaleDateString() },
                    { label: "Network Proof", value: "Consensus Valid" },
                    { label: "Asset Category", value: result.category || 'General' },
                    { label: "Current Version", value: `v${result.version || '1.0.0'}` },
                    { label: "Licensing Model", value: result.licenseType || 'Proprietary' }
                  ].map((stat, i) => (
                    <div key={i} className="p-8 border border-slate-200 rounded-3xl bg-white shadow-sm">
                      <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-4 font-bold">{stat.label}</p>
                      <p className={`text-xl font-bold font-heading ${stat.accent || 'text-slate-900'}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-slate-200/50 flex flex-col gap-8">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2 w-full md:w-3/5">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 block italic">Registered Owner Key</span>
                      <div className="text-xs font-mono text-slate-700 bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 break-all shadow-inner font-bold">
                        {result.owner}
                      </div>
                    </div>
                    <div className="text-right w-full md:w-auto">
                      <p className="text-[10px] uppercase text-slate-400 mb-1 font-bold">Asset Reference</p>
                      <p className="text-2xl font-extrabold font-heading text-slate-900 tracking-tight leading-tight">{result.title}</p>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-slate-100 flex justify-between items-center bg-slate-50 -m-10 mt-2 px-10 py-6 rounded-b-[2.5rem]">
                     <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Integrity Signature: SECURE</span>
                     <button className="flex items-center gap-2 text-xs font-bold text-slate-900 hover:underline">
                        Stellar Expert Proof <ExternalLink className="w-4 h-4" />
                     </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 p-24 rounded-[3rem] bg-white text-center space-y-8 shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                  <XCircle className="text-slate-300 w-12 h-12" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-extrabold font-heading text-slate-900">Record Not Found</h3>
                  <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed font-semibold">
                    The provided fingerprint does not correlate with any verified digital twin in the global ledger.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
