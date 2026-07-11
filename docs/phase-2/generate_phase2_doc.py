#!/usr/bin/env python3
"""
Generate the Momentum Digital -> VA Claims Phase 2 documentation PDF.

Branded deliverable matching the Momentum Digital "Custom Software Development &
Ownership Agreement" style. Uses ReportLab Platypus for flowing content plus an
onPage canvas callback to draw the wordmark header, footer, page numbers, and a
confidentiality line.

Run:  python3 generate_phase2_doc.py
Output: VA-Claims-Phase-2-Documentation.pdf (US Letter, ~0.9in margins)
"""

import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    ListFlowable,
    ListItem,
    KeepTogether,
)

# --------------------------------------------------------------------------- #
# Paths & fonts
# --------------------------------------------------------------------------- #
HERE = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(HERE, "VA-Claims-Phase-2-Documentation.pdf")

FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

pdfmetrics.registerFont(TTFont("DejaVuSans", FONT_REG))
pdfmetrics.registerFont(TTFont("DejaVuSans-Bold", FONT_BOLD))

# --------------------------------------------------------------------------- #
# Brand palette
# --------------------------------------------------------------------------- #
NAVY = colors.HexColor("#1B2533")      # primary dark navy
DEEP_NAVY = colors.HexColor("#0B1D33")  # deep navy
ORANGE = colors.HexColor("#F97316")     # accent
SLATE = colors.HexColor("#64748B")      # slate gray text
TINT = colors.HexColor("#F8FAFC")       # light tint background
BORDER = colors.HexColor("#D7DEE8")     # border gray
WHITE = colors.white

PAGE_W, PAGE_H = letter
MARGIN = 0.9 * inch

# --------------------------------------------------------------------------- #
# Styles
# --------------------------------------------------------------------------- #
styles = getSampleStyleSheet()

BODY = ParagraphStyle(
    "Body", parent=styles["Normal"], fontName="DejaVuSans", fontSize=10,
    leading=15, textColor=NAVY, spaceAfter=8,
)

EYEBROW = ParagraphStyle(
    "Eyebrow", fontName="DejaVuSans-Bold", fontSize=10.5, leading=14,
    textColor=ORANGE, spaceAfter=10,
)

COVER_TITLE = ParagraphStyle(
    "CoverTitle", fontName="DejaVuSans-Bold", fontSize=27, leading=32,
    textColor=NAVY, spaceAfter=14,
)

COVER_PROJECT = ParagraphStyle(
    "CoverProject", fontName="DejaVuSans-Bold", fontSize=13, leading=18,
    textColor=DEEP_NAVY, spaceAfter=8,
)

COVER_SUB = ParagraphStyle(
    "CoverSub", fontName="DejaVuSans", fontSize=11.5, leading=17,
    textColor=SLATE, spaceAfter=8,
)

WORDMARK_TEXT = ParagraphStyle(
    "WordmarkText", fontName="DejaVuSans-Bold", fontSize=20, leading=24,
    textColor=NAVY,
)

TAGLINE = ParagraphStyle(
    "Tagline", fontName="DejaVuSans", fontSize=10.5, leading=15,
    textColor=SLATE,
)

REF_SMALL = ParagraphStyle(
    "RefSmall", fontName="DejaVuSans", fontSize=8.5, leading=12,
    textColor=SLATE, spaceBefore=6,
)

H1 = ParagraphStyle(
    "H1", fontName="DejaVuSans-Bold", fontSize=16, leading=20,
    textColor=NAVY, spaceBefore=8, spaceAfter=10,
)

H2 = ParagraphStyle(
    "H2", fontName="DejaVuSans-Bold", fontSize=12.5, leading=16,
    textColor=DEEP_NAVY, spaceBefore=12, spaceAfter=6,
)

H3LABEL = ParagraphStyle(
    "H3Label", fontName="DejaVuSans-Bold", fontSize=10, leading=14,
    textColor=ORANGE, spaceBefore=6, spaceAfter=3,
)

SUBHEAD = ParagraphStyle(
    "SubHead", fontName="DejaVuSans-Bold", fontSize=11, leading=15,
    textColor=NAVY, spaceBefore=10, spaceAfter=5,
)

BULLET = ParagraphStyle(
    "Bullet", parent=BODY, fontSize=10, leading=14.5, spaceAfter=3,
)

CHECK = ParagraphStyle(
    "Check", parent=BODY, fontSize=10, leading=15, spaceAfter=5,
)

CALLOUT_TITLE = ParagraphStyle(
    "CalloutTitle", fontName="DejaVuSans-Bold", fontSize=10.5, leading=14,
    textColor=NAVY, spaceAfter=4,
)

CALLOUT_BODY = ParagraphStyle(
    "CalloutBody", fontName="DejaVuSans", fontSize=9.5, leading=14,
    textColor=DEEP_NAVY,
)

META_LABEL = ParagraphStyle(
    "MetaLabel", fontName="DejaVuSans-Bold", fontSize=9, leading=12,
    textColor=SLATE,
)

META_VALUE = ParagraphStyle(
    "MetaValue", fontName="DejaVuSans", fontSize=9.5, leading=12,
    textColor=NAVY,
)


# --------------------------------------------------------------------------- #
# Wordmark drawing helpers (reportlab primitives)
# --------------------------------------------------------------------------- #
def draw_mark(c, x, y, size):
    """Draw the rounded-square navy mark with an orange forward chevron.

    (x, y) is the lower-left corner of the mark; size is the square edge.
    """
    c.saveState()
    c.setFillColor(NAVY)
    c.roundRect(x, y, size, size, size * 0.22, stroke=0, fill=1)

    # Orange forward chevron (suggesting momentum) centered in the mark.
    c.setFillColor(ORANGE)
    inset = size * 0.30
    left = x + inset
    right = x + size - inset
    top = y + size - inset
    bottom = y + inset
    midy = y + size / 2.0
    notch = size * 0.16

    p = c.beginPath()
    p.moveTo(left, top)
    p.lineTo(right, midy)
    p.lineTo(left, bottom)
    p.lineTo(left + notch, bottom)
    p.lineTo(left + notch + (right - left - notch), midy)  # inner tip
    p.lineTo(left + notch, top)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.restoreState()


def draw_wordmark_inline(c, x, y, mark_size, text, font_size):
    """Draw mark + text baseline-aligned. Returns the x after the text."""
    draw_mark(c, x, y, mark_size)
    c.setFillColor(NAVY)
    c.setFont("DejaVuSans-Bold", font_size)
    text_x = x + mark_size + 0.12 * inch
    # vertically center text against the mark
    text_y = y + (mark_size - font_size) / 2.0 + font_size * 0.07
    c.drawString(text_x, text_y, text)
    return text_x + c.stringWidth(text, "DejaVuSans-Bold", font_size)


# --------------------------------------------------------------------------- #
# Page callbacks
# --------------------------------------------------------------------------- #
FOOTER_LEFT = (
    "Momentum Digital  |  VA Claims — Phase 2: Environment, Tools & Core Setup"
)
CONFIDENTIAL = (
    "Confidential — prepared for VA Claims under the Momentum Digital "
    "Custom Software Development & Ownership Agreement."
)


def draw_footer(c, doc):
    c.saveState()
    # thin top rule for the footer band
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(MARGIN, 0.72 * inch, PAGE_W - MARGIN, 0.72 * inch)

    c.setFont("DejaVuSans", 7.5)
    c.setFillColor(SLATE)
    c.drawString(MARGIN, 0.56 * inch, FOOTER_LEFT)
    c.drawRightString(PAGE_W - MARGIN, 0.56 * inch, "Page %d" % doc.page)

    c.setFont("DejaVuSans", 6.8)
    c.setFillColor(SLATE)
    c.drawCentredString(PAGE_W / 2.0, 0.40 * inch, CONFIDENTIAL)
    c.restoreState()


def on_cover(c, doc):
    """Cover page: big wordmark block already in the flow; footer only (no header)."""
    draw_footer(c, doc)


def on_inner(c, doc):
    """Inner pages: small wordmark header top-left + orange rule, plus footer."""
    c.saveState()
    mark_size = 0.26 * inch
    top_y = PAGE_H - 0.62 * inch
    draw_wordmark_inline(c, MARGIN, top_y, mark_size, "Momentum Digital", 11)

    # thin orange rule under the header
    rule_y = top_y - 0.10 * inch
    c.setStrokeColor(ORANGE)
    c.setLineWidth(1.4)
    c.line(MARGIN, rule_y, PAGE_W - MARGIN, rule_y)
    c.restoreState()

    draw_footer(c, doc)


# --------------------------------------------------------------------------- #
# Flowable builders
# --------------------------------------------------------------------------- #
def bullets(items, style=BULLET):
    return ListFlowable(
        [ListItem(Paragraph(t, style), leftIndent=14, value="•") for t in items],
        bulletType="bullet",
        bulletColor=ORANGE,
        bulletFontName="DejaVuSans",
        bulletFontSize=9,
        leftIndent=12,
        spaceBefore=2,
        spaceAfter=6,
    )


def numbered(items, style=BULLET):
    return ListFlowable(
        [ListItem(Paragraph(t, style), leftIndent=16) for t in items],
        bulletType="1",
        bulletColor=ORANGE,
        bulletFontName="DejaVuSans-Bold",
        bulletFontSize=10,
        leftIndent=14,
        spaceBefore=2,
        spaceAfter=6,
    )


def checklist(items):
    flows = []
    for t in items:
        flows.append(Paragraph("☐&nbsp;&nbsp;" + t, CHECK))
    return flows


def callout(title, body_html, accent=ORANGE):
    """Light-tinted info/callout box with a colored left edge."""
    title_p = Paragraph(title, CALLOUT_TITLE)
    body_p = Paragraph(body_html, CALLOUT_BODY)
    inner = Table([[title_p], [body_p]], colWidths=[PAGE_W - 2 * MARGIN - 0.30 * inch])
    inner.setStyle(TableStyle([
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (0, 0), 0),
        ("BOTTOMPADDING", (0, 0), (0, 0), 3),
        ("TOPPADDING", (0, 1), (0, 1), 0),
        ("BOTTOMPADDING", (0, 1), (-1, -1), 0),
    ]))
    outer = Table([[inner]], colWidths=[PAGE_W - 2 * MARGIN])
    outer.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TINT),
        ("BOX", (0, 0), (-1, -1), 0.75, BORDER),
        ("LINEBEFORE", (0, 0), (0, -1), 3, accent),
        ("LEFTPADDING", (0, 0), (-1, -1), 14),
        ("RIGHTPADDING", (0, 0), (-1, -1), 14),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
    ]))
    return KeepTogether([Spacer(1, 4), outer, Spacer(1, 8)])


def section_rule():
    """A thin orange rule used under section H1 headers."""
    t = Table([[""]], colWidths=[PAGE_W - 2 * MARGIN], rowHeights=[2])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), ORANGE),
        ("LINEBELOW", (0, 0), (-1, -1), 0, ORANGE),
    ]))
    return t


def section_header(num, title):
    return [KeepTogether([
        Spacer(1, 2),
        Paragraph("SECTION %s" % num, H3LABEL),
        Paragraph(title, H1),
        section_rule(),
        Spacer(1, 8),
    ])]


def setup_block(num, title, goal, tasks, deliverables, recommendation=None,
                note=None, fwd=None):
    """2.x sub-section: header + Goal / Key tasks / Deliverables mini-blocks."""
    flows = [Paragraph("%s&nbsp;&nbsp;%s" % (num, title), H2)]
    flows.append(Paragraph("Goal", H3LABEL))
    flows.append(Paragraph(goal, BODY))
    flows.append(Paragraph("Key tasks", H3LABEL))
    flows.append(bullets(tasks))
    if recommendation is not None:
        flows.append(callout("Recommendation (starter — confirm against Phase 1 decisions)",
                             recommendation))
    if note is not None:
        flows.append(callout("Note", note))
    if fwd is not None:
        flows.append(callout(fwd[0], fwd[1]))
    flows.append(Paragraph("Deliverables", H3LABEL))
    flows.append(bullets(deliverables))
    flows.append(Spacer(1, 6))
    return flows


# --------------------------------------------------------------------------- #
# Cover page
# --------------------------------------------------------------------------- #
def cover_wordmark_flowable():
    """Big wordmark block for the cover, drawn as a table with the mark + text."""
    # We draw the mark inline using a small Table whose first cell hosts a
    # Flowable that paints the mark via a canvas; simplest is to use a
    # Paragraph + a drawn mark in the cover via a dedicated Flowable.
    return None  # cover mark is drawn by the CoverMark flowable below


class CoverMark(Spacer):
    """A flowable that paints the large cover wordmark (mark + text)."""

    def __init__(self, width, mark_size=0.62 * inch):
        super().__init__(width, mark_size)
        self.mark_size = mark_size

    def draw(self):
        c = self.canv
        draw_wordmark_inline(c, 0, 0, self.mark_size, "Momentum Digital", 22)


def build_cover():
    flows = []
    flows.append(Spacer(1, 0.35 * inch))
    flows.append(CoverMark(PAGE_W - 2 * MARGIN))
    flows.append(Spacer(1, 10))
    flows.append(Paragraph(
        "Custom software, digital growth, and ownership-first development",
        TAGLINE))
    flows.append(Spacer(1, 0.55 * inch))

    flows.append(Paragraph("PHASE 2 DOCUMENTATION", EYEBROW))
    flows.append(Paragraph("Software Environment, Tools &amp; Core Setup", COVER_TITLE))
    flows.append(Paragraph(
        "VA Claims — Custom Software Platform (working name: Amelia)",
        COVER_PROJECT))
    flows.append(Paragraph(
        "Phase 2 setup guide and technical requirements for the development team.",
        COVER_SUB))

    flows.append(Spacer(1, 0.7 * inch))

    # Meta info table (two columns of label/value pairs)
    def cell(label, value):
        return [Paragraph(label, META_LABEL), Paragraph(value, META_VALUE)]

    rows = [
        cell("CLIENT", "VA Claims") + cell("AGENCY", "Momentum Digital"),
        cell("PHASE", "2 of 5") + cell("PREPARED", "June 2026"),
        cell("DOCUMENT TYPE", "Phase 2 starter documentation")
        + cell("STATUS", "Draft for review"),
    ]
    avail = PAGE_W - 2 * MARGIN
    c1 = 0.95 * inch
    c2 = avail / 2 - c1
    meta = Table(rows, colWidths=[c1, c2, c1, c2])
    meta.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), TINT),
        ("BOX", (0, 0), (-1, -1), 0.75, BORDER),
        ("INNERGRID", (0, 0), (-1, -1), 0.5, BORDER),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 9),
        ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    flows.append(meta)

    flows.append(Spacer(1, 0.35 * inch))
    flows.append(Paragraph(
        "Operationalizes Phase 2 of the VA Claims Custom Software Development "
        "&amp; Ownership Agreement (Momentum Digital, May 2026).",
        REF_SMALL))
    return flows


# --------------------------------------------------------------------------- #
# Body content
# --------------------------------------------------------------------------- #
def build_body():
    f = []

    # ---- SECTION 1 --------------------------------------------------------
    f += section_header("1", "Phase 2 at a Glance")
    f.append(Paragraph(
        "Phase 2 follows the approved Phase 1 discovery and roadmap. Its purpose "
        "is to stand up the technical foundation that all core development in "
        "Phase 3 will be built on. This document translates the Phase 2 scope "
        "from the Custom Software Development &amp; Ownership Agreement into "
        "concrete setup tasks, recommendations, deliverables, and exit criteria "
        "for the build team.", BODY))

    f.append(Paragraph("Phase 2 scope (per the agreement)", SUBHEAD))
    f.append(bullets([
        "Development environment setup",
        "Software framework setup",
        "User access and permissions planning",
        "Database or backend structure setup",
        "Tool and platform configuration",
        "Secure access setup where applicable",
    ]))

    f.append(Paragraph("Objectives", SUBHEAD))
    f.append(numbered([
        "Stand up reproducible local, staging, and production environments.",
        "Select and scaffold the application framework agreed in Phase 1.",
        "Define the user role and permission model before features are built.",
        "Establish the database / backend schema foundation — including the "
        "structures the Phase 3 &ldquo;Payment Watch&rdquo; feature will depend on.",
        "Configure supporting tools and platforms (version control, CI, hosting, "
        "monitoring, communication).",
        "Implement a secure access baseline (secrets management, authentication, "
        "least-privilege).",
    ]))

    f.append(callout(
        "Approval gate",
        "Phase 2 begins after Phase 1 approval and the $3,000 Phase 2 "
        "prepayment. Phase 3 begins only after Phase 2 is reviewed and approved "
        "by VA Claims and the next prepayment is completed."))

    f.append(Paragraph("Out of scope for Phase 2", SUBHEAD))
    f.append(Paragraph(
        "Core feature development, the Payment Watch tracking logic and UI, "
        "third-party integrations, and user dashboards are Phase 3 work. Phase 2 "
        "prepares the ground; it does not build features.", BODY))

    # ---- SECTION 2 --------------------------------------------------------
    f += section_header("2", "Detailed Setup Requirements")

    f += setup_block(
        "2.1", "Development Environment Setup",
        "A reproducible environment any developer can run locally, plus separate "
        "staging and production environments.",
        [
            "Local dev setup documentation (&ldquo;clone &rarr; install &rarr; run&rdquo;).",
            "Environment variable templates (<font name='DejaVuSans-Bold'>.env.example</font>).",
            "Pinned dependency and runtime versions.",
            "Optional containerization (e.g., Docker) for parity.",
            "Clear separation of dev / staging / production.",
        ],
        [
            "Environment README.",
            "<font name='DejaVuSans-Bold'>.env.example</font> file.",
            "The application skeleton running locally on each developer machine.",
            "A provisioned staging environment.",
        ])

    f += setup_block(
        "2.2", "Software Framework Setup",
        "Select and scaffold the application stack decided in Phase 1, with "
        "conventions in place before feature work begins.",
        [
            "Confirm frontend and backend frameworks.",
            "Scaffold the project and folder structure.",
            "Configure linting and formatting.",
            "Set up base routing and a health-check endpoint.",
            "Establish coding standards.",
        ],
        [
            "Scaffolded repository that builds and runs.",
            "Coding-standards note.",
            "Base application shell.",
        ],
        recommendation=(
            "A modern, ownership-friendly web stack such as a React/Next.js "
            "frontend with a TypeScript/Node or Python backend and a PostgreSQL "
            "relational database. Favor mainstream, well-documented tooling so "
            "VA Claims can maintain and own the codebase after handoff."))

    f += setup_block(
        "2.3", "User Access &amp; Permissions Planning",
        "Define who can do what in the platform before features are built.",
        [
            "Enumerate user roles (e.g., Admin, Staff / Claims Agent — confirm "
            "the full list with VA Claims).",
            "Map permissions to each role.",
            "Choose an authentication method (email/password and/or SSO).",
            "Set session and timeout policy.",
            "Plan audit logging for access to sensitive records.",
        ],
        [
            "A roles-and-permissions matrix.",
            "Documented authentication approach.",
        ],
        note=(
            "VA claims involve sensitive veteran PII. Design for least-privilege "
            "access and audit logging from the start."))

    f += setup_block(
        "2.4", "Database / Backend Structure Setup",
        "Establish the foundational data model and backend structure.",
        [
            "Model core entities (Clients/Veterans, Claims, C&amp;P exam events, Users).",
            "Set up a migrations tool.",
            "Create seed / test data.",
            "Define a backup strategy.",
        ],
        [
            "Initial schema and migrations applied to staging.",
            "An entity-relationship diagram (ERD).",
            "Seed data.",
        ],
        fwd=(
            "Preparing for Phase 3: Payment Watch",
            "The Phase 3 Payment Watch feature monitors clients 60&ndash;120 days "
            "and 121+ days post C&amp;P exam, with manual timer initiation, a "
            "two-group dashboard view, and paid-status management. Design the "
            "client/record schema now to support it — for example fields such "
            "as <font name='DejaVuSans-Bold'>cp_exam_date</font>, "
            "<font name='DejaVuSans-Bold'>watch_timer_started_at</font>, a derived "
            "<font name='DejaVuSans-Bold'>watch_group</font> (60&ndash;120 vs 121+), "
            "<font name='DejaVuSans-Bold'>paid_status</font>, and "
            "<font name='DejaVuSans-Bold'>paid_at</font>. Build only the schema "
            "foundation in Phase 2; the tracking logic and dashboard are built in "
            "Phase 3."))

    f += setup_block(
        "2.5", "Tool &amp; Platform Configuration",
        "Stand up the development and operations tooling that supports the build.",
        [
            "Version control (Git repository + branching strategy).",
            "A CI pipeline (lint, test, build).",
            "A hosting / deploy target for staging.",
            "Error monitoring and logging.",
            "Project-management and communication channels per the agreement.",
        ],
        [
            "Repository with green CI.",
            "Staging auto-deploy on merge.",
            "Monitoring / logging connected.",
        ])

    f += setup_block(
        "2.6", "Secure Access Setup",
        "Establish a security baseline appropriate for sensitive veteran data.",
        [
            "Secrets management (no secrets committed to the repo).",
            "HTTPS/TLS everywhere.",
            "Role-based access to infrastructure.",
            "Least-privilege cloud IAM.",
            "Dependency vulnerability scanning.",
            "A validated backup/restore.",
            "A basic data-handling note aligned with the agreement&rsquo;s "
            "confidentiality and ownership terms.",
        ],
        [
            "Configured secrets store.",
            "Documented access controls.",
            "A security checklist.",
        ])

    # ---- SECTION 3 --------------------------------------------------------
    f += section_header("3", "Phase 2 Definition of Done (Exit Criteria)")
    f.append(Paragraph(
        "Phase 2 is complete and ready for client approval when:", BODY))
    f += checklist([
        "Local, staging, and production environments are running and documented.",
        "The application framework is scaffolded, builds cleanly, and follows "
        "agreed conventions.",
        "The roles-and-permissions matrix is documented and approved.",
        "The foundational database schema is migrated on staging (including "
        "fields that support the Phase 3 Payment Watch feature).",
        "The repository has green CI and staging deploys automatically.",
        "The secrets-management and security baseline are in place.",
        "A Phase 2 walkthrough/demo has been delivered to VA Claims and approved.",
    ])
    f.append(Spacer(1, 6))
    f.append(callout(
        "Unlocks Phase 3",
        "Client approval of Phase 2, together with the Phase 3 prepayment, "
        "unlocks Phase 3 (Core Development &amp; Feature Buildout)."))

    # ---- SECTION 4 --------------------------------------------------------
    f += section_header("4", "Assumptions, Dependencies &amp; Open Questions")

    f.append(Paragraph("Assumptions", SUBHEAD))
    f.append(bullets([
        "Phase 1 discovery decisions (technology stack, hosting, user roles) are "
        "finalized and carried forward into this document.",
    ]))

    f.append(Paragraph("Dependencies", SUBHEAD))
    f.append(bullets([
        "VA Claims to confirm the full list of user roles.",
        "Provide any required third-party or API access.",
        "Approve the hosting provider.",
    ]))

    f.append(Paragraph("Open questions", SUBHEAD))
    f.append(bullets([
        "Confirm the final technology stack.",
        "Confirm the hosting provider.",
        "Confirm the complete list of user roles.",
        "Confirm data-retention and compliance requirements for veteran PII.",
    ]))

    f.append(Spacer(1, 8))
    f.append(callout(
        "Reference",
        "This document operationalizes Phase 2 of the VA Claims Custom Software "
        "Development &amp; Ownership Agreement (Momentum Digital, May 2026). All "
        "ownership, confidentiality, and non-resale terms in that agreement apply.",
        accent=NAVY))

    return f


# --------------------------------------------------------------------------- #
# Document assembly
# --------------------------------------------------------------------------- #
def build():
    doc = BaseDocTemplate(
        OUTPUT, pagesize=letter,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=MARGIN, bottomMargin=MARGIN,
        title="VA Claims — Phase 2: Software Environment, Tools & Core Setup",
        author="Momentum Digital",
        subject="Phase 2 starter documentation",
    )

    # Cover frame: full content area (no running header band needed)
    cover_frame = Frame(
        MARGIN, MARGIN, PAGE_W - 2 * MARGIN, PAGE_H - 2 * MARGIN,
        id="cover", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )
    # Inner frame: leave room at the top for the wordmark header.
    header_space = 0.55 * inch
    inner_frame = Frame(
        MARGIN, MARGIN, PAGE_W - 2 * MARGIN,
        PAGE_H - 2 * MARGIN - header_space,
        id="inner", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0,
    )

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=on_cover),
        PageTemplate(id="Inner", frames=[inner_frame], onPage=on_inner),
    ])

    from reportlab.platypus import NextPageTemplate, PageBreak

    story = []
    story.append(NextPageTemplate("Inner"))
    story += build_cover()
    story.append(PageBreak())
    story += build_body()

    doc.build(story)
    return OUTPUT


if __name__ == "__main__":
    path = build()
    print("Wrote: %s" % path)
    print("Size: %d bytes" % os.path.getsize(path))
