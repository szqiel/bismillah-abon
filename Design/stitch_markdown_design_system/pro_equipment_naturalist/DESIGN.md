---
name: Pro-Equipment Naturalist
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#434840'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#747970'
  outline-variant: '#c3c8be'
  surface-tint: '#4c6547'
  primary: '#425a3d'
  on-primary: '#ffffff'
  primary-container: '#5a7354'
  on-primary-container: '#dbf7d1'
  inverse-primary: '#b3ceaa'
  secondary: '#51644a'
  on-secondary: '#ffffff'
  secondary-container: '#d3e9c8'
  on-secondary-container: '#576a4f'
  tertiary: '#4f564d'
  on-tertiary: '#ffffff'
  tertiary-container: '#686e65'
  on-tertiary-container: '#ebf1e5'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ceebc4'
  primary-fixed-dim: '#b3ceaa'
  on-primary-fixed: '#0a2009'
  on-primary-fixed-variant: '#354d31'
  secondary-fixed: '#d3e9c8'
  secondary-fixed-dim: '#b8cdad'
  on-secondary-fixed: '#0f1f0b'
  on-secondary-fixed-variant: '#394c33'
  tertiary-fixed: '#dee4d9'
  tertiary-fixed-dim: '#c2c8bd'
  on-tertiary-fixed: '#171d16'
  on-tertiary-fixed-variant: '#424940'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-xl:
    fontFamily: Archivo Narrow
    fontSize: 84px
    fontWeight: '900'
    lineHeight: 80px
    letterSpacing: -0.04em
  display-lg:
    fontFamily: Archivo Narrow
    fontSize: 64px
    fontWeight: '900'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Archivo Narrow
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Archivo Narrow
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  price-tag:
    fontFamily: Archivo Narrow
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 20px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

The design system is engineered for a high-end camera rental service, blending technical precision with an organic, grounded aesthetic. It targets professional cinematographers and photographers who value both the "spec-heavy" nature of their gear and a clean, reliable service experience.

The style is **Technical Minimalism**. It utilizes a structured, grid-heavy layout that feels like a camera viewfinder or a technical spec sheet, but softens the industrial edge with a natural, forest-inspired palette. This approach replaces the typical "tech-neon" with a sophisticated "outdoors-pro" vibe. The "Price-First Maximalism" logic ensures that the utility of the product (the cost of the rental) is always the focal point, framed by high-contrast typography and precise borders.

## Colors

The palette is rooted in tonal greens to evoke a sense of durability and professional field-use. 

- **Primary (#5A7354):** Used for key actions and the "Spec-Tag" price chips. It is the signature of the design system.
- **Secondary (#374931):** Used for deep accents, hover states, and structural elements that require more visual weight than the primary green.
- **Surface (#F2F2F2):** The foundation of the light theme. It provides a clean, paper-like background that feels more premium than pure white.
- **Ink/Dark (#171D16):** Used for maximum legibility in typography and high-contrast borders. 

All interaction states (hover, active, focus) should stay within this monochromatic green-scale to maintain a serious, professional tone.

## Typography

The typography system is built on a "Functional vs. Impact" dichotomy. 

**Archivo Narrow** (representing the requested Archivo Black style in a more technical, space-efficient condensed width) is used for all display and headline roles. It should be set with tight leading and negative letter spacing to create "blocks" of text that feel like industrial labeling.

**Hanken Grotesk** (serving as the body font to match the clean "General Sans" aesthetic) handles all long-form reading and UI labels. It provides a neutral, highly legible contrast to the aggressive display type. 

For the "Price-First" approach, use **Display XL** for daily rates on landing pages, ensuring the numbers are the largest visual element on the screen.

## Layout & Spacing

This design system uses a **Strict Technical Grid**. 

1. **Grid:** A 12-column fluid grid on desktop, shifting to a 2-column grid on mobile. 
2. **Gutters:** Gutters are kept tight (20px) to maximize content density, mimicking a technical data sheet.
3. **Price-First Positioning:** In product cards, the price is not tucked away in the bottom right; it is positioned at the top-left or centered as a massive element, often breaking the traditional "image-first" hierarchy.
4. **Margins:** Generous outer margins (64px) frame the content, making the dense internal grid feel intentional and premium rather than cluttered.

## Elevation & Depth

To maintain the professional and grounded feel, this design system avoids soft shadows and "floating" elements. 

- **Hard-Line Architecture:** Depth is communicated through **Bold Borders** (1px to 2px) using #171D16. 
- **Tonal Layering:** Instead of shadows, use slight shifts in background color. For example, a card sits on #F2F2F2, but its "Spec-Tag" section might be filled with #5A7354.
- **Zero Elevation:** Everything should feel "bolted down." Avoid z-axis movement. Overlays and modals should use a solid #171D16 backdrop at 40% opacity with no blur, keeping the focus sharp and technical.

## Shapes

The shape language is strictly **Sharp (0px)**. 

To evoke the feel of professional camera bodies, lenses, and hard-shell equipment cases, all containers, buttons, and "Spec-Tags" utilize 90-degree corners. This reinforces the "technical/professional" brand pillar. The only circles permitted are for icon buttons or specific functional indicators (like a "recording" status light).

## Components

### Spec-Tag (Price Chips)
The signature component of this design system.
- **Background:** #5A7354 (Primary Green).
- **Text:** #F2F2F2 (White), using `price-tag` typography.
- **Structure:** A rectangle with 0px radius. Use a left-aligned sub-label (e.g., "PER DAY") in `label-caps` at a smaller scale.

### Buttons
- **Primary:** Solid #171D16 background with #F2F2F2 text. Sharp corners.
- **Secondary:** Transparent background, 2px border of #374931, text in #374931.
- **Interaction:** On hover, Primary buttons shift to #5A7354.

### Product Cards
- **Border:** 1px solid #171D16.
- **Header:** The "Spec-Tag" is pinned to the top-right corner, overlapping the product image.
- **Content:** Product name in `headline-lg`, followed by a technical specs list (e.g., "4K/120p", "10-bit 4:2:2") in `label-caps`.

### Input Fields
- **Style:** Underline only or full 1px border in #171D16. 
- **Focus:** The border thickness increases to 2px in #5A7354. No glow.

### Status Indicators
- Use small, square blocks of color. **Active:** #5A7354. **Alert:** A high-contrast burnt orange (if needed) to stay within the natural palette.