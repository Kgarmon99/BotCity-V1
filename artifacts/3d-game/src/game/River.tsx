import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// River — short N-S waterway in the SE quadrant with a stone arched
// bridge spanning it. The riverbed sits at x ∈ [1.5, 4.5], z ∈ [33, 51].
// All buildings in that quadrant clear the strip:
//   littlebots (12, 27), botretirement (-5, 27), botkids (-6, 55)
//   are all >7u away from the river footprint.
// =====================================================================

function ArchedBridge({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Stone deck */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.3, 2.2]} />
        <meshStandardMaterial color="#a8a29e" />
      </mesh>
      {/* End abutments */}
      {[-2.9, 2.9].map((x) => (
        <mesh key={x} position={[x, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 1.0, 2.4]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      ))}
      {/* Half-torus arch under the deck on each side */}
      {[1, -1].map((s) => (
        <mesh
          key={s}
          position={[0, 0.05, s * 1.05]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[1.1, 0.16, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      ))}
      {/* Wooden railings */}
      {[1, -1].map((s) => (
        <group key={s}>
          <mesh position={[0, 1.05, s * 1.0]}>
            <boxGeometry args={[6, 0.08, 0.08]} />
            <meshStandardMaterial color="#7c2d12" />
          </mesh>
          {[-2.6, -1.3, 0, 1.3, 2.6].map((x) => (
            <mesh key={x} position={[x, 0.85, s * 1.0]}>
              <boxGeometry args={[0.08, 0.5, 0.08]} />
              <meshStandardMaterial color="#7c2d12" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Rock({
  position,
  scale = 1,
  color = "#57534e",
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <dodecahedronGeometry args={[0.4]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
}

export default function River() {
  const waterRef = useRef<THREE.Mesh>(null!);
  const lilyRef1 = useRef<THREE.Mesh>(null!);
  const lilyRef2 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (waterRef.current) {
      const m = waterRef.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.18 + Math.sin(t * 1.2) * 0.06;
    }
    // Lily pads drift slowly in place
    if (lilyRef1.current) {
      lilyRef1.current.position.x = 2.6 + Math.sin(t * 0.4) * 0.08;
      lilyRef1.current.position.z = 36 + Math.sin(t * 0.3) * 0.06;
    }
    if (lilyRef2.current) {
      lilyRef2.current.position.x = 3.4 + Math.cos(t * 0.35) * 0.08;
      lilyRef2.current.position.z = 48 + Math.cos(t * 0.25) * 0.06;
    }
  });

  return (
    <group>
      {/* Riverbed — dark blue plane just under the water surface */}
      <mesh
        position={[4.5, 0.02, 63]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 20]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      {/* Water surface */}
      <mesh
        ref={waterRef}
        position={[4.5, 0.05, 63]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.5, 19.5]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.78}
          emissive="#60a5fa"
          emissiveIntensity={0.2}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      {/* Grassy banks (one strip on each side) */}
      {[1.1, 4.9].map((x) => (
        <mesh
          key={x}
          position={[x, 0.04, 42]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.9, 20]} />
          <meshStandardMaterial color="#15803d" />
        </mesh>
      ))}
      {/* Rocks along the banks */}
      <Rock position={[1.5, 0.22, 52.5]} scale={0.9} />
      <Rock position={[7.5, 0.22, 55.5]} scale={1.1} color="#44403c" />
      <Rock position={[1.5, 0.22, 67.5]} scale={0.8} />
      <Rock position={[7.5, 0.22, 73.5]} scale={1.0} color="#44403c" />
      <Rock position={[4.5, 0.12, 75.75]} scale={0.6} />
      {/* Drifting lily pads on the water surface */}
      <mesh ref={lilyRef1} position={[3.9, 0.07, 54]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 10]} />
        <meshStandardMaterial color="#22c55e" />
      </mesh>
      <mesh ref={lilyRef2} position={[5.1, 0.07, 72]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 10]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      {/* Reeds along the banks */}
      {[[1.1, 38], [4.9, 41], [1.1, 46], [4.9, 44]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {[0, 0.2, -0.15].map((dx, j) => (
            <mesh key={j} position={[dx, 0.4, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.8, 4]} />
              <meshStandardMaterial color="#65a30d" />
            </mesh>
          ))}
        </group>
      ))}
      {/* Single arched bridge spanning the river at z=40.
          Bridge deck is 6u along local X, 2.2u along local Z; the river
          runs N-S so we mount it unrotated so the long axis crosses the
          ~3.5u water span (deck spans world x ∈ [0, 6]). */}
      <ArchedBridge position={[4.5, 0, 60]} />
    </group>
  );
}
