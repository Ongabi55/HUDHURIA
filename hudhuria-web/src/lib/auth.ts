import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import type { AuthOptions } from 'next-auth'

export const authOptions: AuthOptions = {
  // no adapter here to avoid installing @next-auth/prisma-adapter (peer conflicts with next-auth beta)
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user || !user.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null
        // return minimal user object
        return {
          id: user.id,
          name: user.name ?? null,
          email: user.email,
          role: user.role,
          institution: user.institution ?? null,
        } as any
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = (user as any).id
      }
      return token
    },
    async session({ session, token }) {
      (session as any).user = {
        id: token.id,
        name: session.user?.name ?? null,
        email: session.user?.email ?? null,
        role: (token as any).role ?? 'STUDENT'
      }
      return session
    }
  }
}

export default authOptions
