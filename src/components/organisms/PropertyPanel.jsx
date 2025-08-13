import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";

const PropertyPanel = ({ field, onUpdate, onClose, isVisible }) => {
  const handleChange = (property, value) => {
    onUpdate({ [property]: value })
  }

  const handleOptionChange = (index, property, value) => {
    const updatedOptions = [...(field.options || [])]
    updatedOptions[index] = { ...updatedOptions[index], [property]: value }
    handleChange('options', updatedOptions)
  }

  const addOption = () => {
    const currentOptions = field.options || []
    const newOption = {
      label: `Option ${currentOptions.length + 1}`,
      value: `option${currentOptions.length + 1}`
    }
    handleChange('options', [...currentOptions, newOption])
  }

  const removeOption = (index) => {
    const updatedOptions = [...(field.options || [])]
    updatedOptions.splice(index, 1)
    handleChange('options', updatedOptions)
  }

  const isChoiceField = field?.type === 'radio' || field?.type === 'select'

  return (
    <AnimatePresence>
    {isVisible && field && <>
        {/* Backdrop */}
        <motion.div
            initial={{
                opacity: 0
            }}
            animate={{
                opacity: 1
            }}
            exit={{
                opacity: 0
            }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose} />
        {/* Panel */}
        <motion.div
            initial={{
                x: "100%"
            }}
            animate={{
                x: 0
            }}
            exit={{
                x: "100%"
            }}
            transition={{
                type: "spring",
                damping: 25,
                stiffness: 300
            }}
            className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl border-l border-gray-200 z-50 overflow-y-auto">
            <div
                className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-800">Field Properties</h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <ApperIcon name="X" size={16} />
                    </Button>
                </div>
                <p className="text-xs text-gray-600">Customize your form field</p>
            </div>
            <div className="p-4 space-y-6">
                {/* Field Type */}
                <div>
                    <Label>Field Type</Label>
                    <div className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <ApperIcon name="Type" size={16} className="text-primary" />
                            <span className="font-medium text-gray-700 capitalize">
                                {field.type === "textarea" ? "Text Area" : field.type}
                            </span>
                        </div>
                    </div>
                </div>
                {/* Field Label */}
                <div>
                    <Label>Field Label</Label>
                    <Input
                        value={field.label}
                        onChange={e => handleChange("label", e.target.value)}
                        placeholder="Enter field label" />
                </div>
                {/* Placeholder Text - Only for non-choice fields */}
                {!isChoiceField && <div>
                    <Label>Placeholder Text</Label>
                    <Input
                        value={field.placeholder}
                        onChange={e => handleChange("placeholder", e.target.value)}
                        placeholder="Enter placeholder text" />
                </div>}
                {/* Options Management - Only for choice fields */}
                {isChoiceField && <div>
                    <div className="flex items-center justify-between mb-3">
                        <Label>Answer Options</Label>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addOption}
                            className="h-8 px-3 text-xs">
                            <ApperIcon name="Plus" size={12} className="mr-1" />Add Option
                                                </Button>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {(field.options || []).map(
                            (option, index) => <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                <div className="flex-1">
                                    <Input
                                        value={option.label}
                                        onChange={e => handleOptionChange(index, "label", e.target.value)}
                                        placeholder="Option label"
                                        className="text-sm h-8" />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeOption(index)}
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    disabled={(field.options || []).length <= 1}>
                                    <ApperIcon name="Minus" size={12} />
                                </Button>
                            </div>
                        )}
                        {(!field.options || field.options.length === 0) && <div className="text-center py-4 text-gray-500 text-sm">No options added yet
                                                  </div>}
                    </div>
                </div>}
                {/* Required Field */}
                <div>
                    <div className="flex items-center justify-between">
                        <Label>Required Field</Label>
                        <button
                            type="button"
                            onClick={() => handleChange("required", !field.required)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${field.required ? "bg-primary" : "bg-gray-200"}`}>
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${field.required ? "translate-x-6" : "translate-x-1"}`} />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Make this field mandatory for form submission
                                        </p>
                </div>
                {/* Preview */}
                {/* Preview */}
                <div>
                    <Label>Preview</Label>
                    <div
                        className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <div className="space-y-2">
                            <Label>
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                            </Label>
                            {field.type === "radio" && <div className="space-y-2">
                                {(field.options || []).map(
                                    (option, index) => <div key={index} className="flex items-center space-x-2">
                                        <input type="radio" disabled className="w-4 h-4 text-primary border-gray-300" />
                                        <span className="text-sm text-gray-600">{option.label}</span>
                                    </div>
                                )}
                            </div>}
                            {field.type === "select" && <select
                                disabled
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg opacity-75 cursor-not-allowed">
                                <option>Select an option...</option>
                                {(field.options || []).map((option, index) => <option key={index}>{option.label}</option>)}
                            </select>}
                            {!isChoiceField && <Input
                                placeholder={field.placeholder}
                                disabled
                                type={field.type}
                                className="opacity-75" />}
                        </div>
                    </div>
                </div>
            </div></motion.div>
    </>}
</AnimatePresence>
  )
}

export default PropertyPanel