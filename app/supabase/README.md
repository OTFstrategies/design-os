# Supabase Setup for Proceshuis HSF

This guide explains how to connect the AI-agents section to Supabase.

## Quick Start

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `proceshuis-hsf` (or your preferred name)
   - **Region**: Choose the closest to your users
   - **Password**: Generate a secure database password

### 2. Apply Database Migrations

Once your project is created:

1. Go to **SQL Editor** in Supabase Dashboard
2. Copy the contents of `migrations/001_ai_agents_schema.sql` and run it
3. Copy the contents of `migrations/002_ai_agents_seed.sql` and run it

Alternatively, use the Supabase CLI:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (get project ref from dashboard URL)
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

### 3. Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Get your credentials from Supabase Dashboard → Settings → API:
   - **Project URL**: Your Supabase project URL
   - **anon public key**: Your public API key

3. Update `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Restart the Development Server

```bash
npm run dev
```

The AI-agents page will now fetch data from Supabase instead of using sample data.

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `agents` | The 7 AI pipeline agents with configuration |
| `categorieen` | Categories for pipeline runs |
| `plaud_prompt_templates` | Prompt templates for Plaud recordings |
| `pipeline_runs` | Pipeline execution records |
| `pipeline_run_fotos` | Photos attached to pipeline runs |
| `agent_stappen` | Individual agent steps within runs |

### Row Level Security

All tables have RLS enabled with public read/write policies for development. For production, update the policies to require authentication.

## Troubleshooting

### "Supabase not configured, using sample data"

This message appears when:
- `NEXT_PUBLIC_SUPABASE_URL` is not set or is still the placeholder value
- The environment variables haven't been loaded (restart the dev server)

### Database connection errors

1. Check that your Supabase project is active (not paused)
2. Verify the URL and anon key are correct
3. Ensure RLS policies allow access

## Files Overview

```
supabase/
├── README.md                    # This file
└── migrations/
    ├── 001_ai_agents_schema.sql # Database schema (tables, types, indexes)
    └── 002_ai_agents_seed.sql   # Sample data
```

```
src/
├── lib/
│   ├── supabase.ts             # Supabase client
│   └── ai-agents-service.ts    # Data fetching/mutation functions
└── hooks/
    └── useAIAgentsData.ts      # React hook with fallback to sample data
```
