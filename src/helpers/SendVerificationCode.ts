import { resend } from "@/lib/resend";
import EmailTemplate from "../../email/EmailTemplate";
import { ApiResponse } from "@/lib/utils/ApiResponse";

export const SendEmail = async (
    email : string,
    username : string,
    verifyCode : string
):Promise<ApiResponse> =>{
    try {
        await resend.emails.send({
            from: '<onboarding@resend.dev>',
            to: email,
            subject: 'X-Connect | Verification Code',
            react: EmailTemplate({ username, otp: verifyCode }),
          });
          return {success: true, message: "Verification email send successfully"} 
    } catch (error) {
        console.log(error)
            return {success: false, message: "Failed to send verification email"} 
    }
}