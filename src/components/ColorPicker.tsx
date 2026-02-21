import React, { useState, useRef, useEffect } from 'react';
import { presetColors, useColorTheme } from '../contexts/ColorThemeContext';
import { Palette } from 'lucide-react';

// Convert HSL to Hex
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Convert Hex to HSL
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 100, l: 50 };
  
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

interface Dot {
  x: number;
  y: number;
  hue: number;
  saturation: number;
  baseScale: number;
  phase: number;
}

const ColorPicker: React.FC = () => {
  const { theme, setColor } = useColorTheme();
  const [isOpen, setIsOpen] = useState(false);
  const initialHsl = hexToHsl(theme.hex);
  const [hue, setHue] = useState(initialHsl.h);
  const [saturation, setSaturation] = useState(initialHsl.s);
  const [lightness, setLightness] = useState(initialHsl.l);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const animationRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);
  const timeRef = useRef(0);

  const wheelSize = 200;
  const wheelRadius = wheelSize / 2 - 10;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const dotSize = 6;
  const dotSpacing = 10;

  // Generate dot grid positions once
  useEffect(() => {
    const dots: Dot[] = [];
    for (let y = dotSpacing; y < wheelSize - dotSpacing; y += dotSpacing) {
      for (let x = dotSpacing; x < wheelSize - dotSpacing; x += dotSpacing) {
        const dx = x - centerX;
        const dy = y - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= wheelRadius && distance > 15) {
          const angle = (Math.atan2(dy, dx) * 180 / Math.PI + 360) % 360;
          const sat = (distance / wheelRadius) * 100;
          dots.push({
            x,
            y,
            hue: angle,
            saturation: sat,
            baseScale: 0.7 + Math.random() * 0.3,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }
    dotsRef.current = dots;
  }, []);

  // Calculate selector position from hue and saturation
  const getSelectorPosition = () => {
    const angle = (hue - 90) * Math.PI / 180;
    const distance = (saturation / 100) * wheelRadius;
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
    };
  };

  // Animate the dot matrix
  useEffect(() => {
    if (!isOpen) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      timeRef.current += 0.03;
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, wheelSize, wheelSize);

      const selectorPos = getSelectorPosition();

      // Draw dots with animation
      dotsRef.current.forEach((dot) => {
        // Distance from selector for ripple effect
        const dx = dot.x - selectorPos.x;
        const dy = dot.y - selectorPos.y;
        const distFromSelector = Math.sqrt(dx * dx + dy * dy);
        
        // Pulsing animation based on time and phase
        const pulse = Math.sin(timeRef.current * 2 + dot.phase) * 0.15 + 1;
        
        // Ripple effect from selector
        const ripple = Math.sin(distFromSelector * 0.1 - timeRef.current * 3) * 0.1 + 1;
        
        // Glow effect when near selector
        const glowFactor = Math.max(0, 1 - distFromSelector / 50);
        
        const scale = dot.baseScale * pulse * ripple * (1 + glowFactor * 0.3);
        const size = dotSize * scale;
        
        // Get color for this dot
        const color = hslToHex(dot.hue, dot.saturation, lightness);
        
        // Draw dot with glow
        if (glowFactor > 0) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8 * glowFactor;
        } else {
          ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      // Reset shadow
      ctx.shadowBlur = 0;

      // Draw center decoration
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#000000';
      ctx.fill();
      
      // Inner pulse ring
      const innerPulse = Math.sin(timeRef.current * 3) * 2 + 10;
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerPulse, 0, Math.PI * 2);
      ctx.strokeStyle = theme.hex;
      ctx.lineWidth = 2;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOpen, lightness, hue, saturation, theme.hex]);

  const handleWheelInteraction = (clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left - centerX;
    const y = clientY - rect.top - centerY;
    
    const angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    const distance = Math.min(Math.sqrt(x * x + y * y), wheelRadius);
    
    const newHue = (angle + 360) % 360;
    const newSaturation = Math.min(100, Math.max(0, (distance / wheelRadius) * 100));
    
    setHue(newHue);
    setSaturation(newSaturation);
    setColor(hslToHex(newHue, newSaturation, lightness));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleWheelInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handleWheelInteraction(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    if (isDragging) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
    }
  }, [isDragging]);

  const selectorPos = getSelectorPosition();

  // Selector animation
  const [selectorPulse, setSelectorPulse] = useState(1);
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSelectorPulse(p => p === 1 ? 1.1 : 1);
    }, 500);
    return () => clearInterval(interval);
  }, [isOpen]);

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
        aria-label="Change accent color"
        aria-expanded={isOpen}
      >
        <Palette 
          size={20} 
          style={{ color: theme.hex }}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          
          <div 
            className="absolute right-0 mt-2 p-4 bg-black border border-gray-700 rounded-lg shadow-xl z-50 w-72"
            role="dialog"
            aria-label="Color picker"
          >
            <div className="text-xs text-gray-400 mb-3 font-medium tracking-wider uppercase">
              ● Color Matrix
            </div>
            
            {/* Dot Matrix Color Wheel */}
            <div className="flex justify-center mb-4">
              <div 
                ref={containerRef}
                className="relative cursor-crosshair rounded-lg overflow-hidden"
                style={{ 
                  width: wheelSize, 
                  height: wheelSize,
                  boxShadow: `0 0 30px ${theme.hex}33, inset 0 0 20px rgba(0,0,0,0.5)`
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => isDragging && handleMouseUp()}
              >
                <canvas
                  ref={canvasRef}
                  width={wheelSize}
                  height={wheelSize}
                  className="rounded-lg"
                />
                
                {/* Animated Selector */}
                <div
                  className="absolute pointer-events-none transition-transform duration-100"
                  style={{
                    left: selectorPos.x - 14,
                    top: selectorPos.y - 14,
                    width: 28,
                    height: 28,
                    transform: `scale(${selectorPulse})`,
                  }}
                >
                  {/* Outer ring */}
                  <div 
                    className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping"
                    style={{ animationDuration: '1.5s' }}
                  />
                  {/* Main selector */}
                  <div 
                    className="absolute inset-1 rounded-full border-[3px] border-white"
                    style={{ 
                      backgroundColor: theme.hex,
                      boxShadow: `0 0 15px ${theme.hex}, 0 0 30px ${theme.hex}66, inset 0 0 10px rgba(255,255,255,0.3)`
                    }}
                  />
                  {/* Center dot */}
                  <div 
                    className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white/80"
                    style={{ boxShadow: '0 0 5px white' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Brightness Slider - Retro Style */}
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-2 block tracking-wider">BRIGHTNESS</label>
              <div className="relative">
                <div 
                  className="h-3 rounded-full overflow-hidden"
                  style={{
                    background: `linear-gradient(to right, 
                      ${hslToHex(hue, saturation, 10)}, 
                      ${hslToHex(hue, saturation, 50)}, 
                      ${hslToHex(hue, saturation, 90)})`,
                    boxShadow: `0 0 10px ${theme.hex}44`
                  }}
                >
                  {/* Dot overlay for retro effect */}
                  <div 
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: 'radial-gradient(circle, transparent 1px, black 1px)',
                      backgroundSize: '4px 4px'
                    }}
                  />
                </div>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={lightness}
                  onChange={(e) => {
                    const newL = parseInt(e.target.value);
                    setLightness(newL);
                    setColor(hslToHex(hue, saturation, newL));
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Custom slider handle */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white pointer-events-none transition-all"
                  style={{ 
                    left: `calc(${(lightness - 10) / 80 * 100}% - 10px)`,
                    backgroundColor: hslToHex(hue, saturation, lightness),
                    boxShadow: `0 0 10px ${theme.hex}`
                  }}
                />
              </div>
            </div>
            
            {/* Current Color Preview */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-black/50 rounded-lg border border-gray-700/50">
              <div 
                className="w-12 h-12 rounded-lg border-2 border-white/20 relative overflow-hidden"
                style={{ backgroundColor: theme.hex }}
              >
                {/* Scanline effect */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)'
                  }}
                />
              </div>
              <div>
                <div className="text-white text-sm font-mono tracking-wider">{theme.hex.toUpperCase()}</div>
                <div className="text-gray-500 text-xs">ACTIVE COLOR</div>
              </div>
            </div>
            
            {/* Preset Colors */}
            <div className="text-xs text-gray-400 mb-2 tracking-wider">PRESETS</div>
            <div className="grid grid-cols-8 gap-2">
              {presetColors.map((color, i) => (
                <button
                  key={color}
                  onClick={() => {
                    const hsl = hexToHsl(color);
                    setHue(hsl.h);
                    setSaturation(hsl.s);
                    setLightness(hsl.l);
                    setColor(color);
                  }}
                  className={`w-7 h-7 rounded-full transition-all duration-200 hover:scale-125 focus:outline-none ${
                    theme.hex.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-white scale-110' : ''
                  }`}
                  style={{ 
                    backgroundColor: color,
                    boxShadow: theme.hex.toLowerCase() === color.toLowerCase() 
                      ? `0 0 15px ${color}` 
                      : `0 2px 5px rgba(0,0,0,0.3)`,
                    animationDelay: `${i * 50}ms`
                  }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ColorPicker;
