import React, { createContext, useContext, useState } from "react";
import { Button } from "./Button";

const TabsContext = createContext();

export function Tabs({
  defaultValue,
  value: controlledValue,
  onValueChange,
  className = "",
  children,
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const setValue = onValueChange ?? setInternalValue;
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className = "", children }) {
  return (
    <div className={"inline-flex items-center justify-center rounded-md bg-muted p-1 " + className}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className = "", children }) {
  const ctx = useContext(TabsContext);
  const active = ctx.value === value;
  return (
    <Button
      onClick={() => ctx.setValue(value)}
      variant="ghost"
      className={
        "px-3 py-1.5 text-sm border-b-2 transition-colors " +
        (active
          ? "border-accent text-primary"
          : "border-transparent text-muted-foreground hover:border-accent") +
        " " +
        className
      }
    >
      {children}
    </Button>
  );
}

export function TabsContent({ value, className = "", children }) {
  const ctx = useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div className={"mt-2 " + className}>{children}</div>;
}
