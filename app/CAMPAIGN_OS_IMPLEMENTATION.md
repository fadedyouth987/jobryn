# Campaign OS implementation

## Added in this build

- **Visual workflow builder:** draggable node canvas, editable nodes, execution status, stored outputs, add/delete controls, and visible approval blocks.
- **Natural-language workflow generation:** `POST /api/campaigns/generate-workflow` uses Gemini when configured and a deterministic fallback otherwise.
- **Persistent AI agents:** workspace-local agent definitions, instructions, memory, active/paused state.
- **Campaign reasoning/operator:** ordered step execution, visible run log, dependency-aware blocked steps, and no silent external actions.
- **Influencer identity locking:** seed, adapter, checkpoint and identity-recipe controls with an honest integration status for GPU/ComfyUI training.
- **CRM:** lead list, scoring, source and editable pipeline stages.
- **Landing page and website builder foundation:** page records, conversion preview and controlled publish/unpublish state.
- **Email automation:** trigger, subject/body preview and enable/disable control.
- **Client portals:** client records, portal state and approval counts.
- **Workspace persistence:** Campaign OS state is stored per workspace in browser local storage.

## Production integrations still required

This build provides the complete connected product workflow and UI foundation, but these external operations require credentials and infrastructure before they can truthfully execute in production:

1. Firestore persistence and server-side tenancy for Campaign OS entities.
2. Queue/worker execution for long-running agents.
3. ComfyUI or another GPU provider for LoRA training and image/video generation.
4. Email provider such as Resend or SendGrid.
5. Domain deployment and page hosting pipeline.
6. OAuth/API connections for social publishing.
7. Authentication-backed client portal links and permissions.

The UI deliberately labels or blocks operations that are not connected rather than pretending they succeeded.

## Run

```bash
cp .env.example .env
# add GEMINI_API_KEY when available
npm install
npm run dev
```

Open **Campaign OS** from the left navigation.
