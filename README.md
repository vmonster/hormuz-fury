# Hormuz Fury

A ~3-minute browser arcade game about the Strait of Hormuz crisis. Escort a tanker through the Strait in 3 minutes.

Built with [Phaser 4](https://phaser.io/phaser4) + TypeScript + Vite. Part of the [SNAPSH](https://snapsh.com) portal — the portal iframes this game and picks up personal best scores via `postMessage`.

## Dev

```bash
npm install
npm run dev    # http://localhost:5175
```

## Build

```bash
npm run build
# outputs to dist/
```

## Score integration

On game over, the `GameOverScene` posts the final score to the parent window:

```ts
window.parent.postMessage(
  { type: "snapsh:score", game: "hormuz-fury", score: <final-score> },
  "*",
);
```

The SNAPSH portal listens for this message and stores the max under
`localStorage['snapsh:best:hormuz-fury']`.
