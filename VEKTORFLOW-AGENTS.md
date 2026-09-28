# VektorFlow 15XR — Agent Handoff

## 2026-09-28 Registry Update

The VektorFlow dashboard now consumes the canonical content registry.

### Canonical source
- Registry: `src/content/vektorflow-content-map.json`
- Access layer: `src/content/vektorflow-content.ts`

### Dashboard integration completed
The dashboard now derives VektorFlow navigation from the registry instead of maintaining a separate hard-coded VektorFlow menu.

Registry-driven pages currently exposed by the dashboard are only nodes marked:
- `status: "existing"`
- `indexable: true`

This intentionally prevents planned routes from becoming dead links.

Existing VektorFlow pages also read their titles from the registry:
- `vf-agents`
- `vf-models`
- `vf-hermes`

### Important architecture rule
Do NOT create another hard-coded content/page relationship list in Hermes, OpenCode, the dashboard, SEO tooling, or the content generator.

Use the canonical registry and its stable node IDs.

### Registry authority
The registry is the canonical source for:
- content IDs
- canonical routes
- pillars
- concepts
- related agents
- incoming/outgoing relationship metadata
- content status
- indexability
- link-generation rules

### Current implementation boundary
This update does NOT change:
- Supabase/Postgres
- VektorFlow backend behavior
- Hermes runtime behavior
- agent runtime registration
- API contracts

The 15-agent catalog in the registry represents the target content architecture. It must not be treated as proof that all 15 agents are currently implemented at runtime.

### Recent commits
- Registry: `10bcc897ce60dfc0f87b2b27bd5a197b1f1c63ea`
- Dashboard registry integration: `d97e835251a80ccf26d2cc03ec8f202be704e94b`

### For Hermes / OpenCode
When working on VektorFlow content, dashboard navigation, SEO, breadcrumbs, sitemap generation, or future content generation:
1. Read `src/content/vektorflow-content-map.json`.
2. Use stable registry IDs rather than inventing new relationships.
3. Respect `status` and `indexable`.
4. Never link to a planned route unless that route has actually been implemented and its registry status is updated.
5. Preserve the registry as the single source of truth.
