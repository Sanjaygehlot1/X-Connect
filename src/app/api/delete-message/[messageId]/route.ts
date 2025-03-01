'use server'
import UserModel from "@/Models/user.model";
import DBConnect from "@/lib/DBConnection";
import { getServerSession } from "next-auth";
import { AuthOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
export async function DELETE(request: Request, {params} : {params: {messageId: string}}) {

    DBConnect()
    const  messageId  =  params?.messageId
    const session = await getServerSession(AuthOptions)
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    
    
    try {
        const response = await UserModel.updateOne(
            {
                _id: user._id
            },
            {
                $pull: { messages: { _id: messageId } }
            }
        )

        if (response.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Message not found"
            },
                {
                    status: 500
                })
        }

        return Response.json({
            success: true,
            message: "Message deleted successfully"
        },
            {
                status: 201
            })

    } catch (error) {
        console.log(error)
        return Response.json(
            {
                success: false,
                message: 'Failed deleting message',
            },
            { status: 500 }
        );
    }

}