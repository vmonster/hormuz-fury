export const GAME_W = 480;
export const GAME_H = 800;

// World length (pixels travelled from Kuwait to Muscat).
// Target run: ~3:20 at base scroll speed (~90 px/s) = 18000 px
export const WORLD_LENGTH = 18000;
export const BASE_SCROLL_SPEED = 90;

export const PLAYER_MAX_LIVES = 3;
export const SHIP_MAX_HEALTH = 100;
export const FUEL_MAX = 100;
export const FUEL_DRAIN_PER_SEC = 100 / 40; // 40s per full tank

export const COLORS = {
  water: 0x0a3d66,
  waterDeep: 0x08304f,
  waterHighlight: 0x1e5a8a,
  land: 0xc9a96a,
  landDark: 0x8b7340,
  landShore: 0xe3c78a,
  greenery: 0x3e6b3a,
  road: 0x2a2a2a,
  hudBg: 0x0b1a2e,
  hudBorder: 0x2a4a6e,
  textLight: 0xe6eef8,
  textDim: 0x8ea6c2,
  danger: 0xff4a4a,
  warning: 0xffcc33,
  ok: 0x58d36a,
  fuel: 0xff9a2e,
};

export const COUNTRIES = {
  KW: { code: 'KW', name: 'KUWAIT', flag: ['#007A3D', '#FFFFFF', '#CE1126', '#000000'] },
  SA: { code: 'SA', name: 'SAUDI ARABIA', flag: ['#006C35', '#006C35', '#006C35', '#006C35'] },
  BH: { code: 'BH', name: 'BAHRAIN', flag: ['#FFFFFF', '#CE1126', '#CE1126', '#CE1126'] },
  QA: { code: 'QA', name: 'QATAR', flag: ['#FFFFFF', '#FFFFFF', '#8D1B3D', '#8D1B3D'] },
  AE: { code: 'AE', name: 'UAE', flag: ['#00732F', '#FFFFFF', '#000000', '#FF0000'] },
  IR: { code: 'IR', name: 'IRAN', flag: ['#239F40', '#FFFFFF', '#DA0000', '#DA0000'] },
  OM: { code: 'OM', name: 'OMAN', flag: ['#FFFFFF', '#DA0000', '#009E49', '#DA0000'] },
} as const;
export type CountryCode = keyof typeof COUNTRIES;
