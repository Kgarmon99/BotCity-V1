import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// =====================================================================
// DayNightCycle — animated lighting + visible sun that orbits the city.
// =====================================================================
// Owns the scene's ambient, directional, and hemisphere lights so they
// can be smoothly interpolated by phase. A full cycle is PERIOD seconds.
//
// Hoisted Color/Vector constants are reused every frame; no useFrame
// callback allocates.

const PERIOD = 180; // seconds per full day/night cycle

const tmpColor = new THREE.Color();
const dayAmbient = new THREE.Color("#86efac");
const nightAmbient = new THREE.Color("#1e3a8a");
const dayDir = new THREE.Color("#fef3c7");
const nightDir = new THREE.Color("#93c5fd");
const dayHemiUp = new THREE.Color("#4ade80");
const nightHemiUp = new THREE.Color("#1e293b");
const dayHemiDown = new THREE.Color("#16a34a");
const nightHemiDown = new THREE.Color("#0f172a");
const daySunCol = new THREE.Color("#fde047");
const sunsetCol = new THREE.Color("#fb923c");

export default function DayNightCycle() {
  const ambRef = useRef<THREE.AmbientLight>(null!);
  const dirRef = useRef<THREE.DirectionalLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);
  const sunGlowRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const phase = (t / PERIOD) * Math.PI * 2;
    const sx = Math.cos(phase) * 60;
    const sy = Math.sin(phase) * 60;
    const sz = Math.sin(phase * 0.5) * 20;
    const dayFactor = Math.max(0, Math.sin(phase));
    // Sunset glow strongest when sun is near horizon and rising/setting.
    const horizonProx = 1 - Math.abs(Math.sin(phase));
    const aboveHorizon = Math.max(0, Math.sin(phase + 0.1));
    const sunsetFactor = horizonProx * aboveHorizon;

    if (dirRef.current) {
      // Keep the light source above ground so shadows always sweep
      // the city; visual sun mesh can dip below.
      dirRef.current.position.set(sx, Math.max(2, sy), sz);
      dirRef.current.intensity = dayFactor * 0.85 + 0.08;
      tmpColor.copy(nightDir).lerp(dayDir, dayFactor);
      if (sunsetFactor > 0.1) tmpColor.lerp(sunsetCol, sunsetFactor * 0.5);
      dirRef.current.color.copy(tmpColor);
    }
    if (ambRef.current) {
      ambRef.current.intensity = 0.15 + dayFactor * 0.4;
      tmpColor.copy(nightAmbient).lerp(dayAmbient, dayFactor);
      ambRef.current.color.copy(tmpColor);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = 0.25 + dayFactor * 0.5;
      tmpColor.copy(nightHemiUp).lerp(dayHemiUp, dayFactor);
      hemiRef.current.color.copy(tmpColor);
      tmpColor.copy(nightHemiDown).lerp(dayHemiDown, dayFactor);
      hemiRef.current.groundColor.copy(tmpColor);
    }
    if (sunRef.current) {
      sunRef.current.position.set(sx, sy, sz);
      sunRef.current.visible = sy > -3;
      tmpColor.copy(daySunCol).lerp(sunsetCol, sunsetFactor * 0.8);
      (sunRef.current.material as THREE.MeshBasicMaterial).color.copy(tmpColor);
    }
    if (sunGlowRef.current) {
      sunGlowRef.current.position.set(sx, sy, sz);
      sunGlowRef.current.visible = sy > -3;
      const mat = sunGlowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.25 + dayFactor * 0.3;
      tmpColor.copy(daySunCol).lerp(sunsetCol, sunsetFactor * 0.8);
      mat.color.copy(tmpColor);
    }
  });

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.45} color="#86efac" />
      <directionalLight
        ref={dirRef}
        position={[15, 30, 10]}
        intensity={0.7}
        color="#fef3c7"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-far={180}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
      />
      <hemisphereLight ref={hemiRef} args={["#4ade80", "#16a34a", 0.6]} />
      {/* Visible sun + soft halo */}
      <mesh ref={sunRef} position={[60, 30, 0]}>
        <sphereGeometry args={[2.6, 24, 18]} />
        <meshBasicMaterial color="#fde047" toneMapped={false} />
      </mesh>
      <mesh ref={sunGlowRef} position={[60, 30, 0]}>
        <sphereGeometry args={[4.8, 24, 18]} />
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.35}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}
