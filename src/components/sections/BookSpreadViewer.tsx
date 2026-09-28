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

  // Track scroll inside the dedicated physical page turn track with rAF throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const trackHeight = containerRef.current.offsetHeight - window.innerHeight;
            if (trackHeight > 0) {
              const relativeScroll = -rect.top;
              const totalProgress = Math.min(1, Math.max(0, relativeScroll / trackHeight));

              const totalSpreads = SPREADS_DATA.length;
              const scaledProgress = totalProgress * (totalSpreads - 1);
              const spreadIdx = Math.min(totalSpreads - 2, Math.floor(scaledProgress));
              const rawTurnProgress = scaledProgress - spreadIdx;
              const smoothedProgress = Math.min(1, Math.max(0, rawTurnProgress));

              setCurrentSpreadIdx(spreadIdx);
              setPageTurnProgress(smoothedProgress);
            }
          }
          ticking = false;
        });
        ticking = true;
      }
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
        {/* Crisp, High-Contrast Ancient Manuscript Archive Plaque */}
        <div
          style={{
            width: '100%',
            maxWidth: '740px',
            textAlign: 'center',
            zIndex: 30,
            pointerEvents: 'none',
            padding: '14px 28px',
            borderRadius: '12px',
            backgroundColor: '#15120F',
            backgroundImage: 'linear-gradient(180deg, rgba(33, 26, 20, 0.96) 0%, rgba(17, 14, 11, 0.98) 100%)',
            border: '1px solid rgba(201, 164, 92, 0.28)',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(201, 164, 92, 0.15)',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '3px 12px',
              borderRadius: '4px',
              border: '1px solid rgba(201, 164, 92, 0.3)',
              backgroundColor: 'rgba(201, 164, 92, 0.08)',
              color: '#C9A45C',
              fontSize: '10px',
              fontFamily: '"Cinzel", serif',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginBottom: '6px',
              fontWeight: 600
            }}
          >
            <Sparkles style={{ width: '11px', height: '11px', color: '#C9A45C' }} />
            <span>Inner Sanctum • Manuscript Archive</span>
          </div>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: 'clamp(1.5rem, 2.6vw, 2.2rem)',
              fontWeight: 600,
              color: '#F2E7D0',
              lineHeight: 1.15,
              margin: '0 0 4px 0',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.95)'
            }}
          >
            Turn The Sacred Pages
          </h2>

          <p
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: '16px',
              color: '#D6C29C',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.4
            }}
          >
            Scroll down smoothly to fold the parchment across the spine and enter the next kshetra.
          </p>
        </div>

        {/* 3D WebGL Canvas (Centered cleanly below header) */}
        <div style={{ width: '100%', flex: 1, position: 'relative', zIndex: 10, margin: '8px 0' }}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            camera={{ position: [0, -0.05, 4.4], fov: 48 }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#0A0806']} />
            <ambientLight intensity={0.75} color="#F2E7D0" />
            <directionalLight
              position={[2, 5, 5]}
              intensity={2.6}
              color="#FFE4B5"
              castShadow
              shadow-mapSize={[1024, 1024]}
            />
            <pointLight position={[-3, -1, 3]} intensity={1.5} color="#E5A83B" distance={8} />

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
            gap: '18px',
            zIndex: 30,
            padding: '6px 14px',
            borderRadius: '8px',
            backgroundColor: '#15120F',
            backgroundImage: 'linear-gradient(180deg, rgba(33, 26, 20, 0.95) 0%, rgba(17, 14, 11, 0.98) 100%)',
            border: '1px solid rgba(201, 164, 92, 0.25)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(201, 164, 92, 0.12)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <button
            onClick={manualTurnPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 12px',
              borderRadius: '5px',
              border: '1px solid rgba(201, 164, 92, 0.25)',
              backgroundColor: 'rgba(21, 18, 15, 0.85)',
              color: '#F2E7D0',
              fontSize: '11px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <ChevronLeft style={{ width: '13px', height: '13px', color: '#C9A45C' }} />
            <span>Previous</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '10px',
                color: '#D6C29C',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Spread {currentSpreadIdx + 1} of {SPREADS_DATA.length}
            </span>
            <div
              style={{
                width: '120px',
                height: '2px',
                backgroundColor: 'rgba(201, 164, 92, 0.2)',
                borderRadius: '2px',
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
              gap: '4px',
              padding: '5px 12px',
              borderRadius: '5px',
              border: '1px solid rgba(201, 164, 92, 0.25)',
              backgroundColor: 'rgba(21, 18, 15, 0.85)',
              color: '#F2E7D0',
              fontSize: '11px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Next</span>
            <ChevronRight style={{ width: '13px', height: '13px', color: '#C9A45C' }} />
          </button>
        </div>
      </div>
    </div>
  );
};
