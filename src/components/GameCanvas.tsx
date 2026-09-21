import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Play, RotateCcw, Volume2, Shield, Heart, Zap, Coins, Sword, Sun, Cloud, Snowflake, Leaf, Flame, Sparkles } from 'lucide-react';
import { CharacterProfile, GameStats } from '../types';
import { sound } from '../utils/audio';
import { renderSlicedCharacterFrame, generateBasePixelArtSheet, getCachedImage } from '../utils/pixelSpriteGenerator';
import { drawGothicHud } from '../utils/gothicHudRenderer';
import { GothicHudBar } from './GothicHudBar';
import {
  SeasonTheme,
  getGandalfBgLayerUrl,
  drawGandalfCampfire,
  drawGandalfPortal,
  drawGandalfHouse,
  drawGandalfLargeTent,
  drawGandalfSmallTent,
  drawGandalfFurnace,
  drawGandalfSawmill,
  drawGandalfWorkshop,
  drawGandalfCookingArea,
  drawGandalfAngelStatue,
  drawGandalfGardenDecor,
  drawGandalfAlchemy,
  drawGandalfWheat,
  drawGandalfTallGrass,
  drawGandalfBoat,
  drawGandalfTree,
  drawGandalfSun,
  drawGandalfHotAirBalloon,
  drawGandalfCloud,
  drawGandalfBirds,
  drawGandalfBackgroundLayers,
  drawGandalfTerrainPlatform,
  getOreCanvas,
  getCrateCanvas,
  getBarrelCanvas,
  getGravestoneCanvas,
  getScarecrowCanvas,
  OreType,
} from '../utils/medievalWorldAssets';

interface GameCanvasProps {
  profile: CharacterProfile;
  setProfile?: React.Dispatch<React.SetStateAction<CharacterProfile>>;
}

interface Entity {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
}

interface Enemy extends Entity {
  id: number;
  type: 'goblin' | 'knight';
  hp: number;
  maxHp: number;
  facingRight: boolean;
  patrolLeft: number;
  patrolRight: number;
  hitTimer: number;
  alive: boolean;
}

interface CoinItem {
  id: number;
  x: number;
  y: number;
  collected: boolean;
  timer: number;
}

interface OreNode {
  id: number;
  type: OreType;
  x: number;
  y: number;
  w: number;
  h: number;
  hp: number;
  maxHp: number;
  mined: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ profile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [stats, setStats] = useState<GameStats>({
    score: 0,
    gold: 0,
    health: 100,
    maxHealth: 100,
    stamina: 100,
    maxStamina: 100,
    enemiesDefeated: 0,
  });

  const [isGameOver, setIsGameOver] = useState(false);
  const [controlsLegend, setControlsLegend] = useState(true);
  const [season, setSeason] = useState<SeasonTheme>('spring');

  // Generate fallback authentic pixel art spritesheet (matching Female Skin1.png proportions)
  const defaultPixelArtSheet = useMemo(() => {
    const skinColorMap: Record<string, string> = {
      fair: '#f4cca4',
      tan: '#d4a373',
      pale: '#faedcd',
      dark: '#7f5539',
      orc_green: '#588157',
      custom_uploaded: '#f4cca4',
    };
    return generateBasePixelArtSheet(skinColorMap[profile.skinColor] || '#f4cca4');
  }, [profile.skinColor]);

  // Game internal state ref
  const gameStateRef = useRef({
    cameraX: 0,
    cameraY: 0,
    player: {
      x: 100,
      y: 350,
      w: 28,
      h: 44,
      vx: 0,
      vy: 0,
      onGround: false,
      facingRight: true,
      isAttacking: false,
      attackTimer: 0,
      invulnerableTimer: 0,
      animState: 'idle' as 'idle' | 'run' | 'jump' | 'attack' | 'hurt',
      animFrame: 0,
      frameTimer: 0,
    },
    keys: {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
      attack: false,
    },
    enemies: [] as Enemy[],
    coins: [
      { id: 1, x: 236, y: 270, collected: false, timer: 0 }, // on cottage balcony
      { id: 2, x: 380, y: 365, collected: false, timer: 1 }, // near cottage garden
      { id: 3, x: 620, y: 365, collected: false, timer: 2 }, // near campfire & tent
      { id: 4, x: 880, y: 365, collected: false, timer: 3 }, // village path
      { id: 5, x: 1120, y: 365, collected: false, timer: 4 }, // near well
      { id: 6, x: 1246, y: 270, collected: false, timer: 5 }, // on manor balcony
      { id: 7, x: 1540, y: 365, collected: false, timer: 6 }, // near farm field
      { id: 8, x: 1880, y: 365, collected: false, timer: 7 }, // near mining deposits
    ] as CoinItem[],
    particles: [] as Particle[],
    ores: [
      { id: 1, type: 'copper' as OreType, x: 1620, y: 368, w: 36, h: 32, hp: 3, maxHp: 3, mined: false },
      { id: 2, type: 'iron' as OreType, x: 1720, y: 368, w: 36, h: 32, hp: 3, maxHp: 3, mined: false },
      { id: 3, type: 'gold' as OreType, x: 1840, y: 368, w: 36, h: 32, hp: 3, maxHp: 3, mined: false },
      { id: 4, type: 'crystal' as OreType, x: 1980, y: 368, w: 36, h: 32, hp: 4, maxHp: 4, mined: false },
    ] as OreNode[],
    platforms: [
      // Ground floor
      { x: 0, y: 400, w: 2400, h: 140, type: 'ground' },
      // House 1 roof & balcony platforms (x: 170, y: 202, w: 180, h: 200)
      { x: 236, y: 304, w: 48, h: 10, type: 'wood' }, // 2nd-floor timber balcony
      { x: 240, y: 206, w: 40, h: 10, type: 'stone' }, // roof gable ridge
      // House 2 roof & balcony platforms (x: 1180, y: 202, w: 180, h: 200)
      { x: 1246, y: 304, w: 48, h: 10, type: 'wood' },
      { x: 1250, y: 206, w: 40, h: 10, type: 'stone' },
    ],
  });

  const resetGame = useCallback(() => {
    const s = gameStateRef.current;
    s.player.x = 100;
    s.player.y = 350;
    s.player.vx = 0;
    s.player.vy = 0;
    s.player.isAttacking = false;
    s.player.invulnerableTimer = 0;
    s.cameraX = 0;
    s.coins.forEach((c) => {
      c.collected = false;
    });
    s.ores.forEach((o) => {
      o.mined = false;
      o.hp = o.maxHp;
    });
    setStats({
      score: 0,
      gold: 0,
      health: 100,
      maxHealth: 100,
      stamina: 100,
      maxStamina: 100,
      enemiesDefeated: 0,
    });
    setIsGameOver(false);
  }, []);

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const k = gameStateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        k.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        k.right = true;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        if (!k.jump) {
          k.jump = true;
        }
        e.preventDefault();
      }
      if (e.code === 'KeyJ' || e.code === 'KeyZ' || e.code === 'KeyF') {
        if (!k.attack) {
          k.attack = true;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const k = gameStateRef.current.keys;
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') k.left = false;
      if (e.code === 'ArrowRight' || e.code === 'KeyD') k.right = false;
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') k.jump = false;
      if (e.code === 'KeyJ' || e.code === 'KeyZ' || e.code === 'KeyF') k.attack = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Trigger attack from button or click
  const triggerAttack = () => {
    gameStateRef.current.keys.attack = true;
    setTimeout(() => {
      gameStateRef.current.keys.attack = false;
    }, 120);
  };

  const triggerJump = () => {
    gameStateRef.current.keys.jump = true;
    setTimeout(() => {
      gameStateRef.current.keys.jump = false;
    }, 120);
  };

  // Main 60 FPS Platformer Game Loop
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
      lastTime = currentTime;

      const state = gameStateRef.current;
      const { player, keys, platforms, enemies, coins, particles } = state;

      if (!isGameOver) {
        // --- 1. PLAYER PHYSICS & INPUT ---
        const moveSpeed = 4.2;
        if (keys.left) {
          player.vx = -moveSpeed;
          player.facingRight = false;
        } else if (keys.right) {
          player.vx = moveSpeed;
          player.facingRight = true;
        } else {
          player.vx *= 0.75;
          if (Math.abs(player.vx) < 0.1) player.vx = 0;
        }

        // Jump
        if (keys.jump && player.onGround) {
          player.vy = -11.5;
          player.onGround = false;
          sound.playJump();
        }

        // Melee Attack
        if (keys.attack && !player.isAttacking && stats.stamina >= 15) {
          player.isAttacking = true;
          player.attackTimer = 0.28;
          sound.playSlash();
          setStats((prev) => ({ ...prev, stamina: Math.max(0, prev.stamina - 15) }));

          // Attack slash hitbox (for mining ores and interaction)
          const attackBox = {
            x: player.facingRight ? player.x + player.w - 4 : player.x - 36,
            y: player.y + 4,
            w: 40,
            h: 36,
          };

          // Check hit on ore deposits (mining)
          const ores = state.ores;
          ores.forEach((ore) => {
            if (
              !ore.mined &&
              attackBox.x < ore.x + ore.w &&
              attackBox.x + attackBox.w > ore.x &&
              attackBox.y < ore.y + ore.h &&
              attackBox.y + attackBox.h > ore.y
            ) {
              ore.hp -= 1;
              sound.playHit();
              const pColor =
                ore.type === 'copper' ? '#f97316' :
                ore.type === 'iron' ? '#cbd5e1' :
                ore.type === 'gold' ? '#fde047' : '#06b6d4';

              for (let i = 0; i < 8; i++) {
                particles.push({
                  x: ore.x + ore.w / 2,
                  y: ore.y + ore.h / 2,
                  vx: (Math.random() - 0.5) * 6,
                  vy: (Math.random() - 0.8) * 6,
                  life: 0.35,
                  maxLife: 0.35,
                  color: pColor,
                  size: 2.5 + Math.random() * 2.5,
                });
              }

              if (ore.hp <= 0) {
                ore.mined = true;
                const goldYield = ore.type === 'crystal' ? 50 : ore.type === 'gold' ? 35 : 20;
                setStats((prev) => ({
                  ...prev,
                  gold: prev.gold + goldYield,
                  score: prev.score + goldYield * 5,
                }));
              }
            }
          });
        }

        if (player.attackTimer > 0) {
          player.attackTimer -= dt;
          if (player.attackTimer <= 0) {
            player.isAttacking = false;
          }
        }

        // Stamina regen
        setStats((prev) => ({
          ...prev,
          stamina: Math.min(prev.maxStamina, prev.stamina + dt * 25),
        }));

        // Campfire & Blast Furnace warming aura (recovers health & stamina)
        const nearCampfire = (player.x >= 350 && player.x <= 430) || (player.x >= 460 && player.x <= 540);
        if (nearCampfire) {
          if (Math.random() < 0.2) {
            particles.push({
              x: player.x + Math.random() * player.w,
              y: player.y + player.h - 4,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -1.0 - Math.random() * 1.5,
              life: 0.45,
              maxLife: 0.45,
              color: '#fde047',
              size: 2,
            });
          }
          setStats((prev) => ({
            ...prev,
            health: Math.min(prev.maxHealth, prev.health + dt * 5),
            stamina: Math.min(prev.maxStamina, prev.stamina + dt * 15),
          }));
        }

        // Invulnerable timer
        if (player.invulnerableTimer > 0) {
          player.invulnerableTimer -= dt;
        }

        // Gravity
        player.vy = Math.min(14, player.vy + 0.65);

        // Platform collision X
        player.x += player.vx;
        platforms.forEach((p) => {
          if (
            player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y < p.y + p.h &&
            player.y + player.h > p.y
          ) {
            if (player.vx > 0) player.x = p.x - player.w;
            else if (player.vx < 0) player.x = p.x + p.w;
          }
        });

        // Platform collision Y
        player.y += player.vy;
        player.onGround = false;
        platforms.forEach((p) => {
          if (
            player.x < p.x + p.w &&
            player.x + player.w > p.x &&
            player.y < p.y + p.h &&
            player.y + player.h > p.y
          ) {
            if (player.vy > 0) {
              player.y = p.y - player.h;
              player.vy = 0;
              player.onGround = true;
            } else if (player.vy < 0) {
              player.y = p.y + p.h;
              player.vy = 0;
            }
          }
        });

        // Animation state determination
        if (player.isAttacking) {
          player.animState = 'attack';
        } else if (!player.onGround) {
          player.animState = 'jump';
        } else if (Math.abs(player.vx) > 0.5) {
          player.animState = 'run';
        } else {
          player.animState = 'idle';
        }

        player.frameTimer += dt;
        if (player.frameTimer > 0.12) {
          player.frameTimer = 0;
          player.animFrame = (player.animFrame + 1) % 6;
        }

        // --- 2. COIN PICKUPS ---
        coins.forEach((c) => {
          if (c.collected) return;
          c.timer += dt * 5;
          const coinY = c.y + Math.sin(c.timer) * 4;
          if (
            player.x < c.x + 16 &&
            player.x + player.w > c.x &&
            player.y < coinY + 16 &&
            player.y + player.h > coinY
          ) {
            c.collected = true;
            sound.playCoin();
            setStats((prev) => ({
              ...prev,
              gold: prev.gold + 1,
              score: prev.score + 50,
            }));

            // Coin gold spark particles
            for (let i = 0; i < 6; i++) {
              particles.push({
                x: c.x + 8,
                y: c.y + 8,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4 - 2,
                life: 0.4,
                maxLife: 0.4,
                color: '#facc15',
                size: 2.5,
              });
            }
          }
        });

        // Camera smoothly tracks player with wrap-around boundary
        const targetCamX = player.x - 960 / 2 + player.w / 2;
        state.cameraX += (targetCamX - state.cameraX) * 0.08;
        // Allow camera to go slightly beyond boundaries for better player movement
        const maxCamX = 2400 - 960;
        state.cameraX = Math.max(-200, Math.min(state.cameraX, maxCamX + 200));
        
        // Wrap player position when going off screen edges (seamless teleport)
        const worldWidth = 2400;
        if (player.x < -player.w) {
          player.x = worldWidth;
          state.cameraX = player.x - 960 / 2 + player.w / 2;
        } else if (player.x > worldWidth + player.w) {
          player.x = 0;
          state.cameraX = player.x - 960 / 2 + player.w / 2;
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= dt;
        if (p.life <= 0) particles.splice(i, 1);
      }

      // ==========================================
      // --- RENDERING PIPELINE (960 x 540) ---
      // ==========================================
      const W = canvas.width;
      const H = canvas.height;
      const camX = state.cameraX;

      ctx.clearRect(0, 0, W, H);

      // --- 5. AUTHENTIC GANDALF 6-LAYER PARALLAX BACKGROUND ---
      // Uses the true layer depth: Layer 5 (Sky) -> Props (Sun/Balloon/Clouds) -> Layer 4 (Distant Mountains) ->
      // Background Castle -> Layer 3 (Midground Hills) -> Layer 2 (Nearer Forest) -> Layer 1 (Foreground Mist & Pines)
      drawGandalfBackgroundLayers(ctx, camX, W, H, season);

      // --- 6. IN-WORLD TILES, BUILDINGS, VEGETATION & PLATFORMS ---
      ctx.save();
      ctx.translate(-camX, 0);

      // Pre-rendered tiles & props
      const crateCanvas = getCrateCanvas();
      const barrelCanvas = getBarrelCanvas();
      const gravestoneCanvas = getGravestoneCanvas();
      const scarecrowCanvas = getScarecrowCanvas();

      // A. AUTHENTIC GANDALF TREES & FOLIAGE
      drawGandalfTree(ctx, 'oak1', 290, 196, 160, 204);
      drawGandalfTree(ctx, 'birch1', 420, 288, 80, 112);
      drawGandalfTree(ctx, 'oak2', 750, 196, 160, 204);
      drawGandalfTree(ctx, 'pine_large', 920, 224, 128, 176);
      drawGandalfTree(ctx, 'birch2', 1060, 288, 80, 112);
      drawGandalfTree(ctx, 'pine_cluster', 1350, 208, 180, 192);
      drawGandalfTree(ctx, 'willow', 1860, 208, 190, 192);
      drawGandalfTree(ctx, 'blossom', 2080, 288, 96, 112);

      // B. AUTHENTIC GANDALF BUILDINGS & STATIONS
      // 1. Medieval House #1 - Half-timbered Stone Cottage (from House Tiles.png)
      drawGandalfHouse(ctx, 1, 150, 176, 224, 224);

      // 2. Medieval House #2 - Town Manor / Tavern (from House Tiles.png)
      drawGandalfHouse(ctx, 2, 1160, 176, 224, 224);

      // 3. Gandalf Large Royal Pavilion Tent with blue-gold canopy & flagpole (from Large Tent.png)
      drawGandalfLargeTent(ctx, 980, 272, 96, 128);

      // 4. Gandalf Small Adventurer Wedge Tent with guy lines (from Small Tent.png)
      drawGandalfSmallTent(ctx, 670, 336, 64, 64);

      // 5. Stone Blast Smelting Furnace (from Furnace and Sawmill.png)
      drawGandalfFurnace(ctx, 470, 300, 100, 100);

      // 6. Mechanical Water Sawmill (from Furnace and Sawmill.png)
      drawGandalfSawmill(ctx, 580, 300, 100, 100);

      // 7. Blacksmith Anvil & Tool Workshop (from Furnace and Sawmill.png)
      drawGandalfWorkshop(ctx, 720, 310, 90, 90);

      // 8. Animated Cooking Area with Cauldron & Spit (from Cooking area.png)
      drawGandalfCookingArea(ctx, 360, 344, Math.floor(Date.now() / 120), 56, 56);

      // Animated Campfire (from Campfire sheet.png)
      drawGandalfCampfire(ctx, 426, 362, Math.floor(Date.now() / 150), 38, 38);

      // Animated Mystical Portal (from GandalfHardcore Portal sheet.png)
      drawGandalfPortal(ctx, 2260, 328, Math.floor(Date.now() / 120), 72, 72);

      // 9. Angel Statue (from Angel Statue.png)
      drawGandalfAngelStatue(ctx, 840, 336, 64, 64);

      // 10. Garden Stone Water Well (from Garden Decorations.png)
      drawGandalfGardenDecor(ctx, 1100, 336, 'well', 54, 64);

      // 11. Alchemy Station (from Alchemy Decor.png)
      drawGandalfAlchemy(ctx, 1470, 344, 96, 56);

      // 12. Golden Wheat Farm Rows (from Wheat.png) & Scarecrow
      drawGandalfWheat(ctx, 40, 368, 110, 32);
      drawGandalfWheat(ctx, 100, 368, 110, 32);
      ctx.drawImage(scarecrowCanvas, 90, 356, 32, 44);

      // 13. Riverboat (from Boat.png)
      drawGandalfBoat(ctx, 2170, 372, 90, 28);

      // 14. Cemetery with Gravestones
      ctx.drawImage(gravestoneCanvas, 1580, 372, 24, 30);
      ctx.drawImage(gravestoneCanvas, 1610, 370, 24, 30);
      ctx.drawImage(gravestoneCanvas, 1635, 374, 24, 30);

      // 15. Village Crates & Oak Barrels
      ctx.drawImage(crateCanvas, 280, 378, 22, 22);
      ctx.drawImage(crateCanvas, 298, 378, 22, 22);
      ctx.drawImage(barrelCanvas, 345, 376, 20, 24);
      ctx.drawImage(barrelCanvas, 1080, 376, 20, 24);

      // 16. Gandalf Birds Simulation (Flock Soaring & Perched Birds on Roofs/Tents/Trees)
      drawGandalfBirds(ctx, camX, Date.now(), player.x, player.y);

      // C. PLATFORMS & TERRAIN GROUND TILES (Gandalf Floor Tiles1, BG Dirt1, & Other Tiles1)
      platforms.forEach((p) => {
        drawGandalfTerrainPlatform(ctx, p, season);
      });

      // Gandalf Authentic Tall Grass Foliage sprouting along the village ground
      drawGandalfTallGrass(ctx, 320, 400, 0);
      drawGandalfTallGrass(ctx, 520, 400, 1);
      drawGandalfTallGrass(ctx, 800, 400, 2);
      drawGandalfTallGrass(ctx, 1040, 400, 0);
      drawGandalfTallGrass(ctx, 1420, 400, 1);
      drawGandalfTallGrass(ctx, 1750, 400, 2);
      drawGandalfTallGrass(ctx, 2020, 400, 0);

      // D. INTERACTIVE ORE DEPOSITS (Copper, Iron, Gold, Crystal)
      state.ores.forEach((ore) => {
        if (!ore.mined) {
          const oreImg = getOreCanvas(ore.type);
          ctx.drawImage(oreImg, ore.x, ore.y, ore.w, ore.h);

          // Subtle glistening pulse
          const pulse = (Math.sin(Date.now() * 0.005 + ore.id) + 1) * 0.5;
          ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * pulse})`;
          ctx.beginPath();
          ctx.arc(ore.x + ore.w * 0.6, ore.y + ore.h * 0.35, 4, 0, Math.PI * 2);
          ctx.fill();

          // Mini HP indicator if damaged
          if (ore.hp < ore.maxHp) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(ore.x, ore.y - 6, ore.w, 4);
            ctx.fillStyle = '#facc15';
            ctx.fillRect(ore.x, ore.y - 6, ore.w * (ore.hp / ore.maxHp), 4);
          }
        } else {
          // Broken stone rubble
          ctx.fillStyle = '#475569';
          ctx.fillRect(ore.x + 4, ore.y + ore.h - 8, 8, 6);
          ctx.fillRect(ore.x + 14, ore.y + ore.h - 10, 10, 8);
          ctx.fillRect(ore.x + 26, ore.y + ore.h - 6, 6, 4);
        }
      });

      // E. WALL TORCHES (Animated flame flicker)
      // Village Ground Lanterns & Lamp Posts (Warm cozy illumination)
      const lanternXList = [160, 360, 680, 1140, 1370, 1610, 1850];
      lanternXList.forEach((tx) => {
        // Wooden post
        ctx.fillStyle = '#451a03';
        ctx.fillRect(tx, 360, 4, 40);
        // Sconce
        ctx.fillStyle = '#78350f';
        ctx.fillRect(tx - 3, 360, 10, 4);
        // Lantern glass & warm cozy flame
        ctx.fillStyle = 'rgba(254, 240, 138, 0.3)';
        ctx.fillRect(tx - 2, 364, 8, 10);
        const flameOffset = Math.sin(Date.now() * 0.015 + tx) * 1.5;
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(tx + 2, 368 + flameOffset, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(tx + 2, 368 + flameOffset, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // --- 7. COIN PICKUPS ---
      coins.forEach((c) => {
        if (c.collected) return;
        const cy = c.y + Math.sin(c.timer) * 4;
        // Outer gold
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.arc(c.x + 8, cy + 8, 7, 0, Math.PI * 2);
        ctx.fill();
        // Inner sheen
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(c.x + 8, cy + 8, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(c.x + 6.5, cy + 5, 3, 6);
      });

      // --- 8. PLAYER (GandalfHardcore 800x448 Modular Spritesheet Composer - 80x64 Grid) ---
      const pFlicker = player.invulnerableTimer > 0 && Math.floor(player.invulnerableTimer * 15) % 2 === 0;
      if (!pFlicker) {
        const charW = 80 * profile.scale;
        const charH = 64 * profile.scale;
        const drawX = player.x + player.w / 2 - (40 * profile.scale);
        const drawY = player.y + player.h - (64 * profile.scale);

        renderSlicedCharacterFrame(
          ctx,
          profile,
          player.animState,
          player.animFrame,
          drawX,
          drawY,
          charW,
          charH,
          player.facingRight,
          defaultPixelArtSheet
        );
      }

      // --- 10. PARTICLES ---
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      });

      ctx.restore(); // end camera translation

      // --- 11. GOTHIC STONE MAIDEN UI HUD (Exact match to user uploaded bar) ---
      const hpRatio = Math.max(0, Math.min(1, stats.health / stats.maxHealth));
      const stRatio = Math.max(0, Math.min(1, stats.stamina / stats.maxStamina));
      // 12-segment blue bar reflects hero special power / combo meter
      const manaSegments = Math.max(1, Math.min(12, Math.floor((stats.score % 240) / 20) + 3));
      const manaRatio = manaSegments / 12;

      // Draw the gothic maiden HUD at top-left
      drawGothicHud(ctx, 16, 16, 1.15, hpRatio, stRatio, manaRatio, {
        hpText: `${Math.round(stats.health)}`,
        heroName: profile.name,
      });

      // Gold counter top right (gothic stone aesthetic)
      ctx.fillStyle = 'rgba(20, 16, 24, 0.9)';
      ctx.fillRect(W - 130, 16, 114, 42);
      ctx.strokeStyle = '#5f5564';
      ctx.lineWidth = 2;
      ctx.strokeRect(W - 130, 16, 114, 42);
      ctx.strokeStyle = '#2d2630';
      ctx.lineWidth = 1;
      ctx.strokeRect(W - 128, 18, 110, 38);

      // Gold Coin icon
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(W - 108, 37, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = 'bold 14px monospace';
      ctx.fillStyle = '#fef08a';
      ctx.fillText(`${stats.gold} G`, W - 92, 42);

      // Game Over Screen
      if (isGameOver) {
        ctx.fillStyle = 'rgba(15, 10, 20, 0.85)';
        ctx.fillRect(0, 0, W, H);

        ctx.font = '900 36px Cinzel, serif';
        ctx.fillStyle = '#ef4444';
        ctx.textAlign = 'center';
        ctx.fillText('YOU DIED IN BATTLE', W / 2, H / 2 - 20);

        ctx.font = '16px Plus Jakarta Sans, sans-serif';
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText('The medieval dungeon claimed your soul.', W / 2, H / 2 + 20);
        ctx.fillText('Click [Restart Stage] below to rise again.', W / 2, H / 2 + 50);
        ctx.textAlign = 'left';
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [profile, isGameOver, stats.stamina, stats.health, stats.maxHealth, stats.maxStamina, stats.gold, stats.score]);

  return (
    <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="relative bg-stone-950 w-full h-full max-w-[960px] max-h-[540px] aspect-video shadow-2xl"
      >
        <canvas
          id="game-canvas"
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain cursor-crosshair block image-pixelated"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* On-screen quick attack/jump action overlay for mouse/touch */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
          <button
            id="btn-onscreen-attack"
            onClick={triggerAttack}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-600/90 hover:bg-amber-500 text-white rounded-lg shadow-lg font-bold text-xs uppercase tracking-wider backdrop-blur active:scale-95 border border-amber-400/40"
          >
            <Sword className="w-4 h-4" />
            <span>Tebas (J)</span>
          </button>
          <button
            id="btn-onscreen-jump"
            onClick={triggerJump}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600/90 hover:bg-emerald-500 text-white rounded-lg shadow-lg font-bold text-xs uppercase tracking-wider backdrop-blur active:scale-95 border border-emerald-400/40"
          >
            <span>Lompat (Space)</span>
          </button>
        </div>

        {/* Restart button if dead */}
        {isGameOver && (
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-auto">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-lg shadow-xl font-bold tracking-wide text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Stage</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
