#!/usr/bin/env python3
"""
DSB Release Notes Generator
Fetches GitHub milestone/release issues and generates Release Notes
via Anthropic API (Markdown + PDF).
"""

import os
import sys
import json
import re
import datetime
import requests
import anthropic
from pathlib import Path

# ──────────────────────────────────────────
# Config
# ──────────────────────────────────────────
GITHUB_TOKEN  = os.environ["GITHUB_TOKEN"]
ANTHROPIC_KEY = os.environ["ANTHROPIC_API_KEY"]
REPO          = os.environ["REPO"]          # e.g. "myorg/myrepo"
RELEASE_TAG   = os.environ["RELEASE_TAG"]   # e.g. "v1.2.0"

MODEL         = "claude-haiku-4-5-20251001"   # cheapest model
TEMPLATE_DIR  = Path(__file__).parent   # dsb_pdf_template.py liegt im selben Ordner

GH_HEADERS = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
}

# ──────────────────────────────────────────
# GitHub helpers
# ──────────────────────────────────────────

def gh_get(url: str, params: dict = None) -> dict | list:
    r = requests.get(url, headers=GH_HEADERS, params=params or {})
    r.raise_for_status()
    return r.json()


def get_release(tag: str) -> dict:
    url = f"https://api.github.com/repos/{REPO}/releases/tags/{tag}"
    return gh_get(url)


def find_milestone_for_tag(tag: str) -> dict | None:
    """Try to find a milestone whose title matches the release tag."""
    milestones = gh_get(
        f"https://api.github.com/repos/{REPO}/milestones",
        {"state": "all", "per_page": 100},
    )
    for ms in milestones:
        if ms["title"].strip().lstrip("vV") == tag.strip().lstrip("vV"):
            return ms
        if ms["title"].strip() == tag.strip():
            return ms
    return None


def get_issues_for_milestone(milestone_number: int) -> list[dict]:
    issues = []
    page = 1
    while True:
        batch = gh_get(
            f"https://api.github.com/repos/{REPO}/issues",
            {"milestone": milestone_number, "state": "all", "per_page": 100, "page": page},
        )
        if not batch:
            break
        issues.extend(batch)
        page += 1
    # Filter out pull requests
    return [i for i in issues if "pull_request" not in i]


def get_issues_from_release_body(body: str) -> list[str]:
    """Fallback: extract '#123' references from the release body."""
    return re.findall(r"#(\d+)", body or "")


def enrich_issue(number: str | int) -> dict | None:
    try:
        return gh_get(f"https://api.github.com/repos/{REPO}/issues/{number}")
    except Exception:
        return None


# ──────────────────────────────────────────
# Anthropic – generate notes
# ──────────────────────────────────────────

def build_prompt(release: dict, issues: list[dict]) -> str:
    issue_lines = []
    for iss in issues:
        assignees = ", ".join(
            f"@{a['login']}" for a in iss.get("assignees", [])
        ) or "—"
        issue_lines.append(
            f"- Ticket #{iss['number']} – {iss['title']} – Bearbeitet von: {assignees}"
        )

    issues_block = "\n".join(issue_lines) if issue_lines else "Keine Tickets gefunden."

    return f"""Du bist ein technischer Redakteur für das DSB Streaming-Tool – ein Overlay- und Streaming-Tool für die Deutsche Splatoon Bundesliga.
Erstelle Release Notes für das Release {release['tag_name']} basierend auf den folgenden Tickets.

WICHTIG:
- Schreibe auf Deutsch.
- Halte die Zusammenfassung kurz (3-5 Sätze), freundlich und für Streamer/Nutzer verständlich.
- Liste alle Tickets genau so auf, wie sie übergeben wurden – ändere nichts.
- Beende mit einer kurzen, herzlichen Dankesnachricht an die Community.
- Antworte NUR mit validem Markdown, ohne Codeblöcke drumherum.
- Struktur:
  # DSB Streaming-Tool – Release {release['tag_name']}
  ## Zusammenfassung
  <kurze Beschreibung>
  ## Änderungen
  <Ticket-Liste>
  ## Danke
  <Dankesnachricht>

Tickets dieses Releases:
{issues_block}
"""


def call_anthropic(prompt: str) -> tuple[str, dict]:
    """Returns (markdown_text, usage_dict)."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_KEY)
    message = client.messages.create(
        model=MODEL,
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}],
    )
    usage = {
        "input_tokens":  message.usage.input_tokens,
        "output_tokens": message.usage.output_tokens,
    }
    text = "".join(b.text for b in message.content if hasattr(b, "text"))
    return text, usage


# ──────────────────────────────────────────
# Cost logging
# ──────────────────────────────────────────

# Prices in USD per 1M tokens (claude-haiku-4-5 as of mid-2025)
PRICE_INPUT_PER_M  = 0.80
PRICE_OUTPUT_PER_M = 4.00


def log_cost(usage: dict, release_tag: str):
    input_cost  = usage["input_tokens"]  / 1_000_000 * PRICE_INPUT_PER_M
    output_cost = usage["output_tokens"] / 1_000_000 * PRICE_OUTPUT_PER_M
    total_cost  = input_cost + output_cost

    log = {
        "timestamp":      datetime.datetime.utcnow().isoformat() + "Z",
        "release":        release_tag,
        "model":          MODEL,
        "input_tokens":   usage["input_tokens"],
        "output_tokens":  usage["output_tokens"],
        "cost_input_usd":  round(input_cost,  6),
        "cost_output_usd": round(output_cost, 6),
        "cost_total_usd":  round(total_cost,  6),
    }

    log_path = Path(__file__).parent / "release_notes_cost_log.jsonl"
    with log_path.open("a") as f:
        f.write(json.dumps(log) + "\n")

    print("=" * 50)
    print(f"💰 API-Kosten für Release {release_tag}")
    print(f"   Modell:          {MODEL}")
    print(f"   Input-Tokens:    {usage['input_tokens']:,}")
    print(f"   Output-Tokens:   {usage['output_tokens']:,}")
    print(f"   Kosten Input:    ${input_cost:.6f}")
    print(f"   Kosten Output:   ${output_cost:.6f}")
    print(f"   Gesamtkosten:    ${total_cost:.6f}")
    print(f"   Log gespeichert: {log_path}")
    print("=" * 50)

    return total_cost


# ──────────────────────────────────────────
# PDF generation (DSB branding)
# ──────────────────────────────────────────

def generate_pdf(markdown_text: str, release_tag: str, output_path: Path):
    """Generate a DSB-branded PDF from the markdown text."""
    from dsb_pdf_template import render_release_notes_pdf
    render_release_notes_pdf(markdown_text, release_tag, str(output_path))


# ──────────────────────────────────────────
# Main
# ──────────────────────────────────────────

def main():
    print(f"🚀 Starte Release-Notes-Generierung für {RELEASE_TAG} …")

    # 1. Fetch release metadata
    release = get_release(RELEASE_TAG)
    print(f"✅ Release gefunden: {release['name'] or release['tag_name']}")

    # 2. Fetch issues
    issues: list[dict] = []
    milestone = find_milestone_for_tag(RELEASE_TAG)
    if milestone:
        print(f"✅ Meilenstein gefunden: #{milestone['number']} – {milestone['title']}")
        issues = get_issues_for_milestone(milestone["number"])
        print(f"   {len(issues)} Ticket(s) geladen.")
    else:
        print("⚠️  Kein passender Meilenstein gefunden – versuche Fallback via Release-Body …")
        numbers = get_issues_from_release_body(release.get("body", ""))
        for n in numbers:
            iss = enrich_issue(n)
            if iss:
                issues.append(iss)
        print(f"   {len(issues)} Ticket(s) via Fallback geladen.")

    if not issues:
        print("⚠️  Keine Tickets gefunden – Release Notes werden ohne Ticket-Liste erstellt.")

    # 3. Generate markdown via Anthropic
    prompt   = build_prompt(release, issues)
    md_text, usage = call_anthropic(prompt)
    print("✅ Markdown generiert.")

    # 4. Log cost
    log_cost(usage, RELEASE_TAG)

    # 5. Save markdown
    safe_tag  = RELEASE_TAG.replace("/", "-")
    md_path   = Path(f"release_notes_{safe_tag}.md")
    md_path.write_text(md_text, encoding="utf-8")
    print(f"✅ Markdown gespeichert: {md_path}")

    # 6. Generate PDF
    pdf_path = Path(f"release_notes_{safe_tag}.pdf")
    try:
        # Add template dir to path so dsb_pdf_template is importable
        sys.path.insert(0, str(TEMPLATE_DIR))
        generate_pdf(md_text, RELEASE_TAG, pdf_path)
        print(f"✅ PDF gespeichert: {pdf_path}")
    except Exception as e:
        print(f"❌ PDF-Generierung fehlgeschlagen: {e}")
        raise

    print("🎉 Fertig!")


if __name__ == "__main__":
    main()
