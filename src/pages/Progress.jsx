import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

export default function Progress() {
  const [progress, setProgress] = useState(null)
  const [weightLogs, setWeightLogs] = useState([])
  const [newWeight, setNewWeight] = useState('')
  const [workoutSession, setWorkoutSession] = useState([
    { exercise: '', sets: '', reps: '' }
  ])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchProgress()
  }, [])

  async function fetchProgress() {
    try {
      const [progressRes, weightRes] = await Promise.all([
        axios.get(`${API_URL}/progress`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/weight-log`, { headers: { Authorization: `Bearer ${token}` } })
      ])
      setProgress(progressRes.data)
      setWeightLogs(weightRes.data)
    } catch (err) {
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogWeight(e) {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/weight-log`,
        { weight_kg: parseFloat(newWeight) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setNewWeight('')
      fetchProgress()
    } catch (err) {
      alert('Failed to log weight')
    }
  }

  function addExercise() {
    setWorkoutSession([...workoutSession, { exercise: '', sets: '', reps: '' }])
  }

  function updateExercise(index, field, value) {
    const updated = [...workoutSession]
    updated[index][field] = value
    setWorkoutSession(updated)
  }

  async function handleLogWorkout(e) {
    e.preventDefault()
    try {
      await Promise.all(workoutSession.map(ex =>
        axios.post(`${API_URL}/logs`,
          { exercise: ex.exercise, sets: parseInt(ex.sets), reps: parseInt(ex.reps), weight_kg: null, notes: null },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ))
      setWorkoutSession([{ exercise: '', sets: '', reps: '' }])
      fetchProgress()
    } catch (err) {
      alert('Failed to log workout')
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Progress</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
            Back to Dashboard
          </button>
        </div>

        {progress && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className="text-3xl font-bold text-blue-500">{progress.total_workouts}</p>
              <p className="text-gray-500 text-sm mt-1">Total Workouts</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className="text-3xl font-bold text-green-500">{progress.current_weight || '--'}</p>
              <p className="text-gray-500 text-sm mt-1">Current Weight (kg)</p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow text-center">
              <p className={`text-3xl font-bold ${progress.weight_change < 0 ? 'text-green-500' : 'text-red-500'}`}>
                {progress.weight_change !== null ? `${progress.weight_change > 0 ? '+' : ''}${progress.weight_change}` : '--'}
              </p>
              <p className="text-gray-500 text-sm mt-1">Weight Change (kg)</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Log Weight</h2>
          <form onSubmit={handleLogWeight} className="flex gap-2">
            <input
              type="number"
              step="0.1"
              placeholder="Weight in kg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="border p-2 rounded flex-1"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Log Weight
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-bold mb-4">Log Workout Session</h2>
          <form onSubmit={handleLogWorkout}>
            {workoutSession.map((ex, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  placeholder="Exercise"
                  value={ex.exercise}
                  onChange={(e) => updateExercise(i, 'exercise', e.target.value)}
                  className="border p-2 rounded flex-1"
                />
                <input
                  type="number"
                  placeholder="Sets"
                  value={ex.sets}
                  onChange={(e) => updateExercise(i, 'sets', e.target.value)}
                  className="border p-2 rounded w-20"
                />
                <input
                  type="number"
                  placeholder="Reps"
                  value={ex.reps}
                  onChange={(e) => updateExercise(i, 'reps', e.target.value)}
                  className="border p-2 rounded w-20"
                />
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <button type="button" onClick={addExercise} className="border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-50">
                + Add Exercise
              </button>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Log Session
              </button>
            </div>
          </form>
        </div>

        {weightLogs.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-bold mb-4">Weight History</h2>
            <div className="space-y-2">
              {weightLogs.slice().reverse().map((log, i) => (
                <div key={i} className="flex justify-between text-sm border-b pb-2">
                  <span>{log.weight_kg} kg</span>
                  <span className="text-gray-400">{new Date(log.logged_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {progress && progress.recent_exercises.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold mb-4">Recent Workouts</h2>
            <div className="space-y-2">
              {progress.recent_exercises.map((exercise, i) => (
                <div key={i} className="text-sm border-b pb-2 text-gray-600">
                  {exercise}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}