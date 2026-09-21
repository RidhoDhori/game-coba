/**
 * Real Pixel Art Sprite Generator & Modular Compositor
 * Integrates directly with GandalfHardcore FREE Character Asset Pack:
 * - 800x448 spritesheets (80x64 per frame, 10 cols x 7 rows)
 * - True modular layering: Skin -> Underwear -> Bottom -> Top -> Footwear -> Hair -> Hand/Weapon
 * - Presets for Female and Male heroes with authentic assets
 */

import { CharacterProfile, SlicingConfig } from '../types';
import { FEMALE_SKIN1_BASE64 } from './femaleSkin1Data';

export const DEFAULT_SLICING_CONFIG: SlicingConfig = {
  frameWidth: 80,
  frameHeight: 64,
  cols: 10,
  rows: 7,
  offsetX: 0,
  offsetY: 0,
  actionRows: {
    idle: { row: 0, frames: 5 },
    walk: { row: 1, frames: 8 },
    run: { row: 2, frames: 8 },
    jump: { row: 3, frames: 4 },
    fall: { row: 4, frames: 4 },
    hurt: { row: 5, frames: 6 },
    attack: { row: 6, frames: 10 },
  },
};

export const DEFAULT_CHARACTER_SKIN_URL = '/assets/gandalf/character/Character%20skin%20colors/Female%20Skin1.png';

// Global image cache for custom user-uploaded and preloaded sprites
const imageCache: Map<string, HTMLImageElement> = new Map();

export function getCachedImage(url: string): HTMLImageElement | null {
  if (!url) return null;
  const decoded = decodeURI(url);
  if (imageCache.has(url)) return imageCache.get(url)!;
  if (imageCache.has(decoded)) return imageCache.get(decoded)!;

  const img = new Image();
  img.src = url;
  imageCache.set(url, img);
  imageCache.set(decoded, img);
  return img;
}

// Preload GandalfHardcore Character assets on module load
if (typeof window !== 'undefined') {
  // Preload base fallback base64
  const defaultSkinImg = new Image();
  defaultSkinImg.src = FEMALE_SKIN1_BASE64;
  imageCache.set(FEMALE_SKIN1_BASE64, defaultSkinImg);

  const initialToPreload = [
    '/assets/gandalf/character/Character%20skin%20colors/Female%20Skin1.png',
    '/assets/gandalf/character/Character%20skin%20colors/Female%20Skin2.png',
    '/assets/gandalf/character/Character%20skin%20colors/Male%20Skin1.png',
    '/assets/gandalf/character/Character%20skin%20colors/Male%20Skin2.png',
    '/assets/gandalf/character/Female%20Clothing/Corset.png',
    '/assets/gandalf/character/Female%20Clothing/Corset%20v2.png',
    '/assets/gandalf/character/Female%20Clothing/Blue%20Corset%20v2.png',
    '/assets/gandalf/character/Female%20Clothing/Green%20Corset.png',
    '/assets/gandalf/character/Female%20Clothing/Purple%20Corset%20v2.png',
    '/assets/gandalf/character/Female%20Clothing/Skirt.png',
    '/assets/gandalf/character/Female%20Clothing/Boots.png',
    '/assets/gandalf/character/Female%20Clothing/Socks.png',
    '/assets/gandalf/character/Female%20Clothing/Green%20Socks.png',
    '/assets/gandalf/character/Female%20Clothing/Purple%20Socks.png',
    '/assets/gandalf/character/Female%20Hair/Female%20Hair1.png',
    '/assets/gandalf/character/Female%20Hair/Female%20Hair2.png',
    '/assets/gandalf/character/Female%20Hair/Female%20Hair3.png',
    '/assets/gandalf/character/Female%20Hair/Female%20Hair5.png',
    '/assets/gandalf/character/Female%20Hand/Female%20Sword.png',
    '/assets/gandalf/character/Male%20Clothing/Shirt.png',
    '/assets/gandalf/character/Male%20Clothing/Shirt%20v2.png',
    '/assets/gandalf/character/Male%20Clothing/Blue%20Shirt%20v2.png',
    '/assets/gandalf/character/Male%20Clothing/Green%20Shirt%20v2.png',
    '/assets/gandalf/character/Male%20Clothing/Pants.png',
    '/assets/gandalf/character/Male%20Clothing/Blue%20Pants.png',
    '/assets/gandalf/character/Male%20Clothing/Green%20Pants.png',
    '/assets/gandalf/character/Male%20Clothing/Boots.png',
    '/assets/gandalf/character/Male%20Clothing/Shoes.png',
    '/assets/gandalf/character/Male%20Hair/Male%20Hair1.png',
    '/assets/gandalf/character/Male%20Hair/Male%20Hair2.png',
    '/assets/gandalf/character/Male%20Hair/Male%20Hair3.png',
    '/assets/gandalf/character/Male%20Hand/Male%20Sword.png',
  ];

  initialToPreload.forEach((p) => {
    getCachedImage(p);
  });
}

export interface GandalfPreset {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  skinColor: string;
  clothingTop: string;
  clothingBottom: string;
  footwear: string;
  hair: string;
  weapon: string;
  clothing: string;
  description: string;
}

export const GANDALF_CHARACTER_PRESETS: GandalfPreset[] = [
  {
    id: 'aria_adventurer',
    name: 'Aria (Adventurer Tunic)',
    gender: 'Female',
    skinColor: 'Female Skin1',
    clothingTop: 'Corset',
    clothingBottom: 'Skirt',
    footwear: 'Boots',
    hair: 'Female Hair1',
    weapon: 'Female Sword',
    clothing: 'adventurer_tunic',
    description: 'Petualang wanita dengan korset kulit pengelana, rok berlipit, dan rambut kepang emas.',
  },
  {
    id: 'valera_knight',
    name: 'Valera (Royal Azure Knight)',
    gender: 'Female',
    skinColor: 'Female Skin2',
    clothingTop: 'Blue Corset v2',
    clothingBottom: 'Skirt',
    footwear: 'Boots',
    hair: 'Female Hair2',
    weapon: 'Female Sword',
    clothing: 'knight_plate',
    description: 'Ksatria kerajaan berzirah sutra biru dengan rambut raven panjang dan pedang ksatria.',
  },
  {
    id: 'lyra_ranger',
    name: 'Lyra (Forest Ranger)',
    gender: 'Female',
    skinColor: 'Female Skin3',
    clothingTop: 'Green Corset',
    clothingBottom: 'Skirt',
    footwear: 'Green Socks',
    hair: 'Female Hair3',
    weapon: 'Female Sword',
    clothing: 'huntress_leather',
    description: 'Penjelajah hutan rimba dengan korset zamrud, kaus kaki daun, dan kuncir auburn dinamis.',
  },
  {
    id: 'elen_sorceress',
    name: 'Elen (Arcane Sorceress)',
    gender: 'Female',
    skinColor: 'Female Skin4',
    clothingTop: 'Purple Corset v2',
    clothingBottom: 'Skirt',
    footwear: 'Purple Socks',
    hair: 'Female Hair5',
    weapon: 'Female Sword',
    clothing: 'sorceress_robe',
    description: 'Penyihir berbusana sutra ungu misterius dengan sanggul perak kembar.',
  },
  {
    id: 'arthur_warrior',
    name: 'Arthur (Highland Warrior)',
    gender: 'Male',
    skinColor: 'Male Skin1',
    clothingTop: 'Shirt',
    clothingBottom: 'Pants',
    footwear: 'Boots',
    hair: 'Male Hair1',
    weapon: 'Male Sword',
    clothing: 'warrior_shirt',
    description: 'Prajurit dataran tinggi berbalut kemeja linen, celana kulit kokoh, dan pedang gagah.',
  },
  {
    id: 'cedric_azure',
    name: 'Cedric (Knight of Azure)',
    gender: 'Male',
    skinColor: 'Male Skin2',
    clothingTop: 'Blue Shirt v2',
    clothingBottom: 'Blue Pants',
    footwear: 'Shoes',
    hair: 'Male Hair3',
    weapon: 'Male Sword',
    clothing: 'azure_guard',
    description: 'Ksatria safir dengan jubah tunik biru, celana serasi, dan rambut pirang keemasan.',
  },
  {
    id: 'robin_scout',
    name: 'Robin (Verdant Scout)',
    gender: 'Male',
    skinColor: 'Male Skin3',
    clothingTop: 'Green Shirt v2',
    clothingBottom: 'Green Pants',
    footwear: 'Boots',
    hair: 'Male Hair2',
    weapon: 'Male Sword',
    clothing: 'forest_scout',
    description: 'Pengintai rimba dengan pakaian hijau kamuflase dan pedang penjelajah.',
  },
];

// Available options for the wardrobe / customizer
export const AVAILABLE_SKINS_FEMALE = [
  'Female Skin1',
  'Female Skin2',
  'Female Skin3',
  'Female Skin4',
  'Female Skin5',
];

export const AVAILABLE_SKINS_MALE = [
  'Male Skin1',
  'Male Skin2',
  'Male Skin3',
  'Male Skin4',
  'Male Skin5',
];

export const AVAILABLE_FEMALE_TOPS = [
  { id: 'Corset', name: 'Leather Corset' },
  { id: 'Corset v2', name: 'Adventurer Corset v2' },
  { id: 'Blue Corset', name: 'Royal Blue Corset' },
  { id: 'Blue Corset v2', name: 'Azure Knight Bodice' },
  { id: 'Green Corset', name: 'Forest Ranger Corset' },
  { id: 'Green Corset v2', name: 'Emerald Bodice v2' },
  { id: 'Orange Corset', name: 'Autumn Ember Corset' },
  { id: 'Orange Corset v2', name: 'Amber Bodice v2' },
  { id: 'Purple Corset', name: 'Arcane Velvet Corset' },
  { id: 'Purple Corset v2', name: 'Sorceress Bodice v2' },
  { id: 'none', name: 'Tanpa Atasan' },
];

export const AVAILABLE_FEMALE_BOTTOMS = [
  { id: 'Skirt', name: 'Pleated Skirt' },
  { id: 'Blue Panties and Bra', name: 'Blue Linen Undergarment' },
  { id: 'Green Panties and Bra', name: 'Green Forest Undergarment' },
  { id: 'Orange Panties and Bra', name: 'Orange Amber Undergarment' },
  { id: 'Purple Panties and Bra', name: 'Purple Silk Undergarment' },
  { id: 'none', name: 'Tanpa Bawahan' },
];

export const AVAILABLE_FEMALE_SHOES = [
  { id: 'Boots', name: 'Adventurer High Boots' },
  { id: 'Socks', name: 'Standard Socks' },
  { id: 'Green Socks', name: 'Green Ranger Socks' },
  { id: 'Orange Socks', name: 'Orange Autumn Socks' },
  { id: 'Purple Socks', name: 'Purple Velvet Socks' },
  { id: 'Red Socks', name: 'Crimson Silk Socks' },
  { id: 'Skyblue Socks', name: 'Skyblue Socks' },
  { id: 'none', name: 'Tanpa Sepatu (Barefoot)' },
];

export const AVAILABLE_FEMALE_HAIR = [
  { id: 'Female Hair1', name: 'Golden Long Braids' },
  { id: 'Female Hair2', name: 'Raven Flowing Locks' },
  { id: 'Female Hair3', name: 'Auburn High Ponytail' },
  { id: 'Female Hair4', name: 'Chestnut Classic Bob' },
  { id: 'Female Hair5', name: 'Silver Twin Buns' },
  { id: 'none', name: 'Tanpa Rambut' },
];

export const AVAILABLE_MALE_TOPS = [
  { id: 'Shirt', name: 'Highland Linen Shirt' },
  { id: 'Shirt v2', name: 'Warrior Tunic v2' },
  { id: 'Blue Shirt v2', name: 'Royal Blue Tunic' },
  { id: 'Green Shirt v2', name: 'Verdant Ranger Tunic' },
  { id: 'orange Shirt v2', name: 'Bronze Warrior Tunic' },
  { id: 'Purple Shirt v2', name: 'Imperial Purple Tunic' },
  { id: 'none', name: 'Tanpa Atasan' },
];

export const AVAILABLE_MALE_BOTTOMS = [
  { id: 'Pants', name: 'Leather Trousers' },
  { id: 'Blue Pants', name: 'Royal Blue Pants' },
  { id: 'Green Pants', name: 'Forest Green Pants' },
  { id: 'Orange Pants', name: 'Autumn Bronze Pants' },
  { id: 'Purple Pants', name: 'Imperial Purple Pants' },
  { id: 'Underwear', name: 'Basic Underwear' },
  { id: 'none', name: 'Tanpa Celana' },
];

export const AVAILABLE_MALE_SHOES = [
  { id: 'Boots', name: 'Knee-High Iron Boots' },
  { id: 'Shoes', name: 'Adventurer Low Shoes' },
  { id: 'none', name: 'Tanpa Sepatu (Barefoot)' },
];

export const AVAILABLE_MALE_HAIR = [
  { id: 'Male Hair1', name: 'Tousled Brown Locks' },
  { id: 'Male Hair2', name: 'Dark Slick Hair' },
  { id: 'Male Hair3', name: 'Golden Flowing Hair' },
  { id: 'Male Hair4', name: 'Wild Auburn Hair' },
  { id: 'Male Hair5', name: 'Silver Warrior Hair' },
  { id: 'none', name: 'Tanpa Rambut' },
];

/**
 * Resolves the image URL for a given GandalfHardcore Character layer
 */
export function resolveLayerUrl(
  category: 'skin' | 'top' | 'bottom' | 'footwear' | 'hair' | 'weapon',
  gender: 'Female' | 'Male',
  value?: string
): string | null {
  if (!value || value === 'none') return null;

  if (category === 'skin') {
    // If it's a full URL or data URI, return as-is
    if (value.startsWith('http') || value.startsWith('data:')) return value;
    const skinName = value.includes('Skin') ? value : (gender === 'Female' ? 'Female Skin1' : 'Male Skin1');
    return `/assets/gandalf/character/Character%20skin%20colors/${encodeURIComponent(skinName)}.png`;
  }

  if (category === 'weapon') {
    if (gender === 'Female') {
      return '/assets/gandalf/character/Female%20Hand/Female%20Sword.png';
    }
    return '/assets/gandalf/character/Male%20Hand/Male%20Sword.png';
  }

  if (gender === 'Female') {
    if (category === 'hair') {
      return `/assets/gandalf/character/Female%20Hair/${encodeURIComponent(value)}.png`;
    }
    return `/assets/gandalf/character/Female%20Clothing/${encodeURIComponent(value)}.png`;
  } else {
    if (category === 'hair') {
      return `/assets/gandalf/character/Male%20Hair/${encodeURIComponent(value)}.png`;
    }
    return `/assets/gandalf/character/Male%20Clothing/${encodeURIComponent(value)}.png`;
  }
}

/**
 * Procedural fallback pixel art generator (in case network / image is delayed)
 */
export function generateBasePixelArtSheet(skinTone: string = '#f4cca4'): string {
  return FEMALE_SKIN1_BASE64;
}

/**
 * Renders a frame of the character onto a target canvas context
 * using GandalfHardcore modular 800x448 spritesheet slicing (80x64 per frame).
 */
export function renderSlicedCharacterFrame(
  ctx: CanvasRenderingContext2D,
  profile: CharacterProfile,
  action: 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'attack' | 'hurt',
  frameIndex: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
  facingRight: boolean = true,
  fallbackBaseDataUrl?: string
): void {
  const config = profile.slicingConfig || DEFAULT_SLICING_CONFIG;
  const actionInfo = config.actionRows[action] || config.actionRows.idle;
  const row = actionInfo.row;
  const maxFrames = Math.max(1, actionInfo.frames);
  const safeFrame = frameIndex % maxFrames;

  // Source frame on 800x448 sheet (80x64 per frame)
  const fw = config.frameWidth || 80;
  const fh = config.frameHeight || 64;
  const sx = safeFrame * fw;
  const sy = row * fh;

  ctx.save();
  ctx.imageSmoothingEnabled = false;

  // The raw GandalfHardcore character spritesheet naturally faces LEFT.
  // When facingRight is TRUE, we flip horizontally (scale -1, 1) so the hero faces RIGHT.
  // When facingRight is FALSE, the character keeps its natural LEFT orientation.
  if (facingRight) {
    ctx.translate(dx + dw / 2, dy + dh / 2);
    ctx.scale(-1, 1);
    ctx.translate(-(dx + dw / 2), -(dy + dh / 2));
  }

  const gender = profile.gender || 'Female';

  // Resolve layer URLs based on profile
  let topValue = profile.clothingTop;
  let bottomValue = profile.clothingBottom;
  let footwearValue = profile.footwear;
  let hairValue = profile.hair;
  let skinValue = profile.skinColor;
  let weaponValue = profile.weapon;

  // Compatibility fallback for preset IDs like 'adventurer_tunic'
  if (!topValue && profile.clothing) {
    const preset = GANDALF_CHARACTER_PRESETS.find((p) => p.clothing === profile.clothing || p.id === profile.clothing);
    if (preset) {
      topValue = preset.clothingTop;
      bottomValue = preset.clothingBottom;
      footwearValue = preset.footwear;
      hairValue = preset.hair;
      weaponValue = preset.weapon;
    } else {
      topValue = gender === 'Female' ? 'Corset' : 'Shirt';
      bottomValue = gender === 'Female' ? 'Skirt' : 'Pants';
      footwearValue = 'Boots';
    }
  }

  // Fallback defaults if undefined
  if (!hairValue) hairValue = gender === 'Female' ? 'Female Hair1' : 'Male Hair1';
  if (!weaponValue) weaponValue = gender === 'Female' ? 'Female Sword' : 'Male Sword';
  if (!skinValue) skinValue = gender === 'Female' ? 'Female Skin1' : 'Male Skin1';

  // URLs to composite in order
  const skinUrl = resolveLayerUrl('skin', gender, skinValue) || profile.customSkinUrl || DEFAULT_CHARACTER_SKIN_URL;
  const bottomUrl = resolveLayerUrl('bottom', gender, bottomValue);
  const topUrl = resolveLayerUrl('top', gender, topValue);
  const footwearUrl = resolveLayerUrl('footwear', gender, footwearValue);
  const hairUrl = resolveLayerUrl('hair', gender, hairValue);
  const weaponUrl = weaponValue !== 'none' ? resolveLayerUrl('weapon', gender, weaponValue) : null;

  let anyImageDrawn = false;

  // Helper to draw a layer from spritesheet
  const drawLayer = (url: string | null) => {
    if (!url) return;
    const img = getCachedImage(url);
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, sx, sy, fw, fh, dx, dy, dw, dh);
      anyImageDrawn = true;
    }
  };

  // 1. Base Body Skin
  drawLayer(skinUrl);

  // 2. Bottom Clothing (Pants / Skirt / Undergarment)
  drawLayer(bottomUrl);

  // 3. Top Clothing (Corset / Shirt / Tunic)
  drawLayer(topUrl);

  // 4. Footwear (Boots / Shoes / Socks)
  drawLayer(footwearUrl);

  // 5. Hair (Braids, Ponytail, Buns, Tousled locks)
  drawLayer(hairUrl);

  // 6. Hand & Weapon (Broadsword)
  drawLayer(weaponUrl);

  // Fallback if no image finished loading yet
  if (!anyImageDrawn && fallbackBaseDataUrl) {
    const fallbackImg = getCachedImage(fallbackBaseDataUrl);
    if (fallbackImg && fallbackImg.complete && fallbackImg.naturalWidth > 0) {
      // Scale coordinates to 48x48 fallback sheet
      const fSx = safeFrame * 48;
      const fSy = row * 48;
      ctx.drawImage(fallbackImg, fSx, fSy, 48, 48, dx, dy, dw, dh);
    }
  }

  // 7. Dynamic Slashing Arc & Spark Wave during Attack
  if (action === 'attack' && (safeFrame === 2 || safeFrame === 3)) {
    ctx.save();
    const cx = dx + dw * 0.65;
    const cy = dy + dh * 0.45;
    const radius = dw * 0.28;

    // Glowing crescent arc
    ctx.strokeStyle = safeFrame === 2 ? 'rgba(254, 240, 138, 0.9)' : 'rgba(254, 240, 138, 0.45)';
    ctx.lineWidth = safeFrame === 2 ? 4 : 2.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();

    // Hot white blade tip trail
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Spark particles at slash tip
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cx + radius * 0.7, cy - radius * 0.4, 3, 3);
    ctx.fillRect(cx + radius * 0.85, cy, 3, 3);
    ctx.restore();
  }

  ctx.restore();
}
