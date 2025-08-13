import React from "react"
import { Routes, Route } from "react-router-dom"
import FormBuilderPage from "@/components/pages/FormBuilderPage"

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<FormBuilderPage />} />
        <Route path="/builder" element={<FormBuilderPage />} />
      </Routes>
    </div>
  )
}

export default App