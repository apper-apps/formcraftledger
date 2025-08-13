import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Label from '@/components/atoms/Label'
import Input from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const ConditionBuilder = ({ field, form, isVisible, onClose, onSave }) => {
  const [conditions, setConditions] = useState([])
  const [operator, setOperator] = useState('AND')

  // Initialize conditions from field logic
  useEffect(() => {
    if (field?.logic?.conditions) {
      setConditions(field.logic.conditions)
      setOperator(field.logic.operator || 'AND')
    } else {
      setConditions([])
      setOperator('AND')
    }
  }, [field])

  // Get available fields that come before current field
  const availableFields = form.fields
    .filter(f => f.order < field?.order && ['text', 'email', 'select', 'radio'].includes(f.type))
    .sort((a, b) => a.order - b.order)

  const addCondition = () => {
    const newCondition = {
      fieldId: availableFields[0]?.id || '',
      operator: 'equals',
      value: ''
    }
    setConditions([...conditions, newCondition])
  }

  const updateCondition = (index, updates) => {
    const updatedConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    )
    setConditions(updatedConditions)
  }

  const removeCondition = (index) => {
    setConditions(conditions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    const logic = conditions.length > 0 ? {
      conditions,
      operator
    } : null

    onSave({ logic })
    onClose()
  }

  const getFieldOptions = (fieldId) => {
    const targetField = form.fields.find(f => f.id === fieldId)
    if (targetField?.type === 'select' || targetField?.type === 'radio') {
      return targetField.options || []
    }
    return []
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Conditional Logic</h3>
              <p className="text-sm text-gray-600 mt-1">
                Show "{field?.label}" only when conditions are met
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {availableFields.length === 0 ? (
              <div className="text-center py-12">
                <ApperIcon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Previous Fields</h4>
                <p className="text-gray-600">
                  Add some fields before this one to create conditional logic rules.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Conditions */}
                <div className="space-y-4">
                  {conditions.map((condition, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {index === 0 ? 'Show this field if:' : operator}
                        </span>
                        {conditions.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCondition(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <ApperIcon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {/* Field Selection */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1">Field</Label>
                          <select
                            value={condition.fieldId}
                            onChange={(e) => updateCondition(index, { fieldId: e.target.value, value: '' })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            <option value="">Select field...</option>
                            {availableFields.map(field => (
                              <option key={field.id} value={field.id}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Operator Selection */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1">Condition</Label>
                          <select
                            value={condition.operator}
                            onChange={(e) => updateCondition(index, { operator: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                          >
                            <option value="equals">equals</option>
                            <option value="not_equals">does not equal</option>
                            <option value="contains">contains</option>
                            <option value="not_empty">is not empty</option>
                            <option value="empty">is empty</option>
                          </select>
                        </div>

                        {/* Value Input */}
                        <div>
                          <Label className="text-xs text-gray-600 mb-1">Value</Label>
                          {condition.operator === 'not_empty' || condition.operator === 'empty' ? (
                            <Input
                              disabled
                              placeholder="No value needed"
                              className="text-sm"
                            />
                          ) : getFieldOptions(condition.fieldId).length > 0 ? (
                            <select
                              value={condition.value}
                              onChange={(e) => updateCondition(index, { value: e.target.value })}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                            >
                              <option value="">Select value...</option>
                              {getFieldOptions(condition.fieldId).map((option, idx) => (
                                <option key={idx} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              value={condition.value}
                              onChange={(e) => updateCondition(index, { value: e.target.value })}
                              placeholder="Enter value..."
                              className="text-sm"
                            />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Add Condition Button */}
                <Button
                  variant="outline"
                  onClick={addCondition}
                  className="w-full border-dashed border-2 border-gray-300 text-gray-600 hover:border-primary hover:text-primary py-3"
                >
                  <ApperIcon name="Plus" size={16} className="mr-2" />
                  Add Condition
                </Button>

                {/* Operator Selection */}
                {conditions.length > 1 && (
                  <div className="border-t border-gray-200 pt-6">
                    <Label className="text-sm font-medium text-gray-700 mb-3">
                      Condition Logic
                    </Label>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="AND"
                          checked={operator === 'AND'}
                          onChange={(e) => setOperator(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">AND (all conditions must be true)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="OR"
                          checked={operator === 'OR'}
                          onChange={(e) => setOperator(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-sm">OR (any condition can be true)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              {conditions.length === 0
                ? "This field will always be visible"
                : `${conditions.length} condition${conditions.length !== 1 ? 's' : ''} configured`
              }
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={availableFields.length === 0}>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Logic
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ConditionBuilder