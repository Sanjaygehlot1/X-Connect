import {z} from 'zod'


const VerifySchemaValidation = z.object({
    Code : z
    .string()
    .length(4,"Verification code must be of 4 characters")
    
})

export {VerifySchemaValidation}