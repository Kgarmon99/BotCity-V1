// Shared mutable singleton for free-orbit camera input.
// Read/written every frame by FollowCamera (consumer) and Player (movement is
// camera-relative when in Orbit mode). Kept outside React state to avoid
// re-rendering on every pointer move.

export const cameraInput = {
  // Yaw around the player (radians). 0 = camera behind player looking +-Z forward.
  // Increases as the mouse moves right (clockwise viewed from above).
  yaw: 0,
  // Pitch above the horizontal (radians). 0 = level, π/2 = directly above.
  pitch: 0.45,
  // Distance from the player.
  distance: 14,
};

export const ORBIT_LIMITS = {
  pitchMin: 0.08,   // can't go below ~5° (camera would clip through ground)
  pitchMax: 1.4,    // ~80°, just shy of overhead
  distMin: 6,
  distMax: 28,
};
