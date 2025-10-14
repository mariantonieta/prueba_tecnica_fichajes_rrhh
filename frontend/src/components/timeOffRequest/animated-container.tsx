import React from "react";

interface AnimatedContainerProps {
  show: boolean
  children: React.ReactNode
}

export default function AnimatedContainer({ show, children }: AnimatedContainerProps) {
  return (
    <div
      className={`
        transform transition-all duration-500 ease-in-out origin-top
        ${
          show
            ? "scale-y-100 opacity-100 translate-y-0"
            : "scale-y-0 opacity-0 -translate-y-4 h-0 overflow-hidden"
        }
      `}
    >
      {children}
    </div>
  )
}