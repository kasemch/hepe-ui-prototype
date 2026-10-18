# HEPE-TPRS vNext xAPI Interoperability Boundary

HEPE-TPRS native events remain canonical. xAPI is an interoperability representation, not the source of academic truth.

Current implementation includes only a pure transformation function from a native event to an xAPI-ready statement shape. There is no HTTP sender, LRS credential, retry queue, or outbound transport.

Privacy rules before any future transmission:
- do not transmit student names by default;
- use a privacy-preserving account mapping;
- define purpose and retention;
- authorize event categories individually;
- verify external LRS license/operations/security;
- prohibit synthetic FinLit activity completion from being interpreted as official programme completion.

Any external transmission of real learner records remains a Human Gate.
