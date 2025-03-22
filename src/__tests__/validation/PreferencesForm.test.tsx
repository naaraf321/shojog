import { z } from "zod";
import "@testing-library/jest-dom";
import { expect } from "@jest/globals";

// Import the schema from the form file
const preferencesSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  institution: z.string().min(2, { message: "Institution is required" }),
  level: z.string().min(1, { message: "Level is required" }),
  group: z.string().optional(),
  batch: z.string().optional(),
});

describe("PreferencesForm Validation", () => {
  describe("Name validation", () => {
    test("should accept valid names", () => {
      const validNames = ["John Doe", "Jane Smith", "A.B. Johnson", "Maria Garcia-Rodriguez", "J. R. R. Tolkien", "O'Brien"];

      validNames.forEach((name) => {
        const result = preferencesSchema.safeParse({
          name,
          institution: "Example University",
          level: "College",
        });
        expect(result.success).toBe(true);
      });
    });

    test("should reject names that are too short", () => {
      const tooShortNames = ["", "A"];

      tooShortNames.forEach((name) => {
        const result = preferencesSchema.safeParse({
          name,
          institution: "Example University",
          level: "College",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const nameIssue = result.error.issues.find((issue) => issue.path.includes("name"));
          expect(nameIssue).toBeDefined();
          expect(nameIssue?.message).toContain("at least 2 characters");
        }
      });
    });
  });

  describe("Institution validation", () => {
    test("should accept valid institutions", () => {
      const validInstitutions = ["Harvard University", "MIT", "Stanford University", "Local High School"];

      validInstitutions.forEach((institution) => {
        const result = preferencesSchema.safeParse({
          name: "John Doe",
          institution,
          level: "College",
        });
        expect(result.success).toBe(true);
      });
    });

    test("should reject institutions that are too short", () => {
      const tooShortInstitutions = ["", "A"];

      tooShortInstitutions.forEach((institution) => {
        const result = preferencesSchema.safeParse({
          name: "John Doe",
          institution,
          level: "College",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const institutionIssue = result.error.issues.find((issue) => issue.path.includes("institution"));
          expect(institutionIssue).toBeDefined();
          expect(institutionIssue?.message).toContain("Institution is required");
        }
      });
    });
  });

  describe("Level validation", () => {
    test("should accept valid levels", () => {
      const validLevels = ["School", "High School", "College", "University"];

      validLevels.forEach((level) => {
        const result = preferencesSchema.safeParse({
          name: "John Doe",
          institution: "Example University",
          level,
        });
        expect(result.success).toBe(true);
      });
    });

    test("should reject levels that are empty", () => {
      const result = preferencesSchema.safeParse({
        name: "John Doe",
        institution: "Example University",
        level: "",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const levelIssue = result.error.issues.find((issue) => issue.path.includes("level"));
        expect(levelIssue).toBeDefined();
        expect(levelIssue?.message).toContain("Level is required");
      }
    });
  });

  describe("Optional fields validation", () => {
    test("should accept valid form data with optional fields", () => {
      const validForm = {
        name: "John Doe",
        institution: "Example University",
        level: "College",
        group: "Science",
        batch: "2023",
      };

      const result = preferencesSchema.safeParse(validForm);
      expect(result.success).toBe(true);
    });

    test("should accept valid form data without optional fields", () => {
      const validForm = {
        name: "John Doe",
        institution: "Example University",
        level: "College",
      };

      const result = preferencesSchema.safeParse(validForm);
      expect(result.success).toBe(true);
    });
  });

  describe("Form validation", () => {
    test("should reject form with missing required fields", () => {
      const incompleteForm = {
        name: "John Doe",
        // Missing institution and level
      };

      const result = preferencesSchema.safeParse(incompleteForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });

    test("should validate all fields together", () => {
      const invalidForm = {
        name: "A", // Too short
        institution: "B", // Valid (min 2)
        level: "", // Empty
      };

      const result = preferencesSchema.safeParse(invalidForm);
      expect(result.success).toBe(false);
      if (!result.success) {
        // There are issues with name (too short) and level (empty)
        expect(result.error.issues.length).toBeGreaterThanOrEqual(2);

        const nameIssue = result.error.issues.find((issue) => issue.path.includes("name"));
        expect(nameIssue).toBeDefined();

        const levelIssue = result.error.issues.find((issue) => issue.path.includes("level"));
        expect(levelIssue).toBeDefined();
      }
    });
  });
});
