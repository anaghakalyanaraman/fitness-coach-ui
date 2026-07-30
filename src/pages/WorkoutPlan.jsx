import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

export default function WorkoutPlan() {
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  async function generatePlan() {
    setLoading(true)
    setError('')
    try {
      const response = await axios.post(`${API_URL}/workout-plan`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setPlan(response.data)
    } catch (err) {
      setError('Failed to generate plan. Make sure you have set up your profile first.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Workout Plan</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
            Back to Dashboard
          </button>
        </div>

        <button
          onClick={generatePlan}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mb-6 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate My Workout Plan'}
        </button>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {plan && (
          <div>
            <h2 className="text-xl font-bold mb-2">{plan.plan_name}</h2>
            <p className="text-gray-500 mb-6">{plan.notes}</p>

            <div className="grid gap-4">
              {plan.days.map((day, index) => (
                <div key={index} className="bg-white p-5 rounded-lg shadow">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-lg">{day.day}</h3>
                    <span className="text-sm text-blue-500 font-medium">{day.focus}</span>
                  </div>
                  {day.exercises && day.exercises.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-gray-400 text-left">
                          <th className="pb-2">Exercise</th>
                          <th className="pb-2">Sets</th>
                          <th className="pb-2">Reps</th>
                          <th className="pb-2">Rest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {day.exercises.map((ex, i) => (
                          <tr key={i} className="border-t">
                            <td className="py-2">{ex.name}</td>
                            <td className="py-2">{ex.sets}</td>
                            <td className="py-2">{ex.reps}</td>
                            <td className="py-2">{ex.rest_seconds}s</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-gray-400 text-sm">Rest Day</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}