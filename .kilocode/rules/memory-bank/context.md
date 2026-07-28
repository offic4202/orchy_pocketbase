# Active Context: Orchies Visual - PocketBase Portfolio

## Current State

**Project Status**: ✅ Production-ready frontend + PocketBase backend + deployment scripts

A complete remake of orchies.click as a headless CMS portfolio site for a videographer. Built with Next.js 16 frontend consuming PocketBase API, Docker Compose for deployment, Nginx reverse proxy for subdomain/subdirectory support under orchies.click.

## Recently Completed

- [x] Next.js 16 + TypeScript + Tailwind CSS 4 frontend
- [x] PocketBase backend schema with 12 collections
- [x] Docker Compose setup for PocketBase + Next.js
- [x] Production docker-compose.prod.yml with Nginx reverse proxy
- [x] Nginx config for subdomain and subdirectory deployment
- [x] deploy.sh installation script for server deployment
- [x] uninstall.sh removal script
- [x] next.config.ts with basePath support for subdirectory deployments
- [x] PocketBase initialization script with sample data
- [x] Homepage with hero, portfolio, services, products, testimonials, about, contact
- [x] Dynamic pages: /portfolio, /services, /products, /rentals, /blog, /gallery, /contact, /about
- [x] Contact form API route
- [x] Rental booking API route
- [x] Fixed Tailwind v4 theme configuration
- [x] Fixed ESLint flat config with ignores
- [x] TypeScript typecheck and build pass

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `docker-compose.yml` | Development PocketBase + Frontend | ✅ Ready |
| `docker-compose.prod.yml` | Production PocketBase + Frontend + Nginx | ✅ Ready |
| `Dockerfile` | Multi-stage production build for Next.js | ✅ Ready |
| `deploy.sh` | Full server installation script | ✅ Ready |
| `uninstall.sh` | Complete removal script | ✅ Ready |
| `nginx/conf.d/orchies.click.conf` | Nginx config for subdomain/subdirectory | ✅ Ready |
| `pb/init.mjs` | PocketBase schema + sample data init | ✅ Ready |
| `src/app/page.tsx` | Homepage with all sections | ✅ Ready |
| `src/app/layout.tsx` | Root layout with PocketBase settings | ✅ Ready |
| `src/app/globals.css` | Tailwind v4 + custom theme | ✅ Ready |
| `src/app/api/contact/route.ts` | Contact form API | ✅ Ready |
| `src/app/api/rentals/route.ts` | Rental booking API | ✅ Ready |
| `src/components/` | Navbar, Footer, ContactForm | ✅ Ready |
| `src/lib/pocketbase.ts` | PocketBase client + types | ✅ Ready |
| `src/types/index.ts` | TypeScript type definitions | ✅ Ready |
| `next.config.ts` | Next.js config with basePath support | ✅ Ready |

## PocketBase Collections

1. **users** (built-in) - Admin/assistant auth
2. **portfolio** - Featured work entries
3. **services** - Service offerings
4. **categories** - Product categories
5. **products** - Equipment for sale/rent
6. **rental_bookings** - Customer rental requests
7. **testimonials** - Client reviews
8. **gallery** - Image gallery
9. **blog** - Blog posts
10. **contact_messages** - Contact form submissions
11. **homepage_settings** - Hero, headline, social links
12. **site_settings** - Logo, SEO, business info

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript 5.9, Tailwind CSS 4
- **Backend**: PocketBase (Docker)
- **Deployment**: Docker Compose, Nginx Proxy Manager compatible
- **Package Manager**: Bun

## Quick Start

```bash
# Start PocketBase
docker compose up -d pocketbase

# Initialize PocketBase collections and sample data
bun run pb:init

# Start frontend dev server
bun dev

# Access admin panel
# http://localhost:8090/_/
# Email: admin@orchies.click
# Password: admin123
```

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| 2026-07-28 | Complete remake of orchies.click with PocketBase headless CMS architecture, Next.js 16 frontend, Docker Compose deployment, 12 PocketBase collections, 8 pages, contact/rental forms |
| 2026-07-28 | Added production deployment: docker-compose.prod.yml with Nginx reverse proxy, deploy.sh installation script, uninstall.sh removal script, nginx config for subdomain/subdirectory, next.config.ts basePath support |
