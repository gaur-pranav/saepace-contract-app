---
name: Pacto Aura
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffffff'
  on-tertiary: '#67001f'
  tertiary-container: '#ffdadc'
  on-tertiary-container: '#b1394f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffdadc'
  tertiary-fixed-dim: '#ffb2b9'
  on-tertiary-fixed: '#400010'
  on-tertiary-fixed-variant: '#891933'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '800'
    lineHeight: 76px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-sm:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: '0'
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  section-padding: 120px
  unit: 8px
---

## Brand & Style

The design system is engineered for an ultra-premium SaaS experience that evokes a sense of depth, precision, and exclusivity. The visual narrative centers on "The Void and The Light"—a deep, obsidian base punctuated by ethereal light leaks and high-contrast typography.

The style is a refined evolution of **Glassmorphism**, moving away from "frosted" aesthetics toward "optical" clarity. It utilizes high-index refraction effects, blurred mesh gradients (auroras), and razor-sharp borders to create a multi-layered workspace. The emotional response is one of calm authority and technological sophistication, targeting high-end enterprise clients and discerning power users.

## Colors

The palette is anchored by an absolute dark neutral to maximize the perceived contrast of the "Aurora" effects.

- **Base Background:** `#0A0A0B` provides the infinite canvas.
- **Primary:** Pure White is reserved for high-priority typography and core CTAs to ensure maximum legibility against the dark void.
- **Accents (The Aurora):** Indigo (`#6366F1`) and Rose (`#FB7185`) are never used as solid blocks. They exist as soft, wide-radius mesh gradients in the background (15-25% opacity) or as subtle glows behind glass containers.
- **Functional Neutrals:** Grays are suppressed to maintain a "pure dark" feel; instead, low-opacity white overlays are used for surface definitions.

## Typography

This design system uses a triple-font strategy to balance impact with technical precision. 

- **Display & Headings:** Hanken Grotesk in Heavy weights. Tight tracking (negative letter spacing) is essential to create the "editorial" premium feel. 
- **Body:** Inter provides a systematic, neutral reading experience that doesn't compete with the bold headlines.
- **Technical Labels:** Geist is used for small metadata, pills, and UI labels to reinforce the "SaaS/Developer" aesthetic with its technical, monospaced-adjacent character.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px central track on desktop, while background auroras bleed to the edges of the viewport.

A strict 8px grid governs all internal component spacing. Section transitions should be generous—utilizing up to 120px of vertical padding to allow the glassmorphic elements "room to breathe." On mobile, gutters shrink to 16px, and display type scales aggressively to maintain impact without overflowing horizontal bounds.

## Elevation & Depth

Depth is not communicated via shadows, but through **Optical Stacking**.

1.  **Level 0 (Background):** Pure `#0A0A0B` with blurred mesh gradients of Indigo and Rose.
2.  **Level 1 (Cards/Sections):** Semi-transparent white fill (approx. 4% opacity) with a `40px` backdrop blur. 
3.  **Level 2 (Borders/Edges):** A 1px solid stroke of white at 8% opacity. For primary focus areas, a top-down linear gradient stroke (White to Transparent) creates a "light catch" effect on the upper edge.
4.  **Level 3 (Floating Elements):** Increased backdrop blur (`64px`) and a subtle inner glow (1px blur) to simulate the thickness of high-quality glass.

## Shapes

The design system adopts a **Pill-Shaped** (Stadium) geometry for all interactive elements. This softness contrasts with the aggressive, bold typography, creating a balanced "High-Tech but Human" aesthetic.

- **Primary Buttons:** Full pill shape (3rem+ radius).
- **Cards:** Large, generous rounding (`rounded-xl` or higher) to accommodate the glass refraction at the corners.
- **Inputs:** Stadium-shaped to match buttons, ensuring a cohesive form language across the landing page.

## Components

- **Buttons:** Primary buttons are solid white with black text. Secondary buttons are "Glass" (transparent background, 8% white border, backdrop blur). On hover, glass buttons should increase their background opacity to 12%.
- **Pill Badges:** Small labels using `label-mono` typography, featuring a 10% Indigo or Rose tint background to categorize features.
- **Input Fields:** Minimalist stadium shapes. The border is a subtle 8% white, glowing to 20% white on focus. Placeholder text uses `body-md` at 40% opacity.
- **Glass Cards:** The primary container for feature highlights. Must include a `backdrop-filter: blur(40px)` and a thin 1px border. No drop shadows.
- **Auroras:** Large, non-semantic `div` elements with high `filter: blur(100px)` positioned absolutely behind the content to create the Rose and Indigo atmospheric glows.