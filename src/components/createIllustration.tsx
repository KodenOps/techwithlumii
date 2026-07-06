// --- Refined abstract illustration generator: gradient mesh + fine grid ---


const BRASS = '#B78A46'; 
 const createIllustration = (label: string, from: string, to: string) => {
  const safeLabel = label.replace(/&/g, 'and').replace(/</g, '').replace(/>/g, '');
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
    <defs>
      <linearGradient id="g-${safeLabel}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
      <radialGradient id="r-${safeLabel}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid-${safeLabel}" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.06" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="1200" height="800" fill="url(#g-${safeLabel})"/>
    <rect width="1200" height="800" fill="url(#grid-${safeLabel})"/>
    <rect width="1200" height="800" fill="url(#r-${safeLabel})"/>
    <circle cx="900" cy="220" r="220" fill="#ffffff" fill-opacity="0.05"/>
    <circle cx="260" cy="600" r="260" fill="#000000" fill-opacity="0.10"/>
    <text x="64" y="736" fill="#ffffff" fill-opacity="0.82" font-family="Georgia, serif" font-size="30" letter-spacing="0.5">${safeLabel}</text>
    <line x1="64" y1="700" x2="140" y2="700" stroke="${BRASS}" stroke-width="2"/>
  </svg>`)}`;
};

export default createIllustration;