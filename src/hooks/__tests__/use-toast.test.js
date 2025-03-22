import { renderHook, act } from "@testing-library/react";
import { useToast, toast, reducer } from "../use-toast";

// Mock setTimeout and clearTimeout for testing toast timeouts
jest.useFakeTimers();

describe("useToast hook", () => {
  beforeEach(() => {
    // Clean up any lingering state between tests
    act(() => {
      const { result } = renderHook(() => useToast());
      result.current.dismiss();
    });
  });

  test("should return toast function and empty toasts array initially", () => {
    const { result } = renderHook(() => useToast());

    expect(result.current.toast).toBeDefined();
    expect(typeof result.current.toast).toBe("function");
    expect(result.current.toasts).toEqual([]);
    expect(result.current.dismiss).toBeDefined();
    expect(typeof result.current.dismiss).toBe("function");
  });

  test("should add a toast when toast function is called", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Test Toast", description: "This is a test" });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe("Test Toast");
    expect(result.current.toasts[0].description).toBe("This is a test");
    expect(result.current.toasts[0].open).toBe(true);
  });

  test("should dismiss a toast when dismiss function is called with id", () => {
    const { result } = renderHook(() => useToast());

    let toastId;
    act(() => {
      const { id } = result.current.toast({ title: "Test Toast" });
      toastId = id;
    });

    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  test("should dismiss all toasts when dismiss is called without id", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Toast 1" });
      result.current.toast({ title: "Toast 2" });
    });

    expect(result.current.toasts.length).toBe(1); // Due to TOAST_LIMIT being 1

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  test("should update a toast when update function is called", () => {
    const { result } = renderHook(() => useToast());

    let toastRef;
    act(() => {
      toastRef = result.current.toast({ title: "Original Title" });
    });

    expect(result.current.toasts[0].title).toBe("Original Title");

    act(() => {
      toastRef.update({ title: "Updated Title" });
    });

    expect(result.current.toasts[0].title).toBe("Updated Title");
  });
});

describe("reducer function", () => {
  test("should handle ADD_TOAST action", () => {
    const initialState = { toasts: [] };
    const newToast = { id: "1", title: "New Toast", open: true };
    const action = { type: "ADD_TOAST", toast: newToast };

    const newState = reducer(initialState, action);

    expect(newState.toasts).toContainEqual(newToast);
    expect(newState.toasts.length).toBe(1);
  });

  test("should handle UPDATE_TOAST action", () => {
    const initialState = {
      toasts: [{ id: "1", title: "Original Toast", description: "Description", open: true }],
    };
    const updatedToast = { id: "1", title: "Updated Toast" };
    const action = { type: "UPDATE_TOAST", toast: updatedToast };

    const newState = reducer(initialState, action);

    expect(newState.toasts[0].title).toBe("Updated Toast");
    expect(newState.toasts[0].description).toBe("Description"); // Unchanged properties remain
  });

  test("should handle DISMISS_TOAST action with specific id", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1", open: true },
        { id: "2", title: "Toast 2", open: true },
      ],
    };
    const action = { type: "DISMISS_TOAST", toastId: "1" };

    const newState = reducer(initialState, action);

    expect(newState.toasts[0].open).toBe(false); // First toast closed
    expect(newState.toasts[1].open).toBe(true); // Second toast still open
  });

  test("should handle DISMISS_TOAST action without id (dismiss all)", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1", open: true },
        { id: "2", title: "Toast 2", open: true },
      ],
    };
    const action = { type: "DISMISS_TOAST" };

    const newState = reducer(initialState, action);

    expect(newState.toasts[0].open).toBe(false);
    expect(newState.toasts[1].open).toBe(false);
  });

  test("should handle REMOVE_TOAST action with specific id", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1" },
        { id: "2", title: "Toast 2" },
      ],
    };
    const action = { type: "REMOVE_TOAST", toastId: "1" };

    const newState = reducer(initialState, action);

    expect(newState.toasts.length).toBe(1);
    expect(newState.toasts[0].id).toBe("2");
  });

  test("should handle REMOVE_TOAST action without id (remove all)", () => {
    const initialState = {
      toasts: [
        { id: "1", title: "Toast 1" },
        { id: "2", title: "Toast 2" },
      ],
    };
    const action = { type: "REMOVE_TOAST" };

    const newState = reducer(initialState, action);

    expect(newState.toasts.length).toBe(0);
  });
});
