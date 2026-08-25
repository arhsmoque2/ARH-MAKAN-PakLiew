# Malaysian Localized Copy Register

Version: v0.1

Agent-operable register pack for Malaysian localized hospitality, weekday event, SME, GLC, agency-adjacent, social, and booking copy.

## Product split

```text
SKILL.md -> routing entrypoint
runtime-handbook/ -> compact pressure manual for brownfield repair and debugging
corpus/ -> source-of-truth for greenfield design and expansion
examples/ -> before/after and surface-specific examples
tests/ -> checklists, wrong-register tests, evaluation rubric
templates/ -> structured intake and evaluation templates
references/ -> source, terminology, and evidence notes
```

## Core thesis

```text
The corpus designs the language system.
The runtime handbook keeps agents safe under pressure.

Malay is not sprinkled for flavor.
English is not retained by laziness.
Loanwords are not accepted blindly.
Slang is not promoted by default.

Choose phrase by:
intent + object + register + surface + audience.

The goal is not merely correct translation.
The goal is locally compatible Malaysian copy.
```

## Registers

```text
hospitality_refined
hospitality_family
weekday_event_venue
corporate_refined
institutional_light
sme_business_friendly
social_caption
operational_whatsapp
```

## Default runtime load

```text
SKILL.md
runtime-handbook/agent-runtime-handbook.md
runtime-handbook/register-routing-quickmap.md
runtime-handbook/phrase-repair-cheatsheet.md
runtime-handbook/pressure-debug-cards.md
```

Load the corpus only for greenfield design, new domains, source-backed validation, phrase compatibility, or expansion.
