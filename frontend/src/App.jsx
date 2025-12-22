import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import Resume from './pages/Resume'
import Roadmap from './pages/Roadmap'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/resume" element={<Resume />} />
      <Route path="/roadmap" element={<Roadmap />} />

      <Route
        path="*"
        element={
          <div style={{ color: 'white', padding: 40, textAlign: 'center' }}>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for does not exist.</p>
          </div>
        }
      />
    </Routes>
  )
}

