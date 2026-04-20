const KEY = 'gulf-run-v1';

export interface SaveData {
  lastCompletedStage: number; // -1 = none
  highScore: number;
  speedMultiplier: number; // 0.8 .. 1.2 adjustable
}

const DEFAULT: SaveData = {
  lastCompletedStage: -1,
  highScore: 0,
  speedMultiplier: 1.0,
};

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT };
    return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT };
  }
}

export function writeSave(data: SaveData) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* noop */ }
}

export function updateSave(patch: Partial<SaveData>) {
  const cur = loadSave();
  writeSave({ ...cur, ...patch });
}
