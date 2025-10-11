import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

interface SelectItemProps
  extends React.OptionHTMLAttributes<HTMLOptionElement> {
  children: React.ReactNode;
}

interface SelectValueProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  value?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, ...props }, ref) => (
    <select
      {...props}
      ref={ref}
      className={`border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors ${
        className || ""
      }`}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  children,
  className,
  ...props
}) => (
  <div {...props} className={`cursor-pointer ${className || ""}`}>
    {children}
  </div>
);

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    {...props}
    className={`mt-1 bg-white border border-gray-200 rounded-md shadow-sm ${
      className || ""
    }`}
  >
    {children}
  </div>
);

export const SelectItem: React.FC<SelectItemProps> = ({
  children,
  className,
  ...props
}) => (
  <option {...props} className={`${className || ""}`}>
    {children}
  </option>
);

export const SelectValue: React.FC<SelectValueProps> = ({
  placeholder,
  value,
  className,
  ...props
}) => (
  <div {...props} className={`text-gray-700 ${className || ""}`}>
    {value || placeholder}
  </div>
);
