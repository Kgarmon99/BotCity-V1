import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

interface FollowCameraProps {
  target: React.MutableRefObject<THREE.Vector3>;
}

export default function FollowCamera({ target }: FollowCameraProps) {
  const { camera } = useThree();
  const offset = new THREE.Vector3(0, 10, 14);
  const smoothed = useRef(new THREE.Vector3());

  useFrame(() => {
    const desired = target.current.clone().add(offset);
    smoothed.current.lerp(desired, 0.08);
    camera.position.copy(smoothed.current);
    camera.lookAt(target.current.clone().add(new THREE.Vector3(0, 1, 0)));
  });

  return null;
}
