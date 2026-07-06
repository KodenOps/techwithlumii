const BRASS = '#B78A46'; 

const createAvatar = (initials: string) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="120" height="120" fill="#15181F"/>
  <circle cx="60" cy="60" r="59" fill="none" stroke="${BRASS}" stroke-opacity="0.4" stroke-width="1"/>
  <text x="60" y="70" fill="#FAF9F6" font-family="Georgia, serif" font-size="30" text-anchor="middle">${initials}</text>
</svg>`)}`;

export default createAvatar;