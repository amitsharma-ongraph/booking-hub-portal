import { z } from 'zod';

/**
 * Common validation schemas using Zod
 * These can be reused across different forms
 */

// Phone number validation
// Only accepts Saudi numbers: exactly 9 digits (no + prefix, no country code)
// Country code +966 will be prepended automatically
export const phoneSchema = z
  .string()
  .min(1, 'Phone number must be filled')
  .refine(
    (val) => {
      // Only allow digits (no +, no spaces)
      return /^[0-9]*$/.test(val);
    },
    {
      message: 'Phone number can only contain numbers',
    }
  )
  .refine(
    (val) => {
      // Must be exactly 9 digits (Saudi format)
      const digits = val.replace(/\D/g, '');
      return digits.length === 9;
    },
    {
      message: 'Phone number must be exactly 9 digits',
    }
  );

// Email validation
export const emailSchema = z
  .string()
  .min(1, 'Email must be filled')
  .email('Invalid email format');

// Name validation
export const firstNameSchema = z
  .string()
  .min(1, 'First name must be filled')
  .max(20, 'First name must be under 20 characters')
  .trim();

export const lastNameSchema = z
  .string()
  .min(1, 'Last name must be filled')
  .max(50, 'Last name must be under 50 characters')
  .trim();

// OTP validation
export const otpSchema = z
  .string()
  .length(6, 'Please enter the complete 6-digit OTP code')
  .regex(/^\d{6}$/, 'OTP must contain only digits');

// Terms acceptance validation
export const termsSchema = z
  .boolean()
  .refine((val) => val === true, {
    message: 'You must check terms & conditions',
  });

/**
 * Form-specific schemas
 */

// Login form schema
export const loginSchema = z.object({
  phoneNumber: phoneSchema,
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register form schema
export const registerSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  email: emailSchema,
  phoneNumber: phoneSchema,
  termsAccepted: termsSchema,
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// OTP method selection schema
export const otpMethodSchema = z
  .object({
    method: z.enum(['email', 'sms']),
    email: z.string().optional(),
    phoneNumber: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      if (!data.email || data.email.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid email address',
          path: ['email'],
        });
      } else {
        const emailResult = emailSchema.safeParse(data.email);
        if (!emailResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: emailResult.error.issues[0]?.message || 'Invalid email format',
            path: ['email'],
          });
        }
      }
    } else {
      if (!data.phoneNumber || data.phoneNumber.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please enter a valid phone number',
          path: ['phoneNumber'],
        });
      } else {
        const phoneResult = phoneSchema.safeParse(data.phoneNumber);
        if (!phoneResult.success) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: phoneResult.error.issues[0]?.message || 'Invalid phone number',
            path: ['phoneNumber'],
          });
        }
      }
    }
  });

export type OtpMethodFormData = z.infer<typeof otpMethodSchema>;

// OTP verification schema
export const otpVerificationSchema = z.object({
  otp: otpSchema,
});

export type OtpVerificationFormData = z.infer<typeof otpVerificationSchema>;

