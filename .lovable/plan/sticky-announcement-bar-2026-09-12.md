# Sticky announcement bar

## Overview
Add a reusable `AnnouncementBar` above the storefront navigation. It will load its saved settings from Lovable Cloud, scroll a duplicated message continuously from right to left, and update immediately when the dashboard setting changes.

## What will be built
- A fixed-height, full-width announcement bar above the sticky navigation.
- A seamless, single-line CSS marquee using duplicated text and a `translateX` keyframe animation.
- Responsive behavior that remains single-line and animated on mobile.
- Reduced-motion support for visitors who disable animations.
- A new **Announcement Bar** dashboard page with:
  - on/off switch
  - announcement text field
  - background color picker
  - text color picker
  - save action and storefront preview
- Default message: **Free Shipping on All Orders**.

## Data and live updates
- Add a singleton `announcement_settings` table containing the message, enabled state, background color, text color, and update timestamp.
- Add explicit database grants and row-level access rules consistent with the project's current dashboard access model.
- Seed the default settings row in the same migration.
- Subscribe the storefront bar to database changes so saved dashboard edits appear without a redeploy or page refresh.
- Use theme-backed CSS variables as fallbacks, with saved colors applied through announcement-specific custom properties.

## App integration
- Place `AnnouncementBar` in the storefront layout above `Navbar` so it appears on every customer-facing page but not in the dashboard.
- Keep the navigation sticky beneath it, accounting for the bar height only when the bar is enabled.
- Add the new dashboard route, page title, and sidebar entry.

## Verification
- Confirm enabled, disabled, edited-text, and edited-color states persist after refresh.
- Confirm a saved dashboard change updates an already-open storefront page.
- Check seamless scrolling and layout at desktop and mobile widths.
- Run focused type checks/tests and inspect the live preview for overflow or overlap.

## Technical note
The dashboard is currently not protected by admin authentication, so its settings write access follows the existing public dashboard pattern. This change will not add authentication or alter other dashboard permissions.
