#!/usr/bin/env python3
"""HEPE-INGEST-02D.2 section-aware Source-B coverage parser.
NON-PRODUCTION / controlled-source validation only.
Does not write canonical data or admit Audit Evidence.
"""
import re, sys, hashlib
from pathlib import Path
import fitz

EXPECTED_SHA='f580fec8bb661181cbc0dff3c58473563c4b723f2dde5e863d91667ea4ec3557'
EXPECTED_PAGES=157
EXPECTED_PROGRAMME='25510071103503'
EXPECTED_COURSES=92
CODE_RE=re.compile(r'\b([A-Z]{3})\s?(\d{4})\b')

def codes(text):
    return [a+b for a,b in CODE_RE.findall(text)]

def main(path):
    p=Path(path); data=p.read_bytes(); sha=hashlib.sha256(data).hexdigest()
    doc=fitz.open(path); pages=[doc[i].get_text('text') for i in range(len(doc))]
    assert sha==EXPECTED_SHA, (sha, EXPECTED_SHA)
    assert len(doc)==EXPECTED_PAGES, len(doc)
    assert EXPECTED_PROGRAMME in '\n'.join(pages[:8])

    # Source-B printed curriculum structure spans physical PDF pages 15–21.
    structural='\n'.join(pages[14:21])
    structural_codes=sorted(set(codes(structural)))
    assert len(structural_codes)==EXPECTED_COURSES, len(structural_codes)

    # Study-plan source section is bounded by explicit headings, physical pages 21–23.
    study='\n'.join(pages[20:23])
    s=study.find('3.1.4 แผนการศึกษา'); e=study.find('3.1.5 คำอธิบายรายวิชา')
    assert s>=0 and e>s
    study_segment=study[s:e]
    study_code_occurrences=codes(study_segment)

    # Exact PLO source statement block begins on physical PDF page 67.
    plo_block='\n'.join(pages[66:69])
    plo_ids=sorted(set(re.findall(r'PLO\s*([1-7])', plo_block)))
    assert plo_ids==list('1234567'), plo_ids

    # Curriculum mapping source block, physical PDF pages 103–108.
    mapping='\n'.join(pages[102:108])
    mapping_codes=sorted(set(codes(mapping)))

    print('SOURCE_IDENTITY=PASS')
    print('SHA256='+sha)
    print('PHYSICAL_PAGES='+str(len(doc)))
    print('STRUCTURAL_COURSE_UNIQUE='+str(len(structural_codes)))
    print('STRUCTURAL_COURSES='+','.join(structural_codes))
    print('STUDY_PLAN_CODE_OCCURRENCES='+str(len(study_code_occurrences)))
    print('PLO_COUNT='+str(len(plo_ids)))
    print('MAPPING_UNIQUE_COURSES='+str(len(mapping_codes)))
    print('CANONICAL_WRITE_ATTEMPTED=false')
    print('PRODUCTION=false')

if __name__=='__main__':
    if len(sys.argv)!=2:
        raise SystemExit('usage: hepe-ingest-02d2-section-aware-sourceb.py <source-b.pdf>')
    main(sys.argv[1])
