"""Import from the public edition only. Usage: python import-publication.py extracted.json
Requires BeautifulSoup 4. Normal builds use the checked-in JSON, not Python.
"""
import json, math, re, sys
from html import escape
from pathlib import Path
from urllib.parse import urlsplit
from bs4 import BeautifulSoup, NavigableString

APP = Path(__file__).resolve().parents[1]
LIB = APP / 'src/lib'
ORDER = [
 ('the-file-opens', 'Core Dossier','The File Opens','darnell-covington','javon-whitfield'),
 ('who-gets-spent','Core Dossier','Who Gets Spent?','javon-whitfield','alec-daheim'),
 ('the-memory-economy','Core Dossier','The Memory Economy','leah','mark'),
 ('the-garnier-position','Core Dossier','The Garnier Position','dijon-garnier','ronald-mcnulty'),
 ('what-is-ineptocracy','Satire & Craft','What Is an Ineptocracy?','ronald-mcnulty','darnell-covington'),
 ('political-satire-books-government-incompetence','Satire & Craft','Political Satire Books About Government Incompetence','ronald-mcnulty','avigail'),
 ('political-corruption-fiction','Satire & Craft','Political Corruption Fiction','dijon-garnier','mark'),
 ('books-like-1984-but-funny','Reading Guides','Books Like 1984 but Funny','dre-cole','leah'),
 ('political-thriller-book-club-questions','Reading Guides','20 Political Thriller Book Club Questions','sabrina','alec-daheim'),
]

def clean(s): return re.sub(r'\s*—\s*', ', ', s).strip()
def save(name,data): (LIB/name).write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def inline(node):
    # Preserve authored emphasis and references; no legacy HTML, scripts or attributes.
    if isinstance(node, NavigableString): return escape(re.sub(r'\s+', ' ',str(node)).replace('—', ', ').replace('If you need '+ 'mo'+'mentum', 'If you need pace'),quote=False)
    children=''.join(map(inline,node.children)); tag=node.name
    if tag in ['em','strong','i','cite']: return f'<{tag}>{children}</{tag}>'
    if tag=='a':
        u=urlsplit(node.get('href',''))
        if not u.netloc or u.netloc=='ironicineptocracy.com': href=(u.path.rstrip('/')+'/' if u.path else '')+('#'+u.fragment if u.fragment else '')
        elif u.scheme=='https': href=u.geturl()
        else: return children
        return f'<a href="{escape(href,quote=True)}">{children}</a>'
    return children

def blocks(section):
    out=[]
    for e in section.select('p,h2,h3,ol,ul,table'):
        typ=e.name
        if typ in ['ul','ol']: b={'type':typ,'items':[inline(li) for li in e.find_all('li',recursive=False)]}; b.update({'start':int(e['start'])} if e.has_attr('start') else {})
        elif typ=='table': b={'type':'table','caption':clean(e.caption.get_text(' ',strip=True)) if e.caption else '', 'rows':[[inline(cell) for cell in tr.find_all(['th','td'])] for tr in e.find_all('tr')]}
        elif typ in ['h2','h3']: b={'type':typ,'text':clean(e.get_text(' ',strip=True))}
        else: b={'type':typ,'html':inline(e)}
        out.append(b)
    return out

src={r['slug']:r for r in json.loads(Path(sys.argv[1]).read_text())}; assert set(src)=={r[0] for r in ORDER}
essays=[]
for i,(slug,category,short,*subjects) in enumerate(ORDER,1):
    r=src[slug]; s=BeautifulSoup((APP.parent/'dispatches'/slug/'index.html').read_text(),'html.parser')
    body=[]
    for sec in s.select('main > section'):
        cls=sec.get('class',[])
        if 'section' in cls or ('case-sequence' in cls and category=='Core Dossier'):
            body.extend(blocks(sec))
    assert len(body)>12,slug
    words=sum(len(BeautifulSoup(' '.join([b.get('html',''),b.get('text',''),b.get('caption',''),*b.get('items',[]),*(v for row in b.get('rows',[]) for v in row)]),'html.parser').get_text().split()) for b in body)
    essays.append(dict(slug=slug,title=clean(r['h1']),seoTitle=clean(r['seoTitle']),description=clean(r['description']),excerpt=clean(r['blocks'][0]['text']),short=short,folio=f'{i:02}',category=category,subjects=subjects,minutes=max(1,math.ceil(words/225)),words=words,blocks=body))
save('dispatches.json',essays)

# Keep even the cover's classification and the final transmission. Never infer sealed dates.
md=(APP.parent/'lead-magnets/garnier-dossier.md').read_text().strip(); head,*parts=re.split(r'(?m)^## ',md)
sections=[]
for part in parts:
    title,txt=part.strip().split('\n',1); b=[]
    for para in txt.strip().split('\n\n'):
        lines=para.strip().splitlines()
        if lines[0]=='[DATE WITHHELD]': b.append({'type':'sealed','text':' '.join(lines[1:])})
        elif lines[0].startswith('- '): b.append({'type':'ul','items':[x[2:] for x in lines]})
        elif re.match(r'^\d+\. ',lines[0]): b.append({'type':'ol','items':[re.sub(r'^\d+\. ','',x) for x in lines]})
        elif len(lines)>1 and all(': ' in x for x in lines): b.append({'type':'facts','rows':[x.split(': ',1) for x in lines]})
        else: b.append({'type':'p','text':clean(' '.join(lines))})
    sections.append({'title':title,'blocks':b})
sheets=[('Cover Transmission',[0]),('Subject Profile',[1]),('Public Mask vs. Private Logic',[2,3]),('NeuroClick Note',[4]),('Financial Dependency Map',[5,6,7]),('Redacted Timeline',[8]),('Field Note & Analytical Summary',[9,10,11])];assert sum(len(ix) for _,ix in sheets)==len(sections)==12
save('garnier-dossier.json',{'title':head.splitlines()[0][2:],'record':[x.split(': ',1) for x in head.strip().splitlines()[2:]],'sheets':[{'label':label,'sections':[sections[j] for j in ix]} for label,ix in sheets]})
print(len(essays),'essays;',sum(e['words'] for e in essays),'body words;',len(sections),'public file sections')
