import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Global {
      document: Document;
      window: Window;
    }

    type Mock<T = any> = jest.Mock<T>;
  }

  // Add missing jest methods
  const jest: {
    fn: (implementation?: (...args: any[]) => any) => jest.Mock;
    mock: (moduleName: string, factory?: any) => void;
  };

  // Extend the expect interface with common matchers
  namespace jest {
    interface Matchers<R> {
      toBe(expected: any): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toContain(expected: string | any[] | Record<string, any>): R;
      toBeDefined(): R;
      toBeGreaterThan(expected: number): R;
    }
  }
}
