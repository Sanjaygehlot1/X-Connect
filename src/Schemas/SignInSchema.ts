import {z} from "zod"

const SignInSchemaValidation = z.object({
    credentials : z.string(),
    password : z.string()


})

export {SignInSchemaValidation}