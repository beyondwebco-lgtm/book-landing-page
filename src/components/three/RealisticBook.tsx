import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const RealisticBook: React.FC<{
  openProgress: number; // 0 = closed book standing/floating, 1 = open book spread
  activeSpread: number;
  coverTexture: THREE.Texture;
  spreadTextures: Array<{ left: THREE.Texture; right: THREE.Texture }>;
  onPageClick?: () => void;
}> = ({ openProgress, activeSpread, coverTexture, spreadTextures, onPageClick }) => {
  const bookGroupRef = useRef<THREE.Group>(null);
  const leftPageRef = useRef<THREE.Group>(null);
  const rightPageRef = useRef<THREE.Group>(null);

  // Book physical dimensions
  const bookWidth = 1.9;
  const bookHeight = 2.7;
  const bookThickness = 0.22;

  // Gold foil & corner protectors material
  const goldMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 0.85,
      roughness: 0.25,
      emissive: new THREE.Color('#3A2A0B'),
      emissiveIntensity: 0.2
    });
  }, []);

  // Aged gilded page edges
  const gildedPageTrimMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#C29B48'),
      metalness: 0.7,
      roughness: 0.4
    });
  }, []);

  // Dark leather spine material
  const leatherMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#1B120C'),
      roughness: 0.65,
      metalness: 0.15
    });
  }, []);

  // Cover Texture Material
  const coverMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.5,
      metalness: 0.35,
      side: THREE.DoubleSide
    });
  }, [coverTexture]);

  useFrame((state) => {
    if (!bookGroupRef.current) return;
    const time = state.clock.getElapsedTime();

    // Gentle spiritual hovering breathing
    bookGroupRef.current.position.y = Math.sin(time * 1.2) * 0.04;

    // Cinematic orientation:
    // When closed (openProgress = 0): Book stands centered, facing camera with slight tilt
    // When open (openProgress = 1): Book lies flat, angled slightly upward for reading
    const rotX = THREE.MathUtils.lerp(0.12, 0.45, openProgress);
    const rotY = THREE.MathUtils.lerp(0.25 * Math.sin(time * 0.6), 0, openProgress);
    const rotZ = THREE.MathUtils.lerp(-0.04, 0, openProgress);

    bookGroupRef.current.rotation.set(rotX, rotY, rotZ);

    // Dynamic opening angle
    if (leftPageRef.current && rightPageRef.current) {
      // Rotate left side open (-90 deg from center)
      leftPageRef.current.rotation.y = THREE.MathUtils.lerp(0, -Math.PI * 0.48, openProgress);
      // Rotate right side open (+90 deg from center)
      rightPageRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.48, openProgress);
    }
  });

  const currentSpread = spreadTextures[activeSpread] || spreadTextures[0];

  return (
    <group ref={bookGroupRef} onClick={onPageClick} position={[0, 0, 0]}>
      {/* 1. CENTRAL ROUNDED BINDING SPINE */}
      <mesh position={[0, 0, -bookThickness * 0.5]} material={leatherMaterial} castShadow>
        <cylinderGeometry args={[0.08, 0.08, bookHeight, 24]} />
      </mesh>

      {/* 2. LEFT WING (Back cover + Left Page Block) */}
      <group ref={leftPageRef} position={[0, 0, 0]}>
        {/* Left Hardcover Board */}
        <mesh position={[-bookWidth * 0.5, 0, -bookThickness * 0.5]} material={coverMat} castShadow receiveShadow>
          <boxGeometry args={[bookWidth, bookHeight, 0.04]} />
        </mesh>
        {/* Left Gilded Page Block */}
        <mesh position={[-bookWidth * 0.5 + 0.02, 0, -bookThickness * 0.2]} material={gildedPageTrimMaterial} castShadow>
          <boxGeometry args={[bookWidth - 0.04, bookHeight - 0.06, bookThickness * 0.6]} />
        </mesh>
        {/* Left Open Page Sheet with Textures */}
        <mesh position={[-bookWidth * 0.5 + 0.02, 0, 0.02]} receiveShadow>
          <planeGeometry args={[bookWidth - 0.06, bookHeight - 0.08]} />
          {currentSpread?.left ? (
            <meshStandardMaterial map={currentSpread.left} roughness={0.7} metalness={0.1} side={THREE.DoubleSide} />
          ) : (
            <meshStandardMaterial color="#F2E6CF" roughness={0.8} />
          )}
        </mesh>
        {/* Left Gold Corners */}
        <mesh position={[-bookWidth + 0.04, bookHeight * 0.5 - 0.04, -bookThickness * 0.5]} material={goldMaterial}>
          <boxGeometry args={[0.08, 0.08, 0.05]} />
        </mesh>
        <mesh position={[-bookWidth + 0.04, -bookHeight * 0.5 + 0.04, -bookThickness * 0.5]} material={goldMaterial}>
          <boxGeometry args={[0.08, 0.08, 0.05]} />
        </mesh>
      </group>

      {/* 3. RIGHT WING (Front cover + Right Page Block) */}
      <group ref={rightPageRef} position={[0, 0, 0]}>
        {/* Right Hardcover Board (When openProgress is 0, this faces the viewer as front cover) */}
        <mesh position={[bookWidth * 0.5, 0, openProgress > 0.05 ? -bookThickness * 0.5 : bookThickness * 0.5]} material={coverMat} castShadow receiveShadow>
          <boxGeometry args={[bookWidth, bookHeight, 0.04]} />
        </mesh>
        {/* Right Gilded Page Block */}
        <mesh position={[bookWidth * 0.5 - 0.02, 0, -bookThickness * 0.2]} material={gildedPageTrimMaterial} castShadow>
          <boxGeometry args={[bookWidth - 0.04, bookHeight - 0.06, bookThickness * 0.6]} />
        </mesh>
        {/* Right Open Page Sheet with Textures */}
        <mesh position={[bookWidth * 0.5 - 0.02, 0, 0.02]} receiveShadow>
          <planeGeometry args={[bookWidth - 0.06, bookHeight - 0.08]} />
          {currentSpread?.right ? (
            <meshStandardMaterial map={currentSpread.right} roughness={0.7} metalness={0.1} side={THREE.DoubleSide} />
          ) : (
            <meshStandardMaterial color="#F2E6CF" roughness={0.8} />
          )}
        </mesh>
        {/* Right Gold Corners */}
        <mesh position={[bookWidth - 0.04, bookHeight * 0.5 - 0.04, -bookThickness * 0.5]} material={goldMaterial}>
          <boxGeometry args={[0.08, 0.08, 0.05]} />
        </mesh>
        <mesh position={[bookWidth - 0.04, -bookHeight * 0.5 + 0.04, -bookThickness * 0.5]} material={goldMaterial}>
          <boxGeometry args={[0.08, 0.08, 0.05]} />
        </mesh>
      </group>

      {/* 4. RED SILK RIBBON BOOKMARK */}
      <mesh position={[0.04, -bookHeight * 0.5 - 0.3, 0.05]} rotation={[0.1, 0, -0.05]} castShadow>
        <planeGeometry args={[0.06, 0.8]} />
        <meshStandardMaterial color="#881B1B" roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
