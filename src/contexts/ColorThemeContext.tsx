import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Helper function to darken a hex color for hover states
function darkenHex(hex: string, percent: number = 15): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, (num >> 16) - Math.round(2.55 * percent));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - Math.round(2.55 * percent));
  const b = Math.max(0, (num & 0x0000FF) - Math.round(2.55 * percent));
  return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

// Preset colors for quick selection
export const presetColors = [
  '#f43f5e', // rose
  '#3b82f6', // blue
  '#22c55e', // green
  '#a855f7', // purple
  '#f97316', // orange
  '#06b6d4', // cyan
  '#eab308', // yellow
  '#ec4899', // pink
];

interface Theme {
  hex: string;
  hover: string;
}

interface ColorThemeContextType {
  theme: Theme;
  setColor: (hex: string) => void;
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined);

interface ColorThemeProviderProps {
  children: ReactNode;
}

export const ColorThemeProvider: React.FC<ColorThemeProviderProps> = ({ children }) => {
  const [colorHex, setColorHex] = useLocalStorage<string>('timeleft-color', '#f43f5e');
  
  // Validate hex color format, fallback to rose if invalid
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(colorHex);
  const validHex = isValidHex ? colorHex : '#f43f5e';
  
  const theme: Theme = {
    hex: validHex,
    hover: darkenHex(validHex),
  };

  const setColor = (hex: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setColorHex(hex);
    }
  };

  return (
    <ColorThemeContext.Provider value={{ theme, setColor }}>
      {children}
    </ColorThemeContext.Provider>
  );
};

export const useColorTheme = (): ColorThemeContextType => {
  const context = useContext(ColorThemeContext);
  if (!context) {
    throw new Error('useColorTheme must be used within a ColorThemeProvider');
  }
  return context;
};
