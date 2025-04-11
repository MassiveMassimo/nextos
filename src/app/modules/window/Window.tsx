"use client";

import React, {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  unstable_ViewTransition as ViewTransition,
} from "react";

// import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { Rnd } from "react-rnd";

import { cn } from "@/lib/utils";
import { activeWindowsAtom } from "./atoms";

// Create a context for the Window component to share data with its children
type WindowContextType = {
  id: string;
  bringToFront: () => void;
  isMaximized: boolean;
  toggleMaximize: () => void;
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
  const { bringToFront, isMaximized, toggleMaximize } = useWindowContext();

  return (
    <div
      className={cn(
        "window-titlebar flex h-10 items-center px-3", // Added window-titlebar class
        isMaximized
          ? "rounded-none bg-black/10 dark:bg-white/10"
          : "rounded-t-xl bg-black/5 dark:bg-white/5",
        className,
      )}
      onClick={bringToFront} // Bring window to front when titlebar is clicked
    >
      <div className="mr-4 flex gap-2">
        <button
          className="h-3 w-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80"
          aria-label="Close"
        />
        <button
          className="h-3 w-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80"
          aria-label="Minimize"
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
  initialPosition = { x: 0, y: 0 },
}: Readonly<{
  id: string;
  className?: string;
  children: React.ReactNode;
  initialPosition?: { x: number; y: number };
}>) {
  const [activeWindows, setActiveWindows] = useAtom(activeWindowsAtom);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [size, setSize] = useState({ width: "auto", height: "auto" });
  const [savedPosition, setSavedPosition] = useState(initialPosition);
  const [savedSize, setSavedSize] = useState({ width: "auto", height: "auto" });

  // Calculate the z-index based on the window's position in the activeWindows array
  const zIndex =
    activeWindows.indexOf(id) !== -1
      ? activeWindows.length - activeWindows.indexOf(id)
      : 0;

  // Function to bring this window to the front of others
  const bringToFront = () => {
    setActiveWindows((prev) => {
      // If window isn't in the array or already at the front, don't change anything
      if (prev[0] === id) return prev;

      // Remove the window ID from its current position
      const filteredWindows = prev.filter((windowId) => windowId !== id);
      // Add it to the front of the array
      return [id, ...filteredWindows];
    });
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

  // Add window to activeWindows if not already present
  useEffect(() => {
    if (!activeWindows.includes(id)) {
      setActiveWindows((prev) => [...prev, id]);
    }

    // Clean up by removing window from activeWindows when unmounted
    return () => {
      setActiveWindows((prev) => prev.filter((windowId) => windowId !== id));
    };
  }, [id, setActiveWindows, activeWindows]);

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
        dragHandleClassName="window-titlebar" // Use the titlebar as drag handle
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
        onClick={bringToFront} // Also bring to front when clicking anywhere on the window
      >
        <WindowContext.Provider
          value={{
            id,
            bringToFront,
            isMaximized,
            toggleMaximize,
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
