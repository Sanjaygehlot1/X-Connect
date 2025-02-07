import VerificationEmail from "../../email/VerificationEmail";
import {resend} from '@/lib/resend'
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'X-Connect Email Verification',
            react: VerificationEmail({username , otp: verifyCode}),
          });

          return {
            success : true,
            message: "Verification Email sent Successfully"
          }
    } catch (error) {
        console.log("Failed sending verfication email",error)
        return {
            success: false,
            message: "Failed sending verfication email"
        }
    }
}
