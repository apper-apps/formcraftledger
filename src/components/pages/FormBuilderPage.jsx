import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast, ToastContainer } from "react-toastify"
import Navigation from "@/components/organisms/Navigation"
import ComponentPalette from "@/components/organisms/ComponentPalette"
import FormEditor from "@/components/organisms/FormEditor"
import FormPreview from "@/components/organisms/FormPreview"
import PropertyPanel from "@/components/organisms/PropertyPanel"
import ConditionBuilder from "@/components/organisms/ConditionBuilder"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import { formsService } from "@/services/api/formsService"

const FormBuilderPage = () => {
  const [form, setForm] = useState({
    title: "Untitled Form",
    fields: []
  })
  const [selectedField, setSelectedField] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPropertyPanel, setShowPropertyPanel] = useState(false)
  const [showConditionBuilder, setShowConditionBuilder] = useState(false)
  const handleUpdateForm = (updatedForm) => {
    setForm(updatedForm)
  }

  const handleSelectField = (field) => {
    setSelectedField(field)
    setShowPropertyPanel(true)
  }

  const handleFieldUpdate = (updates) => {
if (selectedField) {
      const updatedFields = form.fields.map(field =>
        field.id === selectedField.id ? { 
          ...field, 
          ...updates,
          // Preserve options array structure for choice fields
          ...(updates.options ? { options: updates.options } : {}),
          // Preserve logic structure
          ...(updates.logic !== undefined ? { logic: updates.logic } : {})
        } : field
      )
      setForm({
        ...form,
        fields: updatedFields
      })
      setSelectedField({ 
        ...selectedField, 
        ...updates,
        ...(updates.options ? { options: updates.options } : {}),
        ...(updates.logic !== undefined ? { logic: updates.logic } : {})
      })
    }
  }

  const handleClosePropertyPanel = () => {
    setShowPropertyPanel(false)
    setSelectedField(null)
  }

  const handleFieldDragStart = (fieldData) => {
// Initialize logic property for new fields
    if (fieldData && !fieldData.logic) {
      fieldData.logic = null
    }
    console.log("Drag started for field:", fieldData.type)
  }

  if (loading) return <Loading />
  if (error) return <Error message={error} onRetry={() => setError(null)} />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-screen flex flex-col bg-gray-50"
    >
      {/* Navigation */}
      <Navigation form={form} onUpdateForm={handleUpdateForm} />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Component Palette */}
        <ComponentPalette onFieldDragStart={handleFieldDragStart} />

        {/* Form Editor */}
<FormEditor
          form={form}
          onUpdateForm={handleUpdateForm}
          onSelectField={handleSelectField}
          selectedField={selectedField}
        />

        {/* Live Preview */}
        <FormPreview form={form} />
      </div>

      {/* Property Panel */}
      <PropertyPanel
        field={selectedField}
        form={form}
        onUpdate={handleFieldUpdate}
        onClose={handleClosePropertyPanel}
        isVisible={showPropertyPanel}
      />

      {/* Condition Builder */}
      <ConditionBuilder
        field={selectedField}
        form={form}
        isVisible={showConditionBuilder}
        onClose={() => setShowConditionBuilder(false)}
        onSave={handleFieldUpdate}
      />

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </motion.div>
  )
}

export default FormBuilderPage