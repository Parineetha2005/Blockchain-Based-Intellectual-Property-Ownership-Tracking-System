import React, { useEffect, useState, useMemo } from 'react';
import { fetchIdeas, fetchProfile, Idea, User as UserProfile } from '../lib/api';
import { Search, Hash, Clock, User, Copy, ExternalLink, Loader2, PieChart as PieIcon, BarChart3, TrendingUp, Shield, Activity, Database, Library, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  AreaChart,
  Area,
  Line
} from 'recharts';

const COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

export default function Dashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [profiles, setProfiles] = useState<Record<string, UserProfile>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const data = await fetchIdeas();
      setIdeas(data);
      
      // Fetch profiles for all unique owners
      const owners = [...new Set(data.map(i => i.owner))];
      const profileMap: Record<string, UserProfile> = {};
      
      await Promise.all(owners.map(async (addr) => {
        try {
          const p = await fetchProfile(addr);
          if (p) profileMap[addr] = p;
        } catch (e) {
          // Profile not found, skip
        }
      }));
      setProfiles(profileMap);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredIdeas = Array.isArray(ideas) ? ideas.filter(idea => 
    idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    idea.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (idea.category && idea.category.toLowerCase().includes(searchTerm.toLowerCase()))
  ) : [];

  // Data processing for charts
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    ideas.forEach(idea => {
      const cat = idea.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [ideas]);

  const licenseData = useMemo(() => {
    const counts: Record<string, number> = {};
    ideas.forEach(idea => {
      const lic = idea.licenseType || 'Proprietary';
      counts[lic] = (counts[lic] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [ideas]);

  const registrationVelocity = useMemo(() => {
    const dailyCounts: Record<string, number> = {};
    // Get last 30 days
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      dailyCounts[key] = 0;
    }

    ideas.forEach(idea => {
      const dateKey = new Date(idea.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      if (dailyCounts[dateKey] !== undefined) {
        dailyCounts[dateKey]++;
      }
    });

    return Object.entries(dailyCounts).map(([name, value]) => ({ name, value }));
  }, [ideas]);

  const stats = useMemo(() => {
    return {
      total: ideas.length,
      categories: new Set(ideas.map(i => i.category || 'General')).size,
      licenses: new Set(ideas.map(i => i.licenseType || 'Proprietary')).size,
      totalFees: ideas.reduce((acc, curr) => acc + (curr.feePaid || 0), 0),
      latest: ideas.length > 0 ? ideas[0].title : 'None'
    };
  }, [ideas]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-12 py-4">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
             <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Analytics Dashboard / Node Feed</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight font-heading text-slate-900">Protocol <span className="text-slate-400">Intelligence</span></h1>
        </div>
        
        <div className="relative w-full md:w-96 group">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by title, hash, owner, or category..."
            className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all placeholder:text-slate-300 text-slate-900 shadow-sm"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4 group-focus-within:text-slate-900 transition-colors" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Registrations', value: stats.total, icon: Database, color: 'text-slate-900' },
          { label: 'Active Categories', value: stats.categories, icon: Activity, color: 'text-indigo-600' },
          { label: 'License Schemes', value: stats.licenses, icon: Shield, color: 'text-emerald-600' },
          { label: 'Settlement Fees', value: `${stats.totalFees} XLM`, icon: DollarSign, color: 'text-amber-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center">
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Verified</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
              <h4 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h4>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visualizations Area */}
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Registration Velocity (30D)
            </h3>
            <div className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              On-Chain Activity Feed
            </div>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={registrationVelocity}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} 
                  interval={4}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0f172a" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-500" />
              Asset Distribution by Sector
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-500" />
              Licensing Model Breakdown
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={licenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}
                />
                <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 gap-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="w-12 h-12 border-4 border-slate-50 border-t-slate-900 rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold">Synchronizing with Stellar Node</span>
            </div>
          ) : filteredIdeas.length > 0 ? (
            <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/40">
              <div className="grid grid-cols-12 gap-6 p-8 bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-widest font-bold text-slate-400">
                <div className="col-span-12 md:col-span-5">Technical Asset Entity</div>
                <div className="col-span-12 md:col-span-2">Categorization</div>
                <div className="col-span-12 md:col-span-3">Hash Signature</div>
                <div className="col-span-12 md:col-span-2 text-right">Settlement</div>
              </div>
              
              <div className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredIdeas.map((idea, index) => (
                    <motion.div
                      key={idea._id || index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="grid grid-cols-12 gap-6 p-8 items-center hover:bg-slate-50 transition-colors group cursor-default"
                    >
                      <div className="col-span-12 md:col-span-5 flex items-start gap-4">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors flex-shrink-0">
                          <Library className="w-5 h-5 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-bold text-slate-900 transition-colors tracking-tight font-heading">{idea.title}</h3>
                            <span className="text-[9px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase">v{idea.version || '1.0.0'}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div 
                              className="w-4 h-4 rounded-md shadow-sm border border-white/20 shrink-0"
                              style={{ backgroundColor: profiles[idea.owner]?.avatarColor || '#e2e8f0' }}
                            />
                            <p className="text-[10px] text-slate-400 font-mono transition-opacity truncate max-w-[200px]">
                              Owner: <span className="text-slate-900 font-bold">{profiles[idea.owner]?.name || idea.owner}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-2">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 group-hover:bg-white group-hover:border-slate-300 transition-all">
                          <Activity className="w-3 h-3 text-indigo-500" />
                          {idea.category || 'General'}
                        </span>
                      </div>
                      
                      <div className="col-span-12 md:col-span-3 flex items-center gap-3 overflow-hidden">
                        <code className="text-xs font-mono text-slate-400 truncate max-w-full group-hover:text-slate-600 transition-colors bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          {idea.hash}
                        </code>
                        <button 
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(idea.hash); }} 
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-white rounded-xl border border-slate-200 transition-all shadow-sm active:scale-95 flex-shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                      
                      <div className="col-span-12 md:col-span-2 text-right">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {new Date(idea.timestamp).toLocaleDateString()}
                        </p>
                        <p className="text-[9px] text-slate-300 font-mono mt-0.5 uppercase">
                          {new Date(idea.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      
                      <div className="col-span-12 mt-4 pt-6 border-t border-slate-100 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all h-0 overflow-hidden group-hover:h-auto group-hover:mb-2">
                         <div className="flex flex-wrap items-center gap-8 md:gap-12">
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-slate-300 tracking-tighter">Ledger Proof</span>
                              <span className="text-xs font-mono text-emerald-600 font-bold uppercase tracking-widest">{idea.transactionId}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-slate-300 tracking-tighter">License Scheme</span>
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{idea.licenseType || 'Proprietary'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-slate-300 tracking-tighter">Technical Tags</span>
                              <div className="flex gap-2">
                                {idea.tags && idea.tags.length > 0 ? idea.tags.slice(0, 3).map((tag, i) => (
                                  <span key={i} className="text-[8px] font-black text-indigo-400 uppercase tracking-tighter border border-indigo-100 px-1.5 py-0.5 rounded">{tag}</span>
                                )) : <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">NONE</span>}
                              </div>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-slate-300 tracking-tighter">Settlement Fee</span>
                              <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">{idea.feePaid ? `${idea.feePaid} XLM` : '0 XLM'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-[9px] uppercase font-bold text-slate-300 tracking-tighter">Protocol App ID</span>
                              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest">{idea.paymentId || 'N/A'}</span>
                            </div>
                         </div>
                         <button className="flex items-center gap-2 text-[10px] font-bold text-slate-900 border border-slate-900 px-6 py-2.5 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm uppercase tracking-widest">
                           Verify Ledger State <ExternalLink className="w-3.5 h-3.5 ml-1" />
                         </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="py-32 text-center border-4 border-dashed border-slate-100 rounded-[3rem] bg-white shadow-sm">
              <p className="text-sm font-bold text-slate-300 uppercase tracking-[0.2rem] italic">Zero Records Detected in Search Sector</p>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-full">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2rem] mb-8 flex items-center gap-3">
              <User className="w-4 h-4 text-indigo-500" />
              Leading Registrars
            </h3>
            <div className="space-y-6">
              {[...new Set(ideas.map(i => i.owner))].slice(0, 5).map((owner, i) => (
                <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div 
                         className="w-3 h-3 rounded shadow-sm"
                         style={{ backgroundColor: profiles[owner]?.avatarColor || '#e2e8f0' }}
                       />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Rank #{i+1}</span>
                    </div>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {profiles[owner]?.name || owner}
                  </p>
                  <p className="text-[9px] font-mono text-slate-400 truncate -mt-1">
                    {owner}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex flex-col">
                       <span className="text-[8px] text-slate-400 font-bold uppercase">Assets</span>
                       <span className="text-xs font-black text-slate-900">{ideas.filter(idea => idea.owner === owner).length}</span>
                    </div>
                    <div className="flex flex-col border-l border-slate-200 pl-4">
                       <span className="text-[8px] text-slate-400 font-bold uppercase">Contribution</span>
                       <span className="text-xs font-black text-indigo-600">{((ideas.filter(idea => idea.owner === owner).length / ideas.length) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
