import { cn } from "../utils";
import "@testing-library/jest-dom";

// Properly set up mocks for URL
global.URL.createObjectURL = jest.fn(() => "mocked-url");

// Don't replace document.body, just mock its methods
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();

// Mock window.print
window.print = jest.fn();

describe("cn function", () => {
  test("combines class names correctly", () => {
    expect(cn("text-red-500", "bg-blue-200")).toBe("text-red-500 bg-blue-200");
    expect(cn("px-4 py-2", { "text-center": true, "font-bold": false })).toBe("px-4 py-2 text-center");
    expect(cn("base-class", null, undefined, "valid-class", false && "invisible-class")).toBe("base-class valid-class");
  });

  test("merges tailwind classes appropriately", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm text-gray-500", "text-lg")).toBe("text-gray-500 text-lg");
    expect(cn("rounded-md", "rounded-lg")).toBe("rounded-lg");
  });
});
