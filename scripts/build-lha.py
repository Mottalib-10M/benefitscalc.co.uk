#!/usr/bin/env python3
"""Rebuild src/data/lha-2026.json from the DWP CSV files (Universal Credit LHA monthly rates).

Rejouable chaque avril (RECETTE §4, §22) : changer URLS et les dates, relancer, puis `npx vitest run`.
Source : https://www.gov.uk/government/publications/universal-credit-local-housing-allowance-rates-2026-to-2027
"""
import csv, io, json, os, re, urllib.request

URLS = {
    'england': 'https://assets.publishing.service.gov.uk/media/69d654a2e1430e837a86f64a/england-rates-2026-to-2027.csv',
    'scotland': 'https://assets.publishing.service.gov.uk/media/69d657392ea7bc150a394ae5/scotland-rates-2026-to-2027.csv',
    'wales': 'https://assets.publishing.service.gov.uk/media/69d6574a28142a9bd207ba09/wales-rates-2026-to-2027.csv',
}
out = {}
for nation, url in URLS.items():
    raw = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60).read().decode('latin-1')
    rows = list(csv.reader(io.StringIO(raw)))
    for r in rows[1:]:
        if not r or not r[0].strip():
            continue
        v = [float(re.sub(r'[^\d.]', '', x)) for x in r[1:6]]
        out.setdefault(nation, []).append({'brma': r[0].strip(), 'sar': v[0], 'b1': v[1], 'b2': v[2], 'b3': v[3], 'b4': v[4]})
data = {
    '_source': 'DWP, Universal Credit Local Housing Allowance rates: 2026 to 2027 (monthly), published 8 April 2026, CSV files for England, Scotland and Wales',
    'retrieved_at': '2026-10-10', 'valid_from': '2026-04-01', 'valid_to': '2027-03-31',
    'url': 'https://www.gov.uk/government/publications/universal-credit-local-housing-allowance-rates-2026-to-2027',
    'areas': out,
}
dest = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'lha-2026.json')
json.dump(data, open(dest, 'w'), indent=0)
print({k: len(v) for k, v in out.items()}, '->', dest)
