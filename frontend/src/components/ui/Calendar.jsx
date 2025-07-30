import React from "react";

export function Calendar({ className = "", ...props }) {
  return (
    <input
      type="date"
      className={"rounded-md border px-3 py-2 " + className}
      {...props}
    />
  );
}
