# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VehiclePulse (previously "my-ride-zen") is a vehicle management application that helps users track their vehicles, fuel records, maintenance logs, and documents. Built with React, TypeScript, Vite, and Supabase.

## Technology Stack

- **Frontend**: React 18.3, TypeScript 5.8
- **Build Tool**: Vite 5.4
- **UI Framework**: shadcn-ui (Radix UI primitives + Tailwind CSS)
- **Routing**: React Router DOM v6
- **State Management**: TanStack Query (React Query) v5
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind CSS with tailwindcss-animate

## Development Commands

```bash
# Install dependencies
npm i

# Start development server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Build for development environment
npm run build:dev

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Directory Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn-ui components (Button, Dialog, etc.)
│   └── *.tsx           # Domain components (AddVehicleModal, DocumentCard, etc.)
├── hooks/              # Custom React hooks for data fetching and logic
├── integrations/
│   └── supabase/       # Supabase client and auto-generated types
├── lib/                # Utility functions and calculations
└── pages/              # Route pages (Index, Auth, Documents, Stats, Settings)
```

### Database Schema

The application uses Supabase PostgreSQL with the following main tables:

- **profiles**: User profiles (linked to auth.users)
- **vehicles**: Vehicle information (brand, model, year, plate, fuel_type, etc.)
- **fuel_records**: Fuel/charging records with costs and odometer readings
- **maintenance_logs**: Service and maintenance history
- **documents**: Vehicle documents (insurance, registration, inspection, etc.)

Key constraints:
- Each user can have multiple vehicles, but only one primary vehicle
- All data is scoped per user via Row Level Security (RLS)
- Foreign keys cascade on delete

### Custom Hooks Pattern

The app extensively uses custom hooks for data operations:

- `useAuth()` - Authentication state and operations (src/hooks/useAuth.tsx)
- `useVehicles()` - Fetch and manage vehicles (src/hooks/useVehicles.tsx)
- `useFuelRecords()` - Fuel/charging records CRUD (src/hooks/useFuelRecords.tsx)
- `useMaintenance()` - Maintenance logs operations (src/hooks/useMaintenance.tsx)
- `useDocuments()` - Document management with file uploads (src/hooks/useDocuments.tsx)
- `useStats()` - Calculate statistics and analytics (src/hooks/useStats.tsx)

All hooks use React Query for caching, optimistic updates, and error handling.

### Protected Routes

All routes except `/auth` are wrapped in `<ProtectedRoute>` (src/components/ProtectedRoute.tsx) which:
- Checks authentication status via `useAuth()`
- Redirects to `/auth` if not authenticated
- Shows loading state during auth check

### Routing Structure

- `/` - Dashboard (Index page) with vehicle overview, quick actions, and summaries
- `/auth` - Authentication page (login/signup)
- `/docs` - Document management for selected vehicle
- `/stats` - Statistics and analytics dashboard
- `/settings` - User and app settings
- `*` - 404 Not Found page

### Component Patterns

**Modal Components**: Most actions use modal dialogs (AddVehicleModal, AddFuelModal, LogServiceModal, etc.) for create/edit operations.

**Bottom Navigation**: Mobile-first design with persistent bottom navigation (src/components/BottomNav.tsx).

**Vehicle Context**: Most pages operate on a "selected vehicle" which can be switched via VehicleHeader component.

## Environment Variables

Required environment variables (set in Supabase project settings or .env file):

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## Supabase Integration

The Supabase client is configured at `src/integrations/supabase/client.ts` with:
- localStorage for session persistence
- Auto token refresh
- TypeScript types auto-generated in `types.ts`

**Storage Buckets**: The app uses Supabase Storage for:
- Vehicle avatar images
- Document files (PDFs, images, etc.)
- Maintenance receipt uploads

## TypeScript Configuration

The project uses relaxed TypeScript settings (tsconfig.json):
- `noImplicitAny: false`
- `strictNullChecks: false`
- `noUnusedLocals: false`
- Path alias: `@/*` maps to `./src/*`

When adding new code, maintain consistency with existing patterns rather than enforcing strict typing.

## Styling Conventions

- Uses Tailwind utility classes for styling
- shadcn-ui components provide consistent design system
- Animations via tailwindcss-animate (fade-in, slide-in-from-bottom, etc.)
- Mobile-first responsive design (max-w-md container)
- Dark mode support via next-themes

## Database Migrations

Migrations are in `supabase/migrations/`. The schema includes:
- ENUMs for vehicle_type, fuel_type, document_type, maintenance_type
- Automatic profile creation on user signup (trigger)
- Single primary vehicle enforcement (trigger)
- Updated_at timestamp auto-update (trigger)
- RLS policies for user data isolation

## Key Business Logic

**Stats Calculations** (src/lib/statsCalculations.ts):
- Fuel efficiency calculations (L/100km or km/kWh)
- Average costs per fuel-up or per km
- Monthly aggregations and trends

**Document Expiry**: Documents track expiry_date and reminder_days_before for notifications.

**Maintenance Scheduling**: Logs track next_service_date and next_service_km for upcoming maintenance alerts.

## Lovable Integration

This project was created with Lovable.dev and includes:
- `lovable-tagger` for component tracking in development
- Automatic commits via Lovable platform
- Project URL: https://lovable.dev/projects/52be5bdb-c9ea-4fec-9ba8-ebf6dc76c522

## Adding New Features

When adding features:

1. **New data operations**: Create a custom hook in `src/hooks/` using React Query
2. **New pages**: Add route in App.tsx and create page in `src/pages/`
3. **New UI components**: Use shadcn-ui primitives or create domain components
4. **Database changes**: Add migration in `supabase/migrations/` and regenerate types
5. **Forms**: Use React Hook Form + Zod for validation
6. **File uploads**: Use Supabase Storage with proper RLS policies

## ESLint Configuration

- Extends recommended configs from ESLint and TypeScript ESLint
- React Hooks rules enforced
- Unused variables warnings disabled (TypeScript rule off)
- React Refresh warnings for proper HMR

## Notes

- The app is mobile-first but works on desktop
- All authenticated requests use the Supabase client from `@/integrations/supabase/client`
- Toast notifications use both shadcn-ui Toaster and Sonner for different notification types
- Date handling uses date-fns library
