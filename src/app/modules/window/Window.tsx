"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";

import { motion, useDragControls } from "framer-motion";
import { useAtom } from "jotai";

import { cn } from "@/lib/utils";
import { activeWindowsAtom } from "./atoms";

// Create a context for the Window component to share data with its children
type WindowContextType = {
  id: string;
  dragControls: ReturnType<typeof useDragControls>;
  bringToFront: () => void;
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
  const { dragControls, bringToFront } = useWindowContext();

  const handlePointerDown = (event: React.PointerEvent) => {
    // Bring window to front when titlebar is clicked
    bringToFront();
    // Start drag operation
    dragControls.start(event);
  };

  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-t-xl bg-black/5 px-3 dark:bg-white/5",
        className,
      )}
      onPointerDown={handlePointerDown}
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
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [activeWindows, setActiveWindows] = useAtom(activeWindowsAtom);

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
    <div
      ref={constraintsRef}
      className="absolute -inset-x-full top-0 -bottom-full" // This has weird constrainst on purpose
    >
      <motion.div
        className={cn(
          "absolute top-1/4 left-1/2 min-h-[240px] min-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/50 shadow-xl shadow-black/20 backdrop-blur-sm dark:bg-black/50 dark:shadow-black/50",
          className,
        )}
        style={{ zIndex }}
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        initial={{ x: initialPosition.x, y: initialPosition.y }}
        onClick={bringToFront} // Also bring to front when clicking anywhere on the window
      >
        <WindowContext.Provider value={{ id, dragControls, bringToFront }}>
          {children}
        </WindowContext.Provider>
      </motion.div>
    </div>
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
  return <div className={cn("p-4", className)}>{children}</div>;
}
