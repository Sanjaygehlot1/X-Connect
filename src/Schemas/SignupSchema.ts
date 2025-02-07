import {z} from "zod"

const SignUpSchemaValidation = z.object({
    username : z
    .string()
    .min(3,"Username must be of atleast 3 characters")
    .max(20,"Username can be atmost 20 characters")
    .regex(/^[a-zA-Z0-9]+$/,"Username is Invalid"),

    password : z
    .string()
    .min(6,"Password should be of atleast 6 characters")
    .max(10,"Password can be atmost 10 characters"),

    email : z
    .string()
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Email is Invalid")
    .email({message: "Email is Invalid"})


})

export {SignUpSchemaValidation}