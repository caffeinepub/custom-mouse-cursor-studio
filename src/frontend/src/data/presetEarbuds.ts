export interface PresetEarbud {
  id: string;
  label: string;
  svg: string; // inline SVG as data URI
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const presets: PresetEarbud[] = [
  {
    id: "airpods-white",
    label: "AirPods White",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <!-- Left AirPod -->
      <g transform="translate(18,10)">
        <ellipse cx="14" cy="16" rx="10" ry="13" fill="#f5f5f7" stroke="#d1d1d6" stroke-width="1"/>
        <rect x="9" y="27" width="10" height="28" rx="5" fill="#f5f5f7" stroke="#d1d1d6" stroke-width="1"/>
        <circle cx="14" cy="16" r="4" fill="#e0e0e5"/>
      </g>
      <!-- Right AirPod -->
      <g transform="translate(72,10) scale(-1,1)">
        <ellipse cx="14" cy="16" rx="10" ry="13" fill="#f5f5f7" stroke="#d1d1d6" stroke-width="1"/>
        <rect x="9" y="27" width="10" height="28" rx="5" fill="#f5f5f7" stroke="#d1d1d6" stroke-width="1"/>
        <circle cx="14" cy="16" r="4" fill="#e0e0e5"/>
      </g>
    </svg>`),
  },
  {
    id: "airpods-black",
    label: "AirPods Black",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <g transform="translate(18,10)">
        <ellipse cx="14" cy="16" rx="10" ry="13" fill="#2c2c2e" stroke="#48484a" stroke-width="1"/>
        <rect x="9" y="27" width="10" height="28" rx="5" fill="#2c2c2e" stroke="#48484a" stroke-width="1"/>
        <circle cx="14" cy="16" r="4" fill="#1c1c1e"/>
      </g>
      <g transform="translate(72,10) scale(-1,1)">
        <ellipse cx="14" cy="16" rx="10" ry="13" fill="#2c2c2e" stroke="#48484a" stroke-width="1"/>
        <rect x="9" y="27" width="10" height="28" rx="5" fill="#2c2c2e" stroke="#48484a" stroke-width="1"/>
        <circle cx="14" cy="16" r="4" fill="#1c1c1e"/>
      </g>
    </svg>`),
  },
  {
    id: "earbuds-blue",
    label: "Sport Blue",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <!-- Left sport earbud -->
      <g transform="translate(14,8)">
        <circle cx="16" cy="20" r="15" fill="#0a84ff" stroke="#0060d0" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="#005fd4"/>
        <circle cx="16" cy="20" r="3" fill="#003fa0"/>
        <path d="M10 34 Q12 50 14 58" stroke="#0a84ff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="#0a84ff"/>
      </g>
      <!-- Right sport earbud -->
      <g transform="translate(106,8) scale(-1,1)">
        <circle cx="16" cy="20" r="15" fill="#0a84ff" stroke="#0060d0" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="#005fd4"/>
        <circle cx="16" cy="20" r="3" fill="#003fa0"/>
        <path d="M10 34 Q12 50 14 58" stroke="#0a84ff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="#0a84ff"/>
      </g>
    </svg>`),
  },
  {
    id: "earbuds-pink",
    label: "Rose Pink",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <g transform="translate(14,8)">
        <circle cx="16" cy="20" r="15" fill="#ff2d55" stroke="#d4224a" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="#c4163a"/>
        <circle cx="16" cy="20" r="3" fill="#8c0a28"/>
        <path d="M10 34 Q12 50 14 58" stroke="#ff2d55" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="#ff2d55"/>
      </g>
      <g transform="translate(106,8) scale(-1,1)">
        <circle cx="16" cy="20" r="15" fill="#ff2d55" stroke="#d4224a" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="#c4163a"/>
        <circle cx="16" cy="20" r="3" fill="#8c0a28"/>
        <path d="M10 34 Q12 50 14 58" stroke="#ff2d55" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="#ff2d55"/>
      </g>
    </svg>`),
  },
  {
    id: "earbuds-green",
    label: "Forest Green",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <g transform="translate(14,8)">
        <circle cx="16" cy="20" r="15" fill="#30d158" stroke="#24a344" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="#1e8f3f"/>
        <circle cx="16" cy="20" r="3" fill="#135e28"/>
        <path d="M10 34 Q12 50 14 58" stroke="#30d158" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="#30d158"/>
      </g>
      <g transform="translate(106,8) scale(-1,1)">
        <circle cx="16" cy="20" r="15" fill="#30d158" stroke="#24a344" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="#1e8f3f"/>
        <circle cx="16" cy="20" r="3" fill="#135e28"/>
        <path d="M10 34 Q12 50 14 58" stroke="#30d158" stroke-width="4" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="#30d158"/>
      </g>
    </svg>`),
  },
  {
    id: "earbuds-gold",
    label: "Gold Edition",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <!-- Left TWS earbud with wing tip -->
      <g transform="translate(14,6)">
        <ellipse cx="16" cy="22" rx="14" ry="18" fill="#ffd60a" stroke="#c9a800" stroke-width="1.5"/>
        <ellipse cx="16" cy="22" rx="7" ry="9" fill="#c9a800"/>
        <circle cx="16" cy="22" r="3.5" fill="#8a7000"/>
        <path d="M26 12 Q34 6 30 18" stroke="#ffd60a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M10 38 Q11 52 12 60" stroke="#c9a800" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="12" cy="62" r="3.5" fill="#ffd60a"/>
      </g>
      <!-- Right TWS earbud -->
      <g transform="translate(106,6) scale(-1,1)">
        <ellipse cx="16" cy="22" rx="14" ry="18" fill="#ffd60a" stroke="#c9a800" stroke-width="1.5"/>
        <ellipse cx="16" cy="22" rx="7" ry="9" fill="#c9a800"/>
        <circle cx="16" cy="22" r="3.5" fill="#8a7000"/>
        <path d="M26 12 Q34 6 30 18" stroke="#ffd60a" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M10 38 Q11 52 12 60" stroke="#c9a800" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="12" cy="62" r="3.5" fill="#ffd60a"/>
      </g>
    </svg>`),
  },
  {
    id: "headphones-over-ear",
    label: "Over-Ear",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <!-- Headband arc -->
      <path d="M20 50 Q60 4 100 50" stroke="#636366" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Left ear cup -->
      <ellipse cx="20" cy="56" rx="12" ry="16" fill="#3a3a3c" stroke="#636366" stroke-width="2"/>
      <ellipse cx="20" cy="56" rx="7" ry="10" fill="#1c1c1e"/>
      <!-- Right ear cup -->
      <ellipse cx="100" cy="56" rx="12" ry="16" fill="#3a3a3c" stroke="#636366" stroke-width="2"/>
      <ellipse cx="100" cy="56" rx="7" ry="10" fill="#1c1c1e"/>
      <!-- Cushion highlights -->
      <ellipse cx="20" cy="50" rx="5" ry="6" fill="#48484a" opacity="0.6"/>
      <ellipse cx="100" cy="50" rx="5" ry="6" fill="#48484a" opacity="0.6"/>
    </svg>`),
  },
  {
    id: "headphones-purple",
    label: "Violet Pro",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <path d="M20 50 Q60 4 100 50" stroke="#bf5af2" stroke-width="6" fill="none" stroke-linecap="round"/>
      <!-- Left ear cup -->
      <ellipse cx="20" cy="56" rx="12" ry="16" fill="#6e2fa8" stroke="#bf5af2" stroke-width="2"/>
      <ellipse cx="20" cy="56" rx="7" ry="10" fill="#3d1260"/>
      <!-- Right ear cup -->
      <ellipse cx="100" cy="56" rx="12" ry="16" fill="#6e2fa8" stroke="#bf5af2" stroke-width="2"/>
      <ellipse cx="100" cy="56" rx="7" ry="10" fill="#3d1260"/>
      <ellipse cx="20" cy="50" rx="5" ry="6" fill="#9b40d4" opacity="0.6"/>
      <ellipse cx="100" cy="50" rx="5" ry="6" fill="#9b40d4" opacity="0.6"/>
    </svg>`),
  },
  {
    id: "earbuds-transparent",
    label: "Clear Glass",
    svg: toDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 90">
      <g transform="translate(14,8)">
        <circle cx="16" cy="20" r="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <circle cx="16" cy="20" r="3" fill="rgba(255,255,255,0.2)"/>
        <ellipse cx="11" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-30 11 14)"/>
        <path d="M10 34 Q12 50 14 58" stroke="rgba(255,255,255,0.4)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      </g>
      <g transform="translate(106,8) scale(-1,1)">
        <circle cx="16" cy="20" r="15" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
        <circle cx="16" cy="20" r="7" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
        <circle cx="16" cy="20" r="3" fill="rgba(255,255,255,0.2)"/>
        <ellipse cx="11" cy="14" rx="4" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-30 11 14)"/>
        <path d="M10 34 Q12 50 14 58" stroke="rgba(255,255,255,0.4)" stroke-width="3" fill="none" stroke-linecap="round"/>
        <circle cx="14" cy="60" r="4" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
      </g>
    </svg>`),
  },
  {
    id: "photo-default",
    label: "Original",
    svg: "/assets/generated/airpods-default.dim_400x300.png",
  },
];

export default presets;
