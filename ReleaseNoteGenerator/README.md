# ReleaseNoteGenerator

Generiert automatisch Release Notes für das **DSB Streaming-Tool** bei jedem GitHub Release – als Markdown-Datei direkt im Release und als DSB-gebrandetes PDF als Release-Asset.

---

## Wie es funktioniert

1. Ein Release wird auf GitHub veröffentlicht (oder der Job manuell gestartet)
2. Das Script sucht einen **GitHub-Meilenstein**, dessen Name dem Release-Tag entspricht (z.B. `v1.2.0`), und liest alle zugehörigen Issues aus
3. Die Issues werden an die **Anthropic API** (Claude Haiku) übergeben, die daraus Release Notes auf Deutsch generiert
4. Das Ergebnis wird als **Markdown** und **PDF** (DSB-Branding) am Release angehängt
5. Kosten und Token-Verbrauch werden in `release_notes_cost_log.jsonl` geloggt

---

## Dateien

| Datei | Beschreibung |
|---|---|
| `generate_release_notes.py` | Haupt-Script – GitHub API, Anthropic API, Ausgabe |
| `dsb_pdf_template.py` | PDF-Template mit DSB-Branding (Farben, Layout) |
| `requirements.txt` | Python-Abhängigkeiten |
| `release_notes_cost_log.jsonl` | Automatisch erstelltes Kosten-Log (wird nicht committed) |

Die zugehörige GitHub Action liegt unter `.github/workflows/release-notes.yml`.

---

## Setup

### 1. Secret anlegen

Im Repo unter **Settings → Secrets and variables → Actions → New repository secret**:

| Name | Wert |
|---|---|
| `ANTHROPIC_API_KEY` | Dein Anthropic API Key (`sk-ant-...`) |

Das `GITHUB_TOKEN` wird automatisch von GitHub Actions bereitgestellt – kein eigener Secret nötig.

### 2. Meilensteine pflegen

Damit Issues automatisch einem Release zugeordnet werden:

- Meilenstein in GitHub anlegen, dessen **Titel dem Release-Tag entspricht** (z.B. `v1.2.0`)
- Issues dem Meilenstein zuweisen, bevor das Release erstellt wird

Wird kein passender Meilenstein gefunden, durchsucht das Script automatisch den Release-Body nach `#123`-Referenzen als Fallback.

### 3. Release erstellen

Einfach wie gewohnt ein Release auf GitHub veröffentlichen – die Action startet automatisch. Nach ~1–2 Minuten sind die Release Notes als Assets am Release zu finden.

---

## Manueller Trigger

Die Action kann auch ohne Release manuell gestartet werden:

**Actions → Generate Release Notes → Run workflow**

Optional kann ein spezifischer Release-Tag angegeben werden. Bleibt das Feld leer, wird das neueste Release verwendet.

---

## Kosten-Log

Jede Generierung schreibt einen Eintrag in `release_notes_cost_log.jsonl`:

```json
{
  "timestamp": "2025-06-02T10:00:00Z",
  "release": "v1.2.0",
  "model": "claude-haiku-4-5-20251001",
  "input_tokens": 312,
  "output_tokens": 487,
  "cost_input_usd": 0.000250,
  "cost_output_usd": 0.001948,
  "cost_total_usd": 0.002198
}
```

Typische Kosten pro Release: **unter $0.01**. Das verwendete Modell (Claude Haiku) ist das günstigste verfügbare Anthropic-Modell, das für diese Aufgabe ausreicht.

---

## PDF-Template anpassen

Farben und Layout sind in `dsb_pdf_template.py` oben definiert:

```python
DSB_DARK   = HexColor("#14101e")   # Hintergrundfarbe
DSB_ORANGE = HexColor("#e87722")   # Haupt-Akzentfarbe
DSB_AMBER  = HexColor("#f5a623")   # Sekundäre Akzentfarbe
```
