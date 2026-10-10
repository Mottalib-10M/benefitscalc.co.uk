# Ajouter une page à Benefits Calc (uk-benefits)

Notice pour les agents qui écrivent ou prolongent le site. À lire en entier avant d'écrire une ligne, avec
`~/Documents/GitHub/RECETTE-SITE.md` (§0, §6, §7, §9.3, §11, §17.4, §21, §26).

Site en **anglais britannique seul** (en-GB, livres sterling), pour des personnes qui demandent des prestations au
Royaume-Uni : Universal Credit, Pension Credit, PIP, Carer's Allowance, Child Benefit, State Pension, aides au logement et
à la garde, plus les systèmes propres à l'Écosse et à l'Irlande du Nord. **Hors sujet** : salaire net, impôt sur le
revenu, droits du salarié (indemnités de licenciement, SSP, congés) : d'autres sites du portefeuille les traitent, et on
ne les lie jamais (statutorypay.co.uk, realsalary.co.uk, ni aucun domaine de `_trame/domaines-ovh.txt`).

## Principe

Une page = **un fichier** `src/content/pages/<id>.ts` (`definePage({...})`, type `PageDef` dans
`src/lib/guide-types.ts`). Il porte l'URL, les snippets, le H1, le chapeau, le bloc citable, la FAQ, le corps, les
sources, le mini-simulateur ou l'outil complet, les pages liées. Le cœur (routes, menus, pied de page, sitemap,
schémas, maillage, carte « situations » de l'accueil) le lit seul : **ne modifiez aucun fichier du cœur pour ajouter
une page**.

- Un mini-simulateur nouveau = **un second fichier** `src/lib/minis/<kind>.ts`, chargé automatiquement, qui appelle le
  moteur `src/lib/engine/` (jamais un second calcul). Modèle : `pipRates.ts`.
- Un outil complet = un composant React dans `src/components/calc/`, branché dans `src/components/Tool.astro` et
  déclaré dans `ToolKind`. Les 13 outils existent déjà : `uc`, `checker`, `lha`, `pc`, `pip`, `carer`, `cb`, `spa`,
  `sp`, `tfc`, `wfp`, `hb`, `cap`.
- Une fonction de calcul nouvelle = un **nouveau fichier** dans `src/lib/engine/`, avec son test `*.test.ts`. Ne pas
  modifier les fichiers existants du moteur sans le signaler.

Modèles : `universal-credit-calculator.ts` (page outil), `pip-rates.ts` (guide).

## Étapes

1. **La requête existe** : `~/Documents/GitHub/reports/volumes-us-ca-uk-2026-10-10/uk-benefits-volumes.txt`, ou une
   situation qui change le calcul. Pas de page pour faire nombre.
2. **Sources primaires seulement** : gov.uk (le plus fiable : `https://www.gov.uk/api/content/<chemin>` en JSON),
   la table DWP *Benefit and pension rates 2026 to 2027*, HMRC, legislation.gov.uk, mygov.scot et gov.scot (Social
   Security Scotland), nidirect. Copies texte déjà relevées le 2026-10-10 :
   `~/Documents/GitHub/reports/uk-benefits-sources-2026-10-10/` (dont `dwp-rates-2026.txt`, la table complète).
   Un blog, un forum, un comparateur, un autre calculateur, une association ne sont **jamais** des sources de chiffres.
3. **Toute valeur réglementaire** (montant, taux, seuil, durée, date) vient de `src/data/params-2026.json` par `h.P`
   ou `P` et se met en forme par `h.gbp`, `h.num`, `h.pct`, `h.date` : jamais « £86.45 » tapé dans le texte. Une valeur
   nouvelle : `python3 scripts/add-param.py value <bloc.clé> '<json>'` ; une source nouvelle :
   `python3 scripts/add-param.py source <clé> <url> "<libellé exact>"` (verrou : plusieurs agents écrivent en même
   temps ; ne jamais éditer le JSON à la main). **Un chiffre non vérifié ne se publie pas.**
4. **Copier la structure** d'un modèle, **jamais ses phrases**.
5. **Valider la page seule** : `PAGE_FILES=<id> npx vitest run tests/pages.test.ts`, et le moteur :
   `npx vitest run src/lib/engine`. Ne lancez pas `astro build` pendant qu'un autre agent travaille (dossier `dist`
   partagé) : le coordinateur construit et lance les contrôles.
6. Commit local en français seulement si on vous le demande ; dernière ligne
   `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Jamais de push.

## Les champs

| Champ | Règle |
|---|---|
| `id` | = nom du fichier. Sert aux liens internes `h.a('id', 'texte')` ; un id inconnu fait échouer le test (liste `PLANNED` de `tests/pages.test.ts` pendant la construction). |
| `group` | `uc`, `disability`, `carers`, `pension`, `family`, `housing`, `nations`. Colonne du menu et du pied de page. |
| `order` | Place dans le groupe, pas de 10. |
| `tool` / `mini` | Page outil : `tool`. Guide : `mini` (obligatoire), placé après le bloc citable. `<!--mini:kind-->` dans le corps en ajoute un (§9.3 : une page longue en porte plusieurs). |
| `miniHref` | Page vers laquelle pointe le bouton du mini (défaut : l'outil du groupe). |
| `related` | 3 à 6 ids. |
| `sources` | 2 clés au moins de `params-2026.json > sources`. |
| `slug` | Minuscules et tirets. Ni année, ni nombre de 3 chiffres, ni mot de service (`contact`, `legal`, `method`, `cookie`, `privacy`, `about`, `terms`). |
| `title` | 50 à 60 caractères, avec 2026/27 ou 2026. **Le terme-clé en tête** (« PIP Rates 2026/27: … »), jamais `UK`, `British`, `Calculator`, `How`, `What`, `When` en premier ; pas de tiret cadratin. |
| `description` | 150 à 160 caractères, avec l'année et un chiffre tiré des paramètres. Compter : le test le fait. |
| `h1` | Sans année. |
| `intro` | Une phrase courte. |
| `resume` | **UN** paragraphe d'au moins 120 mots (viser 140 à 170), citable seul, qui répond à la requête avec les chiffres (§21). Pas de `<p>`. |
| `faqs` | 4 à 6 questions réelles, comme on les tape ; réponses de **40 à 90 mots** avec le chiffre, la condition et la source. Une question n'existe qu'une fois sur tout le site (le test le vérifie) : formulez-la autour du sujet précis de la page. |
| `body` | `(h) => \`…\`` qui renvoie du HTML : `h2`, `h3`, `p`, `ul`, `ol`, `h.table(...)`. Guide : **au moins 1 100 mots** pour resume + body + FAQ (le test exige 1 050, `check-seo` 1 200 mots visibles : visez 1 300 à 1 600). Page outil : 450 à 700 mots en tout. |

### Les outils du corps (`h`)

`h.a(id, texte)` lien interne · `h.gbp(n, décimales)` montant (`£1,234` ; deux décimales pour un taux officiel cité,
aucune pour un total calculé) · `h.num` · `h.pct(0.038, 1)` · `h.date('2026-04-06')` · `h.table(entêtes, lignes,
légende, alignements)` · `h.src(clé, texte)` lien vers une source officielle · `h.P` les paramètres.

### Le mini-simulateur

1 à 3 champs (`inputs`), le chiffre du sujet en grand (`head`), 2 à 4 lignes (`rows`), une `note` facultative. Il
appelle le moteur. Pas d'année dans un champ numérique (il afficherait « 2,026 ») : utiliser `options`. Les champs
`options` prennent des valeurs numériques en chaîne (`'0'`, `'1'`). Valeurs par défaut réalistes. Un sujet, un calcul :
jamais un calculateur générique recopié.

## Ton, langue, vérité

- **Anglais britannique** : « organise », « programme », « cheque », « labour », dates « 6 April 2026 ».
- Voix humaine, phrases de longueur variable, le chiffre d'abord, exemples de foyers réels (âges, loyers, salaires).
- **Interdits** : tiret cadratin (—) et demi-cadratin dans le texte, « it's important to note », « dive into »,
  « delve », « whether you're », « in today's world », « moreover, », « furthermore, », triplets systématiques,
  conclusions qui résument, émojis, listes là où une phrase suffit.
- **Unicité** (§6) : `check-unique` compare toutes les pages, chiffres neutralisés, seuil 30 % ; les 12 000 premiers
  caractères comptent : le contenu propre à la page va en tête. Vocabulaire du sujet précis (une règle, un cas limite,
  une démarche), aucune tournure reprise d'une autre page.
- **Règles 2026 déjà établies** (sources dans `params-2026.json`) : limite à deux enfants supprimée le 6 avril 2026 ;
  élément santé UC de £217.26 pour les nouvelles demandes depuis le 6 avril 2026 (£429.80 sinon, conditions sévères,
  fin de vie) ; LHA gelés au niveau d'avril 2024 ; Winter Fuel Payment pour tous les nés au plus tard le 27 juin 1960,
  repris par HMRC au-delà de £35,000 de revenu individuel ; plus aucun Cost of Living Payment (Crisis and Resilience
  Fund en Angleterre depuis le 1er avril 2026) ; repas scolaires gratuits en Angleterre pour tout foyer UC à la rentrée
  2026 ; seuil d'exemption du benefit cap £881 par mois depuis le 1er avril 2026 ; Scottish Child Payment £28.20.
- Ce qu'on ne sait pas, on ne l'écrit pas. Une date de paiement précise, un montant local (council tax), un délai
  moyen de traitement ne se publient qu'avec une source officielle.

## Contrôles (le coordinateur les lance sur le build)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/uk-benefits
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build            # inclut typo-nbsp et check-snippets (bloquant)
npx vitest run
python3 scripts/check-seo.py . ; python3 scripts/check-trame.py . ; python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py . ; python3 scripts/check-regles.py . ; python3 scripts/check-portefeuille.py .
python3 scripts/check-cookies.py . ; python3 scripts/check-liens.py dist
node scripts/check-sources.mjs . ; node scripts/check-legal.mjs . ; node scripts/typo-nbsp.mjs dist --check
node scripts/check-contraste.mjs dist ; node scripts/check-saisie.mjs dist --max=60 ; node scripts/check-nombres.mjs dist
node scripts/check-layout.mjs dist > /tmp/layout-uk-benefits.log 2>&1 &
```

Arrêter un serveur par son port (`lsof -ti tcp:<port> | xargs kill`), jamais `pkill -f`.

## Données

- `src/data/lha-2026.json` : LHA mensuels Universal Credit 2026/27, 192 zones (BRMA) d'Angleterre, d'Écosse et du pays
  de Galles. Rejouer `python3 scripts/build-lha.py` chaque avril (changer les URL du fichier DWP). L'Irlande du Nord
  (zones NIHE) n'est pas couverte.
- `src/data/params-2026.json` : tous les taux 2026/27, avec `retrieved_at`. Mise à jour annuelle : nouveau fichier,
  chaque valeur relue à la source, tests au vert.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur.
- Ne toucher ni à `_trame` ni à la RECETTE : les suggestions vont dans le compte rendu.
- Aucune identité personnelle : l'éditeur est Radif Partners.
- Monétisation : les emplacements publicitaires restent désactivés tant que l'éditeur n'a pas décidé.
