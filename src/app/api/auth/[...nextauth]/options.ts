import { NextAuthOptions } from "next-auth"; 8
import Credentials from "next-auth/providers/credentials";
import UserModel from "@/Models/user.model";
import DBConnect from "@/lib/DBConnection";
import bcrypt from "bcryptjs";

export const AuthOptions: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "example@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials: any): Promise<any> {
                DBConnect()
                try {
                    const user = await UserModel.findOne({
                        email: credentials.email
                    })
                    if (!user) {
                        throw new Error("No user found")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your email to continue.")
                    }
                    const isPassCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (!isPassCorrect) {
                        throw new Error("Incorrect Password")
                    }
                    return user
                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],

    pages: {
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,

    callbacks: {
        async session({ session, token }) {
            if(token){
                session.user._id = (token as any)._id.toString()
                session.user.isAcceptingMessage = (token as any).isAcceptingMessage
                session.user.isVerified = (token as any).isVerified.toString()
                session.user.username = (token as any).username.toString()
            }
            return session
        },
        async jwt({ token, user }) {

            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
                token.username = user.username
            }
            return token
        }
    }
}