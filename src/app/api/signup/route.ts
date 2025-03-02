import DBConnect from "@/lib/DBConnection"
import UserModel from "@/Models/user.model"
import axios from "axios"
import bcrypt from "bcryptjs"


export async function POST(req: Request) {
await DBConnect()
    try {
        const { username, email, password } = await req.json()

        const ExistingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (ExistingVerifiedUserByUsername) {
            return Response.json({
                success: false,
                message: "username already taken. please use a different one."
            })
        }

        const ExistingUserByEmail = await UserModel.findOne({ email })
        const hashedPass = await bcrypt.hash(password, 10)
        const verifyCode = Math.floor(1000 + Math.random() * 9000).toString();

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
            ExistingUserByEmail.username = username
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

        const emailSubject = "X Connect | Verification Code"
        const text = `Your verification code to verify your email is: ${verifyCode}`

        const sendEmail = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/send-email`,{to:email, subject : emailSubject , text })

        if(sendEmail.data.success){
           return Response.json({
            success: true,
            message: sendEmail.data.message,
          },
          { status: 201 })
        }else{
            return Response.json({
                success: false,
                message: sendEmail.data.message,
              },
              { status: 500 })
        }
        
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