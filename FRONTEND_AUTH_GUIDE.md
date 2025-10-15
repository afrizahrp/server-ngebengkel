# 🎨 Panduan Frontend Authentication & Authorization

Panduan lengkap implementasi Auth & Authz di Frontend (React/Next.js) yang terintegrasi dengan backend NestJS.

---

## 📋 Table of Contents

1. [Konsep Dasar](#konsep-dasar)
2. [Setup Project](#setup-project)
3. [Authentication Flow](#authentication-flow)
4. [Authorization Flow](#authorization-flow)
5. [API Integration](#api-integration)
6. [Custom Hooks](#custom-hooks)
7. [Protected Routes](#protected-routes)
8. [Role-Based Access Control](#role-based-access-control)
9. [Session Management UI](#session-management-ui)
10. [Best Practices](#best-practices)

---

## 🎯 Konsep Dasar

### **Authentication vs Authorization**

```
┌─────────────────────────────────────────────────────┐
│ AUTHENTICATION (Autentikasi)                        │
│ "Siapa kamu?"                                       │
│                                                     │
│ ✓ Login dengan email & password                    │
│ ✓ Verifikasi identitas user                        │
│ ✓ Dapatkan access token & refresh token            │
│ ✓ Simpan token di localStorage/cookies             │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│ AUTHORIZATION (Otorisasi)                           │
│ "Apa yang boleh kamu lakukan?"                     │
│                                                     │
│ ✓ Check role user (ADMIN, MANAGER, USER)           │
│ ✓ Validasi permission per fitur                    │
│ ✓ Tampilkan/sembunyikan UI berdasarkan role        │
│ ✓ Protect routes yang butuh permission spesifik   │
└─────────────────────────────────────────────────────┘
```

### **Token Management**

```typescript
// Access Token: untuk akses API (short-lived: 15 menit)
// Refresh Token: untuk perpanjang session (long-lived: 7 hari)

localStorage.setItem('accessToken', 'eyJhbGc...');
localStorage.setItem('refreshToken', 'eyJhbGc...');
localStorage.setItem('sessionId', 'clx123...');
```

---

## 🚀 Setup Project

### **1. Install Dependencies**

```bash
# React/Next.js
npm install axios react-query zustand
npm install -D @types/node

# Optional: untuk UI components
npm install @headlessui/react @heroicons/react
```

### **2. Environment Variables**

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_API_TIMEOUT=10000
```

### **3. Struktur Folder**

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx     # Login page
│   │   ├── register/
│   │   │   └── page.tsx     # Register page
│   │   └── verify-email/
│   │       └── page.tsx     # Email verification page
│   │
│   ├── (protected)/         # Protected routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   └── layout.tsx
│
├── lib/
│   ├── api/                 # API clients
│   │   ├── auth.ts
│   │   ├── sessions.ts
│   │   └── axios.ts
│   │
│   └── stores/              # State management
│       └── auth-store.ts
│
├── hooks/                   # Custom hooks
│   ├── useAuth.ts
│   ├── useSession.ts
│   └── usePermission.ts
│
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── TwoFactorForm.tsx
│   │
│   ├── session/
│   │   ├── SessionList.tsx
│   │   └── SessionCard.tsx
│   │
│   └── guards/
│       ├── AuthGuard.tsx
│       └── RoleGuard.tsx
│
└── types/
    ├── auth.ts
    └── session.ts
```

---

## 🔐 Authentication Flow

### **Flow Diagram**

```
┌──────────────┐
│ User Submit  │
│ Login Form   │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│ 1. POST /auth/login                              │
│    Body: { email, password, deviceName }         │
└──────┬───────────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────────────────┐
│ 2. Cek apakah 2FA enabled?                       │
└──────┬───────────────────────────────────────────┘
       │
       ├── NO 2FA ──→ ┌─────────────────────────┐
       │              │ Return tokens langsung  │
       │              │ - accessToken           │
       │              │ - refreshToken          │
       │              │ - sessionId             │
       │              └───────┬─────────────────┘
       │                      │
       │                      ↓
       │              ┌─────────────────────────┐
       │              │ Save tokens             │
       │              │ Redirect to dashboard   │
       │              └─────────────────────────┘
       │
       └── YES 2FA ──→ ┌─────────────────────────┐
                       │ Return pendingVerification│
                       │ - userId                │
                       │ - requiresTwoFactor: true│
                       └───────┬─────────────────┘
                               │
                               ↓
                       ┌─────────────────────────┐
                       │ Show OTP input form     │
                       │ Email OTP code sent     │
                       └───────┬─────────────────┘
                               │
                               ↓
                       ┌─────────────────────────┐
                       │ POST /auth/verify-2fa   │
                       │ Body: { userId, otpCode }│
                       └───────┬─────────────────┘
                               │
                               ↓
                       ┌─────────────────────────┐
                       │ Return tokens           │
                       │ Save & redirect         │
                       └─────────────────────────┘
```

---

## 📡 API Integration

### **1. Axios Client Setup**

```typescript
// lib/api/axios.ts
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Buat axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: tambahkan access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Jika error 401 dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Refresh token
        const response = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          },
        );

        const { accessToken: newAccessToken } = response.data;

        // Simpan token baru
        localStorage.setItem('accessToken', newAccessToken);

        // Retry request asli dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token gagal, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('sessionId');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
```

### **2. Auth API Client**

```typescript
// lib/api/auth.ts
import { apiClient } from './axios';

export interface LoginRequest {
  email: string;
  password: string;
  deviceName?: string;
}

export interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
  };
  accessToken?: string;
  refreshToken?: string;
  sessionId?: string;
  requiresTwoFactor?: boolean;
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface TwoFactorVerifyRequest {
  userId: number;
  otpCode: string;
  deviceName?: string;
}

export const authAPI = {
  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  // Register
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  // Verify 2FA
  verify2FA: async (data: TwoFactorVerifyRequest): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/verify-2fa', data);
    return response.data;
  },

  // Logout
  logout: async (sessionId?: string) => {
    const response = await apiClient.post('/auth/logout', { sessionId });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      },
    );
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  // Resend verification email
  resendVerificationEmail: async (email: string) => {
    const response = await apiClient.post('/auth/resend-verification-email', {
      email,
    });
    return response.data;
  },

  // Enable 2FA
  enable2FA: async () => {
    const response = await apiClient.post('/auth/enable-2fa');
    return response.data;
  },

  // Disable 2FA
  disable2FA: async () => {
    const response = await apiClient.post('/auth/disable-2fa');
    return response.data;
  },

  // Get 2FA status
  get2FAStatus: async () => {
    const response = await apiClient.get('/auth/2fa-status');
    return response.data;
  },
};
```

### **3. Session API Client**

```typescript
// lib/api/sessions.ts
import { apiClient } from './axios';

export interface Session {
  id: string;
  deviceName: string;
  deviceType: string;
  browser: string;
  os: string;
  ipAddress: string;
  isActive: boolean;
  lastActivityAt: string;
  expiresAt: string;
  createdAt: string;
  revokedAt: string | null;
  revokedReason: string | null;
}

export const sessionAPI = {
  // Get all sessions
  getSessions: async (onlyActive: boolean = true) => {
    const response = await apiClient.get(`/sessions?onlyActive=${onlyActive}`);
    return response.data;
  },

  // Get session stats
  getSessionStats: async () => {
    const response = await apiClient.get('/sessions/stats/me');
    return response.data;
  },

  // Revoke specific session
  revokeSession: async (sessionId: string, reason?: string) => {
    const response = await apiClient.delete(`/sessions/${sessionId}`, {
      data: { reason },
    });
    return response.data;
  },

  // Revoke other sessions
  revokeOtherSessions: async () => {
    const response = await apiClient.post('/sessions/revoke-others');
    return response.data;
  },

  // Revoke all sessions
  revokeAllSessions: async () => {
    const response = await apiClient.post('/sessions/revoke-all');
    return response.data;
  },
};
```

---

## 🎣 Custom Hooks

### **1. useAuth Hook**

```typescript
// hooks/useAuth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI, LoginRequest, RegisterRequest } from '@/lib/api/auth';

interface User {
  id: number;
  name: string;
  email: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  role?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (data: LoginRequest) => Promise<any>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<any>;
  setUser: (user: User) => void;
  setTokens: (
    accessToken: string,
    refreshToken: string,
    sessionId: string,
  ) => void;
  clearAuth: () => void;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,
      isAuthenticated: false,
      isLoading: false,

      // Login
      login: async (data: LoginRequest) => {
        set({ isLoading: true });

        try {
          const response = await authAPI.login(data);

          // Jika butuh 2FA verification
          if (response.requiresTwoFactor) {
            set({ isLoading: false });
            return {
              requiresTwoFactor: true,
              userId: response.user.id,
            };
          }

          // Login sukses, simpan tokens
          if (response.accessToken && response.refreshToken) {
            set({
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken,
              sessionId: response.sessionId || null,
              isAuthenticated: true,
              isLoading: false,
            });

            // Simpan ke localStorage
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            if (response.sessionId) {
              localStorage.setItem('sessionId', response.sessionId);
            }
          }

          return response;
        } catch (error: any) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        const { sessionId } = get();

        try {
          await authAPI.logout(sessionId || undefined);
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          // Clear state
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            sessionId: null,
            isAuthenticated: false,
          });

          // Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('sessionId');
        }
      },

      // Register
      register: async (data: RegisterRequest) => {
        set({ isLoading: true });

        try {
          const response = await authAPI.register(data);
          set({ isLoading: false });
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      // Set user
      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      // Set tokens
      setTokens: (
        accessToken: string,
        refreshToken: string,
        sessionId: string,
      ) => {
        set({
          accessToken,
          refreshToken,
          sessionId,
          isAuthenticated: true,
        });

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('sessionId', sessionId);
      },

      // Clear auth
      clearAuth: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          sessionId: null,
          isAuthenticated: false,
        });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('sessionId');
      },

      // Load user from API
      loadUser: async () => {
        const { accessToken } = get();

        if (!accessToken) {
          return;
        }

        set({ isLoading: true });

        try {
          const userData = await authAPI.getCurrentUser();
          set({
            user: userData,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Load user error:', error);
          get().clearAuth();
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        sessionId: state.sessionId,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

// Hook untuk component
export const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    login: store.login,
    logout: store.logout,
    register: store.register,
    setUser: store.setUser,
    setTokens: store.setTokens,
    loadUser: store.loadUser,
  };
};
```

### **2. useSession Hook**

```typescript
// hooks/useSession.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionAPI, Session } from '@/lib/api/sessions';

export const useSession = () => {
  const queryClient = useQueryClient();

  // Get all sessions
  const {
    data: sessions,
    isLoading,
    error,
    refetch,
  } = useQuery<{ data: Session[]; total: number }>({
    queryKey: ['sessions'],
    queryFn: () => sessionAPI.getSessions(true),
  });

  // Get session stats
  const { data: stats } = useQuery({
    queryKey: ['session-stats'],
    queryFn: () => sessionAPI.getSessionStats(),
  });

  // Revoke session mutation
  const revokeSessionMutation = useMutation({
    mutationFn: ({
      sessionId,
      reason,
    }: {
      sessionId: string;
      reason?: string;
    }) => sessionAPI.revokeSession(sessionId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session-stats'] });
    },
  });

  // Revoke other sessions mutation
  const revokeOthersMutation = useMutation({
    mutationFn: () => sessionAPI.revokeOtherSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session-stats'] });
    },
  });

  // Revoke all sessions mutation
  const revokeAllMutation = useMutation({
    mutationFn: () => sessionAPI.revokeAllSessions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['session-stats'] });
    },
  });

  return {
    sessions: sessions?.data || [],
    total: sessions?.total || 0,
    stats: stats?.data,
    isLoading,
    error,
    refetch,
    revokeSession: revokeSessionMutation.mutate,
    revokeOthers: revokeOthersMutation.mutate,
    revokeAll: revokeAllMutation.mutate,
    isRevoking:
      revokeSessionMutation.isPending ||
      revokeOthersMutation.isPending ||
      revokeAllMutation.isPending,
  };
};
```

### **3. usePermission Hook**

```typescript
// hooks/usePermission.ts
import { useAuth } from './useAuth';

export type Role = 'ADMIN' | 'MANAGER' | 'USER';

export const usePermission = () => {
  const { user } = useAuth();

  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user?.role) return false;

    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role as Role);
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN');
  };

  const isManager = (): boolean => {
    return hasRole(['ADMIN', 'MANAGER']);
  };

  const canAccess = (requiredRoles: Role[]): boolean => {
    return hasRole(requiredRoles);
  };

  return {
    hasRole,
    isAdmin,
    isManager,
    canAccess,
    userRole: user?.role as Role | undefined,
  };
};
```

---

## 🛡️ Protected Routes

### **1. AuthGuard Component**

```typescript
// components/guards/AuthGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, isLoading, loadUser } = useAuth();

  useEffect(() => {
    // Load user saat component mount
    if (!isAuthenticated && !isLoading) {
      loadUser();
    }
  }, [isAuthenticated, isLoading, loadUser]);

  useEffect(() => {
    // Redirect ke login jika tidak authenticated
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show content jika authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Return null saat redirect
  return null;
};
```

### **2. RoleGuard Component**

```typescript
// components/guards/RoleGuard.tsx
'use client';

import { usePermission, Role } from '@/hooks/usePermission';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRoles: Role[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard = ({
  children,
  requiredRoles,
  fallback,
  redirectTo = '/unauthorized',
}: RoleGuardProps) => {
  const router = useRouter();
  const { canAccess } = usePermission();

  const hasPermission = canAccess(requiredRoles);

  useEffect(() => {
    if (!hasPermission && redirectTo) {
      router.push(redirectTo);
    }
  }, [hasPermission, redirectTo, router]);

  if (!hasPermission) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
};
```

### **3. Penggunaan di Layout/Page**

```typescript
// app/(protected)/dashboard/layout.tsx
import { AuthGuard } from '@/components/guards/AuthGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

```typescript
// app/(protected)/admin/page.tsx
import { RoleGuard } from '@/components/guards/RoleGuard';

export default function AdminPage() {
  return (
    <RoleGuard requiredRoles={['ADMIN']}>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Only admin can see this</p>
      </div>
    </RoleGuard>
  );
}
```

---

## 🎨 UI Components

### **1. Login Form**

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export const LoginForm = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // State untuk 2FA
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const result = await login({
        email,
        password,
        deviceName: navigator.userAgent,
      });

      // Jika butuh 2FA
      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setUserId(result.userId);
        return;
      }

      // Login sukses
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!userId) return;

    try {
      const { authAPI } = await import('@/lib/api/auth');
      const result = await authAPI.verify2FA({
        userId,
        otpCode,
        deviceName: navigator.userAgent,
      });

      // Simpan tokens
      const { setTokens, setUser } = useAuth.getState();
      setTokens(result.accessToken!, result.refreshToken!, result.sessionId!);
      setUser(result.user);

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || '2FA verification failed');
    }
  };

  // Form 2FA
  if (requiresTwoFactor) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Verifikasi 2FA</h2>
        <p className="mb-4 text-gray-600">
          Kode OTP telah dikirim ke email Anda. Silakan masukkan kode untuk melanjutkan.
        </p>

        <form onSubmit={handle2FASubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Kode OTP
            </label>
            <input
              type="text"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Masukkan 6 digit kode"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Memverifikasi...' : 'Verifikasi'}
          </button>
        </form>
      </div>
    );
  }

  // Form Login Normal
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
```

### **2. Session Management UI**

```typescript
// components/session/SessionList.tsx
'use client';

import { useSession } from '@/hooks/useSession';
import { Session } from '@/lib/api/sessions';

export const SessionList = () => {
  const {
    sessions,
    stats,
    isLoading,
    revokeSession,
    revokeOthers,
    isRevoking,
  } = useSession();

  const currentSessionId = localStorage.getItem('sessionId');

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'mobile':
        return '📱';
      case 'desktop':
        return '💻';
      case 'tablet':
        return '📋';
      default:
        return '🖥️';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('id', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Session Management</h2>
        <p className="text-gray-600">
          Kelola device yang sedang login ke akun Anda
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalSessions}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.activeSessions}
            </div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {stats.deviceTypes.length}
            </div>
            <div className="text-sm text-gray-600">Device Types</div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="mb-6">
        <button
          onClick={() => revokeOthers()}
          disabled={isRevoking}
          className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
        >
          Logout Semua Device Lain
        </button>
      </div>

      {/* Session List */}
      <div className="space-y-4">
        {sessions.map((session: Session) => (
          <div
            key={session.id}
            className="bg-white border rounded-lg p-4 flex items-start justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">
                {getDeviceIcon(session.deviceType)}
              </div>
              <div>
                <div className="font-semibold">{session.deviceName}</div>
                <div className="text-sm text-gray-600">
                  {session.browser} • {session.os}
                </div>
                <div className="text-sm text-gray-600">
                  IP: {session.ipAddress}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last active: {formatDate(session.lastActivityAt)}
                </div>

                {session.id === currentSessionId && (
                  <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Device Saat Ini
                  </span>
                )}
              </div>
            </div>

            {session.id !== currentSessionId && (
              <button
                onClick={() => revokeSession({ sessionId: session.id })}
                disabled={isRevoking}
                className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
              >
                Logout
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

## 🔒 Role-Based Access Control

### **Conditional Rendering Berdasarkan Role**

```typescript
// components/RoleBasedComponent.tsx
'use client';

import { usePermission } from '@/hooks/usePermission';

export const Dashboard = () => {
  const { isAdmin, isManager, userRole } = usePermission();

  return (
    <div>
      <h1>Dashboard</h1>

      {/* Tampilkan hanya untuk Admin */}
      {isAdmin() && (
        <div className="bg-red-100 p-4 rounded">
          <h2>Admin Panel</h2>
          <p>Hanya admin yang bisa lihat ini</p>
        </div>
      )}

      {/* Tampilkan untuk Admin & Manager */}
      {isManager() && (
        <div className="bg-blue-100 p-4 rounded">
          <h2>Manager Tools</h2>
          <p>Admin dan Manager bisa lihat ini</p>
        </div>
      )}

      {/* Tampilkan untuk semua user */}
      <div className="bg-gray-100 p-4 rounded">
        <h2>User Content</h2>
        <p>Your role: {userRole}</p>
      </div>
    </div>
  );
};
```

### **Conditional Menu Items**

```typescript
// components/Navbar.tsx
'use client';

import Link from 'next/link';
import { usePermission } from '@/hooks/usePermission';
import { useAuth } from '@/hooks/useAuth';

export const Navbar = () => {
  const { isAdmin, isManager } = usePermission();
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>

          {/* Manager & Admin only */}
          {isManager() && (
            <Link href="/reports">Reports</Link>
          )}

          {/* Admin only */}
          {isAdmin() && (
            <>
              <Link href="/users">Users</Link>
              <Link href="/settings">Settings</Link>
            </>
          )}
        </div>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
```

---

## ✅ Best Practices

### **1. Token Security**

```typescript
// ❌ JANGAN simpan di localStorage untuk production
localStorage.setItem('accessToken', token);

// ✅ Gunakan HTTP-only cookies untuk production
// Backend set cookie:
res.cookie('accessToken', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
});
```

### **2. Auto Refresh Token**

Sudah di-handle di `axios interceptor` - otomatis refresh saat 401.

### **3. Logout Saat Tab Close (Optional)**

```typescript
// hooks/useAuth.ts
useEffect(() => {
  const handleBeforeUnload = () => {
    // Optional: logout saat tab close
    // logout();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);
```

### **4. Session Validation**

```typescript
// Validasi session setiap 5 menit
useEffect(() => {
  const interval = setInterval(
    async () => {
      try {
        await authAPI.getCurrentUser();
      } catch (error) {
        // Session invalid, logout
        logout();
      }
    },
    5 * 60 * 1000,
  ); // 5 minutes

  return () => clearInterval(interval);
}, []);
```

### **5. Error Handling**

```typescript
// Centralized error handler
const handleAPIError = (error: any) => {
  if (error.response?.status === 401) {
    // Unauthorized - logout
    logout();
    router.push('/login');
  } else if (error.response?.status === 403) {
    // Forbidden - no permission
    router.push('/unauthorized');
  } else {
    // Other errors
    toast.error(error.response?.data?.message || 'An error occurred');
  }
};
```

---

## 🎯 Summary

### **Authentication Flow:**

1. User login → Backend return tokens
2. Simpan tokens di localStorage/cookies
3. Attach token di setiap API request (via axios interceptor)
4. Auto refresh token saat expired

### **Authorization Flow:**

1. Load user data (termasuk role) saat app init
2. Check role via `usePermission` hook
3. Conditional rendering UI berdasarkan role
4. Protected routes dengan `RoleGuard`

### **Session Management:**

1. Track semua device yang login
2. User bisa logout dari device tertentu
3. UI tampilkan list sessions dengan info lengkap
4. Support multi-device login

---

## 📚 Next Steps

1. ✅ Implement Google OAuth di frontend
2. ✅ Add email verification UI
3. ✅ Add 2FA enable/disable toggle
4. ✅ Add session monitoring dashboard
5. ✅ Add notification untuk login baru

---

**Happy Coding! 🚀**


