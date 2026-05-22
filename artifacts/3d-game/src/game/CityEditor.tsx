import { useEffect, useMemo, useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useGameStore, CameraMode } from "./gameStore";
import { BUILDING_DEFS } from "./GameScene";
import { snap, effectiveXZ } from "./buildingLayout";

const GROUND_HALF = 200;

/**
 * Mounted inside the R3F Canvas. While `editMode` is on:
 *  - A large invisible ground plane catches pointer-move + click events.
 *  - Moving the cursor updates the snapped `hoverPos`.
 *  - Clicking the ground commits the currently-selected building.
 *  - A neon snap-grid + ring under the picked-up building shows the drop zone.
 */
export default function CityEditor() {
  const editMode = useGameStore((s) => s.editMode);
  const selectedBuildingId = useGameStore((s) => s.selectedBuildingId);
  const hoverPos = useGameStore((s) => s.hoverPos);
  const cityLayout = useGameStore((s) => s.cityLayout);
  const setHoverPos = useGameStore((s) => s.setHoverPos);
  const commitBuildingPos = useGameStore((s) => s.commitBuildingPos);
  const cancelPickup = useGameStore((s) => s.cancelPickup);
  const setSelectedBuildingId = useGameStore((s) => s.setSelectedBuildingId);

  const ringRef = useRef<THREE.Mesh>(null!);
  const setCameraMode = useGameStore((s) => s.setCameraMode);

  // When entering edit mode, force orbit camera so the user can drag-pan to
  // any side of the city (the player is frozen, so follow-cams freeze too).
  // Restore the previous camera on exit.
  const prevCameraRef = useRef<CameraMode | null>(null);
  useEffect(() => {
    if (editMode) {
      prevCameraRef.current = useGameStore.getState().cameraMode;
      setCameraMode(4);
    } else if (prevCameraRef.current !== null) {
      setCameraMode(prevCameraRef.current);
      prevCameraRef.current = null;
    }
  }, [editMode, setCameraMode]);

  // Pulse the drop-zone ring while a building is selected.
  useFrame(({ clock }) => {
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
      // Click on empty ground deselects (no-op if nothing is selected).
      setSelectedBuildingId(null);
    }
  };

  const handleContextMenu = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault?.();
    cancelPickup();
  };

  // Drop-zone marker — uses the live hover position so it follows the cursor.
  const ringPos = hoverPos ?? [0, 0];

  return (
    <group>
      {/* Snap grid — faint neon grid overlay so the player can see snap cells.
          y=0.06 sits just above the road/ground without z-fighting.
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

      {/* Invisible click/move catcher. y=0.04 so it sits above the road plane
          but below shapes; events bubble down from buildings (they stopPropagation). */}
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

      {/* Selection halos around all overridden buildings (light visual confirm
          that "yes, you moved these"). */}
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
