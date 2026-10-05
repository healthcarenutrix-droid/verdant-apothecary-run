# Recent Purchase Pop-up Placement and Visibility

## What will change
- Expand **Position** from two choices to six: top left, top center, top right, bottom left, bottom center, and bottom right.
- Add a **Movement direction** setting so the notice can enter from the left, right, top, or bottom.
- Increase visual contrast with a stronger accent edge, clearer badge, darker text hierarchy, and a more visible shadow while keeping the existing storefront design.
- Keep the pop-up responsive: centered positions remain centered, and all positions fit safely on mobile screens.
- Save the new direction choice with the existing Recent Purchases settings and preserve existing saved settings with a sensible default.

## Technical details
- Extend the existing settings record and its validation with the new position values and animation direction.
- Update the dashboard form and live preview to expose both controls.
- Update the storefront pop-up classes so placement and entry animation are driven by saved settings.
- Verify saving, preview behavior, desktop positioning, mobile fit, and the current build status.
