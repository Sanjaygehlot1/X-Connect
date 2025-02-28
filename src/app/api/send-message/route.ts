import { Message } from "@/Models/message.model";
import UserModel from "@/Models/user.model";
import DBConnect from "@/lib/DBConnection";
export async function POST(request: Request) {
    DBConnect()
    try {
        const { username, content } = await request.json()

        const user = await UserModel.findOne({ username })

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    message: 'User is not accepting messages',
                    success: false
                },
                { status: 403 }
            );
        }

        user.messages.push({ content, createdAt: new Date() } as Message)
        await user.save()
        return Response.json(
            {
                message: 'Message sent successfully',
                success: true
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error sending message:', error);
        return Response.json(
            {
                message: 'Internal server error',
                success: false
            },
            { status: 500 }
        );
    }
}