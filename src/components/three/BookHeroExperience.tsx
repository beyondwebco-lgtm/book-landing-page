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
            padding: '32px 48px'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(201, 164, 92, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(201, 164, 92, 0.1)'
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#C9A45C' }} />
              </div>
              <div>
                <span
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '12px',
                    letterSpacing: '0.25em',
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
                    fontSize: '10px',
                    letterSpacing: '0.1em',
                    color: 'rgba(216, 199, 165, 0.6)',
                    textTransform: 'uppercase'
                  }}
                >
                  Guide to Temples & Kshetras
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Sound Toggle Button */}
              <button
                onClick={toggleAudio}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(201, 164, 92, 0.3)',
                  backgroundColor: 'rgba(17, 16, 13, 0.7)',
                  backdropFilter: 'blur(8px)',
                  color: '#C9A45C',
                  fontSize: '11px',
                  fontFamily: '"Cinzel", serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
                title="Toggle Temple Audio"
              >
                {isMuted ? <VolumeX style={{ width: '14px', height: '14px' }} /> : <Volume2 style={{ width: '14px', height: '14px', color: '#C9A45C' }} />}
                <span>{isMuted ? 'Mute' : 'Temple Audio'}</span>
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
              <div>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '14px',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    color: 'rgba(201, 164, 92, 0.9)',
                    marginBottom: '12px'
                  }}
                >
                  Sacred Manuscript & Pilgrimage Guide
                </p>
                <h1
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#F1E7D0',
                    margin: '0 0 16px 0',
                    textShadow: '0 4px 20px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  THIRTHA YATRA
                </h1>
                <p
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '18px',
                    color: '#C9A45C',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    marginBottom: '20px'
                  }}
                >
                  Temples & Kshetras
                </p>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '20px',
                    color: 'rgba(216, 199, 165, 0.85)',
                    fontStyle: 'italic',
                    maxWidth: '520px',
                    margin: '0 auto 32px auto',
                    lineHeight: 1.5
                  }}
                >
                  “Open the book. Follow the sacred path. Discover the timeless kshetras within.”
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
                  <button
                    onClick={() => {
                      window.scrollTo({ top: window.innerHeight * 0.8, behavior: 'smooth' });
                      soundEngine.playPageTurn();
                    }}
                    style={{
                      padding: '12px 28px',
                      borderRadius: '9999px',
                      border: '1px solid rgba(201, 164, 92, 0.6)',
                      backgroundColor: 'rgba(201, 164, 92, 0.12)',
                      color: '#C9A45C',
                      fontFamily: '"Cinzel", serif',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      cursor: 'pointer',
                      backdropFilter: 'blur(6px)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Enter The Journey
                  </button>
                  <a
                    href={BOOK_METADATA.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '12px 28px',
                      borderRadius: '9999px',
                      backgroundColor: '#C9A45C',
                      color: '#090806',
                      fontFamily: '"Cinzel", serif',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      textDecoration: 'none',
                      boxShadow: '0 4px 20px rgba(201, 164, 92, 0.25)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get on Amazon
                  </a>
                </div>
              </div>
            ) : scrollProgress < 0.65 ? (
              <div
                style={{
                  backgroundColor: 'rgba(17, 16, 13, 0.8)',
                  padding: '24px 32px',
                  borderRadius: '16px',
                  border: '1px solid rgba(201, 164, 92, 0.25)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: '"Cinzel", serif',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  Manuscript Unfolding
                </span>
                <h2
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#F1E7D0',
                    margin: '0 0 10px 0'
                  }}
                >
                  The Sacred Pages Open
                </h2>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '18px',
                    color: 'rgba(216, 199, 165, 0.9)',
                    fontStyle: 'italic',
                    margin: 0
                  }}
                >
                  Scroll continuously to turn through the northern, himalayan, southern and coastal pilgrimage kshetras.
                </p>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: 'rgba(17, 16, 13, 0.85)',
                  padding: '24px 32px',
                  borderRadius: '16px',
                  border: '1px solid rgba(201, 164, 92, 0.35)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7)'
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: '"Cinzel", serif',
                    color: '#C9A45C',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    display: 'block',
                    marginBottom: '6px'
                  }}
                >
                  Active Spread {activeSpread + 1} of 4
                </span>
                <h2
                  style={{
                    fontFamily: '"Cinzel", serif',
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: '#F1E7D0',
                    margin: '0 0 10px 0'
                  }}
                >
                  Sanctuary Topography & Mantras
                </h2>
                <p
                  style={{
                    fontFamily: '"Cormorant Garamond", Georgia, serif',
                    fontSize: '18px',
                    color: 'rgba(216, 199, 165, 0.9)',
                    fontStyle: 'italic',
                    margin: 0
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
              <span style={{ fontFamily: '"Cinzel", serif', fontSize: '12px', color: '#C9A45C' }}>
                0{Math.min(4, Math.floor(scrollProgress * 4) + 1)}
              </span>
              <div
                style={{
                  width: '100px',
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
              <span style={{ fontFamily: '"Cinzel", serif', fontSize: '12px', color: 'rgba(216, 199, 165, 0.4)' }}>
                04
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: 'rgba(201, 164, 92, 0.8)',
                fontSize: '11px',
                fontFamily: '"Cinzel", serif',
                textTransform: 'uppercase',
                letterSpacing: '0.15em'
              }}
            >
              <span>Scroll Pilgrimage</span>
              <ChevronDown style={{ width: '14px', height: '14px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
