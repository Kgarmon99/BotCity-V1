import { useMemo } from "react";
import * as THREE from "three";

const treePositions: [number, number, number][] = [
  [-12, 0, -12], [-14, 0, 5], [12, 0, -15], [15, 0, 10],
  [-18, 0, -5], [10, 0, 18], [-8, 0, 18], [18, 0, -8],
  [3, 0, 20], [-20, 0, 8], [20, 0, 3], [-3, 0, -20],
  [6, 0, -20], [-15, 0, 15], [17, 0, -2], [-5, 0, 14],
];

function Tree({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0, 1.2, 2.4, 6]} />
        <meshStandardMaterial color="#16a34a" />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.8, 6]} />
        <meshStandardMaterial color="#78350f" />
      </mesh>
    </group>
  );
}

const lampPositions: [number, number, number][] = [
  [-4, 0, -4], [4, 0, -4], [-4, 0, 4], [4, 0, 4],
  [0, 0, -8], [0, 0, 8], [-8, 0, 0], [8, 0, 0],
];

function Lamp({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      <mesh position={[0, 1.75, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3.5, 6]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      <mesh position={[0.3, 3.4, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.2} />
      </mesh>
      <pointLight position={[0.3, 3.4, 0]} intensity={1.5} distance={8} color="#fef08a" castShadow={false} />
    </group>
  );
}

export default function World() {
  return (
    <group>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#4ade80" roughness={0.95} />
      </mesh>

      {/* Paved roads */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[2.5, 50]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 2.5]} />
        <meshStandardMaterial color="#374151" roughness={0.9} />
      </mesh>

      {/* Sidewalks */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[3.8, 50]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[50, 3.8]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>

      {/* Town square */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#d1d5db" roughness={0.85} />
      </mesh>

      {/* Trees */}
      {treePositions.map((pos, i) => (
        <Tree key={i} pos={pos} />
      ))}

      {/* Lamps */}
      {lampPositions.map((pos, i) => (
        <Lamp key={i} pos={pos} />
      ))}

      {/* Boundary fence */}
      {[-23, 23].map((x) => (
        <mesh key={`fx${x}`} position={[x, 0.6, 0]} castShadow>
          <boxGeometry args={[0.3, 1.2, 46]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}
      {[-23, 23].map((z) => (
        <mesh key={`fz${z}`} position={[0, 0.6, z]} castShadow>
          <boxGeometry args={[46, 1.2, 0.3]} />
          <meshStandardMaterial color="#78350f" />
        </mesh>
      ))}
    </group>
  );
}
