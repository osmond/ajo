import React from "react";

export function Card({ className = "", children }) {
  return (
    <div
      className={
        "rounded-xl bg-card text-card-foreground shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-within:shadow-md " +
        className
      }
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
