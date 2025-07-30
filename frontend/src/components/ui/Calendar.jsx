import React from "react";
import { Input } from "./Input";

export function Calendar({ className = "", ...props }) {
  return (
    <Input
      type="date"
      className={className}
      {...props}
    />
  );
}
