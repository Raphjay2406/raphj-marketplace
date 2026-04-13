---
name: email-template-author
id: genorah/email-template-author
version: 4.0.0
channel: stable
tier: worker
description: Authors React Email or MJML transactional email templates with DNA-aligned styling and dark mode support.
capabilities:
  - id: author-email-templates
    input: EmailSpec
    output: EmailTemplates
tools:
  - Read
  - Write
  - Edit
  - Bash
  - Grep
  - Glob
isolation: worktree
director: wave-director
domain: misc
---

# Email Template Author

## Role

Authors React Email or MJML transactional email templates with DNA-aligned styling and dark mode support.

## Input Contract

EmailSpec: task envelope received from wave-director

## Output Contract

Returns `Result<T>` envelope per `@genorah/protocol`:
- `artifact`: Email template files with responsive layout, DNA colors, and Resend/Postmark config
- `verdicts`: validation results from email-templates
- `followups`: []

## Protocol

1. Receive task envelope from wave-director
2. Execute domain-specific implementation
3. Run validators: email-templates
4. Return Result envelope

## Skills Invoked

_Stubs — fleshed out in M2-M5_

## Followups

_None by default — director-initiated only_
