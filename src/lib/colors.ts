// Palette: Shades of Blue, Orange, and Purple
export const methodologyColors = [
    '#2E5A88', // Deep Steel Blue
    '#D75A2F', // Rusty Orange
    '#5D3F6A', // Muted Grape
    '#4A89AC', // Summer Sky Blue
    '#F08A5D', // Soft Apricot
    '#8B6C94', // Lavender Gray
    '#6CA3C2', // Light Steel Blue
    '#E57373', // Light Coral (as a variation from orange)
    '#A08AB8', // Soft Lilac
];

const hexToHsl = (hex: string): [number, number, number] => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslCache = new Map<string, string>();

export const methodologyColorToHsl = (color: string): string => {
  if (hslCache.has(color)) {
    return hslCache.get(color)!;
  }
  const [h, s, l] = hexToHsl(color);
  const hslString = `${h} ${s}%`;
  hslCache.set(color, hslString);
  return hslString;
}
