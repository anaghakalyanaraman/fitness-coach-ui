import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'

export default function Nutrition() {
  const [ingredients, setIngredients] = useState('')
  const [mealType, setMealType] = useState('Lunch')
  const [mealPlan, setMealPlan] = useState(null)
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('mealplan')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  async function handleMealPlan(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i)
      const response = await axios.post(`${API_URL}/nutrition/meal-plan`,
        { ingredients: ingredientList },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMealPlan(response.data)
      setRecipe(null)
    } catch (err) {
      alert('Failed to generate meal plan')
    } finally {
      setLoading(false)
    }
  }

  async function handleRecipe(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i)
      const response = await axios.post(`${API_URL}/nutrition/recipe`,
        { ingredients: ingredientList, meal_type: mealType },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setRecipe(response.data)
      setMealPlan(null)
    } catch (err) {
      alert('Failed to generate recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Nutrition</h1>
          <button onClick={() => navigate('/dashboard')} className="text-blue-500 hover:underline">
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <input
            type="text"
            placeholder="Enter ingredients separated by commas (e.g. chicken, rice, broccoli)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full border p-2 rounded mb-4"
          />

          <div className="flex gap-4 mb-4">
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="border p-2 rounded"
            >
              <option>Breakfast</option>
              <option>Lunch</option>
              <option>Dinner</option>
              <option>Snack</option>
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleMealPlan}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Meal Plan'}
            </button>
            <button
              onClick={handleRecipe}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Recipe'}
            </button>
          </div>
        </div>

        {mealPlan && (
          <div className="grid gap-4">
            <h2 className="text-xl font-bold">Meal Plan</h2>
            <p className="text-gray-500 text-sm">{mealPlan.notes} — Total: {mealPlan.total_calories} calories</p>
            {mealPlan.meals.map((meal, i) => (
              <div key={i} className="bg-white p-5 rounded-lg shadow">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">{meal.name}</h3>
                  <span className="text-sm text-gray-400">{meal.meal_type}</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">{meal.instructions}</p>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>{meal.calories} cal</span>
                  <span>{meal.protein_g}g protein</span>
                  <span>{meal.carbs_g}g carbs</span>
                  <span>{meal.fat_g}g fat</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {recipe && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-2">{recipe.recipe_name}</h2>
            <p className="text-sm text-gray-400 mb-4">
              Prep: {recipe.prep_time_minutes} min | Cook: {recipe.cook_time_minutes} min | Serves: {recipe.servings}
            </p>
            <h3 className="font-semibold mb-2">Ingredients</h3>
            <ul className="text-sm text-gray-600 mb-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing.quantity} {ing.item}</li>
              ))}
            </ul>
            <h3 className="font-semibold mb-2">Instructions</h3>
            <ol className="text-sm text-gray-600 mb-4">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="mb-1">{step}</li>
              ))}
            </ol>
            <p className="text-sm text-blue-500">{recipe.tips}</p>
          </div>
        )}
      </div>
    </div>
  )
}