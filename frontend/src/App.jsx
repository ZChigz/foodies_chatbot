import React from 'react'
import FoodiesChatWidget from './FoodiesChatWidget'

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-amber-600 mb-4">
          Foodies Chat Widget Demo
        </h1>
        <p className="text-gray-600">
          Check the bottom-right corner 👉
        </p>
      </div>
      <FoodiesChatWidget />
    </div>
  )
}

export default App
