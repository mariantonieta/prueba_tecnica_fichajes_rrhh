import React from 'react';
import { Label } from './label';

interface TextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  id?: string;
  helperText?: string;
}

export default function TextArea({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  disabled = false,
  required = false,
  error,
  className = "",
  id,
  helperText,
}: TextAreaProps) {
  const baseStyles = "w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200 resize-none font-sans";
  const normalStyles = "border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400";
  const errorStyles = "border-red-500 focus:border-red-500 focus:ring-red-500 bg-white text-gray-900 placeholder-gray-400";
  const disabledStyles = "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed placeholder-gray-400";

  const textareaStyles = `
    ${baseStyles}
    ${error ? errorStyles : normalStyles}
    ${disabled ? disabledStyles : ""}
    ${className}
  `;

  return (
    <div className="space-y-2">
      {label && (
        <Label
          htmlFor={id}
          className={`${error ? 'text-red-700' : 'text-gray-700'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        required={required}
        className={textareaStyles}
      />
      
      {(error || helperText) && (
        <p className={`text-sm font-medium ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}