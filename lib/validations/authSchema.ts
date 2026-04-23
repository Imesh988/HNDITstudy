import { z } from "zod";

//register validation 
export const registerSchema = z.object({
  displayName: z
  .string()
  .min(2, "Display name must be at least 2 characters")
  .max(50, "Display name must be less than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Display name can only contain letters and spaces"),


  email: z
  .string()
  .email("Invalid email address")
  .min(5, "Email too short")
  .max(100, "Email too long"),

  password: z
  .string()
  .min(6, "Password must be at least 6 characters"),
  // .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  // .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  // .regex(/[0-9]/, "Password must contain at least one number")
  // .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});


//login validation 
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
