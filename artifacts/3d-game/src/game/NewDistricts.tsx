import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useLinkedOffset } from "./buildingLayout";

// ─────────────────────────────────────────────────────────────────────
// Four new districts that fill educational gaps in the BotCity tax/
// finance curriculum:
//   • BotCourt        ⚖️  Tax court, audits, IRS appeals
//   • BotInsurance    🛡️  Health/auto/life/disability premiums
//   • BotEnergy       ⚡  Solar/EV/energy credits
//   • BotFactory      🏭  Manufacturing, Section 179, depreciation
//
// Footprints chosen to avoid every existing district, landmark, and
// road sidewalk band (roads at x/z = 0, ±27, ±54). Each district owns
// the area inside a colored ground tile so the boundary is obvious.
// ─────────────────────────────────────────────────────────────────────

// ===== BotCourt @ (85, 0, -42) ========================================
// Tax court & audits. NE empty quadrant between Casino, Rocket Station,
// and Hospital. Footprint x[73, 97] z[-52, -32] = 24×20.
function BotCourt() {
  const off = useLinkedOffset("botcourt");
  const scaleRef = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (scaleRef.current) scaleRef.current.rotation.z = Math.sin(t * 0.6) * 0.08;
    if (beaconRef.current) beaconRef.current.emissiveIntensity = 0.9 + Math.sin(t * 2) * 0.5;
  });
  return (
    <group position={[85 + off[0], 0, -42 + off[2]]}>
      {/* Stone plaza ground tinting */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[24, 20]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.95} />
      </mesh>
      {/* Marble inlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[5, 5.5, 32]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
      </mesh>
      {/* Courthouse — stepped marble building */}
      <group position={[0, 0, -3]}>
        {/* Base steps */}
        {[0, 0.3, 0.6].map((h, i) => (
          <mesh key={`step-${i}`} position={[0, h + 0.15, 2 - i * 0.5]} castShadow receiveShadow>
            <boxGeometry args={[10 - i * 0.6, 0.3, 1]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.8} />
          </mesh>
        ))}
        {/* Main body */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 6, 5]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>
        {/* Pediment (triangular roof) */}
        <mesh position={[0, 7, 0]} castShadow>
          <coneGeometry args={[4.5, 1.6, 4]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.6} />
        </mesh>
        {/* Six front columns */}
        {[-3, -1.8, -0.6, 0.6, 1.8, 3].map((cx) => (
          <mesh key={`col-${cx}`} position={[cx, 3, 2.6]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 6, 12]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.6} />
          </mesh>
        ))}
        {/* "TAX COURT" sign */}
        <Text position={[0, 6.4, 2.65]} fontSize={0.55} color="#0f172a" anchorX="center" outlineWidth={0.02} outlineColor="#fbbf24">
          TAX COURT
        </Text>
      </group>
      {/* Scales-of-justice monument on plaza */}
      <group ref={scaleRef} position={[5, 0, 5]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} emissive="#fbbf24" emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 3, 0]}>
          <boxGeometry args={[2.2, 0.08, 0.15]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.2} emissive="#fbbf24" emissiveIntensity={0.4} />
        </mesh>
        {[-1, 1].map((sx) => (
          <group key={`pan-${sx}`} position={[sx, 2.65, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.45, 0.45, 0.06, 16]} />
              <meshStandardMaterial color="#facc15" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
      </group>
      {/* Beacon atop pediment */}
      <mesh position={[0, 8.2, -3]}>
        <sphereGeometry args={[0.25, 12, 12]} />
        <meshStandardMaterial ref={beaconRef} color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.0} toneMapped={false} />
      </mesh>
      {/* Stone benches for waiting */}
      {[[-6, 6], [6, 6], [-6, 3], [6, 3]].map(([bx, bz], i) => (
        <mesh key={`bench-${i}`} position={[bx!, 0.3, bz!]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.6]} />
          <meshStandardMaterial color="#64748b" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ===== BotInsurance @ (75, 0, -90) ====================================
// Insurance HQ — health/auto/life/disability premiums. Moved to the SE
// mid-band (opposite side of the map from its original NW spot). 20×16
// footprint x[65, 85] z[-98, -82] sits in an empty pocket between the
// inner ring road (x=54 east edge ~55.5, 9.5u west gap) and the
// Borrowing & Credit quarter (bankruptcy @ 95,-103: 10u east / 4u south
// clear). 17u gap south to the new BotEcon Lab kiosk at (70,-103).
function BotInsurance() {
  const off = useLinkedOffset("botinsurance");
  const umbrellaRef = useRef<THREE.Group>(null!);
  const towerLightRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (umbrellaRef.current) umbrellaRef.current.rotation.y = t * 0.4;
    if (towerLightRef.current) towerLightRef.current.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.6;
  });
  return (
    <group position={[75 + off[0], 0, -90 + off[2]]}>
      {/* Slate-blue corporate plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 16]} />
        <meshStandardMaterial color="#1e3a5f" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Insurance tower — tall glass slab */}
      <group position={[-4, 0, -2]}>
        <mesh position={[0, 5, 0]} castShadow receiveShadow>
          <boxGeometry args={[5, 10, 4]} />
          <meshStandardMaterial color="#1e40af" metalness={0.6} roughness={0.15} emissive="#1e40af" emissiveIntensity={0.2} />
        </mesh>
        {/* Window grid */}
        {Array.from({ length: 5 }).map((_, row) =>
          [-1.5, 0, 1.5].map((wx) => (
            <mesh key={`win-${row}-${wx}`} position={[wx, 1.5 + row * 1.8, 2.05]}>
              <planeGeometry args={[1.1, 1.2]} />
              <meshStandardMaterial
                color="#bae6fd"
                emissive="#7dd3fc"
                emissiveIntensity={0.7}
                toneMapped={false}
              />
            </mesh>
          ))
        )}
        {/* Beacon on top */}
        <mesh position={[0, 10.5, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.6, 8]} />
          <meshStandardMaterial ref={towerLightRef} color="#f59e0b" emissive="#f59e0b" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      </group>
      {/* Giant umbrella sculpture — the insurance icon */}
      <group ref={umbrellaRef} position={[5, 0, 4]}>
        {/* Pole */}
        <mesh position={[0, 2, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 4, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Canopy — octagonal cone */}
        <mesh position={[0, 4.3, 0]} castShadow>
          <coneGeometry args={[3, 1.4, 8]} />
          <meshStandardMaterial color="#dc2626" roughness={0.5} emissive="#dc2626" emissiveIntensity={0.15} />
        </mesh>
        {/* Tip */}
        <mesh position={[0, 5.15, 0]}>
          <sphereGeometry args={[0.18, 10, 10]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} />
        </mesh>
        {/* Ribs (visible under canopy) */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI;
          return (
            <mesh key={`rib-${i}`} position={[0, 3.95, 0]} rotation={[0, a, 0]}>
              <boxGeometry args={[5.8, 0.04, 0.05]} />
              <meshStandardMaterial color="#7f1d1d" />
            </mesh>
          );
        })}
      </group>
      {/* "PREMIUM" sign */}
      <group position={[7, 0, -5]}>
        <mesh position={[0, 2, 0]} castShadow>
          <boxGeometry args={[0.15, 4, 0.15]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <mesh position={[0, 3.8, 0]} castShadow>
          <boxGeometry args={[3.5, 1.2, 0.2]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, 3.8, 0.11]} fontSize={0.45} color="#f59e0b" anchorX="center" outlineWidth={0.02} outlineColor="#7c2d12">
          PREMIUMS
        </Text>
      </group>
      {/* Reception bollards */}
      {[-8, -4, 0, 4, 8].map((bx) => (
        <mesh key={`bol-${bx}`} position={[bx, 0.4, 8.5]} castShadow>
          <cylinderGeometry args={[0.18, 0.22, 0.8, 8]} />
          <meshStandardMaterial color="#0f172a" emissive="#1e40af" emissiveIntensity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

// ===== BotEnergy @ (41, 0, 96) ========================================
// Solar/EV/wind energy credits. Open strip south of schools in the
// band between road x=27 and road x=54, kept inside the player bound
// at z<=105. Footprint x[30, 52] z[87, 105] = 22×18.
function BotEnergy() {
  const off = useLinkedOffset("botenergy");
  const turbineRef = useRef<THREE.Group>(null!);
  const chargeRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (turbineRef.current) turbineRef.current.rotation.z = t * 2.4;
    if (chargeRef.current) chargeRef.current.emissiveIntensity = 0.8 + Math.sin(t * 5) * 0.6;
  });
  return (
    <group position={[41 + off[0], 0, 96 + off[2]]}>
      {/* Eco-green plaza */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[22, 18]} />
        <meshStandardMaterial color="#1a3826" roughness={0.7} />
      </mesh>
      {/* Solar panel array — 3×2 grid of tilted panels */}
      {Array.from({ length: 6 }).map((_, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const px = -7 + col * 3.2;
        const pz = -6 + row * 3;
        return (
          <group key={`solar-${i}`} position={[px, 0, pz]}>
            {/* Stand */}
            <mesh position={[0, 0.7, -0.4]} castShadow>
              <boxGeometry args={[0.12, 1.4, 0.12]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            <mesh position={[0, 0.7, 0.4]} castShadow>
              <boxGeometry args={[0.12, 1.0, 0.12]} />
              <meshStandardMaterial color="#475569" />
            </mesh>
            {/* Panel tilted toward sun */}
            <mesh position={[0, 1.35, 0]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
              <boxGeometry args={[2.6, 0.05, 1.6]} />
              <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.2} emissive="#60a5fa" emissiveIntensity={0.25} />
            </mesh>
            {/* Cell grid (4×3) — small dark squares on top */}
            {Array.from({ length: 12 }).map((__, j) => {
              const cx = (j % 4 - 1.5) * 0.55;
              const cz = (Math.floor(j / 4) - 1) * 0.45;
              return (
                <mesh key={`cell-${i}-${j}`} position={[cx, 1.38, cz]} rotation={[-Math.PI / 6, 0, 0]}>
                  <planeGeometry args={[0.48, 0.38]} />
                  <meshStandardMaterial color="#0c4a6e" emissive="#0ea5e9" emissiveIntensity={0.4} side={THREE.DoubleSide} />
                </mesh>
              );
            })}
          </group>
        );
      })}
      {/* Wind turbine — signature tall feature */}
      <group position={[7, 0, -7]}>
        {/* Tower */}
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.45, 10, 12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.4} />
        </mesh>
        {/* Nacelle */}
        <mesh position={[0, 10.2, 0.4]} castShadow>
          <boxGeometry args={[0.7, 0.7, 1.4]} />
          <meshStandardMaterial color="#e2e8f0" />
        </mesh>
        {/* Spinning rotor — 3 blades */}
        <group ref={turbineRef} position={[0, 10.2, 1.0]}>
          {[0, 1, 2].map((i) => (
            <mesh key={`blade-${i}`} rotation={[0, 0, (i * Math.PI * 2) / 3]} position={[0, 0, 0]}>
              <boxGeometry args={[0.12, 5, 0.35]} />
              <meshStandardMaterial color="#f1f5f9" roughness={0.3} />
            </mesh>
          ))}
          {/* Hub */}
          <mesh>
            <sphereGeometry args={[0.35, 12, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>
      {/* EV charging stations — 2 pedestals */}
      {[-7, -4].map((cx) => (
        <group key={`ev-${cx}`} position={[cx, 0, 8]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <boxGeometry args={[0.7, 1.6, 0.5]} />
            <meshStandardMaterial color="#16a34a" emissive="#22c55e" emissiveIntensity={0.3} />
          </mesh>
          {/* Screen */}
          <mesh position={[0, 1.15, 0.26]}>
            <planeGeometry args={[0.5, 0.35]} />
            <meshStandardMaterial ref={cx === -7 ? chargeRef : undefined} color="#052e16" emissive="#22c55e" emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
          {/* Cable loop */}
          <mesh position={[0, 1.0, 0.32]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.18, 0.05, 8, 16]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>
      ))}
      {/* Battery monolith */}
      <group position={[2, 0, 8]}>
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[2.4, 2.4, 1]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
        <Text position={[0, 1.2, 0.51]} fontSize={0.7} color="#22c55e" anchorX="center" outlineWidth={0.03} outlineColor="#052e16">
          ⚡
        </Text>
      </group>
    </group>
  );
}

// ===== BotFactory @ (-15, 0, -73) =====================================
// Manufacturing district — Section 179, depreciation, COGS. Tucked
// between Soccer Stadium (east edge at x=-26) and the x=0 road, north
// of Golf Course. Footprint x[-22, -8] z[-81, -65] = 14×16.
function BotFactory() {
  const off = useLinkedOffset("botfactory");
  const smokeRefs = useRef<Array<THREE.MeshStandardMaterial | null>>([]);
  const conveyorRef = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    smokeRefs.current.forEach((m, i) => {
      if (m) m.opacity = 0.45 + Math.sin(t * 1.2 + i * 1.3) * 0.25;
    });
    if (conveyorRef.current) {
      conveyorRef.current.emissiveIntensity = 0.5 + Math.sin(t * 4) * 0.3;
    }
  });
  return (
    <group position={[-15 + off[0], 0, -73 + off[2]]}>
      {/* Concrete factory yard */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 16]} />
        <meshStandardMaterial color="#3f3f46" roughness={0.95} />
      </mesh>
      {/* Yellow safety lines */}
      {[-5, -2, 1, 4].map((lx) => (
        <mesh key={`line-${lx}`} rotation={[-Math.PI / 2, 0, 0]} position={[lx, 0.02, 0]}>
          <planeGeometry args={[0.2, 14]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} />
        </mesh>
      ))}
      {/* Main factory building — rust-red shed */}
      <group position={[0, 0, -3]}>
        <mesh position={[0, 2.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[9, 4.4, 5]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.9} />
        </mesh>
        {/* Sawtooth roof (factory classic) */}
        {[-3, -1, 1, 3].map((sx) => (
          <mesh key={`saw-${sx}`} position={[sx, 4.8, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <boxGeometry args={[1.4, 1.4, 5]} />
            <meshStandardMaterial color="#92400e" roughness={0.85} />
          </mesh>
        ))}
        {/* Big sliding door */}
        <mesh position={[0, 1.4, 2.55]}>
          <planeGeometry args={[3, 2.6]} />
          <meshStandardMaterial color="#1f1f23" roughness={0.7} />
        </mesh>
        {/* Window strip */}
        {[-3, -1.5, 1.5, 3].map((wx) => (
          <mesh key={`fw-${wx}`} position={[wx, 3.3, 2.55]}>
            <planeGeometry args={[1.1, 0.6]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.9} toneMapped={false} />
          </mesh>
        ))}
        {/* FACTORY sign */}
        <Text position={[0, 4.1, 2.56]} fontSize={0.42} color="#fbbf24" anchorX="center" outlineWidth={0.02} outlineColor="#7c2d12">
          BOTFACTORY
        </Text>
      </group>
      {/* Twin smokestacks */}
      {[-3.5, -1.5].map((sx, i) => (
        <group key={`stack-${i}`} position={[sx, 0, -5.5]}>
          <mesh position={[0, 4, 0]} castShadow>
            <cylinderGeometry args={[0.55, 0.7, 8, 14]} />
            <meshStandardMaterial color="#52525b" roughness={0.95} />
          </mesh>
          {/* Red bands */}
          {[1.5, 6].map((bh) => (
            <mesh key={`band-${bh}`} position={[0, bh, 0]}>
              <cylinderGeometry args={[0.72, 0.66, 0.4, 14]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
          ))}
          {/* Smoke puff */}
          <mesh position={[0, 9, 0]}>
            <sphereGeometry args={[1.2, 12, 10]} />
            <meshStandardMaterial
              ref={(el) => {
                smokeRefs.current[i] = el;
              }}
              color="#94a3b8"
              transparent
              opacity={0.55}
              roughness={1}
            />
          </mesh>
          <mesh position={[0.3, 10.2, 0.2]}>
            <sphereGeometry args={[0.9, 12, 10]} />
            <meshStandardMaterial
              ref={(el) => {
                smokeRefs.current[i + 2] = el;
              }}
              color="#cbd5e1"
              transparent
              opacity={0.45}
              roughness={1}
            />
          </mesh>
        </group>
      ))}
      {/* Conveyor belt — short stretch on the yard */}
      <group position={[4, 0, 2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[4, 0.2, 1.2]} />
          <meshStandardMaterial ref={conveyorRef} color="#1e293b" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
        {/* Roller endcaps */}
        {[-2, 2].map((rx) => (
          <mesh key={`roll-${rx}`} position={[rx, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 1.3, 12]} />
            <meshStandardMaterial color="#71717a" metalness={0.7} />
          </mesh>
        ))}
        {/* Boxes on belt */}
        {[-1.2, 0, 1.2].map((bx, i) => (
          <mesh key={`box-${i}`} position={[bx, 1.0, 0]} castShadow>
            <boxGeometry args={[0.7, 0.6, 0.7]} />
            <meshStandardMaterial color="#a16207" roughness={0.95} />
          </mesh>
        ))}
      </group>
      {/* Stacked crates */}
      {[[-5, 4], [-5, 5.6], [-3.5, 4]].map(([cx, cz], i) => (
        <mesh key={`crate-${i}`} position={[cx!, 0.55 + (i === 1 ? 1.1 : 0), cz!]} castShadow>
          <boxGeometry args={[1.1, 1.1, 1.1]} />
          <meshStandardMaterial color="#a16207" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

// ===== BotStock Exchange @ (-75, 0, 35) ===============================
// NYSE-style trading pavilion. Marble Greek-revival façade with 8 grand
// columns, triangular pediment with "BSE" emblem, charging bull statue
// on the south plaza, opening-bell tower on the rooftop, animated
// ticker-tape strip wrapping the building, and two large stock-chart
// display screens flanking the entry.
//
// Footprint x[-82, -68] z[30, 40] (14×10). Kiosk sits at south face
// (-75, 1.5, 41). Clear of BotZoo (-75,-10), BotPlane airport
// (-58,67.5; concourse x[-65,-51] is 3u east), and BotMine (-60,-61.5).
function StockExchange() {
  const off = useLinkedOffset("botstockex");
  const bellRef = useRef<THREE.Group>(null!);
  const tickerRef = useRef<THREE.Group>(null!);
  const beaconRef = useRef<THREE.MeshStandardMaterial>(null!);
  const chartARef = useRef<THREE.Mesh>(null!);
  const chartBRef = useRef<THREE.Mesh>(null!);
  const bullEyeRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame((s) => {
    const t = s.clock.elapsedTime;
    if (bellRef.current) bellRef.current.rotation.z = Math.sin(t * 2.4) * 0.25;
    if (tickerRef.current) tickerRef.current.position.x = ((t * 1.2) % 14) - 7;
    if (beaconRef.current) beaconRef.current.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.7;
    const scrollUv = (m: THREE.Mesh | null, speed: number) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissiveIntensity !== undefined) {
        mat.emissiveIntensity = 0.9 + Math.sin(t * speed) * 0.35;
      }
    };
    scrollUv(chartARef.current, 2.1);
    scrollUv(chartBRef.current, 2.8);
    if (bullEyeRef.current) bullEyeRef.current.emissiveIntensity = 1.4 + Math.sin(t * 4) * 0.5;
  });

  return (
    <group position={[-75 + off[0], 0, 35 + off[2]]}>
      {/* ── Marble plaza ground (14×10) ──────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Gold inlay seal in front of building */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 3]}>
        <ringGeometry args={[1.4, 1.6, 40]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, 3]}>
        <circleGeometry args={[1.35, 32]} />
        <meshStandardMaterial color="#1c1917" roughness={0.5} />
      </mesh>
      <Text position={[0, 0.03, 3]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.5} color="#fbbf24" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#0f172a">
        BSE
      </Text>

      {/* ── Stepped marble base (3 steps facing south) ───────────── */}
      {[0, 0.3, 0.6].map((h, i) => (
        <mesh key={`step-${i}`} position={[0, h + 0.15, 1.5 - i * 0.5]} castShadow receiveShadow>
          <boxGeometry args={[12 - i * 0.8, 0.3, 1]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.7} />
        </mesh>
      ))}

      {/* ── Main building body (12×8, marble white) ─────────────── */}
      <mesh position={[0, 4, -2]} castShadow receiveShadow>
        <boxGeometry args={[12, 7, 6]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.55} metalness={0.05} />
      </mesh>
      {/* Gold trim along base */}
      <mesh position={[0, 0.65, -2]}>
        <boxGeometry args={[12.2, 0.15, 6.2]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.7} metalness={0.8} />
      </mesh>
      {/* Gold cornice along top */}
      <mesh position={[0, 7.55, -2]}>
        <boxGeometry args={[12.4, 0.25, 6.4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} metalness={0.8} />
      </mesh>

      {/* ── 8 grand classical columns across south face ─────────── */}
      {[-5.25, -3.75, -2.25, -0.75, 0.75, 2.25, 3.75, 5.25].map((cx) => (
        <group key={`col-${cx}`} position={[cx, 0, 1.05]}>
          {/* Base */}
          <mesh position={[0, 0.85, 0]} castShadow>
            <cylinderGeometry args={[0.42, 0.46, 0.3, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.3} metalness={0.7} />
          </mesh>
          {/* Shaft (fluted look — slightly tapered) */}
          <mesh position={[0, 4.05, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.36, 6.1, 16]} />
            <meshStandardMaterial color="#f1f5f9" roughness={0.6} />
          </mesh>
          {/* Capital */}
          <mesh position={[0, 7.2, 0]} castShadow>
            <cylinderGeometry args={[0.48, 0.4, 0.3, 12]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.35} metalness={0.7} />
          </mesh>
        </group>
      ))}

      {/* ── Triangular pediment ──────────────────────────────────── */}
      <mesh position={[0, 8.4, 1]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[6.5, 2, 4]} />
        <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.35} metalness={0.7} />
      </mesh>
      {/* "BOTSTOCK EXCHANGE" sign across the architrave */}
      <Text
        position={[0, 7.95, 1.4]}
        fontSize={0.55}
        color="#0f172a"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.025}
        outlineColor="#fbbf24"
      >
        BOTSTOCK EXCHANGE
      </Text>

      {/* ── Opening-bell tower on rooftop ────────────────────────── */}
      <group position={[0, 7.7, -2]}>
        {/* Tower base */}
        <mesh position={[0, 1, 0]} castShadow>
          <boxGeometry args={[1.8, 2, 1.8]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} metalness={0.6} />
        </mesh>
        {/* Four open-arched columns supporting the bell housing */}
        {[[-0.7, -0.7], [0.7, -0.7], [-0.7, 0.7], [0.7, 0.7]].map(([px, pz], i) => (
          <mesh key={`belcol-${i}`} position={[px!, 2.5, pz!]}>
            <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} metalness={0.8} />
          </mesh>
        ))}
        {/* Roof cap */}
        <mesh position={[0, 3.3, 0]} castShadow>
          <coneGeometry args={[1.1, 0.7, 4]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} metalness={0.8} />
        </mesh>
        {/* The bell (swings) */}
        <group ref={bellRef} position={[0, 3, 0]}>
          <mesh position={[0, -0.45, 0]} castShadow>
            <cylinderGeometry args={[0.32, 0.42, 0.6, 12]} />
            <meshStandardMaterial color="#b45309" emissive="#fbbf24" emissiveIntensity={0.4} metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Clapper */}
          <mesh position={[0, -0.75, 0]}>
            <sphereGeometry args={[0.07, 8, 8]} />
            <meshStandardMaterial color="#1c1917" metalness={0.9} />
          </mesh>
        </group>
        {/* Beacon on the spire */}
        <mesh position={[0, 3.85, 0]}>
          <sphereGeometry args={[0.18, 12, 12]} />
          <meshStandardMaterial ref={beaconRef} color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      </group>

      {/* ── Two stock-chart display screens flanking the entry ──── */}
      {[-4.2, 4.2].map((sx, i) => (
        <group key={`screen-${i}`} position={[sx, 3.5, 1.1]}>
          {/* Screen frame */}
          <mesh>
            <boxGeometry args={[1.6, 1.1, 0.15]} />
            <meshStandardMaterial color="#0f172a" metalness={0.7} />
          </mesh>
          {/* Screen face (animated glow) */}
          <mesh ref={i === 0 ? chartARef : chartBRef} position={[0, 0, 0.09]}>
            <planeGeometry args={[1.45, 0.95]} />
            <meshStandardMaterial color="#022c22" emissive="#22c55e" emissiveIntensity={1} toneMapped={false} />
          </mesh>
          {/* Sparkline — green ascending zig-zag */}
          {[-0.6, -0.3, 0, 0.3, 0.6].map((zx, j) => {
            const ys = [-0.25, -0.1, 0.05, -0.05, 0.25];
            return (
              <mesh key={`tick-${j}`} position={[zx, ys[j], 0.11]}>
                <boxGeometry args={[0.04, 0.04, 0.02]} />
                <meshStandardMaterial color="#86efac" emissive="#86efac" emissiveIntensity={1.6} toneMapped={false} />
              </mesh>
            );
          })}
          {/* Up arrow */}
          <Text position={[0.55, 0.35, 0.12]} fontSize={0.18} color="#22c55e" anchorX="center" anchorY="middle">
            ▲
          </Text>
        </group>
      ))}

      {/* ── Ticker-tape strip wrapping around south face ────────── */}
      <group position={[0, 0.95, 1.6]}>
        <mesh>
          <boxGeometry args={[12, 0.5, 0.1]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} />
        </mesh>
        {/* Scrolling text inside the strip (animated x position) */}
        <group ref={tickerRef}>
          <Text position={[0, 0, 0.06]} fontSize={0.32} color="#22c55e" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#022c22">
            BOT +2.4%  CITY +1.1%  COIN +3.7%  IRS -0.4%  TAX +5.0%  BULL +∞
          </Text>
        </group>
      </group>

      {/* ── CHARGING BULL STATUE — south plaza centerpiece ──────── */}
      <group position={[0, 0, 4.5]} rotation={[0, Math.PI / 2, 0]}>
        {/* Granite pedestal */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[2.4, 0.5, 1.4]} />
          <meshStandardMaterial color="#1c1917" roughness={0.5} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[2.5, 0.06, 1.5]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} metalness={0.9} />
        </mesh>
        {/* Bull body — bronze, charging pose */}
        <group position={[0, 1.05, 0]} rotation={[0, 0, -0.08]}>
          {/* Torso */}
          <mesh castShadow>
            <boxGeometry args={[1.8, 0.85, 0.8]} />
            <meshStandardMaterial color="#92400e" metalness={0.85} roughness={0.35} emissive="#7c2d12" emissiveIntensity={0.2} />
          </mesh>
          {/* Hump (shoulders) */}
          <mesh position={[-0.55, 0.5, 0]} castShadow>
            <sphereGeometry args={[0.38, 12, 8]} />
            <meshStandardMaterial color="#92400e" metalness={0.85} roughness={0.35} />
          </mesh>
          {/* Head — leaning forward */}
          <group position={[-1.05, 0.05, 0]} rotation={[0, 0, -0.35]}>
            <mesh castShadow>
              <boxGeometry args={[0.7, 0.55, 0.55]} />
              <meshStandardMaterial color="#92400e" metalness={0.85} roughness={0.35} />
            </mesh>
            {/* Snout */}
            <mesh position={[-0.35, -0.1, 0]} castShadow>
              <boxGeometry args={[0.3, 0.35, 0.4]} />
              <meshStandardMaterial color="#7c2d12" metalness={0.85} roughness={0.4} />
            </mesh>
            {/* Two horns curving forward */}
            {[-0.18, 0.18].map((hz, i) => (
              <group key={`horn-${i}`} position={[-0.1, 0.3, hz]} rotation={[0, 0, 0.6]}>
                <mesh castShadow>
                  <coneGeometry args={[0.06, 0.45, 6]} />
                  <meshStandardMaterial color="#fde68a" emissive="#fbbf24" emissiveIntensity={0.3} metalness={0.95} roughness={0.2} />
                </mesh>
              </group>
            ))}
            {/* Eyes — glowing */}
            {[-0.15, 0.15].map((ez, i) => (
              <mesh key={`eye-${i}`} position={[-0.2, 0.05, ez]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial ref={i === 0 ? bullEyeRef : undefined} color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.4} toneMapped={false} />
              </mesh>
            ))}
            {/* Nose ring */}
            <mesh position={[-0.5, -0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.06, 0.018, 6, 12]} />
              <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} metalness={0.95} />
            </mesh>
          </group>
          {/* 4 legs */}
          {[[-0.65, 0.32], [-0.65, -0.32], [0.65, 0.32], [0.65, -0.32]].map(([lx, lz], i) => (
            <mesh key={`leg-${i}`} position={[lx!, -0.65, lz!]} castShadow>
              <boxGeometry args={[0.2, 0.85, 0.2]} />
              <meshStandardMaterial color="#92400e" metalness={0.85} roughness={0.35} />
            </mesh>
          ))}
          {/* Tail (raised mid-charge) */}
          <mesh position={[0.95, 0.25, 0]} rotation={[0, 0, 0.7]} castShadow>
            <cylinderGeometry args={[0.05, 0.08, 0.6, 6]} />
            <meshStandardMaterial color="#92400e" metalness={0.85} roughness={0.4} />
          </mesh>
        </group>
      </group>

      {/* ── Twin flagpoles flanking the entry steps ─────────────── */}
      {[-5.5, 5.5].map((fx, i) => (
        <group key={`flag-${i}`} position={[fx, 0, 2.5]}>
          <mesh position={[0, 2.5, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.07, 5, 8]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.85} />
          </mesh>
          {/* Flag */}
          <mesh position={[0.55, 4.4, 0]} castShadow>
            <planeGeometry args={[1.1, 0.7]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.4} side={THREE.DoubleSide} />
          </mesh>
          {/* Gold finial */}
          <mesh position={[0, 5.05, 0]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} metalness={0.95} />
          </mesh>
        </group>
      ))}

      {/* ── 4 bollards at plaza corners ─────────────────────────── */}
      {[[-6.5, 4.5], [6.5, 4.5], [-6.5, -4.5], [6.5, -4.5]].map(([bx, bz], i) => (
        <group key={`bol-${i}`} position={[bx!, 0, bz!]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.22, 0.8, 10]} />
            <meshStandardMaterial color="#0f172a" metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.82, 0]}>
            <sphereGeometry args={[0.18, 10, 10]} />
            <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.6} metalness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function NewDistricts() {
  return (
    <group>
      <BotCourt />
      <BotInsurance />
      <BotEnergy />
      <BotFactory />
      <StockExchange />
    </group>
  );
}
