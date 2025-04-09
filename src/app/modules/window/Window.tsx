"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAtom } from "jotai";
import { motion, useDragControls } from "motion/react";

import { cn } from "@/lib/utils";
import { activeWindowsAtom } from "./atoms";

// Create a context for the Window component to share data with its children
type WindowContextType = {
  id: string;
  dragControls: ReturnType<typeof useDragControls>;
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
  const { dragControls, bringToFront, isMaximized, toggleMaximize } =
    useWindowContext();

  const handlePointerDown = (event: React.PointerEvent) => {
    // Don't drag if maximized
    if (!isMaximized) {
      // Bring window to front when titlebar is clicked
      bringToFront();
      // Start drag operation
      dragControls.start(event);
    }
  };

  return (
    <motion.div
      layout="position"
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={cn(
        "flex h-10 items-center px-3",
        isMaximized
          ? "rounded-none bg-black/10 dark:bg-white/10"
          : "rounded-t-xl bg-black/5 dark:bg-white/5",
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
          onClick={(e) => {
            e.stopPropagation();
            toggleMaximize();
          }}
        />
      </div>
      {children}
    </motion.div>
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
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [savedPosition, setSavedPosition] = useState(initialPosition);

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
    if (isMaximized) {
      // When un-maximizing, restore the previous position
      setPosition(savedPosition);
    } else {
      // When maximizing, save the current position for later
      setSavedPosition(position);
      // Reset position to ensure it expands from the center
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized((prev) => !prev);
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
      className="absolute -inset-x-full top-0 -bottom-full" // This has weird constraints on purpose
    >
      <motion.div
        layout
        className={cn(
          "absolute bg-white/50 shadow-xl shadow-black/20 backdrop-blur-sm dark:bg-black/50 dark:shadow-black/50",
          isMaximized
            ? "inset-x-1/3 top-0 bottom-1/2 rounded-none"
            : "top-1/4 left-1/2 min-h-[240px] min-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-xl",
          className,
        )}
        style={{ zIndex }}
        drag={!isMaximized}
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        animate={isMaximized ? {} : { x: position.x, y: position.y }}
        initial={{ x: initialPosition.x, y: initialPosition.y }}
        onClick={bringToFront} // Also bring to front when clicking anywhere on the window
        transition={{
          duration: 0.5,
          ease: [0.32, 0.72, 0, 1],
        }}
        onDragEnd={(_, info) => {
          // Update position based on the accumulated offset (delta)
          setPosition((prevPos) => ({
            x: prevPos.x + info.offset.x,
            y: prevPos.y + info.offset.y,
          }));
        }}
      >
        <WindowContext.Provider
          value={{
            id,
            dragControls,
            bringToFront,
            isMaximized,
            toggleMaximize,
          }}
        >
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
  const { isMaximized } = useWindowContext();

  return (
    <motion.div
      layout
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      }}
      className={cn(
        "p-4",
        isMaximized ? "h-[calc(100%-2.5rem)] overflow-auto" : "",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
