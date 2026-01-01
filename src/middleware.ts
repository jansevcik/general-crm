import NextAuth from "next-auth"
import { auth as middleware } from "@/auth"

export default middleware

export const config = {
    matcher: ['/dashboard/:path*'],
}
