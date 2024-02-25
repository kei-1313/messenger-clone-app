import bcrypt from "bcrypt"
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "@/app/libs/prismadb"

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        //メールアドレスかパスワードがない場合
        if (!credentials?.email || !credentials?.password) {
          throw new Error('パスワードかメールアドレスが正しくありません');
        }

        //非同期処理でデータベースからメールアドレスにあうuserを取得
        const user = await prisma.user.findUnique({
          where:{
            email: credentials.email
          }
        })

        //ユーザがない場合、ユーザのパスワードがない場合
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        //ユーザが入力したパスワードをハッシュ化し、ハッシュ化されたデータベースに保存されているパスワードを正しいか判定
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        //パスワードが正しくないとき
        if (!isCorrectPassword) {
          throw new Error('パスワードが正しくありません');
        }

        return user;
      }
    })
  ],
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };