export const TEAM_CONFIG = {
  'Phoenix': { color: '#F4B400', icon: '🦅', type: 'onsite' },
  'Gorilla': { color: '#8B5A2B', icon: '🦍', type: 'onsite' },
  'Fox': { color: '#FF7F50', icon: '🦊', type: 'onsite' },
  'Tiger': { color: '#FF9F1C', icon: '🐯', type: 'onsite' },
  'Lemur': { color: '#808080', icon: '🐒', type: 'onsite' },
  'Blue Whale': { color: '#4682B4', icon: '🐳', type: 'onsite' },
  'Flamingo': { color: '#FF69B4', icon: '🦩', type: 'onsite' },
  'Ram': { color: '#D2B48C', icon: '🐏', type: 'onsite' },
  'Wolf': { color: '#708090', icon: '🐺', type: 'onsite' },
  'Bull': { color: '#A52A2A', icon: '🐂', type: 'onsite' },
  'Penguin': { color: '#000000', icon: '🐧', type: 'onsite' },
  'Sea Turtle': { color: '#2E8B57', icon: '🐢', type: 'onsite' },
  'Lion': { color: '#FFD700', icon: '🦁', type: 'onsite' },
  'Camel': { color: '#D2691E', icon: '🐫', type: 'onsite' },
  'Rhino': { color: '#A9A9A9', icon: '🦏', type: 'onsite' },
  'Brown Bear': { color: '#8B4513', icon: '🐻', type: 'onsite' },
  'Kangaroo': { color: '#DAA520', icon: '🦘', type: 'onsite' },
  'Chameleon': { color: '#32CD32', icon: '🦎', type: 'onsite' },
  'default': { color: '#94A3B8', icon: '👥', type: 'onsite' }
};

export function getTeamBranding(teamName) {
  if (!teamName) return TEAM_CONFIG['default'];
  
  if (teamName.toLowerCase().includes('virtual team')) {
    return { color: '#6C63FF', icon: '⭐', type: 'virtual' };
  }

  // Extract base team name (e.g., "Gorilla" from "Gorilla - Table 1")
  const baseName = teamName.split('-')[0].trim();
  
  return TEAM_CONFIG[baseName] || TEAM_CONFIG[teamName] || TEAM_CONFIG['default'];
}

/**
 * Converts a hex color string to an HSL string, adjusting saturation and lightness.
 */
export function getPastelBackground(hexColor) {
  let r = 0, g = 0, b = 0;
  if (hexColor.length === 4) {
    r = "0x" + hexColor[1] + hexColor[1];
    g = "0x" + hexColor[2] + hexColor[2];
    b = "0x" + hexColor[3] + hexColor[3];
  } else if (hexColor.length === 7) {
    r = "0x" + hexColor[1] + hexColor[2];
    g = "0x" + hexColor[3] + hexColor[4];
    b = "0x" + hexColor[5] + hexColor[6];
  }
  
  r /= 255;
  g /= 255;
  b /= 255;
  let cmin = Math.min(r,g,b),
      cmax = Math.max(r,g,b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);
  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  // Apply pastel rules: S: 12-38%, L: 82-90%
  const pastelS = Math.min(Math.max(s, 12), 38);
  const pastelL = Math.min(Math.max(l, 82), 90);

  return `hsla(${h}, ${pastelS}%, ${pastelL}%, 0.2)`; 
}
