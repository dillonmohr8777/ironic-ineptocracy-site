export const modes = ['daylight', 'dusk', 'midnight'] as const;
export type WorldMode = typeof modes[number];
export type Selection = WorldMode | 'auto';
export const labels: Record<WorldMode, string> = { daylight: 'Daylight Archive', dusk: 'Dusk Surveillance', midnight: 'Midnight Blackout' };
const modeKey = 'archive:edition', motionKey = 'archive:motion', DAY = 7, DUSK = 18;
export const worldChange = 'ineptocracy:world';
export const isMode = (v: unknown): v is WorldMode => modes.some(m => v === m);
export const scheduled = (h: number): WorldMode => h < DAY ? 'midnight' : h < DUSK ? 'daylight' : 'dusk';
// Parser-blocking head script: no React, async work or dependency on storage access.
export const beforePaint = `(()=>{let s,p;try{s=localStorage.getItem('${modeKey}');p=localStorage.getItem('${motionKey}')}catch{}const q=new URLSearchParams(location.search).get('mode'),a=${JSON.stringify(modes)},h=new Date().getHours(),r=document.documentElement.dataset;s=a.includes(q)?q:a.includes(s)?s:'auto';r.selection=s;r.mode=s==='auto'?(h<${DAY}?'midnight':h<${DUSK}?'daylight':'dusk'):s;r.motion=(p==='pause'||matchMedia('(prefers-reduced-motion: reduce)').matches)?'paused':'running'})();`;
const pref = () => matchMedia('(prefers-reduced-motion: reduce)');
let override: Selection | undefined, pause: boolean | undefined;
function read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }
function save(key: string, value: string) { try { localStorage.setItem(key, value); } catch { /* Private window: in-memory choice still works. */ } }
export function currentMode(): WorldMode { const m = document.documentElement.dataset.mode; return isMode(m) ? m : scheduled(new Date().getHours()); }
export function syncWorld() {
  const root = document.documentElement.dataset, q = new URLSearchParams(location.search).get('mode'), saved = override ?? read(modeKey);
  const choice = isMode(q) ? q : isMode(saved) ? saved : 'auto';
  const m = choice === 'auto' ? scheduled(new Date().getHours()) : choice;
  const motion = (pause ?? (read(motionKey) === 'pause')) || pref().matches ? 'paused' : 'running';
  if (root.mode === m && root.selection === choice && root.motion === motion) return;
  root.mode = m; root.selection = choice; root.motion = motion;
  window.dispatchEvent(new Event(worldChange));
}
export function chooseMode(value: Selection) {
  const url = new URL(location.href); if (url.searchParams.has('mode')) { url.searchParams.delete('mode'); history.replaceState(history.state, '', url); }
  override = value; save(modeKey, value); syncWorld();
}
export function pauseMotion(value: boolean) { pause = value; save(motionKey, value ? 'pause' : 'run'); syncWorld(); }
export function observeWorld(fn: () => void) { window.addEventListener(worldChange, fn); return () => window.removeEventListener(worldChange, fn); }
export function installClock() {
  const mq = pref(), storage = () => { override = undefined; pause = undefined; syncWorld(); };
  syncWorld(); const timer = window.setInterval(syncWorld, 1000);
  mq.addEventListener('change', syncWorld); window.addEventListener('storage', storage); window.addEventListener('pageshow', syncWorld); window.addEventListener('popstate', syncWorld); document.addEventListener('visibilitychange', syncWorld);
  return () => { clearInterval(timer); mq.removeEventListener('change', syncWorld); window.removeEventListener('storage', storage); window.removeEventListener('pageshow', syncWorld); window.removeEventListener('popstate', syncWorld); document.removeEventListener('visibilitychange', syncWorld); };
}
