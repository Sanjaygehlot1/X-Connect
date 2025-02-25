import { Message } from "@/Models/message.model"

export interface ApiResponse {
    success : boolean,
    message : string,
    isAcceptingMessage? : boolean,
    messages? : Array<Message> 
}