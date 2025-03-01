import { ApiResponse } from "@/lib/utils/ApiResponse";
import { resend } from "@/lib/resend";
import EmailTemplate from "../../email/EmailTemplate";
export const SendEmail = async (
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> => {
    try {
        console.log(resend.key)
        console.log("Sending email to:", email, "with OTP:", verifyCode);
        const emailResponse = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email.trim(),
            subject: 'X-Connect | Verification Code',
            react: EmailTemplate({ username, otp: verifyCode }),
        });

        console.log("Resend API response:", emailResponse);

        return { success: true, message: "Verification email sent successfully" };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, message: "Failed to send verification email" };
    }
};
