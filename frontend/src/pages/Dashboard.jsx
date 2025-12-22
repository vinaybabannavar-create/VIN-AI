import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Bot,
  FileText,
  Map,
  Search,
  Bell,
  User,
  TrendingUp,
  Brain,
  Zap,
  CheckCircle,
  X,
  Target,
  ArrowUpRight,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

export default function Dashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user')) || { displayName: 'User' }
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notifications = [
    { id: 1, text: "AI Assistant updated its knowledge base!", type: "info", time: "2m ago" },
    { id: 2, text: "New resume template available.", type: "new", time: "1h ago" },
    { id: 3, text: "Interview for Senior Dev role scheduled tomorrow.", type: "urgent", time: "3h ago" }
  ]

  const stats = [
    { icon: <TrendingUp className="text-emerald-400" />, label: "Profile Views", value: "1,284", change: "+12.5%", color: "emerald" },
    { icon: <Brain className="text-blue-400" />, label: "Skill Score", value: "84/100", change: "+5.2%", color: "blue" },
    { icon: <Target className="text-purple-400" />, label: "Goal Progress", value: "68%", change: "+2.1%", color: "purple" }
  ]

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white relative">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        {/* Header */}
        <header className="sticky top-0 z-30 glass-panel border-b border-white/10 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between">
          <div className="pl-12 lg:pl-0">
            <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">Command Center</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Main Dashboard</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all group w-64 lg:w-96">
              <Search className="w-4 h-4 text-slate-500 group-focus-within:text-blue-400" />
              <input
                placeholder="Search resources, experts, tools..."
                className="bg-transparent border-none focus:outline-none text-sm w-full text-slate-200 placeholder-slate-500 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-3 rounded-2xl transition-all duration-300 ${showNotifications ? 'bg-white/10 text-white shadow-inner shadow-white/5' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-slate-950" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-4 w-96 glass-panel rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 animate-fade-in z-50 overflow-hidden">
                  <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                    <span className="font-black tracking-tight text-lg">Activity</span>
                    <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-4 h-4 text-slate-500" /></button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto p-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'urgent' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-300 group-hover:text-white transition-colors font-medium leading-snug">{n.text}</p>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 block">{n.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/10 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tighter">{user.displayName}</p>
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Premium Active</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-0.5 group-hover:scale-105 transition-all shadow-lg shadow-indigo-600/20">
                <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-200" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto space-y-6 md:space-y-12">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 glass-card p-6 md:p-10 rounded-3xl md:rounded-[3rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-600/30 transition-colors" />

              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 tracking-tighter">Welcome back, <br /><span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">{user.displayName}!</span></h1>
                <p className="text-slate-400 text-sm md:text-lg max-w-xl font-medium leading-relaxed">
                  Your career trajectory is looking strong. You've completed 3 roadmap milestones this week.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 md:mt-10">
                  {stats.map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/10 transition-all group/stat">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-black/20 text-white transition-transform group-hover/stat:scale-110">
                          {stat.icon}
                        </div>
                        <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">{stat.change}</span>
                      </div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 md:p-10 rounded-3xl md:rounded-[3rem] bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden border-none text-white shadow-2xl shadow-indigo-900/40">
              <div className="absolute top-0 right-0 p-4 opacity-30">
                <Sparkles size={120} />
              </div>
              <div className="relative z-10 h-full flex flex-col">
                <h3 className="text-2xl font-black tracking-tight mb-4">AI Insight</h3>
                <p className="text-lg font-medium leading-relaxed opacity-90 mb-auto">
                  "Based on your recent roadmap progress, you should focus on **Next.js Server Actions** next to level up your Frontend expertise."
                </p>
                <div className="mt-8">
                  <button onClick={() => navigate('/chat')} className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                    Open AI Chat <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                <Zap className="text-yellow-400 fill-yellow-400" /> Essential Tools
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ActionCard
                to="/chat"
                title="AI Career Assistant"
                description="Instant interview prep, resume reviews, and industry insights."
                icon={<Bot className="w-8 h-8 text-blue-400" />}
                color="from-blue-600/20 to-indigo-600/20"
                delay="0"
              />
              <ActionCard
                to="/resume"
                title="Resume Forge"
                description="Engineered ATS-ready templates for high-impact roles."
                icon={<FileText className="w-8 h-8 text-purple-400" />}
                color="from-purple-600/20 to-pink-600/20"
                delay="100ms"
              />
              <ActionCard
                to="/roadmap"
                title="Architect Roadmap"
                description="Deep technical paths to Senior and Architect levels."
                icon={<Map className="w-8 h-8 text-emerald-400" />}
                color="from-emerald-600/20 to-teal-600/20"
                delay="200ms"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function ActionCard({ to, title, description, icon, color, delay }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(to)}
      className="glass-card p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] group cursor-pointer relative overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-all duration-700`} />

      <div className="relative z-10 flex flex-col h-full">
        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {icon}
        </div>
        <h4 className="text-xl font-black mb-3 group-hover:text-white transition-colors tracking-tight">{title}</h4>
        <p className="text-slate-400 text-sm font-medium mb-8 group-hover:text-slate-200 transition-colors leading-relaxed">
          {description}
        </p>
        <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-all">
          Explore Tool <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  )
}

