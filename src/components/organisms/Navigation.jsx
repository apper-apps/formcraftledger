import React from "react"
import { motion } from "framer-motion"
import Button from "@/components/atoms/Button"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const Navigation = ({ form, onUpdateForm }) => {
  const handleTitleChange = (e) => {
    onUpdateForm({
      ...form,
      title: e.target.value
    })
  }

  const handlePublish = () => {
    if (!form.title.trim()) {
      toast.error("Please enter a form title before publishing")
      return
    }

    if (form.fields.length === 0) {
      toast.error("Add at least one field before publishing")
      return
    }

    // Simulate form publishing
    const publishedUrl = `https://formcraft.app/forms/${Date.now()}`
    toast.success("Form published successfully!")
    
    // Copy to clipboard
    navigator.clipboard.writeText(publishedUrl).then(() => {
      toast.info("Form URL copied to clipboard!")
    }).catch(() => {
      console.log("Could not copy to clipboard")
    })
  }

  return (
    <nav className="h-16 bg-white border-b border-gray-200 shadow-sm px-6 flex items-center justify-between">
      {/* Left Side - Logo and Form Title */}
      <div className="flex items-center gap-6">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FormCraft
            </h1>
            <p className="text-xs text-gray-500">Professional Form Builder</p>
          </div>
        </motion.div>

        <div className="h-8 w-px bg-gray-300" />

        <div className="flex items-center gap-3">
          <ApperIcon name="Edit3" className="text-gray-400" size={16} />
          <Input
            value={form.title}
            onChange={handleTitleChange}
            placeholder="Untitled Form"
            className="w-64 h-9 text-lg font-semibold border-0 bg-transparent focus:bg-white focus:border-2 focus:border-accent rounded-lg px-3"
          />
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Users" size={16} />
          <span>{form.fields.length} field{form.fields.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="h-8 w-px bg-gray-300" />

        <Button
          onClick={handlePublish}
          className="flex items-center gap-2"
          disabled={!form.title.trim() || form.fields.length === 0}
        >
          <ApperIcon name="Send" size={16} />
          Publish Form
        </Button>
      </div>
    </nav>
  )
}

export default Navigation