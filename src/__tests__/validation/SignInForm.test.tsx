import { z } from "zod";
import "@testing-library/jest-dom";
import { expect } from "@jest/globals";

// Import the schema from the form file
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

describe("SignInForm Validation", () => {
  describe("Email validation", () => {
    test("should accept valid email addresses", () => {
      const validEmails = ["test@example.com", "user.name@domain.co.uk", "user+tag@example.org", "firstname.lastname@example.com", "email@subdomain.domain.com", "123456@domain.com", "email@domain-with-hyphen.com", "email@domain.name"];

      validEmails.forEach((email) => {
        const result = signInSchema.safeParse({ email, password: "password123" });
        expect(result.success).toBe(true);
      });
    });

    test("should reject invalid email addresses", () => {
      const invalidEmails = ["", "plaintext", "@domain.com", "user@", "user@.com", "user@domain.", "user@domain..com", "user..name@domain.com", "user name@domain.com", "user@domain com"];

      invalidEmails.forEach((email) => {
        const result = signInSchema.safeParse({ email, password: "password123" });
        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error.issues[0].path).toContain("email");
        }
      });
    });
  });

  describe("Password validation", () => {
    test("should accept valid passwords", () => {
      const validPasswords = ["a", "password", "123456", "P@ssw0rd"];

      validPasswords.forEach((password) => {
        const result = signInSchema.safeParse({ email: "test@example.com", password });
        expect(result.success).toBe(true);
      });
    });

    test("should reject empty passwords", () => {
      const result = signInSchema.safeParse({ email: "test@example.com", password: "" });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("password");
        expect(result.error.issues[0].message).toBe("Password is required");
      }
    });
  });

  describe("Form validation", () => {
    test("should accept valid form data", () => {
      const validForm = {
        email: "test@example.com",
        password: "password123",
      };

      const result = signInSchema.safeParse(validForm);
      expect(result.success).toBe(true);
    });

    test("should reject form with missing fields", () => {
      const incompleteForm = {
        email: "test@example.com",
      };

      const result = signInSchema.safeParse(incompleteForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("password");
      }
    });

    test("should reject form with invalid email and valid password", () => {
      const invalidForm = {
        email: "invalid-email",
        password: "password123",
      };

      const result = signInSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("email");
      }
    });

    test("should reject form with valid email and invalid password", () => {
      const invalidForm = {
        email: "test@example.com",
        password: "",
      };

      const result = signInSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("password");
      }
    });
  });
});
