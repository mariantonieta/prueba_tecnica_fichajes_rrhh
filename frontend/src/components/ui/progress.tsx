import React from "react";

interface ProgressProps {
  value: number;
  variant?: "default" | "destructive" | "warning" | "success";
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  variant = "default",
  className = "",
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const variantColors = {
    default: "bg-blue-500",
    destructive: "bg-red-500",
    warning: "bg-yellow-500",
    success: "bg-green-500",
  };

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${variantColors[variant]}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};
