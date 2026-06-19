# Holdings Nest API

## Stack
- Backend: NestJS (TypeScript) con `pg` (node-postgres) para PostgreSQL
- Frontend: React (Vite + TypeScript + Tailwind v4)
- BD: PostgreSQL 17
- Docker Compose para entorno completo

## Scripts
- `npm run dev` — corre backend y frontend en paralelo (concurrently)
- `npm run dev:backend` — solo backend
- `npm run dev:frontend` — solo frontend
- `npm run docker:up` — levanta todo el stack con Docker

## Estructura
```
backend/src/
├── db/              # DbService con pool de pg
├── users/           # CRUD usuarios
├── criptos/         # CRUD criptos
├── holdings/        # CRUD holdings
└── operations/      # CRUD operations

frontend/src/
├── api/             # Cliente HTTP genérico + APIs por entidad
├── components/      # Componentes React agrupados por entidad
│   ├── layout/      # Sidebar de navegación
│   ├── users/
│   ├── criptos/
│   ├── holdings/
│   └── operations/
└── types/           # Interfaces TypeScript
```

## Convenciones
- Backend: cada entidad tiene su módulo con controller, service, dto/
- Frontend: cada entidad tiene api/, page, list, form
- BD: driver pg puro, sin ORM. DbService centraliza el pool
- Endpoints REST con validación via class-validator
- Frontend usa `/api/` prefix que nginx redirige al backend
