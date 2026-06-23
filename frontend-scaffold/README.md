# Agenda SaaS — Frontend

Scaffold de producción: React 18 + TypeScript + Vite + React Router + Axios +
TanStack Query + React Hook Form + Zod + Tailwind. Pensado para consumir un
backend NestJS + Prisma + PostgreSQL como el que describiste.

## Setup

```bash
npm install
cp .env.example .env   # apuntá VITE_API_URL a tu backend NestJS
npm run dev
```

Recordá habilitar CORS en NestJS para el origen de Vite (`http://localhost:5173`)
en `main.ts`: `app.enableCors({ origin: "http://localhost:5173" })`.

## Por qué esta arquitectura

**Dos tipos de estado, dos herramientas:**
- **Estado del servidor** (servicios, empleados, turnos...) → TanStack Query.
  Cachea, refetchea, invalida automáticamente. Nunca lo guardes en `useState`.
- **Estado del cliente** (¿quién está logueado?) → `AuthContext`. Es síncrono
  y lo necesita toda la app, no tiene sentido cachearlo como "server state".

**Tres capas para hablar con el backend** (de abajo hacia arriba):
1. `lib/axios.ts` — la instancia HTTP, con interceptors para el JWT y el 401.
2. `api/*.ts` — funciones puras, una por endpoint. Sin estado, sin React.
3. `hooks/*.ts` — envuelven `api/*.ts` con `useQuery`/`useMutation`. **Esto es
   lo único que importás desde tus páginas.** Nunca llames a `api/*.ts`
   directo desde un componente (salvo casos puntuales como el redirect a
   billing portal en `SubscriptionPage`).

Esto te da un solo lugar para cambiar cada cosa: si el backend cambia un
endpoint, tocás un archivo en `api/`. Si necesitás cambiar cómo se cachea
algo, tocás un archivo en `hooks/`. Las páginas no se enteran de la diferencia.

## Estructura de carpetas

```
src/
├── types/        → contratos de datos (un archivo por entidad del backend)
├── lib/           → axios, React Query client, utils (cn, formatos)
├── api/           → funciones que llaman a cada endpoint (1 archivo = 1 módulo backend)
├── hooks/         → useQuery/useMutation por recurso (lo que usás en las páginas)
├── context/       → AuthContext (usuario logueado, login/logout)
├── schemas/       → validación Zod para cada formulario
├── routes/        → AppRouter + guards (ProtectedRoute, PublicOnlyRoute)
├── layouts/       → PublicLayout, DashboardLayout (sidebar)
├── components/
│   ├── ui/        → primitivos (Button, Input, Card...) estilo shadcn
│   ├── booking/    → piezas del flujo de reserva público
│   └── shared/     → Modal, EmptyState, LoadingSpinner
└── pages/
    ├── public/     → Landing, Login, Register, BookingPage (/agenda/:slug)
    └── private/    → Dashboard, Services, Employees, Availability, Shifts, Subscription, Profile
```

## Mapa de rutas

| Ruta | Acceso | Página |
|---|---|---|
| `/` | pública | LandingPage |
| `/login`, `/register` | solo sin sesión | LoginPage, RegisterPage |
| `/agenda/:businessSlug` | pública | BookingPage (flujo de reserva del cliente final) |
| `/dashboard` | privada | DashboardPage |
| `/dashboard/services` | privada | ServicesPage (CRUD completo, plantilla de referencia) |
| `/dashboard/employees` | privada | EmployeesPage |
| `/dashboard/availability` | privada | AvailabilityPage |
| `/dashboard/shifts` | privada | ShiftsPage |
| `/dashboard/subscription` | privada | SubscriptionPage |
| `/dashboard/profile` | privada | ProfilePage |

## Autenticación JWT — cómo funciona

1. `login()`/`register()` en `AuthContext` llaman al backend, guardan el
   `accessToken` en `localStorage` y el `user` en estado de React.
2. El interceptor de request en `lib/axios.ts` agrega el header
   `Authorization: Bearer <token>` a **todas** las llamadas, sin que tengas
   que pensarlo en cada componente.
3. Si el backend responde `401` (token vencido), el interceptor de response
   limpia el token y redirige a `/login`. Un solo lugar maneja "se cerró tu
   sesión", no 30 try/catch repartidos.
4. Al recargar la página, `AuthProvider` valida el token llamando a
   `GET /auth/me`. Así no perdés la sesión al hacer F5, sin guardar datos
   sensibles del usuario en `localStorage`.

Si tu backend usa **refresh tokens** además del access token, el lugar para
agregarlo es el interceptor de response en `lib/axios.ts`: ante un 401,
intentás `POST /auth/refresh` una vez y reintentás el request original antes
de redirigir a login.

## Lo que está completo vs. lo que es un punto de partida

**Completo y funcional** (patrón a replicar):
- Auth (login/register/logout/sesión persistida)
- `ServicesPage` — CRUD completo, es la plantilla para cualquier otro recurso
- `BookingPage` — el flujo público de 4 pasos completo
- Routing, guards, layouts, axios, React Query

**Funcional pero simplificado** (vas a querer iterar):
- `ShiftsPage` es una lista, no una grilla de calendario visual. Para eso te
  recomiendo agregar `react-big-calendar` o el `Calendar` de shadcn más
  adelante, reusando el mismo hook `useShifts`.
- Los componentes `ui/*` son una versión liviana de shadcn (sin Radix) para
  que el proyecto compile sin pasos extra. Si querés los componentes reales
  de shadcn (mejor accesibilidad, animaciones, `Select`/`Dialog`/`Calendar`
  más completos), corré:
  ```bash
  npx shadcn@latest init
  npx shadcn@latest add button input dialog select calendar table toast
  ```
  y migrá página por página — la lógica (hooks, schemas) no cambia, solo el
  componente visual.

## Próximos pasos sugeridos

1. Compartime el `schema.prisma` y los DTOs reales del backend — ajusto los
   `types/*.ts` y `api/*.ts` para que calcen exacto con los nombres de
   campos y endpoints reales (ahora mismo asumí nombres razonables en base a
   los módulos que mencionaste: `auth`, `business`, `services`, `employees`,
   `availability`, `shifts`, `subscriptions`).
2. Los recordatorios automáticos (ej. el caso de uñas semipermanentes a los
   21 días) son un cron job del **backend**, no del frontend — el frontend
   solo necesita una pantalla en el plan Premium donde se vean las reglas
   configuradas, si querés que el negocio las edite.
3. Integración de Mercado Pago (plan Medium) va en su propio módulo
   `api/payments.api.ts` + un hook `usePayment`, con un botón "Pagar seña"
   en el último paso de `BookingPage`.
