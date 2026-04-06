import React from 'react';

export default function DojoLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Zen dot */}
      <circle
        cx="50"
        cy="12"
        r="5"
        fill="none"
        stroke="#EA4335"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Body dome */}
      <path
        d="M30 58 C30 32, 70 32, 70 58"
        fill="none"
        stroke="#4285F4"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Body detail lines */}
      <line
        x1="44"
        y1="40"
        x2="44"
        y2="58"
        stroke="#FBBC04"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="56"
        y1="40"
        x2="56"
        y2="58"
        stroke="#FBBC04"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Crossed legs / base - figure 8 oval */}
      <path
        d="M8 72 C8 60, 40 56, 50 64 C60 56, 92 60, 92 72 C92 84, 60 86, 50 78 C40 86, 8 84, 8 72 Z"
        fill="none"
        stroke="#34A853"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
