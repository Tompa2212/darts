// 'use server';

// import { getUserByEmail } from '@/data/user';
// import { loginSchema } from '@/schema/auth.schema';
// import * as z from 'zod';

// const DEFAULT_LOGIN_REDIRECT = '/play';

// export async function login(
//   values: z.infer<typeof loginSchema>,
//   callbackUrl?: string | null
// ) {
//   const validatedFields = loginSchema.safeParse(values);

//   if (!validatedFields.success) {
//     return {
//       error: 'Invalid Fields!'
//     };
//   }
//   const { email, password } = validatedFields.data;

//   const existingUser = getUserByEmail(email);

//   if (!existingUser) {
//     return { error: 'User does not exist!' };
//   }

//   try {
//     await signIn('credentials', {
//       email,
//       password,
//       redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
//     });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return { error: 'Invalid credentials!' };
//         default:
//           return { error: 'Something went wrong!' };
//       }
//     }

//     throw error;
//   }
// }
