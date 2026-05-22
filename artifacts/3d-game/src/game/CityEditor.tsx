import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "./gameStore";
import { BUILDING_DEFS } from "./GameScene";
import { snap, effectiveXZ } from "./buildingLayout";

const GROUND_HALF = 200;

// Top-down perspective camera tuning. Altitude doubles as zoom: lower y
// = closer view, higher y = wider view. The camera always points straight
// down (with a tiny Z offset to avoid lookAt singularity).
const CAM_FOV = 60;
const CAM_Y_MIN = 60;      // closest editing altitude
const CAM_Y_MAX = 450;     // furthest pulled-back view (whole city + margin)
const CAM_Y_DEFAULT = 360; // initial framing: ~415u visible at fov 60
const ZOOM_STEP = 1.15;    // wheel altitude multiplier per notch
const PAN_SPEED = 70;      // world units per second baseline

/**
 * Mounted inside the R3F Canvas. While `editMode` is on:
 *  - Swaps the active camera to a high top-down OrthographicCamera so the
 *    user can see and reach the entire city.
 *  - WASD / arrow keys pan the camera; mouse wheel zooms.
 *  - A large invisible ground plane catches pointer-move + click events.
 *  - Moving the cursor updates the snapped `hoverPos`.
 *  - Clicking commits the currently-selected building at hoverPos.
 *  - A neon snap-grid + ring under the picked-up building shows the drop zone.
 */
export default function CityEditor() {
  const editMode = useGameStore((s) => s.editMode);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);
  const setHoverPos = useGameStore((s) => s.setHoverPos);
  const commitBuildingPos = useGameStore((s) => s.commitBuildingPos);
  const cancelPickup = useGameStore((s) => s.cancelPickup);
  const setSelectedBuildingId = useGameStore((s) => s.setSelectedBuildingId);

  const ringRef = useRef<THREE.Mesh>(null!);
  const camRef = useRef<THREE.PerspectiveCamera>(null!);
  const { gl } = useThree();

  // Camera pan/altitude state (refs so updates don't trigger React re-renders).
  const panRef = useRef<[number, number]>([0, 0]);
  const altRef = useRef<number>(CAM_Y_DEFAULT);
  const keysRef = useRef<Set<string>>(new Set());

  // Reset framing every time edit mode is (re)entered.
  useEffect(() => {
    if (editMode) {
      panRef.current = [0, 0];
      altRef.current = CAM_Y_DEFAULT;
      keysRef.current.clear();
    }
  }, [editMode]);

  // Keyboard pan listeners (WASD + arrows). Active only in edit mode.
  useEffect(() => {
    if (!editMode) return;
    const PAN_KEYS = new Set([
      "w", "a", "s", "d", "W", "A", "S", "D",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    ]);
    const onDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (PAN_KEYS.has(e.key)) keysRef.current.add(e.key.toLowerCase());
    };
    const onUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key.toLowerCase());
    };
    const onBlur = () => keysRef.current.clear();
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [editMode]);

  // Wheel zoom on the canvas DOM. Active only in edit mode.
  useEffect(() => {
    if (!editMode) return;
    const el = gl.domElement;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Wheel up zooms in (lower altitude); wheel down zooms out.
      const dir = e.deltaY > 0 ? ZOOM_STEP : 1 / ZOOM_STEP;
      altRef.current = Math.min(CAM_Y_MAX, Math.max(CAM_Y_MIN, altRef.current * dir));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [editMode, gl]);

  // Mouse-drag panning — middle-click OR right-click drag pans the camera.
  // Left-click is reserved for pickup / drop / context menu cancel.
  useEffect(() => {
    if (!editMode) return;
    const el = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const onDown = (e: PointerEvent) => {
      // Buttons: 0=left, 1=middle, 2=right.
      if (e.button !== 1 && e.button !== 2) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      el.setPointerCapture?.(e.pointerId);
      el.style.cursor = "grabbing";
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      // Convert screen-pixel delta to world units. At altitude alt with
      // FOV CAM_FOV, one screen pixel ≈ (2*alt*tan(fov/2))/canvasH units.
      const canvasH = el.clientHeight || 720;
      const worldPerPx = (2 * altRef.current * Math.tan((CAM_FOV * Math.PI) / 360)) / canvasH;
      const [px, pz] = panRef.current;
      const nx = Math.max(-GROUND_HALF, Math.min(GROUND_HALF, px - dx * worldPerPx));
      const nz = Math.max(-GROUND_HALF, Math.min(GROUND_HALF, pz - dy * worldPerPx));
      panRef.current = [nx, nz];
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.releasePointerCapture?.(e.pointerId);
      el.style.cursor = "";
    };
    // Suppress the native context menu so right-click drag works cleanly.
    const onCtx = (e: MouseEvent) => e.preventDefault();
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("contextmenu", onCtx);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("contextmenu", onCtx);
      el.style.cursor = "";
    };
  }, [editMode, gl]);

  // Per-frame: apply pan keys, push pan + zoom to the camera, pulse drop ring.
  useFrame(({ clock }, dt) => {
    if (editMode && camRef.current) {
      // Resolve pan input.
      const k = keysRef.current;
      let dx = 0;
      let dz = 0;
      if (k.has("w") || k.has("arrowup")) dz -= 1;
      if (k.has("s") || k.has("arrowdown")) dz += 1;
      if (k.has("a") || k.has("arrowleft")) dx -= 1;
      if (k.has("d") || k.has("arrowright")) dx += 1;
      if (dx !== 0 || dz !== 0) {
        const len = Math.hypot(dx, dz);
        // Scale pan speed with altitude so panning feels constant on screen.
        const speed = (PAN_SPEED * dt * altRef.current) / CAM_Y_DEFAULT;
        const [px, pz] = panRef.current;
        const nx = Math.max(-GROUND_HALF, Math.min(GROUND_HALF, px + (dx / len) * speed));
        const nz = Math.max(-GROUND_HALF, Math.min(GROUND_HALF, pz + (dz / len) * speed));
        panRef.current = [nx, nz];
      }
      const [px, pz] = panRef.current;
      // Sit the camera with a tiny +Z offset so lookAt's view direction
      // isn't exactly vertical (which would collide with the default
      // up=(0,1,0) and produce a NaN view matrix — the old "green screen").
      camRef.current.position.set(px, altRef.current, pz + 0.0001);
      camRef.current.lookAt(px, 0, pz);
    }
    if (ringRef.current && selectedBuildingId) {
      const t = clock.elapsedTime;
      ringRef.current.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.55 + Math.sin(t * 4) * 0.2;
    }
  });

  if (!editMode) return null;

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!selectedBuildingId) return;
    const x = snap(e.point.x);
    const z = snap(e.point.z);
    if (!hoverPos || hoverPos[0] !== x || hoverPos[1] !== z) {
      setHoverPos([x, z]);
    }
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (selectedBuildingId) {
      commitBuildingPos();
    } else {
      setSelectedBuildingId(null);
    }
  };

  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault?.();
    cancelPickup();
  };

  const ringPos = hoverPos ?? [0, 0];

  return (
    <group>
      {/* High top-down perspective camera — makeDefault swaps it in while
          edit mode is on. FollowCamera bails inside its useFrame when
          editMode is true so it doesn't fight this one. Far plane covers
          ground at y=0 from CAM_Y_MAX altitude with room to spare. */}
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        fov={CAM_FOV}
        position={[0, CAM_Y_DEFAULT, 0.0001]}
        near={1}
        far={1000}
      />

      {/* Snap grid — faint neon overlay so the player can see snap cells.
          400u span with 200 divisions ⇒ 2u cells (matches GRID_SNAP). */}
      <gridHelper
        args={[GROUND_HALF * 2, GROUND_HALF, "#22d3ee", "#0e7490"]}
        position={[0, 0.06, 0]}
      />

      {/* Drop-zone ring under the picked-up building. */}
      {selectedBuildingId && (
        <mesh
          ref={ringRef}
          position={[ringPos[0], 0.08, ringPos[1]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[2.2, 3.0, 32]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.7}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Invisible click/move catcher across the whole city. */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.04, 0]}
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <planeGeometry args={[GROUND_HALF * 2, GROUND_HALF * 2]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Green halos under every building that has been moved. */}
      <SelectionHalos />
    </group>
  );
}

function SelectionHalos() {
  const cityLayout = useGameStore((s) => s.cityLayout);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);
  const items = useMemo(
    () =>
      BUILDING_DEFS.map((b) => {
        const [x, z] = effectiveXZ(
          b.position,
          b.id,
          cityLayout,
          selectedBuildingId,
          hoverPos,
        );
        const moved = cityLayout[b.id] !== undefined;
        return { id: b.id, x, z, moved };
      }).filter((b) => b.moved && b.id !== selectedBuildingId),
    [cityLayout, selectedBuildingId, hoverPos],
  );
  return (
    <group>
      {items.map((b) => (
        <mesh
          key={b.id}
          position={[b.x, 0.07, b.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[2.4, 2.6, 24]} />
          <meshBasicMaterial
            color="#a3e635"
            transparent
            opacity={0.35}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}
