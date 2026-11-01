/* ASCII dither backgrounds for the Systems hero (DL-146 to DL-151), after the 21st.dev ASCII recipes
   ("butterfly" by Vastien Azur-Fournier, "Violet ASCII Wave Hero Background").
   What the good ones share, and what this follows: one bold, smooth shape in one colour family on near-black, lots of
   empty space, small tight dots (an ordered dither, 4×4 dots in each 14px cell), and motion that comes from the shape
   itself drifting slowly, not from dots flickering.
   Each frame a scene is drawn small (one pixel per dot), then turned into dots. Scenes:
     data-scene="wave"    a slow violet ribbon of light across the panel, the Vela stars riding on it
     data-scene="stars"   the Vela constellation alone, large and calm, its stars breathing slowly
     data-scene="nebula"  soft violet clouds drifting, after the Vela supernova remnant, a few stars
   Gamma Velorum, the brightest star, is in the logo's raspberry in every scene.
   Use: <canvas class="ascii" data-scene="wave" data-bg="#050507"></canvas>. Pauses off screen; one still frame
   under reduced motion. */
(() => {
  const CELL = 14, SUB = 4, STEP = CELL / SUB, DOT = 2, EDGE = 0.5, FPS = 24;
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map(v => (v + 0.5) / 16);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hex = h => { const n = parseInt(h.replace('#', ''), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const VIOLET = '124,104,255', LILAC = '178,166,255', RASP = '214,92,140';

  // Vela's main stars: right ascension (h), declination (°), magnitude; drawn as a loop back to γ
  const VELA = [
    ['γ', 8.158, -47.336, 1.8], ['δ', 8.745, -54.708, 1.96], ['κ', 9.368, -55.011, 2.5], ['N', 9.520, -57.034, 3.1],
    ['φ', 9.948, -54.568, 3.5], ['μ', 10.779, -49.420, 2.7], ['q', 10.246, -42.122, 3.8], ['ψ', 9.511, -40.467, 3.6],
    ['λ', 9.133, -43.433, 2.2]
  ];
  function place(box) {
    const c = Math.cos(-48.7 * Math.PI / 180);
    const p = VELA.map(([n, ra, dec, m]) => [n, -(ra * 15) * c, -dec, m]);
    const xs = p.map(q => q[1]), ys = p.map(q => q[2]);
    const x0 = Math.min(...xs), y0 = Math.min(...ys), sx = Math.max(...xs) - x0, sy = Math.max(...ys) - y0;
    const s = Math.min(box.w / sx, box.h / sy);
    const ox = box.x + (box.w - sx * s) / 2, oy = box.y + (box.h - sy * s) / 2;
    return p.map(([n, x, y, m]) => ({ n, x: ox + (x - x0) * s, y: oy + (y - y0) * s, m }));
  }
  function glow(g, x, y, r, col, a) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(0.4, `rgba(${col},${a * 0.5})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
  }
  function star(g, st, r, t, i) {
    const k = 1 + 0.08 * Math.sin(t * 0.7 + i * 1.7); // slow breathing
    const col = st.n === 'γ' ? RASP : LILAC;
    glow(g, st.x, st.y, r * 2.4 * k, col, 0.55);
    glow(g, st.x, st.y, r * k, st.n === 'γ' ? '255,190,215' : '235,232,255', 1);
  }
  function lines(g, P, a, wdt) {
    g.strokeStyle = `rgba(${LILAC},${a})`; g.lineWidth = wdt; g.beginPath();
    P.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath(); g.stroke();
  }
  // the right-hand area on desktop (the text sits left), the top on phones
  const area = (w, h, narrow) => narrow ? { x: w * 0.08, y: h * 0.05, w: w * 0.84, h: h * 0.38 } : { x: w * 0.5, y: h * 0.12, w: w * 0.42, h: h * 0.76 };

  // A spiral galaxy filling the whole tile, with the Vela constellation behind it (DL-152, DL-153): tens of thousands
  // of faint star points that add up (two wide arms, the disc, a warm bulge), a bright core, a few raspberry knots,
  // tilted, turning very slowly (inner stars faster than outer). Built once per size, then rotated each frame.
  let GAL = null;
  function galaxy(w, h, narrow) {
    const key = w + 'x' + h;
    if (GAL && GAL.key === key) return GAL;
    let seed = 5; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const gauss = () => { let u = 0; for (let i = 0; i < 4; i++) u += rnd(); return (u - 2) / 1.15; };
    const R = narrow ? w * 1.1 : w * 0.62;  // big enough that the arms run off the edges of the tile
    const n = 46000, X = new Float32Array(n), A = new Float32Array(n), Br = new Float32Array(n), C = new Uint8Array(n);
    let k = 0;
    const add = (r, a, b, c) => { X[k] = r; A[k] = a; Br[k] = b; C[k] = c; k++; };
    for (let i = 0; i < 28000; i++) {       // the two arms, about one turn, wide
      const d = Math.pow(rnd(), 0.75), arm = i % 2;
      const a = arm * Math.PI + Math.log(1 + d * 9) * 2.9 + gauss() * (0.11 + 0.2 * (1 - d)); // tighter arms, about 1¼ turns
      const knot = rnd() < 0.008 && d > 0.3;
      add(d * R * (1 + gauss() * 0.03), a, knot ? 0.9 : (0.2 + rnd() * 0.34) * (1.15 - d * 0.5), knot ? 2 : (rnd() < 0.4 ? 1 : 0));
    }
    for (let i = 0; i < 9000; i++) {        // the disc between the arms, kept faint
      const d = Math.pow(rnd(), 0.7);
      add(d * R * 1.05, rnd() * Math.PI * 2, (0.05 + rnd() * 0.1) * (1.2 - d * 0.8), rnd() < 0.5 ? 1 : 0);
    }
    for (let i = 0; i < 5000; i++) {        // the bulge
      add(Math.abs(gauss()) * R * 0.14, rnd() * Math.PI * 2, 0.16 + rnd() * 0.24, 3);
    }
    const field = [];                         // distant stars across the tile
    for (let i = 0; i < Math.round(w * h / 240); i++) field.push([rnd() * w, rnd() * h, 0.4 + rnd() * 0.6]);
    GAL = { key, R, n: k, X, A, Br, C, field, cx: narrow ? w * 0.5 : w * 0.64, cy: narrow ? h * 0.42 : h * 0.5, acc: new Float32Array(w * h * 3) };
    return GAL;
  }
  // colours by index: violet, lilac, raspberry (knots), warm white (bulge)
  const GCOL = [[124, 104, 255], [178, 166, 255], [214, 92, 140], [255, 226, 236]];

  const SCENES = {
    galaxy(g, w, h, t, narrow) {
      const G = galaxy(w, h, narrow), tilt = 0.62, rot = -0.3, cr = Math.cos(rot), sr = Math.sin(rot);
      // in the back: the Vela constellation across the whole tile, and the distant stars
      const P = place({ x: w * 0.06, y: h * (narrow ? 0.06 : 0.1), w: w * 0.88, h: h * (narrow ? 0.6 : 0.8) });
      lines(g, P, 0.45, 1);
      P.forEach((p, i) => star(g, p, (4.6 - p.m) * 1.7 + 2.5, t, i));
      for (const [x, y, b] of G.field) { g.fillStyle = `rgba(235,232,255,${b})`; g.fillRect(x, y, 1, 1); }
      glow(g, G.cx, G.cy, G.R * 0.8, VIOLET, 0.1);
      // the galaxy: add every star's light into a buffer (much faster than drawing each one), then lay it on top
      const acc = G.acc; acc.fill(0);
      for (let i = 0; i < G.n; i++) {
        const r = G.X[i], a = G.A[i] + t * 0.04 / (0.25 + r / G.R);
        const x = Math.cos(a) * r, y = Math.sin(a) * r * tilt;
        const px = (G.cx + x * cr - y * sr) | 0, py = (G.cy + x * sr + y * cr) | 0;
        if (px < 0 || py < 0 || px >= w || py >= h) continue;
        const j = (py * w + px) * 3, c = GCOL[G.C[i]], b = G.Br[i];
        acc[j] += c[0] * b; acc[j + 1] += c[1] * b; acc[j + 2] += c[2] * b;
      }
      const im = g.getImageData(0, 0, w, h), d = im.data;
      for (let i = 0, j = 0; i < d.length; i += 4, j += 3) { d[i] += acc[j]; d[i + 1] += acc[j + 1]; d[i + 2] += acc[j + 2]; }
      g.putImageData(im, 0, 0);
      glow(g, G.cx, G.cy, G.R * 0.16, '255,214,232', 0.6);              // the bright core
      glow(g, G.cx, G.cy, G.R * 0.045, '255,255,255', 0.9);
    },
    wave(g, w, h, t, narrow) {
      // three ribbons sweeping up to the right, each a stack of wide faint strokes around a bright core
      const path = (k) => {
        g.beginPath();
        for (let x = -20; x <= w + 20; x += 3) {
          const u = x / w;
          const y = h * (narrow ? 0.62 : 0.95) - u * h * (narrow ? 0.35 : 0.85)
            + Math.sin(u * 3.1 + t * 0.22 + k * 1.3) * h * 0.11 + Math.sin(u * 7.3 - t * 0.15 + k) * h * 0.03;
          x < -19 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
      };
      g.lineCap = 'round';
      [[0, 1], [1, 0.6], [2, 0.38]].forEach(([k, a]) => {
        [[0.34, 0.07], [0.22, 0.12], [0.12, 0.22], [0.05, 0.5], [0.018, 0.9]].forEach(([wd, al]) => {
          g.strokeStyle = `rgba(${wd < 0.03 ? LILAC : VIOLET},${al * a})`; g.lineWidth = h * wd; path(k); g.stroke();
        });
      });
      const P = place(area(w, h, narrow));
      lines(g, P, 0.35, 1);
      P.forEach((p, i) => star(g, p, (4.6 - p.m) * 1.6 + 2, t, i));
    },
    stars(g, w, h, t, narrow) {
      const P = place(area(w, h, narrow));
      const c = P.reduce((a, p) => [a[0] + p.x / P.length, a[1] + p.y / P.length], [0, 0]);
      glow(g, c[0], c[1], Math.min(w, h) * 0.55, VIOLET, 0.28 + 0.04 * Math.sin(t * 0.3));
      lines(g, P, 0.7, 1.2);
      P.forEach((p, i) => star(g, p, (4.6 - p.m) * 2.6 + 3, t, i));
    },
    nebula(g, w, h, t, narrow) {
      const a = area(w, h, narrow), cx = a.x + a.w / 2, cy = a.y + a.h / 2, R = Math.max(a.w, a.h);
      // large soft clouds drifting on slow circles
      [[0.0, 0.0, 0.62, VIOLET, 0.55], [0.22, -0.12, 0.42, LILAC, 0.45], [-0.25, 0.18, 0.46, VIOLET, 0.5],
       [0.12, 0.26, 0.3, RASP, 0.35], [-0.08, -0.28, 0.34, LILAC, 0.4], [0.34, 0.2, 0.26, VIOLET, 0.45]]
        .forEach(([dx, dy, r, col, al], i) => {
          const x = cx + dx * R + Math.sin(t * 0.12 + i * 2.1) * R * 0.05, y = cy + dy * R + Math.cos(t * 0.1 + i * 1.3) * R * 0.04;
          glow(g, x, y, r * R, col, al);
        });
      const P = place(a);
      lines(g, P, 0.3, 1);
      P.forEach((p, i) => star(g, p, (4.6 - p.m) * 1.4 + 2, t, i));
    }
  };

  function setup(canvas) {
    const ctx = canvas.getContext('2d');
    const bg = hex(canvas.dataset.bg || '#050507');
    const scene = SCENES[canvas.dataset.scene] || SCENES.wave;
    // data-recipe="butterfly" (DL-154): the 21st.dev butterfly recipe exactly as pasted. The scene is drawn once
    // and held still (it plays the part of the recipe's photo); the only motion is the recipe's ripple
    // (animSpeed 100, animIntensity 60); the faint 14px cell grid of the original sits on the solid ground.
    const recipe = canvas.dataset.recipe === 'butterfly';
    const RIPPLE_SPEED = 1.0, RIPPLE_INTENSITY = 0.6;
    let W, H, sw, sh, frame, buf, base, off, o, T, Dist, L, Col, visible = true, raf = 0, last = 0;

    function size() {
      W = Math.max(1, Math.round(canvas.clientWidth)); H = Math.max(1, Math.round(canvas.clientHeight));
      canvas.width = W; canvas.height = H; // CSS pixels, scaled crisply (image-rendering: pixelated)
      sw = Math.ceil(W / STEP); sh = Math.ceil(H / STEP);
      off = document.createElement('canvas'); off.width = sw; off.height = sh;
      o = off.getContext('2d', { willReadFrequently: true });
      frame = ctx.createImageData(W, H); buf = new Uint32Array(frame.data.buffer);
      const px = (r, g, b) => (255 << 24) | (b << 16) | (g << 8) | r;
      const ground = px(bg[0], bg[1], bg[2]), line = px(Math.min(255, bg[0] + 14), Math.min(255, bg[1] + 14), Math.min(255, bg[2] + 18));
      base = new Uint32Array(W * H);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) base[y * W + x] = recipe && (x % CELL === 0 || y % CELL === 0) ? line : ground;
      T = new Float32Array(sw * sh); Dist = new Float32Array(sw * sh);
      for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
        T[y * sw + x] = BAYER[(y % SUB) * 4 + (x % SUB)];
        Dist[y * sw + x] = Math.hypot(x - sw / 2, y - sh / 2) / SUB; // in cells, for the ripple
      }
      L = null;
    }

    // draw the scene and work out each dot's brightness (with edge emphasis) and colour (with colour-dodge)
    function sampleScene(t) {
      o.globalCompositeOperation = 'source-over'; o.fillStyle = '#000'; o.fillRect(0, 0, sw, sh);
      o.globalCompositeOperation = 'lighter'; // light adds up
      scene(o, sw, sh, t, W < 760);
      const d = o.getImageData(0, 0, sw, sh).data, n = sw * sh;
      L = new Float32Array(n); Col = new Uint32Array(n);
      for (let y = 0; y < sh; y++) for (let x = 0; x < sw; x++) {
        const i = y * sw + x, j = i * 4;
        let l = (0.2126 * d[j] + 0.7152 * d[j + 1] + 0.0722 * d[j + 2]) / 255;
        if (x < sw - 1 && y < sh - 1) { // edge emphasis 50
          const lr = (0.2126 * d[j + 4] + 0.7152 * d[j + 5] + 0.0722 * d[j + 6]) / 255;
          const k = j + sw * 4, ld = (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255;
          l = Math.min(1, l + Math.min(1, Math.abs(l - lr) + Math.abs(l - ld)) * EDGE);
        }
        L[i] = l;
        const f = 1 / Math.max(0.25, 1 - l * 0.45); // styleBlend colour-dodge
        Col[i] = (255 << 24) | (Math.min(255, d[j + 2] * f) << 16) | (Math.min(255, d[j + 1] * f) << 8) | Math.min(255, d[j] * f);
      }
    }

    function draw(time) {
      const t = time / 1000;
      if (!recipe || !L) sampleScene(recipe ? 0 : t);
      buf.set(base);
      const amp = recipe && !reduce ? 0.25 * RIPPLE_INTENSITY : 0, tt = t * RIPPLE_SPEED;
      for (let y = 0; y < sh; y++) {
        const py = Math.round(y * STEP + (STEP - DOT) / 2);
        for (let x = 0; x < sw; x++) {
          const i = y * sw + x, l = L[i];
          if (l < 0.02) continue;
          // the recipe's ripple: rings move out from the centre, pushing dots over or under their threshold
          const rip = amp ? amp * Math.sin(Dist[i] * 0.32 - tt * 2.4) : 0;
          if (l + rip <= T[i]) continue;
          const c = Col[i], pxx = Math.round(x * STEP + (STEP - DOT) / 2);
          for (let yy = py; yy < py + DOT && yy < H; yy++) { const row = yy * W; for (let xx = pxx; xx < pxx + DOT && xx < W; xx++) buf[row + xx] = c; }
        }
      }
      ctx.putImageData(frame, 0, 0);
    }

    function loop(time) {
      raf = 0;
      if (!visible) return;
      if (time - last > 1000 / FPS) { last = time; draw(time); }
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && !reduce) raf = requestAnimationFrame(loop); }

    canvas.style.imageRendering = 'pixelated';
    size(); draw(performance.now()); start();
    new ResizeObserver(() => { size(); draw(performance.now()); }).observe(canvas);
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(canvas);
  }

  document.querySelectorAll('canvas.ascii').forEach(setup);
})();
