import UserModel from "@/Models/user.model";
import DBConnect from "@/lib/DBConnection";
import { verifySchema } from "@/Schemas/VerifySchema";

const CodeValidation = verifySchema

export async function POST(request :Request){
    DBConnect()
    try {
        const {username , code} = await request.json()
        const decodedUsername = decodeURIComponent(username);
        const schemaVerified = CodeValidation.safeParse({code})

        if(!schemaVerified.success){
            const CodeError = schemaVerified.error.format().code?._errors || []
            return Response.json({
                success: false,
                message: CodeError?.length > 0
                    ? CodeError.join(', ')
                    : 'Invalid query parameters',
            })
        }

        const user = await UserModel.findOne({username: decodedUsername})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found"
            })
        }

        const isCodeVerified = user.verifyCode === code
        const CodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeVerified && CodeNotExpired){

            user.isVerified = true
            await user.save()

            return Response.json({
                success: true,
                message: "Account verification completed"
            })
        }else if(!isCodeVerified){
            return Response.json({
                success: false,
                message: "Incorrect verification code"
            })
        }else{
            return Response.json({
                success: false,
                message: "Verification code expired. please signup again to get a new code"
            })
        }
    } catch (error) {
        console.error('Error verifying account:', error);
        return Response.json(
            {
                success: false,
                message: 'Error verifying account',
            },
            { status: 500 }
        );
    }
}