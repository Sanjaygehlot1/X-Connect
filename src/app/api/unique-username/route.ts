'use server'
import { z } from 'zod';
import UserModel from '@/Models/user.model';
import DBConnect from '@/lib/DBConnection';

const UsernameSchemaValidation = z.object({
    username: z
        .string()
        .min(3, 'username must be at least 3 characters')
        .max(20, 'username must be no more than 20 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'username must not contain special characters')
})

export async function GET(request: Request) {
    DBConnect()
    try {

        const { searchParams } = new URL(request.url)

        const UsernameQuery = {
            username: searchParams.get("username")
        }

        const result = UsernameSchemaValidation.safeParse(UsernameQuery)

        if (!result.success) {
            const UsernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: UsernameErrors?.length > 0
                    ? UsernameErrors.join(', ')
                    : 'Invalid query parameters',
            })
        }
        const { username } = result.data

        const existingUser = await UserModel.findOne({ username, isVerified: true })

        if (existingUser) {
            return Response.json({
                success: false,
                message: "user already exists with this username"
            })
        }
        return Response.json(
            {
                success: true,
                message: 'username is available',
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error checking username:', error);
        return Response.json(
            {
                success: false,
                message: 'Error checking username',
            },
            { status: 500 }
        );
    }
}