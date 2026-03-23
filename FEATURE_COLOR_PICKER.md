## ✨ Feature: Custom Accent Color Picker with Retro Dot Matrix UI

### Description
Added a full color customization system that allows users to personalize the accent color throughout the entire app. The color picker features a unique retro dot-matrix animated wheel that matches the app's aesthetic.

### Features

#### 🎨 RGB Color Wheel
- **Dot Matrix Design**: Color wheel rendered as animated individual dots instead of smooth gradients
- **Full Spectrum**: Pick any color from the entire RGB spectrum
- **Intuitive Controls**: 
  - Drag anywhere on the wheel to select hue + saturation
  - Brightness slider for lightness adjustment
- **Live Preview**: See your selected color with hex code display

#### ⚡ Animations
- **Pulsing Dots**: Each dot animates with its own random phase
- **Ripple Effect**: Waves emanate from the selector as you move it
- **Glow Effect**: Dots near the selector light up brighter
- **Selector Ping**: Radar-style ping animation on the selector circle
- **Center Pulse**: Animated ring in the wheel center

#### 💾 Persistence
- Color choice saved to `localStorage`
- Survives page refreshes and browser restarts
- Key: `timeleft-color`

#### 🎯 Quick Picks
8 preset colors for fast selection:
- Rose, Blue, Green, Purple, Orange, Cyan, Yellow, Pink

### Components Affected
All accent-colored elements now use the theme system:

| Component | Elements Updated |
|-----------|-----------------|
| `App.tsx` | Logo "time" text |
| `DaysLeftWeek` | Current day bar highlight |
| `MotivationalMetrics` | All metric numbers |
| `DotMatrixClock` | Colon separator dots |
| `GoalTracker` | Add button, plus icon |
| `YearlyDotsGrid` | Today's dot, focus rings |

### Technical Implementation

#### New Files
- `src/contexts/ColorThemeContext.tsx` - React Context for global theme state
- `src/components/ColorPicker.tsx` - The color wheel UI component

#### Architecture
```
ColorThemeProvider (wraps App)
    ↓
useColorTheme() hook
    ↓
{ theme: { hex, hover }, setColor }
    ↓
Components use theme.hex for styling
```

#### Color Format
- Stored as hex string (e.g., `#f43f5e`)
- Hover color auto-calculated by darkening 15%
- HSL used internally for wheel calculations

### Screenshots
<!-- Add screenshots here -->

### Testing Checklist
- [ ] Color wheel responds to click/drag
- [ ] Brightness slider adjusts lightness
- [ ] Preset buttons work correctly
- [ ] Color persists after page refresh
- [ ] All components update when color changes
- [ ] Animations run smoothly (~60fps)
- [ ] Works on mobile (touch events)

### Breaking Changes
None - default color is still rose (`#f43f5e`)

### Future Improvements
- [ ] Add touch support for mobile drag
- [ ] Color history (recently used colors)
- [ ] Import/export theme settings
- [ ] Dark/light mode presets
- [ ] Keyboard accessibility for wheel navigation
