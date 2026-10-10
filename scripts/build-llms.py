#!/usr/bin/env python3
"""Writes public/llms.txt from the built site (RECETTE §21): what the site is, its data, its pages.
Run after `npm run build`: python3 scripts/build-llms.py"""
import glob, html, os, re
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
site = re.search(r'SITE_URL = "([^"]+)"', open(f'{root}/src/data/site-config.ts').read()).group(1)
pages = []
for f in sorted(glob.glob(f'{root}/dist/en/**/index.html', recursive=True)):
    doc = open(f, encoding='utf-8').read()
    if 'content="noindex' in doc: continue
    t = html.unescape(re.search(r'<title>(.*?)</title>', doc, re.S).group(1)).strip()
    d = html.unescape(re.search(r'name="description" content="([^"]*)"', doc).group(1))
    path = '/' + os.path.relpath(os.path.dirname(f), f'{root}/dist').replace(os.sep, '/') + '/'
    pages.append((path, t, d))
out = ['# Benefit Sums', '', '> Free calculators and guides for UK benefits in the 2026/27 year: Universal Credit with the Local Housing Allowance of all 192 rental areas of Great Britain, Pension Credit and Savings Credit, the PIP points test, Carer’s Allowance, Child Benefit and the High Income Child Benefit Charge, State Pension age and amount, Winter Fuel Payment, childcare support, and the Scottish and Northern Ireland systems. Published by Radif Partners. Every rate is read from the DWP, HMRC, Social Security Scotland, the Scottish Government or nidirect, and dated in one parameter file. Calculations run in the browser.', '', '## Pages', '']
out += [f'- [{t}]({site}{p}): {d}' for p, t, d in pages]
open(f'{root}/public/llms.txt', 'w', encoding='utf-8').write('\n'.join(out) + '\n')
print(f'llms.txt: {len(pages)} pages')
