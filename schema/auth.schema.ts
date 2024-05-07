import * as z from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(1, 'Password is required'),
  code: z.optional(z.string())
});

export const registerSchema = z.object({
  email: z.string().email({ message: 'Email is required' }),
  password: z.string().min(6, 'Minimum 6 characters required'),
  username: z
    .string()
    .min(1, 'Username is required')
    .max(32, 'Maximum 32 characters allowed')
});

export const resetSchema = z.object({
  email: z.string().email({ message: 'Email is required' })
});

export const newPasswordSchema = z.object({
  password: z.string().min(6, 'Minimum 6 characters required')
});
