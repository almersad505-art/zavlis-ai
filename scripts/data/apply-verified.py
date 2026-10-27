import json,sys
root=sys.argv[1];import os;D=os.path.dirname(os.path.abspath(__file__))+'/';import sys as _s;DATE=_s.argv[2] if len(_s.argv)>2 else '2026-10-21'
T=json.load(open(root+'/data/tools.json'));by={t['id']:t for t in T}
def rows(f):
    return [json.loads(l) for l in open(D+f) if l.strip()]
np=na=ni=0
for v in rows('prices.jsonl'):
    t=by[v['id']];np+=1
    if v.get('custom'):
        t['price_from']='unknown';t['price_currency']='unknown';t['price_model']='custom'
    else:
        t['price_from']=v['price_from'];t['price_currency']=v['cur'];t.pop('price_model',None)
    t['price_scope']=v['en'];t['price_scope_ar']=v['ar'];t['price']=v['en'];t['priceAr']=v['ar']
    t['priceSource']=v['src'];t['priceCheckedAt']=DATE
    if v['free']!='unknown' or t.get('free_tier') in (None,'unknown'):
        t['free_tier']=v['free'];t['freeTier']={'yes':True,'trial':True,'no':False}.get(v['free'],'unknown')
    ev=t['evidence'] if isinstance(t.get('evidence'),dict) else {};ev['price_from']='unknown' if v.get('custom') else v['src'];ev['price_model']=v['src'] if v.get('custom') else ev.get('price_model');ev={k:x for k,x in ev.items() if x is not None};t['evidence']=ev;t['last_checked']=DATE
for v in rows('arabic.jsonl'):
    t=by[v['id']];s=v['s'];na+=1
    t['arabic_support']=s;t['arabic']={'yes':True,'partial':True,'no':False}[s]
    t['arabicScope']=v['en'];t['arabicScopeAr']=v['ar'];t['arabicSource']=v['src'];t['arabicCheckedAt']=DATE
    ev=t['evidence'] if isinstance(t.get('evidence'),dict) else {};ev['arabic_support']=v['src'];t['evidence']=ev
    if s=='no': t['arabic_subtasks']=[];t['arabic_tasks']=[]
    else:
        t['arabic_subtasks']=sorted(set(t.get('arabic_subtasks') or [])|set(t.get('subtasks') or []))
        t['arabic_tasks']=sorted(set(t.get('arabic_tasks') or [])|set(t.get('tasks') or []))
    t['last_checked']=DATE
for v in rows('inactive.jsonl'):
    t=by[v['id']];t['active']=False;t['inactiveReason']=v['reason'];t['inactiveSource']=v['src'];t['last_checked']=DATE;ni+=1
for t in T:
    if t.get('last_checked')==DATE:
        mr=t.get('metadataReview') if isinstance(t.get('metadataReview'),dict) else {}
        mr.update({'date':DATE,'reviewedBy':'Claude (official sources)'});t['metadataReview']=mr
s=json.dumps(T,ensure_ascii=False,indent=2)
open(root+'/data/tools.json','w').write(s+'\n');open(root+'/tools-data.js','w').write('window.ZAVLIS_TOOLS = '+json.dumps(T,ensure_ascii=False,separators=(',',':'))+';\n')
print('prices',np,'arabic',na,'inactive',ni)
