import React from "react"
import { motion } from "framer-motion"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const FormFieldComponent = ({ field, isSelected, onSelect, onUpdate, onDelete }) => {
  return (
    <motion.div
      className={cn(
        "relative group rounded-lg border-2 transition-all duration-200 cursor-pointer mb-4",
        isSelected 
          ? "border-accent bg-accent/5 shadow-lg" 
          : "border-transparent hover:border-gray-300 hover:shadow-md"
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.01 }}
    >
      <div className="p-4">
        <FormField
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          type={field.type}
          disabled
        />
      </div>

      {/* Field Controls */}
      <div className={cn(
        "absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
        isSelected && "opacity-100"
      )}>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-gray-300 hover:border-red-400 hover:text-red-600"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -left-2 w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg flex items-center justify-center"
        >
          <ApperIcon name="Check" size={10} className="text-white" />
        </motion.div>
      )}
    </motion.div>
  )
}

export default FormFieldComponent