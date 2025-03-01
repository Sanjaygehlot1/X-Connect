import { z } from 'zod'

export const AcceptMessageSchema = z.object({
  messagePreference: z.boolean(),
});