import 'server-only';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { WorldMode } from './worldMode';
const source = (filename: string) => existsSync(join(process.cwd(),'public','video',filename)) ? `/video/${filename}` : null;
export const films: Record<WorldMode,string|null> = {daylight: '/video/hero-daylight-loop.mp4', dusk:source('hero-dusk-surveillance-loop.mp4'), midnight:source('hero-midnight-horror-loop.mp4')};
