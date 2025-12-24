import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Mic, Image, Paperclip, RefreshCw, Copy, ThumbsUp, ThumbsDown, Settings, Zap, MoreVertical, Search, Sparkles, Plus, SendHorizonal, Check, MessageSquare, Trash2, Clock, X, ChevronLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function Chat() {
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [currentChatId, setCurrentChatId] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)
  const [copiedId, setCopiedId] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isStreaming, setIsStreaming] = useState(true)
  const [memoryUsage, setMemoryUsage] = useState(25)
  const messagesEndRef = useRef(null)

  const user = JSON.parse(localStorage.getItem('user'))
  const userKey = user ? `user_${user.email}_chats` : 'guest_chats'

  // Persistence: Load Chats
  useEffect(() => {
    const savedChats = localStorage.getItem(userKey)
    if (savedChats) {
      const parsed = JSON.parse(savedChats)
      setChats(parsed)
      if (parsed.length > 0) {
        setCurrentChatId(parsed[0].id)
      } else {
        createNewChat()
      }
    } else {
      createNewChat()
    }
  }, [userKey])

  // Persistence: Save Chats
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem(userKey, JSON.stringify(chats))
    }
  }, [chats, userKey])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentChat = chats.find(c => c.id === currentChatId) || chats[0]

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages, isTyping, imagePreview])

  // Speech to Text Integration
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      console.error("Speech recognition not supported in this browser.")
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true

    recognitionRef.current.onresult = (event) => {
      let transcript = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInput(transcript)
    }

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      title: 'New Conversation',
      timestamp: new Date().toLocaleString(),
      messages: [
        { id: 1, type: 'bot', content: "Hello! I'm your **AI Career Assistant**. How can I help you today? \n\nI can help you with:\n- Resume optimization\n- Interview preparation\n- Career path planning\n- Skill bridge analysis" }
      ]
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const deleteChat = (id, e) => {
    e.stopPropagation()
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id)
      if (filtered.length === 0) {
        // Automatically create a new one if none left
        setTimeout(() => createNewChat(), 0)
        return []
      }
      if (currentChatId === id) {
        setCurrentChatId(filtered[0].id)
      }
      return filtered
    })
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || !currentChatId) return

    const userMsg = { id: Date.now(), type: 'user', content: input, image: imagePreview }

    // Update local state immediately
    setChats(prev => prev.map(c => {
      if (c.id === currentChatId) {
        // Update title if it's still 'New Conversation'
        const newTitle = c.title === 'New Conversation' ? (input.length > 20 ? input.substring(0, 20) + '...' : input) : c.title
        return { ...c, title: newTitle, messages: [...c.messages, userMsg] }
      }
      return c
    }))

    setInput('')
    setIsTyping(true)

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

    try {
      const formData = new FormData()
      formData.append('message', input)
      if (selectedImage) {
        formData.append('image', selectedImage)
      }

      // Add history of the current chat (last 6 messages for context)
      if (currentChat && currentChat.messages) {
        const history = currentChat.messages.slice(-6).map(m => ({
          type: m.type,
          content: m.content
        }))
        formData.append('history', JSON.stringify(history))
      }

      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || errorData.error || `Server Error ${response.status}`)
      }

      const data = await response.json()

      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          return { ...c, messages: [...c.messages, { id: Date.now() + 1, type: 'bot', content: data.reply }] }
        }
        return c
      }))
    } catch (error) {
      setChats(prev => prev.map(c => {
        if (c.id === currentChatId) {
          return { ...c, messages: [...c.messages, { id: Date.now() + 1, type: 'bot', content: `**Error:** ${error.message || "I'm having trouble connecting to the brain. Please try again later."}` }] }
        }
        return c
      }))
    } finally {
      setIsTyping(false)
      setSelectedImage(null)
      setImagePreview(null)
    }
  }

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-500 relative ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar />

      {/* Chat History Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-80 border-r flex flex-col transition-all duration-500 z-30 ${isDarkMode ? 'bg-slate-900/40 border-white/10' : 'bg-white border-slate-200 shadow-xl'
        } ${showHistory ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <button
            onClick={createNewChat}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" /> New Conversation
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-2 scrollbar-thin scrollbar-thumb-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4">History</p>
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => {
                setCurrentChatId(chat.id)
                setShowHistory(false)
              }}
              className={`group p-4 rounded-2xl cursor-pointer transition-all border flex items-center gap-4 ${currentChatId === chat.id
                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400'
                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
            >
              <MessageSquare className={`w-5 h-5 shrink-0 ${currentChatId === chat.id ? 'text-blue-400' : 'text-slate-500'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{chat.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-slate-600" />
                  <p className="text-[10px] font-medium text-slate-600 truncate">{chat.timestamp}</p>
                </div>
              </div>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-red-500 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-6 border-t border-white/5">
          <div className="flex items-center gap-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-black">
              {user?.displayName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black truncate">{user?.displayName || 'Guest User'}</p>
              <p className="text-[10px] font-bold text-slate-500 truncate">{user?.email || 'vinaisystem@ai.com'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Content */}
      <main className="flex-1 flex flex-col relative z-20 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />

        {/* Chat Header */}
        <header className={`glass-panel border-b px-4 md:px-8 py-4 md:py-5 flex items-center justify-between transition-colors duration-500 ${isDarkMode ? 'border-white/10' : 'border-slate-200 bg-white/50'}`}>
          <div className="flex items-center gap-2 md:gap-4 pl-12 lg:pl-0">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition-all"
            >
              <MessageSquare className="w-5 h-5 text-slate-400" />
            </button>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-600/20">
              <Bot className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-base md:text-xl font-black tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {currentChat?.title === 'New Conversation' ? 'AI Assistant' : currentChat?.title}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Model : VIN AI 7.0</p>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-3 rounded-xl transition-all border ${showSettings ? 'bg-white/10 text-white border-white/20' : 'text-slate-400 hover:bg-white/5 border-transparent hover:border-white/10'}`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            {showSettings && (
              <div className="absolute right-0 top-full mt-4 w-72 glass-panel rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/10 p-6 z-50 animate-fade-in">
                <h3 className="font-black mb-4 border-b border-white/5 pb-3 text-sm uppercase tracking-widest text-slate-400">Assistant Settings</h3>
                <div className="space-y-4">
                  <div
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => setIsDarkMode(!isDarkMode)}
                  >
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Dark Mode</span>
                    <div className={`w-10 h-5 rounded-full relative shadow-inner transition-colors duration-300 ${isDarkMode ? 'bg-blue-600' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isDarkMode ? 'right-1' : 'right-6'}`} />
                    </div>
                  </div>
                  <div
                    className="flex items-center justify-between group cursor-pointer"
                    onClick={() => setIsStreaming(!isStreaming)}
                  >
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Streaming</span>
                    <div className={`w-10 h-5 rounded-full relative shadow-inner transition-colors duration-300 ${isStreaming ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${isStreaming ? 'right-1' : 'right-6'}`} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Memory Usage</p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${memoryUsage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Messages Screen */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 md:space-y-8 scrollbar-thin scrollbar-thumb-slate-800 focus:outline-none">
          <div className="max-w-4xl mx-auto space-y-8">
            {currentChat?.messages?.map((msg) => (
              <div key={msg.id} className={`flex gap-6 animate-fade-in ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.type === 'user'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                  : 'bg-white/5 border border-white/10'
                  }`}>
                  {msg.type === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5 text-white" /> : <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />}
                </div>

                <div className={`max-w-[80%] group relative ${msg.type === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-6 rounded-[1.5rem] shadow-xl transition-all duration-300 ${msg.type === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : `glass-panel border rounded-tl-none group-hover:border-white/20 ${isDarkMode ? 'border-white/10 text-slate-200' : 'border-slate-200 bg-white text-slate-800'}`
                    }`}>
                    <div className={`prose prose-sm max-w-none font-medium leading-relaxed ${isDarkMode ? 'prose-invert' : 'prose-slate'}`}>
                      {msg.image && (
                        <div className="mb-4 overflow-hidden rounded-xl border border-white/10 shadow-lg">
                          <img src={msg.image} alt="Sent attachment" className="w-full h-auto max-h-64 object-cover" />
                        </div>
                      )}
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>

                  <div className={`flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${msg.type === 'user' ? 'justify-end' : ''}`}>
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"
                    >
                      {copiedId === msg.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    {msg.type === 'bot' && (
                      <>
                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-emerald-400 transition-colors"><ThumbsUp size={14} /></button>
                        <button className="p-1.5 hover:bg-white/10 rounded-lg text-slate-500 hover:text-red-400 transition-colors"><ThumbsDown size={14} /></button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-6 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-blue-400" />
                </div>
                <div className="glass-panel border border-white/10 p-6 rounded-[1.5rem] rounded-tl-none flex gap-2 items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Image Preview Area */}
        {imagePreview && (
          <div className="px-8 flex justify-center">
            <div className="relative group max-w-sm">
              <img src={imagePreview} alt="Upload preview" className="h-32 rounded-2xl border border-white/20 shadow-2xl" />
              <button
                onClick={() => { setSelectedImage(null); setImagePreview(null) }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-transform"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 md:p-8 md:pb-10">
          <div className="max-w-4xl mx-auto">
            <div className={`glass-panel p-2 rounded-[2rem] border shadow-2xl transition-all relative group ${isDarkMode ? 'border-white/10 focus-within:border-blue-500/50' : 'border-slate-200 bg-white focus-within:border-blue-400'}`}>
              <form onSubmit={handleSend} className="flex gap-2 items-end">
                <div className="flex gap-1 p-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className={`p-3 rounded-2xl transition-all group/btn ${isDarkMode ? 'hover:bg-white/5 text-slate-400 hover:text-blue-400' : 'hover:bg-slate-100 text-slate-500 hover:text-blue-600'}`}
                  >
                    <Paperclip className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className={`p-3 rounded-2xl transition-all group/btn ${isDarkMode ? 'hover:bg-white/5 text-slate-400 hover:text-purple-400' : 'hover:bg-slate-100 text-slate-500 hover:text-purple-600'}`}
                  >
                    <Image className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                  </button>
                </div>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend(e)
                    }
                  }}
                  placeholder="Ask me anything about your career..."
                  className={`flex-1 bg-transparent border-none focus:outline-none py-4 px-2 text-sm placeholder-slate-500 resize-none max-h-48 font-medium leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}
                  rows="1"
                />

                <div className="flex gap-2 p-2">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-4 rounded-2xl transition-all ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse border border-red-500/20' : 'hover:bg-white/5 text-slate-400 hover:text-white border border-transparent hover:border-white/10'}`}
                    title="Voice Input"
                  >
                    <Mic className={`w-5 h-5 ${isListening ? 'scale-125' : ''}`} />
                  </button>

                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className={`p-4 rounded-2xl transition-all duration-300 shadow-xl ${input.trim()
                      ? 'bg-blue-600 text-white shadow-blue-600/30 hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-slate-600 cursor-not-allowed opacity-50'
                      }`}
                  >
                    <SendHorizonal className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
            <p className="text-center text-xs text-slate-500 mt-2">
              AI can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
