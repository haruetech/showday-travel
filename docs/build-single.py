#!/usr/bin/env python3
"""css/ + js/ 를 합쳐 파일 하나짜리 index.html 을 만든다 (메신저·미리보기용). 사용: python3 tools/build-single.py [출력경로]"""
import re,sys,os
root=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd=lambda p:open(os.path.join(root,p),encoding='utf-8').read()
h=rd('index.html')
h=h.replace('<link rel="stylesheet" href="css/style.css">','<style>\n'+rd('css/style.css')+'</style>')
def sc(m): return '<script>\n'+rd(m.group(1))+'</script>'
h=re.sub(r'<script src="(js/[^"]+)"></script>',sc,h)
out=sys.argv[1] if len(sys.argv)>1 else os.path.join(root,'dist-single.html')
open(out,'w',encoding='utf-8').write(h); print('wrote',out,len(h))
