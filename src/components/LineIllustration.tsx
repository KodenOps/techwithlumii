import React from "react";
const BRASS = '#B78A46';
function LineIllustration({ className, accent = BRASS }: { className?: string; accent?: string }) {
  return (
    <svg viewBox="0 0 220 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="204" height="104" rx="18" stroke={accent} strokeOpacity="0.35" strokeWidth="1" />
      <path d="M40 84C68 52 94 50 116 72C140 96 168 92 180 58" stroke={accent} strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="84" r="5" fill={accent} />
      <circle cx="180" cy="58" r="5" fill={accent} />
      <path d="M48 24H172" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
export default LineIllustration