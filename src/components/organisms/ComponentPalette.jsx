import React from "react"
import DraggableField from "@/components/molecules/DraggableField"
import ApperIcon from "@/components/ApperIcon"

const ComponentPalette = ({ onFieldDragStart }) => {
  const fieldTypes = [
    { type: "text", icon: "Type", label: "Text Input" },
    { type: "email", icon: "Mail", label: "Email" },
    { type: "number", icon: "Hash", label: "Number" },
    { type: "textarea", icon: "AlignLeft", label: "Text Area" },
    { type: "select", icon: "ChevronDown", label: "Dropdown" },
    { type: "radio", icon: "Circle", label: "Multiple Choice" },
    { type: "checkbox", icon: "Check", label: "Checkbox" },
    { type: "date", icon: "Calendar", label: "Date Picker" },
  ]

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 shadow-lg">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-2 mb-2">
          <ApperIcon name="Package" className="text-primary" size={20} />
          <h3 className="font-bold text-gray-800">Components</h3>
        </div>
        <p className="text-xs text-gray-600">Drag fields to your form</p>
      </div>
      
      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100vh-120px)]">
        {fieldTypes.map((field) => (
          <DraggableField
            key={field.type}
            type={field.type}
            icon={field.icon}
            label={field.label}
            onDragStart={onFieldDragStart}
          />
        ))}
      </div>
    </div>
  )
}

export default ComponentPalette