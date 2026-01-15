# 📦 ShipEasy Frontend

Application de gestion logistique construite avec **Next.js 16** et **React 19**, permettant la gestion de colis entre clients et groupeurs professionnels (GP).

## 🚀 Démarrage Rapide

### Prérequis

- **Node.js** 20+
- **npm** ou **pnpm**
- Backend API en cours d'exécution (voir `/backend`)

### Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Démarrer en mode développement
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

### Scripts disponibles

```bash
npm run dev      # Démarrage en mode développement
npm run build    # Build de production
npm run start    # Démarrage du serveur de production
npm run lint     # Vérification du code
```

## 🏗️ Architecture

Ce projet utilise une **architecture feature-based** pour une meilleure organisation et maintenabilité.

Pour plus de détails, consultez [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🛠️ Technologies

### Core
- **Next.js 16** - Framework React avec App Router
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling

### State Management & Forms
- **Zustand** - Gestion d'état globale
- **Zod** - Validation de schémas
- **React Hook Form** - Gestion de formulaires

### UI Components
- **shadcn/ui** - Composants UI modernes
- **Radix UI** - Primitives accessibles
- **Lucide React** - Icônes

## 📖 Guides

### Authentification

```tsx
import { useAuth, useLogin } from '@/src/features/auth/hooks';

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
import { AuthGuard, RoleGuard } from '@/src/shared/components/guards';
import { Role } from '@/src/features/auth/types';

// Protéger une route
<AuthGuard>
  <DashboardPage />
</AuthGuard>

// Limiter par rôle
<RoleGuard allowedRoles={[Role.ADMIN, Role.GESTIONNAIRE]}>
  <AdminPanel />
</RoleGuard>
```

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Zustand](https://zustand.docs.pmnd.rs/)
- [Zod](https://zod.dev/)
- [shadcn/ui](https://ui.shadcn.com/)

## 📄 Licence

Propriétaire - ShipEasy © 2024

---

**Besoin d'aide ?** Consultez [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre l'organisation du projet.
