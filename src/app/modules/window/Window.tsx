"use client";

import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";

import { useAtom } from "jotai";
import { Rnd } from "react-rnd";

import { cn } from "@/lib/utils";
import {
  activeWindowsAtom,
  WindowState,
  windowStatesAtom,
  windowUtils,
} from "../atoms";

// Create a context for the Window component to share data with its children
type WindowContextType = {
  id: string;
  bringToFront: () => void;
  isMaximized: boolean;
  toggleMaximize: () => void;
  minimizeWindow: () => void;
  closeWindow: () => void;
};

const WindowContext = createContext<WindowContextType | null>(null);

// Custom hook to access the WindowContext
export function useWindowContext() {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error("Window components must be used within a Window");
  }
  return context;
}

// Titlebar component that uses the WindowContext
export function Titlebar({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const {
    bringToFront,
    isMaximized,
    toggleMaximize,
    minimizeWindow,
    closeWindow,
  } = useWindowContext();

  return (
    <div
      className={cn(
        "window-titlebar flex h-10 items-center px-3",
        isMaximized
          ? "rounded-none bg-black/10 dark:bg-white/10"
          : "rounded-t-xl bg-black/5 dark:bg-white/5",
        className,
      )}
      onClick={bringToFront}
    >
      <div className="mr-4 flex gap-2">
        <button
          className="h-3 w-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80"
          aria-label="Close"
          onClick={(e) => {
            e.stopPropagation();
            closeWindow();
          }}
        />
        <button
          className="h-3 w-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80"
          aria-label="Minimize"
          onClick={(e) => {
            e.stopPropagation();
            minimizeWindow();
          }}
        />
        <button
          className="h-3 w-3 rounded-full bg-[#28C840] hover:bg-[#28C840]/80"
          aria-label="Maximize"
          onClick={(e) => {
            e.stopPropagation();
            toggleMaximize();
          }}
        />
      </div>
      {children}
    </div>
  );
}

// Main Window component
export function Window({
  id,
  className,
  children,
  initialPosition = { x: 100, y: 100 },
}: Readonly<{
  id: string;
  className?: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
}>) {
  const [activeWindows, setActiveWindows] = useAtom(activeWindowsAtom);
  const [windowStates, setWindowStates] = useAtom(windowStatesAtom);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: "auto", height: "auto" });
  const [savedPosition, setSavedPosition] = useState(initialPosition);
  const [savedSize, setSavedSize] = useState({ width: "auto", height: "auto" });

  // Get this window's state
  const windowState = windowStates[id];

  // Check if window is in the activeWindows array
  const isInActiveWindows = activeWindows.includes(id);

  // Calculate the z-index based on the window's position in the activeWindows array
  const zIndex =
    activeWindows.indexOf(id) !== -1
      ? activeWindows.length - activeWindows.indexOf(id)
      : 0;

  // Function to bring this window to the front of others
  const bringToFront = () => {
    if (activeWindows[0] === id) return; // Already at front

    const { newWindowStates, newActiveWindows } = windowUtils.activateWindow(
      id,
      windowStates,
      activeWindows,
    );

    setWindowStates(newWindowStates as Record<string, WindowState>);
    setActiveWindows(newActiveWindows);
  };

  // Toggle maximize state
  const toggleMaximize = () => {
    startTransition(() => {
      if (isMaximized) {
        // When un-maximizing, restore the previous position and size
        setPosition(savedPosition);
        setSize(savedSize);
      } else {
        // When maximizing, save the current position and size for later
        setSavedPosition(position);
        setSavedSize(size);
      }
      setIsMaximized((prev) => !prev);
    });
  };

  // Function to minimize the window
  const minimizeWindow = () => {
    const { newWindowStates, newActiveWindows } = windowUtils.minimizeWindow(
      id,
      windowStates,
      activeWindows,
    );

    setWindowStates(newWindowStates as Record<string, WindowState>);
    setActiveWindows(newActiveWindows);
  };

  // Function to close the window
  const closeWindow = () => {
    const { newWindowStates, newActiveWindows } = windowUtils.closeWindow(
      id,
      windowStates as Record<string, WindowState>,
      activeWindows,
    );

    setWindowStates(newWindowStates as Record<string, WindowState>);
    setActiveWindows(newActiveWindows);
  };

  // We remove the auto-initialization effect since we only want
  // windows to be rendered if they're explicitly added to activeWindows
  // This prevents windows from automatically activating themselves

  // Don't render if window is minimized or closed OR not in activeWindows array
  if (
    windowState === "minimized" ||
    windowState === "closed" ||
    !windowState ||
    !isInActiveWindows
  ) {
    return null;
  }

  return (
    <ViewTransition>
      <Rnd
        default={{
          x: initialPosition.x,
          y: initialPosition.y,
          width: "auto",
          height: "auto",
        }}
        position={
          isMaximized ? { x: 0, y: 0 } : { x: position.x, y: position.y }
        }
        size={isMaximized ? { width: "100%", height: "100%" } : size}
        minWidth={320}
        minHeight={240}
        dragHandleClassName="window-titlebar"
        disableDragging={isMaximized}
        enableResizing={!isMaximized}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResize={(e, direction, ref, delta, position) => {
          setSize({
            width: `${ref.offsetWidth}px`,
            height: `${ref.offsetHeight}px`,
          });
          setPosition(position);
        }}
        style={{ zIndex }}
        className={cn(
          "bg-white/50 shadow-xl shadow-black/20 backdrop-blur-sm dark:bg-black/50 dark:shadow-black/50",
          isMaximized ? "rounded-none" : "rounded-xl",
          className,
        )}
        onClick={bringToFront}
      >
        <WindowContext.Provider
          value={{
            id,
            bringToFront,
            isMaximized,
            toggleMaximize,
            minimizeWindow,
            closeWindow,
          }}
        >
          {children}
        </WindowContext.Provider>
      </Rnd>
    </ViewTransition>
  );
}

// Content component for the window body
export function WindowContent({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const { isMaximized } = useWindowContext();

  return (
    <div
      className={cn(
        "p-4",
        isMaximized ? "h-[calc(100%-2.5rem)] overflow-auto" : "",
        className,
      )}
    >
      {children}
    </div>
  );
}
