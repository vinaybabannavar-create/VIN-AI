import React, { useState } from 'react'

export default function TasksPage(){
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState('')

  function addTask(){
    if(!taskInput) return
    setTasks(prev=>[{id:Date.now(), text:taskInput, done:false}, ...prev])
    setTaskInput('')
  }

  function toggleDone(id){
    setTasks(prev=> prev.map(t=> t.id===id? {...t, done: !t.done} : t))
  }

  return (
    <div className='p-6'>
      <h2 className='text-xl font-bold mb-4'>Daily Tasks & Study Plan</h2>
      <div className='mb-4'>
        <input value={taskInput} onChange={(e)=>setTaskInput(e.target.value)} className='p-2 border rounded w-full' placeholder='Add task — e.g. Study Spring Boot 2 hours' />
        <button onClick={addTask} className='mt-2 px-4 py-2 bg-green-600 text-white rounded'>Add Task</button>
      </div>

      <div className='space-y-2'>
        {tasks.map(t=> (
          <div key={t.id} className='bg-white p-3 rounded shadow flex justify-between items-center'>
            <div>
              <div className={`font-medium ${t.done? 'line-through text-gray-400' : ''}`}>{t.text}</div>
              <div className='text-xs text-gray-500'>Streak: 0</div>
            </div>
            <div>
              <button onClick={()=>toggleDone(t.id)} className='px-3 py-1 border rounded'>{t.done ? 'Undo' : 'Done'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
