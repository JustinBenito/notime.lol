# Accessibility Improvements for notime.lol

This document outlines accessibility improvements needed for the time visualization dashboard. The analysis covers semantic HTML, ARIA labels, keyboard navigation, screen reader support, and color contrast.

## Overall Assessment

The application currently has **limited accessibility support** and would benefit from comprehensive improvements to meet WCAG 2.1 AA standards.

## Critical Issues Found

### 1. Semantic HTML Structure

**Current Issues:**
- Excessive use of generic `div` elements without semantic meaning
- Missing proper landmarks for screen readers
- No semantic structure for dashboard sections

**Locations to Fix:**
- `src/App.tsx:40-105` - Main application structure
- All component files - Generic container divs

**Suggested Changes:**
- Replace main content `div` with `<main>` element (App.tsx:52)
- Add `<section>` elements for each dashboard area
- Use `<nav>` for any navigation elements
- Add proper heading hierarchy with `<h2>`, `<h3>` tags

### 2. Missing ARIA Labels and Roles

**Critical Missing Elements:**

#### Interactive Components (src/components/GoalTracker.tsx)
- **Lines 94-107**: Form inputs lack proper labels
- **Lines 81-86**: Delete button needs aria-label
- **Lines 125-132**: "Add new goal" button needs better description

#### Data Visualizations
- **src/components/PieChartToday.tsx:56-94**: SVG chart has no accessibility labels
- **src/components/DotMatrixClock.tsx:122-132**: Clock display needs aria-live region
- **src/components/YearlyDotsGrid.tsx:73-84**: Interactive dots need aria-labels

#### Navigation Elements
- **src/components/GithubButton.tsx:26-42**: External link needs better description

### 3. Keyboard Navigation Issues

**Problems Found:**
- **YearlyDotsGrid.tsx:77-83**: Dots are clickable but not keyboard accessible
- **MonthsLeftYear.tsx:83-86**: Hover interactions with no keyboard equivalent
- **GoalTracker.tsx**: Form navigation works but could be improved

**Required Fixes:**
- Add `tabIndex` and `onKeyDown` handlers for clickable elements
- Implement arrow key navigation for grid components
- Add focus indicators for all interactive elements

### 4. Screen Reader Support

**Missing Announcements:**
- **DotMatrixClock.tsx**: Current time not announced to screen readers
- **MotivationalMetrics.tsx**: Dynamic metric updates not announced
- **PieChartToday.tsx**: Percentage changes not announced

### 5. Color and Contrast Issues

**Accessibility Concerns:**
- **Color-only Information**: Goals in YearlyDotsGrid use only color to distinguish meaning
- **Contrast Ratios**: Some text may not meet WCAG contrast requirements
  - Gray text on dark backgrounds (various components)
  - Rose-colored text (#ef4444) needs verification

## Detailed Improvement Plan

### Phase 1: Semantic Structure (High Priority)

#### File: `src/App.tsx`
```jsx
// Line 40: Replace div with main
<main className="flex overflow-hidden flex-col h-screen bg-black text-white p-2 sm:p-3">

// Line 43: Add proper header role
<header className="flex justify-between items-center pb-2 pr-2 sm:pr-4 flex-shrink-0" role="banner">

// Line 55: Add section with aria-label
<section className="lg:col-span-12 flex flex-col sm:flex-row h-fit" aria-label="Time Visualization">

// Line 67: Add section with aria-label
<section className="lg:col-span-12 flex flex-col sm:flex-row" aria-label="Metrics and Clock">

// Line 76: Add section with aria-label
<section className="lg:col-span-12 flex flex-col sm:flex-row h-fit" aria-label="Year Overview and Goals">

// Line 96: Add proper footer role
<footer className="flex w-full flex-col items-center justify-center px-2 py-2 text-white sm:px-4 md:px-8 lg:px-16 flex-shrink-0" role="contentinfo">
```

### Phase 2: ARIA Labels (High Priority)

#### File: `src/components/PieChartToday.tsx`
```jsx
// Line 57: Add proper ARIA attributes
<div className="flex flex-col items-center justify-center p-4 h-full">
  <div className="relative flex items-center justify-center mb-4" role="img" aria-label={`${(100 - elapsedPercentage).toFixed(1)}% of today remaining`}>
    <svg width={svgSize} height={svgSize} className="rotate-0" aria-hidden="true">
```

```jsx
// Line 90: Make time announcement live
<div className="text-center" aria-live="polite">
```

#### File: `src/components/DotMatrixClock.tsx`
```jsx
// Line 123: Add live region for time updates
<div className="flex flex-col items-center justify-center h-full">
  <div className="flex items-center justify-center bg-black p-2" role="img" aria-label={`Current time: ${time}`} aria-live="polite">
```

#### File: `src/components/GoalTracker.tsx`
```jsx
// Line 94: Add proper form labels
<form onSubmit={handleSubmit} className="space-y-2" aria-label="Add new goal">
  <label htmlFor="goal-input" className="sr-only">Goal description</label>
  <input
    id="goal-input"
    type="text"
    value={newGoal}
    onChange={(e) => setNewGoal(e.target.value)}
    placeholder="Enter goal..."
    aria-describedby="goal-help"
    className="w-full p-2 bg-[#1F2123] border border-gray-700 rounded text-white text-sm placeholder-white focus:outline-none focus:border-blue-500"
    autoFocus
  />

  <label htmlFor="goal-date" className="sr-only">Goal target date</label>
  <input
    id="goal-date"
    type="date"
    value={goalDate}
    onChange={(e) => setGoalDate(e.target.value)}
    aria-describedby="date-help"
    className="w-full p-2 bg-[#1F2123] border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
  />
```

```jsx
// Line 81: Add aria-label for delete button
<button
  onClick={() => onGoalRemove(goal.id)}
  className="text-white hover:text-red-400 transition-colors flex-shrink-0"
  aria-label={`Delete goal: ${goal.text}`}
>
```

### Phase 3: Keyboard Navigation (Medium Priority)

#### File: `src/components/YearlyDotsGrid.tsx`
```jsx
// Line 77: Add keyboard support
<div
  className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all duration-200 hover:scale-125 focus:scale-125 focus:outline-none focus:ring-2 focus:ring-rose-500 ${!goal ? getDotColor(date, dateString) : ''}`}
  style={goal ? { backgroundColor: goal.color } : {}}
  onClick={() => onDayClick(dateString)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onDayClick(dateString);
    }
  }}
  onMouseEnter={() => setHoveredDate(dateString)}
  onMouseLeave={() => setHoveredDate(null)}
  onFocus={() => setHoveredDate(dateString)}
  onBlur={() => setHoveredDate(null)}
  tabIndex={0}
  role="button"
  aria-label={`${formatDateForTooltip(new Date(dateString))}${goal ? `, Goal: ${goal.text}` : ', Click to add goal'}`}
/>
```

### Phase 4: Enhanced Screen Reader Support (Medium Priority)

#### File: `src/components/MotivationalMetrics.tsx`
```jsx
// Line 61: Add live region for metric updates
<div className="p-4 space-y-3" role="region" aria-label="Motivational metrics" aria-live="polite">
```

#### File: `src/components/MonthsLeftYear.tsx`
```jsx
// Line 78: Add proper labeling for month bars
<div className="w-full h-full bg-black rounded-xl p-2 gap-2 flex flex-col justify-between" role="img" aria-label={`Year progress: ${getRemainingMonths()} months remaining`}>
  <div className="flex-1 flex items-center gap-1 justify-between" role="group" aria-label="Monthly progress bars">
    {months.map((month, index) => (
      <div
        key={index}
        className="flex-1 h-full max-h-25 relative group cursor-pointer"
        onMouseEnter={() => setHoveredMonth(month.name)}
        onMouseLeave={() => setHoveredMonth(null)}
        role="img"
        aria-label={`${month.name}: ${month.status === 'completed' ? 'Completed' : month.status === 'current' ? `${Math.round(month.progress * 100)}% complete` : 'Remaining'}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setHoveredMonth(hoveredMonth === month.name ? null : month.name);
          }
        }}
      >
```

### Phase 5: Alternative Text and Hidden Content (Low Priority)

#### Add Screen Reader Only Classes
Create utility classes for screen-reader-only content:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

#### File: `index.html`
```html
<!-- Line 13: Improve body accessibility -->
<body>
  <div id="root" role="application" aria-label="Time tracking dashboard"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
```

### Phase 6: Color and Contrast Improvements

1. **Verify Contrast Ratios**: Test all text against background colors
2. **Add Patterns/Icons**: Don't rely solely on color for goal identification
3. **Focus Indicators**: Ensure all focusable elements have visible focus indicators

## Implementation Priority

1. **Phase 1 & 2** (Critical): Semantic structure and ARIA labels
2. **Phase 3** (High): Keyboard navigation
3. **Phase 4** (Medium): Screen reader enhancements
4. **Phase 5 & 6** (Low): Polish and refinements

## Testing Recommendations

1. **Screen Reader Testing**: Test with NVDA, JAWS, or VoiceOver
2. **Keyboard Navigation**: Navigate entire app using only keyboard
3. **Automated Testing**: Use tools like axe-core or Lighthouse
4. **Color Contrast**: Use WebAIM Color Contrast Checker

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Screen Reader Testing](https://webaim.org/articles/screenreader_testing/)