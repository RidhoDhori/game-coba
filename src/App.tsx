import React, { useState } from 'react';
import { Header } from './components/Header';
import { GameCanvas } from './components/GameCanvas';
import { CharacterProfile } from './types';
import { DEFAULT_SLICING_CONFIG, DEFAULT_CHARACTER_SKIN_URL } from './utils/pixelSpriteGenerator';

export default function App() {
  const [profile, setProfile] = useState<CharacterProfile>({
    name: 'Aria (Adventurer Tunic)',
    gender: 'Female',
    skinColor: 'Female Skin1',
    customSkinUrl: DEFAULT_CHARACTER_SKIN_URL,
    clothingTop: 'Corset',
    clothingBottom: 'Skirt',
    footwear: 'Boots',
    hair: 'Female Hair1',
    weapon: 'Female Sword',
    clothing: 'adventurer_tunic',
    hand: 'Female Sword',
    scale: 1.8,
    slicingConfig: DEFAULT_SLICING_CONFIG,
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-950 text-stone-100 font-sans selection:bg-amber-600 selection:text-white">
      {/* Main Top Header with GandalfHardcore modular outfits */}
      <Header profile={profile} setProfile={setProfile} />

      {/* Main Game Stage Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col">
        <GameCanvas
          profile={profile}
          setProfile={setProfile}
        />
      </main>

      {/* Global Footer */}
      <footer className="border-t border-stone-800/80 bg-stone-900/60 py-4 px-4 text-xs text-stone-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div>
            <span className="font-semibold text-stone-400">Cozy Medieval Village</span> • Petualangan santai di dunia pixel art yang damai.
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>Mode Cozy: <span className="text-emerald-400 font-semibold">Aktif</span></span>
            <span>•</span>
            <span>Multi-Layer Background: <span className="text-stone-300">Aktif</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
