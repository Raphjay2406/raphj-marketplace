# CMS Schema — p

**Platform**: payload
**Types exported**: 2

## Type → Block proposals

| Type | Fields | Proposed block |
|------|--------|----------------|
| pages | 3 | `page-shell` |
| articles | 3 | `article` |

## Full schema

```json
[
  {
    "name": "pages",
    "fields": [
      {
        "name": "slug",
        "type": "string"
      },
      {
        "name": "title",
        "type": "string"
      },
      {
        "name": "body",
        "type": "string"
      }
    ],
    "proposed_block": "page-shell"
  },
  {
    "name": "articles",
    "fields": [
      {
        "name": "title",
        "type": "string"
      },
      {
        "name": "body",
        "type": "string"
      },
      {
        "name": "author",
        "type": "string"
      }
    ],
    "proposed_block": "article"
  }
]
```

## Next
- Review `unknown`-mapped types via /gen:ingest gap p
- Confirmed mappings feed server-driven-ui block registry