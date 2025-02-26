import { SendEmail } from "@/helpers/SendVerificationCode"
import DBConnect from "@/lib/DBConnection"
import UserModel from "@/Models/user.model"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
await DBConnect()
    try {
        const { username, email, password } = await req.json()

        const ExistingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (ExistingUserByUsername) {
            return Response.json({
                success: false,
                message: "username already taken. please use a different one."
            })
        }
        const ExistingUserByEmail = await UserModel.findOne({ email })
        let hashedPass = await bcrypt.hash(password, 10)
        let verifyCode = Math.floor(1000 + Math.random() * 9000).toString();

        if (ExistingUserByEmail) {


            if (ExistingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "user already exists with this email."
                })
            }
            ExistingUserByEmail.password = hashedPass
            ExistingUserByEmail.verifyCode = verifyCode
            ExistingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
            await ExistingUserByEmail.save()


        } else {
            const ExpiryDate = new Date()
            ExpiryDate.setHours(ExpiryDate.getHours() + 1)

            const NewUser = new UserModel({
                email,
                username,
                password: hashedPass,
                verifyCode,
                verifyCodeExpiry: ExpiryDate
            })

            await NewUser.save()
        }

        const sendEmail = await SendEmail(email, username, verifyCode)
            if (!sendEmail.success) {
                return Response.json({
                    success: false,
                    message: sendEmail.message
                },
                    {
                        status: 500
                    })
            }
            return Response.json({
                success: true,
                message: sendEmail.message
            },
                {
                    status: 200
                }
            )
    } catch (error) {
        console.log("Error Registering user::",error)
        return Response.json(
            {
              success: false,
              message: 'Error registering user',
            },
            { status: 500 }
          );
    }


}