import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const TempleEnvironment: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const pillarsRef = useRef<THREE.Group>(null);
  const lampsRef = useRef<THREE.Group>(null);
  const diyaLightRef = useRef<THREE.PointLight>(null);
  const secondaryLightRef = useRef<THREE.PointLight>(null);

  // Ancient South Indian Black Granite / Basalt with subtle stone roughness
  const darkGraniteMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#15120F'),
      roughness: 0.88,
      metalness: 0.12
    });
  }, []);

  // Warm Chola/Hoysala carved stone
  const carvedStoneMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#211A14'),
      roughness: 0.85,
      metalness: 0.15
    });
  }, []);

  // Aged temple brass & bronze
  const agedBronzeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7A542B'),
      roughness: 0.42,
      metalness: 0.75
    });
  }, []);

  const antiqueGoldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C9A45C'),
      roughness: 0.35,
      metalness: 0.82
    });
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Natural oil lamp flame flicker (gentle thermal variation)
    if (diyaLightRef.current) {
      const flicker = Math.sin(time * 6) * 0.12 + Math.cos(time * 14) * 0.08 + Math.sin(time * 24) * 0.04;
      diyaLightRef.current.intensity = 2.0 + flicker;
      diyaLightRef.current.position.y = -1.2 + Math.sin(time * 4) * 0.008;
    }

    if (secondaryLightRef.current) {
      const flicker2 = Math.cos(time * 5.5) * 0.1 + Math.sin(time * 16) * 0.06;
      secondaryLightRef.current.intensity = 1.4 + flicker2;
    }

    // Parallax depth motion through temple mandapa corridor
    if (pillarsRef.current) {
      pillarsRef.current.position.z = -scrollProgress * 2.2;
    }
  });

  return (
    <group>
      {/* 1. ANCIENT TEMPLE STONE FLOOR (Dark Granite Flagstones) */}
      <mesh position={[0, -2.8, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[44, 44]} />
        <meshStandardMaterial color="#0E0C0A" roughness={0.92} metalness={0.08} />
      </mesh>

      {/* 2. SOUTH INDIAN TEMPLE MANDAPA PILLARS (Chola / Hoysala Layered Architecture) */}
      <group ref={pillarsRef}>
        {[-4.6, 4.6].map((x, i) => (
          <group key={i} position={[x, 0, -1.8]}>
            {/* Tiered Pitha / Plinth Base */}
            <mesh position={[0, -2.4, 0]} material={darkGraniteMaterial} castShadow receiveShadow>
              <boxGeometry args={[1.3, 0.4, 1.3]} />
            </mesh>
            <mesh position={[0, -2.0, 0]} material={carvedStoneMaterial} castShadow receiveShadow>
              <boxGeometry args={[1.05, 0.4, 1.05]} />
            </mesh>

            {/* Octagonal/Moulded Lower Shaft */}
            <mesh position={[0, -1.2, 0]} material={carvedStoneMaterial} castShadow>
              <cylinderGeometry args={[0.38, 0.44, 1.2, 8]} />
            </mesh>

            {/* Central Carved Fluted Shaft */}
            <mesh position={[0, 0.4, 0]} material={darkGraniteMaterial} castShadow>
              <cylinderGeometry args={[0.34, 0.38, 2.0, 16]} />
            </mesh>

            {/* Kalasha & Padma (Lotus moulding capital) */}
            <mesh position={[0, 1.6, 0]} material={carvedStoneMaterial} castShadow>
              <sphereGeometry args={[0.42, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.7]} />
            </mesh>
            <mesh position={[0, 2.1, 0]} material={carvedStoneMaterial} castShadow>
              <boxGeometry args={[0.9, 0.3, 0.9]} />
            </mesh>

            {/* Dravidian Pushpapotika / Corbel Bracket */}
            <mesh position={[0, 2.7, 0]} material={carvedStoneMaterial}>
              <boxGeometry args={[1.4, 0.6, 1.4]} />
            </mesh>

            {/* Brass Hanging Diya Chain & Temple Bell */}
            <mesh position={[x > 0 ? -0.85 : 0.85, 1.8, 0.4]} material={agedBronzeMaterial}>
              <cylinderGeometry args={[0.012, 0.012, 1.8, 8]} />
            </mesh>
            <mesh position={[x > 0 ? -0.85 : 0.85, 0.85, 0.4]} material={antiqueGoldMaterial} castShadow>
              <coneGeometry args={[0.16, 0.32, 16]} />
            </mesh>
          </group>
        ))}

        {/* Distant Sanctuary Background Arch Silhouette */}
        <group position={[0, 1.2, -6.5]}>
          <mesh material={darkGraniteMaterial}>
            <boxGeometry args={[10, 0.5, 0.8]} />
          </mesh>
        </group>
      </group>

      {/* 3. FOREGROUND TRADITIONAL TEMPLE DIYA (BRASS OIL LAMP) */}
      <group position={[1.85, -1.3, 1.1]} ref={lampsRef}>
        {/* Tiered Brass Lamp Base (Kuthu Vilakku style base) */}
        <mesh position={[0, -0.2, 0]} material={agedBronzeMaterial} castShadow>
          <cylinderGeometry args={[0.22, 0.38, 0.15, 24]} />
        </mesh>
        <mesh position={[0, -0.05, 0]} material={antiqueGoldMaterial} castShadow>
          <cylinderGeometry args={[0.12, 0.16, 0.18, 16]} />
        </mesh>
        {/* Oil Basin Bowl */}
        <mesh position={[0, 0.08, 0]} material={agedBronzeMaterial} castShadow>
          <sphereGeometry args={[0.28, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
        {/* Flame Core */}
        <mesh position={[0.12, 0.22, 0]}>
          <coneGeometry args={[0.035, 0.16, 12]} />
          <meshBasicMaterial color="#FFE08A" />
        </mesh>
        {/* Warm Outer Glow */}
        <mesh position={[0.12, 0.22, 0]}>
          <coneGeometry args={[0.07, 0.24, 12]} />
          <meshBasicMaterial color="#E5A83B" transparent opacity={0.55} />
        </mesh>

        {/* Diya Local Point Light */}
        <pointLight
          ref={diyaLightRef}
          position={[0.12, 0.32, 0]}
          color="#E5A83B"
          intensity={2.0}
          distance={6.5}
          decay={2}
          castShadow
        />
      </group>

      {/* 4. SECOND DIYA ON LEFT FOR BALANCED TEMPLE WARMTH */}
      <group position={[-1.95, -1.38, 0.75]}>
        <mesh position={[0, -0.12, 0]} material={agedBronzeMaterial} castShadow>
          <cylinderGeometry args={[0.18, 0.3, 0.12, 24]} />
        </mesh>
        <mesh position={[0.08, 0.08, 0]}>
          <coneGeometry args={[0.03, 0.14, 12]} />
          <meshBasicMaterial color="#FFE08A" />
        </mesh>
        <pointLight
          ref={secondaryLightRef}
          position={[0.08, 0.2, 0]}
          color="#FFA73D"
          intensity={1.4}
          distance={4.5}
          decay={2}
        />
      </group>
    </group>
  );
};
