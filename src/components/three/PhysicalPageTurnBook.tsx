import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PhysicalPageShader } from './PhysicalPageShader';

export interface PageTurnBookProps {
  pageTurnProgress: number; // 0.0 (spread open) -> 1.0 (sheet turned and landed on left)
  currentSpreadIdx: number;
  spreadTextures: Array<{ left: THREE.Texture; right: THREE.Texture }>;
  pageWidth?: number;
  pageHeight?: number;
}

export const PhysicalPageTurnBook: React.FC<PageTurnBookProps> = ({
  pageTurnProgress,
  currentSpreadIdx,
  spreadTextures,
  pageWidth = 2.45,
  pageHeight = 3.35
}) => {
  const turningSheetMeshRef = useRef<THREE.Mesh>(null);
  const uniformsRef = useRef<{
    uCurlProgress: { value: number };
    uFrontTexture: { value: THREE.Texture | null };
    uBackTexture: { value: THREE.Texture | null };
    uPageWidth: { value: number };
    uPageHeight: { value: number };
    uSpineShadowIntensity: { value: number };
  }>({
    uCurlProgress: { value: 0 },
    uFrontTexture: { value: null },
    uBackTexture: { value: null },
    uPageWidth: { value: pageWidth },
    uPageHeight: { value: pageHeight },
    uSpineShadowIntensity: { value: 0.7 }
  });

  // Gilded side page stack material
  const gildedEdgeMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#BFA15C'),
      roughness: 0.45,
      metalness: 0.65
    });
  }, []);

  // Hardcover dark leather board material
  const coverBoardMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#140E0A'),
      roughness: 0.7,
      metalness: 0.2
    });
  }, []);

  // Central Burgundy Spine Ribbon Material
  const spineRibbonMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#7A1414'),
      roughness: 0.35,
      metalness: 0.15
    });
  }, []);

  // Corner gold filigree material
  const goldFiligreeMat = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color('#D4AF37'),
      metalness: 0.85,
      roughness: 0.25
    });
  }, []);

  const currentSpread = spreadTextures[currentSpreadIdx] || spreadTextures[0];
  const nextSpread = spreadTextures[(currentSpreadIdx + 1) % spreadTextures.length] || spreadTextures[0];

  // High-density deformable subdivided plane geometry (128 horizontal x 64 vertical segments)
  const pageGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 128, 64);
    // Shift origin so x = 0 aligns perfectly with the spine hinge
    geo.translate(0.5, 0, 0);
    return geo;
  }, []);

  // Custom Page Material with Physical Shader
  const customPageMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: PhysicalPageShader.vertexShader,
      fragmentShader: PhysicalPageShader.fragmentShader,
      uniforms: uniformsRef.current,
      side: THREE.DoubleSide,
      transparent: false
    });
  }, []);

  useFrame(() => {
    if (uniformsRef.current) {
      uniformsRef.current.uCurlProgress.value = pageTurnProgress;
      uniformsRef.current.uFrontTexture.value = currentSpread?.right || null;
      uniformsRef.current.uBackTexture.value = nextSpread?.left || null;
      uniformsRef.current.uPageWidth.value = pageWidth;
      uniformsRef.current.uPageHeight.value = pageHeight;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* 1. DARK HARDCOVER UNDERNEATH SPREAD */}
      <mesh position={[0, 0, -0.05]} material={coverBoardMat} receiveShadow>
        <boxGeometry args={[pageWidth * 2 + 0.16, pageHeight + 0.16, 0.04]} />
      </mesh>

      {/* 2. GOLD CORNER BRACKETS */}
      {[-pageWidth - 0.04, pageWidth + 0.04].map((x, i) => (
        <React.Fragment key={i}>
          <mesh position={[x, (pageHeight + 0.12) / 2, -0.03]} material={goldFiligreeMat}>
            <boxGeometry args={[0.09, 0.09, 0.05]} />
          </mesh>
          <mesh position={[x, -(pageHeight + 0.12) / 2, -0.03]} material={goldFiligreeMat}>
            <boxGeometry args={[0.09, 0.09, 0.05]} />
          </mesh>
        </React.Fragment>
      ))}

      {/* 3. UNDERLYING PAGE STACKS (Page Thickness) */}
      <mesh position={[-pageWidth / 2, 0, -0.02]} material={gildedEdgeMat} receiveShadow>
        <boxGeometry args={[pageWidth, pageHeight, 0.025]} />
      </mesh>
      <mesh position={[pageWidth / 2, 0, -0.02]} material={gildedEdgeMat} receiveShadow>
        <boxGeometry args={[pageWidth, pageHeight, 0.025]} />
      </mesh>

      {/* 4. STATIONARY LEFT BASE PAGE */}
      <mesh position={[-pageWidth / 2, 0, 0.001]} receiveShadow>
        <planeGeometry args={[pageWidth, pageHeight]} />
        {currentSpread?.left ? (
          <meshStandardMaterial map={currentSpread.left} roughness={0.7} metalness={0.08} side={THREE.FrontSide} />
        ) : (
          <meshStandardMaterial color="#F2E6CF" roughness={0.8} />
        )}
      </mesh>

      {/* 5. REVEALED UNDERLYING RIGHT PAGE */}
      <mesh position={[pageWidth / 2, 0, 0.001]} receiveShadow>
        <planeGeometry args={[pageWidth, pageHeight]} />
        {nextSpread?.right ? (
          <meshStandardMaterial map={nextSpread.right} roughness={0.7} metalness={0.08} side={THREE.FrontSide} />
        ) : (
          <meshStandardMaterial color="#F2E6CF" roughness={0.8} />
        )}
      </mesh>

      {/* 6. DYNAMIC PHYSICALLY DEFORMING TURNING PAGE SHEET */}
      <mesh
        ref={turningSheetMeshRef}
        geometry={pageGeometry}
        material={customPageMaterial}
        position={[0, 0, 0.008]}
        castShadow
        receiveShadow
      />

      {/* 7. FIXED CENTRAL BURGUNDY SPINE RIBBON */}
      <mesh position={[0, 0, 0.015]} material={spineRibbonMat} castShadow>
        <boxGeometry args={[0.075, pageHeight + 0.12, 0.025]} />
      </mesh>
    </group>
  );
};
