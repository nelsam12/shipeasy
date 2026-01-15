# 🏛️ Architecture Frontend - ShipEasy

Documentation détaillée de l'architecture frontend de ShipEasy.

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Principes Architecturaux](#principes-architecturaux)
3. [Organisation des Features](#organisation-des-features)
4. [Patterns Utilisés](#patterns-utilisés)
5. [State Management](#state-management)
6. [Gestion des Formulaires](#gestion-des-formulaires)
7. [Styling](#styling)
8. [Bonnes Pratiques](#bonnes-pratiques)

---

## 🎯 Vue d'Ensemble

L'architecture du frontend ShipEasy est basée sur une **approche feature-based** plutôt qu'une organisation par type de fichier. Cette approche offre plusieurs avantages :

- ✅ **Colocalisation** : Tout ce qui concerne une fonctionnalité est au même endroit
- ✅ **Maintenabilité** : Facile de comprendre et modifier une feature
- ✅ **Scalabilité** : Ajout de nouvelles features sans impacter les existantes
- ✅ **Réutilisabilité** : Les features sont autonomes et peuvent être extraites

### Structure Globale

```
frontend/
├── src/                    # Code source principal
│   ├── features/          # Modules métier (feature-based)
│   └── shared/           # Ressources partagées
│
├── app/                   # Next.js App Router
│   ├── (public)/         # Routes publiques
│   ├── (auth)/           # Routes d'authentification
│   └── (dashboard)/      # Routes dashboard protégées
│
├── public/               # Assets statiques
└── config files...       # Configuration (tsconfig, tailwind, etc.)
```

---

## 🧭 Principes Architecturaux

### 1. Feature-Based Organization

Chaque feature métier est organisée en **module autonome** :

```
features/auth/
├── components/     # UI spécifique à l'auth
├── hooks/          # Logique réutilisable
├── services/       # Appels API
├── store/          # État global (Zustand)
├── types/          # Types TypeScript
├── schemas/        # Validation Zod
└── index.ts        # Export public
```

**Avantages** :
- Modification isolée sans risque de régression
- Compréhension rapide du scope d'une feature
- Facilite la suppression ou l'extraction d'une feature

### 2. Single Responsibility Principle

Chaque module a **une responsabilité unique** :

```tsx
// ❌ MAUVAIS : Tout dans le composant
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    setLoading(true);
    // ... logique complexe de login
  };
  
  return <form>...</form>;
}

// ✅ BON : Séparation des responsabilités
function LoginPage() {
  const { login, isLoading } = useLogin(); // Hook pour la logique
  
  return <LoginForm onSubmit={login} isLoading={isLoading} />;
}
```

### 3. Dependency Inversion

Les features dépendent d'**abstractions**, pas d'implémentations :

```tsx
// ✅ Service abstrait
export const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  // ...
};

// Le composant utilise le service sans connaître l'implémentation
const { login } = useLogin(); // Utilise authService en interne
```

### 4. DRY (Don't Repeat Yourself)

Code réutilisable dans `shared/` :

```
shared/
├── components/    # Composants UI génériques
├── hooks/         # Hooks utilitaires
├── lib/           # Utilitaires (API, validation)
├── types/         # Types communs
└── constants/     # Constantes globales
```

---

## 🗂️ Organisation des Features

### Structure d'une Feature

```
features/[feature-name]/
├── components/          # Composants UI de la feature
│   ├── MyComponent.tsx
│   └── index.ts
│
├── hooks/              # Custom hooks
│   ├── useFeature.ts
│   └── index.ts
│
├── services/           # Appels API
│   ├── feature.service.ts
│   └── index.ts
│
├── store/             # État global (Zustand)
│   ├── featureStore.ts
│   └── index.ts
│
├── types/             # Types TypeScript
│   ├── feature.types.ts
│   └── index.ts
│
├── schemas/           # Validation Zod
│   ├── feature.schema.ts
│   └── index.ts
│
└── index.ts           # Export public de la feature
```

### Exemple Concret : Feature Auth

```
features/auth/
├── components/
│   ├── AuthProvider.tsx      # Provider pour initialiser l'auth
│   └── index.ts
│
├── hooks/
│   ├── useAuth.ts            # Hook principal d'authentification
│   ├── useLogin.ts           # Logique de connexion
│   ├── useRegister.ts        # Logique d'inscription
│   ├── useLogout.ts          # Logique de déconnexion
│   └── index.ts
│
├── services/
│   ├── auth.service.ts       # Appels API auth
│   └── index.ts
│
├── store/
│   ├── authStore.ts          # Store Zustand pour l'état auth
│   └── index.ts
│
├── types/
│   ├── auth.types.ts         # User, LoginCredentials, etc.
│   └── index.ts
│
├── schemas/
│   ├── login.schema.ts       # Validation login
│   ├── register.schema.ts    # Validation inscription
│   └── index.ts
│
└── index.ts
```

---

## 🎨 Patterns Utilisés

### 1. Custom Hooks Pattern

Extraire la logique métier dans des hooks réutilisables.

**Exemple : useLogin**

```tsx
// features/auth/hooks/useLogin.ts
import { useState } from 'react';
import { useAuthStore } from '../store';
import { authService } from '../services';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const user = await authService.login(credentials);
      setUser(user);
      return user;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de connexion';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
}
```

**Utilisation dans un composant** :

```tsx
function LoginPage() {
  const { login, isLoading, error } = useLogin();
  
  const handleSubmit = async (data: LoginInput) => {
    try {
      await login(data);
      router.push('/dashboard');
    } catch (err) {
      toast.error('Identifiants invalides');
    }
  };

  return <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />;
}
```

### 2. Service Layer Pattern

Centraliser les appels API dans des services.

```tsx
// features/auth/services/auth.service.ts
import { apiClient, API_ENDPOINTS } from '@/src/shared/lib/api';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.AUTH.LOGIN, 
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await apiClient.post<User>(
      API_ENDPOINTS.AUTH.REGISTER, 
      data
    );
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
```

### 3. Store Pattern (Zustand)

Gestion d'état global simple et performante.

```tsx
// features/auth/store/authStore.ts
import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user,
    isLoading: false 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  }),
}));
```

### 4. Guard Pattern

Protection des routes avec des composants guard.

```tsx
// shared/components/guards/AuthGuard/AuthGuard.tsx
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return <>{children}</>;
}
```

**Utilisation** :

```tsx
// app/(dashboard)/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <AuthGuard>
      <DashboardContent>{children}</DashboardContent>
    </AuthGuard>
  );
}
```

### 5. Validation avec Zod

Validation déclarative avec des schémas réutilisables.

```tsx
// features/auth/schemas/login.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  login: z.string().email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères'),
});

export type LoginInput = z.infer<typeof loginSchema>;
```

**Utilisation avec React Hook Form** :

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('login')} />
      {errors.login && <span>{errors.login.message}</span>}
    </form>
  );
}
```

---

## 💾 State Management (Zustand)

### Pourquoi Zustand ?

- ✅ **Simple** : API minimaliste, pas de boilerplate
- ✅ **Performant** : Re-render uniquement les composants nécessaires
- ✅ **TypeScript-first** : Typage natif excellent
- ✅ **Flexible** : Peut être utilisé hors React

### Structure d'un Store

```tsx
import { create } from 'zustand';

interface MyState {
  // État
  data: string | null;
  isLoading: boolean;
  
  // Actions
  setData: (data: string) => void;
  fetchData: () => Promise<void>;
  reset: () => void;
}

export const useMyStore = create<MyState>((set, get) => ({
  // Valeurs initiales
  data: null,
  isLoading: false,
  
  // Actions
  setData: (data) => set({ data }),
  
  fetchData: async () => {
    set({ isLoading: true });
    try {
      const data = await apiCall();
      set({ data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },
  
  reset: () => set({ data: null, isLoading: false }),
}));
```

### Utilisation dans les Composants

```tsx
function MyComponent() {
  // Sélectionner uniquement ce dont on a besoin
  const data = useMyStore((state) => state.data);
  const fetchData = useMyStore((state) => state.fetchData);
  
  return <div>{data}</div>;
}
```

---

## 📝 Gestion des Formulaires

### React Hook Form + Zod

Combinaison puissante pour des formulaires validés et performants.

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/src/features/auth/schemas';

function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    await authService.register(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        S'inscrire
      </button>
    </form>
  );
}
```

---

## 🎨 Styling (Tailwind CSS)

### Approche Utility-First

```tsx
<button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">
  Envoyer
</button>
```

### Composants shadcn/ui

Composants pré-stylés et accessibles basés sur Radix UI.

```tsx
import { Button } from '@/src/shared/components/ui/button';

<Button variant="default" size="lg">
  Envoyer un colis
</Button>
```

### Organisation des Classes

Utiliser `cn()` pour combiner les classes conditionnellement :

```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'rounded-lg p-4',
  isActive && 'bg-primary text-white',
  isDisabled && 'opacity-50 cursor-not-allowed'
)}>
  Contenu
</div>
```

---

## ✅ Bonnes Pratiques

### 1. Imports

Utiliser les alias de chemins :

```tsx
// ✅ BON
import { useAuth } from '@/src/features/auth/hooks';
import { Button } from '@/src/shared/components/ui/button';

// ❌ MAUVAIS
import { useAuth } from '../../../features/auth/hooks';
```

### 2. Composants

- Garder les composants **petits et focalisés**
- Extraire la logique dans des **custom hooks**
- Utiliser des **props typées** avec TypeScript

```tsx
// ✅ BON : Composant simple avec props typées
interface ButtonProps {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
}

export function MyButton({ label, onClick, isLoading }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Chargement...' : label}
    </button>
  );
}
```

### 3. État

- Utiliser **Zustand** pour l'état global
- Utiliser **useState** pour l'état local UI
- Éviter de stocker des données dérivées

```tsx
// ✅ BON : État minimal
const [email, setEmail] = useState('');

// ❌ MAUVAIS : Donnée dérivée stockée
const [isEmailValid, setIsEmailValid] = useState(false);

// ✅ BON : Calculer à la volée
const isEmailValid = email.includes('@');
```

### 4. Performance

- Utiliser **React.memo** pour les composants coûteux
- Utiliser **useCallback** pour les fonctions passées en props
- Sélectionner uniquement les données nécessaires depuis Zustand

```tsx
// ✅ BON : Sélection précise
const userName = useAuthStore((state) => state.user?.fullName);

// ❌ MOINS BON : Récupération de tout le state
const { user } = useAuthStore();
const userName = user?.fullName;
```

### 5. Error Handling

- Toujours gérer les erreurs des appels async
- Afficher des messages d'erreur clairs

```tsx
// ✅ BON
try {
  await login(credentials);
  toast.success('Connexion réussie');
} catch (error) {
  const message = error instanceof Error 
    ? error.message 
    : 'Erreur de connexion';
  toast.error(message);
}
```

### 6. Testing

_À venir : Guide des tests avec Vitest et React Testing Library_

---

## 📚 Ressources Complémentaires

- [Next.js Documentation](https://nextjs.org/docs)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Zod Documentation](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

**Dernière mise à jour** : Janvier 2024  
**Mainteneur** : Équipe ShipEasy
