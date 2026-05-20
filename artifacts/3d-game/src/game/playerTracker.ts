// Shared mutable singleton holding the player's current world position.
// Player.tsx writes here every frame; out-of-Canvas UI like the MiniMap
// reads it via requestAnimationFrame.
//
// Kept outside React state so the 60Hz position update doesn't trigger
// re-renders of the entire HUD tree.

export const playerTracker = {
  x: 0,
  z: 0,
  /** Player's facing yaw in radians (atan2 of velocity), useful for a
   *  forward-facing arrow on the radar. */
  yaw: 0,
};
