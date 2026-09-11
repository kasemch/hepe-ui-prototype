#!/usr/bin/env python3
"""HEPE-INGEST-02B.2 real PDF binary read-only E2E harness.

NON-PRODUCTION ONLY. Reads a local controlled PDF, computes SHA-256, parses native
PDF text with PyMuPDF, emits candidate/provenance assertions, and performs no DB,
canonical, IAM, schema, RLS, or production write.

The harness is source-neutral for the controlled BED-HPE-2567 representations: it
extracts the effective term and University Council metadata from the binary rather
than hard-coding the 86-page edited-source values.
"""
from __future__ import annotations

import hashlib
import json
import re
import sys
from pathlib import Path

import fitz  # PyMuPDF


def page_hits(pages: list[str], pattern: str) -> list[int]:
    rx = re.compile(pattern, re.I | re.S)
    return [i + 1 for i, text in enumerate(pages) if rx.search(text)]


def first_group(pages: list[str], pattern: str, group: int = 1) -> tuple[str | None, list[int]]:
    rx = re.compile(pattern, re.I | re.S)
    hits: list[int] = []
    value: str | None = None
    for i, text in enumerate(pages):
        m = rx.search(text)
        if m:
            hits.append(i + 1)
            if value is None:
                value = re.sub(r"\s+", " ", m.group(group)).strip()
    return value, hits


def main() -> int:
    if len(sys.argv) != 2:
        print("USAGE: python scripts/hepe-ingest-02b2-realpdf-e2e.py <controlled.pdf>", file=sys.stderr)
        return 2

    path = Path(sys.argv[1])
    raw = path.read_bytes()
    signature = raw[:5]
    sha256 = hashlib.sha256(raw).hexdigest()
    if signature != b"%PDF-":
        print(json.dumps({"gate": "HEPE-INGEST-02B.2", "pdfSignature": "FAIL"}, ensure_ascii=False))
        return 1

    doc = fitz.open(path)
    pages = [doc.load_page(i).get_text("text") for i in range(doc.page_count)]

    effective_term, effective_term_pages = first_group(
        pages,
        r"(ภาคการศึกษาที่\s*\d+\s*ปีการศึกษา\s*2567)",
    )
    council_meeting, council_pages = first_group(
        pages,
        r"ที่ประชุมสภามหาวิทยาลัยรามคำแหง\s*ครั้งที่\s*\.*\s*([0-9]+\s*/\s*2567)",
    )
    council_agenda, agenda_pages = first_group(
        pages,
        r"วาระที่\s*\.*\s*([0-9]+(?:\.[0-9]+)?)",
    )
    council_date, date_pages = first_group(
        pages,
        r"เมื่อวันที่\s*\.*\s*([0-9]+)\s*\.*\s*เดือน\s*\.*\s*([ก-๙]+)\s*\.*\s*พ\.ศ\.\s*\.*\s*(2567)",
        group=0,
    )

    result = {
        "gate": "HEPE-INGEST-02B.2",
        "scope": "NON-PRODUCTION / REAL PDF BINARY / READ-ONLY",
        "fileName": path.name,
        "byteLength": len(raw),
        "pdfSignature": "PASS",
        "sha256": sha256,
        "pageCount": doc.page_count,
        "parser": "PyMuPDF native PDF text extraction",
        "candidates": {
            "programme_code": {"value": "25510071103503", "pages": page_hits(pages, r"25510071103503")},
            "total_credits": {"value": 151, "pages": page_hits(pages, r"151\s*หน่วยกิต")},
            "effective_term": {"value": effective_term, "pages": effective_term_pages},
            "plo_section": {"pages": page_hits(pages, r"ผลลัพธ์การเรียนรู้ที่คาดหวังระดับหลักสูตร|Program Learning Outcomes")},
        },
        "approvalInPdf": {
            "universityCouncil": {
                "meeting": council_meeting,
                "agenda": council_agenda,
                "dateRaw": council_date,
                "pages": sorted(set(council_pages + agenda_pages + date_pages)),
            },
            "ohec": "NOT_PROVIDED_IN_THIS_BINARY" if not page_hits(pages, r"สป\.อว\..{0,120}(รับรอง|เห็นชอบ).{0,120}[0-9]{1,2}.{0,40}(256[0-9])") else "PRESENT_REQUIRES_REVIEW",
            "professionalBody": "NOT_PROVIDED_IN_THIS_BINARY" if not page_hits(pages, r"องค์กรวิชาชีพ.{0,120}(รับรอง|เห็นชอบ).{0,120}[0-9]{1,2}.{0,40}(256[0-9])") else "PRESENT_REQUIRES_REVIEW",
        },
        "canonicalWriteAttempted": False,
        "databaseMutationAttempted": False,
        "schemaRlsIamChangeAttempted": False,
        "productionActionAttempted": False,
    }

    required = [
        result["candidates"]["programme_code"]["pages"],
        result["candidates"]["total_credits"]["pages"],
        result["candidates"]["effective_term"]["pages"],
    ]
    result["binaryE2EAssertions"] = "PASS" if all(required) else "FAIL"
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["binaryE2EAssertions"] == "PASS" else 1


if __name__ == "__main__":
    raise SystemExit(main())
