# Expo Offline-First SaaS Boilerplate

A production-ready Expo (React Native) starter template for building offline-first mobile apps with optional cloud sync.

## Features

- ✅ **Expo + TypeScript** - Modern React Native development
- ✅ **Expo Router** - File-based routing with auth and tabs groups
- ✅ **SQLite (expo-sqlite)** - Offline-first local database
- ✅ **Tamagui** - Design tokens and dark theme
- ✅ **Zustand** - Lightweight state management
- ✅ **React Native Reanimated** - Smooth animations
- ✅ **Optional Supabase Sync** - Pluggable cloud backend
- ✅ **RevenueCat Scaffold** - In-app purchases (feature-flagged)

## Quick Start

```bash
# Install dependencies
npm install

# Rename the app (Optional)
npm run rename-project

# Start development server
npm run start

# Run on iOS/Android
npm run ios
npm run android
```

## Architecture

### Offline-First Principle

SQLite is the **source of truth**. The app works fully without internet:

```
┌──────────────┐     ┌─────────────┐     ┌────────────────┐
│    UI        │────▶│   SQLite    │────▶│  Sync Engine   │
│  (React)     │◀────│   (Local)   │◀────│  (Optional)    │
└──────────────┘     └─────────────┘     └────────────────┘
                            │
                            ▼
                    Source of Truth
```

1. All data changes write to SQLite first
2. Sync engine (if enabled) pushes changes to remote
3. Remote changes pull to SQLite on sync

### Folder Structure

```
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth group (login, register)
│   ├── (tabs)/            # Main tabs (home, settings)
│   ├── _layout.tsx        # Root layout with providers
│   └── modal.tsx          # Modal screen
│
├── components/            # Reusable UI components
│   ├── Button.tsx         # Styled button
│   ├── Card.tsx           # Container card
│   ├── Input.tsx          # Form input
│   └── Text.tsx           # Typography
│
├── config/                # Configuration
│   ├── features.ts        # Feature flags
│   └── revenuecat.ts      # RevenueCat scaffold
│
├── db/                    # Database layer
│   ├── client.ts          # SQLite connection
│   ├── schema.ts          # Table schemas
│   ├── migrations.ts      # Migration runner
│   └── repository.ts      # CRUD operations
│
├── store/                 # Zustand stores
│   ├── auth.ts            # Auth state
│   ├── sync.ts            # Sync status
│   └── ui.ts              # UI state (modals, toasts)
│
├── sync/                  # Sync engine
│   ├── engine.ts          # Core sync logic
│   ├── conflict.ts        # Conflict resolution
│   ├── supabase.ts        # Supabase adapter
│   └── types.ts           # Sync types
│
├── theme/                 # Theming
│   ├── tokens.ts          # Design tokens
│   ├── tamagui.config.ts  # Tamagui setup
│   └── ThemeProvider.tsx  # Theme provider
│
└── ui/                    # Animations
    ├── animations.ts      # Reanimated presets
    └── transitions.ts     # Screen transitions
```

## Database

### Schema Pattern

All entities extend `BaseEntity` with sync support:

```typescript
interface BaseEntity {
  id: string;           // UUID
  createdAt: string;    // ISO timestamp
  updatedAt: string;    // ISO timestamp
  deletedAt: string;    // Soft delete
  syncStatus: 'synced' | 'pending' | 'conflict';
}
```

### CRUD Operations

```typescript
import { itemsRepository } from '@/db';

// Create
await itemsRepository.create({ title: 'New Item', content: '' });

// Read
const items = await itemsRepository.findAll();
const item = await itemsRepository.findById('uuid');

// Update
await itemsRepository.update('uuid', { title: 'Updated' });

// Delete (soft)
await itemsRepository.delete('uuid');
```

### Migrations

Add new migrations in `db/migrations.ts`:

```typescript
const MIGRATIONS = [
  { version: 1, name: 'initial', up: SCHEMA.migrations + SCHEMA.items },
  { version: 2, name: 'add_users', up: 'CREATE TABLE users (...)' },
];
```

## Sync Engine

### Configuration

Sync is **optional and pluggable**. Enable by setting environment variables:

```bash
# .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Custom Backend

Implement `SyncBackend` interface for custom sync:

```typescript
import { SyncBackend, SyncChange, SyncResult } from '@/sync';

class CustomBackend implements SyncBackend {
  name = 'custom';
  async push(changes: SyncChange[]): Promise<SyncResult> { ... }
  async pull(since: string | null): Promise<SyncChange[]> { ... }
  // ... other methods
}

// Use it
getSyncEngine().setBackend(new CustomBackend());
```

### Conflict Resolution

Built-in strategies:
- `last-write-wins` - Most recent timestamp wins
- `local-wins` - Local changes always win
- `remote-wins` - Remote changes always win
- `manual` - Queue for user resolution

### Supabase Database Setup

To enable cloud sync, you need to create the corresponding tables in your Supabase project. Use the following SQL in the Supabase SQL Editor:

```sql
-- 1. Create the items table with offline-first columns
CREATE TABLE items (
  id text PRIMARY KEY,                   -- We use text because the app generates UUIDs
  title text NOT NULL,
  content text DEFAULT '',
  priority int8 DEFAULT 0,
  "createdAt" timestamptz DEFAULT now(),
  "updatedAt" timestamptz DEFAULT now(),
  "deletedAt" timestamptz,
  "syncStatus" text DEFAULT 'synced'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

-- 3. Create a policy to allow public access (FOR DEVELOPMENT ONLY)
CREATE POLICY "Allow public access for dev" 
ON items FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Set up an automatic trigger to update "updatedAt"
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at
    BEFORE UPDATE ON items
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
```

## Feature Flags

Toggle features without code changes:

```typescript
import { isFeatureEnabled, setFeatureFlags } from '@/config';

if (isFeatureEnabled('enableRevenueCat')) {
  // Show subscription UI
}

// Override at runtime
setFeatureFlags({ debugMode: true });
```

## Theme

### Design Tokens

```typescript
import { tokens } from '@/theme';

const styles = {
  container: {
    backgroundColor: tokens.color.background,
    padding: tokens.space[4],
    borderRadius: tokens.radius[2],
  },
};
```

### Colors (Dark Theme)

| Token | Value | Usage |
|-------|-------|-------|
| background | #0A0A0B | Main background |
| surface | #18181B | Cards, containers |
| text | #FAFAFA | Primary text |
| textSecondary | #A1A1AA | Secondary text |
| primary | #3B82F6 | Accent, buttons |
| border | #27272A | Borders |

## Animations

### Reanimated Presets

```typescript
import { TIMING_CONFIGS, SPRING_CONFIGS, usePressScaleStyle } from '@/ui';

// Use timing configs
withTiming(1, TIMING_CONFIGS.entrance);

// Use spring configs  
withSpring(0, SPRING_CONFIGS.bouncy);

// Use animation hooks
const animatedStyle = usePressScaleStyle(scale);
```

## State Management

### UI State (Zustand)

```typescript
import { useToast, useModal, useUIStore } from '@/store';

// Toasts
const toast = useToast();
toast.success('Item saved!');
toast.error('Something went wrong');

// Modals
const { isOpen, open, close } = useModal('confirm-delete');

// Loading
const setLoading = useUIStore(s => s.setLoading);
setLoading(true, 'Saving...');
```

## Environment Variables

Create `.env` file:

```bash
# Supabase (optional)
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# RevenueCat (optional)
EXPO_PUBLIC_REVENUECAT_API_KEY=
```

## Documentation

For detailed information on specific systems, please refer to the following guides:

- [🎨 Theming Guide](./THEMING_GUIDE.md) - How to customize colors, add new themes, and use the design system.
- [🔄 Sync & Offline Guide](./SYNC_GUIDE.md) - Understanding the SQLite + Supabase sync engine and conflict resolution.
- [💰 RevenueCat Guide](./REVENUECAT_GUIDE.md) - How to handle in-app purchases and pro entitlements.

## Customization

1. **Add tables**: Update `db/schema.ts` and `db/migrations.ts`
2. **Add screens**: Create files in `app/` directory
3. **Change theme**: Modify `theme/tokens.ts`
4. **Add components**: Create in `components/`
5. **Enable features**: Set environment variables

## License

MIT - Use freely for your projects.
