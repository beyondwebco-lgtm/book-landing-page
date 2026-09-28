import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RealisticBook } from './RealisticBook';
import { TempleEnvironment } from './TempleEnvironment';
import { TempleParticles } from './TempleParticles';
import { createBookCoverTexture, createPageSpreadTexture } from '../../lib/textureGenerator';
import { soundEngine } from '../../lib/soundEngine';
import { Volume2, VolumeX, ChevronDown } from 'lucide-react';
import { BOOK_METADATA } from '../../lib/bookData';

export const BookHeroExperience: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeSpread, setActiveSpread] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate procedural textures once
  const [coverTexture, setCoverTexture] = useState<THREE.Texture | null>(null);
  const [spreadTextures, setSpreadTextures] = useState<Array<{ left: THREE.Texture; right: THREE.Texture }>>([]);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const coverDataUrl = createBookCoverTexture();
    const loadedCover = loader.load(coverDataUrl);
    setCoverTexture(loadedCover);

    const spreads: Array<{ left: THREE.Texture; right: THREE.Texture }> = [];
    for (let i = 0; i < 4; i++) {
      const { left, right } = createPageSpreadTexture(i);
      spreads.push({
        left: loader.load(left),
        right: loader.load(right)
      });
    }
    setSpreadTextures(spreads);
  }, []);

  // Track scroll within the hero pin track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
      if (totalHeight <= 0) return;

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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSpread]);

  const bookOpenProgress = THREE.MathUtils.clamp((scrollProgress - 0.15) / 0.35, 0, 1);
  const cameraZ = THREE.MathUtils.lerp(4.6, 3.4, THREE.MathUtils.clamp(scrollProgress * 1.5, 0, 1));
  const cameraY = THREE.MathUtils.lerp(0.0, 0.4, THREE.MathUtils.clamp((scrollProgress - 0.15) * 2, 0, 1));

  const toggleAudio = () => {
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '280vh', backgroundColor: '#090806' }}>
      {/* STICKY 3D VIEWPORT */}
      <div style={{ position: 'sticky', top: 0, width: '100%', height: '100vh', overflow: 'hidden' }}>
        {/* WebGL Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Canvas
            shadows
            camera={{ position: [0, cameraY, cameraZ], fov: 42 }}
            gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          >
            <color attach="background" args={['#090806']} />
            <fog attach="fog" args={['#090806', 4, 15]} />

            {/* LIGHTING SYSTEM */}
            <ambientLight intensity={0.5} color="#F1E7D0" />
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
            <TempleParticles count={300} />

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

        {/* Subtle Cinematic Radial Glow behind the Book */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 1,
            background: 'radial-gradient(ellipse at 50% 45%, rgba(167, 101, 50, 0.16), transparent 48%)'
          }}
        />

        {/* DOM UI OVERLAYS & NARRATIVE STAGES */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '28px 36px'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(201, 164, 92, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(201, 164, 92, 0.08)'
                }}
              >
                <div style={{ width: '6px', height: '6px', borderRadius: '9999px', backgroundColor: '#C9A45C' }} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '11px',
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
                    fontSize: '10px',
                    letterSpacing: '0.04em',
                    color: 'rgba(205, 191, 159, 0.65)'
                  }}
                >
                  Temples & Kshetras
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Sound Toggle Button */}
              <button
                onClick={toggleAudio}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(201, 164, 92, 0.22)',
                  backgroundColor: 'rgba(14, 12, 10, 0.75)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  color: '#CDBF9F',
                  fontSize: '11px',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                title="Toggle Temple Audio"
              >
                {isMuted ? <VolumeX style={{ width: '13px', height: '13px', color: '#8F6B32' }} /> : <Volume2 style={{ width: '13px', height: '13px', color: '#C9A45C' }} />}
                <span>{isMuted ? 'Muted' : 'Audio On'}</span>
              </button>
            </div>
          </div>

          {/* Central Hero Dynamic Storytelling Text */}
          <div
            style={{
              maxWidth: '680px',
              margin: '0 auto',
              textAlign: 'center',
              pointerEvents: 'auto',
              transition: 'opacity 0.6s ease'
            }}
          >
            {scrollProgress < 0.25 ? (
              <div
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(9, 8, 6, 0.85) 0%, rgba(9, 8, 6, 0.3) 70%, transparent 100%)',
                  padding: '24px 20px',
                  borderRadius: '24px'
                }}
              >
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span
                    style={{
                      fontFamily: '"Cinzel", serif',
                      fontSize: '11px',
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
                    fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
                    fontWeight: 700,
                    lineHeight: 1.05,
                    color: '#F3EBDD',
                    margin: '0 0 8px 0',
                    textShadow: '0 4px 24px rgba(0, 0, 0, 0.9)'
                  }}
                >
                  Thirtha Yatra
                </h1>

                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                    fontWeight: 500,
                    color: '#CDBF9F',
                    margin: '0 0 16px 0',
                    lineHeight: 1.3
                  }}
                >
                  Temples & Kshetras
                </p>

                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '18px',
                    color: '#F3EBDD',
                    fontStyle: 'italic',
                    maxWidth: '540px',
                    margin: '0 auto 28px auto',
                    lineHeight: 1.6,
                    opacity: 0.92
                  }}
                >
                  “Open the book. Follow the sacred path. Discover the timeless kshetras within.”
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                      soundEngine.playPageTurn();
                    }}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 164, 92, 0.45)',
                      backgroundColor: 'rgba(14, 12, 10, 0.7)',
                      color: '#F3EBDD',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                      transition: 'all 0.25s ease'
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
                      padding: '11px 26px',
                      borderRadius: '8px',
                      backgroundColor: '#C9A45C',
                      color: '#090806',
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(201, 164, 92, 0.25)',
                      transition: 'all 0.25s ease'
                    }}
                  >
                    Get on Amazon
                  </a>
                </div>
              </div>
            ) : scrollProgress < 0.65 ? (
              <div
                style={{
                  backgroundColor: 'rgba(14, 12, 10, 0.88)',
                  padding: '22px 30px',
                  borderRadius: '16px',
                  border: '1px solid rgba(201, 164, 92, 0.22)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)'
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: '"Cinzel", serif',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600
                  }}
                >
                  Manuscript Unfolding
                </span>
                <h2
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#F3EBDD',
                    margin: '0 0 8px 0',
                    lineHeight: 1.2
                  }}
                >
                  The Sacred Pages Open
                </h2>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '18px',
                    color: '#CDBF9F',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: 1.5
                  }}
                >
                  Scroll continuously to turn through the northern, himalayan, southern and coastal pilgrimage kshetras.
                </p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(14, 12, 10, 0.9)',
                  padding: '22px 30px',
                  borderRadius: '16px',
                  border: '1px solid rgba(201, 164, 92, 0.25)',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8)'
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: '"Cinzel", serif',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.18em',
                    display: 'block',
                    marginBottom: '6px',
                    fontWeight: 600
                  }}
                >
                  Active Spread {activeSpread + 1} of 4
                </span>
                <h2
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#F3EBDD',
                    margin: '0 0 8px 0',
                    lineHeight: 1.2
                  }}
                >
                  Sanctuary Topography & Mantras
                </h2>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '18px',
                    color: '#CDBF9F',
                    fontStyle: 'italic',
                    margin: 0,
                    lineHeight: 1.5
                  }}
                >
                  Click on the book or scroll down to explore verified temple notes and author insights.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Scroll Indicator */}
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
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', fontWeight: 500, color: '#C9A45C' }}>
                0{Math.min(4, Math.floor(scrollProgress * 4) + 1)}
              </span>
              <div
                style={{
                  width: '90px',
                  height: '2px',
                  backgroundColor: 'rgba(201, 164, 92, 0.2)',
                  borderRadius: '9999px',
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
              <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '11px', fontWeight: 500, color: 'rgba(205, 191, 159, 0.45)' }}>
                04
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#CDBF9F',
                fontSize: '11px',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.08em'
              }}
            >
              <span>Scroll Pilgrimage</span>
              <ChevronDown style={{ width: '13px', height: '13px', color: '#C9A45C' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
