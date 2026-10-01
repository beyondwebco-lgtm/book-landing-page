import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PhysicalPageTurnBook } from '../three/PhysicalPageTurnBook';
import { SPREADS_DATA } from '../../lib/bookData';
import { renderLeftPageCanvas, renderRightPageCanvas, preloadAllSpreadImages } from '../../lib/pageCanvasRenderer';
import { soundEngine } from '../../lib/soundEngine';
import { Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

// Dynamic Responsive Camera: Adjusts distance so 4.9-unit book spread never clips on mobile portrait
function ResponsiveSpreadCamera() {
  const { camera, size } = useThree();

  useFrame(() => {
    const aspect = size.width / Math.max(1, size.height);
    const fovRad = (48 * Math.PI) / 360;
    // Spread is 4.9 units wide. Add comfortable lateral margin (~5.4 units)
    const desiredSpreadWidth = 5.4;

    let targetZ = 4.4;
    let targetY = -0.05;

    if (aspect < 1) {
      // Portrait smartphone or tablet
      const computedZ = desiredSpreadWidth / (2 * Math.tan(fovRad) * Math.max(0.40, aspect));
      targetZ = Math.min(10.2, Math.max(4.8, computedZ));
      targetY = 0.04;
    }

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.15);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.15);
    camera.position.x = 0;
    camera.updateProjectionMatrix();
  });

  return null;
}

export const BookSpreadViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const [spreadTextures, setSpreadTextures] = useState<Array<{ left: THREE.Texture; right: THREE.Texture }>>([]);
  const [currentSpreadIdx, setCurrentSpreadIdx] = useState<number>(0);
  const [pageTurnProgress, setPageTurnProgress] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate 2K textures for all spreads on mount with asynchronous image preloader
  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();

    const generateTextures = () => {
      return SPREADS_DATA.map((spread) => {
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
    };

    // 1. Initial fast synchronous generation
    setSpreadTextures(generateTextures());

    // 2. Preload all spread images, then immediately re-generate textures with authentic images!
    preloadAllSpreadImages().then(() => {
      if (isMounted) {
        setSpreadTextures(generateTextures());
      }
    });

    return () => {
      isMounted = false;
    };
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

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const diff = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        manualTurnNext();
      } else {
        manualTurnPrev();
      }
    }
    touchStartXRef.current = null;
  };

  return (
    <div
      id="book-viewer-section"
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        height: isMobile ? '180vh' : '350vh',
        backgroundColor: '#090806'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* STICKY FULLSCREEN 3D OPEN MANUSCRIPT CONTAINER */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100dvh',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile
            ? 'max(6px, env(safe-area-inset-top, 6px)) 8px max(8px, env(safe-area-inset-bottom, 8px)) 8px'
            : 'max(14px, env(safe-area-inset-top, 14px)) 16px max(14px, env(safe-area-inset-bottom, 14px)) 16px',
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
            padding: isMobile ? '6px 12px' : '14px 28px',
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
              padding: '2px 8px',
              borderRadius: '4px',
              border: '1px solid rgba(201, 164, 92, 0.3)',
              backgroundColor: 'rgba(201, 164, 92, 0.08)',
              color: '#C9A45C',
              fontSize: isMobile ? '8.5px' : '10px',
              fontFamily: '"Cinzel", serif',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginBottom: '2px',
              fontWeight: 600
            }}
          >
            <Sparkles style={{ width: '10px', height: '10px', color: '#C9A45C' }} />
            <span>Inner Sanctum • Manuscript Archive</span>
          </div>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: isMobile ? 'clamp(1.15rem, 4.5vw, 1.6rem)' : 'clamp(1.5rem, 2.6vw, 2.2rem)',
              fontWeight: 600,
              color: '#F2E7D0',
              lineHeight: 1.15,
              margin: '0 0 2px 0',
              textShadow: '0 2px 12px rgba(0, 0, 0, 0.95)'
            }}
          >
            Turn The Sacred Pages
          </h2>

          <p
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontSize: isMobile ? '12px' : '16px',
              color: '#D6C29C',
              fontStyle: 'italic',
              margin: 0,
              lineHeight: 1.25
            }}
          >
            {isMobile ? 'Swipe left / right or scroll down to turn the sacred folios.' : 'Scroll down smoothly to fold the parchment across the spine and enter the next kshetra.'}
          </p>
        </div>

        {/* 3D WebGL Canvas (Centered cleanly below header) */}
        <div style={{ width: '100%', flex: 1, position: 'relative', zIndex: 10, margin: '4px 0' }}>
          <Canvas
            shadows
            dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1.5]}
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

            {/* RESPONSIVE FULL SPREAD FRAMING CAMERA */}
            <ResponsiveSpreadCamera />

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
            gap: isMobile ? '10px' : '18px',
            zIndex: 30,
            padding: '5px 12px',
            borderRadius: '8px',
            backgroundColor: '#15120F',
            backgroundImage: 'linear-gradient(180deg, rgba(33, 26, 20, 0.95) 0%, rgba(17, 14, 11, 0.98) 100%)',
            border: '1px solid rgba(201, 164, 92, 0.25)',
            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(201, 164, 92, 0.12)',
            backdropFilter: 'blur(12px)',
            maxWidth: 'calc(100% - 16px)'
          }}
        >
          <button
            onClick={manualTurnPrev}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: isMobile ? '6px 10px' : '5px 12px',
              borderRadius: '5px',
              border: '1px solid rgba(201, 164, 92, 0.25)',
              backgroundColor: 'rgba(21, 18, 15, 0.85)',
              color: '#F2E7D0',
              fontSize: isMobile ? '10px' : '11px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '36px'
            }}
          >
            <ChevronLeft style={{ width: '13px', height: '13px', color: '#C9A45C' }} />
            <span>Prev</span>
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
            <span
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: isMobile ? '9px' : '10px',
                color: '#D6C29C',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              Spread {currentSpreadIdx + 1} / {SPREADS_DATA.length}
            </span>
            <div
              style={{
                width: isMobile ? '70px' : '120px',
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
              padding: isMobile ? '6px 10px' : '5px 12px',
              borderRadius: '5px',
              border: '1px solid rgba(201, 164, 92, 0.25)',
              backgroundColor: 'rgba(21, 18, 15, 0.85)',
              color: '#F2E7D0',
              fontSize: isMobile ? '10px' : '11px',
              fontFamily: '"Inter", sans-serif',
              fontWeight: 500,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '36px'
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
