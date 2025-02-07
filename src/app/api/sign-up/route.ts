import bcrypt from 'bcryptjs'
import { DBConnect } from '@/lib/DBConnection'
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import UserModel from '@/models/User'
import { ApiResponse } from '@/types/ApiResponse'
export async function POST(request: Request) {
    await DBConnect()
    try {
        const { username, email, password } = await request.json()

        const ExistingUser = await UserModel.findOne(
            {
                username: username,
                isVerified: true
            }
        )
        if (ExistingUser) {
            return Response.json({
                success: false,
                message: "Username not available. please select other username."
            },
        {
            status: 400
        })
        }

        const ExistingUserwithEmail = await UserModel.findOne({ email })

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        if (ExistingUserwithEmail) {
            if (ExistingUserwithEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "Email already exist"
                },{
                    status: 500
                })
            } else {
                const hashedpassword = await bcrypt.hash(password, 10)
                ExistingUserwithEmail.password = hashedpassword,
                    ExistingUserwithEmail.verifyCode = verifyCode,
                    ExistingUserwithEmail.verifyCodeExpiry = expiryDate

                await ExistingUserwithEmail.save()
            }
        } else {
            const hashedpassword = await bcrypt.hash(password, 10)

         const NewUser =  new UserModel({
                username,
                email,
                password: hashedpassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                acceptMessage: true,
                messages: []
            })

            NewUser.save()
        }

        const EmailVerification = sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!(await EmailVerification).success){
            return Response.json({
                success : false,
                message : (await EmailVerification).message
            },
        {
            status: 500
        })
        }

        return Response.json({
            success: true,
            message : "User Registered Successfully . Please check you email inbox for verification."
        },
    {
        status: 200
    })  


    } catch (error) {
        console.log("Error Registering user", error)
        return Response.json({
            success: false,
            message: "Error Registering user"
        },
    {
        status: 500
    })
    }
}

