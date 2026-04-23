import React from 'react';
import { Shield, LayoutDashboard, PlusCircle, Search, Wallet, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { User } from '../lib/api';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  walletAddress: string | null;
  user: User | null;
  onConnect: () => void;
  onLogout?: () => void;
  onUseDemo?: () => void;
  isConnecting?: boolean;
  connectionError?: string | null;
}

export default function Layout({ 
  children, 
  activeTab, 
  setActiveTab, 
  walletAddress, 
  user,
  onConnect,
  onLogout,
  onUseDemo,
  isConnecting,
  connectionError
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Navbar / Header */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div 
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveTab('home')}
            >
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg">IP</div>
              <h1 className="text-xl font-bold tracking-tight font-heading text-slate-900">
                Registry <span className="text-slate-400 font-medium">Protocol</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { id: 'register', label: 'Register' },
                { id: 'verify', label: 'Verify' },
                { id: 'dashboard', label: 'Dashboard' },
                { id: 'transactions', label: 'Transactions' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-5 flex items-center gap-2 text-sm font-semibold transition-all ${
                    activeTab === item.id 
                    ? 'text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                    />
                  )}
                </button>
              ))}
              {!walletAddress && (
                <button
                  onClick={() => setActiveTab('login')}
                  className={`relative py-5 flex items-center gap-2 text-sm font-semibold transition-all ${
                    activeTab === 'login' 
                    ? 'text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Log In
                  {activeTab === 'login' && (
                    <motion.div 
                      layoutId="nav-pill"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
                    />
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {connectionError && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 shadow-sm">
                      <AlertCircle className="w-3 h-3" />
                      <span className="hidden sm:inline">Connection Failed</span>
                      <span className="sm:hidden">Error</span>
                    </div>
                    {onUseDemo && (
                      <button 
                        onClick={onUseDemo}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                      >
                        Demo Mode
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {walletAddress ? (
                <div className="flex items-center gap-3 bg-slate-100 px-4 py-1.5 rounded-2xl border border-slate-200 group relative">
                  <div className="flex items-center gap-3 transition-opacity group-hover:opacity-10">
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: user?.avatarColor || '#0f172a' }}
                    >
                      {user?.name.slice(0, 2).toUpperCase() || 'WT'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 leading-none mb-0.5">{user?.name || 'Authorized Node'}</span>
                      <span className="text-[9px] font-mono font-bold text-slate-400">
                        {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                  </div>
                  
                  {onLogout && (
                    <button 
                      onClick={onLogout}
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[10px] font-black text-red-500 uppercase tracking-widest cursor-pointer"
                    >
                      Terminate Session
                    </button>
                  )}
                </div>
              ) : (
                <motion.button
                  disabled={isConnecting}
                  whileHover={isConnecting ? {} : { scale: 1.02 }}
                  whileTap={isConnecting ? {} : { scale: 0.98 }}
                  onClick={onConnect}
                  className={`relative z-10 bg-slate-900 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-md flex items-center gap-2 group cursor-pointer ${
                    isConnecting ? 'opacity-70 cursor-wait' : 'hover:bg-slate-800'
                  }`}
                >
                  {isConnecting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wallet className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  )}
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full font-sans">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Stellar Network</span>
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span className="text-sm font-medium text-slate-600">Soroban Testnet v20</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Documentation</a>
            <a href="#" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Explorer</a>
            <span className="text-sm text-slate-400">© 2026 IP Registry</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
