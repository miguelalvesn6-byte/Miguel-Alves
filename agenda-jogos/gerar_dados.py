import openpyxl, datetime, json, hashlib, sys
wb=openpyxl.load_workbook(sys.argv[1],data_only=True)
ws=wb['Resultados']
out=[];seen={}
def s(v):
    if v is None: return ''
    v=str(v).strip()
    return '' if v.startswith('#') else v
for r in ws.iter_rows(min_row=4,values_only=True):
    r=r[1:]
    mod=s(r[0])
    if mod not in ('Andebol','Basquetebol','Hóquei em Patins','Futsal','Voleibol'): continue
    d=r[8]
    ds=d.strftime('%Y-%m-%d') if isinstance(d,datetime.datetime) else ''
    loc=s(r[9]).capitalize()
    res=s(r[10]); win=s(r[15])
    opp=s(r[7]); esc=s(r[2]) or '—'
    if esc=='Séniores B': esc='Sénior B'
    jor=s(r[5]); 
    if jor.endswith('.0'): jor=jor[:-2]
    key='|'.join([mod,s(r[1]),esc,s(r[3]),s(r[4]),jor,opp,ds,loc])
    h=hashlib.sha1(key.encode()).hexdigest()[:10]
    seen[h]=seen.get(h,0)+1
    if seen[h]>1: h=h+'-'+str(seen[h])
    out.append([h,mod,s(r[1]),esc,s(r[3]),s(r[4]),jor,opp,ds,loc,res if res else '',win if res else '',s(r[17])])
print(len(out),file=sys.stderr)
json.dump(out,open('games.json','w'),ensure_ascii=False,separators=(',',':'))
# Uso: python3 gerar_dados.py Resultados.xlsx  → cria games.json
# Depois: python3 -c "t=open('template.html').read();g=open('games.json').read().replace('</','<\\/');open('index.html','w').write(t.replace('__GAMES__',g))"
