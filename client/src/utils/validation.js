import { z } from 'zod';

const USERNAME_REGEX = /^[a-zA-Z0-9]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 15;
const MIN_NAME_LENGTH = 1;
const MAX_NAME_LENGTH = 50;

const emailSchema = z
  .string({ required_error: 'Email is required' })
  .trim()
  .toLowerCase()
  .email({ message: 'Invalid email address' })
  .max(255, { message: 'Email must be less than 255 characters' });

const usernameSchema = z
  .string({ required_error: 'Username is required' })
  .trim()
  .min(MIN_USERNAME_LENGTH, { message: `Username must be at least ${MIN_USERNAME_LENGTH} characters long` })
  .max(MAX_USERNAME_LENGTH, { message: `Username must be less than ${MAX_USERNAME_LENGTH} characters` })
  .regex(USERNAME_REGEX, { message: 'Username must contain only letters and numbers' });

const passwordSchema = z
  .string({ required_error: 'Password is required' })
  .min(MIN_PASSWORD_LENGTH, { message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long` })
  .max(128, { message: 'Password must be less than 128 characters' })
  .regex(PASSWORD_REGEX, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
  });

const nameSchema = z
  .string({ required_error: 'Name is required' })
  .trim()
  .min(MIN_NAME_LENGTH, { message: 'Name is required' })
  .max(MAX_NAME_LENGTH, { message: `Name must be less than ${MAX_NAME_LENGTH} characters` });

const identifierSchema = z
  .string({ required_error: 'Email or username is required' })
  .trim()
  .min(1, { message: 'Email or username is required' });

export const loginSchema = z.object({
  identifier: identifierSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, { message: 'Password is required' }),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: z.string({ required_error: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

