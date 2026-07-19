# Dashboard UI Redesign — Technical Design

## Approach
Implement all visual changes through:
1. `tailwind.config.ts` — update `brand` color to crimson, add `navy` color scale
2. `globals.css` — update component utility classes, add new patterns
3. Individual component files — update className patterns

No new dependencies required. All changes use existing Tailwind + lucide-react.

---

## Color Token Changes

### tailwind.config.ts
```
brand (crimson):
  50:  #fdf2f3
  100: #fce7e9
  200: #f8c9ce
  300: #f39aa2
  400: #eb6070
  500: #d93347   ← primary accent
  600: #a31c2b   ← active/button
  700: #8b1623
  800: #721320
  900: #5c1019

navy:
  900: #1a1f2e   ← sidebar bg
  800: #222840
  700: #2a3050
  600: #3b4a6b
  400: #6b7da8   ← muted text on dark
  200: #b8c5de   ← very muted on dark
```

---

## Component Changes

### Sidebar (`components/dashboard/Sidebar.tsx`)
- `bg-navy-900` background
- Logo badge: `bg-brand-600` (crimson square)
- School name: `text-white`
- Section labels: `text-navy-200` (very muted)
- Nav item default: `text-gray-300 hover:bg-white/10`
- Nav item active: `bg-brand-600 text-white` + left accent bar

### Header (`components/dashboard/Header.tsx`)
- Keep white bg, subtle border
- Avatar: `bg-brand-600` circle
- School name: uppercase muted label

### StatCard (`components/dashboard/StatCard.tsx`)
- Remove border, add shadow
- Icon badge: circular (rounded-full), 48px, soft tinted
- Value: larger, bolder
- Layout: value+label on left, icon on right

### globals.css
- `.card`: remove border, add shadow, increase border-radius to 14px
- `.stat-value`: larger text
- New `.page-bg`: `bg-[#f4f6f9]`
- Update badge colors to match design

---

## File Change List
1. `tailwind.config.ts`
2. `app/globals.css`
3. `components/dashboard/Sidebar.tsx`
4. `components/dashboard/Header.tsx`
5. `components/dashboard/StatCard.tsx`
6. `app/dashboard/layout.tsx`
7. `app/dashboard/page.tsx`
8. All dashboard sub-pages (teachers, students, fees, scholarships, etc.)
