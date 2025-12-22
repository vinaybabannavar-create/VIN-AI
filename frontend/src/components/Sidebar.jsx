import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
    Bot,
    FileText,
    Map,
    LogOut,
    LayoutDashboard,
    Zap,
    ChevronLeft,
    ChevronRight,
    Menu,
    X
} from 'lucide-react'

export default function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar_collapsed')
        return saved === 'true'
    })

    useEffect(() => {
        localStorage.setItem('sidebar_collapsed', isCollapsed)
    }, [isCollapsed])

    function logout() {
        localStorage.removeItem('user')
        localStorage.removeItem('registeredUser')
        navigate('/')
    }

    const navItems = [
        { to: '/dashboard', icon: <LayoutDashboard />, label: 'Dashboard' },
        { to: '/chat', icon: <Bot />, label: 'AI Assistant' },
        { to: '/resume', icon: <FileText />, label: 'Resume Builder' },
        { to: '/roadmap', icon: <Map />, label: 'Career Roadmap' }
    ]

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 left-6 z-50 p-3 rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 backdrop-blur-xl text-white shadow-xl"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Backdrop for Mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 transition-all duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 ${isCollapsed ? 'w-20' : 'w-72'} glass-panel border-r border-white/10 z-40 flex flex-col transition-all duration-500 transform ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } group`}>
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex absolute -right-4 top-10 z-[60] w-8 h-8 rounded-full bg-slate-900 border border-white/10 items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all shadow-xl"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
                {/* Decorative Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 via-transparent to-purple-600/5 opacity-50 pointer-events-none" />

                <div className={`p-8 flex items-center transition-all duration-500 ${isCollapsed ? 'px-4 gap-0' : 'px-8 gap-4'} mb-4`}>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-600/30 group-hover:rotate-12 transition-transform duration-500 shrink-0">
                        <Zap className="w-7 h-7 text-white fill-white/20" />
                    </div>
                    <div className={`transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-4'}`}>
                        <span className="font-black text-2xl tracking-tighter text-white uppercase whitespace-nowrap">VIN AI</span>
                        <p className="text-[10px] font-black tracking-[0.3em] text-blue-400/80 uppercase whitespace-nowrap">Platform</p>
                    </div>
                </div>

                <nav className="flex-1 px-6 py-4 space-y-3 relative overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.to
                        return (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group/item relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-600/30 font-bold scale-[1.02]'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                                    }`}
                            >
                                <span className={`transition-transform duration-500 shrink-0 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`}>
                                    {isActive ? React.cloneElement(item.icon, { size: 20, className: "text-white" }) : React.cloneElement(item.icon, { size: 20 })}
                                </span>
                                <span className={`text-sm tracking-wide transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0 px-0' : 'w-auto opacity-100 ml-0'}`}>
                                    {item.label}
                                </span>

                                {isActive && !isCollapsed && (
                                    <div className="absolute right-4 animate-pulse">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                                    </div>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 mt-auto border-t border-white/5">
                    <button
                        onClick={logout}
                        className="flex items-center gap-4 px-5 py-4 w-full rounded-2xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all duration-300 group/logout border border-transparent hover:border-red-500/20"
                    >
                        <LogOut className="w-5 h-5 group-hover/logout:-translate-x-1 transition-transform shrink-0" />
                        <span className={`font-bold text-sm tracking-wide font-sans transition-all duration-500 overflow-hidden ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-0'}`}>
                            Sign Out
                        </span>
                    </button>
                </div>
            </aside>
        </>
    )
}
