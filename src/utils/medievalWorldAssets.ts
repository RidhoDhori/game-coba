/**
 * Medieval World Assets & Pixel Art Engine
 * Direct in-game implementation of authentic GandalfHardcore FREE Platformer Assets:
 * - Large Tent (Large Tent.png - 96x128)
 * - Small Tent (Small Tent.png - 64x64)
 * - Birds (birds1.png 20x20, birds2.png 12x24, birds3.png 7x7, birds4.png 9x9)
 * - House Tiles (House Tiles.png - 448x224: House 1 Cottage, House 2 Manor)
 * - Furnace and Sawmill (Furnace and Sawmill.png - 384x128: Furnace, Sawmill, Smithy)
 * - Cooking Area (Cooking area.png - 768x64: 12 animated frames of 64x64)
 * - Angel Statue (Angel Statue.png - 64x64)
 * - Alchemy Decor (Alchemy Decor.png - 192x64)
 * - Garden Decorations (Garden Decorations.png - 224x128: stone well, flowerbeds, urns)
 * - Trees (Tree1-4.png 256x208, Birch1-3.png 80x112, Pine Trees.png 672x192, Large Pine Tree.png 128x176, Weeping Willow1-3.png 224x192, Flowering Tree.png 96x112)
 * - Sky Atmosphere (sun.png 32x32, hot air balloon.png 20x35, cloud1-6.png)
 * - Animated Sprites (Campfire sheet.png 160x256, GandalfHardcore Portal sheet.png 640x64)
 * - Crops & Ground (Wheat.png 256x32, Tall Grass.png 96x32, Floor Tiles1.png 288x576, Boat.png 800x32, Decor.png 416x544)
 */

export type SeasonTheme = 'spring' | 'autumn' | 'winter';

// Global cache for GandalfHardcore authentic platformer images
const platformerImages: Map<string, HTMLImageElement> = new Map();

export function getPlatformerImage(relativePath: string): HTMLImageElement | null {
  const cleanPath = relativePath.replace(/^\/assets\/gandalf\/platformer\//, '');
  const decoded = decodeURI(cleanPath);
  const fullUrl = `/assets/gandalf/platformer/${encodeURI(decoded)}`;
  if (platformerImages.has(fullUrl)) return platformerImages.get(fullUrl)!;
  if (platformerImages.has(cleanPath)) return platformerImages.get(cleanPath)!;
  if (typeof window !== 'undefined') {
    const img = new Image();
    img.src = fullUrl;
    platformerImages.set(fullUrl, img);
    platformerImages.set(cleanPath, img);
    return img;
  }
  return null;
}

// Preload all key GandalfHardcore platformer assets immediately
if (typeof window !== 'undefined') {
  const platformerFilesToPreload = [
    // Tents & Villages
    'Large Tent.png',
    'Small Tent.png',
    'House Tiles.png',
    'Furnace and Sawmill.png',
    'Cooking area.png',
    'Angel Statue.png',
    'Garden Decorations.png',
    'Alchemy Decor.png',
    'Boat.png',
    // Birds
    'birds1.png',
    'birds2.png',
    'birds3.png',
    'birds4.png',
    // Flora & Sky
    'Tree1.png',
    'Tree2.png',
    'Tree3.png',
    'Birch1.png',
    'Birch2.png',
    'Large Pine Tree.png',
    'Pine Trees.png',
    'Weeping Willow1.png',
    'Flowering Tree.png',
    'Wheat.png',
    'Tall Grass.png',
    'sun.png',
    'hot air balloon.png',
    'cloud1.png',
    'cloud2.png',
    'cloud3.png',
    'cloud4.png',
    'cloud5.png',
    'cloud6.png',
    // Authentic Gandalf Terrain & Dirt Tiles
    'Floor Tiles1.png',
    'Floor Tiles2.png',
    'BG Dirt1.png',
    'BG Dirt2.png',
    'Other Tiles1.png',
    'Other Tiles2.png',
    'Decor.png',
    'Torch.png',
    'Ores.png',
    'Animated Sprites/Campfire sheet.png',
    'Animated Sprites/Campfire with food sheet.png',
    'Animated Sprites/GandalfHardcore Portal sheet.png',
    // Normal Season Background Layers
    'GandalfHardcore Background layers/Normal BG/GandalfHardcore Background layers_layer 5.png',
    'GandalfHardcore Background layers/Normal BG/GandalfHardcore Background layers_layer 4.png',
    'GandalfHardcore Background layers/Normal BG/Background Castle .png',
    'GandalfHardcore Background layers/Normal BG/GandalfHardcore Background layers_layer 3.png',
    'GandalfHardcore Background layers/Normal BG/GandalfHardcore Background layers_layer 2.png',
    'GandalfHardcore Background layers/Normal BG/GandalfHardcore Background layers_layer 1.png',
    // Autumn Season Background Layers
    'GandalfHardcore Background layers/Autumn BG/GandalfHardcore Background layers_layer 5.png',
    'GandalfHardcore Background layers/Autumn BG/GandalfHardcore Background layers_layer 4.png',
    'GandalfHardcore Background layers/Autumn BG/Background Castle Autumn.png',
    'GandalfHardcore Background layers/Autumn BG/GandalfHardcore Background layers_layer 3.png',
    'GandalfHardcore Background layers/Autumn BG/GandalfHardcore Background layers_layer 2.png',
    'GandalfHardcore Background layers/Autumn BG/GandalfHardcore Background layers_layer 1.png',
    // Winter Season Background Layers
    'GandalfHardcore Background layers/Winter BG/GandalfHardcore Background layers_layer 5.png',
    'GandalfHardcore Background layers/Winter BG/GandalfHardcore Background layers_layer 4.png',
    'GandalfHardcore Background layers/Winter BG/Background Castle  Winter.png',
    'GandalfHardcore Background layers/Winter BG/GandalfHardcore Background layers_layer 3.png',
    'GandalfHardcore Background layers/Winter BG/GandalfHardcore Background layers_layer 2.png',
    'GandalfHardcore Background layers/Winter BG/GandalfHardcore Background layers_layer 1.png',
  ];
  platformerFilesToPreload.forEach((f) => getPlatformerImage(f));
}

/**
 * Returns the URL of GandalfHardcore Parallax Background Layer for the active season
 */
export function getGandalfBgLayerUrl(layer: number, season: SeasonTheme = 'spring'): string {
  let folder = 'Normal BG';
  if (season === 'autumn') folder = 'Autumn BG';
  else if (season === 'winter') folder = 'Winter BG';

  if (layer === 99) {
    // Castle layer
    if (season === 'autumn') {
      return `/assets/gandalf/platformer/GandalfHardcore%20Background%20layers/${encodeURIComponent(folder)}/Background%20Castle%20Autumn.png`;
    }
    if (season === 'winter') {
      return `/assets/gandalf/platformer/GandalfHardcore%20Background%20layers/${encodeURIComponent(folder)}/Background%20Castle%20%20Winter.png`;
    }
    return `/assets/gandalf/platformer/GandalfHardcore%20Background%20layers/${encodeURIComponent(folder)}/Background%20Castle%20.png`;
  }

  const layerNum = Math.max(1, Math.min(5, layer));
  return `/assets/gandalf/platformer/GandalfHardcore%20Background%20layers/${encodeURIComponent(folder)}/GandalfHardcore%20Background%20layers_layer%20${layerNum}.png`;
}

/**
 * Returns the preloaded HTMLImageElement for any GandalfHardcore background layer
 */
export function getGandalfBgLayerImage(layer: number, season: SeasonTheme = 'spring'): HTMLImageElement | null {
  let folder = 'Normal BG';
  if (season === 'autumn') folder = 'Autumn BG';
  else if (season === 'winter') folder = 'Winter BG';

  let relPath = '';
  if (layer === 99) {
    if (season === 'autumn') {
      relPath = `GandalfHardcore Background layers/${folder}/Background Castle Autumn.png`;
    } else if (season === 'winter') {
      relPath = `GandalfHardcore Background layers/${folder}/Background Castle  Winter.png`;
    } else {
      relPath = `GandalfHardcore Background layers/${folder}/Background Castle .png`;
    }
  } else {
    const layerNum = Math.max(1, Math.min(5, layer));
    relPath = `GandalfHardcore Background layers/${folder}/GandalfHardcore Background layers_layer ${layerNum}.png`;
  }
  return getPlatformerImage(relPath);
}

/**
 * Renders the authentic GandalfHardcore 6-Layer Parallax Background
 * Layer 5 (Sky Gradient, 100% opaque) -> Sky Props (Sun, Balloon, Clouds) ->
 * Layer 4 (Distant Mountains) -> Background Castle -> Layer 3 (Midground Foothills) ->
 * Layer 2 (Nearer Forest Ridge) -> Layer 1 (Foreground Silhouette Forest & Mist)
 */
export function drawGandalfBackgroundLayers(
  ctx: CanvasRenderingContext2D,
  camX: number,
  W: number,
  H: number,
  season: SeasonTheme = 'spring'
): void {
  // Seamless horizontal tiling across the camera view (1024px width per GandalfHardcore BG sheet)
  const drawLayer = (img: HTMLImageElement | null, speed: number, drawH: number = 415, offsetY: number = 0) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const layerW = 1024;
    const offset = ((camX * speed) % layerW + layerW) % layerW;
    for (let x = -layerW; x <= W + layerW; x += layerW) {
      ctx.drawImage(img, x - offset, offsetY, layerW, drawH);
    }
  };

  const bgHeight = 415; // Extends seamlessly to meet the village ground platform (y=400)

  // 1. Layer 5: Gandalf Authentic Sky (Backmost 100% opaque layer)
  const skyImg = getGandalfBgLayerImage(5, season);
  if (skyImg && skyImg.complete && skyImg.naturalWidth > 0) {
    drawLayer(skyImg, 0.01, bgHeight);
  } else {
    const skyGrad = ctx.createLinearGradient(0, 0, 0, bgHeight);
    if (season === 'winter') {
      skyGrad.addColorStop(0, '#c7d2fe');
      skyGrad.addColorStop(1, '#e0f2fe');
    } else if (season === 'autumn') {
      skyGrad.addColorStop(0, '#fdba74');
      skyGrad.addColorStop(1, '#fed7aa');
    } else {
      skyGrad.addColorStop(0, '#80c2ce');
      skyGrad.addColorStop(1, '#cbeff6');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, bgHeight);
  }

  // 2. Gandalf Sky Elements (Pixel Sun, Hot Air Balloon, Clouds from Gandalf asset pack)
  drawGandalfSun(ctx, ((720 - camX * 0.02) % (W + 200) + W + 200) % (W + 200) - 100, 38, 44, 44);
  drawGandalfHotAirBalloon(ctx, ((430 - camX * 0.04) % (W + 300) + W + 300) % (W + 300) - 100, 72, 28, 48);
  drawGandalfCloud(ctx, 1, ((120 - camX * 0.05) % (W + 400) + W + 400) % (W + 400) - 150, 42, 130, 50);
  drawGandalfCloud(ctx, 3, ((480 - camX * 0.04) % (W + 400) + W + 400) % (W + 400) - 150, 68, 110, 45);
  drawGandalfCloud(ctx, 5, ((820 - camX * 0.06) % (W + 400) + W + 400) % (W + 400) - 150, 32, 140, 55);

  // 3. Layer 4: Distant Mountain Range (Soft blue-grey silhouette peaks)
  drawLayer(getGandalfBgLayerImage(4, season), 0.06, bgHeight);

  // 4. Background Castle: The grand mountain fortress on the high cliff
  drawLayer(getGandalfBgLayerImage(99, season), 0.12, bgHeight);

  // 5. Layer 3: Midground Foothills & Pine Forests
  drawLayer(getGandalfBgLayerImage(3, season), 0.22, bgHeight);

  // 6. Layer 2: Nearer Forested Ridges
  drawLayer(getGandalfBgLayerImage(2, season), 0.38, bgHeight);

  // 7. Layer 1: Foreground Pine Forest Silhouettes & Rolling Horizon Base
  drawLayer(getGandalfBgLayerImage(1, season), 0.55, bgHeight);

  // Soft atmospheric mist hovering above the ground
  const fogGrad = ctx.createLinearGradient(0, 340, 0, 415);
  fogGrad.addColorStop(0, 'rgba(215, 235, 245, 0.0)');
  fogGrad.addColorStop(0.6, 'rgba(215, 235, 245, 0.16)');
  fogGrad.addColorStop(1, 'rgba(215, 235, 245, 0.0)');
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, 340, W, 75);
}

// Cache for generated offscreen canvases
const assetCanvasCache: Map<string, HTMLCanvasElement> = new Map();

function getOrCreateCanvas(
  key: string,
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, c: HTMLCanvasElement) => void
): HTMLCanvasElement {
  if (assetCanvasCache.has(key)) {
    return assetCanvasCache.get(key)!;
  }
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  const ctx = c.getContext('2d');
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    drawFn(ctx, c);
  }
  assetCanvasCache.set(key, c);
  return c;
}

// ---------------------------------------------------------------------------
// 1. AUTHENTIC GANDALF DIRECT RENDERERS (Tents, Houses, Birds, Stations)
// ---------------------------------------------------------------------------

/**
 * Draws GandalfHardcore Large Tent (Large Tent.png - 96x128)
 */
export function drawGandalfLargeTent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 96,
  h: number = 128
): void {
  const img = getPlatformerImage('Large Tent.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 96, 128, x, y, w, h);
  } else {
    // Royal pavilion fallback while loading
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Draws GandalfHardcore Small Tent (Small Tent.png - 64x64)
 */
export function drawGandalfSmallTent(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 64,
  h: number = 64
): void {
  const img = getPlatformerImage('Small Tent.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 64, 64, x, y, w, h);
  } else {
    // Wedge tent fallback
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Draws GandalfHardcore House from House Tiles.png (448x224)
 * Variant 1: Cottage (sx: 0, sy: 0, sw: 224, sh: 224)
 * Variant 2: Manor / Townhouse (sx: 224, sy: 0, sw: 224, sh: 224)
 */
export function drawGandalfHouse(
  ctx: CanvasRenderingContext2D,
  variant: 1 | 2 = 1,
  x: number,
  y: number,
  w: number = 224,
  h: number = 224
): void {
  const img = getPlatformerImage('House Tiles.png');
  const sx = variant === 2 ? 224 : 0;
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, sx, 0, 224, 224, x, y, w, h);
  } else {
    // Fallback cottage block
    ctx.fillStyle = '#3a3442';
    ctx.fillRect(x, y + h * 0.4, w, h * 0.6);
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x, y + h * 0.4);
    ctx.lineTo(x + w, y + h * 0.4);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Draws GandalfHardcore Furnace from Furnace and Sawmill.png (Chunk 0: sx: 0..128, sy: 0..128)
 */
export function drawGandalfFurnace(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 100,
  h: number = 100
): void {
  const img = getPlatformerImage('Furnace and Sawmill.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 128, 128, x, y, w, h);
  } else {
    ctx.fillStyle = '#374151';
    ctx.fillRect(x, y + 20, w, h - 20);
  }
}

/**
 * Draws GandalfHardcore Sawmill from Furnace and Sawmill.png (Chunk 1: sx: 128..256, sy: 0..128)
 */
export function drawGandalfSawmill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 100,
  h: number = 100
): void {
  const img = getPlatformerImage('Furnace and Sawmill.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 128, 0, 128, 128, x, y, w, h);
  } else {
    ctx.fillStyle = '#452613';
    ctx.fillRect(x, y + 30, w, h - 30);
  }
}

/**
 * Draws GandalfHardcore Smithy / Forge Workshop from Furnace and Sawmill.png (Chunk 2: sx: 256..384, sy: 0..128)
 */
export function drawGandalfWorkshop(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 90,
  h: number = 90
): void {
  const img = getPlatformerImage('Furnace and Sawmill.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 256, 0, 128, 128, x, y, w, h);
  } else {
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y + 20, w, h - 20);
  }
}

/**
 * Draws GandalfHardcore Animated Cooking Area from Cooking area.png (768x64 -> 12 frames of 64x64)
 */
export function drawGandalfCookingArea(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  w: number = 64,
  h: number = 64
): void {
  const img = getPlatformerImage('Cooking area.png');
  const safeFrame = Math.floor(frame) % 12;
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, safeFrame * 64, 0, 64, 64, x, y, w, h);
  } else {
    ctx.fillStyle = '#452613';
    ctx.fillRect(x + 10, y + 20, w - 20, h - 20);
  }
}

/**
 * Draws GandalfHardcore Angel Statue (Angel Statue.png - 64x64)
 */
export function drawGandalfAngelStatue(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 64,
  h: number = 64
): void {
  const img = getPlatformerImage('Angel Statue.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 64, 64, x, y, w, h);
  } else {
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 14, y + 10, w - 28, h - 10);
  }
}

/**
 * Draws GandalfHardcore Alchemy Decor (Alchemy Decor.png - 192x64)
 */
export function drawGandalfAlchemy(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 96,
  h: number = 50
): void {
  const img = getPlatformerImage('Alchemy Decor.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 192, 64, x, y, w, h);
  }
}

/**
 * Draws GandalfHardcore Garden Decorations (Garden Decorations.png - 224x128)
 * variant: 'well' (stone water well), 'flowerbed', 'urns'
 */
export function drawGandalfGardenDecor(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  variant: 'well' | 'flowerbed' | 'urns' = 'well',
  w: number = 64,
  h: number = 64
): void {
  const img = getPlatformerImage('Garden Decorations.png');
  if (img && img.complete && img.naturalWidth > 0) {
    if (variant === 'well') {
      ctx.drawImage(img, 0, 0, 64, 128, x, y, w, h);
    } else if (variant === 'flowerbed') {
      ctx.drawImage(img, 64, 0, 64, 128, x, y, w, h);
    } else {
      ctx.drawImage(img, 128, 0, 96, 128, x, y, w, h);
    }
  }
}

/**
 * Draws GandalfHardcore Tree
 */
export function drawGandalfTree(
  ctx: CanvasRenderingContext2D,
  treeType: 'oak1' | 'oak2' | 'birch1' | 'birch2' | 'pine_large' | 'pine_cluster' | 'willow' | 'blossom',
  x: number,
  y: number,
  w: number,
  h: number
): void {
  let file = 'Tree1.png';
  let sw = 256;
  let sh = 208;

  switch (treeType) {
    case 'oak1':
      file = 'Tree1.png';
      sw = 256;
      sh = 208;
      break;
    case 'oak2':
      file = 'Tree2.png';
      sw = 256;
      sh = 208;
      break;
    case 'birch1':
      file = 'Birch1.png';
      sw = 80;
      sh = 112;
      break;
    case 'birch2':
      file = 'Birch2.png';
      sw = 80;
      sh = 112;
      break;
    case 'pine_large':
      file = 'Large Pine Tree.png';
      sw = 128;
      sh = 176;
      break;
    case 'pine_cluster':
      file = 'Pine Trees.png';
      sw = 672;
      sh = 192;
      break;
    case 'willow':
      file = 'Weeping Willow1.png';
      sw = 224;
      sh = 192;
      break;
    case 'blossom':
      file = 'Flowering Tree.png';
      sw = 96;
      sh = 112;
      break;
  }

  const img = getPlatformerImage(file);
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, sw, sh, x, y, w, h);
  }
}

/**
 * Draws GandalfHardcore Wheat (Wheat.png - 256x32)
 */
export function drawGandalfWheat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 128,
  h: number = 32
): void {
  const img = getPlatformerImage('Wheat.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 256, 32, x, y, w, h);
  } else {
    ctx.fillStyle = '#eab308';
    ctx.fillRect(x, y + 10, w, h - 10);
  }
}

/**
 * Draws GandalfHardcore Tall Grass (Tall Grass.png - 96x32, 3 variations)
 */
export function drawGandalfTallGrass(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  variant: number = 0
): void {
  const img = getPlatformerImage('Tall Grass.png');
  if (img && img.complete && img.naturalWidth > 0) {
    const sx = (Math.abs(Math.floor(variant)) % 3) * 32;
    ctx.drawImage(img, sx, 0, 32, 32, x, y - 28, 32, 32);
  }
}

/**
 * Draws GandalfHardcore River Boat (Boat.png - 800x32)
 */
export function drawGandalfBoat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 100,
  h: number = 32
): void {
  const img = getPlatformerImage('Boat.png');
  if (img && img.complete && img.naturalWidth > 0) {
    // Slices first boat segment
    ctx.drawImage(img, 0, 0, 160, 32, x, y, w, h);
  }
}

/**
 * Draws GandalfHardcore Sun (sun.png - 32x32)
 */
export function drawGandalfSun(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 40,
  h: number = 40
): void {
  const img = getPlatformerImage('sun.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 32, 32, x, y, w, h);
  } else {
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draws GandalfHardcore Hot Air Balloon (hot air balloon.png - 20x35)
 */
export function drawGandalfHotAirBalloon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number = 26,
  h: number = 45
): void {
  const img = getPlatformerImage('hot air balloon.png');
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, 0, 0, 20, 35, x, y, w, h);
  }
}

/**
 * Draws GandalfHardcore Clouds (cloud1.png..cloud6.png)
 */
export function drawGandalfCloud(
  ctx: CanvasRenderingContext2D,
  variant: number = 1,
  x: number,
  y: number,
  w?: number,
  h?: number
): void {
  const v = Math.max(1, Math.min(6, Math.floor(variant)));
  const img = getPlatformerImage(`cloud${v}.png`);
  if (img && img.complete && img.naturalWidth > 0) {
    const drawW = w || img.naturalWidth * 1.5;
    const drawH = h || img.naturalHeight * 1.5;
    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, x, y, drawW, drawH);
  }
}

// ---------------------------------------------------------------------------
// 2. ACTIVE BIRDS SIMULATION (birds1, birds2, birds3, birds4)
// ---------------------------------------------------------------------------

interface BirdDef {
  id: number;
  type: 'sky' | 'perched';
  baseX: number;
  baseY: number;
  speedX?: number;
  perchName?: string;
  perchOffset?: number;
}

const VILLAGE_BIRDS: BirdDef[] = [
  // A. Perched birds on village rooftops, tents, and trees
  { id: 1, type: 'perched', baseX: 232, baseY: 178, perchName: 'House 1 Roof Ridge' },
  { id: 2, type: 'perched', baseX: 1258, baseY: 178, perchName: 'House 2 Chimney' },
  { id: 3, type: 'perched', baseX: 1024, baseY: 268, perchName: 'Large Tent Apex' },
  { id: 4, type: 'perched', baseX: 442, baseY: 300, perchName: 'Birch Branch' },
  { id: 5, type: 'perched', baseX: 780, baseY: 235, perchName: 'Oak Branch' },
  { id: 6, type: 'perched', baseX: 1890, baseY: 230, perchName: 'Willow Branch' },

  // B. Flock of soaring sky birds
  { id: 10, type: 'sky', baseX: 100, baseY: 65, speedX: 0.8 },
  { id: 11, type: 'sky', baseX: 160, baseY: 78, speedX: 0.75 },
  { id: 12, type: 'sky', baseX: 220, baseY: 62, speedX: 0.82 },
  { id: 13, type: 'sky', baseX: 600, baseY: 85, speedX: 0.7 },
  { id: 14, type: 'sky', baseX: 900, baseY: 55, speedX: 0.85 },
  { id: 15, type: 'sky', baseX: 1400, baseY: 70, speedX: 0.78 },
  { id: 16, type: 'sky', baseX: 1750, baseY: 80, speedX: 0.8 },
  { id: 17, type: 'sky', baseX: 2100, baseY: 60, speedX: 0.72 },
];

/**
 * Draws authentic GandalfHardcore Birds (birds1, birds2, birds3, birds4)
 * Handles flight flapping, sinusoidal soaring, perching, and player approach reactions!
 */
export function drawGandalfBirds(
  ctx: CanvasRenderingContext2D,
  cameraX: number,
  timeMs: number,
  playerX: number = 0,
  playerY: number = 0
): void {
  const b1 = getPlatformerImage('birds1.png'); // 20x20
  const b2 = getPlatformerImage('birds2.png'); // 12x24
  const b3 = getPlatformerImage('birds3.png'); // 7x7
  const b4 = getPlatformerImage('birds4.png'); // 9x9

  VILLAGE_BIRDS.forEach((bird) => {
    if (bird.type === 'sky') {
      // Sky bird: continuous smooth flight from left to right across the world
      const worldWidth = 2600;
      const progress = ((bird.baseX + (timeMs * 0.04 * (bird.speedX || 0.8))) % worldWidth);
      const curX = progress;
      const curY = bird.baseY + Math.sin(timeMs * 0.003 + bird.id) * 8;

      // Only draw if within visible camera bounds (+ extra margin)
      if (curX >= cameraX - 100 && curX <= cameraX + 1060) {
        // Wing flap animation: alternates between birds1 and birds2
        const flapCycle = Math.floor(timeMs / 180 + bird.id) % 4;
        const isWingsSpread = flapCycle === 0 || flapCycle === 1;
        const birdImg = isWingsSpread ? b1 : b2;

        if (birdImg && birdImg.complete && birdImg.naturalWidth > 0) {
          const w = birdImg.naturalWidth;
          const h = birdImg.naturalHeight;
          ctx.drawImage(birdImg, 0, 0, w, h, curX, curY, w, h);
        } else {
          // Simple silhouette fallback
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(curX, curY, 6, 4);
        }
      }
    } else {
      // Perched bird on roof, tent, or branch
      const distToPlayer = Math.hypot(playerX - bird.baseX, playerY - bird.baseY);
      const isStartled = distToPlayer < 90;

      let drawX = bird.baseX;
      let drawY = bird.baseY;

      if (isStartled) {
        // Fluttering jump upward when player is nearby
        const flutterOffset = Math.sin(timeMs * 0.02 + bird.id) * 14 - 8;
        drawY += flutterOffset;
      }

      // Small head tilt / fidget
      const fidget = Math.floor(timeMs / 600 + bird.id) % 3;
      const perchedImg = isStartled ? (Math.floor(timeMs / 120) % 2 === 0 ? b1 : b2) : (fidget === 0 ? b4 : b3);

      if (perchedImg && perchedImg.complete && perchedImg.naturalWidth > 0) {
        const w = perchedImg.naturalWidth;
        const h = perchedImg.naturalHeight;
        ctx.drawImage(perchedImg, 0, 0, w, h, drawX, drawY, w, h);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(drawX, drawY, 6, 6);
      }
    }
  });
}

// ---------------------------------------------------------------------------
// 3. BACKWARD COMPATIBLE CANVAS HELPERS (Rendering Authentic Gandalf Assets)
// ---------------------------------------------------------------------------

export function getHouseTileCanvas(variant: 'cottage' | 'manor' = 'cottage', season: SeasonTheme = 'spring'): HTMLCanvasElement {
  const key = `house_${variant}_${season}`;
  return getOrCreateCanvas(key, 224, 224, (ctx, canvas) => {
    const img = getPlatformerImage('House Tiles.png');
    const sx = variant === 'manor' ? 224 : 0;
    const render = () => {
      ctx.clearRect(0, 0, 224, 224);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, sx, 0, 224, 224, 0, 0, 224, 224);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getTentCanvas(size: 'large' | 'small' = 'large'): HTMLCanvasElement {
  const key = `tent_${size}`;
  const isLarge = size === 'large';
  const W = isLarge ? 96 : 64;
  const H = isLarge ? 128 : 64;
  const fileName = isLarge ? 'Large Tent.png' : 'Small Tent.png';

  return getOrCreateCanvas(key, W, H, (ctx) => {
    const img = getPlatformerImage(fileName);
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, W, H, 0, 0, W, H);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getFurnaceCanvas(fireFrame: number = 0): HTMLCanvasElement {
  const key = `furnace_${fireFrame % 4}`;
  return getOrCreateCanvas(key, 128, 128, (ctx) => {
    const img = getPlatformerImage('Furnace and Sawmill.png');
    const render = () => {
      ctx.clearRect(0, 0, 128, 128);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 128, 128, 0, 0, 128, 128);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getSawmillCanvas(sawOffset: number = 0): HTMLCanvasElement {
  const key = `sawmill_${Math.floor(sawOffset) % 4}`;
  return getOrCreateCanvas(key, 128, 128, (ctx) => {
    const img = getPlatformerImage('Furnace and Sawmill.png');
    const render = () => {
      ctx.clearRect(0, 0, 128, 128);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 128, 0, 128, 128, 0, 0, 128, 128);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getCookingAreaCanvas(frame: number = 0): HTMLCanvasElement {
  const safeFrame = Math.floor(frame) % 12;
  const key = `cooking_area_${safeFrame}`;
  return getOrCreateCanvas(key, 64, 64, (ctx) => {
    const img = getPlatformerImage('Cooking area.png');
    const render = () => {
      ctx.clearRect(0, 0, 64, 64);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, safeFrame * 64, 0, 64, 64, 0, 0, 64, 64);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getMaidenStatueCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('angel_statue_gandalf', 64, 64, (ctx) => {
    const img = getPlatformerImage('Angel Statue.png');
    const render = () => {
      ctx.clearRect(0, 0, 64, 64);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 64, 64, 0, 0, 64, 64);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getOakTreeCanvas(season: SeasonTheme = 'spring'): HTMLCanvasElement {
  const key = `oak_tree_gandalf_${season}`;
  return getOrCreateCanvas(key, 256, 208, (ctx) => {
    const img = getPlatformerImage(season === 'autumn' ? 'Tree2.png' : 'Tree1.png');
    const render = () => {
      ctx.clearRect(0, 0, 256, 208);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 256, 208, 0, 0, 256, 208);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getPineTreeCanvas(season: SeasonTheme = 'spring', size: 'normal' | 'large' = 'normal'): HTMLCanvasElement {
  const key = `pine_tree_gandalf_${season}_${size}`;
  const isLarge = size === 'large';
  const W = isLarge ? 128 : 128;
  const H = isLarge ? 176 : 176;
  return getOrCreateCanvas(key, W, H, (ctx) => {
    const img = getPlatformerImage('Large Pine Tree.png');
    const render = () => {
      ctx.clearRect(0, 0, W, H);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 128, 176, 0, 0, W, H);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getBirchTreeCanvas(season: SeasonTheme = 'spring'): HTMLCanvasElement {
  const key = `birch_tree_gandalf_${season}`;
  return getOrCreateCanvas(key, 80, 112, (ctx) => {
    const img = getPlatformerImage('Birch1.png');
    const render = () => {
      ctx.clearRect(0, 0, 80, 112);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 80, 112, 0, 0, 80, 112);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getWeepingWillowCanvas(season: SeasonTheme = 'spring'): HTMLCanvasElement {
  const key = `willow_gandalf_${season}`;
  return getOrCreateCanvas(key, 224, 192, (ctx) => {
    const img = getPlatformerImage('Weeping Willow1.png');
    const render = () => {
      ctx.clearRect(0, 0, 224, 192);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 224, 192, 0, 0, 224, 192);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getBlossomTreeCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('blossom_tree_gandalf', 96, 112, (ctx) => {
    const img = getPlatformerImage('Flowering Tree.png');
    const render = () => {
      ctx.clearRect(0, 0, 96, 112);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 96, 112, 0, 0, 96, 112);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getWheatFieldCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('wheat_gandalf', 256, 32, (ctx) => {
    const img = getPlatformerImage('Wheat.png');
    const render = () => {
      ctx.clearRect(0, 0, 256, 32);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 256, 32, 0, 0, 256, 32);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getPixelSunCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('sun_gandalf', 32, 32, (ctx) => {
    const img = getPlatformerImage('sun.png');
    const render = () => {
      ctx.clearRect(0, 0, 32, 32);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 32, 32, 0, 0, 32, 32);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getHotAirBalloonCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('balloon_gandalf', 20, 35, (ctx) => {
    const img = getPlatformerImage('hot air balloon.png');
    const render = () => {
      ctx.clearRect(0, 0, 20, 35);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, 20, 35, 0, 0, 20, 35);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

export function getCloudCanvas(variant: number = 1): HTMLCanvasElement {
  const v = Math.max(1, Math.min(6, Math.floor(variant)));
  const key = `cloud_gandalf_${v}`;
  return getOrCreateCanvas(key, 120, 50, (ctx) => {
    const img = getPlatformerImage(`cloud${v}.png`);
    const render = () => {
      ctx.clearRect(0, 0, 120, 50);
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, 120, 50);
      }
    };
    if (img && img.complete && img.naturalWidth > 0) {
      render();
    } else if (img) {
      img.addEventListener('load', render);
    }
  });
}

// ---------------------------------------------------------------------------
// 4. PLATFORMS & TERRAIN TILES (Floor Tiles1.png)
// ---------------------------------------------------------------------------

export function getTerrainGroundTile(season: SeasonTheme = 'spring'): HTMLCanvasElement {
  const key = `ground_tile_gandalf_${season}`;
  return getOrCreateCanvas(key, 64, 64, (ctx) => {
    const img = getPlatformerImage('Floor Tiles1.png');
    if (img && img.complete && img.naturalWidth > 0) {
      // Row 0 has the grass top, Row 1 has dirt middle (32x32 each)
      ctx.drawImage(img, 0, 0, 32, 32, 0, 0, 32, 32);
      ctx.drawImage(img, 0, 0, 32, 32, 32, 0, 32, 32);
      ctx.drawImage(img, 0, 32, 32, 32, 0, 32, 32, 32);
      ctx.drawImage(img, 0, 32, 32, 32, 32, 32, 32, 32);
    } else {
      ctx.fillStyle = '#261912';
      ctx.fillRect(0, 0, 64, 64);
      ctx.fillStyle = season === 'autumn' ? '#d97706' : season === 'winter' ? '#e0f2fe' : '#4ea344';
      ctx.fillRect(0, 0, 64, 8);
    }
  });
}

export function getStonePlatformTile(): HTMLCanvasElement {
  return getOrCreateCanvas('stone_platform_tile', 64, 32, (ctx) => {
    const img = getPlatformerImage('Floor Tiles1.png');
    if (img && img.complete && img.naturalWidth > 0) {
      // Carved stone blocks
      ctx.drawImage(img, 0, 64, 32, 32, 0, 0, 32, 32);
      ctx.drawImage(img, 0, 64, 32, 32, 32, 0, 32, 32);
    } else {
      ctx.fillStyle = '#3f3a46';
      ctx.fillRect(0, 0, 64, 32);
      ctx.fillStyle = '#585161';
      ctx.fillRect(2, 2, 60, 12);
    }
  });
}

export function getWoodenBridgeTile(): HTMLCanvasElement {
  return getOrCreateCanvas('wood_bridge_tile', 64, 24, (ctx) => {
    ctx.fillStyle = '#653b1b';
    ctx.fillRect(0, 0, 64, 24);
    ctx.fillStyle = '#855027';
    ctx.fillRect(2, 2, 60, 4);
    ctx.fillRect(2, 9, 60, 4);
    ctx.fillRect(2, 16, 60, 4);
    ctx.fillStyle = '#42240e';
    ctx.fillRect(0, 0, 6, 24);
    ctx.fillRect(58, 0, 6, 24);
  });
}

/**
 * Directly renders platforms and ground using authentic GandalfHardcore tiles:
 * - Floor Tiles1.png: Autotiling grass surface (left corner, center, right corner) + subsurface dirt
 * - BG Dirt1.png / BG Dirt2.png: Rich subterranean dirt tiles for depth below 64px
 * - Other Tiles1.png: Handcrafted stone masonry blocks & timber bridge planks
 */
export function drawGandalfTerrainPlatform(
  ctx: CanvasRenderingContext2D,
  platform: { x: number; y: number; w: number; h: number; type: string },
  season: SeasonTheme = 'spring'
): void {
  const { x, y, w, h, type } = platform;

  if (type === 'ground') {
    const floorImg = getPlatformerImage('Floor Tiles1.png');
    const dirtImg = getPlatformerImage(season === 'winter' ? 'BG Dirt2.png' : 'BG Dirt1.png');

    // Row offsets in Floor Tiles1.png (9 cols x 18 rows of 32x32)
    let grassRowY = 0;
    let subDirtRowY = 32;
    if (season === 'autumn') {
      grassRowY = 192;
      subDirtRowY = 224;
    } else if (season === 'winter') {
      grassRowY = 384;
      subDirtRowY = 416;
    }

    const hasFloor = !!(floorImg && floorImg.complete && floorImg.naturalWidth > 0);
    const hasDirt = !!(dirtImg && dirtImg.complete && dirtImg.naturalWidth > 0);

    // 1. Top Grass Surface (32px high)
    for (let px = x; px < x + w; px += 32) {
      const tileW = Math.min(32, x + w - px);
      if (hasFloor) {
        // Tile selection: left corner (sx=0), center repeating (sx=32), variation (sx=96), right corner (sx=64)
        let sx = 32;
        if (px === x) sx = 0;
        else if (px + 32 >= x + w) sx = 64;
        else if (((px - x) / 32) % 4 === 2) sx = 96;

        ctx.drawImage(floorImg, sx, grassRowY, tileW, 32, px, y, tileW, 32);
      } else {
        ctx.fillStyle = season === 'autumn' ? '#d97706' : season === 'winter' ? '#e0f2fe' : '#4ea344';
        ctx.fillRect(px, y, tileW, 8);
        ctx.fillStyle = '#3c2b20';
        ctx.fillRect(px, y + 8, tileW, 24);
      }
    }

    // 2. Subsurface Dirt Transition (32px high, y+32 to y+64)
    if (h > 32) {
      const subH = Math.min(32, h - 32);
      for (let px = x; px < x + w; px += 32) {
        const tileW = Math.min(32, x + w - px);
        if (hasFloor) {
          const sx = ((px - x) / 32) % 2 === 0 ? 32 : 64;
          ctx.drawImage(floorImg, sx, subDirtRowY, tileW, subH, px, y + 32, tileW, subH);
        } else {
          ctx.fillStyle = '#2f2026';
          ctx.fillRect(px, y + 32, tileW, subH);
        }
      }
    }

    // 3. Deep Subterranean Dirt Fill (y+64 to y+h) using Gandalf BG Dirt1.png / BG Dirt2.png!
    if (h > 64) {
      for (let py = y + 64; py < y + h; py += 32) {
        const tileH = Math.min(32, y + h - py);
        const rowIdx = Math.floor((py - (y + 64)) / 32);
        const dirtSy = 32 + ((rowIdx % 3) * 32); // Rows 1, 2, 3 have seamless dirt

        for (let px = x; px < x + w; px += 32) {
          const tileW = Math.min(32, x + w - px);
          if (hasDirt) {
            const colIdx = Math.abs(Math.floor((px - x) / 32)) % 6;
            const dirtSx = colIdx * 32;
            ctx.drawImage(dirtImg, dirtSx, dirtSy, tileW, tileH, px, py, tileW, tileH);
          } else {
            ctx.fillStyle = season === 'winter' ? '#1a222d' : '#221920';
            ctx.fillRect(px, py, tileW, tileH);
          }
        }
      }
    }
  } else if (type === 'stone') {
    // Castle & balcony stone platforms from Other Tiles1.png
    const otherImg = getPlatformerImage('Other Tiles1.png');
    const hasOther = !!(otherImg && otherImg.complete && otherImg.naturalWidth > 0);

    for (let px = x; px < x + w; px += 32) {
      const tileW = Math.min(32, x + w - px);
      if (hasOther) {
        ctx.drawImage(otherImg, 32, 0, tileW, Math.min(32, h), px, y, tileW, h);
      } else {
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(px, y, tileW, h);
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(px + 1, y + 1, tileW - 2, 2);
      }
    }
  } else if (type === 'wood') {
    // Timber bridge planks & beams from Other Tiles1.png
    const otherImg = getPlatformerImage('Other Tiles1.png');
    const hasOther = !!(otherImg && otherImg.complete && otherImg.naturalWidth > 0);

    for (let px = x; px < x + w; px += 32) {
      const tileW = Math.min(32, x + w - px);
      if (hasOther) {
        ctx.drawImage(otherImg, 128, 32, tileW, Math.min(32, h), px, y, tileW, h);
      } else {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(px, y, tileW, h);
        ctx.fillStyle = '#92400e';
        ctx.fillRect(px + 1, y + 1, tileW - 2, 2);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// 5. ORES & VILLAGE DECOR (Barrels, Crates, Torches)
// ---------------------------------------------------------------------------

export type OreType = 'copper' | 'iron' | 'gold' | 'crystal';

export function getOreCanvas(type: OreType): HTMLCanvasElement {
  const key = `ore_gandalf_${type}`;
  return getOrCreateCanvas(key, 36, 32, (ctx) => {
    const img = getPlatformerImage('Ores.png');
    let col = 0;
    if (type === 'iron') col = 1;
    if (type === 'gold') col = 2;
    if (type === 'crystal') col = 3;

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, col * 32, 0, 32, 32, 2, 0, 32, 32);
    } else {
      ctx.fillStyle = '#334155';
      ctx.fillRect(4, 4, 28, 24);
      let oreColor = '#f97316';
      if (type === 'iron') oreColor = '#94a3b8';
      if (type === 'gold') oreColor = '#eab308';
      if (type === 'crystal') oreColor = '#06b6d4';
      ctx.fillStyle = oreColor;
      ctx.fillRect(10, 8, 16, 16);
    }
  });
}

export function getCrateCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('crate_gandalf', 24, 24, (ctx) => {
    const img = getPlatformerImage('Decor.png');
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, 32, 32, 0, 0, 24, 24);
    } else {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(0, 0, 24, 24);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(2, 2, 20, 20);
    }
  });
}

export function getBarrelCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('barrel_gandalf', 22, 26, (ctx) => {
    const img = getPlatformerImage('Decor.png');
    if (img && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 32, 0, 32, 32, 0, 0, 22, 26);
    } else {
      ctx.fillStyle = '#5c3218';
      ctx.beginPath();
      ctx.ellipse(11, 13, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function getGravestoneCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('gravestone_gandalf', 26, 32, (ctx) => {
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.arc(13, 10, 9, Math.PI, 0);
    ctx.rect(4, 10, 18, 20);
    ctx.fill();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(11, 8, 4, 14);
    ctx.fillRect(7, 12, 12, 4);
  });
}

export function getScarecrowCanvas(): HTMLCanvasElement {
  return getOrCreateCanvas('scarecrow_gandalf', 36, 48, (ctx) => {
    ctx.fillStyle = '#452613';
    ctx.fillRect(16, 6, 4, 42);
    ctx.fillRect(4, 16, 28, 4);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(18, 14, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#3e2412';
    ctx.fillRect(8, 8, 20, 3);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(11, 20, 14, 18);
  });
}

/**
 * Animated Campfire from Campfire sheet.png (160x256 -> 5 columns of 32px)
 */
export function drawGandalfCampfire(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  w: number = 44,
  h: number = 44
): void {
  const img = getPlatformerImage('Animated Sprites/Campfire sheet.png');
  const safeFrame = Math.floor(frame) % 5;
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, safeFrame * 32, 0, 32, 32, x, y, w, h);
  } else {
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.7, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.7, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Animated Portal from GandalfHardcore Portal sheet.png (640x64 -> 10 frames of 64x64)
 */
export function drawGandalfPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  frame: number,
  w: number = 72,
  h: number = 72
): void {
  const img = getPlatformerImage('Animated Sprites/GandalfHardcore Portal sheet.png');
  const safeFrame = Math.floor(frame) % 10;
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, safeFrame * 64, 0, 64, 64, x, y, w, h);
  } else {
    ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, 28, 0, Math.PI * 2);
    ctx.fill();
  }
}
