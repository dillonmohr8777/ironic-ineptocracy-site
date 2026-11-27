// One publication manifest for root build verification and machine-readable editions.
import { readFile,writeFile } from 'node:fs/promises';
import {fileURLToPath,pathToFileURL} from 'node:url';
const app=new URL('../',import.meta.url);
const load=async file=>JSON.parse(await readFile(new URL(`src/lib/${file}.json`,app),'utf8'));
const [cast,essays]=await Promise.all(['cast','dispatches'].map(load));
const base='https://ironicineptocracy.com',name='The Ironic Ineptocracy', date='2026-11-27';
const sections=[['Book file','book'],['World atlas','world'],['The Garnier Dossier','dossier'],['Press room','press'],['Reader guide','reader-guide'],['Character files','characters'],['Dispatches','dispatches']];
// Assert the actual historic set, not just a count of arbitrary slugs.
const requiredCast='alec-daheim avigail darnell-covington dijon-garnier dre-cole javon-whitfield leah mark ronald-mcnulty sabrina'.split(' ');
const requiredEssays='books-like-1984-but-funny political-corruption-fiction political-satire-books-government-incompetence political-thriller-book-club-questions the-file-opens the-garnier-position the-memory-economy what-is-ineptocracy who-gets-spent'.split(' ');
for(const [records,required] of [[cast,requiredCast],[essays,requiredEssays]])if(records.map(x=>x.slug).sort().join()!==required.join())throw Error('Canonical route inventory changed');
const url=(type,slug)=>`/${type}/${slug}/`;
export const paths=['/',...sections.map(([,s])=>`/${s}/`),...cast.map(c=>url('characters',c.slug)),...essays.map(e=>url('dispatches',e.slug))];
export const assets=['robots.txt','sitemap.xml','feed.xml','llms.txt','llms-full.txt','a7c9e2d4f6814b03b1e5a9c7d2f8460b.txt','images/social/ineptocracy-og.png','favicon.ico','favicon.svg','icon-192.png','icon-512.png','apple-touch-icon.png','images/editorial/standard-print.webp','_headers'];
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const plain=s=>s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&gt;','>').replaceAll('&lt;','<');
if(process.argv[1]&&pathToFileURL(process.argv[1]).href===import.meta.url){
  const xml='<?xml version="1.0" encoding="UTF-8"?>\n', feed=`${base}/feed.xml`;
  const sitemap=xml+'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+paths.map(p=>`  <url><loc>${base+p}</loc><lastmod>${date}</lastmod></url>`).join('\n')+'\n</urlset>\n';
  const rss=xml+`<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${name} | Dispatches</title><link>${base}/dispatches/</link><description>Dillon Mohr’s field correspondence, political satire, and reader guides.</description><language>en-us</language><lastBuildDate>Fri, 27 Nov 2026 12:00:00 GMT</lastBuildDate><atom:link href="${feed}" rel="self" type="application/rss+xml"/>\n`+essays.map(e=>{const link=base+url('dispatches',e.slug);return `<item><title>${esc(e.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><description>${esc(e.description)}</description><category>${esc(e.category)}</category><pubDate>Thu, 30 Jul 2026 12:00:00 GMT</pubDate></item>`}).join('\n')+'\n</channel></rss>\n';
  const llms=`# ${name}\n\n> The official public archive of Dillon Mohr’s satirical political thriller. Fictional characters, institutions and in-world documents; spoiler-safe reader edition.\n\n## Start here\n- [Public archive](${base}/)\n`+sections.map(([n,p])=>`- [${n}](${base}/${p}/)`).join('\n')+'\n\n## Subjects\n'+cast.map(c=>`- [${c.name}](${base+url('characters',c.slug)}): ${c.role}`).join('\n')+'\n\n## Dispatches\n'+essays.map(e=>`- [${e.title}](${base+url('dispatches',e.slug)}): ${e.description}`).join('\n')+'\n';
  const full=llms+'\n## Public subject records\n\n'+cast.map(c=>`### ${c.name}\n\n${c.lead}\n\n${c.about.join('\n\n')}`).join('\n\n')+'\n\n## Collected dispatches\n\n'+essays.map(e=>`### ${e.title}\n\n${e.excerpt}\n\n`+e.blocks.map(b=>plain(b.html||b.text||b.items?.join('\n')||[b.caption,...b.rows.map(r=>r.join(' | '))].join('\n'))).join('\n\n')).join('\n\n')+'\n';
  await Promise.all(Object.entries({'sitemap.xml':sitemap,'feed.xml':rss,'llms.txt':llms,'llms-full.txt':full}).map(([file,s])=>writeFile(fileURLToPath(new URL(`public/${file}`,app)),s)));
  console.log(`Edition compiled: ${paths.length} canonical URLs, ${essays.length} RSS entries, ${cast.length} subject files.`);
}
