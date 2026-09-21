import React, { useState } from 'react';
import { Sparkles, Heart, Shirt, SlidersHorizontal } from 'lucide-react';
import { CharacterProfile } from '../types';
import { GANDALF_CHARACTER_PRESETS, GandalfPreset } from '../utils/pixelSpriteGenerator';
import { CharacterStudioModal } from './CharacterStudioModal';

interface HeaderProps {
  profile: CharacterProfile;
  setProfile?: React.Dispatch<React.SetStateAction<CharacterProfile>>;
}

export const Header: React.FC<HeaderProps> = ({ profile, setProfile }) => {
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const handleSelectPreset = (preset: GandalfPreset) => {
    if (!setProfile) return;
    setProfile((prev) => ({
      ...prev,
      name: preset.name,
      gender: preset.gender,
      skinColor: preset.skinColor,
      clothingTop: preset.clothingTop,
      clothingBottom: preset.clothingBottom,
      footwear: preset.footwear,
      hair: preset.hair,
      weapon: preset.weapon,
      clothing: preset.clothing,
      hand: preset.weapon,
    }));
  };

  return (
    <>
      <header id="main-header" className="bg-stone-900/95 border-b border-stone-800 backdrop-blur sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Title & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-amber-700 flex items-center justify-center shadow-md shadow-amber-950/40 border border-amber-500/30">
              <Heart className="w-5 h-5 text-amber-100 fill-amber-300/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-wide text-stone-100 font-serif">
                  Cozy Medieval Village
                </h1>
                <span className="text-[11px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
                  GandalfHardcore Pack
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Karakter & platform dari GandalfHardcore FREE Character & Platformer Asset Packs.
              </p>
            </div>
          </div>

          {/* Character Outfits & Studio Launcher */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Customizer Studio Button */}
            {setProfile && (
              <button
                id="btn-open-character-studio"
                onClick={() => setIsStudioOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-md shadow-amber-950/40 border border-amber-400/30 transition-all mr-1"
                title="Buka Wardrobe & Customizer Karakter Modular"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Karakter Studio</span>
              </button>
            )}

            <div className="h-4 w-px bg-stone-700 hidden sm:block mx-1" />

            {/* Quick Presets */}
            <span className="text-xs text-stone-400 font-medium mr-1 hidden lg:inline">Preset:</span>
            {GANDALF_CHARACTER_PRESETS.slice(0, 5).map((p) => {
              const isSelected = profile.clothing === p.clothing;
              return (
                <button
                  key={p.id}
                  id={`btn-preset-${p.id}`}
                  onClick={() => handleSelectPreset(p)}
                  title={p.description}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white font-semibold shadow-md ring-1 ring-amber-400/50'
                      : 'bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800'
                  }`}
                >
                  <Sparkles className={`w-3 h-3 ${isSelected ? 'text-amber-200' : 'text-stone-500'}`} />
                  <span>{p.name.split(' (')[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Modular Character Studio Modal */}
      {setProfile && (
        <CharacterStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          profile={profile}
          setProfile={setProfile}
        />
      )}
    </>
  );
};
