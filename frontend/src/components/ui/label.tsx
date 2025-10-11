import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, className, ...props }, ref) => (
    <label
      {...props}
      ref={ref}
      className={`block mb-1 font-medium text-gray-700 ${className || ""}`}
    >
      {children}
    </label>
  )
);

Label.displayName = "Label";
