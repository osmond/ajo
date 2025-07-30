import React, { createContext, useContext, useState } from "react";
import { Slot } from "@radix-ui/react-slot";

const PopoverContext = createContext();

export function Popover({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export const PopoverTrigger = React.forwardRef(
  ({ asChild = false, ...props }, ref) => {
    const { open, setOpen } = useContext(PopoverContext);
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        {...props}
      />
    );
  }
);
PopoverTrigger.displayName = "PopoverTrigger";

export const PopoverContent = React.forwardRef(
  ({ className = "", ...props }, ref) => {
    const { open } = useContext(PopoverContext);
    if (!open) return null;
    return (
      <div
        ref={ref}
        className={
          "absolute z-50 mt-2 rounded-md border bg-popover p-4 text-popover-foreground shadow-md " +
          className
        }
        {...props}
      />
    );
  }
);
PopoverContent.displayName = "PopoverContent";
