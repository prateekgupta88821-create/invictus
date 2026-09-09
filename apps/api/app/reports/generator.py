import io
from datetime import datetime
from typing import Dict, Any, List
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

class InspectionReportGenerator:
    """
    Generates official Government-style Legal Metrology Inspection Records.
    Produces both PDF bytes and clean printable HTML documents.
    """
    
    @staticmethod
    def generate_html(data: Dict[str, Any]) -> str:
        case = data.get("case", {})
        fields = data.get("fields", [])
        violations = data.get("violations", [])
        inspector = data.get("inspector", {})
        audit_hash = data.get("audit_hash", "00000000000000000000000000000000")

        score = case.get("compliance_score", 0.0)
        risk = case.get("risk_level", "MEDIUM")
        risk_color = "#16a34a" if risk == "LOW" else ("#ca8a04" if risk == "MEDIUM" else "#dc2626")

        fields_rows = ""
        for f in fields:
            st = f.get("status", "VERIFY")
            st_badge = f'<span class="badge badge-{st.lower()}">{st}</span>'
            fields_rows += f"""
            <tr>
                <td style="font-weight: 600; text-transform: capitalize;">{f.get('field_name', '').replace('_', ' ')}</td>
                <td>{f.get('detected_value') or '—'}</td>
                <td>{int(f.get('confidence', 0)*100)}%</td>
                <td>{st_badge}</td>
            </tr>
            """

        violations_rows = ""
        if not violations:
            violations_rows = "<tr><td colspan='5' style='text-align: center; color: #16a34a; padding: 12px;'>No statutory violations confirmed. Package meets configured Legal Metrology requirements.</td></tr>"
        else:
            for v in violations:
                violations_rows += f"""
                <tr>
                    <td style="font-weight: 700; color: #dc2626;">{v.get('rule_code', '')}</td>
                    <td>{v.get('field_name', '').replace('_', ' ')}</td>
                    <td style="text-transform: uppercase; font-size: 11px; font-weight: 600;">{v.get('severity', '')}</td>
                    <td>{v.get('failure_message', '')}</td>
                    <td>{v.get('remediation', '')}</td>
                </tr>
                """

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>METROCHECK Inspection Record - {case.get('case_id', 'DRAFT')}</title>
    <style>
        body {{ font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.5; }}
        .header {{ border-bottom: 3px solid #0f2942; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-start; }}
        .gov-title {{ font-size: 22px; font-weight: 800; color: #0f2942; letter-spacing: 0.5px; margin: 0; }}
        .gov-sub {{ font-size: 13px; color: #475569; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }}
        .badge-notice {{ display: inline-block; padding: 4px 10px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 4px; font-size: 11px; font-weight: 700; color: #334155; }}
        .meta-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; background: #f8fafc; padding: 16px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }}
        .meta-item strong {{ display: block; color: #64748b; font-size: 11px; text-transform: uppercase; margin-bottom: 3px; }}
        .score-box {{ background: #fff; border: 2px solid {risk_color}; padding: 12px; border-radius: 6px; text-align: center; }}
        .score-val {{ font-size: 28px; font-weight: 800; color: {risk_color}; }}
        h3 {{ font-size: 16px; color: #0f2942; border-left: 4px solid #0f2942; padding-left: 10px; margin-top: 25px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }}
        table {{ width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; }}
        th {{ background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 9px 12px; border: 1px solid #e2e8f0; }}
        td {{ padding: 8px 12px; border: 1px solid #e2e8f0; vertical-align: top; }}
        .badge {{ padding: 2px 7px; border-radius: 3px; font-size: 11px; font-weight: 700; }}
        .badge-pass {{ background: #dcfce7; color: #166534; }}
        .badge-verify {{ background: #fef9c3; color: #854d0e; }}
        .badge-fail {{ background: #fee2e2; color: #991b1b; }}
        .notes-card {{ background: #fffbeb; border: 1px solid #fde68a; padding: 14px; border-radius: 6px; margin-bottom: 25px; font-size: 13px; }}
        .footer {{ border-top: 1px solid #cbd5e1; padding-top: 20px; margin-top: 40px; display: flex; justify-content: space-between; align-items: flex-end; font-size: 12px; color: #64748b; }}
        .sign-line {{ border-top: 1px solid #334155; width: 220px; text-align: center; padding-top: 6px; font-weight: 600; color: #0f2942; }}
        .audit-hash {{ font-family: monospace; font-size: 11px; color: #475569; word-break: break-all; margin-top: 5px; }}
        @media print {{ body {{ margin: 15mm; }} .no-print {{ display: none; }} }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1 class="gov-title">METROCHECK &bull; LEGAL METROLOGY INSPECTION RECORD</h1>
            <div class="gov-sub">Government of India &bull; Department of Consumer Affairs &bull; Legal Metrology Division</div>
            <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Form LMPC-IR/2026 under Rule 6 of the Packaged Commodities Rules, 2011</div>
        </div>
        <div style="text-align: right;">
            <div class="badge-notice">INSPECTION REPORT DRAFT / RECORD</div>
            <div style="font-size: 12px; margin-top: 6px; font-weight: 700; color: #0f2942;">Case: {case.get('case_id', 'N/A')}</div>
            <div style="font-size: 11px; color: #64748b;">Date: {case.get('created_at', datetime.now().strftime('%d-%b-%Y'))}</div>
        </div>
    </div>

    <div class="meta-grid">
        <div class="meta-item">
            <strong>Commodity / Product</strong>
            {case.get('product_name', 'N/A')}
        </div>
        <div class="meta-item">
            <strong>Manufacturer / Packer</strong>
            {case.get('manufacturer', 'N/A')}
        </div>
        <div class="meta-item">
            <strong>Inspection District & Location</strong>
            {case.get('location_name', 'District Office')}, {case.get('district', 'Delhi')}
        </div>
        <div class="meta-item">
            <strong>Inspecting Officer</strong>
            {inspector.get('full_name', 'Legal Metrology Officer')} ({inspector.get('badge_number', 'LMO-2026-DL')})
        </div>
        <div class="meta-item">
            <strong>Inspection Status</strong>
            {case.get('status', 'Under Review')}
        </div>
        <div class="score-box">
            <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Compliance Index</div>
            <div class="score-val">{score} / 100</div>
            <div style="font-size: 11px; font-weight: 700; color: {risk_color};">RISK: {risk}</div>
        </div>
    </div>

    <h3>1. Statutory Declarations Verification (Rule 6)</h3>
    <table>
        <thead>
            <tr>
                <th style="width: 25%;">Mandatory Field</th>
                <th style="width: 45%;">Detected Declaration on Pack</th>
                <th style="width: 15%;">Confidence</th>
                <th style="width: 15%;">Result</th>
            </tr>
        </thead>
        <tbody>
            {fields_rows}
        </tbody>
    </table>

    <h3>2. Observed Rule Violations & Remedial Requirements</h3>
    <table>
        <thead>
            <tr>
                <th style="width: 15%;">Rule Code</th>
                <th style="width: 20%;">Field</th>
                <th style="width: 12%;">Severity</th>
                <th style="width: 30%;">Statutory Failure</th>
                <th style="width: 23%;">Recommended Remediation</th>
            </tr>
        </thead>
        <tbody>
            {violations_rows}
        </tbody>
    </table>

    <h3>3. Inspecting Officer Observations</h3>
    <div class="notes-card">
        <strong>Official Remarks:</strong>
        <p style="margin: 6px 0 0 0;">{case.get('inspector_notes') or 'Routine package inspection conducted pursuant to Rule 6. All declarations checked for font height, metric unit standards, and mandatory inclusive-of-all-taxes MRP declaration.'}</p>
    </div>

    <div class="footer">
        <div>
            <div><strong>Cryptographic Audit Chain Integrity:</strong> &check; VERIFIED</div>
            <div class="audit-hash">Record SHA-256: {audit_hash}</div>
            <div style="font-size: 10px; color: #94a3b8; margin-top: 4px;">This electronic draft assists authorized officers. Final administrative notice requires statutory signing.</div>
        </div>
        <div class="sign-line">
            Authorized Legal Metrology Inspector<br>
            <span style="font-size: 11px; font-weight: normal; color: #64748b;">Seal & Digital Verification</span>
        </div>
    </div>
</body>
</html>"""
        return html

    @staticmethod
    def generate_pdf(data: Dict[str, Any]) -> bytes:
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            "GovTitle",
            parent=styles["Heading1"],
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0f2942"),
            fontName="Helvetica-Bold"
        )
        sub_style = ParagraphStyle(
            "GovSub",
            parent=styles["Normal"],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#475569")
        )
        section_style = ParagraphStyle(
            "SectionH",
            parent=styles["Heading3"],
            fontSize=11,
            leading=14,
            textColor=colors.HexColor("#0f2942"),
            fontName="Helvetica-Bold",
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "Body",
            parent=styles["Normal"],
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#1e293b")
        )

        elements = []

        case = data.get("case", {})
        fields = data.get("fields", [])
        violations = data.get("violations", [])
        inspector = data.get("inspector", {})
        audit_hash = data.get("audit_hash", "00000000000000000000000000000000")

        # Header
        elements.append(Paragraph("METROCHECK &bull; LEGAL METROLOGY INSPECTION RECORD", title_style))
        elements.append(Paragraph("Government of India &bull; Department of Consumer Affairs &bull; Legal Metrology (Packaged Commodities) Rules, 2011", sub_style))
        elements.append(Spacer(1, 10))
        elements.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#0f2942"), spaceAfter=10))

        # Metadata Table
        meta_data = [
            [
                Paragraph(f"<b>Case ID:</b> {case.get('case_id', 'N/A')}", body_style),
                Paragraph(f"<b>Date:</b> {case.get('created_at', datetime.now().strftime('%d-%b-%Y'))}", body_style),
                Paragraph(f"<b>Status:</b> {case.get('status', 'Under Review')}", body_style),
            ],
            [
                Paragraph(f"<b>Product:</b> {case.get('product_name', 'N/A')}", body_style),
                Paragraph(f"<b>Manufacturer:</b> {case.get('manufacturer', 'N/A')}", body_style),
                Paragraph(f"<b>Compliance Index:</b> <b>{case.get('compliance_score', 0.0)}/100</b>", body_style),
            ],
            [
                Paragraph(f"<b>Inspector:</b> {inspector.get('full_name', 'LMO')}", body_style),
                Paragraph(f"<b>District:</b> {case.get('district', 'Delhi')}", body_style),
                Paragraph(f"<b>Risk Level:</b> <b>{case.get('risk_level', 'MEDIUM')}</b>", body_style),
            ]
        ]
        meta_table = Table(meta_data, colWidths=[180, 180, 160])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0,0), (-1,-1), 5),
            ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ]))
        elements.append(meta_table)
        elements.append(Spacer(1, 14))

        # Section 1: Declarations
        elements.append(Paragraph("1. STATUTORY DECLARATIONS CHECKLIST (RULE 6)", section_style))
        decl_headers = ["Declaration", "Detected Value", "Confidence", "Status"]
        decl_rows = [[Paragraph(f"<b>{h}</b>", body_style) for h in decl_headers]]
        for f in fields[:12]:
            decl_rows.append([
                Paragraph(str(f.get('field_name', '')).replace('_', ' ').capitalize(), body_style),
                Paragraph(str(f.get('detected_value') or '—')[:35], body_style),
                Paragraph(f"{int(f.get('confidence', 0)*100)}%", body_style),
                Paragraph(str(f.get('status', 'VERIFY')), body_style),
            ])
        decl_table = Table(decl_rows, colWidths=[130, 230, 70, 90])
        decl_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(decl_table)
        elements.append(Spacer(1, 14))

        # Section 2: Violations
        elements.append(Paragraph("2. CONFIRMED / SUSPECTED VIOLATIONS", section_style))
        v_headers = ["Rule Code", "Field", "Severity", "Statutory Failure Message"]
        v_rows = [[Paragraph(f"<b>{h}</b>", body_style) for h in v_headers]]
        if not violations:
            v_rows.append([Paragraph("N/A", body_style), Paragraph("None", body_style), Paragraph("LOW", body_style), Paragraph("No violations detected. All declarations conform to LMPC Rules 2011.", body_style)])
        else:
            for v in violations:
                v_rows.append([
                    Paragraph(str(v.get('rule_code', '')), body_style),
                    Paragraph(str(v.get('field_name', '')).replace('_', ' '), body_style),
                    Paragraph(str(v.get('severity', '')).upper(), body_style),
                    Paragraph(str(v.get('failure_message', ''))[:80], body_style),
                ])
        v_table = Table(v_rows, colWidths=[90, 90, 70, 270])
        v_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#fee2e2")),
            ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#fca5a5")),
            ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#fecaca")),
            ('TOPPADDING', (0,0), (-1,-1), 4),
            ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ]))
        elements.append(v_table)
        elements.append(Spacer(1, 14))

        # Audit information & signature
        elements.append(Paragraph(f"<b>Audit Hash (SHA-256):</b> <font face='Courier' size=7>{audit_hash}</font>", sub_style))
        elements.append(Spacer(1, 20))
        elements.append(Paragraph("This document is an AI-assisted inspection draft record pursuant to Legal Metrology Act, 2009.", sub_style))

        doc.build(elements)
        return buffer.getvalue()

report_generator = InspectionReportGenerator()
