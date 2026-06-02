"""
DSB PDF Template – Deutsche Splatoon Bundesliga
Generates branded release-note PDFs.

Place this file at:  templates/dsb_pdf_template.py
"""

import re
import datetime
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT

# ── DSB brand colours ──────────────────────────────────────────────────────────
DSB_DARK   = HexColor("#14101e")   # very dark navy / near-black (background)
DSB_ORANGE = HexColor("#e87722")   # warm orange accent
DSB_AMBER  = HexColor("#f5a623")   # lighter amber for gradient suggestion
DSB_TEXT   = HexColor("#f0ece8")   # off-white body text
DSB_MUTED  = HexColor("#9b8fa0")   # muted lavender-grey for secondary text
DSB_RULE   = HexColor("#3a2d50")   # subtle dark-purple rule line

PAGE_W, PAGE_H = A4   # 595.27 × 841.89 pt
MARGIN_L = 20 * mm
MARGIN_R = 20 * mm
MARGIN_T = 28 * mm
MARGIN_B = 22 * mm

FONT_BOLD   = "Helvetica-Bold"
FONT_NORMAL = "Helvetica"
FONT_OBLIQ  = "Helvetica-Oblique"


# ── Low-level canvas helpers ───────────────────────────────────────────────────

def _draw_background(c: canvas.Canvas):
    """Solid dark background for the whole page."""
    c.setFillColor(DSB_DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)


def _draw_header(c: canvas.Canvas, release_tag: str):
    """
    Top bar: amber-to-orange gradient strip + DSB title text.
    We fake a gradient with several thin rectangles.
    """
    bar_top    = PAGE_H - 18 * mm
    bar_height = 14 * mm

    steps = 40
    for i in range(steps):
        t = i / steps
        r = int(DSB_DARK.red   * 255 * (1 - t) + DSB_ORANGE.red   * 255 * t)
        g = int(DSB_DARK.green * 255 * (1 - t) + DSB_ORANGE.green * 255 * t)
        b = int(DSB_DARK.blue  * 255 * (1 - t) + DSB_ORANGE.blue  * 255 * t)
        c.setFillColorRGB(r / 255, g / 255, b / 255)
        x = PAGE_W * i / steps
        c.rect(x, bar_top, PAGE_W / steps + 1, bar_height, fill=1, stroke=0)

    # "DSB" label left
    c.setFillColor(white)
    c.setFont(FONT_BOLD, 13)
    c.drawString(MARGIN_L, bar_top + 4 * mm, "DSB STREAMING-TOOL")

    # release tag right
    c.setFont(FONT_BOLD, 13)
    c.drawRightString(PAGE_W - MARGIN_R, bar_top + 4 * mm, release_tag)


def _draw_footer(c: canvas.Canvas, page_num: int):
    """Bottom bar with generation date and page number."""
    bar_bot    = 0
    bar_height = 10 * mm

    # dark strip
    c.setFillColor(DSB_RULE)
    c.rect(0, bar_bot, PAGE_W, bar_height, fill=1, stroke=0)

    now = datetime.datetime.utcnow().strftime("%d.%m.%Y")
    c.setFillColor(DSB_MUTED)
    c.setFont(FONT_NORMAL, 8)
    c.drawString(MARGIN_L, bar_bot + 3 * mm, f"Erstellt am {now} · DSB Streaming-Tool")
    c.drawRightString(PAGE_W - MARGIN_R, bar_bot + 3 * mm, f"Seite {page_num}")


def _draw_accent_rule(c: canvas.Canvas, y: float):
    """A thin orange horizontal line."""
    c.setStrokeColor(DSB_ORANGE)
    c.setLineWidth(1.5)
    c.line(MARGIN_L, y, PAGE_W - MARGIN_R, y)


# ── Paragraph styles ───────────────────────────────────────────────────────────

def _styles():
    return {
        "h1": ParagraphStyle(
            "h1",
            fontName=FONT_BOLD,
            fontSize=22,
            textColor=DSB_ORANGE,
            spaceAfter=6,
            spaceBefore=4,
            leading=28,
        ),
        "h2": ParagraphStyle(
            "h2",
            fontName=FONT_BOLD,
            fontSize=14,
            textColor=DSB_AMBER,
            spaceAfter=4,
            spaceBefore=14,
            leading=18,
        ),
        "body": ParagraphStyle(
            "body",
            fontName=FONT_NORMAL,
            fontSize=10,
            textColor=DSB_TEXT,
            spaceAfter=4,
            leading=15,
        ),
        "bullet": ParagraphStyle(
            "bullet",
            fontName=FONT_NORMAL,
            fontSize=9,
            textColor=DSB_TEXT,
            spaceAfter=3,
            leading=14,
            leftIndent=10,
            bulletIndent=0,
        ),
        "muted": ParagraphStyle(
            "muted",
            fontName=FONT_OBLIQ,
            fontSize=9,
            textColor=DSB_MUTED,
            spaceAfter=3,
            leading=13,
        ),
    }


# ── Markdown → flowable conversion ────────────────────────────────────────────

def _md_to_flowables(md_text: str, styles: dict) -> list:
    """
    Very lightweight Markdown parser for the subset we expect:
    # H1, ## H2, - bullets, plain paragraphs.
    """
    flowables = []
    for line in md_text.splitlines():
        stripped = line.strip()
        if not stripped:
            flowables.append(Spacer(1, 4))
            continue
        if stripped.startswith("# "):
            flowables.append(Paragraph(stripped[2:], styles["h1"]))
            flowables.append(
                HRFlowable(
                    width="100%", thickness=1.5,
                    color=DSB_ORANGE, spaceAfter=6
                )
            )
        elif stripped.startswith("## "):
            flowables.append(Paragraph(stripped[3:], styles["h2"]))
        elif stripped.startswith(("- ", "* ")):
            text = stripped[2:]
            # Bold inline: **text**
            text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
            flowables.append(
                Paragraph(f"• {text}", styles["bullet"])
            )
        else:
            text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", stripped)
            text = re.sub(r"\*(.+?)\*", r"<i>\1</i>", text)
            flowables.append(Paragraph(text, styles["body"]))

    return flowables


# ── Page callback ──────────────────────────────────────────────────────────────

class _DSBPage:
    def __init__(self, release_tag: str):
        self.release_tag = release_tag
        self._page_num   = 0

    def __call__(self, c: canvas.Canvas, doc):
        self._page_num += 1
        c.saveState()
        _draw_background(c)
        _draw_header(c, self.release_tag)
        _draw_footer(c, self._page_num)
        c.restoreState()


# ── Public API ─────────────────────────────────────────────────────────────────

def render_release_notes_pdf(
    markdown_text: str,
    release_tag: str,
    output_path: str,
):
    """
    Render *markdown_text* as a DSB-branded A4 PDF and write it to *output_path*.
    """
    styles    = _styles()
    page_cb   = _DSBPage(release_tag)

    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=MARGIN_L,
        rightMargin=MARGIN_R,
        topMargin=MARGIN_T + 10 * mm,   # extra space below header bar
        bottomMargin=MARGIN_B + 6 * mm,
        title=f"DSB Streaming-Tool Release Notes {release_tag}",
        author="DSB Streaming-Tool",
    )

    story = _md_to_flowables(markdown_text, styles)

    doc.build(
        story,
        onFirstPage=page_cb,
        onLaterPages=page_cb,
    )
