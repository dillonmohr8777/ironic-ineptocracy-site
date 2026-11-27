import { cp, rm, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { paths, assets } from '../next-daylight/scripts/edition-files.mjs';
const app=fileURLToPath(new URL('../next-daylight/',import.meta.url));
const dist=new URL('../dist/',import.meta.url);
function run(bin,args){const r=spawnSync(bin,args,{cwd:app,stdio:'inherit',env:{...process.env,CI:'true',NEXT_TELEMETRY_DISABLED:'1'}});if(r.error)throw r.error;if(r.status!==0)throw Error(`${bin} ${args.join(' ')} failed (${r.status})`)}
// A frozen lockfile on both paths; never fetch an unpinned Next via npx.
const pnpm=spawnSync('pnpm',['--version'],{cwd:app,stdio:'ignore'}).status===0;
if(pnpm){run('pnpm',['install','--frozen-lockfile']);run('pnpm',['build'])}
else {run('npm',['ci','--include=dev','--no-audit','--no-fund']);run('npm',['run','build'])}
await rm(dist,{recursive:true,force:true});await cp(`${app}out`,dist,{recursive:true});
for(const name of [...paths.map(p=>p.slice(1)+'index.html'),...assets,'404.html']){const f=await stat(new URL(name,dist));if(!f.isFile()||!f.size)throw Error(`Missing or empty: ${name}`)}
console.log(`dist/ verified: ${paths.length} canonical pages, 404 page, ${assets.length} publishing assets.`);
