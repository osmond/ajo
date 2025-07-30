import React from "react";

export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={
        "rounded-2xl bg-card text-card-foreground shadow-sm transition-shadow transition-transform hover:-translate-y-0.5 hover:shadow-md focus-within:shadow-md " +
        className
      }
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }) {
  return <div className={"flex flex-col space-y-1.5 p-6 " + className}>{children}</div>;
}

export function CardTitle({ className = "", children }) {
  return (
    <h3 className={"text-xl font-semibold leading-snug " + className}>
      {children}
    </h3>
  );
}

export function CardContent({ className = "", children }) {
  return <div className={"p-6 pt-0 " + className}>{children}</div>;
}
