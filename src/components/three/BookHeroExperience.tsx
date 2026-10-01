import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RealisticBook } from './RealisticBook';
import { TempleEnvironment } from './TempleEnvironment';
import { TempleParticles } from './TempleParticles';
import { createBookCoverTexture, createPageSpreadTexture } from '../../lib/textureGenerator';
import { preloadAllSpreadImages } from '../../lib/pageCanvasRenderer';
import { soundEngine } from '../../lib/soundEngine';
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { BOOK_METADATA } from '../../lib/bookData';

// Dynamic Responsive Camera: Prevents book cutoff on mobile portrait screens
function ResponsiveHeroCamera({ scrollProgress }: { scrollProgress: number }) {
  const { camera, size } = useThree();

  useFrame(() => {
    const aspect = size.width / Math.max(1, size.height);
    const isPortrait = aspect < 1;

    let baseZ = 4.6;
    let targetZ = 3.4;
    let baseY = 0.0;
    let targetY = 0.4;

    if (aspect < 0.58) {
      // Modern tall smartphones (aspect ~0.45 to 0.55)
      baseZ = 7.2;
      targetZ = 5.6;
      baseY = 0.08;
      targetY = 0.28;
    } else if (isPortrait) {
      // Tablets / foldables
      baseZ = 5.8;
      targetZ = 4.4;
      baseY = 0.05;
      targetY = 0.35;
    }

    const progressClamp = THREE.MathUtils.clamp(scrollProgress * 1.5, 0, 1);
    const desiredZ = THREE.MathUtils.lerp(baseZ, targetZ, progressClamp);
    const desiredY = THREE.MathUtils.lerp(baseY, targetY, THREE.MathUtils.clamp((scrollProgress - 0.15) * 2, 0, 1));

    camera.position.z = THREE.MathUtils.lerp(camera.position.z, desiredZ, 0.15);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, desiredY, 0.15);
    camera.position.x = 0;
    camera.updateProjectionMatrix();
  });

  return null;
}

export const BookHeroExperience: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSpread, setActiveSpread] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generate procedural textures with asynchronous image preloader
  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null);
  const [spreadTextures, setSpreadTextures] = useState<Array<{ left: THREE.Texture; right: THREE.Texture }>>([]);

  useEffect(() => {
    let isMounted = true;
    const loader = new THREE.TextureLoader();
    const coverDataUrl = createBookCoverTexture();
    const loadedCover = loader.load(coverDataUrl);
    setCoverTexture(loadedCover);

    const generateSpreads = () => {
      const spreads: Array<{ left: THREE.Texture; right: THREE.Texture }> = [];
      for (let i = 0; i < 4; i++) {
        const { left, right } = createPageSpreadTexture(i);
        spreads.push({
          left: loader.load(left),
          right: loader.load(right)
        });
      }
      return spreads;
    };

    setSpreadTextures(generateSpreads());

    preloadAllSpreadImages().then(() => {
      if (isMounted) {
        setSpreadTextures(generateSpreads());
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Track scroll within the hero pin track with requestAnimationFrame
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
            if (totalHeight > 0) {
              const currentScroll = -rect.top;
              const progress = Math.min(1, Math.max(0, currentScroll / totalHeight));
              setScrollProgress(progress);

              // Determine active spread from scroll stages (0.45 to 0.9)
              if (progress > 0.45) {
                const spreadProgress = (progress - 0.45) / 0.45;
                const newSpread = Math.min(3, Math.floor(spreadProgress * 4));
                if (newSpread !== activeSpread) {
                  setActiveSpread(newSpread);
                  soundEngine.playPageTurn();
                }
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSpread]);

  const bookOpenProgress = THREE.MathUtils.clamp((scrollProgress - 0.15) / 0.35, 0, 1);

  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden',
        height: isMobile ? '170vh' : '280vh',
        backgroundColor: '#090806'
      }}
    >
      {/* STICKY 3D VIEWPORT */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100dvh',
          minHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* WebGL Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas
            shadows
            dpr={[1, typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1.5]}
            camera={{ position: [0, 0, 5], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#090806']} />
            <fog attach="fog" args={['#090806', 4, 16]} />

            {/* RESPONSIVE ADAPTIVE CAMERA */}
            <ResponsiveHeroCamera scrollProgress={scrollProgress} />

            {/* LIGHTING SYSTEM */}
            <ambientLight intensity={0.55} color="#F1E7D0" />
            <directionalLight
              position={[3, 5, 4]}
              intensity={2.4}
              color="#FDE8B3"
              castShadow
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />
            <pointLight position={[-3, 2, 0]} intensity={1.0} color="#C9A45C" distance={10} />
            <pointLight position={[0, -1, 3]} intensity={1.4} color="#FF9E3B" distance={8} />

            {/* 3D SCENE ASSETS */}
            <TempleEnvironment scrollProgress={scrollProgress} />
            <TempleParticles count={isMobile ? 70 : 140} />

            {coverTexture && spreadTextures.length > 0 && (
              <group position={[0, 0, 0]}>
                <RealisticBook
                  openProgress={bookOpenProgress}
                  activeSpread={activeSpread}
                  coverTexture={coverTexture}
                  spreadTextures={spreadTextures}
                  onPageClick={() => soundEngine.playPageTurn()}
                />
                <ContactShadows
                  position={[0, -1.5, 0]}
                  opacity={0.85}
                  scale={8}
                  blur={2.5}
                  far={4}
                  color="#050302"
                />
              </group>
            )}
          </Canvas>
        </div>

        {/* Subtle Cinematic Oil-Lamp & Temple Mandapa Radial Glow */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 48%, rgba(229, 168, 59, 0.12) 0%, rgba(111, 72, 40, 0.08) 35%, transparent 65%)'
          }}
        />

        {/* DOM UI OVERLAYS & NARRATIVE STAGES */}
        <div
          className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-between overflow-hidden max-w-full"
          style={{
            paddingTop: 'max(68px, calc(env(safe-area-inset-top, 0px) + 54px))',
            paddingBottom: 'max(14px, env(safe-area-inset-bottom, 14px))',
            paddingLeft: 'max(14px, env(safe-area-inset-left, 14px))',
            paddingRight: 'max(14px, env(safe-area-inset-right, 14px))'
          }}
        >
          {/* Top Header Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '6px',
                  border: '1px solid rgba(201, 164, 92, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(33, 26, 20, 0.85)',
                  boxShadow: 'inset 0 1px 0 rgba(201, 164, 92, 0.2)'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '2px', backgroundColor: '#C9A45C' }} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '10px',
                    letterSpacing: '0.18em',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    display: 'block',
                    fontWeight: 600
                  }}
                >
                  Thirtha Yatra
                </span>
                <span
                  style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '9px',
                    letterSpacing: '0.04em',
                    color: 'rgba(214, 194, 156, 0.65)'
                  }}
                >
                  Temples & Kshetras
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Sound Toggle Button (Stone/Bronze Pill) */}
              <button
                onClick={toggleAudio}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid rgba(201, 164, 92, 0.28)',
                  backgroundColor: 'rgba(21, 18, 15, 0.92)',
                  backdropFilter: 'blur(8px)',
                  color: '#D6C29C',
                  fontSize: '10px',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  minHeight: '32px'
                }}
                title="Toggle Temple Audio"
              >
                {isMuted ? <VolumeX style={{ width: '12px', height: '12px', color: '#7A542B' }} /> : <Volume2 style={{ width: '12px', height: '12px', color: '#E5A83B' }} />}
                <span>{isMuted ? 'Muted' : 'Sanctum Audio'}</span>
              </button>
            </div>
          </div>

          {/* Central Hero Dynamic Storytelling Text */}
          <div
            style={{
              maxWidth: 'min(680px, calc(100% - 16px))',
              margin: '0 auto',
              textAlign: 'center',
              pointerEvents: 'auto',
              transition: 'opacity 0.6s ease'
            }}
          >
            {scrollProgress < 0.25 ? (
              <div
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(10, 8, 6, 0.92) 0%, rgba(10, 8, 6, 0.5) 75%, transparent 100%)',
                  padding: isMobile ? '12px 12px' : '24px 20px',
                  borderRadius: '16px'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: isMobile ? '6px' : '14px' }}>
                  <span
                    style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: isMobile ? '8.5px' : '10px',
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                      color: '#C9A45C',
                      fontWeight: 600
                    }}
                  >
                    Sacred Manuscript & Pilgrimage Guide
                  </span>
                </div>

                <h1
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? 'clamp(2rem, 6.5vw, 2.7rem)' : 'clamp(2.8rem, 6vw, 4.8rem)',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    color: '#F2E7D0',
                    margin: '0 0 4px 0',
                    textShadow: '0 4px 28px rgba(0, 0, 0, 0.95)'
                  }}
                >
                  Thirtha Yatra
                </h1>

                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? '1.1rem' : 'clamp(1.25rem, 2.5vw, 1.6rem)',
                    fontWeight: 500,
                    color: '#D6C29C',
                    margin: isMobile ? '0 0 8px 0' : '0 0 12px 0',
                    lineHeight: 1.3
                  }}
                >
                  Temples & Kshetras
                </p>

                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? '13px' : '18px',
                    color: '#F2E7D0',
                    fontStyle: 'italic',
                    maxWidth: '540px',
                    margin: isMobile ? '0 auto 12px auto' : '0 auto 28px auto',
                    lineHeight: 1.45,
                    opacity: 0.92
                  }}
                >
                  “Open the book. Follow the sacred path. Discover the timeless kshetras within.”
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '8px' : '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                      soundEngine.playPageTurn();
                    }}
                    style={{
                      padding: isMobile ? '8px 16px' : '11px 24px',
                      borderRadius: '6px',
                      border: '1px solid rgba(201, 164, 92, 0.45)',
                      backgroundColor: 'rgba(21, 18, 15, 0.85)',
                      color: '#F2E7D0',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '11px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.25s ease',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                      maxWidth: '100%',
                      textAlign: 'center'
                    }}
                  >
                    Enter The Journey
                  </button>

                  <a
                    href={BOOK_METADATA.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => soundEngine.playTempleBell()}
                    style={{
                      padding: isMobile ? '8px 18px' : '11px 26px',
                      borderRadius: '6px',
                      backgroundColor: '#C9A45C',
                      backgroundImage: 'linear-gradient(180deg, #D4AF37 0%, #B89047 100%)',
                      color: '#0A0806',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      boxShadow: '0 4px 24px rgba(201, 164, 92, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)',
                      transition: 'all 0.25s ease',
                      maxWidth: '100%',
                      textAlign: 'center'
                    }}
                  >
                    Get on Amazon
                  </a>
                </div>
              </div>
            ) : scrollProgress < 0.65 ? (
              <div
                style={{
                  backgroundColor: 'rgba(21, 18, 15, 0.94)',
                  backgroundImage: 'linear-gradient(180deg, rgba(33, 26, 20, 0.96) 0%, rgba(17, 14, 11, 0.98) 100%)',
                  padding: isMobile ? '10px 14px' : '22px 30px',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 164, 92, 0.32)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 24px 54px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(201, 164, 92, 0.15)'
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: '"Cinzel", serif',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 600
                  }}
                >
                  Mandapa Passage • Stage II
                </span>
                <h2
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? '18px' : '28px',
                    fontWeight: 600,
                    color: '#F2E7D0',
                    margin: '0 0 4px 0',
                    lineHeight: 1.2
                  }}
                >
                  The Sacred Pages Open
                </h2>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? '13px' : '18px',
                    color: '#D6C29C',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: 1.35
                  }}
                >
                  Scroll continuously to turn through the northern, himalayan, southern and coastal pilgrimage kshetras.
                </p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(21, 18, 15, 0.94)',
                  backgroundImage: 'linear-gradient(180deg, rgba(33, 26, 20, 0.96) 0%, rgba(17, 14, 11, 0.98) 100%)',
                  padding: isMobile ? '10px 14px' : '22px 30px',
                  borderRadius: '12px',
                  border: '1px solid rgba(201, 164, 92, 0.32)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 24px 54px rgba(0, 0, 0, 0.85), inset 0 1px 0 rgba(201, 164, 92, 0.15)'
                }}
              >
                <span
                  style={{
                    fontSize: '9px',
                    fontFamily: '"Cinzel", serif',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    display: 'block',
                    marginBottom: '4px',
                    fontWeight: 600
                  }}
                >
                  Sanctum Topography • Spread {activeSpread + 1} of 4
                </span>
                <h2
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? '20px' : '28px',
                    fontWeight: 600,
                    color: '#F2E7D0',
                    margin: '0 0 6px 0',
                    lineHeight: 1.2
                  }}
                >
                  Consecrated Mantras & Topography
                </h2>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: isMobile ? '14px' : '18px',
                    color: '#D6C29C',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: 1.4
                  }}
                >
                  Click on the book or scroll down to explore verified temple notes and author insights.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Scroll Indicator (Temple Stone Plaque) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              pointerEvents: 'auto'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 600, color: '#C9A45C' }}>
                0{Math.min(4, Math.floor(scrollProgress * 4) + 1)}
              </span>
              <div
                style={{
                  width: isMobile ? '50px' : '90px',
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
                    width: `${Math.round(scrollProgress * 100)}%`,
                    transition: 'width 0.15s ease'
                  }}
                />
              </div>
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '10px', fontWeight: 500, color: 'rgba(214, 194, 156, 0.45)' }}>
                04
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#D6C29C',
                fontSize: '10px',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                backgroundColor: 'rgba(21, 18, 15, 0.85)',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(201, 164, 92, 0.25)'
              }}
            >
              <span>Mandapa Path</span>
              <ChevronDown style={{ width: '12px', height: '12px', color: '#C9A45C' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
