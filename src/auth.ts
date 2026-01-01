import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.password) return null

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                })

                if (!user) return null

                // Plain text comparison for MVP. Upgrade to bcrypt/argon2 in production!
                if (user.password !== credentials.password) return null

                return { id: user.id, email: user.email, name: user.name }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            return isLoggedIn;
            // Note: We'll refine this logic in middleware.ts or here. 
            // Actually, returning true/false here works well with the middleware wrapper.
            // But we need to handle public routes.
            // We'll leave it open for now or specific to dashboard.
        },
    },
})
