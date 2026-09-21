export type Gender = 'Male' | 'Female';

export type SkinColor =
  | 'Female Skin1'
  | 'Female Skin2'
  | 'Female Skin3'
  | 'Female Skin4'
  | 'Female Skin5'
  | 'Male Skin1'
  | 'Male Skin2'
  | 'Male Skin3'
  | 'Male Skin4'
  | 'Male Skin5'
  | 'fair'
  | 'tan'
  | 'pale'
  | 'dark'
  | 'orc_green'
  | 'custom_uploaded';

export interface SlicingConfig {
  frameWidth: number;
  frameHeight: number;
  cols: number;
  rows: number;
  offsetX: number;
  offsetY: number;
  actionRows: {
    idle: { row: number; frames: number };
    walk: { row: number; frames: number };
    run: { row: number; frames: number };
    jump: { row: number; frames: number };
    fall: { row: number; frames: number };
    attack: { row: number; frames: number };
    hurt: { row: number; frames: number };
  };
}

export interface CustomLayerSprite {
  id: string;
  name: string;
  category: 'skin' | 'hair' | 'clothing' | 'hand';
  dataUrl: string;
  imageElement?: HTMLImageElement;
}

export interface CharacterProfile {
  name: string;
  gender: Gender;
  skinColor: SkinColor | string;
  clothing: string; // compatibility key or preset ID
  clothingTop?: string; // Corset, Blue Corset, Shirt, Blue Shirt v2, etc.
  clothingBottom?: string; // Skirt, Pants, Blue Pants, etc.
  footwear?: string; // Boots, Shoes, Socks, Green Socks, etc.
  underwear?: string; // Panties and Bra, Underwear, etc.
  hair: string; // Female Hair1..5 or Male Hair1..5
  hand: string;
  weapon: string; // Female Sword, Male Sword, none
  scale: number;
  customSkinUrl?: string;
  customHairUrl?: string;
  customClothingUrl?: string;
  customHandUrl?: string;
  slicingConfig: SlicingConfig;
}

export interface AnimationAction {
  name: 'idle' | 'run' | 'jump' | 'attack' | 'hurt';
  row: number;
  frameCount: number;
  fps: number;
}

export interface ParallaxLayerConfig {
  id: string;
  name: string;
  filename: string;
  speed: number;
  yOffset: number;
  enabled: boolean;
  colorGradient: [string, string];
}

export interface ProjectFile {
  path: string;
  name: string;
  language: string;
  category: 'root' | 'engine' | 'entities' | 'world' | 'ui' | 'assets' | 'docs';
  description: string;
  content: string;
}

export interface GameStats {
  score: number;
  gold: number;
  health: number;
  maxHealth: number;
  stamina: number;
  maxStamina: number;
  enemiesDefeated: number;
}
