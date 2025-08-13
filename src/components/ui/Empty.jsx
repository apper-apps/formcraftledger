import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ 
  title = "No data found", 
  description = "Get started by creating your first item", 
  actionLabel = "Get Started",
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="text-gray-400" size={32} />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
        <p className="text-gray-600 mb-8 leading-relaxed">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="flex items-center gap-2 mx-auto">
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </motion.div>
    </div>
  )
}

export default Empty