import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { authConfig } from "./auth.config";
import { connectToDatabase } from "./lib/db";
import User from "./models/User";
import EmailAccount from "./models/EmailAccount";

import CredentialsProvider from "next-auth/providers/credentials";

const GMAIL_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.modify",
].join(" ");

/**
 * Background DB sync — persists OAuth user and email account tokens to MongoDB.
 *
 * IMPORTANT: This is intentionally fire-and-forget from the signIn callback.
 * A DB failure must NEVER deny authentication. Auth.js treats `return false`
 * or an uncaught throw in signIn() as AccessDenied. We log DB errors and
 * continue so the OAuth session is always created successfully.
 */
async function syncUserToDatabase(
  user: { id?: string; name?: string | null; email?: string | null; image?: string | null },
  account: {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
): Promise<void> {
  try {
    await connectToDatabase();

    // Upsert user — create on first login, skip on subsequent logins
    const dbUser = await User.findOneAndUpdate(
      { email: user.email },
      {
        $setOnInsert: {
          name: user.name,
          email: user.email,
          provider: "google",
          createdAt: new Date(),
        },
        $set: {
          image: user.image, // always update avatar in case it changed
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Upsert EmailAccount with fresh OAuth tokens
    if (account.access_token) {
      await EmailAccount.findOneAndUpdate(
        { userId: dbUser._id, emailAddress: user.email },
        {
          userId: dbUser._id,
          emailAddress: user.email,
          provider: "google",
          accessToken: account.access_token,
          ...(account.refresh_token ? { refreshToken: account.refresh_token } : {}),
          tokenExpiry: account.expires_at
            ? new Date(account.expires_at * 1000)
            : new Date(Date.now() + 3_600_000),
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
    }

    console.log("[auth] DB sync complete for:", user.email);
  } catch (error) {
    // Log the error but DO NOT re-throw — a DB failure must not deny login
    console.error("[auth] DB sync failed (non-fatal):", error);
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: GMAIL_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Replace with real DB lookup + bcrypt password check for production
        if (credentials?.email && credentials?.password) {
          return { id: "1", name: "Demo User", email: credentials.email as string };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,

    /**
     * signIn callback — called after OAuth succeeds, before session is created.
     *
     * ⚠️  This callback MUST return `true` to allow the sign-in.
     *     Returning `false` or throwing triggers AccessDenied.
     *     DB errors are handled inside syncUserToDatabase() and never propagate here.
     */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Fire-and-forget: sync to DB in background, never block auth gate
        syncUserToDatabase(user, account).catch((err) =>
          console.error("[auth] Unexpected error in syncUserToDatabase:", err)
        );
      }
      // Always return true — auth is Google-verified, DB is secondary concern
      return true;
    },

    async jwt({ token, user, account }) {
      // Persist user id and OAuth tokens into the JWT on first sign-in
      if (user) {
        token.id = user.id;
      }
      if (account?.provider === "google") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose id and accessToken to the client session
      if (token) {
        session.user.id = token.id as string;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV === "development",
});
