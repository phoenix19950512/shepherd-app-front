import { z } from 'zod';

export const FindTutorSchema = z.object({
  //   tutorType: z.string(),
  courseId: z
    .string({
      required_error: 'Subject is required'
    })
    .min(1, { message: 'Subject is required' }),
  topic: z
    .string({
      required_error: 'Topic is required'
    })
    .min(1, { message: 'Topic is required' }),
  description: z
    .string({
      required_error: 'Description is required'
    })
    .min(1, { message: 'Description is required' }),
  levelId: z
    .string({
      required_error: 'Level is required'
    })
    .min(1, { message: 'Level is required' }),
  reward: z
    .string({
      required_error: 'Price is required'
    })
    .min(1, { message: 'Price is required' }),
  type: z
    .string({
      required_error: 'Instruction mode is required'
    })
    .min(1, { message: 'Instruction mode is required' }),
  time: z
    .string({
      required_error: 'Time is required'
    })
    .min(1, { message: 'Time is required' }),
  expiryDate: z
    .date({
      required_error: 'Expiration date is required'
    })
    .min(new Date(), { message: 'Expiration date must be in the future' }),
  subject: z.optional(z.string())
});

export type FindTutorSchemaType = z.infer<typeof FindTutorSchema>;
