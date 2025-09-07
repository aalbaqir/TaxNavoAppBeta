import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const serverAuthOptions: NextAuthOptions = {
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
				// Find user in DB
				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});
				if (!user) return null;
				// Compare password
				const valid = await bcrypt.compare(credentials.password, user.password);
				if (!valid) return null;
				return { id: user.id, email: user.email, name: user.name };
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/main/signin",
	},
};
