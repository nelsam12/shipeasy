# ShipEasy Frontend

Application de gestion logistique avec Next.js 16, React 19 et TypeScript.

## 🚀 Démarrage Rapide

```bash
# Installation
npm install

# Développement
npm run dev

# Build
npm run build

# Démarrage production
npm run start
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
app/          → Pages Next.js (App Router)
  ├── (public)/     → Routes publiques
  ├── (auth)/       → Pages d'authentification
  ├── (dashboard)/  → Dashboards protégés
  └── layout.tsx    → Layout racine

components/   → Composants React
  ├── ui/           → shadcn/ui (composants de base)
  ├── layouts/      → Navbar, Sidebar, layouts
  ├── auth/         → AuthProvider
  └── guards/       → AuthGuard, RoleGuard, GuestGuard

hooks/        → Custom hooks (useAuth, useLogin, useRegister)
lib/          → Utilitaires (api, utils, constants)
services/     → Services API (auth.service)
types/        → Types TypeScript
public/       → Assets statiques
```

## 🛠️ Technologies

- **Framework** : Next.js 16 (App Router)
- **UI** : React 19 + shadcn/ui + Tailwind CSS 4
- **State** : React Context API
- **HTTP Client** : Axios
- **Validation** : Zod + React Hook Form
- **Notifications** : Sonner

## 🔗 Liens

- [Documentation Architecture](./ARCHITECTURE.md)
- [Backend API](../backend)

## 📖 Exemples d'utilisation

### Authentification

```tsx
import { useAuth, useLogin } from '@/hooks';

function MyComponent() {
  const { user, isAuthenticated } = useAuth();
  const { login, isLoading } = useLogin();

  const handleLogin = async () => {
    await login({ login: 'user@example.com', password: 'password' });
  };

  return <div>{user?.fullName}</div>;
}
```

### Protection de Routes

```tsx
import { AuthGuard, RoleGuard } from '@/components/guards';
import { Role } from '@/types';

// Protéger une route authentifiée
<AuthGuard>
  <DashboardPage />
</AuthGuard>

// Limiter par rôle
<RoleGuard role={Role.ADMIN}>
  <AdminPanel />
</RoleGuard>
```

## 📄 Licence

Propriétaire - ShipEasy © 2024

