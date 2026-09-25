# Security Policy

## Supported Versions

We release security updates and bug fixes for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Yuwbrndr team and contributors take security seriously. Since Yuwbrndr runs entirely client-side in the browser with no backend database or cookies, security vulnerabilities primarily involve:
- Client-side code injection (XSS) escaping the canvas sandbox
- Unsafe SVG / HTML deserialization or export rendering
- Malicious URL hash payload processing

### How to Report

If you discover a security vulnerability:

1. **Do not create a public issue**.
2. Please report security advisories privately via [GitHub Private Vulnerability Reporting](https://github.com/TechAaroorian/yuwbrndr/security/advisories/new).
3. Alternatively, contact the maintainer directly through their GitHub profile: [@TechAaroorian](https://github.com/TechAaroorian).

### What to Include

Please include:
- A clear description of the vulnerability and its potential impact.
- Step-by-step reproduction instructions or a minimal proof of concept (PoC).
- Any suggested mitigations or code fixes.

### Response Timeline

- **Initial Acknowledgement**: Within 48 hours.
- **Triage & Assessment**: Within 5 business days.
- **Fix & Disclosure**: We will coordinate a release patch before public disclosure.
