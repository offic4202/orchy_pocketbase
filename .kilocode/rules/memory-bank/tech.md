# Technical Context: Orchies Visual - PocketBase Portfolio

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Next.js      | 16.x    | React framework with App Router |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.9.x   | Type-safe JavaScript            |
| Tailwind CSS | 4.x     | Utility-first CSS               |
| PocketBase   | Latest  | Headless CMS / Backend           |
| Bun          | Latest  | Package manager & runtime       |
| Docker       | Latest  | Deployment containerization     |

## Development Environment

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- Docker & Docker Compose

### Commands

```bash
bun install        # Install dependencies
bun dev            # Start dev server (http://localhost:3000)
bun build          # Production build
bun start          # Start production server
bun lint           # Run ESLint
bun typecheck      # Run TypeScript type checking
bun run pb:init    # Initialize PocketBase collections
```

## Project Configuration

### Next.js Config (`next.config.ts`)

- App Router enabled
- PocketBase image domain whitelisted for `next/image`
- Remote patterns configured for PocketBase file URLs

### TypeScript Config (`tsconfig.json`)

- Strict mode enabled
- Path alias: `@/*` → `src/*`
- Target: ESNext
- Module resolution: bundler

### Tailwind CSS 4 (`globals.css`)

- CSS-first configuration with `@theme` block
- Custom colors for dark theme
- System font stack

### ESLint (`eslint.config.mjs`)

- Uses `eslint-config-next`
- Flat config format
- Ignores PocketBase init script
- `@next/next/no-img-element` disabled (using `<img>` for external URLs)

### PocketBase Config

- Docker volume: `./pb_data:/pb_data`
- Migrations: `./pb/pb_migrations:/pb/pb_migrations`
- Default admin: `admin@orchies.click` / `admin123`

## Key Dependencies

### Production Dependencies

```json
{
  "next": "^16.1.3",
  "pocketbase": "^0.27.0",
  "react": "^19.2.3",
  "react-dom": "^19.2.3"
}
```

### Dev Dependencies

```json
{
  "typescript": "^5.9.3",
  "@types/node": "^24.10.2",
  "@types/react": "^19.2.7",
  "@types/react-dom": "^19.2.3",
  "@tailwindcss/postcss": "^4.1.17",
  "tailwindcss": "^4.1.17",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.0"
}
```

## File Structure

```
/
├── docker-compose.yml      # PocketBase + Next.js deployment
├── Dockerfile              # Multi-stage production build
├── package.json            # Dependencies and scripts
├── bun.lock                # Bun lockfile
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── postcss.config.mjs      # PostCSS (Tailwind) config
├── eslint.config.mjs       # ESLint configuration
├── pb/
│   ├── init.mjs            # PocketBase schema + sample data init
│   └── pb_migrations/      # PocketBase migrations (auto-generated)
├── pb_data/                # PocketBase data volume (gitignored)
└── src/
    ├── app/
    │   ├── layout.tsx      # Root layout
    │   ├── page.tsx        # Homepage
    │   ├── globals.css     # Global styles
    │   ├── api/
    │   │   ├── contact/route.ts
    │   │   └── rentals/route.ts
    │   ├── portfolio/page.tsx
    │   ├── services/page.tsx
    │   ├── products/page.tsx
    │   ├── rentals/
    │   │   ├── page.tsx
    │   │   └── RentalsClient.tsx
    │   ├── blog/
    │   │   ├── page.tsx
    │   │   └── [slug]/page.tsx
    │   ├── gallery/page.tsx
    │   ├── contact/page.tsx
    │   └── about/page.tsx
    ├── components/
    │   ├── Navbar.tsx
    │   ├── Footer.tsx
    │   └── ContactForm.tsx
    ├── lib/
    │   └── pocketbase.ts    # PocketBase client + types
    └── types/
        └── index.ts         # TypeScript type definitions
```

## PocketBase Collections

| Collection | Purpose |
|------------|---------|
| `users` | Admin/assistant authentication (built-in) |
| `portfolio` | Featured work entries with thumbnails, videos |
| `services` | Service offerings with pricing |
| `categories` | Product categories (Camera, Lens, Drone, etc.) |
| `products` | Equipment for sale/rent with stock tracking |
| `rental_bookings` | Customer rental requests with status tracking |
| `testimonials` | Client reviews with ratings |
| `gallery` | Image gallery with categories |
| `blog` | Blog posts with SEO slugs |
| `contact_messages` | Contact form submissions |
| `homepage_settings` | Hero image, headline, social links |
| `site_settings` | Logo, SEO, business info |

## Technical Constraints

### Starting Point

- Clean slate Next.js 16 + PocketBase architecture
- All content managed via PocketBase admin panel
- No hardcoded content in frontend

### Browser Support

- Modern browsers (ES2020+)
- No IE11 support

### Performance Considerations

- Server Components for static generation
- PocketBase handles file storage with automatic URLs
- `<img>` tags used for PocketBase-hosted images
- Docker volumes for persistent data

### Deployment

#### Deployment Scripts

| Script | Purpose |
|--------|---------|
| `deploy.sh` | Full server installation (clones repo, configures env, sets up Nginx, starts services, initializes PocketBase) |
| `uninstall.sh` | Removes all containers, volumes, images, and project data |

#### Usage

```bash
# Subdomain deployment (orchies.click)
./deploy.sh orchies.click subdomain / https://github.com/user/repo.git

# Subdirectory deployment (orchies.click/orchies)
./deploy.sh orchies.click subdirectory /orchies https://github.com/user/repo.git
```

#### Production Stack

- **docker-compose.prod.yml** — Production deployment with Nginx reverse proxy
- **nginx/conf.d/orchies.click.conf** — Nginx config supporting subdomain and subdirectory modes
- **next.config.ts** — Supports `basePath` for subdirectory deployments via `BASE_PATH` env var

#### Nginx Routing

| Path | Target | Purpose |
|------|--------|---------|
| `/` or `/{basePath}` | Frontend (Next.js) | Main website |
| `/pb/` or `/{basePath}/pb/` | PocketBase admin | Admin dashboard |
| `/api/` or `/{basePath}/api/` | Next.js API routes | Form submissions |

#### Nginx Proxy Manager

The setup is compatible with Nginx Proxy Manager for SSL termination and advanced proxy management.
