import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useGameStore, type CameraMode } from "./gameStore";

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
  // 2: Top-down — bird's-eye tactical view
  { offset: new THREE.Vector3(0, 32, 0.01), lookAtY: 0, fov: 50 },
  // 3: Side-iso — dramatic diagonal angle on the city
  { offset: new THREE.Vector3(16, 12, 16), lookAtY: 1, fov: 55 },
];

export default function FollowCamera({ target }: FollowCameraProps) {
  const { camera } = useThree();
  const cameraMode = useGameStore((s) => s.cameraMode);
  const cycleCamera = useGameStore((s) => s.cycleCamera);
  const setCameraMode = useGameStore((s) => s.setCameraMode);

  const smoothedPos = useRef(new THREE.Vector3());
  const smoothedLook = useRef(new THREE.Vector3());
  // Interpolated camera params so view changes glide instead of snapping.
  const currentOffset = useRef(PRESETS[0].offset.clone());
  const currentLookY = useRef(PRESETS[0].lookAtY);
  const currentFov = useRef(PRESETS[0].fov);
  // Pre-allocated scratch vectors to avoid per-frame GC pressure.
  const tmpDesired = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  // Keyboard: C cycles, 1-4 selects directly. Ignore when typing in inputs
  // or when a modifier (Ctrl/Meta/Alt) is held — those belong to the browser.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "c" || e.key === "C") {
        cycleCamera();
      } else if (e.key >= "1" && e.key <= "4") {
        setCameraMode(((Number(e.key) - 1) as CameraMode));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cycleCamera, setCameraMode]);

  useFrame(() => {
    const preset = PRESETS[cameraMode];
    // Glide preset params (so switching modes feels cinematic, not jarring)
    currentOffset.current.lerp(preset.offset, 0.07);
    currentLookY.current += (preset.lookAtY - currentLookY.current) * 0.07;
    currentFov.current += (preset.fov - currentFov.current) * 0.07;

    // desired = target + currentOffset (reusing scratch vector — no GC churn)
    tmpDesired.current.copy(target.current).add(currentOffset.current);
    smoothedPos.current.lerp(tmpDesired.current, 0.1);
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
