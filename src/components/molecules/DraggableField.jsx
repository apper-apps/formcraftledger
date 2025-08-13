import React, { useState } from "react"
import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"
import { cn } from "@/utils/cn"

const DraggableField = ({ type, icon, label, onDragStart }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragStart = (e) => {
    setIsDragging(true)
    const fieldData = {
      type,
      label: `${label} Field`,
      placeholder: `Enter your ${label.toLowerCase()}...`,
      required: false,
      id: Date.now().toString()
    }
    e.dataTransfer.setData("application/json", JSON.stringify(fieldData))
    e.dataTransfer.effectAllowed = "copy"
    if (onDragStart) {
      onDragStart(fieldData)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={cn(
        "flex items-center gap-3 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-grab hover:border-accent hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]",
        isDragging && "opacity-50 rotate-2 scale-105"
      )}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-primary/20">
        <ApperIcon name={icon} size={18} className="text-primary" />
      </div>
      <span className="font-medium text-gray-700">{label}</span>
    </motion.div>
  )
}

export default DraggableField