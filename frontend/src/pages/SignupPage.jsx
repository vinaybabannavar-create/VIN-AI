import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, Lock, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react'

export default function SignupPage() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = (e) => {
    e.preventDefault()
    setLoading(true)

    setTimeout(() => {
      // Get existing users or initialize empty array
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')

      // Check if email already exists
      if (existingUsers.find(u => u.email === formData.email)) {
        alert('An account with this email already exists!')
        setLoading(false)
        return
      }

      // Add new user
      const updatedUsers = [...existingUsers, formData]
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers))

      // Keep legacy support for single user if needed for other parts of the app
      localStorage.setItem('registeredUser', JSON.stringify(formData))

      alert('Account created successfully! Please login.')
      navigate('/')
      setLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[150px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[150px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-5xl flex flex-col lg:flex-row-reverse gap-12 items-center relative z-10">
        {/* Left Side: Branding */}
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl animate-fade-in">
            <Zap className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-purple-400">VIN AI</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight animate-fade-in" style={{ animationDelay: '100ms' }}>
            Start Your <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">AI Advantage.</span>
          </h1>
          <p className="text-slate-400 text-base lg:text-xl max-w-xl font-medium leading-relaxed animate-fade-in" style={{ animationDelay: '200ms' }}>
            Create an account to unlock your personalized AI career assistant.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm font-bold text-slate-300">Privacy First</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-slate-300">AI Powered</span>
            </div>
          </div>
        </div>

        {/* Right Side: Signup Form */}
        <div className="w-full lg:w-[450px] animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="glass-panel p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black mb-2 tracking-tight">Create Account</h2>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Join VIN AI Today</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="glass-input w-full pl-12 h-14"
                    placeholder="e.g. vinay_b"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
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
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
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
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-purple-600/20 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>

            <p className="mt-10 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
              Already have an account? <br />
              <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">Login to platform</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

