import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

export default function Profile() {
  const [profile, setProfile] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'lose weight',
    dietary_preferences: '',
    activity_level: 'moderate'
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) { navigate('/login'); return }
    fetchProfile()
  }, [])

  async function fetchProfile() {
    try {
      const response = await axios.get(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data) {
        setProfile({
          age: response.data.age,
          weight: response.data.weight,
          height: response.data.height,
          goal: response.data.goal,
          dietary_preferences: response.data.dietary_preferences || '',
          activity_level: response.data.activity_level
        })
      }
    } catch (err) {
      // no profile yet
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${API_URL}/profile`,
        { ...profile, age: parseInt(profile.age), weight: parseFloat(profile.weight), height: parseFloat(profile.height) },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setSaved(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      // try update instead
      try {
        await axios.put(`${API_URL}/profile`,
          { ...profile, age: parseInt(profile.age), weight: parseFloat(profile.weight), height: parseFloat(profile.height) },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setSaved(true)
        setTimeout(() => navigate('/dashboard'), 1500)
      } catch (err2) {
        alert('Failed to save profile')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
            Back
          </button>
        </div>

        {saved && <p className="text-green-500 mb-4">Profile saved! Redirecting...</p>}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input type="number" value={profile.age}
              onChange={(e) => setProfile({...profile, age: e.target.value})}
              className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input type="number" step="0.1" value={profile.weight}
              onChange={(e) => setProfile({...profile, weight: e.target.value})}
              className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input type="number" step="0.1" value={profile.height}
              onChange={(e) => setProfile({...profile, height: e.target.value})}
              className="w-full border p-2 rounded" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
            <select value={profile.goal}
              onChange={(e) => setProfile({...profile, goal: e.target.value})}
              className="w-full border p-2 rounded">
              <option value="lose weight">Lose Weight</option>
              <option value="build muscle">Build Muscle</option>
              <option value="endurance">Endurance</option>
              <option value="maintain">Maintain</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Activity Level</label>
            <select value={profile.activity_level}
              onChange={(e) => setProfile({...profile, activity_level: e.target.value})}
              className="w-full border p-2 rounded">
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Preferences (optional)</label>
            <input type="text" value={profile.dietary_preferences}
              placeholder="e.g. vegetarian, no dairy"
              onChange={(e) => setProfile({...profile, dietary_preferences: e.target.value})}
              className="w-full border p-2 rounded" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
