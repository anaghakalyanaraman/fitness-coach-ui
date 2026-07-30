import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) navigate('/login')
  }, [])

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Fitness Coach</h1>
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div onClick={() => navigate('/workout')} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">Workout Plan</h2>
            <p className="text-gray-500">Generate your personalized AI workout plan</p>
          </div>

          <div onClick={() => navigate('/nutrition')} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">Nutrition</h2>
            <p className="text-gray-500">Get meal plans and recipes from your ingredients</p>
          </div>

          <div onClick={() => navigate('/chat')} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">Chat Coach</h2>
            <p className="text-gray-500">Ask your AI fitness coach anything</p>
          </div>

          <div onClick={() => navigate('/progress')} className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
            <h2 className="text-xl font-bold mb-2">Progress</h2>
            <p className="text-gray-500">Track your weight and workout history</p>
          </div>
        </div>
      </div>
    </div>
  )
}