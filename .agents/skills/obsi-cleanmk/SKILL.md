---
name: obsi-cleanmk
description: 웹 페이지 URL을 깔끔한 마크다운으로 변환. 광고·네비게이션 등 불필요한 요소 제거. 사용자가 URL을 분석하거나 읽어달라고 할 때, 온라인 문서·블로그·기사 등 일반 웹 페이지에 WebFetch 대신 사용. .md로 끝나는 URL은 이미 마크다운이므로 WebFetch 사용.
---

# Defuddle

Use Defuddle CLI to extract clean readable content from web pages. Prefer over WebFetch for standard web pages — it removes navigation, ads, and clutter, reducing token usage.

If not installed: `npm install -g defuddle`

## Usage

Always use `--md` for markdown output:

```bash
defuddle parse <url> --md
```

Save to file:

```bash
defuddle parse <url> --md -o content.md
```

Extract specific metadata:

```bash
defuddle parse <url> -p title
defuddle parse <url> -p description
defuddle parse <url> -p domain
```

## Output formats

| Flag | Format |
|------|--------|
| `--md` | Markdown (default choice) |
| `--json` | JSON with both HTML and markdown |
| (none) | HTML |
| `-p <name>` | Specific metadata property |
