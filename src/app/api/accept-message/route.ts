import UserModel from "@/Models/user.model";
import DBConnect from "@/lib/DBConnection";
import { getServerSession, User } from "next-auth";
import { AuthOptions } from "../auth/[...nextauth]/options";


export async function PATCH() {
    DBConnect()
    const session = await getServerSession(AuthOptions)
    const user : User = session?.user as User
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        console.log(user?.isAcceptingMessage)
        const LoggedInUser = await UserModel.findById(user?._id)
        const Existinguser = await UserModel.findByIdAndUpdate(user?._id,
            {
                isAcceptingMessage: !LoggedInUser?.isAcceptingMessage
            },
            {
                new: true
            })
        if(!Existinguser){
            return Response.json(
                { success: false, message: "User not found" },
                { status: 404 }
            ); 
        }

        return Response.json(
            { success: true, message: 'Message preference toggled',
                isAcceptingMessage : Existinguser.isAcceptingMessage
             },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error toggling message preference:', error);
        return Response.json(
            {
                success: false,
                message: 'Failed toggling message preference',
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    DBConnect()
    const session = await getServerSession(AuthOptions)
    const user : User = session?.user as User
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    try {
        const Existinguser = await UserModel.findById(user?._id)
        if(!Existinguser){
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404}
            );
        }

        return Response.json(
            {
                success: true,
                message: 'Message preference fetched',
                isAcceptingMessage: Existinguser.isAcceptingMessage
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching message preference:', error);
        return Response.json(
            {
                success: false,
                message: 'Failed fetching message preference',
            },
            { status: 500 }
        );
    }
    
}