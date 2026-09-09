# Daily Digest

A static Astro site for daily research and reception briefs. Content is the source of truth: one JSON file per day. The layout does not change when a new day is published.

Built for SMB ops reading. Grok Bot can maintain it by appending a file and rebuilding.

## Local run

Requires Node 22.12 or newer and npm.

```bash
npm install
npm run dev
```

Dev server defaults to [http://127.0.0.1:43147](http://127.0.0.1:43147).

```bash
npm run build
npm run preview
```

`npm run build` validates every update against the Zod schema in `src/content.config.ts`. Invalid JSON, missing fields, bad URLs, or a `date` that does not match the filename will fail the build.

Optional local Docker (nginx on port 43180):

```bash
docker compose up --build
```

## Pages

| Path | What it is |
| --- | --- |
| `/` | Latest update featured, then earlier days |
| `/updates/YYYY-MM-DD/` | Full brief: summary, sections, sources, bottom line |
| `/about/` | How the site is maintained |
| `/rss.xml` | Feed of the collection |

## Project layout

```
content/updates/          # source of truth — add YYYY-MM-DD.json here
src/content.config.ts     # Zod schema (build fails on bad content)
src/lib/                  # site copy + collection helpers
src/pages/                # routes
src/layouts/              # one document shell
src/components/           # header, footer, article
scripts/new-update.mjs    # scaffold today’s file
Dockerfile                # Coolify: build static, serve with nginx
```

## How Grok Bot adds a daily update

Do not edit layouts, CSS, or routes for a new day. Add one file.

**Path**

```
content/updates/YYYY-MM-DD.json
```

Example: `content/updates/2026-09-06.json`

The filename stem and the `date` field must be the same `YYYY-MM-DD` string.

**Scaffold (optional)**

```bash
npm run new-update
npm run new-update -- --date 2026-09-06
```

That writes a valid empty brief. Replace the placeholder copy. Do not invent live metrics.

**Schema example**

```json
{
  "date": "2026-09-06",
  "title": "Short specific title",
  "summary": "Two or three sentences. This is the TL;DR callout.",
  "tone": "cautious",
  "sections": [
    {
      "heading": "What the coverage said",
      "bullets": [
        "Observation with a source.",
        "Second observation."
      ],
      "sources": [
        {
          "label": "Publication — article title",
          "url": "https://example.com/article"
        }
      ]
    },
    {
      "heading": "What to do with it",
      "bullets": [
        "An action a busy operator can take."
      ]
    }
  ],
  "bottomLine": "One paragraph someone can act on today."
}
```

**Field rules**

| Field | Required | Notes |
| --- | --- | --- |
| `date` | yes | `YYYY-MM-DD`, must match the filename |
| `title` | yes | Non-empty string |
| `summary` | yes | Short TL;DR |
| `tone` | no | Short free string (for example `neutral`, `cautious`) |
| `sections` | yes | At least one section |
| `sections[].heading` | yes | Section title |
| `sections[].bullets` | yes | At least one non-empty string |
| `sections[].sources` | no | `{ label, url }` — `url` must be a valid URL |
| `bottomLine` | yes | Closing takeaway |

**Verify**

```bash
npm run build
```

If the build passes, commit the JSON file and deploy. If it fails, fix the file — do not relax the schema to sneak bad content through.

## Coolify deploy (Docker)

The production image is a two-stage Dockerfile: Node builds the static site, nginx serves `dist` on port 80.

1. Push this repo to the git remote Coolify should watch.
2. In Coolify, **New Resource** → **Application** from that repository (or a Docker Compose resource if you prefer `docker-compose.yml`).
3. Build pack: **Dockerfile**. Coolify should pick `./Dockerfile` at the repo root.
4. Set the public domain on the resource (for example `digest.example.com`). Enable HTTPS in Coolify as usual.
5. Add a build argument (or build-time environment variable):
   - `PUBLIC_SITE_URL` = `https://digest.example.com`  
   This becomes Astro’s `site` value and is used for RSS absolute links.
6. Port: **80**. The container listens on 80; Coolify’s proxy maps the domain to it.
7. Deploy. A successful build means the JSON collection validated.

After the first deploy, a daily update is: add `content/updates/YYYY-MM-DD.json`, push, and let Coolify rebuild.

## Sample content

`content/updates/2026-08-13.json` is a Grok Bot reception digest: product press versus independent takes versus brand confusion with the Grok chatbot. Sources are public coverage (xAI introduction, The Verge, Digital Trends). It does not present fabricated usage metrics.

## License

Private use unless you add a license file.
