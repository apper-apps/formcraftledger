import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ label, placeholder, required = false, type, options = [], className, ...props }) => {
  const renderField = () => {
    switch (type) {
      case 'radio':
        return (
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${props.name || 'radio'}-${index}`}
                  name={props.name || 'radio-group'}
                  value={option.value}
                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary focus:ring-2"
                  {...props}
                />
                <label 
                  htmlFor={`${props.name || 'radio'}-${index}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        )
      
      case 'select':
        return (
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            required={required}
            {...props}
          >
            <option value="">{placeholder || 'Select an option...'}</option>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      
      case 'textarea':
        return (
          <textarea
            placeholder={placeholder}
            required={required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-vertical"
            {...props}
          />
        )
      
      default:
        return (
          <Input
            placeholder={placeholder}
            required={required}
            type={type}
            {...props}
          />
        )
    }
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
    </div>
  )
}

export default FormField