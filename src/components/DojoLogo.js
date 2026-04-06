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
      {/* Zen dot — single brush dab */}
      <circle cx="50" cy="8" r="11" fill="#1D1D1F" />
      {/* Body dome — broad brush arc */}
      <path
        d="M28 60 C28 30, 72 30, 72 60"
        stroke="#1D1D1F"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Crossed legs / base — fluid figure-8 */}
      <path
        d="M8 74 C8 62, 38 56, 50 65 C62 56, 92 62, 92 74 C92 86, 62 88, 50 79 C38 88, 8 86, 8 74 Z"
        stroke="#1D1D1F"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
