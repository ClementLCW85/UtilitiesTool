---
Description: "Instructions for writing and formatting Markdown files in this project."
applyTo: "**/*.md"
---

# Markdown Instructions

## Project-Specific Markdown Standards

### Line Endings and Encoding
- **Line Endings:** Use `CRLF` (Windows-style) for all Markdown files
- **Encoding:** UTF-8 without BOM
- **Indentation:** 4 spaces (no tabs)

### Structure Guidelines
- Use H1 (`#`) for document titles (one per file)
- Use H2 (`##`) for main sections
- Use H3 (`###`) for subsections
- Ensure a blank line between headers and content
- Use `-` for unordered list items

### Formatting Enforcement
Before committing Markdown files, run the formatting script:
```powershell
powershell -ExecutionPolicy Bypass -File tools/format_files.ps1
```

The script automatically enforces:
| Property | Value |
|----------|-------|
| Line Endings | CRLF |
| Indentation | 4 spaces |
| Tab Conversion | Converted to 4 spaces |
| Encoding | UTF-8 (no BOM) |

---

**Note:** These standards ensure consistency across the documentation and reduce diff noise in version control.

### Related
- **ANTI_PATTERNS.md AP-400:** Committing Unformatted Code - See the full anti-pattern description for why formatting enforcement matters.
