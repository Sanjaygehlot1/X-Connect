import UserModel from "@/Models/user.model";
import DBConnect from "@/lib/DBConnection";
import { getServerSession, User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";


export async function POST(request: Request) {
    DBConnect()
    const session = await getServerSession(AuthOptions)
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const userId = new mongoose.Types.ObjectId(user?._id)

        const existingUser = await UserModel.findById(user?._id)
        if(!existingUser){
            return Response.json(
                {
                    success: false,
                    message: 'User not found',
                },
                { status: 404 }
            );
        }

        const userMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: existingUser._id
                }
            },
            {
                $unwind: {
                    path: "$messages"
                }
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    },

                }
            }
        ])

        if(!userMessages || userMessages.length === 0){
            return Response.json(
                {
                    success: false,
                    message: 'No messages found',
                },
                { status: 500 }
            );
        }
        const allMessages = userMessages[0]?.messages
        return Response.json(
            {
                success: true,
                messages: allMessages,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching user messages:', error);
        return Response.json(
            {
                success: false,
                message: 'Failed fetching user messages',
            },
            { status: 500 }
        );
    }
}