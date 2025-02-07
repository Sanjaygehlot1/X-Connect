import {z} from 'zod'

const AcceptMessageValidation = z.object({
    Accept : z.boolean()
})

export {AcceptMessageValidation}