import { atom } from "jotai";

// Track window state - each key is a window ID, value is the window state
export type WindowState = "active" | "minimized" | "closed";
export const windowStatesAtom = atom<Record<string, WindowState>>({
  finder: "active"
});

// Track window z-index order (front to back)
export const activeWindowsAtom = atom<string[]>(["finder"]);

// Helper functions for window management
export const windowUtils = {
  // Helper to activate a window and bring it to front
  activateWindow: (
    id: string,
    windowStates: Record<string, WindowState>,
    activeWindows: string[],
  ) => {
    // Ensure window is active
    const newWindowStates = {
      ...windowStates,
      [id]: "active",
    };

    // Update active windows (remove if exists, then add to front)
    const filteredWindows = activeWindows.filter((windowId) => windowId !== id);
    const newActiveWindows = [id, ...filteredWindows];

    return { newWindowStates, newActiveWindows };
  },

  // Helper to minimize a window
  minimizeWindow: (
    id: string,
    windowStates: Record<string, WindowState>,
    activeWindows: string[],
  ) => {
    // Set window to minimized
    const newWindowStates = {
      ...windowStates,
      [id]: "minimized",
    };

    // Remove from active windows
    const newActiveWindows = activeWindows.filter(
      (windowId) => windowId !== id,
    );

    return { newWindowStates, newActiveWindows };
  },

  // Helper to close a window
  closeWindow: (
    id: string,
    windowStates: Record<string, WindowState>,
    activeWindows: string[],
  ) => {
    // Set window to closed
    const newWindowStates = {
      ...windowStates,
      [id]: "closed",
    };

    // Remove from active windows
    const newActiveWindows = activeWindows.filter(
      (windowId) => windowId !== id,
    );

    return { newWindowStates, newActiveWindows };
  },
};
