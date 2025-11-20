import React from 'react'
import Header from './components/Header'
import Inventory from './components/Inventory'
import Sales from './components/Sales'
import Stats from './components/Stats'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-blue-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <Inventory />
          <Sales />
        </div>
        <Stats />
      </main>
    </div>
  )
}

export default App