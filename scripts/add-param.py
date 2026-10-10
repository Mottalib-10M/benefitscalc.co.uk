#!/usr/bin/env python3
"""Ajoute une valeur ou une source à src/data/params-2026.json sous verrou (plusieurs agents en parallèle).

  python3 scripts/add-param.py value <bloc.clé> '<json>'          ex. value uc.aetSingle 991
  python3 scripts/add-param.py source <clé> <url> "<libellé exact>"

Refuse d'écraser une valeur existante différente (pas de correction silencieuse) : en cas de conflit,
le dire dans le compte rendu.
"""
import fcntl, json, os, sys
P = os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'params-2026.json')
with open(P + '.lock', 'w') as lk:
    fcntl.flock(lk, fcntl.LOCK_EX)
    d = json.load(open(P))
    if sys.argv[1] == 'value':
        keys, val = sys.argv[2].split('.'), json.loads(sys.argv[3])
        cur = d
        for k in keys[:-1]: cur = cur.setdefault(k, {})
        if keys[-1] in cur and cur[keys[-1]] != val: sys.exit(f'conflit : {sys.argv[2]} vaut déjà {cur[keys[-1]]!r}')
        cur[keys[-1]] = val
    elif sys.argv[1] == 'source':
        k, url, label = sys.argv[2], sys.argv[3], sys.argv[4]
        if k in d['sources'] and d['sources'][k]['url'] != url: sys.exit(f'conflit : source {k} existe avec une autre URL')
        d['sources'][k] = {'url': url, 'label': {'en': label}}
    else: sys.exit(__doc__)
    tmp = P + '.tmp'; json.dump(d, open(tmp, 'w'), indent=1, ensure_ascii=False); os.replace(tmp, P)
    print('ok', sys.argv[2])
