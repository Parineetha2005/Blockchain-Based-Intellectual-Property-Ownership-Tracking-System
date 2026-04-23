import React from 'react';
import { ArrowRight, ShieldCheck, FileKey, History, Cpu, Database, Network, Code2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home({ onStart }: { onStart: () => void }) {
  const scrollToInfrastructure = () => {
    const el = document.getElementById('infrastructure');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col gap-20 py-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-12 md:p-24 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(51,65,85,0.4),transparent)]" />
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/10 mb-8">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-widest font-bold">Protocol v2.0 Live</span>
            </div>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight font-heading mb-8 leading-[1.1]">
              Secure your <br />
              <span className="text-slate-400">Intellectual Capital.</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 max-w-xl font-medium leading-relaxed">
              Verify the origin and ownership of your original concepts using immutable cryptographic proofs anchored on the Stellar blockchain.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={onStart}
                className="bg-white text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-lg flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={scrollToInfrastructure}
                className="bg-transparent border border-white/20 px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all text-white"
              >
                View Infrastructure
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Markers */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 px-4">
        {[
          { label: "Network", value: "Stellar Soroban" },
          { label: "Security", value: "SHA-256 Hashing" },
          { label: "Latency", value: "~5s Settlement" },
          { label: "Compliance", value: "Tamper Proof" },
        ].map((marker, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">{marker.label}</span>
            <span className="text-lg font-bold text-slate-800 font-heading">{marker.value}</span>
          </div>
        ))}
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { 
            icon: ShieldCheck, 
            title: "Cryptographic Integrity", 
            desc: "Your data is hashed locally using enterprise-grade SHA-256, ensuring your concepts remain private while proving their existence." 
          },
          { 
            icon: FileKey, 
            title: "On-Chain Settlement", 
            desc: "Proofs are anchored permanently to the Stellar ledger, providing a globally accessible, immutable record of ownership." 
          },
          { 
            icon: History, 
            title: "Verification Engine", 
            desc: "Instantly verify any registered asset by its hash, retrieving the original owner and precise timestamp of record." 
          }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6">
            <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
              <item.icon className="w-6 h-6 text-slate-700" />
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 font-heading">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Project Overview / Abstract */}
      <section className="bg-slate-50 p-12 md:p-20 rounded-[3rem] border border-slate-100 flex flex-col md:flex-row gap-16 items-center">
        <div className="md:w-1/2 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-slate-200">
             <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500 italic">Project Phase: Final Evaluation</span>
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 font-heading leading-tight">
            Decentralized Integrity <br /> Verification Framework
          </h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            This project explores the intersection of asymmetric cryptography and decentralized consensus to solve the problem of intellectual property theft and unauthorized disclosure. By utilizing the <strong>SHA-256 algorithm</strong> and <strong>Soroban Smart Contracts</strong> on the Stellar network, we provide a mathematically verifiable "Proof of Existence" without exposing sensitive technical data.
          </p>
          <div className="flex gap-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Algorithm</p>
              <p className="text-lg font-bold text-slate-900 font-mono italic">SHA-256</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Settlement</p>
              <p className="text-lg font-bold text-slate-900 font-mono italic">Stellar v20</p>
            </div>
            <div className="w-px h-10 bg-slate-200" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Architecture</p>
              <p className="text-lg font-bold text-slate-900 font-mono italic">E2E-Proof</p>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          <div className="h-64 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-end gap-3 group hover:border-slate-400 transition-all">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold italic">01</div>
            <p className="font-bold text-slate-900 font-heading">Data Ingestion</p>
            <p className="text-[11px] text-slate-500 font-medium">Capture intellectual assets and technical metadata.</p>
          </div>
          <div className="h-64 bg-slate-900 rounded-3xl p-6 flex flex-col justify-end gap-3 translate-y-8 shadow-2xl">
            <div className="w-10 h-10 bg-white text-slate-900 rounded-xl flex items-center justify-center font-bold italic">02</div>
            <p className="font-bold text-white font-heading">Hashing Layer</p>
            <p className="text-[11px] text-slate-400 font-medium">Asynchronous SHA-256 generation for content masking.</p>
          </div>
          <div className="h-64 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col justify-end gap-3 translate-x-4 group hover:border-slate-400 transition-all">
            <div className="w-10 h-10 bg-slate-100 text-slate-900 rounded-xl flex items-center justify-center font-bold italic">03</div>
            <p className="font-bold text-slate-900 font-heading">Ledger Anchor</p>
            <p className="text-[11px] text-slate-500 font-medium">Anchor proofs to public blockchain via Soroban RPC.</p>
          </div>
          <div className="h-64 bg-slate-100/50 rounded-3xl border border-slate-200 p-6 flex flex-col justify-end gap-3 translate-y-8 group hover:border-slate-400 transition-all">
            <div className="w-10 h-10 bg-slate-300 text-white rounded-xl flex items-center justify-center font-bold italic">04</div>
            <p className="font-bold text-slate-900 font-heading">Public Audit</p>
            <p className="text-[11px] text-slate-500 font-medium">Transparent verification for any stakeholder worldwide.</p>
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section id="infrastructure" className="mt-10 py-20 border-t border-slate-200">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 font-heading mb-4">Technical Infrastructure</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            A deep dive into the cryptographic and decentralized stack powering the Registry Protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: Cpu,
              title: "Soroban Smart Contracts",
              desc: "Next-gen WASM-based smart contracts on Stellar manage the registry lifecycle, ensuring high-performance execution and deterministic outcomes."
            },
            {
              icon: Network,
              title: "Stellar Consensus Protocol",
              desc: "Utilizing the SCP for fast, decentralized settlement with low carbon footprint and predictable transaction costs."
            },
            {
              icon: Database,
              title: "SHA-256 Hashing Engine",
              desc: "Client-side hashing ensures your raw ideas never leave your machine. Only the cryptographic fingerprint is moved on-chain."
            },
            {
              icon: Code2,
              title: "Horizon & RPC Nodes",
              desc: "Direct integration via Soroban RPC and Horizon API for real-time ledger synchronization and state verification."
            }
          ].map((item, i) => (
            <div key={i} className="flex gap-6 p-8 bg-slate-100/50 rounded-3xl border border-slate-200 shadow-sm">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                <item.icon className="w-7 h-7 text-slate-900" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold text-slate-900 font-heading">{item.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
