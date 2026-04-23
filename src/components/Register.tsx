import React, { useState } from 'react';
import { generateHash } from '../lib/stellar';
import { registerIdea, User as UserProfile } from '../lib/api';
import { CheckCircle, AlertCircle, Copy, Loader2, Sparkles, PlusCircle, ExternalLink, ShieldCheck, FileKey, Wallet, CreditCard, Banknote, DollarSign, Shield, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Register({ 
  walletAddress, 
  user,
  onConnect,
  onUseDemo,
  isConnecting,
  connectionError 
}: { 
  walletAddress: string | null; 
  user: UserProfile | null;
  onConnect: () => void;
  onUseDemo?: () => void;
  isConnecting?: boolean;
  connectionError?: string | null;
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('AI/ML');
  const [version, setVersion] = useState('1.0.0');
  const [licenseType, setLicenseType] = useState('Proprietary');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      setError('Wallet authentication required. Please connect your Freighter wallet to verify ownership.');
      return;
    }
    setError(null);
    setShowPayment(true);
  };

  const confirmRegistration = async () => {
    setIsPaying(true);
    
    // Simulate payment transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setHasPaid(true);
    setIsPaying(false);
    setLoading(true);

    const hash = generateHash(`${title}${description}${category}${version}`);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
    
    try {
      // In this version, we simulate the Stellar network consensus ID
      const mockTxId = `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const mockPayId = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      
      const res = await registerIdea({
        title,
        description,
        hash,
        owner: walletAddress!,
        transactionId: mockTxId,
        category,
        version,
        licenseType,
        tags,
        feePaid: 10,
        paymentId: mockPayId
      });

      setResult(res);
      setTitle('');
      setDescription('');
      setTagsInput('');
      setShowPayment(false);
      setHasPaid(false);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registry submission.');
      setShowPayment(false);
      setHasPaid(false);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = () => {
    if (result?.hash) {
      navigator.clipboard.writeText(result.hash);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Information Sidebar */}
        <div className="lg:w-5/12 space-y-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Step 01 / Registration</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight font-heading text-slate-900 leading-tight">
              Submit your <br />Intellectual Assets
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Manifest your original concepts on-chain. Our protocol ensures your ideas are cryptographically anchored while maintaining full ownership sovereignty.
            </p>
          </div>

          <div className="space-y-6 pt-10 border-t border-slate-200">
            {[
              { icon: ShieldCheck, title: "SHA-256 Hashing", desc: "Proprietary hashing ensures content remains private." },
              { icon: FileKey, title: "Soroban Anchor", desc: "Records are permanently etched into the Stellar ledger." },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <step.icon className="w-6 h-6 text-slate-700" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base tracking-tight font-heading">{step.title}</h4>
                  <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="lg:w-7/12">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                onSubmit={handleSubmit} 
                className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-10"
              >
                <div className="space-y-8">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Project Title</label>
                      <div className="flex gap-4">
                        <button 
                          type="button"
                          onClick={() => {
                            setTitle('Quantum Encryption Overlay');
                            setDescription('A layer-3 protocol for secondary encryption of sensitive satellite telemetry data using quantum-resistant algorithms.');
                            setCategory('Cybersecurity');
                            setVersion('1.0.1');
                            setLicenseType('GPL-3.0');
                            setTagsInput('Quantum, Security, Encryption');
                          }}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                        >
                          Fill Security Seed
                        </button>
                        <button 
                          type="button"
                          onClick={() => {
                            setTitle('Eco-Mesh Solar Grid');
                            setDescription('Decentralized mesh networking protocol for low-power solar array synchronization in off-grid rural environments.');
                            setCategory('Renewable Energy');
                            setVersion('1.2.0');
                            setLicenseType('Apache-2.0');
                            setTagsInput('Solar, Mesh, IoT');
                          }}
                          className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest"
                        >
                          Fill Green Seed
                        </button>
                      </div>
                    </div>
                    <input
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Neural Link Optimization"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Field / Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold appearance-none cursor-pointer"
                      >
                        {['AI/ML', 'Blockchain', 'Cybersecurity', 'Renewable Energy', 'Healthcare', 'General'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Asset Version</label>
                      <input
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="e.g. 1.0.0"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Initial Licensing</label>
                      <select
                        value={licenseType}
                        onChange={(e) => setLicenseType(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold appearance-none cursor-pointer"
                      >
                        {['Proprietary', 'MIT', 'Apache-2.0', 'GPL-3.0', 'Creative Commons'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Tags (comma separated)</label>
                      <input
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        placeholder="Security, AI, Cloud"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">Innovation Description</label>
                    <textarea
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the architectural bounds and unique functionality..."
                      rows={5}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-semibold resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 group-hover:scale-110 transition-transform duration-500" />
                    <div className="relative z-10 space-y-4">
                      {user && (
                        <div className="flex items-center gap-2 mb-6 p-2 rounded-xl bg-white/5 border border-white/10 w-fit">
                          <div 
                            className="w-5 h-5 rounded-md shadow-sm border border-white/20 shrink-0"
                            style={{ backgroundColor: user.avatarColor || '#e2e8f0' }}
                          />
                          <span className="text-[10px] font-black text-white/50 uppercase tracking-widest whitespace-nowrap">
                            Authorizing as <span className="text-white">{user.name}</span>
                          </span>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50 block mb-4">Cryptographic Identity (SHA-256)</span>
                        <code className="text-xs font-mono break-all leading-relaxed whitespace-pre-wrap text-emerald-400">
                          {generateHash(`${title}${description}`) || 'Awaiting entry content...'}
                        </code>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    disabled={loading || !walletAddress}
                    type="submit"
                    className={`w-full h-18 rounded-2xl font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-4 transition-all ${
                      loading || !walletAddress 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-900 text-white hover:bg-slate-800 shadow-2xl shadow-slate-900/20 active:scale-[0.98]'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Anchor to Stellar Ledger
                      </>
                    )}
                  </button>
                  
                  {!walletAddress && (
                    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-4">
                      <div className="space-y-1">
                        <p className="text-xs font-extrabold text-amber-800 uppercase tracking-widest">Authenticity Required</p>
                        <p className="text-xs text-amber-700 font-medium opacity-80 italic">Connect your wallet to sign this registration.</p>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button
                          type="button"
                          disabled={isConnecting}
                          onClick={onConnect}
                          className={`relative z-10 bg-amber-600 text-white px-6 py-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 w-full cursor-pointer ${
                            isConnecting ? 'opacity-70 cursor-wait' : 'hover:bg-amber-700'
                          }`}
                        >
                          {isConnecting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Wallet className="w-4 h-4" />
                          )}
                          {isConnecting ? 'Authenticating...' : 'Connect Freighter Wallet'}
                        </button>
                        
                        {onUseDemo && (
                          <button
                            type="button"
                            onClick={onUseDemo}
                            className="text-[10px] font-bold text-amber-800 hover:text-amber-950 bg-amber-100/50 hover:bg-amber-100 py-2 rounded-lg transition-all cursor-pointer border border-amber-200/50"
                          >
                            Skip to Demo Mode
                          </button>
                        )}
                      </div>
                      
                      {connectionError && (
                        <div className="space-y-4">
                          <p className="text-[10px] text-red-500 font-bold bg-white/50 py-1 rounded-lg">
                            Error: {connectionError}
                          </p>
                          {window.self !== window.top && (
                            <p className="text-[10px] text-slate-500 font-medium">
                              Tip: If the wallet popup isn't appearing, try opening the app in a new tab.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-12 md:p-16 rounded-[3rem] border border-slate-200 shadow-2xl shadow-slate-200/50 text-center flex flex-col items-center gap-12"
              >
                <div className="w-28 h-28 bg-emerald-50 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                  <CheckCircle className="w-14 h-14 text-emerald-500" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-extrabold tracking-tight font-heading text-slate-900">Registration Complete</h3>
                  <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Verified: {new Date().toLocaleString()}</p>
                </div>

                <div className="w-full space-y-8">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 text-left relative group">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-4 block italic">Digital Fingerprint</span>
                    <div className="flex items-center gap-6">
                      <code className="text-[13px] font-mono font-bold text-slate-700 bg-white px-6 py-4 rounded-2xl border border-slate-200 w-full truncate shadow-inner">
                        {result.hash}
                      </code>
                      <button onClick={copyHash} className="p-4 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 group-hover:border-slate-400">
                        <Copy className="w-5 h-5 text-slate-600" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 bg-slate-900 p-6 rounded-3xl text-white text-left flex justify-between items-center shadow-xl">
                       <div className="flex flex-col">
                         <span className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Transaction Proof</span>
                         <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest">{result.transactionId}</span>
                       </div>
                       <ExternalLink className="w-4 h-4 opacity-40 font-bold" />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setResult(null)}
                  className="px-10 py-4 bg-slate-100 text-slate-900 rounded-2xl font-extrabold hover:bg-slate-200 transition-all text-sm uppercase tracking-widest"
                >
                  New Registration
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {showPayment && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPaying && setShowPayment(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <DollarSign className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Protocol Fee</span>
                    <span className="text-2xl font-black text-slate-900 tracking-tight font-heading">10.00 XLM</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight font-heading leading-tight">
                    Confirm Ledger <br />Settlement Payment
                  </h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    A small network fee is required to anchor your intellectual asset to the Stellar Blockchain. This covers consensus overhead and permanent storage on the global ledger.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Asset</span>
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">{title}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Source Account</span>
                    <span className="text-xs font-mono font-bold text-slate-600">{walletAddress?.slice(0, 8)}...</span>
                  </div>
                  <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Total Processing Cost</span>
                    <span className="text-lg font-black text-emerald-600">10.00 XLM</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={isPaying}
                    onClick={() => setShowPayment(false)}
                    className="py-4 rounded-xl border border-slate-200 text-xs font-extrabold uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    Abort
                  </button>
                  <button
                    disabled={isPaying}
                    onClick={confirmRegistration}
                    className="py-4 bg-slate-900 text-white rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-xl flex items-center justify-center gap-3 hover:bg-slate-800 disabled:bg-slate-400 transition-all"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm & Pay
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isPaying && (
                <div className="bg-emerald-600 p-3 text-center">
                   <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                     <Clock className="w-3 h-3 animate-pulse" />
                     Waiting for Stellar Network Approval
                   </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
