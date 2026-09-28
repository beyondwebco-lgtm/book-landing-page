import { useState } from 'react';
import { BookHeroExperience } from './components/three/BookHeroExperience';
import { TempleMapSection } from './components/sections/TempleMapSection';
import { BookSpreadViewer } from './components/sections/BookSpreadViewer';
import { AuthorSection } from './components/sections/AuthorSection';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/ui/Footer';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { BOOK_METADATA } from './lib/bookData';
import { soundEngine } from './lib/soundEngine';
import { Compass, BookOpen, Feather, ShoppingBag } from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-deep-obsidian text-warm-ivory selection:bg-antique-gold selection:text-deep-obsidian">
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* FLOATING SANCTUARY NAVIGATION */}
      <nav
        style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          backgroundColor: 'rgba(14, 12, 10, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(201, 164, 92, 0.22)',
          borderRadius: '9999px',
          padding: '6px 10px 6px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.03)'
        }}
      >
        <a
          href="#book-hero"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            color: '#C9A45C',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease'
          }}
        >
          <BookOpen style={{ width: '13px', height: '13px', opacity: 0.9 }} />
          <span>Sanctum</span>
        </a>

        <a
          href="#book-viewer-section"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            color: '#CDBF9F',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease'
          }}
        >
          <BookOpen style={{ width: '13px', height: '13px', opacity: 0.8 }} />
          <span>Manuscript</span>
        </a>

        <a
          href="#temples-section"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            color: '#CDBF9F',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease'
          }}
        >
          <Compass style={{ width: '13px', height: '13px', opacity: 0.8 }} />
          <span>Kshetras</span>
        </a>

        <a
          href="#author-section"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 500,
            color: '#CDBF9F',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease'
          }}
        >
          <Feather style={{ width: '13px', height: '13px', opacity: 0.8 }} />
          <span>Author</span>
        </a>

        <a
          href={BOOK_METADATA.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEngine.playTempleBell()}
          style={{
            padding: '6px 14px',
            borderRadius: '9999px',
            backgroundColor: '#C9A45C',
            color: '#090806',
            fontSize: '11px',
            fontFamily: '"Inter", sans-serif',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 12px rgba(201, 164, 92, 0.25)',
            transition: 'background-color 0.2s ease, transform 0.15s ease'
          }}
        >
          <ShoppingBag style={{ width: '12px', height: '12px' }} />
          <span>Buy</span>
        </a>
      </nav>

      {/* 1. MASTER 3D BOOK & TEMPLE SCROLL TIMELINE */}
      <section id="book-hero">
        <BookHeroExperience />
      </section>

      {/* 2. SACRED EDITORIAL MANUSCRIPT SPREAD VIEWER */}
      <BookSpreadViewer />

      {/* 3. VERIFIED PILGRIMAGE TOPOGRAPHY & INTERACTIVE MAP */}
      <TempleMapSection />

      {/* 4. AUTHOR SECTION */}
      <AuthorSection />

      {/* 5. DRAMATIC FINAL CTA WITH DIRECT AMAZON LINK */}
      <FinalCTA />

      {/* 6. MINIMAL FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
