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
          backgroundColor: 'rgba(17, 16, 13, 0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(201, 164, 92, 0.35)',
          borderRadius: '9999px',
          padding: '8px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)'
        }}
      >
        <a
          href="#book-hero"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Cinzel", serif',
            color: '#C9A45C',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BookOpen style={{ width: '13px', height: '13px' }} />
          <span>Sanctum</span>
        </a>

        <a
          href="#book-viewer-section"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Cinzel", serif',
            color: '#D8C7A5',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <BookOpen style={{ width: '13px', height: '13px' }} />
          <span>Manuscript</span>
        </a>

        <a
          href="#temples-section"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Cinzel", serif',
            color: '#D8C7A5',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Compass style={{ width: '13px', height: '13px' }} />
          <span>Kshetras</span>
        </a>

        <a
          href="#author-section"
          onClick={() => soundEngine.playFlameWarmth()}
          style={{
            fontSize: '11px',
            fontFamily: '"Cinzel", serif',
            color: '#D8C7A5',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Feather style={{ width: '13px', height: '13px' }} />
          <span>Author</span>
        </a>

        <a
          href={BOOK_METADATA.amazonUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => soundEngine.playTempleBell()}
          style={{
            padding: '6px 16px',
            borderRadius: '9999px',
            backgroundColor: '#C9A45C',
            color: '#090806',
            fontSize: '11px',
            fontFamily: '"Cinzel", serif',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 10px rgba(201, 164, 92, 0.3)'
          }}
        >
          <ShoppingBag style={{ width: '13px', height: '13px' }} />
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
