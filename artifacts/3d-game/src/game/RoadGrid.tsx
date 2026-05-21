import { ROAD_HALF, ROAD_XS, ROAD_ZS, ROAD_STYLE } from "./cityConstants";

interface RoadProps {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
  color?: string;
  emissive?: string;
}

function Road({ position, length, width, axis, color = "#052e16", emissive = "#22c55e" }: RoadProps) {
  const args: [number, number] = axis === "z" ? [width, length] : [length, width];
  return (
    <group position={position}>
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={args} />
        <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={0.45} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <planeGeometry args={axis === "z" ? [0.12, length * 0.92] : [length * 0.92, 0.12]} />
        <meshStandardMaterial color={emissive} emissive={emissive} emissiveIntensity={1.8} toneMapped={false} />
      </mesh>
    </group>
  );
}

interface SidewalkProps {
  position: [number, number, number];
  length: number;
  width: number;
  axis: "x" | "z";
}

function Sidewalk({ position, length, width, axis }: SidewalkProps) {
  const args: [number, number] = axis === "z" ? [width, length] : [length, width];
  return (
    <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={args} />
      <meshStandardMaterial color="#0a1f17" emissive="#22c55e" emissiveIntensity={0.12} metalness={0.4} roughness={0.5} />
    </mesh>
  );
}

function Crosswalk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[-1.2, -0.6, 0, 0.6, 1.2].map((offset) => (
        <mesh key={offset} rotation={[-Math.PI / 2, 0, 0]} position={[offset, 0.006, 0]}>
          <planeGeometry args={[0.25, 2.4]} />
          <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function Streetlight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 3, 6]} />
        <meshStandardMaterial color="#0a1f17" metalness={0.85} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.05, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshStandardMaterial color="#86efac" emissive="#22c55e" emissiveIntensity={2.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

const HALF = ROAD_HALF;
const INNER_ROAD_LIMIT = 54;

// Build road descriptors from the canonical constant arrays so any future
// edit to ROAD_XS / ROAD_ZS or ROAD_STYLE propagates here automatically.
const verticalRoads = ROAD_XS.map((x) => ({ x, ...ROAD_STYLE[Math.abs(x)] }));
const horizontalRoads = ROAD_ZS.map((z) => ({ z, ...ROAD_STYLE[Math.abs(z)] }));

const streetlights: [number, number, number][] = [];
for (const v of verticalRoads) {
  if (Math.abs(v.x) > INNER_ROAD_LIMIT) continue;
  for (const h of horizontalRoads) {
    if (Math.abs(h.z) > INNER_ROAD_LIMIT) continue;
    if (v.x === 0 && h.z === 0) continue;
    const ox = v.x === 0 ? 2.4 : (v.x > 0 ? -1.8 : 1.8);
    const oz = h.z === 0 ? 2.4 : (h.z > 0 ? -1.8 : 1.8);
    streetlights.push([v.x + ox, 0, h.z + oz]);
  }
}

const crosswalks: [number, number, number][] = [];
for (const v of [-54, -27, 27, 54]) crosswalks.push([v, 0, 0]);
for (const h of [-54, -27, 27, 54]) crosswalks.push([0, 0, h]);

export default function RoadGrid() {
  return (
    <group>
      {verticalRoads.map((r) => (
        <Road key={`vr-${r.x}`} position={[r.x, 0.015, 0]} length={HALF * 2} width={r.width} axis="z" emissive={r.color} />
      ))}
      {horizontalRoads.map((r) => (
        <Road key={`hr-${r.z}`} position={[0, 0.015, r.z]} length={HALF * 2} width={r.width} axis="x" emissive={r.color} />
      ))}

      <Sidewalk position={[ 2.4, 0.02, 0]} length={HALF * 2} width={1.2} axis="z" />
      <Sidewalk position={[-2.4, 0.02, 0]} length={HALF * 2} width={1.2} axis="z" />
      <Sidewalk position={[0, 0.02,  2.4]} length={HALF * 2} width={1.2} axis="x" />
      <Sidewalk position={[0, 0.02, -2.4]} length={HALF * 2} width={1.2} axis="x" />

      {[-18, 18].map((x) => (
        <group key={`vs-${x}`}>
          <Sidewalk position={[x + 1.9, 0.02, 0]} length={HALF * 2} width={0.8} axis="z" />
          <Sidewalk position={[x - 1.9, 0.02, 0]} length={HALF * 2} width={0.8} axis="z" />
        </group>
      ))}
      {[-18, 18].map((z) => (
        <group key={`hs-${z}`}>
          <Sidewalk position={[0, 0.02, z + 1.9]} length={HALF * 2} width={0.8} axis="x" />
          <Sidewalk position={[0, 0.02, z - 1.9]} length={HALF * 2} width={0.8} axis="x" />
        </group>
      ))}

      {crosswalks.map((p, i) => <Crosswalk key={`cw-${i}`} position={p} />)}
      {streetlights.map((p, i) => <Streetlight key={`sl-${i}`} position={p} />)}
    </group>
  );
}
