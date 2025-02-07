import {z} from 'zod'

const MessageSchemaValidation = z.object({
    content : z
    .string()
    .max(400, "Message Cannot be more than 400 characters")
    .min(3, "Message should be atleast 3 characters long")
})

export {MessageSchemaValidation}