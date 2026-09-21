import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, User, Palette, Shirt, Scissors, Shield, RefreshCw } from 'lucide-react';
import { CharacterProfile } from '../types';
import {
  GANDALF_CHARACTER_PRESETS,
  GandalfPreset,
  AVAILABLE_SKINS_FEMALE,
  AVAILABLE_SKINS_MALE,
  AVAILABLE_FEMALE_TOPS,
  AVAILABLE_FEMALE_BOTTOMS,
  AVAILABLE_FEMALE_SHOES,
  AVAILABLE_FEMALE_HAIR,
  AVAILABLE_MALE_TOPS,
  AVAILABLE_MALE_BOTTOMS,
  AVAILABLE_MALE_SHOES,
  AVAILABLE_MALE_HAIR,
  renderSlicedCharacterFrame,
  DEFAULT_SLICING_CONFIG,
} from '../utils/pixelSpriteGenerator';

interface CharacterStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CharacterProfile;
  setProfile: React.Dispatch<React.SetStateAction<CharacterProfile>>;
}

export const CharacterStudioModal: React.FC<CharacterStudioModalProps> = ({
  isOpen,
  onClose,
  profile,
  setProfile,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [previewAction, setPreviewAction] = useState<'idle' | 'walk' | 'run' | 'attack'>('idle');
  const [previewFrame, setPreviewFrame] = useState(0);

  // Animation ticker for preview canvas
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setPreviewFrame((f) => (f + 1) % 12);
    }, 130);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Render character frame in the preview canvas
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle checkered background for pixel art transparency contrast
    const cellSize = 16;
    for (let x = 0; x < canvas.width; x += cellSize) {
      for (let y = 0; y < canvas.height; y += cellSize) {
        ctx.fillStyle = (x / cellSize + y / cellSize) % 2 === 0 ? '#1c1917' : '#292524';
        ctx.fillRect(x, y, cellSize, cellSize);
      }
    }

    // Draw shadow under character
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height - 24, 38, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Render character frame using 80x64 sprite slice scaled 2.6x
    const targetW = 80 * 2.6;
    const targetH = 64 * 2.6;
    const dx = (canvas.width - targetW) / 2;
    const dy = canvas.height - targetH - 12;

    renderSlicedCharacterFrame(
      ctx,
      profile,
      previewAction,
      previewFrame,
      dx,
      dy,
      targetW,
      targetH,
      true
    );
  }, [isOpen, profile, previewAction, previewFrame]);

  if (!isOpen) return null;

  const isFemale = (profile.gender || 'Female') === 'Female';

  const handleGenderSwitch = (gender: 'Female' | 'Male') => {
    if (gender === 'Female') {
      setProfile((prev) => ({
        ...prev,
        gender: 'Female',
        skinColor: 'Female Skin1',
        clothingTop: 'Corset',
        clothingBottom: 'Skirt',
        footwear: 'Boots',
        hair: 'Female Hair1',
        weapon: 'Female Sword',
        clothing: 'adventurer_tunic',
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        gender: 'Male',
        skinColor: 'Male Skin1',
        clothingTop: 'Shirt',
        clothingBottom: 'Pants',
        footwear: 'Boots',
        hair: 'Male Hair1',
        weapon: 'Male Sword',
        clothing: 'warrior_shirt',
      }));
    }
  };

  const handleApplyPreset = (preset: GandalfPreset) => {
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
    }));
  };

  return (
    <div
      id="modal-character-studio"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Shirt className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
                Karakter Studio (GandalfHardcore Modular)
              </h2>
              <p className="text-xs text-stone-400">
                Pilih kombinasi warna kulit, busana, rambut, dan senjata otentik dari GandalfHardcore Character Asset Pack.
              </p>
            </div>
          </div>
          <button
            id="btn-close-studio"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Preview & Presets */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Live Canvas Viewport */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-300">Live Animasi Preview</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  80x64 Pixel Frame
                </span>
              </div>

              <canvas
                ref={canvasRef}
                width={250}
                height={200}
                className="w-full max-w-[250px] h-[200px] rounded-lg border border-stone-800 shadow-inner"
              />

              {/* Action State Switcher */}
              <div className="flex items-center justify-center gap-1.5 mt-3 w-full">
                {(['idle', 'walk', 'run', 'attack'] as const).map((act) => (
                  <button
                    key={act}
                    id={`btn-preview-${act}`}
                    onClick={() => setPreviewAction(act)}
                    className={`flex-1 py-1 text-xs font-medium rounded capitalize transition-all ${
                      previewAction === act
                        ? 'bg-amber-600 text-white font-semibold'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
              <span className="text-xs font-semibold text-stone-300 mb-2 block">Koleksi Preset Pilihan:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {GANDALF_CHARACTER_PRESETS.map((p) => {
                  const isCur = profile.clothing === p.clothing;
                  return (
                    <button
                      key={p.id}
                      id={`btn-preset-modal-${p.id}`}
                      onClick={() => handleApplyPreset(p)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                        isCur
                          ? 'bg-amber-600/20 text-amber-300 border border-amber-500/50 font-medium'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <div>
                          <div className="font-semibold">{p.name}</div>
                          <div className="text-[10px] text-stone-400">{p.description}</div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
                        {p.gender}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Customizer Controls */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* 1. Gender Selection */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
              <label className="text-xs font-semibold text-stone-300 mb-2.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                1. Pilih Gender Karakter
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="btn-gender-female"
                  onClick={() => handleGenderSwitch('Female')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                    isFemale
                      ? 'bg-amber-600 text-white border-amber-400 font-semibold shadow-md'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
                  }`}
                >
                  <span>Wanita (Female)</span>
                </button>
                <button
                  id="btn-gender-male"
                  onClick={() => handleGenderSwitch('Male')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-all ${
                    !isFemale
                      ? 'bg-amber-600 text-white border-amber-400 font-semibold shadow-md'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:bg-stone-800'
                  }`}
                >
                  <span>Pria (Male)</span>
                </button>
              </div>
            </div>

            {/* 2. Skin Color */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
              <label className="text-xs font-semibold text-stone-300 mb-2.5 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                2. Warna Kulit (Skin Colors)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(isFemale ? AVAILABLE_SKINS_FEMALE : AVAILABLE_SKINS_MALE).map((sk, idx) => {
                  const isSel = profile.skinColor === sk;
                  return (
                    <button
                      key={sk}
                      id={`btn-skin-${sk}`}
                      onClick={() => setProfile((p) => ({ ...p, skinColor: sk }))}
                      className={`py-1.5 px-2 rounded-lg text-xs text-center border transition-all ${
                        isSel
                          ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <span>Tone {idx + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Top Clothing */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
              <label className="text-xs font-semibold text-stone-300 mb-2.5 flex items-center gap-1.5">
                <Shirt className="w-3.5 h-3.5 text-amber-400" />
                3. Busana Atasan (Tops & Corsets)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(isFemale ? AVAILABLE_FEMALE_TOPS : AVAILABLE_MALE_TOPS).map((top) => {
                  const isSel = (profile.clothingTop || (isFemale ? 'Corset' : 'Shirt')) === top.id;
                  return (
                    <button
                      key={top.id}
                      id={`btn-top-${top.id}`}
                      onClick={() => setProfile((p) => ({ ...p, clothingTop: top.id }))}
                      className={`p-2 rounded-lg text-xs text-left border transition-all truncate ${
                        isSel
                          ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <div className="truncate">{top.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Bottom Clothing */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
              <label className="text-xs font-semibold text-stone-300 mb-2.5 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-amber-400" />
                4. Busana Bawahan (Bottoms & Pants)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(isFemale ? AVAILABLE_FEMALE_BOTTOMS : AVAILABLE_MALE_BOTTOMS).map((bot) => {
                  const isSel = (profile.clothingBottom || (isFemale ? 'Skirt' : 'Pants')) === bot.id;
                  return (
                    <button
                      key={bot.id}
                      id={`btn-bot-${bot.id}`}
                      onClick={() => setProfile((p) => ({ ...p, clothingBottom: bot.id }))}
                      className={`p-2 rounded-lg text-xs text-left border transition-all truncate ${
                        isSel
                          ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <div className="truncate">{bot.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Footwear */}
            <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
              <label className="text-xs font-semibold text-stone-300 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                5. Alas Kaki (Boots & Socks)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(isFemale ? AVAILABLE_FEMALE_SHOES : AVAILABLE_MALE_SHOES).map((shoe) => {
                  const isSel = (profile.footwear || 'Boots') === shoe.id;
                  return (
                    <button
                      key={shoe.id}
                      id={`btn-shoe-${shoe.id}`}
                      onClick={() => setProfile((p) => ({ ...p, footwear: shoe.id }))}
                      className={`p-2 rounded-lg text-xs text-left border transition-all truncate ${
                        isSel
                          ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                      }`}
                    >
                      <div className="truncate">{shoe.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Hair & Weapon */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hair */}
              <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
                <label className="text-xs font-semibold text-stone-300 mb-2 block">
                  Gaya Rambut (Hair)
                </label>
                <div className="grid grid-cols-1 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {(isFemale ? AVAILABLE_FEMALE_HAIR : AVAILABLE_MALE_HAIR).map((h) => {
                    const isSel = (profile.hair || (isFemale ? 'Female Hair1' : 'Male Hair1')) === h.id;
                    return (
                      <button
                        key={h.id}
                        id={`btn-hair-${h.id}`}
                        onClick={() => setProfile((p) => ({ ...p, hair: h.id }))}
                        className={`px-2.5 py-1.5 rounded text-xs text-left border transition-all ${
                          isSel
                            ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                            : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                        }`}
                      >
                        {h.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Weapon */}
              <div className="bg-stone-950 rounded-xl border border-stone-800 p-4">
                <label className="text-xs font-semibold text-stone-300 mb-2 block">
                  Senjata & Tangan (Weapon)
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    id="btn-weapon-sword"
                    onClick={() =>
                      setProfile((p) => ({
                        ...p,
                        weapon: isFemale ? 'Female Sword' : 'Male Sword',
                      }))
                    }
                    className={`px-2.5 py-2 rounded text-xs text-left border transition-all ${
                      profile.weapon !== 'none'
                        ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                    }`}
                  >
                    ⚔️ Pedang Baja ({isFemale ? 'Female Sword' : 'Male Sword'})
                  </button>
                  <button
                    id="btn-weapon-none"
                    onClick={() => setProfile((p) => ({ ...p, weapon: 'none' }))}
                    className={`px-2.5 py-2 rounded text-xs text-left border transition-all ${
                      profile.weapon === 'none'
                        ? 'bg-amber-600 text-white border-amber-400 font-semibold'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:bg-stone-800'
                    }`}
                  >
                    ✋ Tangan Kosong (Unarmed)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-stone-800 bg-stone-950 flex items-center justify-between">
          <span className="text-xs text-stone-400">
            Karakter tersimpan secara otomatis dan langsung aktif di permainan.
          </span>
          <button
            id="btn-studio-done"
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-lg shadow-amber-900/30 transition-all"
          >
            Selesai & Mainkan Karakter
          </button>
        </div>
      </div>
    </div>
  );
};
