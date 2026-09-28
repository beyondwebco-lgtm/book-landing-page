import React, { useState } from 'react';
import { TEMPLE_MAP_SPOTS, type TempleSpot } from '../../lib/bookData';
import { soundEngine } from '../../lib/soundEngine';
import { MapPin, Compass, BookOpen, Sparkles, ChevronRight } from 'lucide-react';

export const TempleMapSection: React.FC<{ onExplorePage?: (page: number) => void }> = ({ onExplorePage }) => {
  const [selectedSpot, setSelectedSpot] = useState<TempleSpot>(TEMPLE_MAP_SPOTS[0]);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filters = ['All', 'South Indian', 'Jyotirlinga', 'Chardham', 'Divya Desam', 'Ganga Ghats'];

  const filteredSpots = TEMPLE_MAP_SPOTS.filter((spot) => {
    if (activeFilter === 'All') return true;
    return spot.tags.includes(activeFilter);
  });

  return (
    <section id="temples-section" className="relative py-28 px-4 sm:px-8 max-w-7xl mx-auto text-warm-ivory">
      {/* Background Sacred Yantra watermark */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5">
        <div className="w-[800px] h-[800px] rounded-full border border-antique-gold border-dashed animate-spin-slow" />
      </div>

      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-antique-gold/30 bg-antique-gold/5 text-antique-gold text-xs uppercase tracking-widest mb-4">
          <Compass className="w-3.5 h-3.5" />
          <span>Interactive Pilgrimage Topography</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-5xl font-bold tracking-wide text-warm-ivory mb-4">
          Sacred Temples & Kshetras
        </h2>
        <p className="font-garamond text-lg sm:text-xl text-old-paper/80 leading-relaxed italic">
          “Each kshetra documented in the guide is not merely a destination, but a consecrated portal of inner transformation.”
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => {
              setActiveFilter(filter);
              soundEngine.playFlameWarmth();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-cinzel tracking-wider transition-all duration-300 ${
              activeFilter === filter
                ? 'bg-antique-gold text-deep-obsidian font-bold shadow-lg shadow-antique-gold/20'
                : 'bg-temple-black/70 border border-antique-gold/20 text-old-paper/70 hover:border-antique-gold/50 hover:text-warm-ivory'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Main Interactive Map & Details Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Spatial Pilgrimage Grid & Sacred Route Node Matrix */}
        <div className="lg:col-span-7 bg-temple-black/80 border border-antique-gold/25 rounded-2xl p-6 sm:p-8 relative backdrop-blur-md overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-antique-gold/15">
            <span className="text-xs uppercase tracking-widest text-antique-gold font-cinzel flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Verified Pilgrimage Nodes ({filteredSpots.length})
            </span>
            <span className="text-xs text-old-paper/50 font-sans">
              Select node to inspect guide notes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredSpots.map((spot) => {
              const isSelected = selectedSpot.id === spot.id;
              return (
                <div
                  key={spot.id}
                  onClick={() => {
                    setSelectedSpot(spot);
                    soundEngine.playFlameWarmth();
                  }}
                  className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-br from-antique-gold/20 via-temple-black to-deep-obsidian border-antique-gold shadow-lg shadow-antique-gold/15 translate-y-[-2px]'
                      : 'bg-deep-obsidian/60 border-antique-gold/15 hover:border-antique-gold/40 hover:bg-temple-black/60'
                  }`}
                >
                  {/* Small temple thumbnail photo */}
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3 border border-antique-gold/20 relative">
                    <img
                      src={spot.imageUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    {spot.pageNumber && (
                      <span className="absolute top-2 right-2 text-[10px] font-cinzel text-antique-gold bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-antique-gold/30">
                        p. {spot.pageNumber}
                      </span>
                    )}
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-antique-gold animate-ping' : 'bg-antique-gold/40'}`} />
                      <h4 className="font-cinzel text-base font-semibold text-warm-ivory group-hover:text-antique-gold transition-colors">
                        {spot.name}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-old-paper/60 font-garamond italic mt-1">
                    {spot.sanskritName} • {spot.region}
                  </p>

                  <p className="text-xs text-old-paper/75 font-sans mt-2 line-clamp-2">
                    {spot.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-antique-gold/10">
                    <span className="text-[10px] uppercase tracking-wider text-antique-gold/90 font-cinzel">
                      {spot.deity}
                    </span>
                    <span className="text-xs text-antique-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Inspect <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 5 Columns: Selected Kshetra Editorial Dossier with Grand Photo */}
        <div className="lg:col-span-5 bg-gradient-to-b from-temple-black to-deep-obsidian border border-antique-gold/30 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          
          {/* Main Selected Temple Hero Photo */}
          <div className="w-full h-56 rounded-xl overflow-hidden mb-6 border border-antique-gold/30 relative shadow-lg">
            <img
              src={selectedSpot.imageUrl}
              alt={selectedSpot.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-antique-gold tracking-widest font-cinzel uppercase">
                <MapPin className="w-3.5 h-3.5" />
                <span>{selectedSpot.region}</span>
              </span>
              <h3 className="font-cinzel text-2xl font-bold text-warm-ivory">
                {selectedSpot.name}
              </h3>
            </div>
          </div>

          <p className="font-garamond text-base text-antique-gold/90 italic mb-4">
            {selectedSpot.sanskritName}
          </p>

          {selectedSpot.verseSnippet && (
            <div className="p-3.5 rounded-lg bg-antique-gold/10 border-l-2 border-antique-gold mb-5">
              <p className="font-garamond text-base text-warm-ivory italic text-center">
                “{selectedSpot.verseSnippet}”
              </p>
            </div>
          )}

          <div className="space-y-3.5 mb-6 text-sm sm:text-base font-garamond text-old-paper/90 leading-relaxed">
            <div>
              <span className="font-cinzel text-xs text-antique-gold uppercase tracking-wider block mb-0.5">
                Spiritual Essence:
              </span>
              <p>{selectedSpot.significance}</p>
            </div>

            <div>
              <span className="font-cinzel text-xs text-antique-gold uppercase tracking-wider block mb-0.5">
                Presiding Sanctum Deity:
              </span>
              <p className="font-cinzel text-warm-ivory">{selectedSpot.deity}</p>
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
              className="flex-1 py-3 px-4 rounded-xl bg-antique-gold hover:bg-[#D4AF37] text-deep-obsidian font-cinzel text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-[1.02] shadow-lg shadow-antique-gold/20"
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
