import { GAME_W, WORLD_LENGTH } from '../game/constants';
import type { CountryCode } from '../game/constants';
import type { LandmarkKind } from '../game/landmarks';

// The world scrolls downward past the player. worldY=0 is Kuwait (start),
// worldY=WORLD_LENGTH is Muscat (end).
// At any worldY the corridor has a centerX and halfWidth (usable water).
// Outside the corridor is land (left or right bank).

export interface CorridorSample {
  centerX: number;
  halfWidth: number;
  leftCountry: CountryCode;
  rightCountry: CountryCode;
  /** 0..1 overall progress */
  progress: number;
}

/** Waypoints (worldY, centerX, halfWidth). Linear-interpolated between. */
interface WP { y: number; cx: number; hw: number; lc: CountryCode; rc: CountryCode }

// X = horizontal channel center (GAME_W = 480 so center=240).
// Geography: from player (flying SE) Arab peninsula is on the RIGHT, Iran on the LEFT.
// Corridor is narrowed so the coastlines (and landmarks) have more room.
const WAYPOINTS: WP[] = [
  // --- STAGE 1: Kuwait → Qatar (y 0..6000) ---
  { y:     0, cx: 240, hw: 120, lc: 'IR', rc: 'KW' }, // Kuwait port (wide)
  { y:   400, cx: 245, hw: 105, lc: 'IR', rc: 'SA' }, // leaving Kuwait
  { y:  1400, cx: 255, hw: 100, lc: 'IR', rc: 'SA' }, // Dhahran coast (Saudi)
  { y:  2800, cx: 240, hw:  95, lc: 'IR', rc: 'SA' }, // near King Fahd Causeway
  { y:  3600, cx: 245, hw:  90, lc: 'IR', rc: 'BH' }, // Bahrain section
  { y:  4600, cx: 245, hw:  95, lc: 'IR', rc: 'BH' }, //
  { y:  5400, cx: 235, hw:  90, lc: 'IR', rc: 'QA' }, // entering Qatar
  { y:  6000, cx: 225, hw:  90, lc: 'IR', rc: 'QA' }, // Doha

  // --- STAGE 2: Qatar → Dubai (y 6000..12000) ---
  // After Qatar, corridor drifts LEFT (toward Iran) so the Arab coast (right bank) widens for landmarks.
  { y:  6400, cx: 220, hw:  90, lc: 'IR', rc: 'QA' },
  { y:  7200, cx: 200, hw:  90, lc: 'IR', rc: 'AE' }, // UAE coast begins
  { y:  8200, cx: 190, hw:  90, lc: 'IR', rc: 'AE' }, // Abu Dhabi approach
  { y:  9000, cx: 195, hw:  95, lc: 'IR', rc: 'AE' }, // Abu Dhabi
  { y: 10000, cx: 205, hw:  95, lc: 'IR', rc: 'AE' }, //
  { y: 11000, cx: 215, hw:  95, lc: 'IR', rc: 'AE' }, // approaching Dubai
  { y: 11800, cx: 220, hw:  95, lc: 'IR', rc: 'AE' }, // Dubai

  // --- STAGE 3: Dubai → Muscat (y 12000..18000) ---
  // past Dubai, corridor bends RIGHT toward Strait of Hormuz and narrows
  { y: 12400, cx: 235, hw:  90, lc: 'IR', rc: 'AE' },
  { y: 13200, cx: 260, hw:  80, lc: 'IR', rc: 'AE' },
  { y: 14000, cx: 290, hw:  65, lc: 'IR', rc: 'AE' }, // entering Hormuz
  { y: 14600, cx: 305, hw:  50, lc: 'IR', rc: 'OM' }, // Strait (tight)
  { y: 15000, cx: 300, hw:  42, lc: 'IR', rc: 'OM' }, // tightest point
  { y: 15400, cx: 285, hw:  55, lc: 'IR', rc: 'OM' }, // exiting Hormuz
  { y: 16000, cx: 260, hw:  80, lc: 'IR', rc: 'OM' }, // Gulf of Oman
  { y: 16800, cx: 240, hw:  95, lc: 'IR', rc: 'OM' },
  { y: 17400, cx: 235, hw:  90, lc: 'IR', rc: 'OM' }, // approaching Muscat
  { y: 18000, cx: 240, hw:  85, lc: 'IR', rc: 'OM' }, // Muscat port
];

/**
 * Deterministic small-scale coastline irregularity in pixels.
 * Positive values push the shore TOWARD the water (headland/peninsula),
 * negative values pull it AWAY from the water (bay/inlet).
 * Kept subtle — the Persian Gulf coast is low-relief sabkha, not a fjord.
 */
export function coastOffset(worldY: number, side: -1 | 1): number {
  // Different frequencies & phases per bank so the two coasts don't mirror.
  const phase = side === -1 ? 0 : 1.7;
  const slow = Math.sin(worldY * 0.0035 + phase) * 7;     // broad bays ~1800px
  const mid  = Math.sin(worldY * 0.011  + phase * 2) * 4; // headlands ~570px
  const fine = Math.sin(worldY * 0.028  + phase * 3) * 2; // small crenellations
  return slow + mid + fine;
}

export function sampleCorridor(worldY: number): CorridorSample {
  const y = Math.max(0, Math.min(WORLD_LENGTH, worldY));
  let a = WAYPOINTS[0];
  let b = WAYPOINTS[WAYPOINTS.length - 1];
  for (let i = 0; i < WAYPOINTS.length - 1; i++) {
    if (y >= WAYPOINTS[i].y && y <= WAYPOINTS[i + 1].y) {
      a = WAYPOINTS[i];
      b = WAYPOINTS[i + 1];
      break;
    }
  }
  const t = b.y === a.y ? 0 : (y - a.y) / (b.y - a.y);
  return {
    centerX: a.cx + (b.cx - a.cx) * t,
    halfWidth: a.hw + (b.hw - a.hw) * t,
    leftCountry: t < 0.5 ? a.lc : b.lc,
    rightCountry: t < 0.5 ? a.rc : b.rc,
    progress: y / WORLD_LENGTH,
  };
}

/** Country band boundaries. Arab peninsula is on the RIGHT bank, Iran on the LEFT. */
export interface CountryBand {
  startY: number;
  endY: number;
  country: CountryCode;
}
export const RIGHT_BANK_BANDS: CountryBand[] = [
  { startY:     0, endY:   400, country: 'KW' },
  { startY:   400, endY:  3200, country: 'SA' },
  { startY:  3200, endY:  4900, country: 'BH' },
  { startY:  4900, endY:  6800, country: 'QA' },
  { startY:  6800, endY: 14400, country: 'AE' },
  { startY: 14400, endY: 18000, country: 'OM' },
];
export const LEFT_BANK_BAND: CountryBand = { startY: 0, endY: 18000, country: 'IR' };

/** Landmark placements. side: -1 = left bank, +1 = right bank, 0 = in water (island/floating). */
export interface LandmarkPlacement {
  kind: LandmarkKind;
  worldY: number;
  side: -1 | 0 | 1;
  /** Offset from the bank edge (pixels, toward inland). Only for side=-1/+1. */
  offset?: number;
  /** Offset from channel center for side=0 (water islands). */
  waterX?: number;
}

export const LANDMARK_PLACEMENTS: LandmarkPlacement[] = [
  // Stage 1 — Kuwait → Qatar
  { kind: 'kuwait_port',        worldY:   200, side: 1, offset: 4 },
  { kind: 'kuwait_towers',      worldY:   600, side: 1, offset: 8 },
  { kind: 'al_hamra',           worldY:   900, side: 1, offset: 12 },
  { kind: 'dhahran_refinery',   worldY:  1800, side: 1, offset: 6 },
  { kind: 'king_fahd_causeway', worldY:  2800, side: 0, waterX: 0 }, // spans channel
  { kind: 'bahrain_wtc',        worldY:  3700, side: 1, offset: 10 },
  { kind: 'mina_salman_port',   worldY:  4300, side: 1, offset: 6 },
  { kind: 'ras_laffan',         worldY:  5300, side: 1, offset: 6 },
  { kind: 'museum_islamic_art', worldY:  5900, side: 1, offset: 10 },
  { kind: 'pearl_qatar',        worldY:  5700, side: 0, waterX: 40 },
  { kind: 'doha_skyline',       worldY:  6000, side: 1, offset: 8 },

  // Stage 2 — Qatar → Dubai
  { kind: 'sir_bani_yas',       worldY:  7600, side: 0, waterX: 40 },
  { kind: 'sheikh_zayed_mosque',worldY:  8500, side: 1, offset: 10 },
  { kind: 'louvre_ad',          worldY:  8900, side: 1, offset: 6 },
  { kind: 'ferrari_world',      worldY:  9300, side: 1, offset: 8 },
  { kind: 'emirates_palace',    worldY:  9700, side: 1, offset: 6 },
  { kind: 'etihad_towers',      worldY: 10100, side: 1, offset: 8 },
  // Dubai cluster ~11200-11900
  { kind: 'palm_jumeirah',      worldY: 11300, side: 0, waterX: 55 },  // trunk touches Dubai coast
{ kind: 'burj_al_arab',       worldY: 11550, side: 1, offset: 18 },
  { kind: 'burj_khalifa',       worldY: 11750, side: 1, offset: 24 },
  { kind: 'dubai_marina',       worldY: 11900, side: 1, offset: 12 },

  // Stage 3 — Dubai → Muscat
  { kind: 'musandam_cliffs',    worldY: 14600, side: 1, offset: 4 },
  { kind: 'mutrah_corniche',    worldY: 17200, side: 1, offset: 6 },
  { kind: 'al_jalali_fort',     worldY: 17500, side: 1, offset: 10 },
  { kind: 'sultan_qaboos_mosque', worldY: 17700, side: 1, offset: 8 },
  { kind: 'muscat_opera',       worldY: 17850, side: 1, offset: 6 },
  { kind: 'muscat_port',        worldY: 17960, side: 1, offset: 4 },
];

/** Stage boundaries. */
export interface StageDef {
  index: number;
  name: string;
  startY: number;
  endY: number;
  banner: string;
}
export const STAGES: StageDef[] = [
  { index: 0, name: 'KUWAIT → QATAR',   startY:     0, endY:  6000, banner: 'STAGE 1\nKUWAIT → QATAR' },
  { index: 1, name: 'QATAR → DUBAI',    startY:  6000, endY: 12000, banner: 'STAGE 2\nQATAR → DUBAI' },
  { index: 2, name: 'DUBAI → MUSCAT',   startY: 12000, endY: 18000, banner: 'STAGE 3\nDUBAI → MUSCAT\nNAVIGATE THE STRAIT OF HORMUZ' },
];

export function stageForY(worldY: number): StageDef {
  for (const s of STAGES) if (worldY >= s.startY && worldY < s.endY) return s;
  return STAGES[STAGES.length - 1];
}

// sanity
void GAME_W;
