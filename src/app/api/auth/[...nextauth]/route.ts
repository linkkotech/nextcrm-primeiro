import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const { handlers, auth, signIn, signOut } = NextAuth({
  // Removido o adapter pois não é compatível com Credentials provider + JWT strategy
  session: {
    strategy: "jwt", // Mudado de "database" para "jwt" para melhor compatibilidade
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
    async jwt({ token, user }) {
      // Quando o usuário faz login, adicionar o ID ao token
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Adicionar dados do token à sessão
      if (token && session.user) {
        session.user.id = token.id as string;

        // Buscar workspaces do usuário
        const memberships = await prisma.workspaceMember.findMany({
          where: { userId: token.id as string },
          select: {
            workspace: {
              select: {
                id: true,
                slug: true,
              },
            },
          },
        });

        session.user.workspaces = memberships.map(({ workspace }) => workspace);
      }

      return session;
    },
  },
});

export const { GET, POST } = handlers;
export { auth, signIn, signOut };
