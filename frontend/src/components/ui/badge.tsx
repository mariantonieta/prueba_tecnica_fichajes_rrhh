import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "blue"
    | "destructive";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className = "", ...props }, ref) => {
    let baseClasses =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";

    let variantClasses = "";
    switch (variant) {
      case "success":
        variantClasses = "bg-green-100 text-green-800";
        break;
      case "warning":
        variantClasses = "bg-yellow-100 text-yellow-800";
        break;
      case "error":
        variantClasses = "bg-red-100 text-red-800";
        break;
      case "blue":
        variantClasses = "bg-blue-100 text-blue-800";
        break;
      case "destructive":
        variantClasses = "bg-red-100 text-red-600";
        break;
      default:
        variantClasses = "bg-gray-100 text-gray-800";
        break;
    }

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";
