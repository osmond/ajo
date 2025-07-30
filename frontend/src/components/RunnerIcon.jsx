import React from 'react';

export default function RunnerIcon({ className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="7" cy="4" r="2" />
      <path d="M5 8l4 3-1 4 3 5" />
      <path d="M9 8l4-1 3 2" />
    </svg>
  );
}
