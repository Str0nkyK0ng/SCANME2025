// /D:/Development/SCANME/frontend/nameAnim.ts
// Creates 3 dangling wires that respond to the mouse.
// Usage: import this module (it auto-starts) or call startWires() to start and keep the returned stop() to clean up.

type Vec = { x: number; y: number };

class Rope {
  points: Vec[];
  prev: Vec[];
  lengths: number[];
  anchorX: number;
  anchorY: number;
  anchor2X?: number;
  anchor2Y?: number;
  fixedEnds: boolean = false;
  segmentLength: number;
  color: string;
  stiffness: number;

  constructor(
    anchorX: number,
    anchorY: number,
    segments = 3,
    length = 100,
    color = '#222',
    stiffness = 1
  ) {
    this.anchorX = anchorX;
    this.anchorY = anchorY;
    this.segmentLength = length / segments;
    this.color = color;
    this.stiffness = stiffness;

    this.points = new Array(segments + 1)
      .fill(0)
      .map((_, i) => ({ x: anchorX, y: anchorY + i * this.segmentLength }));
    this.prev = this.points.map((p) => ({ x: p.x, y: p.y }));
    this.lengths = new Array(segments).fill(this.segmentLength);
  }

  // new: set a second fixed anchor on the rope (makes both ends anchored)
  setSecondAnchor(x: number, y: number) {
    this.anchor2X = x;
    this.anchor2Y = y;
    this.fixedEnds = true;

    // reposition points evenly between anchorA and anchorB
    const n = this.points.length;
    const dx = (x - this.anchorX) / (n - 1);
    const dy = (y - this.anchorY) / (n - 1);
    for (let i = 0; i < n; i++) {
      const nx = this.anchorX + dx * i;
      const ny = this.anchorY + dy * i;
      this.points[i].x = nx;
      this.points[i].y = ny;
      this.prev[i].x = nx;
      this.prev[i].y = ny;
    }

    // recompute segment lengths to match the distance
    const total = Math.hypot(x - this.anchorX, y - this.anchorY);
    const seg = total / (n - 1);
    for (let i = 0; i < this.lengths.length; i++) this.lengths[i] = seg;
  }

  verlet(dt: number, gravity: number, mouse: Vec | null) {
    const damping = 0.995;
    // integrate
    for (let i = 1; i < this.points.length; i++) {
      const p = this.points[i];
      const pv = this.prev[i];
      const vx = (p.x - pv.x) * damping;
      const vy = (p.y - pv.y) * damping;
      pv.x = p.x;
      pv.y = p.y;
      p.x += vx;
      p.y += vy + gravity * dt * dt;
    }

    // mouse interaction: attract/repel near tip or entire rope slightly
    if (mouse) {
      for (let i = 0; i < this.points.length; i++) {
        const p = this.points[i];
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distSq = dx * dx + dy * dy;
        const influenceRadius = 120 + i * 6; // tips more influenced
        if (distSq < influenceRadius * influenceRadius) {
          const dist = Math.sqrt(distSq) || 1;
          // stronger effect near pointer; change multiplier to switch attract/repel
          const force =
            (1 - dist / influenceRadius) * (i / this.points.length) * 350;
          p.x += (dx / dist) * force * 0.02;
          p.y += (dy / dist) * force * 0.02;
        }
      }
    }

    // constraints (solve multiple times for stiffness)
    for (let k = 0; k < Math.round(4 * this.stiffness); k++) {
      // anchor constraint (first point fixed)
      this.points[0].x = this.anchorX;
      this.points[0].y = this.anchorY;

      // if both ends fixed, keep last point at anchor2
      if (
        this.fixedEnds &&
        typeof this.anchor2X === 'number' &&
        typeof this.anchor2Y === 'number'
      ) {
        const last = this.points[this.points.length - 1];
        last.x = this.anchor2X;
        last.y = this.anchor2Y;
      }

      for (let i = 0; i < this.points.length - 1; i++) {
        const a = this.points[i];
        const b = this.points[i + 1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const diff = (dist - this.lengths[i]) / dist;

        // mass: 0 for fixed ends, 1 for free
        const massA = i === 0 ? 0 : 1;
        const massB =
          i + 1 === this.points.length - 1 && this.fixedEnds ? 0 : 1;
        const totalMass = massA + massB;
        const moveA = totalMass === 0 ? 0 : massA / totalMass;
        const moveB = totalMass === 0 ? 0 : massB / totalMass;

        // apply
        b.x -= dx * diff * moveB;
        b.y -= dy * diff * moveB;
        if (moveA) {
          a.x += dx * diff * moveA;
          a.y += dy * diff * moveA;
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.lineWidth = 3;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.strokeStyle = this.color;
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur = 6;

    // draw as smooth polyline using quadratic curves
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length - 1; i++) {
      const p = this.points[i];
      const next = this.points[i + 1];
      const cx = p.x;
      const cy = p.y;
      const nx = (p.x + next.x) / 2;
      const ny = (p.y + next.y) / 2;
      ctx.quadraticCurveTo(cx, cy, nx, ny);
    }
    // last segment to last point
    const last = this.points[this.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
    ctx.restore();
  }

  setAnchor(x: number, y: number) {
    this.anchorX = x;
    this.anchorY = y;
  }
}

let raf = 0;
let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let ropes: Rope[] = [];
let pointer: Vec | null = null;
let running = false;

function startWires(parent: HTMLElement = document.body) {
  if (running) return () => stopWires();
  running = true;

  canvas = document.getElementById('backgroundCanvas') as HTMLCanvasElement;

  ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('2D context not supported');

  function resize() {
    if (!canvas) return;
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    // reposition anchors
    const w = canvas.width;
    const top = window.innerHeight;
    const leftX = Math.max(8, Math.round(w * 0.02));
    const rightX = Math.min(w - 8, Math.round(w * 0.98));

    if (ropes.length === 0) {
      ropes = [];
      ropes.push(new Rope(w / 2, top, w, top / 2, '#000000', 0.3));
      // ropes.push(new Rope(w / 2, 0, w/2, top / 2, '#000000', 0.3));
    } else {
      // update existing ropes' anchors (keep stagger)
      ropes.forEach((r, i) => {
        const ys = [top, top + 8, top + 18];
        r.setAnchor(leftX, ys[i]);
        r.setSecondAnchor(rightX, ys[i]);
      });
    }
  }

  resize();
  window.addEventListener('resize', resize);

  // pointer handling (we want to observe mouse but not block UI; pointerEvents none on canvas prevents events on it)
  // attach to document to always capture pointer
  function onMove(e: MouseEvent | TouchEvent) {
    if (e instanceof TouchEvent) {
      const t = e.touches[0];
      if (t) pointer = { x: t.clientX, y: t.clientY };
    } else {
      pointer = { x: e.clientX, y: e.clientY };
    }
  }
  function onLeave() {
    pointer = null;
  }
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('mouseout', onLeave, { passive: true });
  window.addEventListener('touchend', onLeave, { passive: true });

  let last = performance.now();
  function frame(now: number) {
    pointer = {
      x:
        (Math.sin((performance.now() / 500) * Math.random()) *
          window.innerWidth) /
          4 +
        window.innerWidth / 2,
      y:
        (Math.cos((performance.now() * 2) / 500) * window.innerHeight) / 4 +
        window.innerHeight / 2,
    };

    const dt = Math.min(32, now - last) / 1000; // clamp dt
    last = now;
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // subtle background vignette to make wires readable
      ctx.save();
      ctx.restore();

      // update and draw ropes
      for (const r of ropes) {
        r.verlet(dt, 900, pointer); // gravity px/s^2
        r.draw(ctx);
      }
    }
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return function stopWires() {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('mouseout', onLeave);
    window.removeEventListener('touchend', onLeave);
    if (canvas && canvas.parentElement)
      canvas.parentElement.removeChild(canvas);
    canvas = null;
    ctx = null;
    ropes = [];
    pointer = null;
  };
}

// auto-start
const stop = startWires();

// export stop in case someone wants to remove
function stopWires() {
  if (typeof stop === 'function') stop();
}

startWires();
