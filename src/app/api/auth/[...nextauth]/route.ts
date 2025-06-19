import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const authOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: {
					label: "Email",
					type: "email",
					placeholder: "email@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) return null;
				const valid = await bcrypt.compare(
					credentials.password,
					user.password
				);
				if (!valid) return null;
				return { id: user.id, email: user.email, name: user.name };
			},
		}),
	],
	session: {
		strategy: "jwt" as const,
	},
	pages: {
		signIn: "/main/signin",
	},
};

const handler = NextAuth(authOptions);

// Export authOptions for server-side usage only (not as a route export)
export type AuthOptionsType = typeof authOptions;

export { handler as GET, handler as POST };
