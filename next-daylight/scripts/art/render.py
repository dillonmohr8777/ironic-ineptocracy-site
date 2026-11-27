"""Print the live WebGL shader at its first phase, then typeset its OG companion.
Usage: python scripts/art/render.py --chrome /path/to/chrome
Requires a built out/, Playwright, Pillow and the app's TypeScript compiler.
"""
import argparse, io, subprocess
from pathlib import Path
from functools import partial
from threading import Thread
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from PIL import Image
from playwright.sync_api import sync_playwright
APP=Path(__file__).resolve().parents[2]
class Static(SimpleHTTPRequestHandler):
    def log_message(self,*args):pass
    def translate_path(self,path):
        if path=='/social.html':return str(Path(__file__).with_name('social.html'))
        if path=='/images/editorial/standard-print.webp':return str(APP/'public'/path[1:])
        return super().translate_path(path)
def main():
    parser=argparse.ArgumentParser();parser.add_argument('--chrome');args=parser.parse_args()
    # Serve TypeScript's transient JS module from memory, never add it to the export.
    js=subprocess.check_output(['node','-e',"const ts=require('typescript'),fs=require('fs');console.log(ts.transpileModule(fs.readFileSync('src/lib/flag.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText)"],cwd=APP)
    server=ThreadingHTTPServer(('127.0.0.1',0),partial(Static,directory=str(APP/'out')))
    Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path=args.chrome,headless=True,args=['--use-gl=angle','--use-angle=swiftshader-webgl','--enable-webgl','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'])
        page=browser.new_page(viewport={'width':1440,'height':784},reduced_motion='no-preference')
        page.route(base+'/proof.mjs',lambda route:route.fulfill(content_type='text/javascript',body=js));page.goto(base+'/social.html')
        page.evaluate('''async ()=>{document.body.innerHTML='';document.body.style='margin:0;padding:0;width:1440px;height:784px;background:#fafaf7';const m=await import('/proof.mjs'),c=document.createElement('canvas');c.width=1440;c.height=784;document.body.append(c);const r=m.webRenderer(c);if(!r)throw Error('WebGL2 required');r.draw(m.PRINT_PHASE)}''')
        img=Image.open(io.BytesIO(page.locator('canvas').screenshot()));assert img.size==(1440,784);img.save(APP/'public/images/editorial/standard-print.webp',lossless=True,method=6)
        page.set_viewport_size({'width':1200,'height':630});page.goto(base+'/social.html');page.evaluate('document.fonts.ready');page.locator('img').evaluate('(i)=>i.decode()');page.screenshot(path=APP/'public/images/social/ineptocracy-og.png');browser.close()
    print('Captured live 1440 × 784 print and 1200 × 630 social plate.')
if __name__=='__main__':main()
