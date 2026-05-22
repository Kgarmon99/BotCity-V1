import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGameStore, type CameraMode } from "./gameStore";
import { cameraInput, ORBIT_LIMITS } from "./cameraInput";

interface FollowCameraProps {
  target: React.MutableRefObject<THREE.Vector3>;
}

// Camera presets — offset from the player + lookAt vertical bias.
// Index matches CameraMode in gameStore.
interface CamPreset {
  offset: THREE.Vector3;
  lookAtY: number;
  fov: number;
}

// World-space offsets from the player. Player rotation isn't piped in, so
// these are all chase-style fixed-angle cameras (no first-person).
const PRESETS: CamPreset[] = [
  // 0: Chase — over-the-shoulder (original default)
  { offset: new THREE.Vector3(0, 10, 14), lookAtY: 1, fov: 55 },
  // 1: Cinematic — pulled back, see more city
  { offset: new THREE.Vector3(0, 18, 24), lookAtY: 1, fov: 60 },
  // 2: Aerial — high tilted tactical view (RTS-style). Tilted (not pure
  // top-down) so forward/-Z still maps to "up" on screen and WASD stays
  // intuitive; high enough to see most of the city at once.
  { offset: new THREE.Vector3(0, 22, 9), lookAtY: 1, fov: 60 },
  // 3: Side-iso — dramatic diagonal angle on the city
  { offset: new THREE.Vector3(16, 12, 16), lookAtY: 1, fov: 55 },
  // 4: Orbit — free-look. Offset is computed dynamically from cameraInput
  // (yaw/pitch/distance) below; the values here are only the initial seed
  // for the lerp and the fov target.
  { offset: new THREE.Vector3(0, 6, 14), lookAtY: 1.2, fov: 60 },
];

const ORBIT_MODE: CameraMode = 4;

export default function FollowCamera({ target }: FollowCameraProps) {
  const { camera, gl } = useThree();
  const cameraMode = useGameStore((s) => s.cameraMode);
  const cycleCamera = useGameStore((s) => s.cycleCamera);
  const setCameraMode = useGameStore((s) => s.setCameraMode);
  const dialogOpenTick = useGameStore((s) => s.dialogOpenTick);
  // Cinematic FOV punch on dialog open — drops to a tight FOV then eases
  // back to the preset. `flourishStart` is wall-clock time of the last open.
  const flourishStart = useRef(-Infinity);

  const smoothedPos = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3());
  // Interpolated camera params so view changes glide instead of snapping.
  const currentOffset = useRef(PRESETS[0].offset.clone());
  const currentLookY = useRef(PRESETS[0].lookAtY);
  const currentFov = useRef(PRESETS[0].fov);
  // Pre-allocated scratch vectors to avoid per-frame GC pressure.
  const tmpDesired = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());
  const tmpOrbit = useRef(new THREE.Vector3());

  // Stamp the start time on every dialog-open tick so the FOV-punch in
  // useFrame can run its sine-bump window.
  useEffect(() => {
    if (dialogOpenTick === 0) return;
    flourishStart.current = performance.now() / 1000;
  }, [dialogOpenTick]);

  // Keyboard: C cycles, 1-5 selects directly. Ignore when typing in inputs
  // or when a modifier (Ctrl/Meta/Alt) is held — those belong to the browser.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "c" || e.key === "C") {
        cycleCamera();
      } else if (e.key >= "1" && e.key <= "5") {
        setCameraMode(((Number(e.key) - 1) as CameraMode));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleCamera, setCameraMode]);

  // Orbit input — mouse drag rotates, scroll wheel zooms. Only active when
  // the user is in Orbit mode. Attached to the canvas DOM element so it
  // doesn't fight with HUD/dialog clicks.
  useEffect(() => {
    const dom = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const SENS = 0.0055; // radians per pixel

    const onPointerDown = (e: PointerEvent) => {
      if (useGameStore.getState().cameraMode !== ORBIT_MODE) return;
      if (e.button !== 0) return; // left button only
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      dom.setPointerCapture(e.pointerId);
      dom.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      cameraInput.yaw -= dx * SENS;
      cameraInput.pitch = THREE.MathUtils.clamp(
        cameraInput.pitch - dy * SENS,
        ORBIT_LIMITS.pitchMin,
        ORBIT_LIMITS.pitchMax,
      );
    };
    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try { dom.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
      dom.style.cursor = useGameStore.getState().cameraMode === ORBIT_MODE ? "grab" : "";
    };
    const onWheel = (e: WheelEvent) => {
      if (useGameStore.getState().cameraMode !== ORBIT_MODE) return;
      e.preventDefault();
      cameraInput.distance = THREE.MathUtils.clamp(
        cameraInput.distance + e.deltaY * 0.012,
        ORBIT_LIMITS.distMin,
        ORBIT_LIMITS.distMax,
      );
    };

    // If the browser steals capture (system gesture, context menu, alt-tab
    // mid-drag), pointerup never fires. lostpointercapture is the canonical
    // signal to release our drag state so the camera doesn't snap on return.
    const onLostCapture = () => {
      if (!dragging) return;
      dragging = false;
      dom.style.cursor = useGameStore.getState().cameraMode === ORBIT_MODE ? "grab" : "";
    };

    dom.addEventListener("pointerdown", onPointerDown);
    dom.addEventListener("pointermove", onPointerMove);
    dom.addEventListener("pointerup", onPointerUp);
    dom.addEventListener("pointercancel", onPointerUp);
    dom.addEventListener("lostpointercapture", onLostCapture);
    dom.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      dom.removeEventListener("pointerdown", onPointerDown);
      dom.removeEventListener("pointermove", onPointerMove);
      dom.removeEventListener("pointerup", onPointerUp);
      dom.removeEventListener("pointercancel", onPointerUp);
      dom.removeEventListener("lostpointercapture", onLostCapture);
      dom.removeEventListener("wheel", onWheel);
      dom.style.cursor = "";
    };
  }, [gl]);

  // Reflect cursor affordance when the mode changes.
  useEffect(() => {
    gl.domElement.style.cursor = cameraMode === ORBIT_MODE ? "grab" : "";
  }, [cameraMode, gl]);

  const editMode = useGameStore((s) => s.editMode);
  useFrame(() => {
    // While the City Editor is open, CityEditor mounts its own
    // OrthographicCamera as the default camera — don't fight it.
    if (editMode) return;
    const preset = PRESETS[cameraMode];
    // In Orbit mode the offset is derived live from yaw/pitch/distance
    // (spherical coords around the player). All other modes use the static
    // preset offset.
    let targetOffset: THREE.Vector3;
    if (cameraMode === ORBIT_MODE) {
      const { yaw, pitch, distance } = cameraInput;
      // Spherical → cartesian. yaw=0 places camera behind player (+Z axis).
      const cp = Math.cos(pitch);
      tmpOrbit.current.set(
        Math.sin(yaw) * distance * cp,
        Math.sin(pitch) * distance,
        Math.cos(yaw) * distance * cp,
      );
      targetOffset = tmpOrbit.current;
    } else {
      targetOffset = preset.offset;
    }
    // Glide preset params (so view changes feel cinematic, not jarring).
    // In orbit mode we use a tighter lerp so drag feels responsive.
    const offsetLerp = cameraMode === ORBIT_MODE ? 0.5 : 0.07;
    currentOffset.current.lerp(targetOffset, offsetLerp);
    currentLookY.current += (preset.lookAtY - currentLookY.current) * 0.07;
    // Cinematic FOV punch: for ~0.55s after a dialog opens, drop FOV by 8°
    // then ease back. Outside the window the FOV just glides to the preset.
    const tNow = performance.now() / 1000;
    const dt = tNow - flourishStart.current;
    if (dt >= 0 && dt < 0.55) {
      const k = dt / 0.55;
      // Half-sine bump: 0→1→0 → produces a smooth zoom-in/out flourish.
      const bump = Math.sin(k * Math.PI);
      const target = preset.fov - bump * 8;
      currentFov.current += (target - currentFov.current) * 0.25;
    } else {
      currentFov.current += (preset.fov - currentFov.current) * 0.07;
    }

    // desired = target + currentOffset (reusing scratch vector — no GC churn)
    tmpDesired.current.copy(target.current).add(currentOffset.current);
    const posLerp = cameraMode === ORBIT_MODE ? 0.6 : 0.1;
    smoothedPos.current.lerp(tmpDesired.current, posLerp);
    camera.position.copy(smoothedPos.current);

    tmpLook.current.copy(target.current);
    tmpLook.current.y += currentLookY.current;
    smoothedLook.current.lerp(tmpLook.current, 0.15);
    camera.lookAt(smoothedLook.current);

    // Apply fov on perspective cameras only
    const persp = camera as THREE.PerspectiveCamera;
    if (Math.abs(persp.fov - currentFov.current) > 0.01) {
      persp.fov = currentFov.current;
      persp.updateProjectionMatrix();
    }
  });

  return null;
}
