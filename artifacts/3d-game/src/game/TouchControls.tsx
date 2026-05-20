import { useEffect, useRef, useState } from "react";
import { touchInput } from "./touchInput";

// On-screen joystick + action buttons for touch devices.
// • Bottom-left: round joystick base; drag the knob to steer.
// • Bottom-right: two stacked buttons — interact ("E") and ride ("🚗").
//
// Auto-shows on touch devices; a small toggle (👆) in the bottom-right lets
// desktop users summon it for testing or hybrid laptops.

const JOY_RADIUS = 56; // outer base radius (px) — knob travels within this

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0)
  );
}

export default function TouchControls() {
  // Default to auto-detect; persist a manual override across reloads so users
  // can force-enable on hybrid devices (or hide on small touchscreens).
  const [enabled, setEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem("botcity:touchUi");
      if (stored === "1") return true;
      if (stored === "0") return false;
    } catch {
      /* ignore */
    }
    return isTouchDevice();
  });
  const setEnabledPersisted = (v: boolean) => {
    setEnabled(v);
    try {
      localStorage.setItem("botcity:touchUi", v ? "1" : "0");
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      {enabled && <ActiveControls />}
      {/* Manual toggle — always reachable so desktop users can opt in and
          touch users can hide the overlay if they switch to a keyboard. */}
      <button
        type="button"
        onClick={() => setEnabledPersisted(!enabled)}
        className="fixed bottom-4 right-4 z-30 pointer-events-auto bg-slate-950/80 text-white text-[11px] rounded-full w-10 h-10 border border-emerald-500/20 backdrop-blur-md shadow-[0_0_20px_-8px_rgba(34,197,94,0.5)] hover:bg-slate-900/90 transition-colors flex items-center justify-center"
        title={enabled ? "Hide touch controls" : "Show touch controls"}
        style={{ right: enabled ? "calc(1rem + 180px)" : "1rem" }}
      >
        {enabled ? "⌨️" : "👆"}
      </button>
    </>
  );
}

function ActiveControls() {
  return (
    <>
      <Joystick />
      <ActionButtons />
    </>
  );
}

function Joystick() {
  const baseRef = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const pointerIdRef = useRef<number | null>(null);
  const centerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = baseRef.current;
    if (!el) return;

    const captureCenter = () => {
      const rect = el.getBoundingClientRect();
      centerRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    };

    const update = (clientX: number, clientY: number) => {
      const dx = clientX - centerRef.current.x;
      const dy = clientY - centerRef.current.y;
      const dist = Math.hypot(dx, dy);
      const clampedDist = Math.min(dist, JOY_RADIUS);
      const angle = Math.atan2(dy, dx);
      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;
      setKnob({ x: kx, y: ky });
      // Normalize to [-1, 1]. Y is inverted: dragging up = -y = forward.
      touchInput.moveX = kx / JOY_RADIUS;
      touchInput.moveZ = -ky / JOY_RADIUS;
    };

    const reset = () => {
      pointerIdRef.current = null;
      setKnob({ x: 0, y: 0 });
      touchInput.moveX = 0;
      touchInput.moveZ = 0;
    };

    const onDown = (e: PointerEvent) => {
      if (pointerIdRef.current !== null) return;
      pointerIdRef.current = e.pointerId;
      captureCenter();
      el.setPointerCapture(e.pointerId);
      update(e.clientX, e.clientY);
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      update(e.clientX, e.clientY);
      e.preventDefault();
    };
    const onUp = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      reset();
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("lostpointercapture", onUp);
    window.addEventListener("blur", reset);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("lostpointercapture", onUp);
      window.removeEventListener("blur", reset);
      // Make sure we don't leave the player wandering off after unmount.
      touchInput.moveX = 0;
      touchInput.moveZ = 0;
    };
  }, []);

  const size = JOY_RADIUS * 2;
  return (
    <div
      ref={baseRef}
      className="fixed bottom-6 left-6 z-30 pointer-events-auto rounded-full border-2 border-emerald-400/40 bg-slate-950/60 backdrop-blur-md shadow-[0_0_30px_-8px_rgba(34,197,94,0.6)] touch-none select-none"
      style={{
        width: size,
        height: size,
        // Prevent the browser from interpreting drags as scrolling/zoom.
        touchAction: "none",
      }}
    >
      {/* Inner ring guide */}
      <div className="absolute inset-3 rounded-full border border-emerald-500/20" />
      {/* Knob */}
      <div
        className="absolute top-1/2 left-1/2 w-12 h-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-400 to-emerald-600 border-2 border-emerald-200 shadow-[0_0_18px_-2px_rgba(34,197,94,0.9)] pointer-events-none"
        style={{ transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))` }}
      />
    </div>
  );
}

function ActionButtons() {
  const onInteract = () => {
    touchInput.interactTick += 1;
  };

  // Use pointer events so the ride button feels like Space being held down.
  const rideRef = useRef<HTMLButtonElement>(null);
  const jetRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const wireHoldButton = (
      el: HTMLButtonElement | null,
      onChange: (held: boolean) => void
    ) => {
      if (!el) return () => {};
      const down = (e: PointerEvent) => {
        onChange(true);
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      };
      const up = (e: PointerEvent) => {
        onChange(false);
        try {
          el.releasePointerCapture(e.pointerId);
        } catch {
          /* ignore */
        }
      };
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("lostpointercapture", up);
      return () => {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.removeEventListener("lostpointercapture", up);
        onChange(false);
      };
    };
    const cleanupRide = wireHoldButton(rideRef.current, (h) => {
      touchInput.rideHeld = h;
    });
    const cleanupJet = wireHoldButton(jetRef.current, (h) => {
      touchInput.jetHeld = h;
    });
    // If the browser steals focus mid-press (alt-tab, app switcher, modal),
    // we can miss the pointerup and the flag stays latched. Force-clear on
    // any window-level focus loss so the player doesn't fly off forever.
    const forceRelease = () => {
      touchInput.rideHeld = false;
      touchInput.jetHeld = false;
    };
    window.addEventListener("blur", forceRelease);
    document.addEventListener("visibilitychange", forceRelease);
    return () => {
      cleanupRide();
      cleanupJet();
      window.removeEventListener("blur", forceRelease);
      document.removeEventListener("visibilitychange", forceRelease);
    };
  }, []);

  return (
    <div
      className="fixed bottom-6 right-6 z-30 pointer-events-auto flex flex-col gap-3 items-end"
      style={{ touchAction: "none" }}
    >
      <button
        type="button"
        onClick={onInteract}
        className="w-20 h-20 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 text-slate-950 font-extrabold text-2xl shadow-[0_0_24px_-4px_rgba(251,191,36,0.8)] border-2 border-amber-200 active:scale-95 transition-transform select-none"
        aria-label="Enter building"
      >
        E
      </button>
      <button
        ref={jetRef}
        type="button"
        className="w-16 h-16 rounded-full bg-gradient-to-b from-orange-300 to-orange-600 text-white text-2xl shadow-[0_0_22px_-4px_rgba(249,115,22,0.85)] border-2 border-orange-200 active:scale-95 transition-transform select-none"
        aria-label="Jetpack (hold to fly)"
        title="Jetpack — hold to fly"
      >
        🚀
      </button>
      <button
        ref={rideRef}
        type="button"
        className="w-16 h-16 rounded-full bg-gradient-to-b from-rose-400 to-rose-600 text-white text-2xl shadow-[0_0_20px_-4px_rgba(244,63,94,0.7)] border-2 border-rose-200 active:scale-95 transition-transform select-none"
        aria-label="Ride BotMobile (hold)"
      >
        🚗
      </button>
    </div>
  );
}
