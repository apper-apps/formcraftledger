import React from "react"
import { motion } from "framer-motion"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const FormPreview = ({ form }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate form submission
    alert("Form submitted! (This is a preview)")
  }

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
                {form.fields
                  .sort((a, b) => a.order - b.order)
                  .map((field) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FormField
                        label={field.label}
                        placeholder={field.placeholder}
                        required={field.required}
                        type={field.type}
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