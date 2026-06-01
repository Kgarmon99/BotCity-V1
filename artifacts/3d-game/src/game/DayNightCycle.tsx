import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLAYER_BOUND } from "./cityConstants";

export function getRealTimePhase(now: Date = new Date()): number {
  const hours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  return ((hours - 6) / 24) * Math.PI * 2;
}

export function getDayFactor(now?: Date): number {
  return Math.max(0, Math.sin(getRealTimePhase(now)));
}

export function getNightFactor(now?: Date): number {
  return Math.max(0, -Math.sin(getRealTimePhase(now)));
}

const tmpColor = new THREE.Color();
const dayAmbient = new THREE.Color("#86efac");
const nightAmbient = new THREE.Color("#3b82f6"); 
const dayDir = new THREE.Color("#fef3c7");
const nightDir = new THREE.Color("#93c5fd");
const dayHemiUp = new THREE.Color("#4ade80");
const nightHemiUp = new THREE.Color("#334155"); 
const dayHemiDown = new THREE.Color("#16a34a");
const nightHemiDown = new THREE.Color("#1e293b"); 
const daySunCol = new THREE.Color("#fde047");
const sunsetCol = new THREE.Color("#fb923c");

export default function DayNightCycle() {
  const ambRef = useRef<THREE.AmbientLight>(null!);
  const dirRef = useRef<THREE.DirectionalLight>(null!);
  const hemiRef = useRef<THREE.HemisphereLight>(null!);
  const sunRef = useRef<THREE.Mesh>(null!);
  const sunGlowRef = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    const phase = getRealTimePhase();
    const sx = Math.cos(phase) * 60;
    const sy = Math.sin(phase) * 60;
    const sz = Math.sin(phase * 0.5) * 20;
    const dayFactor = Math.max(0, Math.sin(phase));
    const horizonProx = 1 - Math.abs(Math.sin(phase));
    const aboveHorizon = Math.max(0, Math.sin(phase + 0.1));
    const sunsetFactor = horizonProx * aboveHorizon;

    if (dirRef.current) {
      const isNight = sy < 0;
      dirRef.current.position.set(isNight ? -sx : sx, Math.max(10, Math.abs(sy)), isNight ? -sz : sz);
      dirRef.current.intensity = dayFactor * 0.85 + 0.3;
      tmpColor.copy(nightDir).lerp(dayDir, dayFactor);
      if (sunsetFactor > 0.1) tmpColor.lerp(sunsetCol, sunsetFactor * 0.5);
      dirRef.current.color.copy(tmpColor);
    }
    if (ambRef.current) {
      ambRef.current.intensity = 0.4 + dayFactor * 0.4;
      tmpColor.copy(nightAmbient).lerp(dayAmbient, dayFactor);
      ambRef.current.color.copy(tmpColor);
    }
    if (hemiRef.current) {
      hemiRef.current.intensity = 0.5 + dayFactor * 0.5;
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
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0005}
        shadow-camera-far={270}
        shadow-camera-left={-PLAYER_BOUND}
        shadow-camera-right={PLAYER_BOUND}
        shadow-camera-top={PLAYER_BOUND}
        shadow-camera-bottom={-PLAYER_BOUND}
      />
      <hemisphereLight ref={hemiRef} args={["#4ade80", "#16a34a", 0.6]} />
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
