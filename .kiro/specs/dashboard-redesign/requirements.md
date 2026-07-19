# Dashboard UI Redesign — Requirements

## Overview
Redesign the entire Ambassador Global Academy dashboard shell and all sub-pages to match the reference design image. The redesign is **visual only** — no authentication, database, API, or business logic changes.

---

## Design Tokens (Extracted from Reference Image)

### Colors
| Token | Value | Usage |
|---|---|---|
| Sidebar BG | `#1a1f2e` (deep navy) | Sidebar background |
| Sidebar Active | `#a31c2b` (crimson) | Active nav item highlight |
| Accent Primary | `#a31c2b` | Primary buttons, CTA |
| Accent Hover | `#8b1623` | Button hover state |
| Canvas BG | `#f4f6f9` | Page background |
| Card BG | `#ffffff` | All cards |
| Card Border | `rgba(0,0,0,0.06)` | Ultra-subtle card border |
| Card Shadow | `0 2px 8px rgba(0,0,0,0.06)` | Soft diffused shadow |
| Text Primary | `#1a1f2e` | Headings, bold values |
| Text Secondary | `#6b7280` | Labels, subtext |
| Text Muted | `#9ca3af` | Placeholder, empty state |

### Typography
| Element | Style |
|---|---|
| Stat value (large number) | `font-size: 28px`, `font-weight: 700`, `color: text-primary` |
| Stat label | `font-size: 12px`, `font-weight: 500`, `color: text-secondary` |
| Section heading | `font-size: 14px`, `font-weight: 600`, `color: text-primary` |
| Nav item | `font-size: 13px`, `font-weight: 500` |
| Body | `font-size: 13-14px` |

### Spacing & Radius
| Element | Value |
|---|---|
| Card border-radius | `14px` |
| Button border-radius | `8px` |
| Icon badge border-radius | `50%` (circular) |
| Grid gap | `16px` |
| Card padding | `20px` |

---

## Requirements

### REQ-001: Sidebar Redesign
- Background color: deep navy `#1a1f2e`
- School logo/initials at top with white text on crimson square badge
- School name in white, subtitle in muted white/gray
- Nav items: white text, gray icon, 40px height, 8px radius
- Active nav item: crimson background `#a31c2b`, white icon and text
- Hover state: slightly lighter navy overlay
- Section labels: uppercase, small, muted gray-400
- Bottom: school motto in muted white/40% opacity
- Copyright text at very bottom

### REQ-002: Header Redesign
- White background with very subtle bottom border
- School name label on left (desktop)
- Right side: notification bell icon + user avatar chip
- User chip shows first letter initial on crimson circle + name + role

### REQ-003: Stat Cards
- White background, 14px border-radius
- No harsh borders — only `box-shadow: 0 2px 8px rgba(0,0,0,0.06)`
- Layout: value (bold, large) on left, circular icon badge on right
- Icon badge: 48px circle, soft tinted color matching icon tone
- Label below value in muted gray
- Hover: very slight shadow lift

### REQ-004: Quick Actions Section
- White card with 14px radius
- Grid of action buttons (icon + label text)
- Each action button: white/light bg, icon in tinted circle on left, label text
- Two primary CTA buttons on the right column: solid crimson, white text, 8px radius
- Action buttons hover: subtle bg tint

### REQ-005: Content Cards (Recent Admissions, Payments, Notifications, Quick Stats)
- All in white cards, 14px radius, soft shadow
- Empty states: centered line-art icon + muted text label
- Quick Stats card: label on left, value (bold) on right, per row

### REQ-006: Page Background
- All dashboard pages use `#f4f6f9` canvas background (not pure white, not harsh gray)

### REQ-007: Buttons
- Primary: crimson `#a31c2b` background, white text, 8px radius
- Secondary/outline: white bg, gray border, gray text, 8px radius
- Hover states on all buttons

### REQ-008: Tables
- Remove harsh black borders
- Use `border-bottom: 1px solid #f3f4f6` between rows
- Header row: `#f9fafb` background, small uppercase labels
- Row hover: `#f9fafb`

### REQ-009: Badges / Status Pills
- Success: `#dcfce7` bg, `#15803d` text
- Warning: `#fef9c3` bg, `#854d0e` text
- Danger: `#fee2e2` bg, `#b91c1c` text
- Info: match brand-50/brand-700

### REQ-010: Responsive
- All existing responsive behavior preserved
- Sidebar collapse on mobile unchanged
- Cards reflow from 4-col → 2-col → 1-col as before

---

## Out of Scope
- Authentication logic
- Database queries
- API routes
- Business logic
- Prisma schema
