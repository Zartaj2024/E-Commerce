# Suti & Thread — Deployment Guide

## Project Overview

- **Stack:** Next.js 16.3.4, React 19, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Payments:** Stripe
- **Email:** Resend
- **Container:** Docker (multi-stage, DHI security base)

## Required Credentials

### Before deploying, you MUST obtain:

1. **Supabase Project**
   - Create at https://supabase.com
   - Get: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Settings → API
   - Get: `SUPABASE_SERVICE_ROLE_KEY` (keep private, server-side only)

2. **Stripe Account**
   - Create at https://stripe.com
   - Get: `STRIPE_SECRET_KEY` from Developers → API Keys
   - Create webhook and get: `STRIPE_WEBHOOK_SECRET`

3. **Resend Account**
   - Create at https://resend.com
   - Get: `RESEND_API_KEY` from API Keys section
   - Verify sender domain or use onboarding email

4. **Site Configuration**
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., https://suti-thread.com)
   - `ADMIN_EMAIL`: Your admin email address

## Local Development

```bash
# Copy development env template
cp .env.example .env.development

# Fill in your Supabase, Stripe, Resend credentials (use test keys)

# Start dev container with hot reload
docker compose up --pull always app-dev
```

Open http://localhost:3000

## Production Deployment

### Option 1: Docker Compose (Single Server)

```bash
# Create production env file
cp .env.production.example .env.production

# Fill in all required credentials with PRODUCTION keys
nano .env.production

# Build and start
docker compose up --pull always app -d

# View logs
docker logs suti-thread-prod -f
```

### Option 2: Docker Swarm (Multiple Servers)

```bash
# Initialize swarm
docker swarm init

# Create secrets (safe, encrypted in swarm)
docker secret create supabase_url -
docker secret create supabase_key -
docker secret create stripe_key -
docker secret create resend_key -
# ... paste values when prompted

# Deploy stack
docker stack deploy -c compose.yaml suti-thread
```

### Option 3: Kubernetes

```bash
# Create namespace
kubectl create namespace suti-thread

# Create secrets
kubectl create secret generic suti-thread-secrets \
  --from-literal=NEXT_PUBLIC_SUPABASE_URL=... \
  --from-literal=NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  --from-literal=SUPABASE_SERVICE_ROLE_KEY=... \
  --from-literal=STRIPE_SECRET_KEY=... \
  --from-literal=STRIPE_WEBHOOK_SECRET=... \
  --from-literal=RESEND_API_KEY=... \
  -n suti-thread

# Deploy
kubectl apply -f k8s-manifest.yaml -n suti-thread
```

## Container Image Details

- **Base:** `dhi.io/node:22.23-alpine3.22` (Docker Hardened Images for security scanning)
- **Size:** ~77MB (optimized with multi-stage build)
- **Security:** Non-root user (nextjs:1001), dumb-init for signal handling
- **Health Check:** HTTP endpoint verification every 30s

## Environment Variables at Build vs Runtime

| Variable | Build? | Runtime? | Note |
|----------|--------|----------|------|
| `NEXT_PUBLIC_*` | ✅ Yes | ✅ Yes | Baked into client-side code |
| `NEXT_TELEMETRY_DISABLED` | ✅ Yes | ✅ Yes | Disables Next.js telemetry |
| Server secrets (Stripe, Resend, Supabase keys) | ❌ No | ✅ Yes | Loaded from env at runtime |

**Important:** Do NOT pass production secrets to the Docker build; load them at container runtime via `.env.production`.

## Health Checks

The container includes a built-in health check:

```bash
# Manual verification
curl http://localhost:3000
docker inspect suti-thread-prod | grep -A 5 State.Health

# If unhealthy, check logs
docker logs suti-thread-prod
```

## Scaling & Reverse Proxy

For production, use Nginx/HAProxy in front:

```nginx
upstream suti_thread {
  server suti-thread-prod:3000;
}

server {
  listen 80;
  server_name suti-thread.com;
  
  location / {
    proxy_pass http://suti_thread;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## Troubleshooting

### Container won't start
```bash
docker logs suti-thread-prod
# Check for missing credentials in .env.production
```

### Unhealthy health check
```bash
# Verify port 3000 is accessible
docker exec suti-thread-prod curl http://localhost:3000
```

### Database errors
```bash
# Verify Supabase credentials
echo $NEXT_PUBLIC_SUPABASE_URL
docker inspect suti-thread-prod | grep NEXT_PUBLIC
```

## Backup & Recovery

1. **Database:** Supabase handles automatic backups; restore from Supabase dashboard
2. **Secrets:** Store in secure vault (1Password, Vault, etc.) — never in git
3. **Images:** Push to private registry (Docker Hub, ECR, GCR)

## Cost Optimization

- Use alpine base for small images
- Enable multi-stage caching: `docker build --cache-from ...`
- Compress with UPX if needed (trade: startup time for size)
