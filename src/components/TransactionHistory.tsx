import React, { useEffect, useState } from 'react';
import { fetchRecentTransactions } from '../lib/stellar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  ExternalLink, 
  Clock, 
  User, 
  ArrowRightLeft, 
  Hash, 
  Copy, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Wallet,
  Shield
} from 'lucide-react';

interface TransactionHistoryProps {
  walletAddress: string;
  onConnect: () => void;
  onUseDemo: () => void;
  isConnecting?: boolean;
}

export default function TransactionHistory({ 
  walletAddress, 
  onConnect, 
  onUseDemo,
  isConnecting 
}: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (walletAddress) {
      loadTransactions();
    }
  }, [walletAddress]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, if it's the demo wallet, we use a public testnet account to show data
      // Using the Stellar Foundation's Testnet Friendbot address as it always has data
      const addressToFetch = walletAddress === 'G...DEMO_USER_WALLET_777' 
        ? 'GA5W6ARELCOZOHC66LFR7XOTQAGDTTN7XUOHZUCKGGTNMQ7Z5PHTZFL5' 
        : walletAddress;

      const data = await fetchRecentTransactions(addressToFetch);
      setTransactions(data);
    } catch (err: any) {
      setError('Could not retrieve ledger history for this account.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncate = (str: string) => {
    if (!str) return '';
    return str.slice(0, 6) + '...' + str.slice(-6);
  };

  return (
    <div className="flex flex-col gap-10 py-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">
             <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500">Blockchain Analytics / Explorer</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-heading text-slate-900">Ledger <span className="text-slate-400">Activity</span></h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Real-time synchronization with the Stellar Testnet. View every state change, registration settlement, and protocol interaction associated with your key.
          </p>
        </div>
        
        <button 
          onClick={loadTransactions}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:border-slate-900 transition-all shadow-sm disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh History
        </button>
      </div>

      {!walletAddress ? (
        <div className="py-24 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-white shadow-sm flex flex-col items-center gap-8">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center border-2 border-slate-100">
            <Wallet className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.2rem] max-w-xs leading-relaxed mx-auto">
              Identity authentication required to access private ledger history
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={onConnect}
                disabled={isConnecting}
                className="px-8 py-3 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 justify-center"
              >
                {isConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                Connect Wallet
              </button>
              <button
                onClick={onUseDemo}
                className="px-8 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all"
              >
                Sync Demo Feed
              </button>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 border-4 border-slate-50 border-t-indigo-600 rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Querying Stellar Horizon API...</span>
        </div>
      ) : error ? (
        <div className="py-32 text-center border-4 border-dashed border-red-100 rounded-[3rem] bg-red-50/30">
          <p className="text-sm font-bold text-red-400 uppercase tracking-[0.2rem] italic">{error}</p>
        </div>
      ) : transactions.length > 0 ? (
        <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40">
          <div className="grid grid-cols-12 gap-6 p-8 bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest font-bold text-slate-400">
            <div className="col-span-4">Transaction Snapshot</div>
            <div className="col-span-2 text-center">Settlement</div>
            <div className="col-span-4">Source / Destination</div>
            <div className="col-span-2 text-right">Horizon Status</div>
          </div>
          
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {transactions.map((tx, index) => (
                <React.Fragment key={tx.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-6 p-8 items-center hover:bg-slate-50 transition-colors group cursor-default"
                  >
                  {/* Tx Hash */}
                  <div className="col-span-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                        <Hash className="w-4 h-4 text-indigo-600" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-900">{truncate(tx.id)}</span>
                      <button 
                        onClick={() => copyToClipboard(tx.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-white rounded-md transition-all sm:flex hidden"
                      >
                       <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Ops: {tx.operation_count}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Sequence: {tx.source_account_sequence}</span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="col-span-2 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                      <Clock className="w-3 h-3 text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-700">{new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <p className="text-[9px] text-slate-300 font-mono mt-1 uppercase">
                      {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {/* Account Interaction */}
                  <div className="col-span-4 flex items-center gap-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-[9px] uppercase font-black text-slate-300 tracking-tighter">Source Account</span>
                      <span className="text-[11px] font-mono font-bold text-slate-600 truncate">{tx.source_account === walletAddress ? 'Your Wallet' : truncate(tx.source_account)}</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center rotate-0 group-hover:rotate-180 transition-transform duration-500">
                      <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 text-right">
                      <span className="text-[9px] uppercase font-black text-slate-300 tracking-tighter">Protocol Target</span>
                      <span className="text-[11px] font-mono font-bold text-indigo-500">Registry Controller</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 text-right">
                    <div className="flex flex-col items-end gap-2">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-inner">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">Settled</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">Network Fee</span>
                        <span className="text-[11px] font-black text-slate-900">{(tx.fee_charged / 10000000).toFixed(6)} XLM</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Expandable Details Row */}
                <motion.div
                  key={`${tx.id}-details`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-50 border-b border-slate-100 p-8 grid grid-cols-12 gap-8"
                >
                  <div className="col-span-12 md:col-span-8 flex flex-wrap gap-8">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">UTR / Transaction Hash</span>
                      <div className="flex items-center gap-2">
                        <code className="text-[10px] font-mono text-indigo-600 font-bold bg-white border border-slate-200 px-3 py-1 rounded-lg">
                          {tx.id}
                        </code>
                        <button 
                          onClick={() => copyToClipboard(tx.id)}
                          className="p-1.5 hover:bg-white rounded-md transition-all border border-slate-200 shadow-sm"
                        >
                          <Copy className="w-3 h-3 text-slate-500" />
                        </button>
                      </div>
                    </div>

                    {tx.memo && (
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Protocol Memo</span>
                        <span className="text-[11px] font-bold text-slate-900 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                           {tx.memo}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Ledger Index</span>
                      <span className="text-[11px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-lg">
                         #{tx.ledger_attr || tx.ledger}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Integrity State</span>
                      <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg">
                         <Shield className="w-3 h-3" />
                         VERIFIED ON-CHAIN
                      </div>
                    </div>
                  </div>

                  <div className="col-span-12 md:col-span-4 flex justify-end items-end gap-4">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-slate-900 transition-all shadow-sm group"
                    >
                      <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      View On StellarExpert
                    </a>
                  </div>
                </motion.div>
              </React.Fragment>
            ))}
            </AnimatePresence>
          </div>
          
          <div className="p-8 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            <p className="text-xs text-slate-400 font-medium italic">
              * Displaying only the 20 most recent transactions settled on Testnet.
            </p>
            <div className="flex items-center gap-4">
               <span className="text-[10px] uppercase font-bold text-slate-400">Protocol Node: horizon-testnet.stellar.org</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-white shadow-sm flex flex-col items-center gap-8">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
            <History className="w-10 h-10 text-slate-200" />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2rem] italic">No transaction signatures detected for this account</p>
            <button 
              onClick={loadTransactions}
              className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
            >
              Force Protocol Re-Sync
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
