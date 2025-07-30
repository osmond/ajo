import React, { useState } from "react"

export default function Tooltip({ children, text, position = "top" }) {
  const [visible, setVisible] = useState(false)

  const positions = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2"
  }

  return (
    <div className="relative flex items-center"
         onMouseEnter={() => setVisible(true)}
         onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className={`absolute ${positions[position]} px-2 py-1 rounded bg-gray-900 text-white text-xs whitespace-nowrap shadow-lg z-50`}>
          {text}
        </div>
      )}
    </div>
  )
}
