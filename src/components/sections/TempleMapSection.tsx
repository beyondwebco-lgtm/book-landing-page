import React, { useState, useRef } from 'react';
import { TEMPLE_MAP_SPOTS, type TempleSpot } from '../../lib/bookData';
import { soundEngine } from '../../lib/soundEngine';
import { MapPin, Compass, BookOpen, Sparkles, ChevronRight, ArrowUp } from 'lucide-react';

export const TempleMapSection: React.FC<{ onExplorePage?: (page: number) => void }> = ({ onExplorePage }) => {
  const [selectedSpot, setSelectedSpot] = useState<TempleSpot>(TEMPLE_MAP_SPOTS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const dossierRef = useRef<HTMLDivElement>(null);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const filters = ['All', 'South Indian', 'Jyotirlinga', 'Chardham', 'Divya Desam', 'Ganga Ghats'];

  const filteredSpots = TEMPLE_MAP_SPOTS.filter((spot) => {
    if (activeFilter === 'All') return true;
    return spot.tags.includes(activeFilter);
  });

  const handleSpotSelect = (spot: TempleSpot) => {
    setSelectedSpot(spot);
    soundEngine.playFlameWarmth();
    if (window.innerWidth < 1024 && dossierRef.current) {
      setTimeout(() => {
        dossierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  };

  return (
    <section id="temples-section" className="relative py-10 sm:py-28 px-4 sm:px-8 max-w-7xl mx-auto text-warm-ivory overflow-hidden">
      {/* Background Sacred Dravidian Mandapa Geometry */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.035] overflow-hidden max-w-full">
        <div className="w-[740px] h-[740px] border border-antique-gold" style={{ transform: 'rotate(45deg)' }} />
        <div className="absolute w-[680px] h-[680px] rounded-full border border-antique-gold border-dashed" />
      </div>

      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-md border border-antique-gold/30 bg-[#211A14]/80 text-antique-gold text-[10px] uppercase font-cinzel tracking-[0.14em] sm:tracking-[0.2em] font-semibold mb-2.5 sm:mb-4 shadow-md max-w-full">
          <Compass className="w-3 h-3 text-antique-gold shrink-0" />
          <span className="truncate">Sacred Kshetra Topography • Mandapa IV</span>
        </div>
        <h2 className="font-garamond text-3xl sm:text-5xl font-semibold tracking-tight text-warm-ivory mb-2 sm:mb-3 leading-tight">
          Sacred Temples & Kshetras
        </h2>
        <p className="font-garamond text-base sm:text-xl text-aged-parchment italic leading-relaxed">
          “Each kshetra documented in the guide is not merely a destination, but a consecrated portal of inner transformation.”
        </p>
      </div>

      {/* Filter Tabs (Dark Stone & Bronze Chips - Swipeable on mobile) */}
      <div className="flex overflow-x-auto no-scrollbar sm:flex-wrap sm:justify-center gap-2 mb-5 sm:mb-12 pb-2 px-1 max-w-full">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              soundEngine.playFlameWarmth();
            }}
            className={`px-3 sm:px-3.5 py-1.5 rounded-md text-xs font-sans font-medium tracking-wide transition-all duration-200 whitespace-nowrap shrink-0 min-h-[36px] ${
              activeFilter === filter
                ? 'bg-[#C9A45C] text-[#0A0806] font-semibold shadow-md shadow-antique-gold/20'
                : 'bg-[#15120F] border border-antique-gold/20 text-[#D6C29C] hover:border-antique-gold/45 hover:text-[#F2E7D0]'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Interactive Map & Details Split Layout */}
      <div ref={gridTopRef} className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Left 7 Columns: Spatial Pilgrimage Grid (Ancient Dark Stone Mandapa Matrix) */}
        <div className="lg:col-span-7 bg-[#15120F] border border-antique-gold/25 rounded-xl p-4 sm:p-7 relative backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-antique-gold/15">
            <span className="text-[11px] uppercase tracking-[0.16em] text-antique-gold font-cinzel font-semibold flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Pilgrimage Nodes ({filteredSpots.length})
            </span>
            <span className="text-xs text-aged-parchment/60 font-sans">
              Select node to inspect guide notes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => handleSpotSelect(spot)}
                  className={`group relative p-3 sm:p-3.5 rounded-lg border transition-all duration-200 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#2B1F16] via-[#1A1410] to-[#110E0B] border-antique-gold shadow-lg shadow-antique-gold/15 translate-y-[-2px]'
                      : 'bg-[#0E0C0A] border-antique-gold/15 hover:border-antique-gold/35 hover:bg-[#1A1410]'
                  }`}
                >
                  {/* Temple thumbnail photo */}
                  <div className="w-full h-28 sm:h-32 rounded-md overflow-hidden mb-2.5 sm:mb-3 border border-antique-gold/20 relative">
                    <img
                      src={spot.thumbUrl || spot.imageUrl}
                      alt={spot.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                    {spot.pageNumber && (
                      <span className="absolute top-2 right-2 text-[10px] font-sans font-medium text-antique-gold bg-[#0A0806]/90 backdrop-blur-sm px-2 py-0.5 rounded border border-antique-gold/25">
                        p. {spot.pageNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-antique-gold shadow-[0_0_8px_#E5A83B]' : 'bg-antique-gold/35'}`} />
                      <h4 className="font-garamond text-lg font-semibold text-warm-ivory group-hover:text-antique-gold transition-colors">
                        {spot.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-aged-parchment/70 font-garamond italic mt-0.5">
                    {spot.sanskritName} • {spot.region}
                  </p>

                  <p className="text-xs text-aged-parchment/85 font-sans mt-2 line-clamp-2 leading-relaxed">
                    {spot.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-antique-gold/10">
                    <span className="text-[10px] uppercase tracking-wider text-antique-gold font-cinzel">
                      {spot.deity}
                    </span>
                    <span className="text-xs text-aged-parchment/75 font-sans group-hover:text-antique-gold flex items-center gap-1 group-hover:translate-x-0.5 transition-all">
                      Inspect <ChevronRight className="w-3 h-3 text-antique-gold" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Selected Kshetra Editorial Dossier with Grand Photo */}
        <div ref={dossierRef} className="lg:col-span-5 bg-gradient-to-b from-[#1E1712] via-[#15120F] to-[#0D0B09] border border-antique-gold/30 rounded-xl p-4 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden">
          
          {/* Mobile Back Button to top of grid */}
          <button
            onClick={() => {
              gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            className="lg:hidden w-full mb-3.5 py-2 px-3 rounded-md bg-[#211A14] border border-antique-gold/25 text-antique-gold text-xs font-sans font-medium flex items-center justify-center gap-1.5"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>Back to Kshetra Grid</span>
          </button>
          
          {/* Main Selected Temple Hero Photo */}
          <div className="w-full h-44 sm:h-56 rounded-lg overflow-hidden mb-4 sm:mb-6 border border-antique-gold/30 relative shadow-lg">
            <img
              src={selectedSpot.imageUrl}
              alt={selectedSpot.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0806] via-black/30 to-transparent" />
            <div className="absolute bottom-3 left-3 sm:left-4">
              <span className="inline-flex items-center gap-1.5 text-[10px] text-antique-gold tracking-[0.16em] font-cinzel uppercase font-semibold">
                <MapPin className="w-3 h-3" />
                <span>{selectedSpot.region}</span>
              </span>
              <h3 className="font-garamond text-xl sm:text-3xl font-bold text-warm-ivory">
                {selectedSpot.name}
              </h3>
            </div>
          </div>

          <p className="font-garamond text-sm sm:text-base text-antique-gold italic mb-2.5 sm:mb-4">
            {selectedSpot.sanskritName}
          </p>

          {selectedSpot.verseSnippet && (
            <div className="p-3 sm:p-3.5 rounded-md bg-[#211A14] border-l-2 border-antique-gold mb-3.5 sm:mb-5 shadow-inner">
              <p className="font-garamond text-sm sm:text-base text-warm-ivory italic text-center">
                “{selectedSpot.verseSnippet}”
              </p>
            </div>
          )}

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-sm sm:text-base font-garamond text-aged-parchment leading-relaxed">
            <div>
              <span className="font-cinzel text-[10px] text-antique-gold uppercase tracking-[0.18em] block mb-1 font-semibold">
                Spiritual Essence
              </span>
              <p className="text-warm-ivory/95">{selectedSpot.significance}</p>
            </div>

            <div>
              <span className="font-cinzel text-[10px] text-antique-gold uppercase tracking-[0.18em] block mb-1 font-semibold">
                Presiding Sanctum Deity
              </span>
              <p className="font-garamond text-lg font-semibold text-warm-ivory">{selectedSpot.deity}</p>
            </div>
          </div>

          {/* Action to Explore within the 3D Book */}
          <div className="pt-4 border-t border-antique-gold/20 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                soundEngine.playPageTurn();
                if (selectedSpot.pageNumber && onExplorePage) {
                  onExplorePage(selectedSpot.pageNumber);
                }
                const bookElem = document.getElementById('book-viewer-section');
                if (bookElem) {
                  bookElem.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="flex-1 py-3 px-4 rounded-md bg-antique-gold hover:bg-[#D4AF37] text-[#0A0806] font-sans text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform duration-200 hover:scale-[1.01] shadow-lg shadow-antique-gold/15"
            >
              <BookOpen className="w-4 h-4" />
              <span>Read in 3D Book (p. {selectedSpot.pageNumber})</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
