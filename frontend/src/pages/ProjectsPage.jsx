import React, { useState } from 'react'
import axios from 'axios'

export default function ProjectsPage() {
  const [skill, setSkill] = useState('Python')
  const [ideas, setIdeas] = useState('')

  async function fetchIdeas() {
    try {
      const res = await axios.get(`http://192.168.0.171:8000/career/roadmap?skill=${encodeURIComponent(skill)}`)
      setIdeas(res.data.roadmap)
    } catch (e) {
      setIdeas('(Failed to fetch ideas - is backend running?)')
    }
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Project Suggestion Engine</h2>
      <input value={skill} onChange={(e) => setSkill(e.target.value)} className='p-2 border rounded w-full mb-2' />
      <button onClick={fetchIdeas} className='px-4 py-2 bg-blue-600 text-white rounded'>Get Ideas</button>
      <pre className='mt-4 whitespace-pre-wrap'>{ideas}</pre>
    </div>
  )
}
