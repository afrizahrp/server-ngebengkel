import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '@prisma/client/edge';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Custom hash function using argon2 (seperti implementasi sebelumnya)
const customHash = {
  hash: async (password: string) => {
    return await argon2.hash(password);
  },
  verify: async (hash: string, password: string) => {
    return await argon2.verify(hash, password);
  },
};

export const auth = betterAuth({
  // Better Auth Secret - untuk sign cookies dan tokens
  secret: process.env.BETTER_AUTH_SECRET || '',

  // Trusted Origins untuk CORS
  trustedOrigins: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001','http://localhost:3300',
  ],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
    // Gunakan custom hash dengan argon2
    async sendResetPassword(user, url) {
      // Implementasi kirim email reset password
      console.log('Reset password URL:', url);
    },
  },

  // Session Configuration
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },

  // OAuth Providers
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      redirectURI:
        process.env.GOOGLE_REDIRECT_URI ||
        'http://localhost:3001/auth/google/callback',
    },
  },

  // Advanced Options
  advanced: {
    generateId: () => {
      // Generate custom ID jika diperlukan
      return crypto.randomUUID();
    },
  },

  // Hooks untuk custom logic (optional - bisa di-enable nanti)
  // hooks: {
  //   after: async (ctx) => {
  //     // Custom logic setelah auth action
  //     return ctx;
  //   },
  // },
});

export type Session = typeof auth.$Infer.Session;
