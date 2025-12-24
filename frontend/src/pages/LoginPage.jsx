import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, LogIn, ArrowRight, Github, Chrome, Sparkles, Zap, ShieldCheck } from 'lucide-react'

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      const legacyUser = JSON.parse(localStorage.getItem('registeredUser'))

      // 1. Check in multi-user array
      const userMatch = registeredUsers.find(u => u.email === formData.email && u.password === formData.password)

      if (userMatch) {
        localStorage.setItem('user', JSON.stringify({ displayName: userMatch.username, email: userMatch.email }))
        navigate('/dashboard')
      }
      // 2. Check legacy single user
      else if (legacyUser && legacyUser.email === formData.email && legacyUser.password === formData.password) {
        localStorage.setItem('user', JSON.stringify({ displayName: legacyUser.username, email: legacyUser.email }))
        navigate('/dashboard')
      }
      // 3. Check hardcoded demo user
      else if (formData.email === 'vinay@example.com' && formData.password === 'password') {
        localStorage.setItem('user', JSON.stringify({ displayName: 'Vinay B', email: 'vinay@example.com' }))
        navigate('/dashboard')
      }
      else {
        alert('Invalid credentials')
      }
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-12 items-center relative z-10">
        {/* Left Side: Branding */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl animate-fade-in">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">Vinay's VIN AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
            Elevate Your <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Professional Journey.</span>
          </h1>
          <p className="text-slate-400 text-base lg:text-xl max-w-xl font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Secure your future with the world's most advanced AI career platform.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-slate-300">Enterprise Secure</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm font-bold text-slate-300">Instant Insights</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-[450px] animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="glass-panel p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -z-10" />

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Login to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="glass-input w-full pl-12 h-14"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400">Forgot?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="glass-input w-full pl-12 h-14"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Sign In <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative flex items-center justify-center mb-8">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#050510] px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest absolute">Or Continue With</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                  <Github size={18} /> Github
                </button>
                <button className="flex items-center justify-center gap-3 h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
                  <Chrome size={18} /> Google
                </button>
              </div>
            </div>

            <p className="mt-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
              New to Vinay's VIN AI? <br />
              <Link to="/signup" className="text-blue-400 hover:text-blue-300 transition-colors">Create your account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
