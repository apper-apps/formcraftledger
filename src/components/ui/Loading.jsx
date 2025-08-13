import React from "react"
import { motion } from "framer-motion"

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div
        className="flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </div>
        <span className="text-gray-600 font-medium">Loading form builder...</span>
      </motion.div>
    </div>
  )
}

export default Loading