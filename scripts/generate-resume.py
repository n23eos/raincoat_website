from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "resume"
FONT = "/Library/Fonts/NotoSans-Regular.ttf"
FONT_BOLD = "/Library/Fonts/NotoSans-Bold.ttf"
pdfmetrics.registerFont(TTFont("Noto", FONT))
pdfmetrics.registerFont(TTFont("Noto-Bold", FONT_BOLD))

INK = colors.HexColor("#25221d")
MUTED = colors.HexColor("#685f55")
ACCENT = colors.HexColor("#9c5d32")
LINE = colors.HexColor("#d8cec2")
PAPER = colors.HexColor("#fbf8f3")


def styles(lang):
    s = getSampleStyleSheet()
    s.add(ParagraphStyle("Name", parent=s["Normal"], fontName="Noto-Bold", fontSize=25, leading=28, textColor=INK, spaceAfter=2))
    s.add(ParagraphStyle("Role", parent=s["Normal"], fontName="Noto", fontSize=11, leading=15, textColor=ACCENT, spaceAfter=7))
    s.add(ParagraphStyle("Contact", parent=s["Normal"], fontName="Noto", fontSize=8.5, leading=12, textColor=MUTED, alignment=TA_LEFT))
    s.add(ParagraphStyle("Intro", parent=s["Normal"], fontName="Noto", fontSize=10.5, leading=14.5, textColor=INK, spaceAfter=7))
    s.add(ParagraphStyle("Head", parent=s["Normal"], fontName="Noto-Bold", fontSize=9.2, leading=12, textColor=ACCENT, spaceBefore=5, spaceAfter=3))
    s.add(ParagraphStyle("Body", parent=s["Normal"], fontName="Noto", fontSize=10.5, leading=14, textColor=INK, spaceAfter=2))
    s.add(ParagraphStyle("Project", parent=s["Normal"], fontName="Noto-Bold", fontSize=10.5, leading=14, textColor=INK))
    s.add(ParagraphStyle("ProjectBody", parent=s["Normal"], fontName="Noto", fontSize=10.5, leading=14, textColor=INK))
    return s


def link(label, url, style):
    return f'<a href="{url}"><font color="#9c5d32"><u>{label}</u></font></a>'


def build(lang, filename):
    ru = lang == "ru"
    s = styles(lang)
    title = "Raincoat"
    role = "AI Engineer / агентные системы / интеграции" if ru else "AI Engineer / agent systems / integrations"
    intro = (
        "Ищу junior/associate роль AI Engineer с полной удалёнкой из Батуми, Грузия (UTC+4). Проектный опыт в агентных системах, AI-инструментах, интеграциях и автоматизации; Python - часть стека и реализации проектов."
        if ru else
        "Seeking a junior or associate AI Engineer role, fully remote from Batumi, Georgia (UTC+4). Project experience in agent systems, AI tools, integrations, and automation; Python is part of the stack used to build projects."
    )
    skills_head = "Навыки" if ru else "Skills"
    projects_head = "Избранные проекты" if ru else "Selected projects"
    format_head = "Формат работы" if ru else "Work format"
    skills = (
        "Агентные системы, AI-инструменты, интеграции, автоматизация, Python, JavaScript, TypeScript, APIs, MCP, pytest, Git, HTML5, Canvas, Three.js. Русский, английский."
        if ru else
        "Agent systems, AI tools, integrations, automation, Python, JavaScript, TypeScript, APIs, MCP, pytest, Git, HTML5, Canvas, Three.js. Russian, English."
    )
    work = (
        "Полная удалёнка из Батуми, Грузия (UTC+4). Открыт к командной работе, обратной связи и code review."
        if ru else
        "Fully remote from Batumi, Georgia (UTC+4). Open to teamwork, feedback, and code review."
    )
    projects = [
        ("FlowSpeech", "https://github.com/n23eos/flowspeech", "Локальная диктовка на Python с faster-whisper; необязательная облачная очистка текста." if ru else "Local Python dictation with faster-whisper; optional cloud text cleanup."),
        ("Kaidzen", "https://github.com/n23eos/kaidzen", "Python CLI для сравнения изменений промптов, возобновляемых запусков и отчётов." if ru else "Python CLI for prompt change comparison, resumable runs, and reports."),
        ("Column Explorer", "https://github.com/n23eos/column_explorer", "TypeScript-плагин для навигации по файлам Obsidian в колонках." if ru else "TypeScript plugin for column based file navigation in Obsidian."),
        ("Bunny Survival", "https://serendipity-games.com/bunny-survival.html", "Браузерная HTML5-игра." if ru else "Browser based HTML5 game."),
    ]

    doc = SimpleDocTemplate(str(OUT / filename), pagesize=A4, rightMargin=17 * mm, leftMargin=17 * mm, topMargin=14 * mm, bottomMargin=12 * mm, title=title, author=title)
    story = [
        Paragraph(title, s["Name"]),
        Paragraph(role, s["Role"]),
        Paragraph(" · ".join([link("mns.nicholas@gmail.com", "mailto:mns.nicholas@gmail.com", s["Contact"]), link("github.com/n23eos", "https://github.com/n23eos", s["Contact"]), link("raincoat.cc", "https://raincoat.cc", s["Contact"]), link("Проекты" if ru else "Projects", "https://raincoat.cc/#products", s["Contact"])]), s["Contact"]),
        Spacer(1, 5),
        HRFlowable(width="100%", thickness=0.8, color=LINE, spaceAfter=7),
        Paragraph(intro, s["Intro"]),
        Paragraph(skills_head, s["Head"]),
        Paragraph(skills, s["Body"]),
        Paragraph(projects_head, s["Head"]),
    ]
    rows = []
    for name, url, desc in projects:
        rows.append([Paragraph(link(name, url, s["Project"]), s["Project"]), Paragraph(desc, s["ProjectBody"])])
    table = Table(rows, colWidths=[34 * mm, 135 * mm], hAlign="LEFT")
    table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 5),
        ("TOPPADDING", (0, 0), (-1, -1), 2),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
        ("LINEBELOW", (0, 0), (-1, -2), 0.35, LINE),
    ]))
    story.extend([table, Paragraph(format_head, s["Head"]), Paragraph(work, s["Body"])])

    def paint_page(canvas, _doc):
        canvas.saveState()
        canvas.setFillColor(PAPER)
        canvas.rect(0, 0, A4[0], A4[1], fill=1, stroke=0)
        canvas.restoreState()

    doc.build(story, onFirstPage=paint_page)


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    build("ru", "raincoat-resume-ru.pdf")
    build("en", "raincoat-resume-en.pdf")
