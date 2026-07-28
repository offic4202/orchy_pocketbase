# System Patterns: Orchies Visual - PocketBase Portfolio

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              Nginx Proxy Manager (NPM)                           │
│              (orchies.click / orchies/)                          │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                        │
│   Portfolio Website      │        PocketBase Backend           │
│   (Next.js 16)          │        (Docker)                      │
│                          │                                        │
│   Vite/Tailwind          │   ┌─────────────────────────┐      │
│   App Router             │   │   12 Collections          │      │
│                          │   │   Users, Portfolio,       │      │
│   Server Components      │   │   Services, Products,     │      │
│   + Client Islands       │   │   Rentals, Blog, etc.     │      │
│                          │   └─────────────────────────┘      │
│   PocketBase JS SDK      │   ┌─────────────────────────┐      │
│   for API calls          │   │   SQLite + File Storage   │      │
│                          │   │   Admin Dashboard         │      │
│   basePath support       │   │   /_/                     │      │
│   for subdirectory       │   └─────────────────────────┘      │
│   deployments            │                                        │
└──────────────────────────┴──────────────────────────────────────┘
```
┌─────────────────────────────────────────────────────────────────┐
│                        Nginx Reverse Proxy                       │
│                     (orchies.click / orchies/ )                  │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                        │
│   Portfolio Website      │        PocketBase Backend           │
│   (Next.js 16)          │        (Docker)                      │
│                          │                                        │
│   Vite/Tailwind          │   ┌─────────────────────────┐      │
│   App Router             │   │   12 Collections          │      │
│                          │   │   Users, Portfolio,       │      │
│   Server Components      │   │   Services, Products,     │      │
│   + Client Islands       │   │   Rentals, Blog, etc.     │      │
│                          │   └─────────────────────────┘      │
│   basePath support       │   ┌─────────────────────────┐      │
│   for subdirectory       │   │   SQLite + File Storage   │      │
│   deployments            │   │   Admin Dashboard         │      │
│                          │   │   /_/                     │      │
│   PocketBase JS SDK      │   └─────────────────────────┘      │
│   for API calls          │   ┌─────────────────────────┐      │
│                          │   │   Nginx SSL/Termination   │      │
│   basePath: '/orchies'   │   │   (optional, for SSL)     │      │
│   for subdirectory mode  │   └─────────────────────────┘      │
└──────────────────────────┴──────────────────────────────────────┘
```
┌─────────────────────────────────────────────────────────┐
│                    Nginx Proxy Manager                    │
├──────────────────────┬──────────────────────────────────┤
│                      │                                  │
│   Portfolio Website   │        PocketBase Backend       │
│   (Next.js 16)        │        (Docker)                 │
│                      │                                  │
│   Vite/Tailwind       │   ┌─────────────────────────┐   │
│   App Router          │   │   12 Collections         │   │
│                      │   │   Users, Portfolio,       │   │
│   Server Components   │   │   Services, Products,     │   │
│   + Client Islands    │   │   Rentals, Blog, etc.     │   │
│                      │   └─────────────────────────┘   │
│   PocketBase JS SDK   │   ┌─────────────────────────┐   │
│   for API calls       │   │   SQLite + File Storage   │   │
│                      │   │   Admin Dashboard         │   │
└──────────────────────┴──────────────────────────────────┘
```

## Key Design Patterns

### 1. Headless CMS Pattern

PocketBase serves as the backend CMS. The frontend consumes its REST API:
```tsx
// Server Component fetches data directly from PocketBase
const records = await pb.collection("portfolio").getFullList({
  filter: 'published = true',
});
```

### 2. Server Components by Default

All page components are Server Components. Client interactivity is isolated:
```tsx
// page.tsx - Server Component
export default async function Page() {
  const data = await pb.collection("items").getFullList();
  return <ClientComponent data={data} />;
}

// ClientComponent.tsx - Client Component
"use client";
export function ClientComponent({ data }) {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### 3. API Routes for Forms

Forms POST to Next.js API routes, which forward to PocketBase:
```tsx
// src/app/api/contact/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const record = await pb.collection("contact_messages").create(body);
  return NextResponse.json({ success: true, data: record });
}
```

### 4. Type-Safe PocketBase Integration

TypeScript types mirror PocketBase collection schemas:
```tsx
// src/types/index.ts
export type PortfolioRecord = {
  id: string;
  title: string;
  published: boolean;
  // ...
};
```

## Styling Conventions

### Tailwind CSS 4 + Custom Theme

```css
/* globals.css */
@theme {
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-accent: #f59e0b;
  --color-surface: #171717;
  --color-surface-light: #262626;
  --font-family-sans: system-ui, sans-serif;
}
```

### Common Patterns
```tsx
// Container
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

// Section spacing
<section className="py-24 px-4">
```

## File Naming Conventions

- Pages: `page.tsx` in route directories
- Components: PascalCase (`Navbar.tsx`, `Footer.tsx`)
- API Routes: `route.ts` in `api/[name]/`
- Utilities: camelCase (`pocketbase.ts`)
- Types: `index.ts` in `types/`

## State Management

- Server Components handle data fetching from PocketBase
- `useState` for form inputs and UI state
- No external state management library needed

## Deployment Pattern

```yaml
# docker-compose.yml
services:
  pocketbase:
    image: ghcr.io/pocketbase/pocketbase:latest
    volumes:
      - ./pb_data:/pb_data
  frontend:
    build: .
    environment:
      - NEXT_PUBLIC_POCKETBASE_URL=http://pocketbase:8090
```
