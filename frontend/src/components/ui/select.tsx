import React from "react"

interface NativeSelectProps {
  id?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export function Select({
  id,
  value,
  onChange,
  required = false,
  disabled = false,
  children,
  className = "",
}: NativeSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 ${className}`}
    >
      {children}
    </select>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

export function SelectItem({ value, children }: SelectItemProps) {
  return <option value={value}>{children}</option>
}
