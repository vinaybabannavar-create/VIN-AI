import React, { useState, useRef, useEffect } from 'react'
import { FileText, Download, Eye, Plus, Trash2, ChevronDown, ChevronUp, Zap, User, Mail, Phone, Linkedin, Briefcase, GraduationCap, Code, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function Resume() {
  const navigate = useNavigate()
  const resumeRef = useRef()
  const [activeSection, setActiveSection] = useState('personal')
  const [resume, setResume] = useState({
    personal: { name: '', email: '', phone: '', linkedin: '' },
    summary: '',
    experience: [],
    education: [],
    skills: []
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const user = JSON.parse(localStorage.getItem('user'))
  const userKey = user ? `user_${user.email}_resume` : null

  // Persistence: Load
  useEffect(() => {
    if (userKey) {
      const savedResume = localStorage.getItem(userKey)
      if (savedResume) {
        setResume(JSON.parse(savedResume))
      }
    }
  }, [userKey])

  // Persistence: Save
  useEffect(() => {
    if (userKey) {
      localStorage.setItem(userKey, JSON.stringify(resume))
    }
  }, [resume, userKey])

  const updatePersonal = (field, value) => {
    setResume(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }))
  }

  const addExperience = () => {
    setResume(prev => ({
      ...prev,
      experience: [...prev.experience, { id: Date.now(), role: '', company: '', duration: '', description: '' }]
    }))
  }

  const deleteExperience = (id) => {
    setResume(prev => ({ ...prev, experience: prev.experience.filter(exp => exp.id !== id) }))
  }

  const updateExperience = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
    }))
  }

  const addEducation = () => {
    setResume(prev => ({
      ...prev,
      education: [...prev.education, { id: Date.now(), degree: '', school: '', duration: '' }]
    }))
  }

  const deleteEducation = (id) => {
    setResume(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }))
  }

  const updateEducation = (id, field, value) => {
    setResume(prev => ({
      ...prev,
      education: prev.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
    }))
  }

  const updateSkills = (value) => {
    setResume(prev => ({ ...prev, skills: value.split(',').map(s => s.trim()) }))
  }

  const generateAISummary = async () => {
    if (!resume.personal.name || resume.skills.length === 0) {
      alert("Please enter your name and some skills first!")
      return
    }
    setIsGenerating(true)
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
    try {
      const formData = new FormData()
      formData.append('name', resume.personal.name)
      formData.append('skills', resume.skills.join(', '))
      formData.append('projects', resume.experience.map(e => e.role).join(', ') || 'N/A')

      const response = await fetch(`${API_BASE_URL}/resume/create`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (data.resume) {
        setResume(prev => ({ ...prev, summary: data.resume }))
      }
    } catch (error) {
      console.error("AI Generation failed:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = async () => {
    const element = resumeRef.current
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${resume.personal.name}_Resume.pdf`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-white relative">
      <Sidebar />

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="hero-glow top-0 right-0 animate-float opacity-50" />
        </div>

        {/* Header */}
        <header className="glass-panel border-b border-white/10 p-4 flex items-center justify-between relative z-20">
          <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 pl-12 lg:pl-0">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
            </div>
            <h1 className="font-black text-sm md:text-lg tracking-tight uppercase">Resume Builder</h1>
          </div>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 md:px-6 py-2 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-blue-600/20 font-black text-[10px] md:text-sm uppercase tracking-widest"
          >
            <Download className="w-4 h-4 md:w-5 md:h-5" /> <span className="hidden sm:inline">Export PDF</span><span className="sm:hidden">PDF</span>
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-full lg:w-1/2 overflow-y-auto border-r border-white/10 p-6 md:p-8 space-y-8 glass-panel z-10 relative scrollbar-thin scrollbar-thumb-slate-700">
            {/* User can directly type descriptions */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-400" /> Personal Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase ml-1">Full Name</label>
                  <input value={resume.personal.name} onChange={e => updatePersonal('name', e.target.value)} className="glass-input w-full" placeholder="e.g. Vinay B" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase ml-1">Email</label>
                  <input value={resume.personal.email} onChange={e => updatePersonal('email', e.target.value)} className="glass-input w-full" placeholder="e.g. vinay@example.com" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase ml-1">Phone</label>
                  <input value={resume.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} className="glass-input w-full" placeholder="e.g. +1 234 567 890" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-500 font-bold uppercase ml-1">LinkedIn</label>
                  <input value={resume.personal.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} className="glass-input w-full" placeholder="e.g. linkedin.com/in/vinay" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-500 font-bold uppercase ml-1">Summary</label>
                  <button
                    onClick={generateAISummary}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all ${isGenerating ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 animate-pulse' : 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/50 hover:text-blue-400'}`}
                  >
                    <Sparkles className="w-3 h-3" /> {isGenerating ? 'Generating...' : 'AI Optimize'}
                  </button>
                </div>
                <textarea
                  value={resume.summary}
                  onChange={e => setResume({ ...resume, summary: e.target.value })}
                  className="glass-input w-full h-32 resize-none"
                  placeholder="Tell us about yourself or use AI to generate..."
                />
              </div>
            </section>

            {/* Experience Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-purple-400" /> Experience
                </h3>
                <button onClick={addExperience} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors flex items-center gap-2 text-sm font-bold">
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>
              <div className="space-y-6">
                {resume.experience.map((exp, index) => (
                  <div key={exp.id} className="p-6 bg-white/5 rounded-2xl space-y-4 border border-white/5 hover:border-white/20 transition-all group relative">
                    <button
                      onClick={() => deleteExperience(exp.id)}
                      className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} className="glass-input bg-black/40" placeholder="Job Title" />
                      <input value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} className="glass-input bg-black/40" placeholder="Company Name" />
                    </div>
                    <input value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} className="glass-input w-full bg-black/40" placeholder="Duration (e.g. 2021 - Present)" />
                    <textarea
                      value={exp.description}
                      onChange={e => updateExperience(exp.id, 'description', e.target.value)}
                      className="glass-input w-full h-24 resize-none bg-black/40"
                      placeholder="What did you do there?"
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Education Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-400" /> Education
                </h3>
                <button onClick={addEducation} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 transition-colors flex items-center gap-2 text-sm font-bold">
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>
              <div className="space-y-6">
                {resume.education.map((edu) => (
                  <div key={edu.id} className="p-6 bg-white/5 rounded-2xl space-y-4 border border-white/5 hover:border-white/20 transition-all group relative">
                    <button
                      onClick={() => deleteEducation(edu.id)}
                      className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-500 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} className="glass-input bg-black/40" placeholder="Degree" />
                      <input value={edu.school} onChange={e => updateEducation(edu.id, 'school', e.target.value)} className="glass-input bg-black/40" placeholder="School" />
                    </div>
                    <input value={edu.duration} onChange={e => updateEducation(edu.id, 'duration', e.target.value)} className="glass-input w-full bg-black/40" placeholder="Graduation Year" />
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2 text-blue-400">
                <Code className="w-5 h-5" /> Skills
              </h3>
              <input
                value={resume.skills.join(', ')}
                onChange={e => updateSkills(e.target.value)}
                className="glass-input w-full"
                placeholder="React, Node.js, Python, etc. (Separate with commas)"
              />
            </section>
          </div>

          {/* Real-time Preview Panel */}
          <div className="hidden lg:flex flex-1 p-8 bg-black/30 overflow-y-auto justify-center items-start scrollbar-thin scrollbar-thumb-slate-700">
            <div
              ref={resumeRef}
              className="bg-white text-slate-900 w-[210mm] min-h-[297mm] p-12 shadow-2xl transition-all duration-300 transform scale-[0.85] origin-top"
            >
              {/* Preview Content */}
              <div className="border-b-4 border-slate-900 pb-8 mb-8 flex justify-between items-end">
                <div>
                  <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2">{resume.personal.name || 'Your Name'}</h1>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 font-bold uppercase tracking-wide">
                    {resume.personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {resume.personal.email}</span>}
                    {resume.personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {resume.personal.phone}</span>}
                    {resume.personal.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" /> {resume.personal.linkedin}</span>}
                  </div>
                </div>
              </div>

              {resume.summary && (
                <div className="mb-10">
                  <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-900 mb-4 text-slate-900 inline-block px-1">Summary</h3>
                  <p className="text-slate-800 leading-relaxed font-medium">{resume.summary}</p>
                </div>
              )}

              {resume.experience.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-900 mb-6 text-slate-900 inline-block px-1">Experience</h3>
                  <div className="space-y-8">
                    {resume.experience.map(exp => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-xl font-bold text-slate-900">{exp.role || 'Job Title'}</h4>
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{exp.duration}</span>
                        </div>
                        <p className="text-md font-bold text-blue-600 mb-3">{exp.company || 'Company Name'}</p>
                        <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-medium">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.education.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-900 mb-6 text-slate-900 inline-block px-1">Education</h3>
                  <div className="space-y-6">
                    {resume.education.map(edu => (
                      <div key={edu.id}>
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="text-xl font-bold text-slate-900">{edu.degree || 'Degree'}</h4>
                          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{edu.duration}</span>
                        </div>
                        <p className="text-slate-800 font-bold">{edu.school || 'School/University'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.skills.length > 0 && resume.skills[0] !== '' && (
                <div>
                  <h3 className="text-lg font-black uppercase tracking-widest border-b-2 border-slate-900 mb-4 text-slate-900 inline-block px-1">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill, i) => (
                      <span key={i} className="bg-slate-100 text-slate-900 px-4 py-1.5 font-bold text-xs uppercase tracking-wider border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

