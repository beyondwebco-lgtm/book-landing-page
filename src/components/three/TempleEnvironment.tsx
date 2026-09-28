import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const TempleEnvironment: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const pillarsRef = useRef<THREE.Group>(null);
  const lampsRef = useRef<THREE.Group>(null);
  const diyaLightRef = useRef<THREE.PointLight>(null);

  // Stone Pillar Material (Aged Indian Black Granite / Basalt with subtle gold reflection)
  const stoneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#141210'),
      roughness: 0.85,
      metalness: 0.15
    });
  }, []);

  const goldBrassMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A45C'),
      roughness: 0.35,
      metalness: 0.8
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Diya warm flame flicker
    if (diyaLightRef.current) {
      const flicker = Math.sin(time * 8) * 0.15 + Math.cos(time * 19) * 0.1 + Math.sin(time * 29) * 0.05;
      diyaLightRef.current.intensity = 1.8 + flicker;
      diyaLightRef.current.position.y = -1.2 + Math.sin(time * 5) * 0.01;
    }

    // Parallax motion of temple environment with scroll
    if (pillarsRef.current) {
      pillarsRef.current.position.z = -scrollProgress * 2;
    }
  });

  return (
    <group>
      {/* 1. ANCIENT TEMPLE STONE FLOOR */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0C0A09" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* 2. TEMPLE CARVED PILLARS (COLUMNS) */}
      <group ref={pillarsRef}>
        {[-4.5, 4.5].map((x, i) => (
          <group key={i} position={[x, 0, -2]}>
            {/* Base */}
            <mesh position={[0, -2.2, 0]} material={stoneMaterial} castShadow receiveShadow>
              <boxGeometry args={[1.2, 0.8, 1.2]} />
            </mesh>
            {/* Shaft */}
            <mesh position={[0, 0.5, 0]} material={stoneMaterial} castShadow>
              <cylinderGeometry args={[0.42, 0.48, 4.6, 16]} />
            </mesh>
            {/* Capital / Carved Gopuram Bracket */}
            <mesh position={[0, 3.0, 0]} material={stoneMaterial}>
              <boxGeometry args={[1.4, 0.6, 1.4]} />
            </mesh>
            {/* Brass Hanging Diya Chain */}
            <mesh position={[x > 0 ? -0.8 : 0.8, 2.0, 0.5]} material={goldBrassMaterial}>
              <cylinderGeometry args={[0.015, 0.015, 1.6, 8]} />
            </mesh>
            {/* Hanging Bell */}
            <mesh position={[x > 0 ? -0.8 : 0.8, 1.1, 0.5]} material={goldBrassMaterial} castShadow>
              <coneGeometry args={[0.18, 0.35, 16]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3. FOREGROUND SACRED DIYA (BRASS OIL LAMP) */}
      <group position={[1.8, -1.3, 1.2]} ref={lampsRef}>
        {/* Brass Diya Base */}
        <mesh position={[0, -0.15, 0]} material={goldBrassMaterial} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 0.12, 24]} />
        </mesh>
        {/* Diya Bowl */}
        <mesh position={[0, 0.02, 0]} material={goldBrassMaterial} castShadow>
          <sphereGeometry args={[0.26, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* Flame Core */}
        <mesh position={[0.12, 0.14, 0]}>
          <coneGeometry args={[0.04, 0.16, 12]} />
          <meshBasicMaterial color="#FFD166" />
        </mesh>
        {/* Flame Outer Glow */}
        <mesh position={[0.12, 0.14, 0]}>
          <coneGeometry args={[0.07, 0.22, 12]} />
          <meshBasicMaterial color="#FF6B35" transparent opacity={0.6} />
        </mesh>

        {/* Diya Local Point Light */}
        <pointLight
          ref={diyaLightRef}
          position={[0.12, 0.25, 0]}
          color="#FF9E3B"
          intensity={2.2}
          distance={6}
          decay={2}
          castShadow
        />
      </group>

      {/* 4. SECOND DIYA ON LEFT FOR BALANCED WARMTH */}
      <group position={[-1.9, -1.4, 0.8]}>
        <mesh position={[0, -0.1, 0]} material={goldBrassMaterial} castShadow>
          <cylinderGeometry args={[0.18, 0.28, 0.1, 24]} />
        </mesh>
        <mesh position={[0.08, 0.08, 0]}>
          <coneGeometry args={[0.035, 0.14, 12]} />
          <meshBasicMaterial color="#FFD166" />
        </mesh>
        <pointLight position={[0.08, 0.16, 0]} color="#FFA245" intensity={1.5} distance={4} decay={2} />
      </group>
    </group>
  );
};
