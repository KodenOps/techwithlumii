// Pure background texture (no label/line) used as a faint section backdrop
export const createTexture = (from: string, to: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <pattern id="tgrid" width="56" height="56" patternUnits="userSpaceOnUse">
      <path d="M56 0H0V56" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="800" fill="url(#tg)"/>
  <rect width="1200" height="800" fill="url(#tgrid)"/>
  <circle cx="1000" cy="120" r="260" fill="#ffffff" fill-opacity="0.05"/>
</svg>`)}`;

