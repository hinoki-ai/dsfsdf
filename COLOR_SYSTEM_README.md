# Color Tokenization System Documentation

## Overview

This project implements a comprehensive, semantic color tokenization system that ensures consistency, accessibility, and maintainability across the entire application. The system is inspired by premium liquor branding with amber and burgundy as primary brand colors.

## Architecture

### 1. Centralized Color Palette (`lib/color-palette.ts`)
- **Single source of truth** for all colors in the application
- **Semantic naming** that describes purpose rather than appearance
- **Utility functions** for consistent color application
- **Accessibility considerations** built into the design

### 2. CSS Custom Properties (`app/globals.css`)
- **Brand colors** (amber, burgundy) with full shade ranges
- **Semantic tokens** for different UI states and components
- **Glass morphism effects** with consistent opacity values
- **Light and dark mode support**

### 3. Tailwind Configuration (`tailwind.config.js`)
- **Semantic color classes** that reference CSS custom properties
- **Consistent naming** across all components
- **Glass morphism utilities** for premium UI effects

## Color Categories

### Brand Colors

- **Amber**: Inspired by aged whiskey and fine wines
- **Burgundy**: Inspired by premium red wines and ports

### Semantic Colors

#### Status Indicators

```css
--status-allowed-*    /* Green variants for positive states */
--status-warning-*    /* Yellow variants for caution states */
--status-required-*   /* Blue variants for required actions */
--status-restricted-* /* Red variants for blocked states */

```

#### Alcohol Categories

```css
--alcohol-low-*       /* Amber variants for low ABV (0-5%) */
--alcohol-medium-*    /* Red variants for medium ABV (5-15%) */
--alcohol-high-*      /* Purple variants for high ABV (15%+) */

```

#### Availability States

```css
--availability-in-stock    /* Green variants for available items */
--availability-low-stock   /* Orange variants for limited stock */
--availability-out-of-stock /* Gray variants for unavailable items */
--availability-featured    /* Amber variants for featured items */

```

#### Age Verification

```css
--age-verified        /* Green variants for verified users */
--age-unverified      /* Red variants for unverified users */
--age-required        /* Amber variants for age requirements */

```

### Glass Morphism Effects

```css
--glass-light-*       /* Subtle transparency for light backgrounds */
--glass-medium-*      /* Medium transparency for balanced effects */
--glass-strong-*      /* Strong transparency for dramatic effects */

```

## Usage Examples

### In Components

#### Status Badges

```tsx
// Instead of hard-coded colors
<Badge className="bg-red-100 text-red-800">Error</Badge>
// Use semantic tokens
<Badge className="bg-status-restricted-bg text-status-restricted-text border-status-restricted-border">
  Restricted
</Badge>

```

#### Alcohol Categories

```tsx
// Instead of hard-coded colors
<Badge className="bg-yellow-100 text-yellow-800">Low ABV</Badge>
// Use semantic tokens
<Badge className={`${getAlcoholCategoryColor(abv)} border`}>
  {abv}%
</Badge>

```

#### Glass Effects

```tsx
// Instead of inline styles
<div className="backdrop-blur-md bg-white/10 border border-white/20">
// Use semantic utilities
<div className="glass-medium">

```

## Accessibility Compliance

### WCAG 2.1 Standards

All color combinations in this system meet **WCAG AA standards** (4.5:1 contrast ratio for normal text, 3:1 for large text):
- **Status colors**: Green-100/Green-800, Yellow-100/Yellow-800, Blue-100/Blue-800, Red-100/Red-800
- **Alcohol categories**: Amber-100/Amber-800, Red-100/Red-800, Purple-100/Purple-800
- **Brand colors**: Full range from 50 (lightest) to 900 (darkest) with proper contrast

### Color Contrast Validation

The system includes utility functions for:
- **Contrast ratio calculation** between any two colors
- **WCAG compliance checking** for AA and AAA standards
- **Accessibility reporting** for all semantic combinations
- **Recommendations** for improving contrast when needed

## Implementation Benefits

### 1. Consistency

- All colors follow the same naming convention
- Semantic meaning makes colors predictable
- Single source of truth prevents color drift

### 2. Maintainability

- Easy to update brand colors across the entire app
- Change color schemes without touching individual components
- Clear documentation for new developers

### 3. Accessibility

- Built-in compliance with WCAG guidelines
- Automatic contrast validation
- Consistent experience for all users

### 4. Scalability

- Easy to add new semantic color categories
- Support for different themes and modes
- Extensible for future brand evolution

## Migration Guide

### Before (Hard-coded colors)

```tsx
<Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
<Badge className="bg-red-100 text-red-800">Error</Badge>
<Badge className="bg-green-100 text-green-800">Success</Badge>

```

### After (Semantic tokens)

```tsx
<Badge className="bg-status-warning-bg text-status-warning-text border-status-warning-border">
  Warning
</Badge>
<Badge className="bg-status-restricted-bg text-status-restricted-text border-status-restricted-border">
  Error
</Badge>
<Badge className="bg-status-allowed-bg text-status-allowed-text border-status-allowed-border">
  Success
</Badge>

```

## Best Practices

1. **Always use semantic tokens** instead of hard-coded colors
2. **Test color combinations** with the accessibility utilities
3. **Use the utility functions** for dynamic color application
4. **Document new color categories** when adding them
5. **Validate contrast ratios** for any custom color combinations

## Future Enhancements

- **Dynamic theme switching** based on user preferences
- **High contrast mode** for accessibility
- **Color scheme variations** for different seasons/events
- **Automated contrast validation** in CI/CD pipeline

