import * as Phaser from 'phaser';

// Each landmark draws itself into a Graphics at origin (0,0) = top-left of its footprint.
// Returns a container positioned at world (x, y) anchored at center-bottom of the landmark.
// side: 'left' | 'right' | 'water'  (water = island / floating)

export type LandmarkKind =
  | 'burj_khalifa'
  | 'palm_jumeirah'
  | 'burj_al_arab'
  | 'dubai_marina'

  | 'sheikh_zayed_mosque'
  | 'louvre_ad'
  | 'ferrari_world'
  | 'emirates_palace'
  | 'etihad_towers'
  | 'doha_skyline'
  | 'pearl_qatar'
  | 'museum_islamic_art'
  | 'bahrain_wtc'
  | 'kuwait_towers'
  | 'al_hamra'
  | 'kuwait_port'
  | 'dhahran_refinery'
  | 'king_fahd_causeway'
  | 'mina_salman_port'
  | 'ras_laffan'
  | 'sir_bani_yas'
  | 'musandam_cliffs'
  | 'muscat_port'
  | 'sultan_qaboos_mosque'
  | 'mutrah_corniche'
  | 'al_jalali_fort'
  | 'muscat_opera';

export interface LandmarkDef {
  kind: LandmarkKind;
  name: string;
  hint?: string; // tourist popup secondary text
  w: number;
  h: number;
  /** Optional per-landmark size multiplier on top of global LANDMARK_SCALE. */
  scale?: number;
  /** Optional rotation in radians (Phaser convention: positive = clockwise). */
  rotation?: number;
  draw: (g: Phaser.GameObjects.Graphics) => void;
}

// helper: pixel rect
const r = (g: Phaser.GameObjects.Graphics, c: number, x: number, y: number, w: number, h: number) => {
  g.fillStyle(c);
  g.fillRect(x, y, w, h);
};

export const LANDMARKS: Record<LandmarkKind, LandmarkDef> = {
  kuwait_towers: {
    kind: 'kuwait_towers',
    name: 'KUWAIT TOWERS',
    hint: 'Iconic spheres over Kuwait Bay',
    w: 30, h: 70,
    draw: (g) => {
      const shaft = 0xdbe4ee;
      const shaftD = 0x9aa8b4;
      const shaftL = 0xf2f6fa;
      const sphere = 0x2f7a7d;
      const sphereM = 0x4ba0a3;
      const sphereL = 0x7cc8ca;
      const sphereD = 0x1c5558;
      // plaza base
      r(g, 0x6a6a6a, 0, 66, 30, 4);
      r(g, 0x8a8a8a, 0, 66, 30, 1);
      r(g, 0x4a8dc6, 1, 69, 28, 1);
      // Main tower (center, 2 spheres, tallest)
      r(g, shaftD, 12, 20, 1, 46);
      r(g, shaft, 13, 20, 3, 46);
      r(g, shaftL, 15, 20, 1, 46);
      // lower big sphere (water reservoir + restaurant)
      r(g, sphereD, 8, 32, 12, 10);
      r(g, sphere, 9, 32, 11, 10);
      r(g, sphereM, 9, 33, 10, 2);
      r(g, sphereL, 10, 33, 4, 1);
      r(g, sphereD, 9, 30, 10, 2);
      r(g, sphere, 10, 30, 8, 2);
      r(g, sphereD, 10, 41, 8, 1);
      r(g, sphereM, 11, 42, 6, 1);
      r(g, sphereD, 9, 36, 11, 1); // tile band
      // upper small sphere (revolving observatory)
      r(g, sphereD, 11, 22, 6, 5);
      r(g, sphere, 12, 22, 5, 5);
      r(g, sphereL, 12, 23, 2, 1);
      r(g, sphereD, 12, 20, 4, 2);
      r(g, sphere, 12, 20, 4, 1);
      // spire with aviation warning lights
      r(g, 0x1a1a1a, 13, 10, 2, 10);
      r(g, 0xff4a4a, 13, 10, 2, 1);
      r(g, 0xff4a4a, 13, 15, 2, 1);
      // Second tower (1 sphere, medium height)
      r(g, shaftD, 22, 30, 1, 36);
      r(g, shaft, 23, 30, 2, 36);
      r(g, shaftL, 24, 30, 1, 36);
      r(g, sphereD, 20, 40, 8, 7);
      r(g, sphere, 21, 40, 7, 7);
      r(g, sphereM, 21, 41, 6, 2);
      r(g, sphereL, 22, 41, 2, 1);
      r(g, sphereD, 21, 38, 6, 2);
      r(g, sphere, 22, 38, 5, 2);
      r(g, sphereD, 21, 46, 6, 1);
      // Third plain needle (shortest, no sphere)
      r(g, shaftD, 3, 36, 1, 30);
      r(g, shaft, 4, 36, 2, 30);
      r(g, shaftL, 5, 36, 1, 30);
      r(g, 0x1a1a1a, 4, 28, 1, 8);
      r(g, 0x00732f, 5, 30, 3, 2); // Kuwait flag green
      // base lights
      r(g, 0xffe680, 4, 65, 1, 1);
      r(g, 0xffe680, 15, 65, 1, 1);
      r(g, 0xffe680, 23, 65, 1, 1);
    },
  },
  al_hamra: {
    kind: 'al_hamra',
    name: 'AL HAMRA TOWER',
    hint: 'Kuwait\'s twisted limestone skyscraper',
    w: 22, h: 80,
    draw: (g) => {
      const stone = 0xd8c8a8;
      const stoneL = 0xeddcb8;
      const stoneD = 0x9a8664;
      const stoneDD = 0x6a5a3a;
      const glass = 0x3a5a7a;
      const glassL = 0x7ab0d4;
      // plaza
      r(g, 0x6a6a6a, 0, 76, 22, 4);
      r(g, 0x8a8a8a, 0, 76, 22, 1);
      // Al Hamra has a signature spiraling cut — the east face slopes inward
      // sweeping from top-left to bottom-right. Render as varying left edge.
      for (let y = 4; y < 76; y++) {
        const t = (y - 4) / 72;
        // left edge recedes as we go up (the south/west cut)
        const lx = 2 + t * 7;
        const rx = 18;
        r(g, stoneDD, lx, y, 1, 1);
        r(g, stoneD, lx + 1, y, 1, 1);
        r(g, stone, lx + 2, y, rx - lx - 3, 1);
        r(g, stoneL, rx - 1, y, 1, 1);
        r(g, stoneD, rx, y, 1, 1);
      }
      // glass facade on east side (right) — vertical highlight column
      r(g, glassL, 17, 4, 1, 72);
      r(g, glass, 16, 4, 1, 72);
      // horizontal floor bands
      for (let y = 8; y < 76; y += 4) {
        r(g, stoneD, 2, y, 16, 1);
      }
      // lit windows (staggered)
      for (let y = 10; y < 74; y += 3) {
        const t = (y - 4) / 72;
        const lx = 2 + t * 7;
        const seed = (y * 11) % 9;
        r(g, seed < 5 ? 0xffe680 : glass, Math.floor(lx) + 3, y, 1, 1);
        r(g, seed < 6 ? 0xffe680 : glass, 12, y, 1, 1);
        r(g, seed < 4 ? 0xffe680 : glass, 15, y, 1, 1);
      }
      // crown — the distinctive tapered peak
      r(g, stoneDD, 9, 0, 1, 4);
      r(g, stone, 10, 0, 2, 4);
      r(g, stoneL, 10, 0, 1, 4);
      // antenna
      r(g, 0x1a1a1a, 10, -4, 1, 4);
      r(g, 0xff4a4a, 10, -4, 1, 1);
      // base podium
      r(g, stoneDD, 0, 70, 22, 6);
      r(g, stone, 1, 70, 21, 5);
      r(g, stoneL, 1, 70, 21, 1);
      for (let wx = 3; wx < 20; wx += 3) r(g, 0xffe680, wx, 73, 1, 1);
    },
  },
  kuwait_port: {
    kind: 'kuwait_port',
    name: 'PORT OF KUWAIT',
    hint: 'Shuwaikh — the busiest Kuwaiti terminal',
    w: 60, h: 30,
    draw: (g) => {
      // water lap
      r(g, 0x4a8dc6, 0, 28, 60, 2);
      r(g, 0x6aa5e0, 10, 28, 5, 1);
      r(g, 0x6aa5e0, 32, 28, 6, 1);
      // concrete dock
      r(g, 0x5a5a5a, 0, 22, 60, 6);
      r(g, 0x7a7a7a, 0, 22, 60, 1);
      r(g, 0x3a3a3a, 0, 27, 60, 1);
      // mooring bollards
      for (let x = 2; x < 60; x += 6) r(g, 0x1a1a1a, x, 21, 1, 1);
      // gantry cranes (ship-to-shore, orange-red)
      const crane = (bx: number) => {
        // legs
        r(g, 0xd65a3a, bx, 6, 1, 16);
        r(g, 0xa84a2a, bx, 6, 1, 16);
        r(g, 0xd65a3a, bx + 7, 6, 1, 16);
        // cross brace (A-frame)
        r(g, 0xd65a3a, bx, 12, 8, 1);
        for (let k = 0; k < 7; k++) r(g, 0x8a3a1a, bx + k, 14 - Math.abs(k - 3), 1, 1);
        // top beam
        r(g, 0xd65a3a, bx - 1, 4, 10, 2);
        r(g, 0xe8a084, bx - 1, 4, 10, 1);
        // boom extensions
        r(g, 0xd65a3a, bx - 6, 4, 6, 1);
        r(g, 0xd65a3a, bx + 8, 4, 4, 1);
        // trolley cab
        r(g, 0x1a1a1a, bx + 3, 6, 1, 3);
        r(g, 0xffe680, bx + 2, 4, 4, 1);
      };
      crane(8);
      crane(26);
      crane(44);
      // Stacked containers (2 rows)
      const cont: [number, number, number, number][] = [
        [2, 18, 6, 4], [9, 18, 6, 4], [16, 18, 6, 4], [23, 18, 6, 4],
        [30, 18, 6, 4], [37, 18, 6, 4], [44, 18, 6, 4], [51, 18, 7, 4],
        [4, 14, 6, 4], [12, 14, 6, 4], [20, 14, 6, 4], [29, 14, 6, 4],
        [39, 14, 6, 4], [48, 14, 6, 4],
      ];
      const colors = [0xcc5a3a, 0x3a8ccc, 0x3acc7a, 0xccc43a, 0x8a6aaa, 0xd68a3a];
      for (let i = 0; i < cont.length; i++) {
        const [x, y, w, h] = cont[i];
        const c = colors[i % colors.length];
        r(g, c, x, y, w, h);
        r(g, 0x1a1a1a, x, y + h - 1, w, 1);
        r(g, 0xffffff, x + 1, y + 1, 1, 1);
      }
      // docked cargo ship (right side)
      r(g, 0x1a2a3a, 40, 24, 20, 3);
      r(g, 0x2a3a4a, 40, 24, 20, 1);
      r(g, 0xe8e8e8, 54, 20, 3, 4);
      r(g, 0x3a5a7a, 55, 21, 1, 1);
      r(g, 0xd6443a, 54, 19, 3, 1);
      // Kuwait flag
      r(g, 0x1a1a1a, 30, 1, 1, 8);
      r(g, 0x007a3d, 31, 1, 4, 1);
      r(g, 0xffffff, 31, 2, 4, 1);
      r(g, 0xce1126, 31, 3, 4, 1);
    },
  },
  dhahran_refinery: {
    kind: 'dhahran_refinery',
    name: 'DHAHRAN REFINERY',
    hint: 'Saudi Aramco flagship complex',
    w: 70, h: 40,
    draw: (g) => {
      const tank = 0xc4c4b0;
      const tankL = 0xe4e4cc;
      const tankD = 0x8a8a7a;
      const tankDD = 0x5a5a4a;
      const pipe = 0x7a7a6a;
      const pipeD = 0x4a4a3a;
      // ground
      r(g, 0x6a5a3a, 0, 36, 70, 4);
      r(g, 0x8a7a4a, 0, 36, 70, 1);
      // Horton sphere tank (LPG)
      r(g, tankD, 2, 22, 14, 14);
      r(g, tank, 3, 22, 12, 14);
      r(g, tankL, 4, 23, 6, 2);
      r(g, tankD, 3, 20, 12, 3);
      r(g, tank, 4, 20, 10, 3);
      r(g, tankD, 3, 35, 12, 1);
      r(g, tankDD, 3, 35, 1, 2);
      r(g, tankDD, 13, 35, 1, 2);
      // mid cylindrical floating-roof tank
      r(g, tankD, 18, 18, 14, 18);
      r(g, tank, 19, 18, 13, 18);
      r(g, tankL, 20, 19, 1, 16);
      r(g, tankD, 19, 18, 13, 1);
      r(g, tankDD, 19, 35, 13, 1);
      r(g, tankDD, 19, 24, 13, 1); // roof seam
      // tall storage tank
      r(g, tankD, 34, 14, 12, 22);
      r(g, tank, 35, 14, 11, 22);
      r(g, tankL, 36, 15, 1, 20);
      r(g, tankDD, 34, 14, 12, 1);
      r(g, tankD, 35, 16, 11, 1);
      // Aramco logo (green band)
      r(g, 0x006c35, 36, 26, 9, 2);
      r(g, 0x008c45, 36, 26, 9, 1);
      // smaller tank
      r(g, tankD, 48, 26, 8, 10);
      r(g, tank, 49, 26, 7, 10);
      r(g, tankL, 50, 27, 1, 8);
      // flare stack with flame
      r(g, 0xb0a090, 58, 4, 3, 32);
      r(g, 0x8a7a6a, 58, 4, 1, 32);
      r(g, 0x6a5a4a, 60, 4, 1, 32);
      r(g, 0xff9a2e, 56, 0, 6, 4);
      r(g, 0xffcc33, 57, 0, 4, 3);
      r(g, 0xffe680, 58, 0, 2, 2);
      // twin smoke stacks
      r(g, 0x9a9a8a, 64, 8, 3, 28);
      r(g, 0x7a7a6a, 64, 8, 1, 28);
      r(g, 0xff6a2e, 64, 8, 3, 1);
      r(g, 0xaaaaaa, 65, 4, 1, 4); // smoke
      r(g, 0xcccccc, 65, 2, 2, 2);
      // pipe rack
      r(g, pipeD, 0, 12, 56, 1);
      r(g, pipe, 0, 13, 56, 1);
      r(g, pipeD, 0, 30, 56, 1);
      r(g, pipe, 0, 31, 56, 1);
      // pipe rack supports
      for (let x = 6; x < 56; x += 12) r(g, pipeD, x, 12, 1, 18);
      // valves/manifolds
      r(g, 0xff4a4a, 12, 11, 1, 2);
      r(g, 0xff4a4a, 30, 11, 1, 2);
      r(g, 0xffe680, 46, 11, 1, 2);
      // base perimeter lights
      for (let x = 4; x < 68; x += 6) r(g, 0xffe680, x, 38, 1, 1);
    },
  },
  king_fahd_causeway: {
    kind: 'king_fahd_causeway',
    name: 'KING FAHD CAUSEWAY',
    hint: 'Saudi Arabia ↔ Bahrain bridge',
    w: 140, h: 20,
    draw: (g) => {
      const deck = 0x4a4a4a;
      const deckL = 0x6a6a6a;
      const pylon = 0xe8e8e8;
      const pylonD = 0x8a8a8a;
      // water below
      r(g, 0x0a3d66, 0, 16, 140, 4);
      r(g, 0x1a5d86, 0, 16, 140, 1);
      for (let x = 4; x < 140; x += 7) r(g, 0x4a8dc6, x, 17, 2, 1);
      // main deck
      r(g, deck, 0, 10, 140, 3);
      r(g, deckL, 0, 10, 140, 1);
      r(g, 0x3a3a3a, 0, 12, 140, 1);
      // lane markings
      for (let x = 2; x < 140; x += 4) r(g, 0xe0d8a0, x, 11, 2, 1);
      // underside shading
      r(g, 0x2a2a2a, 0, 13, 140, 1);
      // piers under deck
      for (let x = 6; x < 140; x += 10) r(g, pylonD, x, 13, 2, 3);
      // central cable-stayed pylon (at border island)
      const pylonX = 66;
      r(g, pylonD, pylonX, 0, 1, 13);
      r(g, pylon, pylonX + 1, 0, 3, 13);
      r(g, 0xffffff, pylonX + 2, 0, 1, 13);
      r(g, pylonD, pylonX + 4, 0, 1, 13);
      r(g, 0xff4a4a, pylonX + 1, 0, 3, 1);
      r(g, 0xff4a4a, pylonX + 1, 4, 3, 1);
      // cable stays (dotted)
      for (let k = 0; k < 8; k++) {
        const anchor = pylonX + 2;
        const dx = (k - 4) * 7;
        const steps = 6;
        for (let s = 1; s < steps; s++) {
          const px = anchor + dx * (s / steps);
          const py = 2 + 8 * (s / steps);
          r(g, 0xcccccc, Math.round(px), Math.round(py), 1, 1);
        }
      }
      // end abutments (SA side + BH side)
      r(g, 0x8a8a8a, 0, 6, 5, 10);
      r(g, 0xaaaaaa, 0, 6, 5, 1);
      r(g, 0x5a5a5a, 0, 15, 5, 1);
      r(g, 0xff4a4a, 1, 4, 1, 2);
      r(g, 0x006c35, 1, 7, 3, 2); // SA green
      r(g, 0x8a8a8a, 135, 6, 5, 10);
      r(g, 0xaaaaaa, 135, 6, 5, 1);
      r(g, 0x5a5a5a, 135, 15, 5, 1);
      r(g, 0xff4a4a, 137, 4, 1, 2);
      r(g, 0xce1126, 136, 7, 3, 2); // BH red
      // border island restaurant tower at center
      r(g, 0xe8ddc0, 62, 7, 3, 6);
      r(g, 0xb8a078, 62, 7, 3, 1);
      r(g, 0xffe680, 63, 9, 1, 1);
      // guard rails
      r(g, 0xcccccc, 0, 9, 140, 1);
      // tiny cars traveling both directions
      const carColors = [0xd6443a, 0x3a8ccc, 0xe8c86a, 0xf4ecd4, 0x3acc7a, 0xa84a3a];
      for (let i = 0; i < 14; i++) {
        const x = 8 + i * 9 + (i % 3);
        if (x > 60 && x < 72) continue;
        const c = carColors[i % carColors.length];
        r(g, c, x, 10, 2, 1);
      }
    },
  },
  bahrain_wtc: {
    kind: 'bahrain_wtc',
    name: 'BAHRAIN WORLD TRADE CENTER',
    hint: 'Twin sails with wind turbines',
    w: 36, h: 70,
    draw: (g) => {
      const glass = 0x3a5a7a;
      const glassL = 0x6aa5d0;
      const glassD = 0x1a3a5a;
      const frame = 0xcfd8e3;
      const frameD = 0x8a9ab0;
      // Moda Mall podium at base
      r(g, 0x7a7a7a, 0, 60, 36, 10);
      r(g, 0x9a9a9a, 0, 60, 36, 1);
      r(g, 0x5a5a5a, 0, 68, 36, 2);
      for (let x = 2; x < 34; x += 3) r(g, 0xffe680, x, 63, 1, 2);
      // Left sail tower — concave inner edge
      for (let y = 2; y < 60; y++) {
        const t = (y - 2) / 58;
        const ox = 1 + Math.sin(t * Math.PI) * 1;
        const ix = 13 - Math.sin(t * Math.PI) * 2;
        r(g, glassD, ox, y, 1, 1);
        r(g, glass, ox + 1, y, ix - ox - 2, 1);
        r(g, glassL, ix - 1, y, 1, 1);
        r(g, frameD, ix, y, 1, 1);
      }
      // Right sail tower — mirror
      for (let y = 2; y < 60; y++) {
        const t = (y - 2) / 58;
        const ox = 35 - Math.sin(t * Math.PI) * 1;
        const ix = 23 + Math.sin(t * Math.PI) * 2;
        r(g, glassD, ix, y, 1, 1);
        r(g, glass, ix + 1, y, ox - ix - 2, 1);
        r(g, glassL, ox - 1, y, 1, 1);
        r(g, frameD, ox, y, 1, 1);
      }
      // horizontal floor bands
      for (let y = 6; y < 58; y += 4) {
        r(g, glassD, 1, y, 12, 1);
        r(g, glassD, 23, y, 12, 1);
      }
      // lit window grid
      for (let y = 8; y < 58; y += 3) {
        const seed = (y * 5) % 7;
        r(g, seed < 4 ? 0xffe680 : glass, 5, y, 1, 1);
        r(g, seed < 5 ? 0xffe680 : glass, 9, y, 1, 1);
        r(g, seed < 3 ? 0xffe680 : glass, 27, y, 1, 1);
        r(g, seed < 4 ? 0xffe680 : glass, 31, y, 1, 1);
      }
      // 3 skybridges with wind turbines (signature feature)
      const bridgeYs = [14, 30, 46];
      for (const y of bridgeYs) {
        r(g, frameD, 13, y, 10, 2);
        r(g, frame, 13, y, 10, 1);
        r(g, 0x1a1a1a, 13, y + 2, 10, 1);
        // nacelle
        r(g, 0x3a3a3a, 17, y - 1, 2, 1);
        r(g, frame, 17, y, 2, 1);
        // 3 blades radiating
        r(g, 0xcfd8e3, 13, y - 1, 3, 1);
        r(g, 0xcfd8e3, 20, y - 1, 3, 1);
        r(g, 0xcfd8e3, 17, y - 4, 1, 3);
        r(g, 0xffffff, 17, y - 4, 1, 1);
      }
      // crown tapering
      r(g, frameD, 5, 2, 1, 4);
      r(g, frame, 6, 2, 2, 4);
      r(g, frameD, 28, 2, 1, 4);
      r(g, frame, 29, 2, 2, 4);
      // antennas
      r(g, 0x1a1a1a, 6, 0, 1, 2);
      r(g, 0x1a1a1a, 29, 0, 1, 2);
      r(g, 0xff4a4a, 6, 0, 1, 1);
      r(g, 0xff4a4a, 29, 0, 1, 1);
    },
  },
  mina_salman_port: {
    kind: 'mina_salman_port',
    name: 'MINA SALMAN PORT',
    hint: 'Bahrain\'s main commercial harbor',
    w: 50, h: 26,
    draw: (g) => {
      // water
      r(g, 0x4a8dc6, 0, 24, 50, 2);
      r(g, 0x6aa5e0, 8, 24, 5, 1);
      r(g, 0x6aa5e0, 28, 24, 6, 1);
      // dock
      r(g, 0x5a5a5a, 0, 18, 50, 6);
      r(g, 0x7a7a7a, 0, 18, 50, 1);
      r(g, 0x3a3a3a, 0, 23, 50, 1);
      for (let x = 2; x < 50; x += 5) r(g, 0x1a1a1a, x, 17, 1, 1);
      // gantry cranes (white+red Bahrain colors)
      const crane = (bx: number) => {
        r(g, 0xe8e8e8, bx, 4, 1, 14);
        r(g, 0xaaaaaa, bx, 4, 1, 14);
        r(g, 0xe8e8e8, bx + 6, 4, 1, 14);
        r(g, 0xe8e8e8, bx, 8, 7, 1);
        r(g, 0xd6443a, bx - 1, 2, 9, 2);
        r(g, 0xffffff, bx - 1, 2, 9, 1);
        r(g, 0x1a1a1a, bx + 3, 4, 1, 3);
        r(g, 0xffe680, bx + 2, 2, 4, 1);
        r(g, 0xd6443a, bx - 4, 2, 4, 1);
        r(g, 0xd6443a, bx + 7, 2, 3, 1);
      };
      crane(6);
      crane(22);
      crane(38);
      // stacked containers
      const cont: [number, number, number, number][] = [
        [1, 14, 5, 4], [7, 14, 5, 4], [13, 14, 5, 4], [19, 14, 5, 4],
        [25, 14, 5, 4], [31, 14, 5, 4], [37, 14, 5, 4], [43, 14, 6, 4],
        [4, 10, 5, 4], [11, 10, 5, 4], [21, 10, 5, 4], [32, 10, 5, 4],
      ];
      const colors = [0xcc5a3a, 0x3a8ccc, 0x3acc7a, 0xccc43a, 0x8a6aaa, 0xd68a3a];
      for (let i = 0; i < cont.length; i++) {
        const [x, y, w, h] = cont[i];
        const c = colors[i % colors.length];
        r(g, c, x, y, w, h);
        r(g, 0x1a1a1a, x, y + h - 1, w, 1);
        r(g, 0xffffff, x + 1, y + 1, 1, 1);
      }
      // docked tanker
      r(g, 0x1a2a3a, 0, 20, 18, 3);
      r(g, 0x2a3a4a, 0, 20, 18, 1);
      r(g, 0xe8e8e8, 12, 16, 3, 4);
      r(g, 0xff4a4a, 13, 17, 1, 1);
      // Bahrain flag
      r(g, 0x1a1a1a, 26, 0, 1, 6);
      r(g, 0xffffff, 27, 0, 2, 2);
      r(g, 0xce1126, 29, 0, 3, 2);
    },
  },
  ras_laffan: {
    kind: 'ras_laffan',
    name: 'RAS LAFFAN LNG',
    hint: 'World\'s largest LNG export hub',
    w: 90, h: 46,
    draw: (g) => {
      // concrete dock platform
      r(g, 0x4a4a4a, 0, 40, 90, 6);
      r(g, 0x6a6a6a, 0, 40, 90, 1);
      for (let x = 4; x < 90; x += 8) r(g, 0x3a3a3a, x, 43, 1, 3);
      // 4 spherical LNG tanks with shading
      for (let i = 0; i < 4; i++) {
        const x = 4 + i * 21;
        // shadow side
        r(g, 0xa8a8a0, x, 22, 16, 18);
        // body
        r(g, 0xd8d8d0, x + 2, 22, 14, 18);
        // upper hemisphere suggestion
        r(g, 0xd8d8d0, x + 3, 18, 12, 4);
        r(g, 0xd8d8d0, x + 5, 16, 8, 2);
        // highlight
        r(g, 0xffffff, x + 4, 20, 2, 4);
        r(g, 0xf0f0e8, x + 4, 26, 1, 8);
        // equator band
        r(g, 0x8a8a80, x + 2, 28, 14, 1);
        // pipe riser to top
        r(g, 0x6a6a5a, x + 9, 12, 2, 6);
        r(g, 0xff6a2e, x + 9, 10, 2, 2);
      }
      // flare stack (right side)
      r(g, 0xb0a090, 84, 2, 3, 38);
      r(g, 0x8a7a6a, 84, 2, 1, 38);
      r(g, 0xff9a2e, 83, 0, 5, 2);
      r(g, 0xffe680, 84, 0, 3, 1);
      // pipe network along base
      r(g, 0x7a7a6a, 0, 36, 84, 1);
      r(g, 0x8a8a7a, 0, 38, 84, 1);
    },
  },
  doha_skyline: {
    kind: 'doha_skyline',
    name: 'DOHA SKYLINE',
    hint: 'West Bay towers',
    w: 92, h: 100,
    draw: (g) => {
      // corniche promenade at base
      r(g, 0x6a6a6a, 0, 96, 92, 4);
      r(g, 0x8a8a8a, 0, 96, 92, 1);
      // reflection band under towers
      r(g, 0x2a3a4a, 0, 94, 92, 2);
      // each tower: [x, topY, w, color, topShape]
      // topShape: 0=flat, 1=angled-right, 2=dome, 3=pyramid, 4=crown, 5=split
      const towers: [number, number, number, number, number][] = [
        [2, 48, 9, 0x3a5070, 0],   // burj doha-like
        [13, 32, 7, 0x4a6080, 1],  // aspire-like
        [22, 52, 10, 0x35506a, 2], // zig zag tower
        [34, 14, 9, 0x2a4060, 5],  // tornado tower (split crown)
        [45, 28, 8, 0x3a5070, 4],  // palm tower
        [55, 20, 10, 0x405a7a, 3], // spiral pyramid
        [67, 38, 7, 0x35506a, 0],  // simple tall
        [76, 30, 11, 0x3a5070, 2], // rounded top
      ];
      for (const [x, topY, w, color, shape] of towers) {
        const h = 96 - topY;
        // shadow column (dark left side)
        r(g, 0x1a2030, x, topY, 2, h);
        // body
        r(g, color, x + 1, topY, w - 1, h);
        // highlight right edge
        r(g, 0x8aa0c0, x + w - 1, topY, 1, h);
        // floor bands every 8
        for (let by = topY + 6; by < topY + h - 4; by += 8) {
          r(g, 0x2a3a50, x + 1, by, w - 2, 1);
        }
        // window grid (3 cols x rows)
        for (let wy = topY + 4; wy < topY + h - 4; wy += 4) {
          const lit1 = ((wy + x) % 9) < 6;
          const lit2 = ((wy + x) % 7) < 5;
          const lit3 = ((wy + x) % 11) < 7;
          r(g, lit1 ? 0xffe680 : 0x3a4a60, x + 2, wy, 1, 1);
          r(g, lit2 ? 0xffe680 : 0x3a4a60, x + Math.floor(w / 2), wy, 1, 1);
          r(g, lit3 ? 0xffe680 : 0x3a4a60, x + w - 3, wy, 1, 1);
        }
        // crown / top shape
        if (shape === 0) {
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 4, 1, 4);
          r(g, 0xff4a4a, x + Math.floor(w / 2), topY - 4, 1, 1);
        } else if (shape === 1) {
          r(g, color, x + 1, topY - 3, w - 1, 3);
          r(g, 0x2a3040, x + 1, topY - 3, 1, 3);
          r(g, 0xff4a4a, x + w - 2, topY - 4, 1, 1);
        } else if (shape === 2) {
          // dome
          r(g, 0xb0b8c0, x + 1, topY - 3, w - 1, 3);
          r(g, 0xd8dde2, x + 2, topY - 5, w - 3, 2);
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 9, 1, 4);
          r(g, 0xff4a4a, x + Math.floor(w / 2), topY - 9, 1, 1);
        } else if (shape === 3) {
          // pyramid steps
          r(g, color, x + 1, topY - 3, w - 1, 3);
          r(g, color, x + 2, topY - 5, w - 3, 2);
          r(g, color, x + 3, topY - 6, w - 5, 1);
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 10, 1, 4);
        } else if (shape === 4) {
          // palm crown spikes
          r(g, color, x + 1, topY - 2, w - 1, 2);
          r(g, 0xe8c86a, x + 1, topY - 4, 1, 2);
          r(g, 0xe8c86a, x + Math.floor(w / 2), topY - 5, 1, 3);
          r(g, 0xe8c86a, x + w - 2, topY - 4, 1, 2);
        } else if (shape === 5) {
          // split spiral crown
          r(g, 0x2a4060, x + 1, topY - 4, 3, 4);
          r(g, 0x2a4060, x + w - 4, topY - 4, 3, 4);
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 8, 1, 4);
          r(g, 0xff4a4a, x + Math.floor(w / 2), topY - 8, 1, 1);
        }
      }
      // flag / antenna light atop tallest
      r(g, 0xff4a4a, 38, 10, 1, 1);
    },
  },
  pearl_qatar: {
    kind: 'pearl_qatar',
    name: 'THE PEARL-QATAR',
    hint: 'Artificial pearl-shaped island',
    w: 70, h: 70,
    draw: (g) => {
      const sand = 0xd8c48a;
      const sandL = 0xe8d8a8;
      const sandD = 0xb8a468;
      // outer rim — teardrop/pearl island shape
      r(g, sandD, 12, 18, 46, 38);
      r(g, sandD, 18, 12, 34, 50);
      r(g, sand, 14, 20, 42, 34);
      r(g, sand, 20, 14, 30, 46);
      r(g, sandL, 16, 22, 38, 30);
      r(g, sandL, 22, 16, 26, 42);
      // inner lagoon (water)
      r(g, 0x0a3d66, 24, 26, 22, 22);
      r(g, 0x1a5d86, 26, 28, 18, 18);
      r(g, 0x4a8dc6, 28, 32, 2, 2);
      r(g, 0x4a8dc6, 38, 36, 2, 2);
      // marina channel out
      r(g, 0x0a3d66, 34, 58, 4, 6);
      // buildings ring around pearl
      const towers: [number, number, number][] = [
        [18, 20, 5], [18, 46, 5], [48, 20, 5], [48, 46, 5],
        [32, 14, 4], [32, 56, 4], [14, 32, 4], [52, 32, 4],
        [24, 18, 3], [42, 18, 3], [24, 48, 3], [42, 48, 3],
      ];
      for (const [x, y, h] of towers) {
        r(g, 0xcfd8e3, x, y - h, 3, h);
        r(g, 0xaac0d6, x, y - h, 1, h);
        r(g, 0xe6eef8, x + 2, y - h, 1, h);
        r(g, 0xffe680, x + 1, y - h + 2, 1, 1);
      }
      // docks / yachts in lagoon
      r(g, 0xe6eef8, 30, 34, 3, 1);
      r(g, 0xe6eef8, 36, 42, 3, 1);
      r(g, 0xe6eef8, 32, 44, 2, 1);
      // palm-lined promenade dots
      for (let a = 0; a < 360; a += 40) {
        const rad = (a * Math.PI) / 180;
        const cx = 35 + Math.cos(rad) * 28;
        const cy = 35 + Math.sin(rad) * 22;
        r(g, 0x3e6b3a, Math.round(cx), Math.round(cy), 1, 1);
      }
    },
  },
  museum_islamic_art: {
    kind: 'museum_islamic_art',
    name: 'MUSEUM OF ISLAMIC ART',
    hint: 'I. M. Pei\'s stacked cube masterpiece',
    w: 40, h: 44,
    draw: (g) => {
      const cream = 0xe8ddc0;
      const creamL = 0xf4ecd4;
      const creamD = 0xc8b488;
      const creamDD = 0x9a8868;
      // platform / plaza base
      r(g, 0x8a8a7a, 0, 40, 40, 4);
      r(g, 0xa8a898, 0, 40, 40, 1);
      // lowest cube (widest)
      r(g, creamDD, 4, 28, 32, 12);
      r(g, cream, 5, 28, 30, 11);
      r(g, creamL, 5, 28, 30, 1);
      r(g, creamD, 34, 29, 1, 10);
      // mid cube
      r(g, creamDD, 9, 18, 22, 10);
      r(g, cream, 10, 18, 20, 9);
      r(g, creamL, 10, 18, 20, 1);
      r(g, creamD, 29, 19, 1, 8);
      // upper cube
      r(g, creamDD, 14, 10, 12, 8);
      r(g, cream, 15, 10, 10, 7);
      r(g, creamL, 15, 10, 10, 1);
      r(g, creamD, 24, 11, 1, 6);
      // crown tower
      r(g, creamDD, 17, 4, 6, 6);
      r(g, cream, 18, 4, 4, 5);
      r(g, creamL, 18, 4, 4, 1);
      // slit windows (signature MIA eye)
      r(g, 0x2a3a5a, 19, 6, 2, 3);
      // ribbon windows on each tier
      for (let i = 0; i < 4; i++) r(g, 0x3a5a7a, 7 + i * 7, 32, 2, 3);
      for (let i = 0; i < 3; i++) r(g, 0x3a5a7a, 12 + i * 6, 22, 2, 2);
      r(g, 0x3a5a7a, 17, 13, 2, 2);
      r(g, 0x3a5a7a, 22, 13, 2, 2);
      // reflecting pool
      r(g, 0x0a3d66, 0, 42, 40, 2);
      r(g, 0x4a8dc6, 4, 42, 2, 1);
      r(g, 0x4a8dc6, 20, 42, 3, 1);
    },
  },
  sir_bani_yas: {
    kind: 'sir_bani_yas',
    name: 'SIR BANI YAS ISLAND',
    hint: 'UAE wildlife reserve',
    w: 60, h: 50,
    draw: (g) => {
      const sand = 0xc9a96a;
      const sandL = 0xe3c78a;
      const sandD = 0x8b7340;
      const green = 0x3e6b3a;
      const greenL = 0x5e8b5a;
      const greenD = 0x2a4a28;
      // island body (rough oval)
      r(g, sandD, 8, 14, 46, 30);
      r(g, sandD, 14, 10, 34, 38);
      r(g, sand, 10, 16, 42, 26);
      r(g, sand, 16, 12, 30, 34);
      r(g, sandL, 12, 18, 38, 22);
      r(g, sandL, 18, 14, 26, 30);
      // beach ring
      r(g, 0xf0e2a8, 10, 16, 42, 1);
      r(g, 0xf0e2a8, 10, 42, 42, 1);
      // central hill
      r(g, sandD, 26, 22, 10, 8);
      r(g, sandL, 28, 22, 6, 2);
      // vegetation patches
      r(g, greenD, 14, 18, 8, 6);
      r(g, green, 15, 18, 6, 5);
      r(g, greenL, 16, 18, 2, 1);
      r(g, greenD, 34, 22, 10, 8);
      r(g, green, 35, 22, 8, 7);
      r(g, greenL, 36, 22, 3, 1);
      r(g, greenD, 22, 32, 12, 8);
      r(g, green, 23, 32, 10, 7);
      r(g, greenL, 24, 32, 4, 1);
      r(g, greenD, 40, 34, 8, 5);
      r(g, green, 41, 34, 6, 4);
      // tiny oryx/buildings specks
      r(g, 0xffffff, 20, 26, 1, 1);
      r(g, 0xffffff, 38, 36, 1, 1);
      r(g, 0x6a4a2a, 30, 20, 2, 2);
      r(g, 0x8b7340, 30, 18, 1, 2);
      // coast water lapping
      r(g, 0x6aa5e0, 4, 44, 52, 1);
      r(g, 0x4a8dc6, 6, 46, 8, 1);
      r(g, 0x4a8dc6, 36, 46, 10, 1);
    },
  },
  sheikh_zayed_mosque: {
    kind: 'sheikh_zayed_mosque',
    name: 'SHEIKH ZAYED GRAND MOSQUE',
    hint: 'Abu Dhabi — 82 domes of white marble',
    w: 96, h: 64,
    draw: (g) => {
      const white = 0xf4f0e4;
      const whiteL = 0xfffcf0;
      const whiteS = 0xd4cebc; // shadow
      const gold = 0xe8c86a;
      const goldD = 0xb8983a;
      const arch = 0x8a7a5a;
      // courtyard / reflecting pool base
      r(g, 0x0a3d66, 0, 60, 96, 4);
      r(g, 0x4a8dc6, 2, 60, 92, 1);
      r(g, 0x6aa5e0, 14, 62, 8, 1);
      r(g, 0x6aa5e0, 42, 62, 10, 1);
      r(g, 0x6aa5e0, 70, 62, 6, 1);
      // platform
      r(g, 0xd4cebc, 4, 56, 88, 4);
      r(g, whiteL, 4, 56, 88, 1);
      // main prayer hall (wide base)
      r(g, whiteS, 14, 34, 68, 22);
      r(g, white, 15, 34, 66, 22);
      r(g, whiteL, 15, 34, 66, 1);
      // second-story band
      r(g, whiteS, 20, 28, 56, 6);
      r(g, white, 20, 28, 56, 5);
      r(g, whiteL, 20, 28, 56, 1);
      // main big central dome (cluster + onion)
      r(g, whiteS, 42, 14, 14, 14);
      r(g, white, 43, 14, 13, 13);
      r(g, whiteL, 43, 14, 13, 1);
      r(g, whiteS, 44, 10, 10, 4);
      r(g, white, 44, 10, 10, 3);
      r(g, whiteS, 46, 6, 6, 4);
      r(g, white, 46, 6, 6, 3);
      r(g, whiteS, 48, 3, 2, 3);
      r(g, white, 48, 3, 2, 3);
      r(g, gold, 48, -1, 2, 4);
      r(g, goldD, 48, 2, 2, 1);
      // star atop
      r(g, gold, 48, -2, 2, 1);
      // two flanking medium domes
      r(g, whiteS, 24, 22, 10, 6);
      r(g, white, 25, 22, 9, 5);
      r(g, whiteS, 26, 19, 6, 3);
      r(g, white, 26, 19, 6, 2);
      r(g, gold, 28, 17, 2, 2);
      r(g, whiteS, 62, 22, 10, 6);
      r(g, white, 63, 22, 9, 5);
      r(g, whiteS, 64, 19, 6, 3);
      r(g, white, 64, 19, 6, 2);
      r(g, gold, 66, 17, 2, 2);
      // small corner domes
      r(g, white, 16, 30, 4, 4);
      r(g, gold, 17, 28, 2, 2);
      r(g, white, 76, 30, 4, 4);
      r(g, gold, 77, 28, 2, 2);
      // 4 minarets (tall, slender, tiered)
      const minaret = (x: number) => {
        // shaft
        r(g, whiteS, x, 8, 4, 50);
        r(g, white, x + 1, 8, 3, 50);
        r(g, whiteL, x + 1, 8, 1, 50);
        // 3 balconies
        r(g, whiteS, x - 1, 24, 6, 2);
        r(g, white, x - 1, 24, 6, 1);
        r(g, whiteS, x - 1, 36, 6, 2);
        r(g, white, x - 1, 36, 6, 1);
        r(g, whiteS, x - 1, 48, 6, 2);
        r(g, white, x - 1, 48, 6, 1);
        // onion top
        r(g, white, x, 4, 4, 4);
        r(g, white, x + 1, 2, 2, 2);
        r(g, gold, x + 1, -2, 2, 4);
        // crescent
        r(g, gold, x + 1, -4, 2, 2);
      };
      minaret(4);
      minaret(88);
      minaret(32);
      minaret(60);
      // arched colonnade along front
      for (let i = 0; i < 9; i++) {
        const ax = 16 + i * 7;
        r(g, arch, ax, 46, 5, 10);
        r(g, white, ax + 1, 48, 3, 8);
        r(g, 0x2a3a4a, ax + 2, 49, 1, 5);
      }
      // calligraphy band
      r(g, gold, 14, 32, 68, 1);
    },
  },
  louvre_ad: {
    kind: 'louvre_ad',
    name: 'LOUVRE ABU DHABI',
    hint: 'Jean Nouvel\'s silver lattice dome',
    w: 64, h: 38,
    draw: (g) => {
      const silver = 0xb0b8c0;
      const silverL = 0xd8dde4;
      const silverD = 0x7a848e;
      const pale = 0xe6ecf0;
      // water around museum
      r(g, 0x0a3d66, 0, 34, 64, 4);
      r(g, 0x4a8dc6, 4, 34, 56, 1);
      r(g, 0x6aa5e0, 8, 35, 4, 1);
      r(g, 0x6aa5e0, 42, 35, 6, 1);
      // base platform / piers
      r(g, 0x5a5a5a, 4, 30, 56, 4);
      r(g, 0x6a6a6a, 4, 30, 56, 1);
      r(g, 0x4a4a4a, 4, 33, 56, 1);
      // white gallery cubes under dome
      r(g, silverD, 12, 22, 10, 8);
      r(g, pale, 13, 22, 9, 7);
      r(g, 0xffffff, 13, 22, 9, 1);
      r(g, silverD, 26, 20, 12, 10);
      r(g, pale, 27, 20, 11, 9);
      r(g, 0xffffff, 27, 20, 11, 1);
      r(g, silverD, 42, 24, 10, 6);
      r(g, pale, 43, 24, 9, 5);
      r(g, 0xffffff, 43, 24, 9, 1);
      // small windows on cubes
      for (let x = 14; x < 20; x += 2) r(g, 0x3a5a7a, x, 26, 1, 2);
      for (let x = 28; x < 36; x += 2) r(g, 0x3a5a7a, x, 24, 1, 2);
      for (let x = 44; x < 50; x += 2) r(g, 0x3a5a7a, x, 26, 1, 2);
      // big flat dome (oval silhouette)
      // outer shadow layer
      r(g, silverD, 6, 18, 52, 6);
      r(g, silverD, 10, 14, 44, 4);
      r(g, silverD, 16, 10, 32, 4);
      r(g, silverD, 22, 8, 20, 2);
      // body
      r(g, silver, 6, 18, 52, 5);
      r(g, silver, 10, 14, 44, 4);
      r(g, silver, 16, 10, 32, 4);
      r(g, silver, 22, 8, 20, 2);
      // highlight crescent
      r(g, silverL, 8, 18, 48, 1);
      r(g, silverL, 12, 14, 40, 1);
      r(g, silverL, 18, 10, 28, 1);
      r(g, silverL, 24, 8, 16, 1);
      // lattice dots (perforated star pattern)
      for (let y = 10; y < 22; y += 2) {
        for (let x = 10; x < 54; x += 3) {
          if (((x + y) % 4) === 0) r(g, 0x3a404a, x, y, 1, 1);
          else if (((x + y) % 6) === 0) r(g, silverD, x, y, 1, 1);
        }
      }
      // light spots leaking through lattice on cubes
      r(g, 0xffe680, 18, 24, 1, 1);
      r(g, 0xffe680, 32, 22, 1, 1);
      r(g, 0xffe680, 46, 26, 1, 1);
      // dome rim
      r(g, 0x5a6470, 6, 22, 52, 1);
      r(g, 0x5a6470, 4, 22, 2, 2);
      r(g, 0x5a6470, 58, 22, 2, 2);
    },
  },
  ferrari_world: {
    kind: 'ferrari_world',
    name: 'FERRARI WORLD',
    hint: 'Yas Island — red roof + prancing horse',
    w: 84, h: 48,
    draw: (g) => {
      const red = 0xd6001c;
      const redL = 0xff4a3a;
      const redD = 0x8a0012;
      const redDD = 0x5a000a;
      // ground — race track loop suggestion
      r(g, 0x2a2a2a, 0, 42, 84, 6);
      r(g, 0xe0d8a0, 2, 44, 80, 1);
      for (let x = 2; x < 84; x += 4) r(g, 0xffffff, x, 45, 2, 1);
      r(g, 0x2a2a2a, 0, 41, 84, 1);
      // massive triangular red roof with triple-peak
      // outer shadow
      r(g, redDD, 4, 22, 76, 20);
      // body
      r(g, redD, 4, 22, 76, 19);
      r(g, red, 5, 22, 74, 18);
      // highlight ribbon
      r(g, redL, 5, 22, 74, 1);
      // peak 1 (right, iconic)
      r(g, redDD, 24, 12, 36, 10);
      r(g, redD, 24, 12, 36, 9);
      r(g, red, 25, 12, 34, 8);
      r(g, redL, 25, 12, 34, 1);
      // higher peak
      r(g, redDD, 34, 4, 18, 8);
      r(g, redD, 34, 4, 18, 7);
      r(g, red, 35, 4, 16, 6);
      r(g, redL, 35, 4, 16, 1);
      // spire (funnel)
      r(g, redDD, 40, -2, 6, 6);
      r(g, redD, 40, -2, 6, 5);
      r(g, red, 41, -2, 4, 4);
      r(g, redL, 41, -2, 4, 1);
      r(g, 0x1a1a1a, 42, -4, 2, 2);
      // roof structural ribs
      for (let i = 0; i < 7; i++) {
        const rx = 8 + i * 11;
        r(g, redD, rx, 22, 1, 18);
      }
      // prancing horse yellow shield
      r(g, 0xf6db3a, 38, 26, 8, 10);
      r(g, 0xd8b82a, 38, 26, 1, 10);
      r(g, 0xf6db3a, 37, 28, 1, 6);
      r(g, 0xf6db3a, 46, 28, 1, 6);
      r(g, 0x1a1a1a, 40, 28, 4, 6);
      // horse outline (tiny)
      r(g, 0xf6db3a, 41, 29, 1, 1);
      r(g, 0xf6db3a, 42, 30, 1, 1);
      r(g, 0xf6db3a, 41, 32, 2, 1);
      // SF monogram
      r(g, 0x1a1a1a, 38, 37, 8, 1);
      // walls beneath roof
      r(g, 0x7a7a7a, 8, 38, 68, 4);
      r(g, 0x9a9a9a, 8, 38, 68, 1);
      // entrance windows
      for (let x = 12; x < 72; x += 8) r(g, 0x3a5a7a, x, 39, 3, 2);
      // support columns
      r(g, 0x3a3a3a, 6, 38, 2, 4);
      r(g, 0x3a3a3a, 76, 38, 2, 4);
    },
  },
  emirates_palace: {
    kind: 'emirates_palace',
    name: 'EMIRATES PALACE',
    hint: 'Pink-sand royal hotel with 114 domes',
    w: 90, h: 50,
    draw: (g) => {
      const sand = 0xd4b478;
      const sandL = 0xe8ca8a;
      const sandD = 0xa68a58;
      const sandDD = 0x7a6438;
      const gold = 0xe8c86a;
      const goldD = 0xb89a3a;
      // base plaza
      r(g, 0x8a7a5a, 0, 46, 90, 4);
      r(g, 0xa8985a, 0, 46, 90, 1);
      // fountains at front
      r(g, 0x4a8dc6, 20, 48, 4, 2);
      r(g, 0x4a8dc6, 66, 48, 4, 2);
      r(g, 0xffffff, 21, 47, 2, 1);
      r(g, 0xffffff, 67, 47, 2, 1);
      // main building wide base
      r(g, sandDD, 4, 24, 82, 24);
      r(g, sandD, 5, 24, 80, 22);
      r(g, sand, 6, 25, 78, 20);
      r(g, sandL, 6, 25, 78, 1);
      // upper floors set back
      r(g, sandDD, 14, 18, 62, 8);
      r(g, sandD, 14, 18, 62, 7);
      r(g, sand, 15, 18, 60, 6);
      r(g, sandL, 15, 18, 60, 1);
      // central main dome (huge golden)
      r(g, sandDD, 38, 10, 16, 10);
      r(g, sandD, 38, 10, 16, 9);
      r(g, sand, 39, 10, 14, 8);
      r(g, goldD, 40, 6, 12, 6);
      r(g, gold, 41, 6, 11, 5);
      r(g, 0xffe680, 41, 6, 11, 1);
      // crescent finial
      r(g, goldD, 45, 2, 2, 4);
      r(g, gold, 45, 2, 2, 3);
      r(g, goldD, 44, 0, 4, 2);
      r(g, gold, 44, 0, 4, 1);
      // flanking domes (4 medium)
      const midDome = (cx: number) => {
        r(g, sandDD, cx - 4, 14, 8, 6);
        r(g, sandD, cx - 4, 14, 8, 5);
        r(g, sand, cx - 3, 14, 6, 4);
        r(g, goldD, cx - 2, 11, 4, 4);
        r(g, gold, cx - 2, 11, 4, 3);
        r(g, gold, cx - 1, 8, 2, 3);
        r(g, goldD, cx - 1, 7, 2, 1);
      };
      midDome(20);
      midDome(70);
      // small side domes (4)
      const smDome = (cx: number) => {
        r(g, sandD, cx - 3, 16, 6, 4);
        r(g, sand, cx - 3, 16, 6, 3);
        r(g, gold, cx - 2, 14, 4, 2);
        r(g, goldD, cx - 1, 13, 2, 1);
      };
      smDome(10);
      smDome(30);
      smDome(60);
      smDome(80);
      // grand archway entry (center)
      r(g, sandDD, 40, 32, 10, 14);
      r(g, sandD, 41, 34, 8, 12);
      r(g, 0x2a2018, 43, 36, 4, 10);
      r(g, goldD, 40, 32, 10, 2);
      r(g, gold, 40, 32, 10, 1);
      // colonnade arches — two rows (upper floor + ground)
      for (let i = 0; i < 11; i++) {
        const ax = 8 + i * 7;
        if (ax >= 38 && ax <= 50) continue;
        r(g, sandDD, ax, 34, 5, 12);
        r(g, sandD, ax + 1, 35, 3, 11);
        r(g, 0x6a5030, ax + 2, 38, 1, 8);
      }
      // upper floor windows
      for (let i = 0; i < 10; i++) {
        r(g, 0x3a2a18, 17 + i * 6, 20, 2, 3);
      }
      // flag poles
      r(g, 0x1a1a1a, 12, 10, 1, 6);
      r(g, 0xce1126, 13, 10, 3, 2);
      r(g, 0x1a1a1a, 77, 10, 1, 6);
      r(g, 0xce1126, 78, 10, 3, 2);
      // perimeter wall edge
      r(g, sandDD, 0, 45, 90, 1);
    },
  },
  etihad_towers: {
    kind: 'etihad_towers',
    name: 'ETIHAD TOWERS',
    hint: 'Five curved glass towers — Abu Dhabi corniche',
    w: 56, h: 100,
    draw: (g) => {
      // plaza base
      r(g, 0x6a6a6a, 0, 92, 56, 8);
      r(g, 0x8a8a8a, 0, 92, 56, 1);
      r(g, 0x4a4a4a, 0, 98, 56, 2);
      // reflecting pool front
      r(g, 0x0a3d66, 2, 94, 52, 2);
      r(g, 0x4a8dc6, 6, 94, 8, 1);
      r(g, 0x4a8dc6, 30, 94, 12, 1);
      // 5 glass towers with slight curve (asymmetric heights)
      const heights = [62, 78, 90, 72, 58];
      const bodies = [0x4a6a8a, 0x3a5a7a, 0x2a4a6a, 0x3a5a7a, 0x4a6a8a];
      for (let i = 0; i < 5; i++) {
        const x = 2 + i * 10;
        const h = heights[i];
        const yTop = 92 - h;
        // shadow (left edge)
        r(g, 0x1a2a3a, x, yTop, 2, h);
        // body
        r(g, bodies[i], x + 1, yTop, 7, h);
        // glass shimmer diagonal
        r(g, 0x6a8aaa, x + 2, yTop, 1, h);
        // highlight (right edge — curve implication)
        r(g, 0xaaccdd, x + 7, yTop, 1, h);
        r(g, 0xe0eef8, x + 8, yTop + Math.floor(h * 0.4), 1, Math.floor(h * 0.3));
        // floor bands (every 6)
        for (let by = yTop + 4; by < 92; by += 6) {
          r(g, 0x2a3a50, x + 1, by, 7, 1);
        }
        // window grid (2 cols, staggered lit)
        for (let wy = yTop + 6; wy < 90; wy += 3) {
          const seed = (wy + x * 3) % 7;
          r(g, seed < 4 ? 0xffe680 : 0x2a3a4a, x + 3, wy, 1, 1);
          r(g, seed < 5 ? 0xffe680 : 0x2a3a4a, x + 5, wy, 1, 1);
        }
        // podium (bottom chunky base connecting towers)
        r(g, 0x5a7090, x, 86, 9, 6);
        r(g, 0x8aa0c0, x, 86, 9, 1);
        // crown — spire + light
        r(g, 0x1a1a1a, x + 4, yTop - 6, 1, 6);
        r(g, 0xff4a4a, x + 4, yTop - 6, 1, 1);
        r(g, 0x3a4a60, x + 2, yTop - 2, 5, 2);
      }
      // shared podium block
      r(g, 0x4a5a7a, 0, 88, 56, 4);
      r(g, 0x6a7a9a, 0, 88, 56, 1);
      for (let wx = 2; wx < 54; wx += 4) r(g, 0xffe680, wx, 90, 1, 1);
    },
  },
  burj_khalifa: {
    kind: 'burj_khalifa',
    name: 'BURJ KHALIFA',
    hint: 'Tallest building in the world',
    w: 36, h: 200,
    scale: 0.7,
    draw: (g) => {
      const body = 0x8ea4bc;
      const bodyL = 0xb8cee0;
      const bodyXL = 0xdee8f4;
      const shade = 0x5a7088;
      const shadeD = 0x3a4a60;
      // plaza base
      r(g, 0x6a6a6a, 0, 192, 36, 8);
      r(g, 0x8a8a8a, 0, 192, 36, 1);
      r(g, 0x4a4a4a, 0, 198, 36, 2);
      // fountain pool in front
      r(g, 0x0a3d66, 4, 196, 28, 3);
      r(g, 0x4a8dc6, 8, 196, 20, 1);
      r(g, 0xffffff, 14, 195, 2, 1);
      r(g, 0xffffff, 20, 194, 2, 2);
      // spiraling setback segments (Y-plan floors)
      const segs: [number, number, number][] = [
        [172, 4, 28], // widest base
        [146, 6, 24],
        [120, 8, 20],
        [96, 10, 16],
        [74, 11, 14],
        [54, 12, 12],
        [36, 13, 10],
        [20, 14, 8],
        [8, 15, 6],
      ];
      for (const [yTop, x, w] of segs) {
        const h = 192 - yTop;
        // dark base shadow (far left column)
        r(g, shadeD, x, yTop, 1, h);
        // body
        r(g, body, x + 1, yTop, w - 2, h);
        // mid-highlight column
        r(g, bodyL, x + Math.floor(w / 2), yTop, 1, h);
        // bright edge (right)
        r(g, bodyXL, x + w - 1, yTop, 1, h);
        // setback cap band (darker floor line at each step top)
        r(g, shade, x, yTop, w, 1);
        r(g, bodyL, x + 1, yTop + 1, w - 2, 1);
      }
      // vertical ribs every 4px to give fluted look
      for (let rx = 4; rx < 32; rx += 3) {
        r(g, shade, rx, 20, 1, 170);
      }
      // window grid — 3 columns of lit pixels with variation
      for (let y = 22; y < 190; y += 4) {
        const seed = (y * 13) % 9;
        r(g, seed < 7 ? 0xffe680 : 0x3a4a5a, 14, y, 1, 1);
        r(g, seed < 6 ? 0xffe680 : 0x3a4a5a, 18, y, 1, 1);
        r(g, seed < 5 ? 0xffe680 : 0x3a4a5a, 22, y, 1, 1);
      }
      // pinnacle / spire
      r(g, shade, 17, 0, 2, 20);
      r(g, body, 17, 2, 2, 18);
      r(g, bodyL, 18, 2, 1, 18);
      // spire cap antenna
      r(g, 0x1a1a1a, 17, -6, 2, 6);
      r(g, 0xff4a4a, 17, -6, 2, 1);
      r(g, 0xff4a4a, 17, -3, 2, 1);
      // observation deck band
      r(g, 0xffe680, 12, 60, 12, 1);
      r(g, 0x6a8098, 12, 61, 12, 1);
    },
  },
  palm_jumeirah: {
    kind: 'palm_jumeirah',
    name: 'PALM JUMEIRAH',
    hint: 'Palm-shaped island with Atlantis at the crescent',
    w: 160, h: 160,
    scale: 0.385,
    rotation: -Math.PI / 2,
    draw: (g) => {
      const sand = 0xd4b478;
      const sandL = 0xe8cc8a;
      const sandD = 0xa68a58;
      const green = 0x3e6b3a;
      const road = 0x5a5a5a;
      const waterL = 0x1a5d86;
      // Subtle water backdrop (so lagoons look darker than open water around)
      r(g, waterL, 14, 40, 132, 110);
      // central island / hotel row (trunk base)
      r(g, sandD, 66, 36, 28, 14);
      r(g, sand, 67, 36, 26, 13);
      r(g, sandL, 67, 36, 26, 1);
      // Atlantis at crescent top
      r(g, 0xa84a3a, 74, 30, 12, 8);
      r(g, 0xd68a6a, 75, 30, 10, 7);
      r(g, 0xe8c86a, 77, 28, 2, 2);
      r(g, 0xe8c86a, 81, 28, 2, 2);
      // trunk / main road (16 wide)
      r(g, sandD, 68, 48, 24, 80);
      r(g, sand, 69, 48, 22, 79);
      r(g, sandL, 69, 48, 22, 1);
      // main road down the trunk
      r(g, road, 78, 48, 4, 80);
      r(g, 0xe0d8a0, 79, 50, 2, 1);
      for (let ry = 54; ry < 128; ry += 6) r(g, 0xe0d8a0, 79, ry, 2, 1);
      // fronds (8 pairs, tapered) each frond is a skinny tapering island off the trunk
      const frondBases = [54, 64, 74, 84, 94, 104, 114, 122];
      for (let i = 0; i < frondBases.length; i++) {
        const by = frondBases[i];
        const maxLen = 44 - i * 3; // fronds near top are longer
        const width = 5 - Math.floor(i / 4);
        // left frond — angled up-left
        for (let k = 0; k < maxLen; k += 2) {
          const fx = 68 - k;
          const fy = by + Math.floor(k * 0.35);
          r(g, sandD, fx - 1, fy - 1, width + 2, width);
          r(g, sand, fx, fy, width, width - 1);
          r(g, sandL, fx, fy, width, 1);
          // green tips / vegetation
          if (k > maxLen - 6) {
            r(g, green, fx, fy, 2, 1);
          }
        }
        // right frond — angled up-right
        for (let k = 0; k < maxLen; k += 2) {
          const fx = 92 + k;
          const fy = by + Math.floor(k * 0.35);
          r(g, sandD, fx - 1, fy - 1, width + 2, width);
          r(g, sand, fx, fy, width, width - 1);
          r(g, sandL, fx, fy, width, 1);
          if (k > maxLen - 6) {
            r(g, green, fx, fy, 2, 1);
          }
        }
      }
      // little building dots along trunk and fronds
      for (let i = 0; i < 16; i++) {
        const bx = 70 + (i % 2) * 18;
        const by = 54 + i * 4;
        r(g, 0xcfd8e3, bx, by, 2, 2);
        r(g, 0xffe680, bx + 1, by + 1, 1, 1);
      }
      // crescent breakwater — continuous arc around top
      const drawArcRing = (cx: number, cy: number, rr: number, thick: number, color: number, topColor: number) => {
        for (let a = 10; a <= 170; a += 2) {
          const rad = (a * Math.PI) / 180;
          for (let t = 0; t < thick; t++) {
            const rx = rr - t;
            const x = cx + Math.cos(rad) * rx;
            const y = cy - Math.sin(rad) * rx;
            r(g, t === 0 ? topColor : color, Math.round(x) - 1, Math.round(y) - 1, 3, 3);
          }
        }
      };
      // outer crescent (breakwater)
      drawArcRing(80, 130, 74, 6, sandD, sand);
      drawArcRing(80, 130, 70, 3, sand, sandL);
      // resorts along the crescent
      for (let a = 20; a <= 160; a += 14) {
        const rad = (a * Math.PI) / 180;
        const cx = 80 + Math.cos(rad) * 72;
        const cy = 130 - Math.sin(rad) * 72;
        r(g, 0xcfd8e3, Math.round(cx), Math.round(cy) - 2, 2, 3);
        r(g, 0xffe680, Math.round(cx), Math.round(cy) - 1, 1, 1);
      }
      // monorail suggestion — dotted line on trunk
      for (let y = 52; y < 128; y += 4) r(g, 0xaaccdd, 76, y, 1, 1);
    },
  },
  burj_al_arab: {
    kind: 'burj_al_arab',
    name: 'BURJ AL ARAB',
    hint: 'Sail-shaped luxury hotel with helipad',
    w: 44, h: 130,
    draw: (g) => {
      const white = 0xf4f0e4;
      const whiteL = 0xfffcf0;
      const whiteD = 0xc8c4b0;
      const whiteDD = 0x8a8674;
      const glass = 0x3a6a8a;
      const glassL = 0x6aa5d0;
      const glassD = 0x1a3a5a;
      // causeway to island
      r(g, 0x5a5a5a, 0, 124, 18, 4);
      r(g, 0x7a7a7a, 0, 124, 18, 1);
      r(g, 0xe0d8a0, 2, 125, 14, 1);
      // artificial island base
      r(g, 0xc4b498, 16, 118, 22, 10);
      r(g, 0xd4c4a8, 18, 118, 18, 8);
      r(g, 0xe8d8b8, 18, 118, 18, 1);
      // SHADOW side of sail (sweeping curve) — left concave edge
      for (let y = 6; y < 120; y++) {
        const t = (y - 6) / 114;
        // sail right edge (mast side) — slight outward curve
        const rightX = 34 - Math.sin(t * Math.PI) * 2;
        // sail left edge — deep concave sweep
        const leftX = 10 + Math.pow(t, 1.6) * 10;
        // shadow column
        r(g, whiteDD, leftX, y, 1, 1);
        // body
        r(g, whiteD, leftX + 1, y, 1, 1);
        r(g, white, leftX + 2, y, Math.max(0, rightX - leftX - 3), 1);
        // highlight near mast
        r(g, whiteL, rightX - 1, y, 1, 1);
        r(g, whiteD, rightX, y, 1, 1);
      }
      // sail mast on mast side (vertical spine)
      r(g, 0x1a1a1a, 34, 0, 2, 124);
      r(g, 0x3a3a3a, 35, 0, 1, 124);
      // diagonal crossbraces (truss pattern)
      for (let i = 0; i < 8; i++) {
        const y0 = 12 + i * 14;
        r(g, 0x2a2a2a, 28, y0, 8, 1);
        // X brace
        for (let k = 0; k < 7; k++) {
          r(g, 0x4a4a4a, 28 + k, y0 + k + 1, 1, 1);
          r(g, 0x4a4a4a, 35 - k, y0 + k + 1, 1, 1);
        }
      }
      // glass atrium in the middle of the sail (the huge interior)
      for (let y = 18; y < 110; y += 4) {
        const t = (y - 6) / 114;
        const leftX = 10 + Math.pow(t, 1.6) * 10;
        const rightX = 34 - Math.sin(t * Math.PI) * 2;
        const cx = (leftX + rightX) / 2;
        r(g, glass, cx - 3, y, 6, 3);
        r(g, glassL, cx - 3, y, 6, 1);
        r(g, glassD, cx - 3, y + 2, 6, 1);
      }
      // mast tip
      r(g, 0x1a1a1a, 34, -2, 2, 4);
      r(g, 0xff4a4a, 34, -2, 2, 1);
      // helipad cantilever at top (signature — juts out to the right)
      r(g, 0x4a4a4a, 36, 16, 8, 2);
      r(g, 0x6a6a6a, 36, 14, 8, 3);
      r(g, 0xe0e0e0, 36, 12, 8, 3);
      r(g, 0xd6443a, 38, 13, 4, 1);
      r(g, 0xffffff, 39, 13, 2, 1);
      // helipad H marking
      r(g, 0xffffff, 38, 14, 1, 2);
      r(g, 0xffffff, 41, 14, 1, 2);
      r(g, 0xffffff, 39, 15, 2, 1);
      // Skyview Bar cantilever (lower, other side)
      r(g, 0x4a4a4a, 6, 34, 6, 2);
      r(g, 0x6a6a6a, 6, 32, 6, 3);
      r(g, 0xaaccdd, 7, 30, 4, 3);
      r(g, 0x3a6a8a, 8, 31, 2, 2);
      // base foundation lights
      for (let lx = 18; lx < 38; lx += 3) r(g, 0xffe680, lx, 122, 1, 1);
    },
  },
  dubai_marina: {
    kind: 'dubai_marina',
    name: 'DUBAI MARINA',
    hint: 'Tower cluster around the yacht basin',
    w: 72, h: 120,
    draw: (g) => {
      // marina water at base
      r(g, 0x0a3d66, 0, 110, 72, 10);
      r(g, 0x1a5d86, 0, 110, 72, 1);
      // docked yachts
      r(g, 0xffffff, 4, 112, 5, 2);
      r(g, 0x1a1a1a, 6, 110, 1, 2);
      r(g, 0xffffff, 14, 114, 4, 2);
      r(g, 0xffffff, 26, 112, 6, 2);
      r(g, 0x1a1a1a, 29, 110, 1, 2);
      r(g, 0xffffff, 42, 114, 5, 2);
      r(g, 0xffffff, 56, 112, 6, 2);
      r(g, 0x1a1a1a, 58, 110, 1, 2);
      // promenade
      r(g, 0x8a7a5a, 0, 108, 72, 2);
      // tower definitions: [x, topY, w, body, crown]
      // crown 0=antenna, 1=twisted top (Cayan), 2=crown disc (princess), 3=flat, 4=pyramid
      const towers: [number, number, number, number, number][] = [
        [2, 60, 8, 0x4a5a7a, 3],   // left filler
        [11, 40, 9, 0x5a6a8a, 2],  // princess tower (crown)
        [21, 18, 10, 0x3a4a6a, 1], // cayan tower (twisted)
        [32, 8, 9, 0x4a5a7a, 0],   // tallest w antenna
        [42, 24, 10, 0x6a7a9a, 4], // pyramid
        [53, 46, 8, 0x4a5a7a, 3],  // shorter
        [62, 54, 8, 0x5a6a8a, 0],  // right filler
      ];
      for (const [x, topY, w, color, crown] of towers) {
        const h = 108 - topY;
        // shadow
        r(g, 0x1a2a3a, x, topY, 2, h);
        // body
        r(g, color, x + 1, topY, w - 1, h);
        // glass highlight columns
        r(g, 0x8aa0c0, x + 2, topY, 1, h);
        r(g, 0xaac0e0, x + w - 1, topY, 1, h);
        // floor bands every 6
        for (let by = topY + 4; by < 108; by += 6) {
          r(g, 0x2a3a50, x + 1, by, w - 1, 1);
        }
        // window grid
        for (let wy = topY + 5; wy < 106; wy += 3) {
          const seed = (wy + x * 2) % 9;
          r(g, seed < 6 ? 0xffe680 : 0x3a4a5a, x + 3, wy, 1, 1);
          r(g, seed < 5 ? 0xffe680 : 0x3a4a5a, x + w - 3, wy, 1, 1);
        }
        // crown
        if (crown === 0) {
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 8, 1, 8);
          r(g, 0xff4a4a, x + Math.floor(w / 2), topY - 8, 1, 1);
          r(g, 0xff4a4a, x + Math.floor(w / 2), topY - 4, 1, 1);
        } else if (crown === 1) {
          // twisted top — stepped rotated squares
          r(g, color, x + 1, topY - 2, w - 1, 2);
          r(g, color, x + 2, topY - 4, w - 3, 2);
          r(g, color, x + 3, topY - 6, w - 5, 2);
          r(g, 0x8aa0c0, x + 3, topY - 6, w - 5, 1);
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 10, 1, 4);
        } else if (crown === 2) {
          // crown disc
          r(g, 0xaac0e0, x, topY - 2, w + 1, 2);
          r(g, 0xaac0e0, x + 1, topY - 4, w - 1, 2);
          r(g, 0xaac0e0, x + 2, topY - 5, w - 3, 1);
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 9, 1, 4);
          r(g, 0xff4a4a, x + Math.floor(w / 2), topY - 9, 1, 1);
        } else if (crown === 4) {
          r(g, color, x + 1, topY - 2, w - 1, 2);
          r(g, color, x + 2, topY - 4, w - 3, 2);
          r(g, color, x + 3, topY - 6, w - 5, 2);
          r(g, 0x1a1a1a, x + Math.floor(w / 2), topY - 10, 1, 4);
        } else {
          // flat — parapet
          r(g, 0x3a4a60, x + 1, topY - 1, w - 1, 1);
        }
      }
    },
  },
  musandam_cliffs: {
    kind: 'musandam_cliffs',
    name: 'MUSANDAM FJORDS',
    hint: 'Oman\'s rugged peninsula — "Norway of Arabia"',
    w: 80, h: 60,
    draw: (g) => {
      const cliff = 0x8b7340;
      const cliffL = 0xc4a86a;
      const cliffLL = 0xe2cc8a;
      const cliffD = 0x5a4828;
      const cliffDD = 0x3a2c18;
      const green = 0x3e6b3a;
      const greenL = 0x5e8b5a;
      // fjord water
      r(g, 0x0a3d66, 0, 46, 80, 14);
      r(g, 0x1a5d86, 0, 46, 80, 1);
      for (let x = 4; x < 80; x += 7) r(g, 0x4a8dc6, x, 50, 3, 1);
      // back cliff layer (lighter distant peaks)
      r(g, cliffL, 2, 4, 8, 16);
      r(g, cliffL, 16, 0, 10, 20);
      r(g, cliffL, 32, 6, 12, 14);
      r(g, cliffL, 48, 2, 10, 18);
      r(g, cliffL, 62, 8, 14, 12);
      // mid layer
      r(g, cliff, 0, 12, 80, 36);
      r(g, cliff, 4, 8, 10, 14);
      r(g, cliff, 18, 4, 12, 18);
      r(g, cliff, 34, 10, 14, 12);
      r(g, cliff, 50, 6, 12, 16);
      r(g, cliff, 64, 12, 14, 10);
      // front cliff face
      r(g, cliffD, 0, 30, 80, 16);
      r(g, cliff, 0, 30, 80, 1);
      // fjord crevasses
      r(g, cliffDD, 20, 14, 3, 32);
      r(g, cliffDD, 52, 10, 3, 36);
      // strata layers
      r(g, cliffLL, 0, 24, 80, 1);
      r(g, cliffDD, 0, 25, 80, 1);
      r(g, cliffLL, 0, 36, 80, 1);
      r(g, cliffDD, 0, 37, 80, 1);
      // sunlit right-facing faces
      r(g, cliffLL, 10, 6, 2, 14);
      r(g, cliffLL, 26, 2, 2, 18);
      r(g, cliffLL, 44, 8, 2, 12);
      r(g, cliffLL, 58, 4, 2, 16);
      r(g, cliffLL, 76, 10, 2, 10);
      // vegetation on ledges
      r(g, green, 6, 14, 3, 1);
      r(g, greenL, 6, 14, 2, 1);
      r(g, green, 28, 12, 4, 1);
      r(g, greenL, 28, 12, 2, 1);
      r(g, green, 46, 18, 3, 1);
      r(g, green, 68, 16, 3, 1);
      // goats / specks
      r(g, 0xf0e0c0, 12, 26, 1, 1);
      r(g, 0xf0e0c0, 40, 22, 1, 1);
      r(g, 0xf0e0c0, 60, 24, 1, 1);
      // shore splash
      r(g, 0xffffff, 0, 45, 80, 1);
      // traditional dhow sailing in fjord
      r(g, 0x6a4a2a, 30, 50, 14, 3);
      r(g, 0x8a6a3a, 30, 50, 14, 1);
      r(g, 0x3a2a1a, 43, 50, 1, 3);
      r(g, 0x3a2a1a, 36, 44, 1, 6);
      r(g, 0xe8ddc0, 32, 45, 4, 5);
      r(g, 0xc4a078, 32, 45, 4, 1);
      r(g, 0xaaccdd, 26, 54, 6, 1);
      // small boat in distance
      r(g, 0x6a4a2a, 60, 54, 6, 2);
      r(g, 0x3a2a1a, 65, 54, 1, 2);
      r(g, 0xaaccdd, 56, 56, 4, 1);
    },
  },
  muscat_port: {
    kind: 'muscat_port',
    name: 'PORT SULTAN QABOOS',
    hint: 'Mission complete!',
    w: 70, h: 34,
    draw: (g) => {
      // water
      r(g, 0x4a8dc6, 0, 30, 70, 4);
      r(g, 0x6aa5e0, 6, 30, 5, 1);
      r(g, 0x6aa5e0, 38, 30, 6, 1);
      // dock
      r(g, 0x5a5a5a, 0, 22, 70, 8);
      r(g, 0x7a7a7a, 0, 22, 70, 1);
      r(g, 0x3a3a3a, 0, 29, 70, 1);
      for (let x = 3; x < 70; x += 6) r(g, 0x1a1a1a, x, 21, 1, 1);
      // gantry cranes (Omani green/white)
      const crane = (bx: number) => {
        r(g, 0xe8e8e8, bx, 4, 1, 18);
        r(g, 0xe8e8e8, bx + 8, 4, 1, 18);
        r(g, 0x009e49, bx, 10, 9, 1);
        r(g, 0x009e49, bx - 1, 2, 11, 2);
        r(g, 0xffffff, bx - 1, 2, 11, 1);
        r(g, 0x1a1a1a, bx + 4, 4, 1, 3);
        r(g, 0xffe680, bx + 3, 2, 4, 1);
        r(g, 0x009e49, bx - 4, 2, 4, 1);
        r(g, 0x009e49, bx + 10, 2, 4, 1);
      };
      crane(6);
      crane(26);
      crane(46);
      // containers
      const cont: [number, number, number, number][] = [
        [1, 16, 6, 6], [8, 16, 6, 6], [15, 16, 6, 6], [22, 16, 6, 6],
        [29, 16, 6, 6], [36, 16, 6, 6],
        [4, 10, 6, 6], [16, 10, 6, 6], [32, 10, 6, 6],
      ];
      const colors = [0xcc5a3a, 0x3a8ccc, 0x3acc7a, 0xccc43a, 0x8a6aaa, 0xd68a3a];
      for (let i = 0; i < cont.length; i++) {
        const [x, y, w, h] = cont[i];
        const c = colors[i % colors.length];
        r(g, c, x, y, w, h);
        r(g, 0x1a1a1a, x, y + h - 1, w, 1);
        r(g, 0xffffff, x + 1, y + 1, 1, 1);
      }
      // Royal Yacht Al Said (signature multi-deck white)
      r(g, 0xffffff, 40, 24, 28, 5);
      r(g, 0xe8e8e8, 40, 28, 28, 1);
      r(g, 0x3a3a3a, 66, 24, 2, 5);
      r(g, 0xffffff, 44, 20, 18, 4);
      r(g, 0xe8e8e8, 44, 23, 18, 1);
      r(g, 0xffffff, 48, 16, 10, 4);
      r(g, 0x1a1a1a, 49, 15, 1, 1);
      r(g, 0x1a1a1a, 56, 15, 1, 1);
      r(g, 0x3a5a7a, 50, 18, 6, 1);
      // funnel
      r(g, 0xe8e8e8, 52, 12, 3, 4);
      r(g, 0xd6443a, 52, 12, 3, 1);
      // portholes
      for (let x = 42; x < 66; x += 2) r(g, 0xffe680, x, 26, 1, 1);
      // Omani flag at stern
      r(g, 0x1a1a1a, 67, 18, 1, 6);
      r(g, 0xda0000, 68, 18, 2, 1);
      r(g, 0xffffff, 68, 19, 2, 1);
      r(g, 0x009e49, 68, 20, 2, 1);
      // small dhow in water (left)
      r(g, 0x6a4a2a, 0, 26, 10, 3);
      r(g, 0x8a6a3a, 0, 26, 10, 1);
      r(g, 0x3a2a1a, 5, 22, 1, 4);
      r(g, 0xe8ddc0, 0, 22, 5, 4);
      r(g, 0xc4a078, 0, 22, 5, 1);
      // welcome banner
      r(g, 0x1a1a1a, 18, 1, 1, 8);
      r(g, 0xda0000, 19, 1, 1, 3);
      r(g, 0xffffff, 19, 3, 1, 3);
      r(g, 0x009e49, 19, 5, 1, 3);
      r(g, 0xda0000, 20, 1, 4, 2);
      r(g, 0xffffff, 20, 3, 4, 1);
    },
  },
  sultan_qaboos_mosque: {
    kind: 'sultan_qaboos_mosque',
    name: 'SULTAN QABOOS GRAND MOSQUE',
    hint: 'Muscat\'s main mosque — 50m main dome',
    w: 70, h: 50,
    draw: (g) => {
      const white = 0xf4f0e4;
      const whiteL = 0xfffcf0;
      const whiteS = 0xd4cebc;
      const gold = 0xe8c86a;
      const goldD = 0xb8983a;
      const arch = 0x8a7a5a;
      // reflecting pool
      r(g, 0x0a3d66, 0, 46, 70, 4);
      r(g, 0x4a8dc6, 2, 46, 66, 1);
      r(g, 0x6aa5e0, 10, 47, 5, 1);
      r(g, 0x6aa5e0, 34, 47, 6, 1);
      r(g, 0x6aa5e0, 56, 47, 5, 1);
      // platform
      r(g, whiteS, 2, 42, 66, 4);
      r(g, whiteL, 2, 42, 66, 1);
      // prayer hall (wide base)
      r(g, whiteS, 14, 24, 42, 18);
      r(g, white, 15, 24, 41, 18);
      r(g, whiteL, 15, 24, 41, 1);
      // central onion dome (multi-tiered)
      r(g, whiteS, 30, 8, 12, 14);
      r(g, white, 31, 8, 11, 14);
      r(g, whiteL, 31, 9, 4, 1);
      r(g, whiteS, 32, 4, 8, 4);
      r(g, white, 32, 4, 8, 3);
      r(g, whiteS, 33, 0, 6, 4);
      r(g, white, 33, 0, 6, 3);
      r(g, goldD, 35, -4, 2, 4);
      r(g, gold, 35, -4, 2, 3);
      r(g, gold, 34, -6, 4, 2);
      // flanking small domes
      r(g, whiteS, 18, 20, 8, 4);
      r(g, white, 19, 20, 7, 4);
      r(g, whiteS, 20, 17, 4, 3);
      r(g, white, 20, 17, 4, 2);
      r(g, gold, 21, 15, 2, 2);
      r(g, whiteS, 44, 20, 8, 4);
      r(g, white, 45, 20, 7, 4);
      r(g, whiteS, 46, 17, 4, 3);
      r(g, white, 46, 17, 4, 2);
      r(g, gold, 47, 15, 2, 2);
      // 4 minarets (tiered)
      const minaret = (x: number) => {
        r(g, whiteS, x, 6, 4, 36);
        r(g, white, x + 1, 6, 3, 36);
        r(g, whiteL, x + 1, 6, 1, 36);
        r(g, whiteS, x - 1, 18, 6, 2);
        r(g, white, x - 1, 18, 6, 1);
        r(g, whiteS, x - 1, 30, 6, 2);
        r(g, white, x - 1, 30, 6, 1);
        r(g, white, x, 3, 4, 3);
        r(g, white, x + 1, 1, 2, 2);
        r(g, gold, x + 1, -2, 2, 3);
        r(g, gold, x, -4, 4, 1);
      };
      minaret(2);
      minaret(64);
      minaret(22);
      minaret(44);
      // arched colonnade
      for (let i = 0; i < 7; i++) {
        const ax = 14 + i * 6;
        r(g, arch, ax, 34, 4, 8);
        r(g, white, ax, 34, 4, 1);
        r(g, 0x3a2a1a, ax + 1, 36, 2, 6);
      }
      // windows on main body
      for (let i = 0; i < 4; i++) {
        r(g, 0x3a2a1a, 18 + i * 10, 28, 2, 3);
        r(g, gold, 18 + i * 10, 27, 2, 1);
      }
      // calligraphy band
      r(g, gold, 14, 26, 42, 1);
      // base lights
      for (let x = 4; x < 68; x += 4) r(g, 0xffe680, x, 45, 1, 1);
    },
  },
  mutrah_corniche: {
    kind: 'mutrah_corniche',
    name: 'MUTRAH CORNICHE',
    hint: 'Whitewashed souq waterfront',
    w: 60, h: 30,
    draw: (g) => {
      const white = 0xf4f0e4;
      const whiteL = 0xfffcf0;
      const whiteS = 0xd4cebc;
      const gold = 0xe8c86a;
      const goldD = 0xb8983a;
      // promenade edge
      r(g, 0x5a5a5a, 0, 28, 60, 2);
      r(g, 0x8a8a8a, 0, 28, 60, 1);
      // row of white-washed buildings
      const defs: [number, number][] = [
        [0, 14], [8, 10], [16, 18], [26, 12], [34, 16], [44, 10], [52, 18],
      ];
      for (const [x, h] of defs) {
        const y = 28 - h;
        const w = 8;
        r(g, whiteS, x, y, w, h);
        r(g, white, x, y, w - 1, h);
        r(g, whiteL, x, y, w - 1, 1);
        r(g, whiteS, x + w - 1, y, 1, h);
        // roof band
        r(g, gold, x, y, w, 1);
        r(g, goldD, x, y + 1, w, 1);
        // windows
        for (let wy = y + 3; wy < 28; wy += 4) {
          r(g, 0x3a2a1a, x + 2, wy, 1, 2);
          r(g, 0x3a2a1a, x + 5, wy, 1, 2);
          r(g, 0xffe680, x + 2, wy, 1, 1);
          r(g, 0xffe680, x + 5, wy, 1, 1);
        }
        // arched doorway
        r(g, 0x3a2a1a, x + 3, 25, 2, 3);
        r(g, gold, x + 3, 24, 2, 1);
      }
      // Mutrah watchtower (right end, on rocky outcrop)
      r(g, 0x6a5a3a, 54, 24, 6, 4);
      r(g, 0x8a7a4a, 54, 24, 6, 1);
      r(g, whiteS, 54, 6, 6, 18);
      r(g, white, 54, 6, 5, 18);
      r(g, whiteL, 54, 6, 5, 1);
      // crenellations
      for (let x = 54; x < 60; x += 2) r(g, whiteS, x, 3, 1, 3);
      // tower window
      r(g, 0x3a2a1a, 56, 12, 2, 2);
      r(g, 0xffe680, 56, 12, 2, 1);
      // mosque minaret rising from souq
      r(g, whiteS, 20, 2, 3, 26);
      r(g, white, 20, 2, 2, 26);
      r(g, whiteL, 20, 2, 1, 26);
      r(g, whiteS, 19, 12, 5, 1);
      r(g, whiteS, 19, 20, 5, 1);
      r(g, white, 20, -2, 3, 4);
      r(g, gold, 21, -4, 1, 3);
      // palm trees along promenade
      for (let i = 0; i < 3; i++) {
        const px = 12 + i * 18;
        r(g, 0x6a4a2a, px, 22, 1, 6);
        r(g, 0x3e6b3a, px - 2, 20, 5, 2);
        r(g, 0x5e8b5a, px - 1, 20, 3, 1);
      }
      // waterline
      r(g, 0x0a3d66, 0, 29, 60, 1);
    },
  },
  al_jalali_fort: {
    kind: 'al_jalali_fort',
    name: 'AL JALALI FORT',
    hint: 'Portuguese-era coastal fortress',
    w: 40, h: 34,
    draw: (g) => {
      const stone = 0xc4a078;
      const stoneL = 0xe4c498;
      const stoneD = 0x8a6a48;
      const stoneDD = 0x5a4228;
      const rock = 0x6a5a3a;
      const rockD = 0x3a2818;
      // rocky crag base
      r(g, rockD, 0, 26, 40, 8);
      r(g, rock, 1, 26, 38, 8);
      r(g, 0x8a7a4a, 3, 26, 34, 1);
      r(g, rockD, 0, 30, 2, 4);
      r(g, rockD, 38, 28, 2, 6);
      r(g, rockD, 18, 32, 4, 2);
      // water lapping
      r(g, 0x4a8dc6, 0, 32, 40, 2);
      r(g, 0xffffff, 6, 32, 4, 1);
      r(g, 0xffffff, 28, 33, 3, 1);
      // main fort wall
      r(g, stoneDD, 4, 14, 32, 14);
      r(g, stone, 5, 14, 31, 14);
      r(g, stoneL, 5, 14, 31, 1);
      r(g, stoneD, 35, 14, 1, 14);
      // stone courses
      r(g, stoneD, 5, 18, 31, 1);
      r(g, stoneD, 5, 22, 31, 1);
      // crenellations
      for (let x = 4; x < 38; x += 4) {
        r(g, stoneD, x, 10, 1, 4);
        r(g, stone, x + 1, 10, 2, 4);
        r(g, stoneL, x + 1, 10, 2, 1);
      }
      // central arched gateway
      r(g, stoneDD, 16, 18, 8, 10);
      r(g, 0x2a1808, 17, 20, 6, 8);
      r(g, stoneD, 16, 18, 8, 2);
      // twin watchtowers
      const tower = (x: number) => {
        r(g, stoneDD, x, 8, 5, 22);
        r(g, stone, x + 1, 8, 4, 22);
        r(g, stoneL, x + 1, 8, 1, 22);
        r(g, stoneD, x + 4, 8, 1, 22);
        r(g, stoneD, x, 6, 1, 2);
        r(g, stone, x + 1, 6, 1, 2);
        r(g, stoneD, x + 2, 6, 1, 2);
        r(g, stone, x + 3, 6, 1, 2);
        r(g, stoneD, x + 4, 6, 1, 2);
        r(g, 0x2a1808, x + 2, 14, 1, 3);
      };
      tower(0);
      tower(35);
      // Omani flag on center
      r(g, 0x1a1a1a, 20, 0, 1, 10);
      r(g, 0xda0000, 21, 0, 6, 2);
      r(g, 0xffffff, 21, 2, 6, 2);
      r(g, 0x009e49, 21, 4, 6, 2);
      // arrow slits
      r(g, 0x2a1808, 10, 18, 1, 3);
      r(g, 0x2a1808, 28, 18, 1, 3);
      r(g, 0x2a1808, 13, 22, 1, 3);
      r(g, 0x2a1808, 26, 22, 1, 3);
      r(g, 0xffcc33, 10, 19, 1, 1);
      r(g, 0xffcc33, 26, 23, 1, 1);
      // cannons on battlement
      r(g, 0x1a1a1a, 11, 9, 3, 1);
      r(g, 0x3a3a3a, 11, 10, 4, 1);
      r(g, 0x1a1a1a, 24, 9, 3, 1);
      r(g, 0x3a3a3a, 24, 10, 4, 1);
    },
  },
  muscat_opera: {
    kind: 'muscat_opera',
    name: 'ROYAL OPERA HOUSE',
    hint: 'Omani classical architecture meets acoustics',
    w: 50, h: 34,
    draw: (g) => {
      const cream = 0xe8ddc0;
      const creamL = 0xf4ecd4;
      const creamS = 0xc8b488;
      const creamD = 0x9a8868;
      const stone = 0xb8a078;
      const gold = 0xe8c86a;
      const goldD = 0xb8983a;
      // plaza
      r(g, 0x8a8a7a, 0, 32, 50, 2);
      r(g, 0xa8a898, 0, 32, 50, 1);
      // platform
      r(g, creamD, 2, 28, 46, 4);
      r(g, cream, 2, 28, 46, 3);
      r(g, creamL, 2, 28, 46, 1);
      // main building body
      r(g, creamS, 4, 14, 42, 14);
      r(g, cream, 5, 14, 40, 14);
      r(g, creamL, 5, 14, 40, 1);
      r(g, creamD, 44, 15, 1, 13);
      // upper set-back story
      r(g, creamS, 14, 8, 22, 6);
      r(g, cream, 15, 8, 20, 6);
      r(g, creamL, 15, 8, 20, 1);
      // central onion dome
      r(g, creamS, 20, 2, 10, 6);
      r(g, cream, 21, 2, 9, 6);
      r(g, creamL, 21, 2, 4, 1);
      r(g, creamS, 22, -2, 6, 4);
      r(g, cream, 22, -2, 6, 3);
      r(g, goldD, 24, -6, 2, 4);
      r(g, gold, 24, -6, 2, 3);
      r(g, gold, 23, -8, 4, 2);
      // corner small domes
      const smDome = (cx: number) => {
        r(g, creamS, cx - 2, 10, 4, 4);
        r(g, cream, cx - 2, 10, 4, 3);
        r(g, goldD, cx - 1, 8, 2, 2);
        r(g, gold, cx - 1, 8, 2, 1);
      };
      smDome(10);
      smDome(40);
      // arched colonnade
      for (let i = 0; i < 7; i++) {
        const ax = 6 + i * 5;
        r(g, stone, ax, 20, 4, 8);
        r(g, creamS, ax, 20, 4, 1);
        r(g, 0x3a2a1a, ax + 1, 22, 2, 6);
        r(g, gold, ax, 19, 4, 1);
      }
      // upper slit windows
      for (let i = 0; i < 4; i++) {
        r(g, 0x3a2a1a, 18 + i * 4, 10, 1, 3);
        r(g, gold, 18 + i * 4, 9, 1, 1);
      }
      // grand entrance
      r(g, creamD, 22, 18, 6, 10);
      r(g, 0x3a2a1a, 23, 20, 4, 8);
      r(g, goldD, 22, 18, 6, 2);
      r(g, gold, 22, 18, 6, 1);
      // calligraphy band
      r(g, gold, 4, 16, 42, 1);
      r(g, goldD, 4, 17, 42, 1);
      // spotlights
      r(g, 0xffe680, 6, 30, 1, 1);
      r(g, 0xffe680, 24, 30, 1, 1);
      r(g, 0xffe680, 42, 30, 1, 1);
      // palm trees flanking
      r(g, 0x6a4a2a, 1, 24, 1, 4);
      r(g, 0x3e6b3a, 0, 22, 3, 2);
      r(g, 0x6a4a2a, 48, 24, 1, 4);
      r(g, 0x3e6b3a, 47, 22, 3, 2);
    },
  },
};
