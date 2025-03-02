import mongoose, {Schema,Document} from "mongoose";
import { Message, MessageSchema } from "./message.model";

interface User extends Document{
    username : string;
    email : string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry : Date;
    isAcceptingMessage: boolean;
    isVerified: boolean;
    messages: Message[]
}

const UserSchema : Schema<User> = new  Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        trim : true,
        unique: true
    },
    email:{
        type: String,
        required: [true, "email is required"],
        match: [ /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        ,"Invalid Email Address"]
    },
    password:{
        type: String,
        required: [true, "password is required"],
    },
    verifyCode:{
        type: String,
        required: [true, "verify code is required"],
    },
    verifyCodeExpiry: {
        type: Date
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAcceptingMessage:{
        type: Boolean,
        default: true
    },
    messages:[MessageSchema]


})

const UserModel = (mongoose.models.User as mongoose.Model<User> ) || (mongoose.model<User>("User",UserSchema))

export default UserModel