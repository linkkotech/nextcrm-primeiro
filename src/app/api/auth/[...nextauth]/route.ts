import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
  },
  providers: [
    Credentials({
      name: "Credenciais",
      authorize: async (credentials) => {
        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordMatches = await compare(password, user.passwordHash);

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
    }),
  ],
  pages: {
    signIn: "/(auth)/sign-in",
  },
  callbacks: {
    async session({ session, user }) {
      if (!session.user || !user) {
        return session;
      }

      const memberships = await prisma.workspaceMember.findMany({
        where: { userId: user.id },
        select: {
          workspace: {
            select: {
              id: true,
              slug: true,
            },
          },
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          workspaces: memberships.map(({ workspace }) => workspace),
        },
      };
    },
  },
});

export const { GET, POST } = handlers;
export { auth };
