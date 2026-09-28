import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { PhysicalPageTurnBook } from '../three/PhysicalPageTurnBook';
import { SPREADS_DATA } from '../../lib/bookData';
import { renderLeftPageCanvas, renderRightPageCanvas } from '../../lib/pageCanvasRenderer';
import { soundEngine } from '../../lib/soundEngine';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

export const BookSpreadViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [spreadTextures, setSpreadTextures] = useState<Array<{ left: THREE.Texture; right: THREE.Texture }>>([]);
  const [currentSpreadIdx, setCurrentSpreadIdx] = useState<number>(0);
  const [pageTurnProgress, setPageTurnProgress] = useState<number>(0);

  // Generate 2K textures for all spreads on mount
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const textures = SPREADS_DATA.map((spread) => {
      const leftDataUrl = renderLeftPageCanvas(spread);
      const rightDataUrl = renderRightPageCanvas(spread);

      const leftTex = loader.load(leftDataUrl);
      const rightTex = loader.load(rightDataUrl);

      leftTex.generateMipmaps = true;
      leftTex.minFilter = THREE.LinearMipmapLinearFilter;
      rightTex.generateMipmaps = true;
      rightTex.minFilter = THREE.LinearMipmapLinearFilter;

      return { left: leftTex, right: rightTex };
    });

    setSpreadTextures(textures);
  }, []);

  // Track scroll inside the dedicated physical page turn track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const trackHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (trackHeight <= 0) return;

      const relativeScroll = -rect.top;
      const totalProgress = Math.min(1, Math.max(0, relativeScroll / trackHeight));

      const totalSpreads = SPREADS_DATA.length;
      const scaledProgress = totalProgress * (totalSpreads - 1);
      const spreadIdx = Math.min(totalSpreads - 2, Math.floor(scaledProgress));
      const rawTurnProgress = scaledProgress - spreadIdx;
      const smoothedProgress = Math.min(1, Math.max(0, rawTurnProgress));

      setCurrentSpreadIdx(spreadIdx);
      setPageTurnProgress(smoothedProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const manualTurnNext = () => {
    soundEngine.playPageTurn();
    const nextIdx = (currentSpreadIdx + 1) % (SPREADS_DATA.length - 1);
    setCurrentSpreadIdx(nextIdx);
  };

  const manualTurnPrev = () => {
    soundEngine.playPageTurn();
    const prevIdx = (currentSpreadIdx - 1 + SPREADS_DATA.length - 1) % (SPREADS_DATA.length - 1);
    setCurrentSpreadIdx(prevIdx);
  };

  return (
    <div
      id="book-viewer-section"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '350vh',
        backgroundColor: '#090806'
      }}
    >
      {/* STICKY FULLSCREEN 3D OPEN MANUSCRIPT CONTAINER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 28px 24px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Crisp, High-Contrast Header Bar (No overlap with 3D book) */}
        <div
          style={{
            width: '100%',
            maxWidth: '820px',
            textAlign: 'center',
            zIndex: 30,
            pointerEvents: 'none',
            padding: '12px 24px',
            borderRadius: '20px',
            backgroundColor: 'rgba(9, 8, 6, 0.92)',
            border: '1px solid rgba(201, 164, 92, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(201, 164, 92, 0.45)',
              backgroundColor: 'rgba(201, 164, 92, 0.12)',
              color: '#F0D18A',
              fontSize: '11px',
              fontFamily: '"Cinzel", serif',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '6px'
            }}
          >
            <Sparkles style={{ width: '12px', height: '12px', color: '#ECC875' }} />
            <span>Interactive 3D Manuscript Turn</span>
          </div>

          <h2
            style={{
              fontFamily: '"Cinzel", serif',
              fontSize: 'clamp(1.3rem, 2.2vw, 2.0rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              margin: '0 0 4px 0',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
            }}
          >
            Turn The Sacred Pages
          </h2>

          <p
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '16px',
              color: '#E8DCC4',
              fontStyle: 'italic',
              margin: 0,
              textShadow: '0 1px 4px rgba(0,0,0,0.8)'
            }}
          >
            Scroll down smoothly to fold the page across the spine and enter the next kshetra.
          </p>
        </div>

        {/* 3D WebGL Canvas (Centered cleanly below header) */}
        <div style={{ width: '100%', flex: 1, position: 'relative', zIndex: 10, margin: '8px 0' }}>
          <Canvas
            shadows
            camera={{ position: [0, -0.05, 4.4], fov: 48 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#090806']} />
            <ambientLight intensity={0.8} color="#F1E7D0" />
            <directionalLight
              position={[2, 5, 5]}
              intensity={2.8}
              color="#FFF0D4"
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-3, -1, 3]} intensity={1.4} color="#E5A93C" distance={8} />

            {spreadTextures.length > 0 && (
              <PhysicalPageTurnBook
                pageTurnProgress={pageTurnProgress}
                currentSpreadIdx={currentSpreadIdx}
                spreadTextures={spreadTextures}
                pageWidth={2.45}
                pageHeight={3.35}
              />
            )}
          </Canvas>
        </div>

        {/* Bottom Stage Progress & Tactile Scrubbing Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            zIndex: 30,
            padding: '6px 20px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(9, 8, 6, 0.9)',
            border: '1px solid rgba(201, 164, 92, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <button
            onClick={manualTurnPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(201, 164, 92, 0.35)',
              backgroundColor: 'rgba(17, 16, 13, 0.9)',
              color: '#F0D18A',
              fontSize: '11px',
              fontFamily: '"Cinzel", serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            <ChevronLeft style={{ width: '13px', height: '13px' }} />
            <span>Previous</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <span
              style={{
                fontFamily: '"Cinzel", serif',
                fontSize: '11px',
                color: '#F0D18A',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}
            >
              Spread {currentSpreadIdx + 1} of {SPREADS_DATA.length}
            </span>
            <div
              style={{
                width: '140px',
                height: '3px',
                backgroundColor: 'rgba(201, 164, 92, 0.25)',
                borderRadius: '9999px',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  height: '100%',
                  backgroundColor: '#C9A45C',
                  width: `${Math.round(((currentSpreadIdx + pageTurnProgress) / (SPREADS_DATA.length - 1)) * 100)}%`,
                  transition: 'width 0.1s ease'
                }}
              />
            </div>
          </div>

          <button
            onClick={manualTurnNext}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid rgba(201, 164, 92, 0.35)',
              backgroundColor: 'rgba(17, 16, 13, 0.9)',
              color: '#F0D18A',
              fontSize: '11px',
              fontFamily: '"Cinzel", serif',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: 'pointer'
            }}
          >
            <span>Next</span>
            <ChevronRight style={{ width: '13px', height: '13px' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
