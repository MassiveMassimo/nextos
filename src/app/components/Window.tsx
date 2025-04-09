"use client";

import React, { useRef } from "react";

import { DragControls, motion, useDragControls } from "motion/react";

import { cn } from "@/lib/utils";

const DragContext = React.createContext<DragControls | null>(null);

export function Titlebar({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const dragControls = React.useContext(DragContext);

  return (
    <div
      className={cn(
        "flex h-10 items-center rounded-t-xl bg-black/5 px-3 dark:bg-white/5",
        className,
      )}
      onPointerDown={(event) => dragControls?.start(event)}
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

export function Window({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  return (
    <div
      ref={constraintsRef}
      className="absolute -inset-x-full top-0 -bottom-full"
    >
      <motion.div
        className={cn(
          "absolute top-1/4 left-1/2 min-h-[240px] min-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white/50 shadow-xl shadow-black/20 backdrop-blur-sm dark:bg-black/50 dark:shadow-black/50",
          className,
        )}
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0}
        initial={{}}
        animate={{}}
        exit={{}}
      >
        <DragContext.Provider value={dragControls}>
          {children}
        </DragContext.Provider>
      </motion.div>
    </div>
  );
}
