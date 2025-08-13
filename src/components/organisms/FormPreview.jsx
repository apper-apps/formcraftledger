import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
// Function to evaluate if a field should be visible based on conditions
const evaluateConditions = (field, formData) => {
  if (!field.logic?.conditions?.length) return true
  
  const { conditions, operator = 'AND' } = field.logic
  
  const results = conditions.map(condition => {
    const fieldValue = formData[`field-${condition.fieldId}`] || ''
    
    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value
      case 'not_equals':
        return fieldValue !== condition.value
      case 'contains':
        return fieldValue.toLowerCase().includes(condition.value.toLowerCase())
      case 'not_empty':
        return fieldValue.trim() !== ''
      case 'empty':
        return fieldValue.trim() === ''
      default:
        return false
    }
  })
  
  return operator === 'AND' ? results.every(Boolean) : results.some(Boolean)
}
const FormPreview = ({ form }) => {
  const [formData, setFormData] = useState({})
  
  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    alert("Form submitted! (This is a preview)")
  }
  
  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Reset form data when form changes
  useEffect(() => {
    setFormData({})
  }, [form.fields])
  
  // Get visible fields based on conditional logic
  const visibleFields = form.fields
    .filter(field => evaluateConditions(field, formData))
    .sort((a, b) => a.order - b.order)

  return (
    <div className="w-2/5 bg-white border-l border-gray-200 shadow-xl">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="Eye" className="text-primary" size={20} />
          <h3 className="font-bold text-gray-800">Live Preview</h3>
        </div>
        <p className="text-xs text-gray-600">See how your form looks to users</p>
      </div>
      
      <div className="p-6 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="max-w-md mx-auto">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Form Header */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{form.title}</h2>
              <p className="text-sm text-gray-600">Fill out this form to get started</p>
            </div>

            {/* Form Fields */}
{form.fields.length > 0 ? (
              <>
                {visibleFields.map((field) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FormField
                      label={field.label}
                      placeholder={field.placeholder}
                      required={field.required}
                      type={field.type}
                      options={field.options}
                      name={`field-${field.id}`}
                      value={formData[`field-${field.id}`] || ''}
                      onChange={(e) => {
                        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
                        handleInputChange(`field-${field.id}`, value)
                      }}
                    />
                    </motion.div>
                  ))}
                
                <Button 
                  type="submit" 
                  className="w-full"
                >
                  Submit Form
                </Button>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <ApperIcon name="FileText" size={48} className="mx-auto mb-4" />
                <p className="text-sm">Your form preview will appear here</p>
              </div>
            )}
          </motion.form>
        </div>
      </div>
    </div>
  )
}

export default FormPreview