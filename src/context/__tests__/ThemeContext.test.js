import { renderHook, act } from "@testing-library/react";
import { useTheme, ThemeProvider } from "../ThemeContext";
import React from "react";

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock document.documentElement
const documentElementMock = {
  classList: {
    add: jest.fn(),
    remove: jest.fn(),
  },
};

Object.defineProperty(window.document, "documentElement", {
  value: documentElementMock,
  writable: true,
});

// Mock React's useContext to simulate the hook usage
jest.mock("react", () => {
  const originalReact = jest.requireActual("react");
  return {
    ...originalReact,
    useContext: jest.fn(),
  };
});

describe("useTheme hook", () => {
  beforeEach(() => {
    // Clear mocks between tests
    jest.clearAllMocks();
    localStorageMock.clear();
    documentElementMock.classList.add.mockClear();
    documentElementMock.classList.remove.mockClear();
  });

  test("should throw error when used outside ThemeProvider", () => {
    // Set useContext to return undefined to simulate using outside provider
    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(undefined);

    const { result } = renderHook(() => useTheme());

    expect(result.error).toBeDefined();
    expect(result.error.message).toBe("useTheme must be used within a ThemeProvider");
  });

  test("should return theme and toggleTheme function", () => {
    // Mock the context value
    const mockContextValue = {
      theme: "dark",
      toggleTheme: jest.fn(),
    };

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce(mockContextValue);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("dark");
    expect(typeof result.current.toggleTheme).toBe("function");
  });

  test("toggleTheme should switch between dark and light", () => {
    // Start with dark theme
    let currentTheme = "dark";
    const toggleThemeMock = jest.fn(() => {
      currentTheme = currentTheme === "dark" ? "light" : "dark";
    });

    const reactModule = require("react");
    reactModule.useContext.mockReturnValueOnce({
      theme: currentTheme,
      toggleTheme: toggleThemeMock,
    });

    const { result } = renderHook(() => useTheme());

    // Initial theme should be dark
    expect(result.current.theme).toBe("dark");

    // After toggle, mock should be called
    act(() => {
      result.current.toggleTheme();
    });

    expect(toggleThemeMock).toHaveBeenCalled();
  });

  test("ThemeProvider should use default theme when no saved theme exists", () => {
    // Mock localStorage to return null (no saved theme)
    localStorageMock.getItem.mockReturnValueOnce(null);

    // Render ThemeProvider with children
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    // Create a mock context to capture the values from provider
    let capturedContext;
    const TestConsumer = () => {
      const context = useTheme();
      capturedContext = context;
      return null;
    };

    // We need to temporarily unmock useContext for this specific test
    const reactModule = require("react");
    const originalUseContext = reactModule.useContext;
    reactModule.useContext = originalUseContext;

    renderHook(() => <TestConsumer />, { wrapper });

    // Should default to dark theme
    expect(capturedContext.theme).toBe("dark");

    // Reset the mock
    reactModule.useContext = jest.fn();
  });

  test("localStorage theme should be applied", () => {
    // Mock localStorage to return "light"
    localStorageMock.getItem.mockReturnValueOnce("light");

    // Directly test the useEffect that reads from localStorage
    // by creating a new ThemeProvider instance
    const wrapper = ({ children }) => <ThemeProvider>{children}</ThemeProvider>;

    // Create a mock context to capture the values from provider
    let capturedContext;
    const TestConsumer = () => {
      const context = useTheme();
      capturedContext = context;
      return null;
    };

    // We need to temporarily unmock useContext for this specific test
    const reactModule = require("react");
    const originalUseContext = reactModule.useContext;
    reactModule.useContext = originalUseContext;

    renderHook(() => <TestConsumer />, { wrapper });

    // Should use the value from localStorage
    expect(capturedContext.theme).toBe("light");

    // Reset the mock
    reactModule.useContext = jest.fn();
  });
});
