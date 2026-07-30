import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  async function handleSend(e) {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const history = updatedMessages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }))

      const response = await axios.post(`${API_URL}/chat`,
        { message: input, conversation_history: history },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setMessages([...updatedMessages, { role: 'assistant', content: response.data.response }])
    } catch (err) {
      alert('Failed to get response')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Chat Coach</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-4 h-96 overflow-y-auto">
          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-32">Ask your AI fitness coach anything...</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-400">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            placeholder="Ask your coach..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}