import * as Phaser from 'phaser';

type P = Phaser.GameObjects.Graphics;

function makeTex(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  draw: (g: P) => void,
) {
  if (scene.textures.exists(key)) scene.textures.remove(key);
  const g = scene.add.graphics({ x: 0, y: 0 });
  g.setVisible(false);
  draw(g);
  g.generateTexture(key, w, h);
  g.destroy();
}

const r = (g: P, c: number, x: number, y: number, w: number, h: number, a = 1) => {
  g.fillStyle(c, a);
  g.fillRect(x, y, w, h);
};

export function createAllTextures(scene: Phaser.Scene) {
  // ========================================================================
  // PLAYER PLANE (32x40, pointing up) — richer shading, more detail
  // ========================================================================
  const planeBody = 0xdadfd0;
  const planeShade = 0x9aa090;
  const planeLight = 0xf0f3e8;
  const cockpit = 0x5a90b5;
  const glass = 0x8dcff0;
  const planeRed = 0xd6443a;
  const planeRedDark = 0x8a2a22;
  const planeDark = 0x2a2f34;
  const planeVDark = 0x181c20;

  makeTex(scene, 'plane', 32, 40, (g) => {
    // nose
    r(g, planeDark, 14, 0, 4, 3);
    r(g, planeVDark, 15, 0, 2, 1);
    // front fuselage
    r(g, planeBody, 13, 3, 6, 3);
    r(g, planeBody, 12, 5, 8, 6);
    r(g, planeShade, 19, 5, 1, 6);
    r(g, planeLight, 12, 5, 1, 6);
    // cockpit glass
    r(g, cockpit, 14, 8, 4, 5);
    r(g, glass, 14, 9, 4, 3);
    r(g, planeLight, 15, 9, 1, 1);
    // mid fuselage
    r(g, planeBody, 12, 13, 8, 10);
    r(g, planeLight, 13, 13, 1, 10);
    r(g, planeShade, 18, 13, 1, 10);
    // roundel
    r(g, cockpit, 14, 16, 4, 3);
    r(g, planeLight, 15, 17, 2, 1);
    // main wings
    r(g, planeShade, 2, 18, 28, 1);
    r(g, planeBody, 2, 19, 28, 4);
    r(g, planeLight, 3, 19, 26, 1);
    r(g, planeShade, 3, 22, 26, 1);
    // wingtip red stripes
    r(g, planeRed, 1, 19, 3, 4);
    r(g, planeRedDark, 1, 22, 3, 1);
    r(g, planeRed, 28, 19, 3, 4);
    r(g, planeRedDark, 28, 22, 3, 1);
    // wing pylons / missile stubs
    r(g, planeDark, 6, 23, 2, 2);
    r(g, planeDark, 24, 23, 2, 2);
    // tail boom
    r(g, planeBody, 14, 23, 4, 7);
    r(g, planeLight, 14, 23, 1, 7);
    r(g, planeShade, 17, 23, 1, 7);
    // horizontal stabilizer
    r(g, planeShade, 8, 29, 16, 1);
    r(g, planeBody, 8, 30, 16, 3);
    r(g, planeLight, 9, 30, 14, 1);
    r(g, planeRed, 8, 30, 2, 3);
    r(g, planeRed, 22, 30, 2, 3);
    // vertical tail
    r(g, planeBody, 14, 32, 4, 6);
    r(g, planeLight, 14, 32, 1, 6);
    r(g, planeShade, 17, 32, 1, 6);
    r(g, planeRed, 14, 35, 4, 1);
    // exhaust
    r(g, planeVDark, 15, 37, 2, 2);
    r(g, 0xff9a2e, 15, 38, 2, 2);
  });

  // Banked-left variant: shift wings, tint
  makeTex(scene, 'plane_left', 32, 40, (g) => {
    // same as plane but wings slanted: left wingtip lower
    r(g, planeDark, 14, 0, 4, 3);
    r(g, planeVDark, 15, 0, 2, 1);
    r(g, planeBody, 13, 3, 6, 3);
    r(g, planeBody, 12, 5, 8, 6);
    r(g, planeShade, 19, 5, 1, 6);
    r(g, cockpit, 14, 8, 4, 5);
    r(g, glass, 14, 9, 4, 3);
    r(g, planeBody, 12, 13, 8, 10);
    r(g, planeLight, 13, 13, 1, 10);
    r(g, planeShade, 18, 13, 1, 10);
    r(g, cockpit, 14, 16, 4, 3);
    // slanted wings (left lower, right higher): thinner on right, thicker on left
    r(g, planeShade, 2, 19, 28, 1);
    r(g, planeBody, 2, 20, 14, 4);
    r(g, planeBody, 16, 17, 14, 4);
    r(g, planeLight, 3, 20, 12, 1);
    r(g, planeLight, 17, 17, 12, 1);
    r(g, planeRed, 1, 21, 3, 3);
    r(g, planeRed, 28, 17, 3, 3);
    r(g, planeBody, 14, 23, 4, 7);
    r(g, planeShade, 17, 23, 1, 7);
    r(g, planeBody, 8, 30, 16, 3);
    r(g, planeRed, 8, 30, 2, 3);
    r(g, planeRed, 22, 30, 2, 3);
    r(g, planeBody, 14, 32, 4, 6);
    r(g, planeRed, 14, 35, 4, 1);
    r(g, 0xff9a2e, 15, 38, 2, 2);
  });

  makeTex(scene, 'plane_right', 32, 40, (g) => {
    r(g, planeDark, 14, 0, 4, 3);
    r(g, planeVDark, 15, 0, 2, 1);
    r(g, planeBody, 13, 3, 6, 3);
    r(g, planeBody, 12, 5, 8, 6);
    r(g, planeLight, 12, 5, 1, 6);
    r(g, cockpit, 14, 8, 4, 5);
    r(g, glass, 14, 9, 4, 3);
    r(g, planeBody, 12, 13, 8, 10);
    r(g, planeLight, 13, 13, 1, 10);
    r(g, planeShade, 18, 13, 1, 10);
    r(g, cockpit, 14, 16, 4, 3);
    r(g, planeShade, 2, 19, 28, 1);
    r(g, planeBody, 2, 17, 14, 4);
    r(g, planeBody, 16, 20, 14, 4);
    r(g, planeLight, 3, 17, 12, 1);
    r(g, planeLight, 17, 20, 12, 1);
    r(g, planeRed, 1, 17, 3, 3);
    r(g, planeRed, 28, 21, 3, 3);
    r(g, planeBody, 14, 23, 4, 7);
    r(g, planeLight, 14, 23, 1, 7);
    r(g, planeBody, 8, 30, 16, 3);
    r(g, planeRed, 8, 30, 2, 3);
    r(g, planeRed, 22, 30, 2, 3);
    r(g, planeBody, 14, 32, 4, 6);
    r(g, planeRed, 14, 35, 4, 1);
    r(g, 0xff9a2e, 15, 38, 2, 2);
  });

  // Plane drop shadow (silhouette, dark)
  makeTex(scene, 'plane_shadow', 32, 40, (g) => {
    g.fillStyle(0x000000, 0.45);
    g.fillRect(14, 0, 4, 3);
    g.fillRect(13, 3, 6, 3);
    g.fillRect(12, 5, 8, 18);
    g.fillRect(2, 18, 28, 5);
    g.fillRect(14, 23, 4, 7);
    g.fillRect(8, 29, 16, 4);
    g.fillRect(14, 32, 4, 6);
  });

  // ========================================================================
  // ESCORT CARGO SHIP (36x72) — richer multi-deck cargo with bridge
  // ========================================================================
  makeTex(scene, 'ship', 36, 72, (g) => {
    const hullDeep = 0x1a2944;
    const hull = 0x2b3d57;
    const hullLight = 0x47668f;
    const hullEdge = 0x0a1426;
    const deck = 0xd1c7a4;
    const deckShade = 0x9a8f70;
    const deckLight = 0xe8dfbf;
    const stackA = 0xc4533a;
    const stackB = 0x3a6b8a;
    const stackC = 0x7a9c6a;
    const stackD = 0xa08050;
    const bridge = 0xe8ecef;
    const bridgeShade = 0x8a9298;
    const windows = 0x11192a;
    const rust = 0x6a3a1a;

    // bow point (top)
    r(g, hullEdge, 15, 0, 6, 2);
    r(g, hull, 16, 1, 4, 2);
    r(g, hull, 14, 2, 8, 2);
    r(g, hull, 12, 4, 12, 2);
    // hull body (long)
    r(g, hullEdge, 8, 6, 20, 60);
    r(g, hull, 9, 6, 18, 60);
    r(g, hullLight, 9, 6, 18, 2);
    r(g, hullDeep, 9, 63, 18, 3);
    // hull shadow edge
    r(g, hullEdge, 26, 8, 1, 56);
    r(g, hullLight, 10, 8, 1, 55);
    // waterline stripe
    r(g, 0xe8d050, 9, 10, 18, 1);
    // rust streaks
    r(g, rust, 10, 20, 1, 8);
    r(g, rust, 25, 40, 1, 6);

    // stern (bottom square)
    r(g, hullEdge, 8, 66, 20, 2);
    r(g, hull, 9, 66, 18, 3);
    r(g, hullDeep, 10, 68, 16, 2);
    // propeller wake
    r(g, 0xdde9f4, 14, 70, 3, 2);
    r(g, 0xdde9f4, 19, 70, 3, 2);

    // Cargo row 1 (red containers)
    r(g, deckShade, 10, 10, 16, 1);
    r(g, stackA, 10, 11, 7, 5);
    r(g, stackA, 18, 11, 7, 5);
    r(g, deckLight, 10, 11, 7, 1);
    r(g, deckLight, 18, 11, 7, 1);
    r(g, windows, 12, 13, 1, 1);
    r(g, windows, 15, 13, 1, 1);
    r(g, windows, 20, 13, 1, 1);
    r(g, windows, 23, 13, 1, 1);
    // container edges
    r(g, hullEdge, 17, 11, 1, 5);

    // Cargo row 2 (blue)
    r(g, deckShade, 10, 16, 16, 1);
    r(g, stackB, 10, 17, 7, 5);
    r(g, stackB, 18, 17, 7, 5);
    r(g, deckLight, 10, 17, 14, 1);
    r(g, hullEdge, 17, 17, 1, 5);

    // Cargo row 3 (green)
    r(g, stackC, 10, 23, 7, 4);
    r(g, stackC, 18, 23, 7, 4);
    r(g, deckLight, 10, 23, 14, 1);
    r(g, hullEdge, 17, 23, 1, 4);

    // Cargo row 4 (orange/brown)
    r(g, stackD, 10, 28, 16, 4);
    r(g, deckLight, 10, 28, 16, 1);
    r(g, hullEdge, 17, 28, 1, 4);

    // Open deck / mid
    r(g, deck, 10, 33, 16, 10);
    r(g, deckShade, 10, 42, 16, 1);
    r(g, deckLight, 10, 33, 16, 1);
    // hatches
    r(g, hullEdge, 13, 36, 4, 3);
    r(g, deckShade, 13, 36, 4, 1);
    r(g, hullEdge, 19, 36, 4, 3);
    r(g, deckShade, 19, 36, 4, 1);

    // Bridge superstructure
    r(g, bridgeShade, 10, 43, 16, 1);
    r(g, bridge, 11, 44, 14, 8);
    r(g, bridgeShade, 22, 44, 3, 8);
    // bridge windows (black strip)
    r(g, windows, 12, 46, 12, 2);
    r(g, 0x8dcff0, 13, 46, 2, 1);
    r(g, 0x8dcff0, 16, 46, 2, 1);
    r(g, 0x8dcff0, 19, 46, 2, 1);
    r(g, 0x8dcff0, 22, 46, 2, 1);
    // radar mast
    r(g, bridge, 17, 42, 2, 2);
    r(g, bridge, 17, 40, 2, 2);
    r(g, windows, 15, 39, 6, 1);

    // Funnel
    r(g, hullEdge, 15, 52, 6, 1);
    r(g, stackA, 15, 53, 6, 5);
    r(g, bridge, 15, 54, 6, 1);
    r(g, hullEdge, 20, 53, 1, 5);
    // smoke wisp
    r(g, 0x7a7a7a, 17, 51, 2, 2, 0.6);

    // Cargo row 5 (behind bridge)
    r(g, stackC, 10, 58, 7, 4);
    r(g, stackB, 18, 58, 7, 4);
    r(g, deckLight, 10, 58, 14, 1);
    r(g, hullEdge, 17, 58, 1, 4);

    // Anchors / hull ports
    r(g, windows, 12, 14, 1, 1);
    r(g, windows, 24, 14, 1, 1);
    r(g, windows, 12, 30, 1, 1);
    r(g, windows, 24, 30, 1, 1);
    r(g, windows, 12, 50, 1, 1);
    r(g, windows, 24, 50, 1, 1);
  });

  // Ship shadow
  makeTex(scene, 'ship_shadow', 36, 72, (g) => {
    g.fillStyle(0x000000, 0.35);
    g.fillRect(15, 0, 6, 2);
    g.fillRect(14, 2, 8, 2);
    g.fillRect(12, 4, 12, 2);
    g.fillRect(8, 6, 20, 60);
    g.fillRect(8, 66, 20, 3);
  });

  // ========================================================================
  // BULLET (cannon round with bright trail)
  // ========================================================================
  makeTex(scene, 'bullet', 5, 12, (g) => {
    r(g, 0xfff8c0, 1, 0, 3, 4);
    r(g, 0xffe680, 0, 2, 5, 6);
    r(g, 0xff9a2e, 1, 7, 3, 3);
    r(g, 0xffffff, 2, 0, 1, 3);
    r(g, 0xff5a2e, 2, 10, 1, 2, 0.8);
  });

  // Muzzle flash (spawned at plane nose for 80ms)
  makeTex(scene, 'muzzle', 14, 14, (g) => {
    r(g, 0xffffff, 5, 5, 4, 4);
    r(g, 0xffe680, 4, 4, 6, 6, 0.95);
    r(g, 0xff9a2e, 3, 3, 8, 8, 0.75);
    r(g, 0xff5a2e, 2, 2, 10, 10, 0.45);
    r(g, 0xffe680, 6, 0, 2, 3);
    r(g, 0xffe680, 6, 11, 2, 3);
    r(g, 0xffe680, 0, 6, 3, 2);
    r(g, 0xffe680, 11, 6, 3, 2);
  });

  // ========================================================================
  // SPEEDBOAT (22x30) — hull w/ spray
  // ========================================================================
  makeTex(scene, 'speedboat', 22, 30, (g) => {
    const hull = 0x3a2020;
    const hullLight = 0x6a3a3a;
    const hullDark = 0x1a0a0a;
    const deck = 0xa53a3a;
    const deckLight = 0xc85050;
    const cockpitCol = 0xe0d5c0;
    const darkWin = 0x1a1a2a;

    // bow
    r(g, hullDark, 9, 0, 4, 2);
    r(g, hull, 8, 2, 6, 2);
    r(g, hull, 6, 4, 10, 3);
    // hull body
    r(g, hullDark, 4, 7, 14, 18);
    r(g, hull, 5, 7, 12, 18);
    r(g, hullLight, 5, 7, 1, 17);
    r(g, hullDark, 16, 7, 1, 17);
    // deck
    r(g, deck, 6, 10, 10, 10);
    r(g, deckLight, 6, 10, 10, 1);
    r(g, hullDark, 15, 10, 1, 10);
    // cockpit / windshield
    r(g, darkWin, 8, 12, 6, 4);
    r(g, cockpitCol, 9, 13, 4, 2);
    r(g, 0x8dcff0, 9, 13, 4, 1);
    // pilot
    r(g, 0x3a2a1a, 10, 16, 2, 2);
    // stern
    r(g, hullDark, 5, 25, 12, 2);
    r(g, hull, 6, 25, 10, 1);
    // wake
    r(g, 0xdde9f4, 6, 27, 2, 2, 0.8);
    r(g, 0xdde9f4, 10, 27, 2, 3, 0.8);
    r(g, 0xdde9f4, 14, 27, 2, 2, 0.8);
    // bow spray
    r(g, 0xe8f4ff, 4, 5, 2, 2, 0.7);
    r(g, 0xe8f4ff, 16, 5, 2, 2, 0.7);
  });

  // ========================================================================
  // HELICOPTER (40x22 body) + separate rotor
  // ========================================================================
  makeTex(scene, 'heli', 40, 22, (g) => {
    const body = 0x3a5542;
    const bodyLight = 0x5a7d62;
    const bodyDark = 0x1c2a22;
    const cockpitCol = 0x1a1a1a;
    const glassCol = 0x87c5e0;
    const glassLight = 0xc5e5f5;
    const red = 0xb84545;

    // tail boom
    r(g, bodyDark, 0, 9, 14, 4);
    r(g, body, 1, 9, 13, 3);
    r(g, bodyLight, 1, 9, 13, 1);
    // tail fin
    r(g, bodyDark, 0, 6, 4, 10);
    r(g, body, 1, 7, 3, 8);
    r(g, red, 1, 10, 3, 1);
    // tail rotor
    r(g, cockpitCol, 0, 5, 1, 12);
    // main body
    r(g, bodyDark, 13, 4, 20, 14);
    r(g, body, 14, 4, 18, 14);
    r(g, bodyLight, 14, 4, 18, 1);
    r(g, bodyDark, 14, 17, 18, 1);
    // cockpit glass
    r(g, cockpitCol, 27, 6, 6, 10);
    r(g, glassCol, 28, 7, 4, 8);
    r(g, glassLight, 28, 7, 4, 2);
    // nose
    r(g, bodyDark, 33, 8, 3, 6);
    r(g, body, 33, 9, 3, 4);
    // skids
    r(g, bodyDark, 15, 19, 15, 1);
    r(g, bodyDark, 16, 18, 1, 3);
    r(g, bodyDark, 19, 18, 1, 3);
    r(g, bodyDark, 26, 18, 1, 3);
    r(g, bodyDark, 29, 18, 1, 3);
    // gun pod
    r(g, cockpitCol, 14, 11, 1, 4);
    r(g, red, 14, 11, 1, 1);
    // rotor hub
    r(g, cockpitCol, 21, 0, 6, 4);
    r(g, bodyDark, 22, 0, 4, 3);
    r(g, bodyLight, 23, 1, 2, 1);
  });

  makeTex(scene, 'heli_rotor', 44, 6, (g) => {
    const dark = 0x1a1a1a;
    r(g, dark, 0, 2, 44, 2, 0.85);
    r(g, 0x3a3a3a, 0, 2, 44, 1, 0.4);
    r(g, 0x6a6a6a, 20, 2, 4, 2);
  });

  makeTex(scene, 'rotor_wash', 60, 20, (g) => {
    g.fillStyle(0xdde9f4, 0.12);
    g.fillCircle(30, 10, 28);
    g.fillStyle(0xdde9f4, 0.18);
    g.fillCircle(30, 10, 20);
  });

  // ========================================================================
  // ENEMY JET (28x36, facing down)
  // ========================================================================
  makeTex(scene, 'jet', 28, 36, (g) => {
    const body = 0x6a3a3a;
    const bodyLight = 0x9a5a5a;
    const bodyDark = 0x3a1a1a;
    const red = 0xb84545;
    const darkAccent = 0x2a1515;
    const glassCol = 0x6aa5c8;
    const glassLight = 0xb8dcef;
    const missile = 0x8a8a8a;

    // tail / rear (bottom of sprite = rear)
    r(g, bodyDark, 12, 34, 4, 2);
    r(g, body, 13, 33, 2, 3);
    r(g, 0xff9a2e, 12, 35, 4, 1);
    // vertical tail
    r(g, body, 13, 29, 2, 5);
    r(g, red, 13, 29, 2, 1);
    // rear fuselage
    r(g, bodyDark, 11, 22, 6, 10);
    r(g, body, 12, 22, 4, 10);
    r(g, bodyLight, 12, 22, 1, 10);
    // mid fuselage
    r(g, bodyDark, 10, 14, 8, 10);
    r(g, body, 11, 14, 6, 10);
    r(g, bodyLight, 11, 14, 1, 10);
    // cockpit
    r(g, darkAccent, 12, 16, 4, 5);
    r(g, glassCol, 12, 17, 4, 3);
    r(g, glassLight, 12, 17, 4, 1);
    // front fuselage
    r(g, bodyDark, 11, 6, 6, 10);
    r(g, body, 12, 6, 4, 10);
    // nose
    r(g, bodyDark, 12, 2, 4, 4);
    r(g, body, 13, 2, 2, 4);
    r(g, darkAccent, 13, 0, 2, 3);
    // main wings (swept)
    r(g, bodyDark, 0, 13, 28, 1);
    r(g, body, 0, 14, 28, 4);
    r(g, bodyLight, 1, 14, 26, 1);
    r(g, red, 0, 14, 3, 4);
    r(g, red, 25, 14, 3, 4);
    // wingtip missiles
    r(g, missile, 1, 18, 2, 4);
    r(g, 0xff9a2e, 1, 22, 2, 1);
    r(g, missile, 25, 18, 2, 4);
    r(g, 0xff9a2e, 25, 22, 2, 1);
    // tail wings
    r(g, bodyDark, 5, 27, 18, 1);
    r(g, body, 5, 28, 18, 3);
    r(g, red, 5, 28, 2, 3);
    r(g, red, 21, 28, 2, 3);
  });

  // ========================================================================
  // SEA MINE (24x24) — detailed with spikes + rust + chain
  // ========================================================================
  makeTex(scene, 'mine', 24, 24, (g) => {
    const body = 0x1a1a1a;
    const bodyLight = 0x3a3a3a;
    const bodyDark = 0x0a0a0a;
    const spike = 0x3a3a3a;
    const spikeLight = 0x5a5a5a;
    const rust = 0x7a3a1a;
    const rustLight = 0x9a4a1a;

    // spikes (8 directions)
    r(g, spike, 11, 0, 2, 4);
    r(g, spikeLight, 11, 0, 1, 4);
    r(g, spike, 11, 20, 2, 4);
    r(g, spikeLight, 11, 20, 1, 4);
    r(g, spike, 0, 11, 4, 2);
    r(g, spikeLight, 0, 11, 4, 1);
    r(g, spike, 20, 11, 4, 2);
    r(g, spikeLight, 20, 11, 4, 1);
    r(g, spike, 3, 3, 3, 3);
    r(g, spikeLight, 3, 3, 2, 1);
    r(g, spike, 18, 3, 3, 3);
    r(g, spike, 3, 18, 3, 3);
    r(g, spike, 18, 18, 3, 3);
    // body
    r(g, bodyDark, 4, 4, 16, 16);
    r(g, body, 5, 5, 14, 14);
    r(g, bodyLight, 5, 5, 14, 2);
    r(g, bodyLight, 5, 5, 2, 14);
    r(g, bodyDark, 17, 7, 2, 12);
    r(g, bodyDark, 7, 17, 12, 2);
    // rust patches
    r(g, rust, 7, 10, 3, 2);
    r(g, rustLight, 7, 10, 2, 1);
    r(g, rust, 14, 14, 2, 3);
    // detonator cap (top)
    r(g, bodyLight, 10, 5, 4, 2);
    r(g, rustLight, 11, 5, 2, 1);
    // bolts
    r(g, spikeLight, 7, 7, 1, 1);
    r(g, spikeLight, 16, 7, 1, 1);
    r(g, spikeLight, 7, 16, 1, 1);
    r(g, spikeLight, 16, 16, 1, 1);
  });

  // ========================================================================
  // MISSILE (6x16, ship-to-ship)
  // ========================================================================
  makeTex(scene, 'missile', 6, 16, (g) => {
    r(g, 0x3a3a3a, 2, 0, 2, 2);
    r(g, 0xdddddd, 1, 2, 4, 10);
    r(g, 0xf5f5f5, 2, 2, 2, 10);
    r(g, 0xaaaaaa, 4, 2, 1, 10);
    // fins
    r(g, 0xd6443a, 0, 4, 6, 1);
    r(g, 0xd6443a, 0, 10, 6, 1);
    r(g, 0x8a2a22, 0, 4, 1, 1);
    r(g, 0x8a2a22, 5, 4, 1, 1);
    // exhaust
    r(g, 0xff9a2e, 1, 13, 4, 1);
    r(g, 0xffe680, 2, 14, 2, 2);
    r(g, 0xffffff, 2, 14, 2, 1);
  });

  // ========================================================================
  // EXPLOSION — 4 frames, 24x24
  // ========================================================================
  const ex1 = 0xffffff;
  const ex2 = 0xffe680;
  const ex3 = 0xff9a2e;
  const ex4 = 0xff5a2e;
  const exSmoke = 0x3a3a3a;

  makeTex(scene, 'explosion_1', 24, 24, (g) => {
    g.fillStyle(ex1, 1); g.fillCircle(12, 12, 5);
    g.fillStyle(ex2, 0.9); g.fillCircle(12, 12, 7);
    g.fillStyle(ex3, 0.6); g.fillCircle(12, 12, 9);
  });
  makeTex(scene, 'explosion_2', 24, 24, (g) => {
    g.fillStyle(ex1, 1); g.fillCircle(12, 12, 3);
    g.fillStyle(ex2, 1); g.fillCircle(12, 12, 8);
    g.fillStyle(ex3, 0.85); g.fillCircle(12, 12, 11);
    g.fillStyle(ex4, 0.5); g.fillCircle(12, 12, 12);
    r(g, ex2, 2, 11, 4, 2);
    r(g, ex2, 18, 11, 4, 2);
    r(g, ex2, 11, 2, 2, 4);
    r(g, ex2, 11, 18, 2, 4);
  });
  makeTex(scene, 'explosion_3', 24, 24, (g) => {
    g.fillStyle(ex3, 0.9); g.fillCircle(12, 12, 10);
    g.fillStyle(ex4, 0.7); g.fillCircle(12, 12, 12);
    g.fillStyle(exSmoke, 0.5); g.fillCircle(12, 12, 11);
    r(g, ex2, 6, 6, 3, 3);
    r(g, ex2, 15, 15, 3, 3);
    r(g, ex3, 16, 6, 2, 2);
    r(g, ex3, 6, 16, 2, 2);
  });
  makeTex(scene, 'explosion_4', 24, 24, (g) => {
    g.fillStyle(exSmoke, 0.7); g.fillCircle(12, 12, 10);
    g.fillStyle(0x7a7a7a, 0.5); g.fillCircle(10, 10, 6);
    g.fillStyle(0x5a5a5a, 0.6); g.fillCircle(14, 14, 5);
    r(g, ex3, 11, 11, 3, 3, 0.4);
  });

  // spark particle (legacy key retained)
  makeTex(scene, 'spark', 6, 6, (g) => {
    r(g, 0xffffff, 2, 2, 2, 2);
    r(g, 0xffe680, 1, 1, 4, 4, 0.85);
    r(g, 0xff9a2e, 0, 0, 6, 6, 0.5);
  });
  makeTex(scene, 'smoke', 8, 8, (g) => {
    g.fillStyle(0x7a7a7a, 0.6); g.fillCircle(4, 4, 4);
    g.fillStyle(0x5a5a5a, 0.8); g.fillCircle(4, 4, 2);
  });

  // ========================================================================
  // FUEL PICKUP (28x28) — offshore tanker platform
  // ========================================================================
  makeTex(scene, 'fuel', 28, 28, (g) => {
    const metal = 0xb0b0b0;
    const metalDark = 0x6a6a6a;
    const metalLight = 0xd0d0d0;
    const orange = 0xff9a2e;
    const orangeLight = 0xffc06a;
    const dark = 0x2a2a2a;

    // platform shadow
    r(g, dark, 3, 6, 22, 18);
    // metal frame
    r(g, metalDark, 3, 6, 22, 1);
    r(g, metal, 4, 7, 20, 16);
    r(g, metalLight, 4, 7, 20, 1);
    r(g, metalDark, 4, 22, 20, 1);
    // tank body
    r(g, dark, 6, 10, 16, 10);
    r(g, orange, 7, 10, 14, 9);
    r(g, orangeLight, 7, 10, 14, 1);
    r(g, dark, 20, 10, 1, 9);
    // "F" lettering
    r(g, dark, 10, 12, 1, 5);
    r(g, dark, 10, 12, 3, 1);
    r(g, dark, 10, 14, 2, 1);
    // gauge
    r(g, metalDark, 15, 13, 3, 3);
    r(g, orangeLight, 16, 14, 1, 1);
    // legs
    r(g, metalDark, 3, 23, 2, 4);
    r(g, metalDark, 23, 23, 2, 4);
    r(g, metalDark, 9, 24, 2, 3);
    r(g, metalDark, 17, 24, 2, 3);
    // flag on top
    r(g, metalDark, 13, 3, 1, 7);
    r(g, orange, 14, 3, 4, 2);
    r(g, orangeLight, 14, 3, 4, 1);
    // rivets
    r(g, dark, 5, 8, 1, 1);
    r(g, dark, 22, 8, 1, 1);
    r(g, dark, 5, 21, 1, 1);
    r(g, dark, 22, 21, 1, 1);
  });

  // ========================================================================
  // REPAIR KIT (22x22)
  // ========================================================================
  makeTex(scene, 'repair', 22, 22, (g) => {
    const crate = 0xd0a06a;
    const crateLight = 0xe8bd82;
    const crateDark = 0x8a6a40;
    const white = 0xf5f5f5;
    const red = 0xd6443a;
    const redDark = 0x8a2a22;

    // crate base
    r(g, crateDark, 1, 3, 20, 17);
    r(g, crate, 2, 4, 18, 15);
    r(g, crateLight, 2, 4, 18, 1);
    r(g, crateDark, 19, 4, 1, 15);
    // metal bands
    r(g, crateDark, 2, 10, 18, 1);
    r(g, crateDark, 2, 14, 18, 1);
    // medical patch
    r(g, white, 5, 6, 12, 12);
    r(g, 0xaaaaaa, 5, 17, 12, 1);
    r(g, red, 9, 7, 4, 10);
    r(g, red, 7, 10, 8, 4);
    r(g, redDark, 11, 7, 1, 10);
    r(g, redDark, 7, 12, 8, 1);
    // bounce indicator
    r(g, crateLight, 4, 4, 1, 1);
  });

  // ========================================================================
  // WAKE FOAM (legacy)
  // ========================================================================
  makeTex(scene, 'foam', 4, 4, (g) => {
    r(g, 0xffffff, 1, 1, 2, 2);
    r(g, 0xdde9f4, 0, 0, 4, 4, 0.7);
  });

  // Coast foam flake — used along shoreline
  makeTex(scene, 'coast_foam', 12, 4, (g) => {
    r(g, 0xffffff, 2, 0, 8, 2, 0.95);
    r(g, 0xdde9f4, 0, 1, 12, 3, 0.7);
    r(g, 0xffffff, 4, 2, 4, 1, 0.9);
  });

  // ========================================================================
  // WARNING RETICLE (20x20)
  // ========================================================================
  makeTex(scene, 'reticle', 20, 20, (g) => {
    g.lineStyle(2, 0xff4a4a, 1);
    g.strokeCircle(10, 10, 8);
    g.lineStyle(1, 0xffcc33, 0.8);
    g.strokeCircle(10, 10, 4);
    r(g, 0xff4a4a, 9, 1, 2, 4);
    r(g, 0xff4a4a, 9, 15, 2, 4);
    r(g, 0xff4a4a, 1, 9, 4, 2);
    r(g, 0xff4a4a, 15, 9, 4, 2);
    r(g, 0xff4a4a, 9, 9, 2, 2);
  });

  // ========================================================================
  // CLOUDS (3 sizes, soft drop shadow)
  // ========================================================================
  const drawCloud = (g: P, w: number, h: number) => {
    const r0 = Math.floor(h * 0.42);
    const cy = Math.floor(h * 0.55);
    // shadow under
    g.fillStyle(0x000000, 0.2);
    g.fillCircle(w * 0.3, cy + 2, r0);
    g.fillCircle(w * 0.5, cy + 3, r0 + 2);
    g.fillCircle(w * 0.72, cy + 2, r0);
    // main cloud
    g.fillStyle(0xf5f8fb, 0.9);
    g.fillCircle(w * 0.3, cy, r0);
    g.fillCircle(w * 0.5, cy - 2, r0 + 2);
    g.fillCircle(w * 0.72, cy, r0);
    g.fillCircle(w * 0.2, cy + 2, r0 * 0.7);
    g.fillCircle(w * 0.82, cy + 2, r0 * 0.7);
    // highlights
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(w * 0.38, cy - 3, r0 * 0.6);
    g.fillCircle(w * 0.62, cy - 3, r0 * 0.6);
  };
  makeTex(scene, 'cloud_s', 48, 20, (g) => drawCloud(g, 48, 20));
  makeTex(scene, 'cloud_m', 72, 28, (g) => drawCloud(g, 72, 28));
  makeTex(scene, 'cloud_l', 110, 40, (g) => drawCloud(g, 110, 40));

  // Sun glint (big soft highlight that drifts across water)
  makeTex(scene, 'sunglint', 120, 60, (g) => {
    g.fillStyle(0xffffff, 0.06);
    g.fillEllipse(60, 30, 120, 60);
    g.fillStyle(0xffffff, 0.10);
    g.fillEllipse(60, 30, 80, 40);
    g.fillStyle(0xffffff, 0.14);
    g.fillEllipse(60, 30, 40, 18);
  });

  // Wave cap (small horizontal whitecap that appears and fades)
  makeTex(scene, 'wavecap', 12, 3, (g) => {
    r(g, 0xffffff, 2, 0, 8, 1, 0.9);
    r(g, 0xdde9f4, 0, 1, 12, 2, 0.6);
  });

  // Water sparkle
  makeTex(scene, 'sparkle', 4, 4, (g) => {
    r(g, 0xffffff, 1, 0, 2, 4, 0.8);
    r(g, 0xffffff, 0, 1, 4, 2, 0.8);
  });
}
