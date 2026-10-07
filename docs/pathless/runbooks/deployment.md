# PathLess Framework v2: Zero-Cost Production Deployment Runbook

This operational runbook provides step-by-step instructions for deploying and running **PathLess Framework v2** in production at **$0/month** total cost.

---

## 1. Zero-Cost Cloud Architecture Overview

PathLess is designed specifically for public education, non-profit institutions, and high schools that require robust, zero-pressure major discovery with zero hosting budgets.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                ZERO-COST PRODUCTION ARCHITECTURE                                 │
├─────────────────────┬───────────────────────────┬───────────────────┬────────────────────────────┤
│ Layer               │ Service Provider          │ Free Tier Limits  │ Operational Role           │
├─────────────────────┼───────────────────────────┼───────────────────┼────────────────────────────┤
│ Web Application     │ Vercel (Hobby Tier)       │ 100GB bandwidth   │ Next.js App Router, SSR,   │
│ & Edge Routing      │                           │ Unlimited builds  │ API routes & print styles  │
├─────────────────────┼───────────────────────────┼───────────────────┼────────────────────────────┤
│ Relational Database │ Neon Serverless Postgres  │ 0.5 GB storage    │ Student submissions, notes │
│ & Connection Pooler │ (or Supabase Free Tier)   │ Serverless pooler │ & Prisma ORM persistence   │
├─────────────────────┼───────────────────────────┼───────────────────┼────────────────────────────┤
│ AI Synthesis Engine │ Google AI Studio (Gemini) │ 15 RPM, 1,500 RPD │ Gemini 2.5 Flash synthesis │
│                     │ Free Tier API Key         │ 1M tokens/min     │ with curated mock fallback │
├─────────────────────┼───────────────────────────┼───────────────────┼────────────────────────────┤
│ VPS Alternative     │ Oracle Cloud Always-Free  │ 4 OCPU, 24GB RAM  │ Self-hosted multi-stage    │
│ Container Hosting   │ (or Fly.io Free Tier)     │ 200GB Block Vol   │ Docker with Caddy SSL      │
└─────────────────────┴───────────────────────────┴───────────────────┴────────────────────────────┘
```

---

## 2. Environment Variables Reference

Configure these environment variables in your deployment dashboard or local `.env.production` file:

| Variable | Required | Example Value | Description |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | `postgres://user:pass@ep-pooler.neon.tech/pathless?sslmode=require&pgbouncer=true` | Serverless pooled connection string for runtime Prisma queries. |
| `DIRECT_URL` | Optional | `postgres://user:pass@ep.neon.tech/pathless?sslmode=require` | Direct connection string for schema migrations. |
| `GEMINI_API_KEY` | **Yes** | `AIzaSyD...` | Google AI Studio Gemini API key. If omitted, uses deterministic mock data. |
| `GEMINI_MODEL` | Optional | `gemini-2.5-flash` | Gemini model name (defaults to `gemini-2.5-flash`). |
| `ADVISOR_PASSCODE` | Optional | `TEACHER2026` | School advisor passcode gate (defaults to `TEACHER2026`). |
| `SESSION_SECRET` | Optional | `super-secret-salt-2026-xyz` | HMAC-SHA256 signature key for advisor session cookies. |
| `ADMIN_SECRET` | Optional | `admin-purge-key-2026` | Authorization key for calling annual purge endpoint `/api/admin/purge`. |
| `NODE_ENV` | **Yes** | `production` | Enforces optimized React and Next.js execution. |

---

## 3. Deployment Recipes

### Recipe A: Vercel + Neon Serverless PostgreSQL (Recommended Zero-Cost Setup)

1. **Fork or Push to GitHub**:
   Ensure your code is pushed to your GitHub repository on `main`.

2. **Provision Free PostgreSQL on Neon**:
   - Create a free account at [neon.tech](https://neon.tech).
   - Create a new project named `pathless-production`.
   - In Dashboard -> Connection Details, copy the **Pooled connection string** (`DATABASE_URL`).
   - Copy the **Direct connection string** (`DIRECT_URL`).

3. **Run Initial Database Migration**:
   From your local development machine:
   ```bash
   DATABASE_URL="<your-neon-pooled-url>" DIRECT_URL="<your-neon-direct-url>" npx prisma db push
   ```

4. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **Add New -> Project**.
   - Import your GitHub repository.
   - Under **Environment Variables**, add:
     - `DATABASE_URL`: Your Neon pooled connection string.
     - `DIRECT_URL`: Your Neon direct connection string.
     - `GEMINI_API_KEY`: Your Google AI Studio API key.
     - `ADVISOR_PASSCODE`: Your school passcode (e.g., `TEACHER2026`).
     - `NODE_ENV`: `production`
   - Click **Deploy**. Vercel will build the Next.js application and deploy it globally.

---

### Recipe B: Self-Hosted Multi-Stage Docker on a VPS (e.g. Oracle Cloud Always-Free / Ubuntu)

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ShortXander101205/first-hackathon.git /opt/pathless
   cd /opt/pathless
   ```

2. **Create Production Environment File (`.env.production`)**:
   ```bash
   cat << 'EOF' > .env.production
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgres://user:password@db.example.com/pathless?sslmode=require
   GEMINI_API_KEY=AIzaSy...
   ADVISOR_PASSCODE=TEACHER2026
   SESSION_SECRET=a_very_long_random_hex_string_2026
   EOF
   ```

3. **Build the Production Docker Container**:
   ```bash
   docker build -t pathless:latest .
   ```

4. **Run the Container as Unprivileged User**:
   ```bash
   docker run -d \
     --name pathless-app \
     --restart unless-stopped \
     -p 127.0.0.1:3000:3000 \
     --env-file .env.production \
     pathless:latest
   ```

5. **Configure HTTPS Reverse Proxy (Caddy)**:
   Install Caddy (`sudo apt install caddy`) and configure `/etc/caddy/Caddyfile`:
   ```caddyfile
   pathless.yourschool.edu {
       reverse_proxy 127.0.0.1:3000
   }
   ```
   Caddy automatically provisions and renews free Let's Encrypt TLS certificates.

---

## 4. Health Check Endpoint (`GET /api/health`)

PathLess includes an unauthenticated health probe endpoint for Docker `HEALTHCHECK`, load balancers, and uptime monitors:

```bash
curl -i https://pathless.yourschool.edu/api/health
```

**Response (HTTP 200 OK)**:
```json
{
  "status": "healthy",
  "uptime": 12480.52,
  "timestamp": "2026-10-07T00:00:00.000Z",
  "database": "connected"
}
```

If the database is unconfigured or temporarily disconnected, the endpoint returns `"database": "unconfigured_or_fallback"` with status 200, confirming that the student discovery guide remains operational via mock fallback data.

---

## 5. Annual Data Retention Runbook (`POST /api/admin/purge`)

To protect student privacy and minimize stored educational data, PathLess provides an automated archive routine that removes student submissions created prior to July 1 of the active academic cycle.

### Triggering the Annual Archive via Curl:
```bash
curl -X POST https://pathless.yourschool.edu/api/admin/purge \
  -H "Content-Type: application/json" \
  -H "x-admin-key: <YOUR_ADMIN_SECRET>" \
  -d '{"confirmPurge": true}'
```

**Response**:
```json
{
  "success": true,
  "dryRun": false,
  "purgedCount": 142,
  "cutoffDate": "2026-07-01T00:00:00.000Z",
  "message": "Archived 142 submissions from prior academic cycles (cut-off: 2026-07-01)."
}
```

---

## 6. Pre-Flight Verification Checklist

Before opening PathLess to students:
- [ ] Verify `GET /api/health` returns status `healthy`.
- [ ] Complete a test intake run from Step 0 to Step 10 and verify 4 cards render.
- [ ] Test print layout (`Ctrl+P` / `Cmd+P`) and verify `.print-only` header appears.
- [ ] Navigate to `/advisor` and log in with your configured `ADVISOR_PASSCODE`.
- [ ] Verify rate limiting returns HTTP 429 when spamming requests.
