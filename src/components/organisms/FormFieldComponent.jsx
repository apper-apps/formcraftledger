import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import FormField from "@/components/molecules/FormField"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"
import { toast } from "react-toastify"

const FormFieldComponent = ({ field, isSelected, onSelect, onUpdate, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: field.id,
    data: { field }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSelected && e.key === 'Delete' && !showDeleteConfirm) {
        e.preventDefault()
        setShowDeleteConfirm(true)
      }
      if (e.key === 'Escape' && showDeleteConfirm) {
        setShowDeleteConfirm(false)
      }
    }

    if (isSelected) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSelected, showDeleteConfirm])

  const handleDelete = () => {
    onDelete()
    toast.success(`${field.label || 'Field'} deleted successfully`)
    setShowDeleteConfirm(false)
  }

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false)
  }
return (
    <>
      <motion.div
        ref={setNodeRef}
        style={style}
        className={cn(
          "relative group rounded-lg border-2 transition-all duration-200 cursor-pointer mb-4",
          isSelected 
            ? "border-accent bg-accent/5 shadow-lg" 
            : "border-transparent hover:border-gray-300 hover:shadow-md",
          isDragging && "opacity-50 z-50 rotate-1 scale-105 shadow-xl"
        )}
        onClick={onSelect}
        whileHover={{ scale: isDragging ? 1 : 1.01 }}
      >
        {/* Drag Handle */}
        <div
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing",
            isSelected && "opacity-100",
            isDragging && "cursor-grabbing"
          )}
          {...attributes}
          {...listeners}
        >
          <div className="p-1 rounded bg-white/90 backdrop-blur-sm border border-gray-200 hover:border-gray-400 hover:bg-white">
            <ApperIcon name="GripVertical" size={14} className="text-gray-500" />
          </div>
        </div>

        <div className="p-4 pl-8">
        <FormField
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          type={field.type}
          options={field.options}
          name={`field-${field.id}`}
          disabled
        />
      </div>

{/* Delete Button */}
        <div className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isSelected && "opacity-100"
        )}>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-gray-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              setShowDeleteConfirm(true)
            }}
          >
            <ApperIcon name="X" size={14} />
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

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancelDelete}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Field</h3>
                <p className="text-sm text-gray-500">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete the field "<strong>{field.label || 'Untitled Field'}</strong>"?
            </p>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelDelete}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Delete
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}

export default FormFieldComponent