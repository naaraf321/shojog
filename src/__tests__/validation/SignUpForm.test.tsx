import { z } from "zod";
import "@testing-library/jest-dom";
import { expect } from "@jest/globals";

// Import the schema from the form file
const signUpSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }).regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" }).regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" }).regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

describe("SignUpForm Validation", () => {
  describe("Email validation", () => {
    test("should accept valid email addresses", () => {
      const validEmails = ["test@example.com", "user.name@domain.co.uk", "user+tag@example.org", "firstname.lastname@example.com"];

      validEmails.forEach((email) => {
        const result = signUpSchema.safeParse({
          email,
          password: "Password123",
          confirmPassword: "Password123",
        });
        expect(result.success).toBeTruthy();
      });
    });

    test("should reject invalid email addresses", () => {
      const invalidEmails = ["", "plaintext", "@domain.com", "user@", "user@.com"];

      invalidEmails.forEach((email) => {
        const result = signUpSchema.safeParse({
          email,
          password: "Password123",
          confirmPassword: "Password123",
        });
        expect(result.success).toBeFalsy();
        if (!result.success) {
          expect(result.error.issues[0].path).toContain("email");
        }
      });
    });
  });

  describe("Password validation", () => {
    test("should accept valid passwords", () => {
      const validPasswords = ["Password123", "Abcdefg1", "SecureP@ss1", "ValidP4ssword"];

      validPasswords.forEach((password) => {
        const result = signUpSchema.safeParse({
          email: "test@example.com",
          password,
          confirmPassword: password,
        });
        expect(result.success).toBeTruthy();
      });
    });

    test("should reject passwords that are too short", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        password: "Pass1",
        confirmPassword: "Pass1",
      });
      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues.find((issue) => issue.path.includes("password") && issue.message.includes("at least 8 characters"));
        expect(issue).toBeTruthy();
      }
    });

    test("should reject passwords without uppercase letters", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues.find((issue) => issue.path.includes("password") && issue.message.includes("uppercase letter"));
        expect(issue).toBeTruthy();
      }
    });

    test("should reject passwords without lowercase letters", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        password: "PASSWORD123",
        confirmPassword: "PASSWORD123",
      });
      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues.find((issue) => issue.path.includes("password") && issue.message.includes("lowercase letter"));
        expect(issue).toBeTruthy();
      }
    });

    test("should reject passwords without numbers", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        password: "PasswordNoNumbers",
        confirmPassword: "PasswordNoNumbers",
      });
      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues.find((issue) => issue.path.includes("password") && issue.message.includes("number"));
        expect(issue).toBeTruthy();
      }
    });
  });

  describe("Password confirmation validation", () => {
    test("should reject when passwords don't match", () => {
      const result = signUpSchema.safeParse({
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "DifferentPassword123",
      });
      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues.find((issue) => issue.path.includes("confirmPassword") && issue.message.includes("do not match"));
        expect(issue).toBeTruthy();
      }
    });
  });

  describe("Form validation", () => {
    test("should accept valid form data", () => {
      const validForm = {
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "Password123",
      };

      const result = signUpSchema.safeParse(validForm);
      expect(result.success).toBeTruthy();
    });

    test("should reject form with missing fields", () => {
      const incompleteForm = {
        email: "test@example.com",
        password: "Password123",
      };

      const result = signUpSchema.safeParse(incompleteForm);
      expect(result.success).toBeFalsy();
    });
  });
});
