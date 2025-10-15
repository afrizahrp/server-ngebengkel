# 🔐 Hybrid Authentication Approach

Panduan implementasi **Hybrid Authentication** dengan kombinasi Server Actions + Client-side Hooks & Guards untuk Next.js App Router.

---

## 📊 Perbandingan Pendekatan

### **1. Pure Client-Side Authentication** ❌ (Guide sebelumnya)

```typescript
// ❌ Semua API calls dari browser
const login = async () => {
  const response = await axios.post('http://api.com/auth/login', data);
  // Token exposed di client
  localStorage.setItem('accessToken', response.data.accessToken);
};
```

**Kekurangan:**

- ❌ Token exposed di browser (bisa dicuri via XSS)
- ❌ API URL exposed di client
- ❌ Credentials dikirim dari browser
- ❌ Tidak SEO-friendly
- ❌ API keys bisa di-extract

---

### **2. Pure Server-Side Authentication** (SSR)

```typescript
// ✅ Semua di server
export default async function Page() {
  const session = await getServerSession();
  // Render di server
}
```

**Kekurangan:**

- ❌ Tidak ada client-side state
- ❌ Perlu reload untuk update UI
- ❌ Tidak ada real-time updates
- ❌ Guards sulit diimplementasi

---

### **3. Hybrid Approach** ✅ (RECOMMENDED)

```typescript
// ✅ Server Actions untuk API calls
'use server';
async function loginAction(data) {
  const response = await fetch('http://api.com/auth/login');
  cookies().set('accessToken', token, { httpOnly: true });
}

// ✅ Client hooks untuk state & UI
('use client');
function LoginForm() {
  const { login } = useAuth();
  // UI tetap reactive
}
```

**Keuntungan:**

- ✅ **Security**: Token di HTTP-only cookies (tidak bisa diakses JS)
- ✅ **Type-safe**: Server actions full TypeScript
- ✅ **Performance**: Less client-side code
- ✅ **SEO**: Server-rendered
- ✅ **UX**: Client hooks untuk reactive UI
- ✅ **Best of both worlds**

---

## 🏗️ Struktur Project Hybrid

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx           # Client component
│   │   └── register/
│   │       └── page.tsx
│   │
│   ├── (protected)/
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   └── layout.tsx             # Server component with auth check
│   │
│   └── api/                       # Optional API routes
│       └── auth/
│           └── [...route]/route.ts
│
├── lib/
│   ├── actions/                   # ⭐ Server Actions
│   │   ├── auth.actions.ts
│   │   └── session.actions.ts
│   │
│   ├── auth/                      # Server-side utilities
│   │   ├── session.ts             # Get session from cookies
│   │   └── permissions.ts         # Check roles/permissions
│   │
│   └── stores/                    # Client state (optional)
│       └── auth-store.ts
│
├── hooks/                         # ⭐ Client Hooks
│   ├── useAuth.ts
│   ├── useSession.ts
│   └── usePermission.ts
│
└── components/
    ├── guards/                    # ⭐ Client Guards
    │   ├── AuthGuard.tsx
    │   └── RoleGuard.tsx
    │
    └── auth/
        ├── LoginForm.tsx          # Client component
        └── SessionList.tsx
```

---

## 🔧 Implementation

### **1. Server Actions (API Calls)**

```typescript
// lib/actions/auth.actions.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface LoginInput {
  email: string;
  password: string;
  deviceName?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
    emailVerified: boolean;
    twoFactorEnabled: boolean;
    role?: string;
  };
  requiresTwoFactor?: boolean;
  userId?: number;
  message?: string;
  error?: string;
}

/**
 * Login action - dipanggil dari client
 */
export async function loginAction(data: LoginInput): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Login failed',
      };
    }

    // Jika butuh 2FA
    if (result.requiresTwoFactor) {
      return {
        success: true,
        requiresTwoFactor: true,
        userId: result.user.id,
        user: result.user,
      };
    }

    // Login sukses - simpan tokens di HTTP-only cookies
    const cookieStore = cookies();

    cookieStore.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15, // 15 minutes
      path: '/',
    });

    cookieStore.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    cookieStore.set('sessionId', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Simpan user data di cookie (non-httpOnly untuk client access)
    cookieStore.set('user', JSON.stringify(result.user), {
      httpOnly: false, // Client bisa akses
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during login',
    };
  }
}

/**
 * Verify 2FA action
 */
export async function verify2FAAction(
  userId: number,
  otpCode: string,
  deviceName?: string,
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/verify-2fa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, otpCode, deviceName }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || '2FA verification failed',
      };
    }

    // Simpan tokens di cookies
    const cookieStore = cookies();

    cookieStore.set('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 15,
      path: '/',
    });

    cookieStore.set('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    cookieStore.set('sessionId', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    cookieStore.set('user', JSON.stringify(result.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return {
      success: true,
      user: result.user,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || '2FA verification failed',
    };
  }
}

/**
 * Register action
 */
export async function registerAction(data: {
  name: string;
  email: string;
  password: string;
  image?: string;
}): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || 'Registration failed',
      };
    }

    return {
      success: true,
      user: result.user,
      message: result.message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Registration failed',
    };
  }
}

/**
 * Logout action
 */
export async function logoutAction(): Promise<void> {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  // Call backend logout
  try {
    const accessToken = cookieStore.get('accessToken')?.value;

    if (accessToken) {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ sessionId }),
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Clear all cookies
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');
  cookieStore.delete('sessionId');
  cookieStore.delete('user');

  redirect('/login');
}

/**
 * Get current user from cookies
 */
export async function getCurrentUser() {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user')?.value;

  if (!userCookie) {
    return null;
  }

  try {
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

/**
 * Get user from API (untuk refresh data)
 */
export async function getUserFromAPI() {
  try {
    const cookieStore = cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return null;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const user = await response.json();

    // Update user cookie
    cookieStore.set('user', JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  return !!accessToken;
}
```

### **2. Session Actions**

```typescript
// lib/actions/session.actions.ts
'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function getAuthHeaders() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
}

/**
 * Get all sessions
 */
export async function getSessionsAction(onlyActive: boolean = true) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(
      `${API_URL}/sessions?onlyActive=${onlyActive}`,
      {
        headers,
        cache: 'no-store', // Disable cache untuk data real-time
      },
    );

    if (!response.ok) {
      throw new Error('Failed to fetch sessions');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return { data: [], total: 0 };
  }
}

/**
 * Get session stats
 */
export async function getSessionStatsAction() {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/sessions/stats/me`, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch session stats');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Get session stats error:', error);
    return { data: null };
  }
}

/**
 * Revoke specific session
 */
export async function revokeSessionAction(sessionId: string, reason?: string) {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ reason }),
    });

    if (!response.ok) {
      throw new Error('Failed to revoke session');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Revoke session error:', error);
    throw error;
  }
}

/**
 * Revoke other sessions
 */
export async function revokeOtherSessionsAction() {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/sessions/revoke-others`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to revoke other sessions');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Revoke other sessions error:', error);
    throw error;
  }
}

/**
 * Revoke all sessions
 */
export async function revokeAllSessionsAction() {
  try {
    const headers = await getAuthHeaders();

    const response = await fetch(`${API_URL}/sessions/revoke-all`, {
      method: 'POST',
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to revoke all sessions');
    }

    return await response.json();
  } catch (error: any) {
    console.error('Revoke all sessions error:', error);
    throw error;
  }
}
```

### **3. Client Hooks (Tetap Dipakai untuk State & UI)**

```typescript
// hooks/useAuth.ts
'use client';

import { create } from 'zustand';
import { useRouter } from 'next/navigation';
import {
  loginAction,
  logoutAction,
  registerAction,
  verify2FAAction,
  getCurrentUser,
} from '@/lib/actions/auth.actions';
import { useEffect } from 'react';

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
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  loadUser: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  loadUser: async () => {
    set({ isLoading: true });
    try {
      // Get user dari cookie (client-accessible)
      const userCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('user='));

      if (userCookie) {
        const user = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  clearAuth: () => {
    set({ user: null, isAuthenticated: false, error: null });
  },
}));

/**
 * Main auth hook
 */
export const useAuth = () => {
  const router = useRouter();
  const store = useAuthStore();

  // Load user saat hook pertama kali dipanggil
  useEffect(() => {
    if (!store.user && !store.isLoading) {
      store.loadUser();
    }
  }, []);

  const login = async (data: {
    email: string;
    password: string;
    deviceName?: string;
  }) => {
    store.setLoading(true);
    store.setError(null);

    const result = await loginAction(data);

    store.setLoading(false);

    if (!result.success) {
      store.setError(result.error || 'Login failed');
      return result;
    }

    // Jika butuh 2FA
    if (result.requiresTwoFactor) {
      return result;
    }

    // Login sukses
    store.setUser(result.user!);
    router.push('/dashboard');
    router.refresh(); // Refresh server components
    return result;
  };

  const verify2FA = async (userId: number, otpCode: string) => {
    store.setLoading(true);
    store.setError(null);

    const result = await verify2FAAction(userId, otpCode);

    store.setLoading(false);

    if (!result.success) {
      store.setError(result.error || '2FA verification failed');
      return result;
    }

    store.setUser(result.user!);
    router.push('/dashboard');
    router.refresh();
    return result;
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    store.setLoading(true);
    store.setError(null);

    const result = await registerAction(data);

    store.setLoading(false);

    if (!result.success) {
      store.setError(result.error || 'Registration failed');
      return result;
    }

    return result;
  };

  const logout = async () => {
    await logoutAction();
    store.clearAuth();
    // logoutAction akan redirect ke /login
  };

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,
    login,
    verify2FA,
    register,
    logout,
    loadUser: store.loadUser,
  };
};
```

### **4. Session Hook**

```typescript
// hooks/useSession.ts
'use client';

import { useState, useEffect } from 'react';
import {
  getSessionsAction,
  getSessionStatsAction,
  revokeSessionAction,
  revokeOtherSessionsAction,
} from '@/lib/actions/session.actions';

export const useSession = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const [sessionsResult, statsResult] = await Promise.all([
        getSessionsAction(true),
        getSessionStatsAction(),
      ]);

      setSessions(sessionsResult.data || []);
      setStats(statsResult.data);
    } catch (error) {
      console.error('Load sessions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const revokeSession = async (sessionId: string, reason?: string) => {
    setIsRevoking(true);
    try {
      await revokeSessionAction(sessionId, reason);
      await loadSessions(); // Reload
    } catch (error) {
      console.error('Revoke session error:', error);
      throw error;
    } finally {
      setIsRevoking(false);
    }
  };

  const revokeOthers = async () => {
    setIsRevoking(true);
    try {
      await revokeOtherSessionsAction();
      await loadSessions(); // Reload
    } catch (error) {
      console.error('Revoke others error:', error);
      throw error;
    } finally {
      setIsRevoking(false);
    }
  };

  return {
    sessions,
    stats,
    isLoading,
    isRevoking,
    revokeSession,
    revokeOthers,
    refetch: loadSessions,
  };
};
```

### **5. Permission Hook**

```typescript
// hooks/usePermission.ts
'use client';

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

### **6. Client Guards (Sama seperti sebelumnya)**

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
    if (!isAuthenticated && !isLoading) {
      loadUser();
    }
  }, [isAuthenticated, isLoading, loadUser]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};
```

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

### **7. Login Form Component**

```typescript
// components/auth/LoginForm.tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export const LoginForm = () => {
  const { login, verify2FA, isLoading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State untuk 2FA
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [otpCode, setOtpCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login({
      email,
      password,
      deviceName: navigator.userAgent,
    });

    // Jika butuh 2FA
    if (result?.requiresTwoFactor) {
      setRequiresTwoFactor(true);
      setUserId(result.userId!);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) return;

    await verify2FA(userId, otpCode);
  };

  // Form 2FA
  if (requiresTwoFactor) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6">Verifikasi 2FA</h2>
        <p className="mb-4 text-gray-600">
          Kode OTP telah dikirim ke email Anda.
        </p>

        <form onSubmit={handle2FASubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Kode OTP</label>
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

### **8. Session List Component**

```typescript
// components/session/SessionList.tsx
'use client';

import { useSession } from '@/hooks/useSession';

export const SessionList = () => {
  const { sessions, stats, isLoading, revokeSession, revokeOthers, isRevoking } =
    useSession();

  const currentSessionId =
    typeof window !== 'undefined'
      ? document.cookie
          .split('; ')
          .find((row) => row.startsWith('sessionId='))
          ?.split('=')[1]
      : null;

  if (isLoading) {
    return <div>Loading sessions...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Active Sessions</h2>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.activeSessions}
            </div>
            <div className="text-sm text-gray-600">Active Sessions</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalSessions}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
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

      {/* Sessions */}
      <div className="space-y-4">
        {sessions.map((session: any) => (
          <div
            key={session.id}
            className="bg-white border rounded-lg p-4 flex justify-between items-start"
          >
            <div>
              <div className="font-semibold">{session.deviceName}</div>
              <div className="text-sm text-gray-600">
                {session.browser} • {session.os}
              </div>
              <div className="text-xs text-gray-500">IP: {session.ipAddress}</div>

              {session.id === currentSessionId && (
                <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                  Device Saat Ini
                </span>
              )}
            </div>

            {session.id !== currentSessionId && (
              <button
                onClick={() => revokeSession(session.id)}
                disabled={isRevoking}
                className="text-red-600 hover:text-red-800 disabled:opacity-50"
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

## 🎯 Penggunaan di Pages

### **Login Page**

```typescript
// app/(auth)/login/page.tsx
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoginForm />
    </div>
  );
}
```

### **Protected Layout**

```typescript
// app/(protected)/layout.tsx
import { AuthGuard } from '@/components/guards/AuthGuard';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
```

### **Admin Page**

```typescript
// app/(protected)/admin/page.tsx
import { RoleGuard } from '@/components/guards/RoleGuard';

export default function AdminPage() {
  return (
    <RoleGuard requiredRoles={['ADMIN']}>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Only admin can access this</p>
      </div>
    </RoleGuard>
  );
}
```

---

## ✅ Keuntungan Hybrid Approach

### **Security** 🔒

- ✅ Tokens di HTTP-only cookies (tidak bisa di-steal via XSS)
- ✅ API calls dari server (credentials aman)
- ✅ No token exposure di client-side code

### **Performance** ⚡

- ✅ Less JavaScript di client
- ✅ Server-side caching
- ✅ Faster initial load

### **Developer Experience** 👨‍💻

- ✅ Type-safe server actions
- ✅ Familiar hooks pattern
- ✅ Easy to test
- ✅ Clear separation of concerns

### **User Experience** 🎨

- ✅ Reactive UI dengan hooks
- ✅ Optimistic updates
- ✅ Real-time state management
- ✅ Smooth transitions

---

## 📊 Comparison

| Feature           | Client-Side     | Server-Side  | Hybrid ✅    |
| ----------------- | --------------- | ------------ | ------------ |
| Token Security    | ❌ localStorage | ✅ HTTP-only | ✅ HTTP-only |
| API Exposure      | ❌ Exposed      | ✅ Hidden    | ✅ Hidden    |
| Reactive UI       | ✅ Yes          | ❌ No        | ✅ Yes       |
| Type Safety       | ⚠️ Partial      | ✅ Full      | ✅ Full      |
| SEO               | ❌ Poor         | ✅ Great     | ✅ Great     |
| Real-time Updates | ✅ Yes          | ❌ No        | ✅ Yes       |
| Code Complexity   | Medium          | Low          | Medium       |

---

## 🚀 Kesimpulan

**Hybrid Approach** adalah **BEST PRACTICE** untuk Next.js App Router karena:

1. **Server Actions** untuk API calls → Security & Performance
2. **Client Hooks** untuk state & UI → UX & Reactivity
3. **Guards** untuk protection → Easy to implement

Pendekatan ini memberikan **best of both worlds**: keamanan server-side dengan user experience client-side! 🎉

