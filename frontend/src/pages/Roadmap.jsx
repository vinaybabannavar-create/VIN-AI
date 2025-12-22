import React, { useState, useEffect } from 'react'
import { CheckCircle, Map, BookOpen, Trophy, Zap, ChevronRight, Lock, Target, Rocket, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function Roadmap() {
  const navigate = useNavigate()
  const [steps, setSteps] = useState([
    {
      id: 1, title: 'HTML & CSS Mastery', status: 'completed', description: 'Master semantic HTML5 and modern CSS3 (Flexbox, Grid).', tools: ['Tailwind', 'SASS'],
      resources: ['MDN Web Docs - HTML', 'CSS-Tricks Flexbox Guide', 'Frontend Mentor Challenges'],
      quiz: {
        questions: [
          { q: "What does semantic HTML mean?", options: ["Using tags that describe content", "Using only <div> tags", "Using CSS for structure", "Using JavaScript for layout"], a: 0, exp: "Semantic HTML uses tags like <article> and <header> to convey meaning to browsers and screen readers." },
          { q: "Which CSS property is used to create a flex container?", options: ["display: grid", "display: flex", "position: absolute", "float: left"], a: 1, exp: "display: flex initializes a flexbox layout on a container." },
          { q: "What is the purpose of the z-index property?", options: ["Control text size", "Control stack order", "Set background color", "Add shadow effects"], a: 1, exp: "z-index specifies the stack order of elements that overlap." }
        ],
        timePerQuestion: 15
      }
    },
    {
      id: 2, title: 'JavaScript Fundamentals', status: 'completed', description: 'ES6+, Async/Await, DOM manipulation, and closure concepts.', tools: ['ES6', 'Promises'],
      resources: ['Eloquent JavaScript', 'You Don\'t Know JS', 'JavaScript.info'],
      quiz: {
        questions: [
          { q: "What is a closure in JavaScript?", options: ["A function inside a function", "A way to close the window", "A variable type", "A syntax error"], a: 0, exp: "A closure is the combination of a function bundled together with references to its surrounding state." },
          { q: "Which method is used to add an element at the end of an array?", options: ["pop()", "shift()", "push()", "unshift()"], a: 2, exp: "push() adds one or more elements to the end of an array." },
          { q: "What does 'async' keyword do?", options: ["Stops execution", "Makes function return a promise", "Speeds up the code", "Deletes variables"], a: 1, exp: "Async functions always return a promise, resolving with the value returned by the function." }
        ],
        timePerQuestion: 20
      }
    },
    {
      id: 3, title: 'React Ecosystem', status: 'current', description: 'Functional components, Hooks, Redux/Context API, and Router.', tools: ['Hooks', 'Context'],
      resources: ['Official React Docs', 'Kent C. Dodds - Epic React', 'Scrimba React Course'],
      quiz: {
        questions: [
          { q: "What is the primary purpose of useEffect hook?", options: ["To manage state", "To handle side effects", "To create refs", "To optimize rendering"], a: 1, exp: "useEffect allows you to perform side effects in functional components." },
          { q: "How do you pass data from parent to child in React?", options: ["Using state", "Using props", "Using localStorage", "Using event listeners"], a: 1, exp: "Props are the standard way to pass data down the component tree." },
          { q: "What is the Virtual DOM?", options: ["A real browser element", "A copy of the real DOM in memory", "A CSS selector", "A database system"], a: 1, exp: "React uses a Virtual DOM to minimize actual DOM updates for better performance." }
        ],
        timePerQuestion: 20
      }
    },
    {
      id: 4, title: 'Backend (Node.js/Python)', status: 'locked', description: 'REST APIs, Databases (Mongo/SQL), and Authentication.', tools: ['FastAPI', 'MongoDB'],
      resources: ['Node.js Roadmap', 'FastAPI Documentation', 'MongoDB University'],
      quiz: {
        questions: [
          { q: "What does REST stand for?", options: ["Random Entry State Transfer", "Representational State Transfer", "Real-time System Transfer", "Remote Service Tool"], a: 1, exp: "REST is an architectural style for providing standards between computer systems." },
          { q: "Which database is NoSQL?", options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"], a: 2, exp: "MongoDB is a popular document-oriented NoSQL database." }
        ],
        timePerQuestion: 25
      }
    },
    {
      id: 5, title: 'System Design', status: 'locked', description: 'Scalability, Load Balancers, Caching, and Microservices.', tools: ['Docker', 'K8s'],
      resources: ['System Design Primer', 'ByteByteGo', 'AWS Architecture Center'],
      quiz: {
        questions: [
          { q: "What is a Load Balancer?", options: ["A weight lifting tool", "A device that distributes traffic", "A code minifier", "A battery saver"], a: 1, exp: "Load balancers distribute incoming network traffic across multiple servers." },
          { q: "What is Horizontal Scaling?", options: ["Increasing server RAM", "Adding more machines", "Rotating the screen", "Optimizing SQL queries"], a: 1, exp: "Horizontal scaling means adding more machines into your pool of resources." }
        ],
        timePerQuestion: 30
      }
    },
  ])

  const [customSkill, setCustomSkill] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const [modal, setModal] = useState({ isOpen: false, type: '', step: null })
  const [quizState, setQuizState] = useState({ active: false, currentIdx: 0, answers: {}, timer: 0, results: null, review: false })

  const user = JSON.parse(localStorage.getItem('user'))
  const userKey = user ? `user_${user.email}_roadmap` : null

  // Persistence: Load
  useEffect(() => {
    if (userKey) {
      const savedSteps = localStorage.getItem(userKey)
      if (savedSteps) {
        setSteps(JSON.parse(savedSteps))
      }
    }
  }, [userKey])

  // Persistence: Save
  useEffect(() => {
    if (userKey) {
      localStorage.setItem(userKey, JSON.stringify(steps))
    }
  }, [steps, userKey])

  const completedCount = (steps || []).filter(s => s.status === 'completed').length
  const progressPercent = (steps.length > 0) ? (completedCount / steps.length) * 100 : 0

  useEffect(() => {
    let interval
    if (quizState.active && quizState.timer > 0) {
      interval = setInterval(() => {
        setQuizState(prev => ({ ...prev, timer: prev.timer - 1 }))
      }, 1000)
    } else if (quizState.active && quizState.timer === 0) {
      handleFinishQuiz()
    }
    return () => clearInterval(interval)
  }, [quizState.active, quizState.timer])

  const startQuiz = (step) => {
    if (!step?.quiz?.questions) return
    setQuizState({
      active: true,
      currentIdx: 0,
      answers: {},
      timer: step.quiz.questions.length * step.quiz.timePerQuestion,
      results: null,
      review: false
    })
  }

  const handleAnswer = (optionIdx) => {
    setQuizState(prev => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIdx]: optionIdx }
    }))
  }

  const handleNext = () => {
    const questions = modal.step?.quiz?.questions
    if (!questions) return
    if (quizState.currentIdx < questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIdx: prev.currentIdx + 1 }))
    } else {
      handleFinishQuiz()
    }
  }

  const handleFinishQuiz = () => {
    const questions = modal.step?.quiz?.questions
    if (!questions) return

    let correctCount = 0
    questions.forEach((q, idx) => {
      if (quizState.answers[idx] === q.a) correctCount++
    })
    const score = Math.round((correctCount / questions.length) * 100)
    const passed = score >= 80

    setQuizState(prev => ({
      ...prev,
      active: false,
      results: { score, correctCount, total: questions.length, passed }
    }))

    if (passed) {
      handleCompleteStep(modal.step?.id)
    }
  }

  const handleCompleteStep = (stepId) => {
    if (!stepId) return
    setSteps(prev => prev.map(step => {
      if (step.id === stepId) return { ...step, status: 'completed' }
      if (step.id === stepId + 1 && step.status === 'locked') return { ...step, status: 'current' }
      return step
    }))
  }

  const generateCustomRoadmap = async () => {
    if (!customSkill.trim()) return
    setIsGenerating(true)
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    try {
      const resp = await fetch(`${API_BASE_URL}/career/roadmap?skill=${encodeURIComponent(customSkill)}`)
      const data = await resp.json()
      if (data.roadmap) {
        // More robust parsing: look for lines that look like steps (1. Title or just Title)
        const lines = data.roadmap.split('\n').filter(l => l.trim().length > 0)
        const stepsData = lines.filter(l => /^\d+\./.test(l) || l.includes(':'))

        const newSteps = (stepsData.length > 0 ? stepsData : lines).slice(0, 5).map((line, i) => {
          const titlePart = line.replace(/^\d+\.\s*/, '').split(':')[0].replace(/\*\*|__/g, '').trim()
          const descPart = line.includes(':') ? line.split(':').slice(1).join(':').trim() : line

          return {
            id: i + 1,
            title: titlePart || `Step ${i + 1}`,
            description: descPart || 'Learn this essential skill for ' + customSkill,
            status: i === 0 ? 'current' : 'locked',
            tools: [customSkill],
            resources: ['AI Generated Resource'],
            quiz: { questions: [], timePerQuestion: 20 }
          }
        })

        if (newSteps.length > 0) {
          setSteps(newSteps)
        } else {
          alert("Roadmap generated but format was unexpected. Technical details: " + data.roadmap.substring(0, 100))
        }
      } else {
        alert("Failed to generate roadmap: " + (data.detail || data.error || "Unknown error"))
      }
    } catch (error) {
      console.error("Failed to generate roadmap:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white relative">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="hero-glow top-0 right-0 animate-float opacity-30" />
          <div className="hero-glow bottom-0 left-0 animate-float opacity-20" />
        </div>

        <header className="glass-panel border-b border-white/10 p-4 md:p-6 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-3 md:gap-4 px-2 md:px-4 pl-12 lg:pl-0">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
              <Map className="w-5 h-5 md:w-7 md:h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-tight">Roadmap</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Frontend Track</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-1">Overall Progress</span>
              <div className="w-48 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <Target className="w-5 h-5 text-emerald-400" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-12 relative z-10 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Custom Generator */}
            <div className="glass-panel p-6 md:p-8 rounded-[2.5rem] border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sparkles size={100} />
              </div>
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" /> Generate Custom Career Path
                </h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    value={customSkill}
                    onChange={(e) => setCustomSkill(e.target.value)}
                    placeholder="Enter a skill (e.g. Docker, Vue.js, Data Science)..."
                    className="glass-input flex-1"
                  />
                  <button
                    onClick={generateCustomRoadmap}
                    disabled={isGenerating || !customSkill.trim()}
                    className={`bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50 ${isGenerating ? 'animate-pulse' : ''}`}
                  >
                    {isGenerating ? 'Architecting...' : 'Build Roadmap'}
                  </button>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-1 md:left-1/2 top-4 bottom-4 w-1 bg-gradient-to-b from-emerald-500/50 via-blue-500/30 to-white/5 rounded-full hidden md:block" />

              <div className="space-y-24">
                {steps.map((step, index) => (
                  <div key={step.id} className={`flex flex-col md:flex-row items-center gap-12 relative group ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-4 border-slate-950 z-20 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-2xl hidden md:flex">
                      {step.status === 'completed' ? (
                        <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                      ) : step.status === 'current' ? (
                        <div className="w-full h-full rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/40 animate-pulse">
                          <Rocket className="w-6 h-6 text-white" />
                        </div>
                      ) : (
                        <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                          <Lock className="w-5 h-5 text-slate-500" />
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-[calc(50%-3rem)]">
                      <div className={`p-8 rounded-[2rem] border transition-all duration-500 relative overflow-hidden group-hover:-translate-y-2 ${step.status === 'current' ? 'bg-blue-600/10 border-blue-500/50 shadow-2xl shadow-blue-500/10' :
                        step.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-white/5 border-white/10 opacity-60'
                        }`}>
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${step.status === 'current' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                            }`}>
                            {step.status}
                          </span>
                          <span className="text-3xl md:text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors select-none">0{index + 1}</span>
                        </div>

                        <h3 className={`text-xl md:text-2xl font-black mb-2 md:mb-3 ${step.status === 'locked' ? 'text-slate-500' : 'text-white'}`}>{step.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-4 md:mb-6 font-medium">{step.description}</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                          {step.tools?.map(tool => (
                            <span key={tool} className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded border border-white/5 text-slate-300 italic">#{tool}</span>
                          ))}
                        </div>

                        <div className="flex gap-4">
                          <button
                            onClick={() => setModal({ isOpen: true, type: 'resources', step })}
                            className={`flex-1 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${step.status === 'locked' ? 'bg-white/5 text-slate-600 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                            disabled={step.status === 'locked'}
                          >
                            <BookOpen className="w-4 h-4" /> Resources
                          </button>
                          {(step.status === 'completed' || step.status === 'current') && (
                            <button
                              onClick={() => setModal({ isOpen: true, type: 'quiz', step })}
                              className={`w-12 py-3 rounded-xl transition-all flex items-center justify-center border ${step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/20 hover:bg-blue-500/30'}`}
                            >
                              <Trophy className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="hidden md:block w-[calc(50%-3rem)]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {modal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 backdrop-blur-md bg-black/60 animate-fade-in">
            <div className="w-full max-w-lg glass-panel p-6 md:p-10 rounded-3xl md:rounded-[2.5rem] border border-white/20 shadow-2xl relative overflow-hidden animate-scale-up">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${modal.type === 'quiz' ? 'bg-blue-600/20' : 'bg-emerald-500/20'}`}>
                    {modal.type === 'quiz' ? <Trophy className="w-7 h-7 text-blue-400" /> : <BookOpen className="w-7 h-7 text-emerald-400" />}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{modal.type === 'quiz' ? 'Skills Proficiency' : 'Curated Resources'}</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mt-1">{modal.step?.title}</p>
                  </div>
                </div>

                {modal.type === 'resources' ? (
                  <div className="space-y-4 mb-8">
                    {modal.step?.resources?.map((res, i) => (
                      <a key={i} href="#" onClick={(e) => e.preventDefault()} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 hover:bg-white/10 transition-all group">
                        <span className="font-bold text-slate-300 group-hover:text-white">{res}</span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6 mb-10">
                    <p className="text-slate-400 font-medium leading-relaxed">
                      To complete this milestone and unlock the next stage of your journey, you must pass the VIN AI proficiency check for <span className="text-white font-bold">{modal.step?.title}</span>.
                    </p>
                    <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20">
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> {modal.step?.quiz?.questions?.length || 0} Technical Questions</li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Passing score: 80%</li>
                        <li className="flex items-center gap-3 text-sm font-bold text-slate-300"><div className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Reward: Unlock Next Module</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setModal({ isOpen: false, type: '', step: null })
                      setQuizState({ active: false, currentIdx: 0, answers: {}, timer: 0, results: null, review: false })
                    }}
                    className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >Close</button>
                  {(modal.step?.status === 'current' || modal.step?.status === 'completed') && !quizState.active && !quizState.results && (
                    <button
                      onClick={() => startQuiz(modal.step)}
                      className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg shadow-blue-600/30 font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all text-white"
                    >
                      {modal.step?.status === 'completed' ? 'Retake Assessment' : 'Start Assessment'}
                    </button>
                  )}
                </div>

                {quizState.active && modal.step?.quiz?.questions && (
                  <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Question {quizState.currentIdx + 1} of {modal.step.quiz.questions.length}</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                        <Zap className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-black text-red-500 uppercase tracking-widest">{quizState.timer}s</span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-6 leading-snug">{modal.step.quiz.questions[quizState.currentIdx]?.q}</h4>
                    <div className="space-y-3 mb-8">
                      {modal.step.quiz.questions[quizState.currentIdx]?.options?.map((opt, i) => (
                        <button key={i} onClick={() => handleAnswer(i)} className={`w-full p-4 rounded-2xl text-left border transition-all font-bold text-sm ${quizState.answers[quizState.currentIdx] === i ? 'bg-blue-600/20 border-blue-500/50 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10'}`}>{opt}</button>
                      ))}
                    </div>
                    <button onClick={handleNext} disabled={quizState.answers[quizState.currentIdx] === undefined} className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                      {quizState.currentIdx === modal.step.quiz.questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
                    </button>
                  </div>
                )}

                {quizState.results && !quizState.review && (
                  <div className="mt-8 pt-8 border-t border-white/10 text-center animate-scale-up">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6 ${quizState.results.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{quizState.results.passed ? <CheckCircle className="w-10 h-10" /> : <Zap className="w-10 h-10" />}</div>
                    <h3 className="text-3xl font-black mb-2 uppercase tracking-tight">{quizState.results.passed ? 'Assessment Passed!' : 'Try Again'}</h3>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">You scored {quizState.results.score}% ({quizState.results.correctCount}/{quizState.results.total})</p>
                    <div className="flex gap-4">
                      <button onClick={() => setQuizState(prev => ({ ...prev, review: true }))} className="flex-1 py-4 rounded-2xl bg-white/5 border border-white/10 font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Review Answers</button>
                      {!quizState.results.passed && (
                        <button onClick={() => startQuiz(modal.step)} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Retake Quiz</button>
                      )}
                    </div>
                  </div>
                )}

                {quizState.review && modal.step?.quiz?.questions && (
                  <div className="mt-8 pt-8 border-t border-white/10 animate-fade-in max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 pr-2">
                    <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-950/80 backdrop-blur-md py-2 z-10">
                      <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Question Review</h4>
                      <button onClick={() => setQuizState(prev => ({ ...prev, review: false }))} className="text-xs font-bold text-blue-400 hover:text-blue-300">Back to Results</button>
                    </div>
                    <div className="space-y-8">
                      {modal.step.quiz.questions.map((q, idx) => (
                        <div key={idx} className="space-y-3 pb-6 border-b border-white/5 last:border-0">
                          <p className="font-bold text-white text-sm">{idx + 1}. {q?.q}</p>
                          <div className="space-y-2">
                            <div className={`p-3 rounded-xl text-xs font-bold flex justify-between items-center ${quizState.answers[idx] === q?.a ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                              <span>Your: {q?.options?.[quizState.answers[idx]] || 'No Answer'}</span>
                              {quizState.answers[idx] === q?.a ? <CheckCircle className="w-3 h-3" /> : <Zap className="w-3 h-3" />}
                            </div>
                            {quizState.answers[idx] !== q?.a && (
                              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">Correct: {q?.options?.[q?.a]}</div>
                            )}
                            <div className="p-4 rounded-2xl bg-white/5 text-[10px] text-slate-400 font-medium italic">{q?.exp}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
