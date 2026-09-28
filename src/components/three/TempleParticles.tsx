import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export const TempleParticles: React.FC<{ count?: number }> = ({ count = 350 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Spread within temple chamber [-8 to 8 on X, -4 to 5 on Y, -6 to 6 on Z]
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }

    return pos;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      // Gentle ascending incense and thermal drift
      array[i * 3 + 1] += 0.003 * Math.sin(time + i);
      array[i * 3] += Math.sin(time * 0.5 + i * 0.2) * 0.002;
      array[i * 3 + 2] += Math.cos(time * 0.4 + i * 0.3) * 0.002;

      // Wrap particles around chamber boundaries
      if (array[i * 3 + 1] > 4.5) {
        array[i * 3 + 1] = -3.5;
      }
    }

    positionAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#F0D080"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
