import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DndContext, DragOverlay, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ApperIcon from "@/components/ApperIcon";
import FormFieldComponent from "@/components/organisms/FormFieldComponent";
import { cn } from "@/utils/cn";

const FormEditor = ({ form, onUpdateForm, onSelectField, selectedField }) => {
const [dragOverIndex, setDragOverIndex] = useState(null)
  const [activeField, setActiveField] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Internal field reordering via drag and drop
  const handleDragStart = (event) => {
    const { active } = event
    const field = form.fields.find(f => f.id === active.id)
    setActiveField(field)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    setActiveField(null)

    if (!over) return

    if (active.id !== over.id) {
      const oldIndex = form.fields.findIndex(f => f.id === active.id)
      const newIndex = form.fields.findIndex(f => f.id === over.id)
      
      const reorderedFields = arrayMove(form.fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        order: index
      }))

      onUpdateForm({
        ...form,
        fields: reorderedFields
      })
    }
  }
  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    setDragOverIndex(null)
    
try {
      const fieldData = JSON.parse(e.dataTransfer.getData("application/json"))
      const newField = {
        ...fieldData,
        id: Date.now().toString(),
        order: dropIndex,
        // Add default options for choice fields
        ...(fieldData.type === 'radio' || fieldData.type === 'select' ? {
          options: [
            { label: 'Option 1', value: 'option1' },
            { label: 'Option 2', value: 'option2' },
            { label: 'Option 3', value: 'option3' }
          ]
        } : {})
      }

      const updatedFields = [...form.fields]
      updatedFields.splice(dropIndex, 0, newField)
      
      // Update order for all fields
      const reorderedFields = updatedFields.map((field, index) => ({
        ...field,
        order: index
      }))

      onUpdateForm({
        ...form,
        fields: reorderedFields
      })
    } catch (error) {
      console.error("Error parsing drop data:", error)
    }
  }

  const handleFieldUpdate = (fieldId, updates) => {
    const updatedFields = form.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    )
    onUpdateForm({
      ...form,
      fields: updatedFields
    })
  }

  const handleFieldDelete = (fieldId) => {
    const updatedFields = form.fields.filter(field => field.id !== fieldId)
    const reorderedFields = updatedFields.map((field, index) => ({
      ...field,
      order: index
    }))
    onUpdateForm({
      ...form,
      fields: reorderedFields
    })
  }

// External drag drop from palette (existing functionality)
  const DropZone = ({ index, isLast = false }) => (
    <div
      className={cn(
        "drop-zone min-h-[60px] flex items-center justify-center transition-all duration-300",
        dragOverIndex === index && "drag-over"
      )}
      onDragOver={(e) => handleDragOver(e, index)}
      onDragLeave={handleDragLeave}
      onDrop={(e) => handleDrop(e, index)}
    >
      {dragOverIndex === index && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 text-accent font-medium px-4 py-2 bg-white/80 rounded-lg backdrop-blur-sm"
        >
          <ApperIcon name="Plus" size={16} />
          Drop field here
        </motion.div>
      )}
    </div>
  )

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{form.title}</h2>
            <p className="text-gray-600">Fill out this form to get started</p>
          </div>
{/* Form Content */}
          <div className="p-6">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={form.fields.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <DropZone index={0} />
                
                <AnimatePresence mode="popLayout">
                  {form.fields
                    .sort((a, b) => a.order - b.order)
                    .map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        <FormFieldComponent
                          field={field}
                          isSelected={selectedField?.id === field.id}
                          onSelect={() => onSelectField(field)}
                          onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                          onDelete={() => handleFieldDelete(field.id)}
                        />
                        <DropZone index={index + 1} />
                      </motion.div>
                    ))}
                </AnimatePresence>
              </SortableContext>
              
              <DragOverlay>
                {activeField ? (
                  <div className="transform rotate-2 opacity-90 scale-105">
                    <FormFieldComponent
                      field={activeField}
                      isSelected={false}
                      onSelect={() => {}}
                      onUpdate={() => {}}
                      onDelete={() => {}}
                    />
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>

            {form.fields.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500"
              >
                <ApperIcon name="MousePointer" size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Start building your form</h3>
                <p className="text-sm">Drag and drop components from the left panel to create your form</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormEditor