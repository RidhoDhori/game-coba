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
    <div className="min-h-screen flex flex-col bg-black text-stone-100 font-sans selection:bg-amber-600 selection:text-white">
      {/* Main Game Stage Area - Full Screen Game Only */}
      <main className="flex-1 w-full h-screen overflow-hidden">
        <GameCanvas
          profile={profile}
          setProfile={setProfile}
        />
      </main>
    </div>
  );
}
