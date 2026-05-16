# Studio HM Detaljikirjasto – Asennusohje

Tee nämä vaiheet järjestyksessä. Koko prosessi kestää noin 20 minuuttia.

---

## VAIHE 1: Luo Supabase-tietokanta (ilmainen)

1. Mene osoitteeseen **https://supabase.com** ja kirjaudu sisään (tai luo tili)
2. Klikkaa **"New project"**
3. Anna projektin nimeksi `studio-hm-detaljikirjasto`
4. Valitse salasana (tallenna se jonnekin) ja region `West EU (Ireland)`
5. Klikkaa **"Create new project"** ja odota ~2 min

### Luo tietokantataulu

6. Vasemmasta valikosta klikkaa **"SQL Editor"**
7. Klikkaa **"New query"**
8. Kopioi ja liitä seuraava teksti, sitten paina **"Run"**:

```sql
create table detaljit (
  id uuid default gen_random_uuid() primary key,
  nimi text not null,
  kuvaus text,
  jarjestelma text,
  alaluokka text,
  rt_kortit jsonb default '[]',
  sfs_standardit jsonb default '[]',
  valmistajat jsonb default '[]',
  asennusohjeet jsonb default '[]',
  videot jsonb default '[]',
  avainsanat jsonb default '[]',
  tiedosto_nimi text,
  lisatty timestamptz default now(),
  kuva text
);

-- Sallitaan lukeminen ja kirjoittaminen ilman kirjautumista (toimistokäyttö)
alter table detaljit enable row level security;
create policy "Kaikki voivat lukea" on detaljit for select using (true);
create policy "Kaikki voivat lisätä" on detaljit for insert with check (true);
create policy "Kaikki voivat poistaa" on detaljit for delete using (true);
```

### Hae API-avaimet

9. Vasemmasta valikosta klikkaa **"Project Settings"** (rataskuvake)
10. Klikkaa **"API"**
11. Kopioi talteen:
    - **Project URL** (muotoa `https://xxxx.supabase.co`)
    - **anon public** -avain (pitkä teksti)

---

## VAIHE 2: Lataa projektikoodi

1. Lataa tämä kansio kokonaisuudessaan omalle tietokoneellesi
2. Avaa kansio tekstieditorissa tai terminaalissa

### Luo .env-tiedosto

3. Kopioi tiedosto `.env.example` ja nimeä kopio `.env`
4. Avaa `.env` ja täytä arvot:

```
VITE_SUPABASE_URL=https://SINUN-PROJEKTI.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...sinun-anon-avain...
VITE_ANTHROPIC_API_KEY=sk-ant-...sinun-avain...
```

**Anthropic API-avain:** https://console.anthropic.com → API Keys → Create key

---

## VAIHE 3: Julkaise Verceliin (ilmainen)

### Laita koodi GitHubiin

1. Mene **https://github.com** ja kirjaudu sisään (tai luo tili)
2. Klikkaa **"New repository"**, anna nimeksi `detaljikirjasto`, klikkaa **"Create"**
3. GitHub näyttää ohjeet – seuraa kohtaa **"…or upload an existing file"**
   → Voit yksinkertaisesti vetää kansion sisällön selaimeen

### Yhdistä Verceliin

4. Mene **https://vercel.com** ja kirjaudu (voit kirjautua GitHub-tunnuksilla)
5. Klikkaa **"Add New Project"**
6. Valitse juuri luomasi `detaljikirjasto`-repository
7. Klikkaa **"Deploy"** – Vercel tunnistaa Vite-projektin automaattisesti

### Lisää ympäristömuuttujat Verceliin

8. Kun deployment on valmis, mene **Settings → Environment Variables**
9. Lisää kaikki kolme muuttujaa `.env`-tiedostosta
10. Klikkaa **"Redeploy"**

---

## VAIHE 4: Asenna puhelimelle (PWA)

### iPhone (Safari)
1. Avaa sovelluksen URL Safarissa
2. Paina **Jaa-painiketta** (neliö nuolella alhaalla)
3. Skrollaa alas ja valitse **"Lisää Koti-valikkoon"**

### Android (Chrome)
1. Avaa sovelluksen URL Chromessa
2. Paina **⋮ valikko** (oikealla ylhäällä)
3. Valitse **"Lisää aloitusnäyttöön"**

---

## Valmis!

Sovellus toimii nyt:
- Selaimessa osoitteessa `https://detaljikirjasto.vercel.app` (tai vastaava)
- Puhelimella kuin natiivi sovellus
- Kirjasto synkkaantuu automaattisesti kaikkien laitteiden välillä

---

## Jos jokin ei toimi

**"Kirjaston lataus epäonnistui"** → Tarkista Supabase URL ja anon key .env-tiedostossa

**"Analyysi epäonnistui"** → Tarkista Anthropic API-avain, ja että sillä on krediittejä

**Kamera ei toimi** → Varmista että selaimelle on annettu kameralupa puhelimen asetuksissa

Ota yhteyttä jos tarvitset apua: claude.ai
