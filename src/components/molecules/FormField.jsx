import React from "react"
import Label from "@/components/atoms/Label"
import Input from "@/components/atoms/Input"
import { cn } from "@/utils/cn"

const FormField = ({ label, placeholder, required = false, className, ...props }) => {
  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  )
}

export default FormField