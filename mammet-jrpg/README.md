# Chroniken von Asterfall: Mammets Schatten

> Stand 2026-10-18: Die lokal spielbare Demo ist im Repository. Das sichere Multiplayer-Backend liegt als deploybarer Quellcode vor, ist aber NOCH NICHT eingerichtet. Auch GitHub Pages und Push müssen noch aktiviert werden.

## JRPG-Setting

In Asterfall verstummen sieben Sternenglocken. Der Puppenkönig **Mammet** will die Himmelsuhr anhalten. Die Helden **Eira** (Klingenritterin), **Kael** (Runenweber) und **Pip** (Tüftler) suchen die sieben Fragmente.

## Regeln

- Start exakt beim dritten registrierten Helden.
- Jede Runde enthält die zufällig gezogenen Slots Eira, Kael, Pip, Mammet, Mammet.
- Mammet erhält immer zwei Züge, nie unmittelbar hintereinander – auch nicht beim Wechsel zwischen Runden.
- Spieler können ausschließlich im eigenen Zug handeln.
- Regeln, Würfel, Schaden und Besitz verarbeitet nur das Backend; optionale KI-Aufrufe formulieren ausschließlich die Geschichte.
- Browser synchronisieren sich alle 20 Sekunden; ein stündlicher ChatGPT-GM kann zusätzlich die zentrale Szene über director.json ändern.

## Repository-Dateien

- index.html, style.css, game.js: Pixelkarte, Lobby, Desktop-Seitenleisten, iPhone-Tabs, Inventory, freie Dialoge und Demo
- config.js: ausschließlich öffentliche Supabase-URL und anon/publishable Key
- manifest.webmanifest, icon.svg, sw.js: PWA und Push-Empfangsgrundlage
- supabase/migrations/001_game_sessions.sql: PostgreSQL-Schema
- supabase/functions/mammet-api/index.ts: Auth, JSON-State, CAS-Sperre, Boss-Züge und optionale KI-Erzählung
- gm-snapshot.json: öffentlich bereinigte Kopie des kanonischen Supabase-Spielstands für ChatGPT
- director.json: vom wiederkehrenden ChatGPT-GM bearbeitbare Szene
- .github/workflows/mammet-sync.yml im Repository-Root: 20-minütige Snapshot-Synchronisation

## Inbetriebnahme

### A. GitHub Pages

Im Repository KageDG/KageRoguelike Settings > Pages > Deploy from a branch > master / (root) auswählen. Die alte Root-Seite bleibt unverändert. Erwartete URL nach erfolgreichem Deployment:

https://kagedg.github.io/KageRoguelike/mammet-jrpg/

VOR der Supabase-Einrichtung ist dies ausdrücklich eine **Ein-Gerät-Demo**, keine Online-Partie.

### B. Supabase

1. Projekt in https://supabase.com/ anlegen.
2. Inhalt von supabase/migrations/001_game_sessions.sql im SQL-Editor ausführen.
3. Supabase CLI installieren; anmelden, mit dem Projekt verknüpfen und die Edge Function deployen:
   - supabase login
   - supabase link --project-ref PROJECT_REF
   - supabase secrets set GAME_INVITE_CODE=DEIN_LANGER_ZUFAELLIGER_CODE
   - supabase functions deploy mammet-api --no-verify-jwt
4. Optional KI-Erzählung aktivieren:
   - supabase secrets set OPENAI_API_KEY=DEIN_KEY OPENAI_MODEL=gpt-5-mini
5. In der öffentlichen config.js nur supabaseUrl und anonKey (öffentlicher Schlüssel) setzen. Niemals service_role oder OpenAI-Key im Browser ablegen.
6. Den drei Spielern denselben Einladungslink geben: https://kagedg.github.io/KageRoguelike/mammet-jrpg/?invite=DEIN_LANGER_ZUFAELLIGER_CODE

**Sicherheit:** Die serverseitige Edge Function vergleicht den Einladungscode und prüft zusätzlich ein pro Gerät gespeichertes Spieler-Token als SHA-256-Hash. Die Datenbank hat Row-Level Security aktiviert und ist dem Browser nicht direkt zugänglich. Für eine öffentliche Community wären zusätzliche Accounts und Rate Limits nötig.

### C. ChatGPT als stündlicher Game Master

GitHub-Repository Settings > Secrets and variables > Actions:

- MAMMET_SUPABASE_URL = öffentliche Projekt-URL
- MAMMET_SUPABASE_ANON_KEY = öffentlicher anon/publishable Key
- MAMMET_GAME_INVITE_CODE = derselbe private Einladungscode

GitHub Actions erlauben und Schreibberechtigung für Contents aktivieren. Alle 20 Minuten schreibt das Workflow bei Änderungen eine tokenfreie öffentliche Kopie des Spielstands nach gm-snapshot.json.

Die stündliche ChatGPT-Aufgabe liest diese Datei. Bei neuen Ereignissen kann sie die Datei director.json aktualisieren. Dabei muss sie die aktuelle Rundennummer und das genaue Ereignis zuordnen:

director.json:
{
  "round": 2,
  "forEvent": "GENAUER TEXT AUS state.events[0].message IN gm-snapshot.json",
  "speaker": "SPIELLEITER",
  "story": "Atmosphärische JRPG-Fortsetzung der aktuellsten Handlung ...",
  "palette": "storm",
  "updated": "2026-10-18T15:27:00+02:00"
}

Palette: twilight, ember, storm, dawn. Wenn Runde oder Ereignis nicht mehr aktuell sind, ignoriert die Webseite das Director-Overlay automatisch. Der Server bleibt für LP, Beute, Proben und Spielzüge autoritativ. Geplante ChatGPT-Aufgaben können wegen Genehmigungen/Berechtigungen an einer GitHub-Änderung gehindert sein.

### D. Push-Mitteilungen

PWA und Service Worker sind vorbereitet, aber der Versand von echten Web-Push-Nachrichten ist NICHT implementiert. Dafür braucht man VAPID-Schlüssel, Subscription-Speicherung und einen Push-Sender im Backend. iOS-Push setzt eine zum Home-Bildschirm hinzugefügte Web-App und Benachrichtigungsfreigabe voraus. Bis dahin können Spieler die geöffnete Seite nutzen; sie aktualisiert den Zustand alle 20 Sekunden.

## Betrieb

- Es gibt exakt eine Dreierkampagne (Session-ID mammet).
- Das Backend startet die Runde sofort, wenn drei unterschiedliche Helden registriert sind.
- GitHub Pages ist rein statisch; das echte Gameplay läuft erst mit Supabase.
- Der GitHub-Snapshot ist öffentlich und enthält Spielernamen und öffentliches Spielgeschehen, aber keine Tokens oder Einladungscodes.
- Die API-Key-Kosten für KI-Erzählungen sind separat.
- Der Spielstand liegt ausschließlich in Supabase. gm-snapshot.json ist ein regenerierbarer Cache.
- Kampagne nach Sicherung über den Supabase SQL-Editor zurücksetzen: delete from public.game_sessions where id='mammet';

---
Timestamp: 2026-10-18T15:27:00+02:00
Tags: #jrpg #pixelart #mammet #multiplayer #github-pages #supabase #chatgpt-gm
