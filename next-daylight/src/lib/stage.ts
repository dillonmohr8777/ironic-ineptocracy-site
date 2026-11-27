// One exposure clock for the room, textile, masthead shadows and sound. No random flashes.
import { currentMode, modes, observeWorld } from './worldMode';
export function ballast(time: number) {
  const phase = time % 11.6;
  const dip = (center: number, width: number) => Math.exp(-((phase - center) ** 2) / (2 * width ** 2));
  return Math.max(.18, 1 - .54 * dip(1.45, .26) - .44 * dip(2.35, .28) - .76 * dip(6.2, .38) - .38 * dip(7.65, .44));
}
export type Exposure = { time: number; dt: number; mode: number; flicker: number; x: number; y: number; scroll: number };
export type Renderer = { draw: (frame: Exposure) => void; dispose: () => void };
let time = 0, last = 0, frame = 0, x = 0, y = 0, targetX = 0, targetY = 0, zoom = 0;
let light = 1;
export const currentBallast = () => light;
const stages = new Set<(f: Exposure) => void>();
const running = () => document.documentElement.dataset.motion !== 'paused' && !document.hidden;
function expose(dt: number) {
  time += dt; const k = 1 - Math.exp(-dt * 3.8);
  x += (targetX - x) * k; y += (targetY - y) * k; zoom += (Math.min(1, scrollY / 800) - zoom) * k;
  const mode = modes.indexOf(currentMode()); light = mode === 2 ? ballast(time) : 1;
  document.documentElement.style.setProperty('--ballast', (mode === 2 && running() ? light : 1).toFixed(3));
  const e = { time, dt, mode, flicker: light, x, y, scroll: zoom }; stages.forEach(draw => draw(e));
}
function tick(now: number) { frame = 0; if (!stages.size || !running()) return; expose(last ? Math.min(.08, (now - last) / 1000) : 0); last = now; frame = requestAnimationFrame(tick); }
function sync() { cancelAnimationFrame(frame); frame = last = 0; if (!stages.size || document.hidden) return; expose(0); if (running()) frame = requestAnimationFrame(tick); }
function aim(e: PointerEvent) { targetX = Math.max(-1, Math.min(1, 2 * e.clientX / innerWidth - 1)); targetY = Math.max(-1, Math.min(1, 2 * e.clientY / innerHeight - 1)); }
// Lazy initialization and disposal are per plate; a lost context never disables the other plate.
export function mountStage(canvas: HTMLCanvasElement, init: () => Renderer | null) {
  let engine: Renderer | null = null, attempted = false, seen = false;
  const draw = (e: Exposure) => engine?.draw(e);
  const update = () => {
    if (seen && !document.hidden && !attempted) { attempted = true; try { engine = init(); } catch { engine = null; } canvas.dataset.renderer = engine ? 'webgl2' : 'print'; }
    if (seen && engine) stages.add(draw); else stages.delete(draw); sync();
  };
  const lost = (e: Event) => { e.preventDefault(); stages.delete(draw); engine?.dispose(); engine = null; canvas.dataset.renderer = 'print'; sync(); };
  const restore = () => { attempted = false; update(); };
  const io = new IntersectionObserver(([entry]) => { seen = entry.isIntersecting; update(); }); io.observe(canvas);
  const ro = new ResizeObserver(() => { if (seen) sync(); }); ro.observe(canvas);
  const off = observeWorld(update); document.addEventListener('visibilitychange', update); window.addEventListener('pointermove', aim, { passive: true });
  canvas.addEventListener('webglcontextlost', lost); canvas.addEventListener('webglcontextrestored', restore);
  return () => { off(); io.disconnect(); ro.disconnect(); canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', restore); document.removeEventListener('visibilitychange', update); window.removeEventListener('pointermove', aim); stages.delete(draw); engine?.dispose(); sync(); };
}
