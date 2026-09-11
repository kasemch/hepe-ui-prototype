#!/usr/bin/env python3
"""HEPE-INGEST-02B.3 Source-B real PDF binary read-only E2E harness.

NON-PRODUCTION ONLY. Reads the exact controlled consolidated curriculum PDF,
computes SHA-256, parses native PDF text with PyMuPDF, records candidate/page
provenance, and performs no canonical/DB/schema/RLS/IAM/Production write.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import fitz


def page_hits(pages: list[str], pattern: str) -> list[int]:
    rx = re.compile(pattern, re.I | re.S)
    return [i + 1 for i, text in enumerate(pages) if rx.search(text)]


def main() -> int:
    if len(sys.argv) != 2:
        print("USAGE: python scripts/hepe-ingest-02b3-sourceb-e2e.py <controlled-source-b.pdf>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    raw = path.read_bytes()
    signature = raw[:5]
    sha256 = hashlib.sha256(raw).hexdigest()
    if signature != b"%PDF-":
        print(json.dumps({"gate": "HEPE-INGEST-02B.3", "pdfSignature": "FAIL"}, ensure_ascii=False))
        return 1

    doc = fitz.open(path)
    pages = [doc.load_page(i).get_text("text") for i in range(doc.page_count)]

    result = {
        "gate": "HEPE-INGEST-02B.3",
        "scope": "NON-PRODUCTION / SOURCE-B REAL PDF BINARY / READ-ONLY",
        "fileName": path.name,
        "byteLength": len(raw),
        "pdfSignature": "PASS",
        "sha256": sha256,
        "pageCount": doc.page_count,
        "parser": "PyMuPDF native PDF text extraction",
        "candidates": {
            "programme_code": {"value": "25510071103503", "pages": page_hits(pages, r"25510071103503")},
            "total_credits": {"value": 151, "pages": page_hits(pages, r"151\s*หน่วยกิต")},
            "effective_term": {"value": "ภาคการศึกษาที่ 2 ปีการศึกษา 2567", "pages": page_hits(pages, r"ภาคการศึกษาที่\s*2\s*ปีการศึกษา\s*2567")},
            "university_council": {
                "meeting": "6/2567",
                "agenda": "5.13",
                "date": "13 พฤษภาคม 2567",
                "pages": page_hits(pages, r"ครั้งที่\s*\.{0,5}\s*6\s*\.{0,5}/\.{0,5}\s*2567.*?วาระที่.*?5\.13.*?13.*?พฤษภาคม.*?2567"),
            },
            "plo_section": {"pages": page_hits(pages, r"PLO1.*?PLO2.*?PLO3|ผลลัพธ์การเรียนรู้ที่คาดหวัง.*?PLO1")},
            "curriculum_mapping": {"pages": page_hits(pages, r"Curriculum Mapping|การกระจายความรับผิดชอบมาตรฐานผลการเรียนรู้")},
        },
        "externalApprovals": {
            "ohec": "NOT_PROVIDED_IN_PDF",
            "professionalBody": "NOT_PROVIDED_IN_PDF",
        },
        "canonicalWriteAttempted": False,
        "databaseMutationAttempted": False,
        "schemaRlsIamChangeAttempted": False,
        "productionActionAttempted": False,
    }

    required = [
        result["pdfSignature"] == "PASS",
        result["pageCount"] == 157,
        *[bool(result["candidates"][key]["pages"]) for key in [
            "programme_code", "total_credits", "effective_term",
            "university_council", "plo_section", "curriculum_mapping"
        ]],
    ]
    result["binaryE2EAssertions"] = "PASS" if all(required) else "FAIL"
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["binaryE2EAssertions"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
