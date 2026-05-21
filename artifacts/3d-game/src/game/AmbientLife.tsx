import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// AmbientLife — small wandering life around the city.
//   • A flock of 6 birds circling above the city center
//   • Hot-dog stands, news kiosks, ice-cream carts scattered in
//     plazas and on building corners
// All animated via refs only — no per-frame allocations.
// =====================================================================

function Bird({
  phase,
  radius,
  height,
  speed,
  color,
}: {
  phase: number;
  radius: number;
  height: number;
  speed: number;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const wingLRef = useRef<THREE.Mesh>(null!);
  const wingRRef = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (groupRef.current) {
      groupRef.current.position.x = Math.cos(t) * radius;
      groupRef.current.position.y = height + Math.sin(t * 0.7) * 1.5;
      groupRef.current.position.z = Math.sin(t) * radius;
      groupRef.current.rotation.y = -t + Math.PI / 2;
    }
    const flap = Math.sin(t * 8) * 0.5;
    if (wingLRef.current) wingLRef.current.rotation.z = flap;
    if (wingRRef.current) wingRRef.current.rotation.z = -flap;
  });
  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh castShadow>
        <sphereGeometry args={[0.18, 8, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Wings */}
      <mesh ref={wingLRef} position={[0, 0, 0.18]}>
        <boxGeometry args={[0.5, 0.04, 0.22]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh ref={wingRRef} position={[0, 0, -0.18]}>
        <boxGeometry args={[0.5, 0.04, 0.22]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

function CartWheels() {
  return (
    <>
      {[
        [-0.55, 0.2, 0.42],
        [0.55, 0.2, 0.42],
        [-0.55, 0.2, -0.42],
        [0.55, 0.2, -0.42],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.2, 0.2, 0.06, 12]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
    </>
  );
}

function HotDogCart({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Body */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 0.85]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
      {/* Yellow stripe */}
      <mesh position={[0, 0.55, 0.43]}>
        <boxGeometry args={[1.45, 0.2, 0.02]} />
        <meshStandardMaterial color="#fde047" />
      </mesh>
      {/* Service window outline */}
      <mesh position={[0, 1.0, 0.43]}>
        <boxGeometry args={[1.0, 0.5, 0.02]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* Umbrella */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <coneGeometry args={[1.05, 0.45, 8]} />
        <meshStandardMaterial color="#fbbf24" />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.3, 6]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Sign */}
      <mesh position={[0, 1.35, 0.44]}>
        <boxGeometry args={[0.85, 0.32, 0.04]} />
        <meshStandardMaterial color="#f8fafc" emissive="#f8fafc" emissiveIntensity={0.15} />
      </mesh>
      <CartWheels />
    </group>
  );
}

function NewsCart({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[1.3, 1.4, 0.85]} />
        <meshStandardMaterial color="#1e3a8a" />
      </mesh>
      {/* Open service face */}
      <mesh position={[0, 0.95, 0.43]}>
        <boxGeometry args={[1.05, 0.7, 0.02]} />
        <meshStandardMaterial color="#fef3c7" emissive="#fef3c7" emissiveIntensity={0.25} />
      </mesh>
      {/* Roof overhang */}
      <mesh position={[0, 1.45, 0.2]} castShadow>
        <boxGeometry args={[1.5, 0.08, 0.75]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      {/* "NEWS" sign */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[1.1, 0.35, 0.1]} />
        <meshStandardMaterial color="#dc2626" emissive="#dc2626" emissiveIntensity={0.5} />
      </mesh>
      {/* Newspaper stack on the side */}
      <mesh position={[0.55, 0.85, 0.5]}>
        <boxGeometry args={[0.25, 0.18, 0.18]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <CartWheels />
    </group>
  );
}

function IceCreamCart({
  position,
  rotation = 0,
}: {
  position: [number, number, number];
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.6, 0]} castShadow>
        <boxGeometry args={[1.4, 0.9, 0.85]} />
        <meshStandardMaterial color="#f9a8d4" />
      </mesh>
      {/* Cone topper (visible from far) */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <coneGeometry args={[0.28, 0.55, 12]} />
        <meshStandardMaterial color="#fde047" />
      </mesh>
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.28, 14, 12]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>
      <mesh position={[0.12, 2.1, 0.05]} castShadow>
        <sphereGeometry args={[0.16, 12, 10]} />
        <meshStandardMaterial color="#ec4899" />
      </mesh>
      <CartWheels />
    </group>
  );
}

export default function AmbientLife() {
  return (
    <group>
      {/* === Bird flock circling above city center === */}
      <Bird phase={0} radius={28} height={22} speed={0.18} color="#1e293b" />
      <Bird phase={1.1} radius={26} height={24} speed={0.18} color="#374151" />
      <Bird phase={2.3} radius={30} height={20} speed={0.16} color="#0f172a" />
      <Bird phase={3.5} radius={27} height={23} speed={0.19} color="#1f2937" />
      <Bird phase={4.7} radius={29} height={21} speed={0.17} color="#1e293b" />
      <Bird phase={5.9} radius={25} height={25} speed={0.2} color="#0f172a" />

      {/* === Food carts at plazas (each cleared of road bands and bldgs) === */}
      {/* Inner intersection corners (≥4u off the road axis) */}
      <HotDogCart position={[7.5, 0, 7.5]} rotation={Math.PI * 1.25} />
      <NewsCart position={[-7.5, 0, 7.5]} rotation={-Math.PI / 4} />
      {/* Near the museums on the north middle ring */}
      <NewsCart position={[30, 0, -33.75]} rotation={Math.PI} />
      {/* Near BotBeach (≥4u east of beach kiosk) */}
      <HotDogCart position={[60, 0, 33]} rotation={Math.PI / 2} />
      {/* Near BotShops (SW) */}
      {/* z=15.5 keeps it off the secondary road band centered at z=18
          (band z∈[16.9,19.1]) and ≥5u from botshops at (-27, 20.5). */}
      <IceCreamCart position={[-33, 0, 23.25]} rotation={Math.PI / 6} />
      {/* Near LittleBots / river bank */}
      <IceCreamCart position={[22.5, 0, 45]} rotation={-Math.PI / 3} />
    </group>
  );
}
