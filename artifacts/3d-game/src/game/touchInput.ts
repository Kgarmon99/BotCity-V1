// Shared mutable singleton for on-screen touch controls.
// Mirrors the keyboard input: TouchControls.tsx writes the joystick vector
// and button state here; Player.tsx reads it every frame and merges it with
// the keyboard state (whichever has greater magnitude wins).
//
// Kept outside React state — joystick drags fire ~60 times/sec and we don't
// want a re-render storm.

export const touchInput = {
  /** Normalized joystick X in [-1, 1]. +X = right, -X = left. */
  moveX: 0,
  /** Normalized joystick Z in [-1, 1]. +Z = forward (like W), -Z = back. */
  moveZ: 0,
  /** Monotonic counter — incremented every time the on-screen "E" button
   *  fires. Player watches for changes via useFrame so we can keep this a
   *  plain mutable object rather than React state. */
  interactTick: 0,
  /** True while the on-screen ride button is held. Equivalent to Space. */
  rideHeld: false,
  /** True while the on-screen jetpack button is held. Equivalent to Shift. */
  jetHeld: false,
};
