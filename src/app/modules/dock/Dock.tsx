"use client";

import { ReactNode, useRef } from "react";

import { useAtom } from "jotai";
import {
  animate,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";

import * as Tooltip from "@radix-ui/react-tooltip";
import {
  activeWindowsAtom,
  WindowState,
  windowStatesAtom,
  windowUtils,
} from "../atoms";

const SCALE = 2.25; // max scale factor of an icon
const DISTANCE = 300; // pixels before mouse affects an icon
const NUDGE = 80; // pixels icons are moved away from mouse
const SPRING = {
  mass: 0.1,
  stiffness: 170,
  damping: 12,
};
const APPS = [
  "finder",
  "arc",
  "ghostty",
  "cursor",
  "notes",
  "calendar",
  "reminders",
  "music",
];

export default function Dock() {
  const mouseLeft = useMotionValue(-Infinity);
  const mouseRight = useMotionValue(-Infinity);
  const leftSpring = useSpring(0, SPRING);
  const rightSpring = useSpring(0, SPRING);

  return (
    <motion.nav
      onMouseMove={(e) => {
        const { left, right } = e.currentTarget.getBoundingClientRect();
        const offsetLeft = e.clientX - left;
        const offsetRight = right - e.clientX;
        mouseLeft.set(offsetLeft);
        mouseRight.set(offsetRight);
      }}
      onMouseLeave={() => {
        mouseLeft.set(-Infinity);
        mouseRight.set(-Infinity);
      }}
      className="fixed bottom-1 left-1/2 z-10 mx-auto hidden h-20 shrink-0 -translate-x-1/2 items-end px-1 pb-3 sm:flex"
    >
      <motion.div
        className="absolute inset-y-0 -z-10 rounded-3xl border border-slate-200/30 bg-white/40 backdrop-blur-3xl"
        style={{ left: leftSpring, right: rightSpring }}
      />

      {APPS.map((appId) => (
        <AppIcon key={appId} mouseLeft={mouseLeft} appId={appId} />
      ))}
    </motion.nav>
  );
}

function AppIcon({
  mouseLeft,
  appId,
}: {
  mouseLeft: MotionValue;
  appId: string;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [activeWindows, setActiveWindows] = useAtom(activeWindowsAtom);
  const [windowStates, setWindowStates] = useAtom(windowStatesAtom);

  // Check if the app is actually running (exists in windowStates and is active or minimized)
  const isAppRunning =
    windowStates[appId] != null &&
    (windowStates[appId] === "active" || windowStates[appId] === "minimized");

  const distance = useTransform(() => {
    const bounds = ref.current
      ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
      : { x: 0, width: 0 };

    return mouseLeft.get() - bounds.x - bounds.width / 2;
  });

  const scaleFactor = useTransform(
    distance,
    [-DISTANCE, 0, DISTANCE],
    [1, SCALE, 1],
  );
  const size = useTransform(scaleFactor, (s) => `${4 * s}rem`);

  const x = useTransform(() => {
    const d = distance.get();
    if (d === -Infinity) {
      return 0;
    } else if (d < -DISTANCE || d > DISTANCE) {
      return Math.sign(d) * -1 * NUDGE;
    } else {
      return (-d / DISTANCE) * NUDGE * scaleFactor.get();
    }
  });

  const sizeSpring = useSpring(size, SPRING);
  const xSpring = useSpring(x, SPRING);
  const y = useMotionValue(0);

  return (
    <Tooltip.Provider delayDuration={0}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <motion.button
            ref={ref}
            style={{
              // x: xSpring, // Uncomment if you want horizontal movement
              width: sizeSpring,
              height: sizeSpring,
              y,
            }}
            onClick={() => {
              const currentState = windowStates[appId];

              // If the window is already active or minimized, just bring it to front without animation
              if (currentState === "active" || currentState === "minimized") {
                const { newWindowStates, newActiveWindows } =
                  windowUtils.activateWindow(
                    appId,
                    windowStates,
                    activeWindows,
                  );
                setWindowStates(newWindowStates as Record<string, WindowState>);
                setActiveWindows(newActiveWindows);
                return;
              }

              // Start bounce animation for opening new apps
              animate(y, [0, -40, 0], {
                repeat: 2,
                ease: [
                  [0, 0, 0.2, 1],
                  [0.8, 0, 1, 1],
                ],
                duration: 0.7,
                onComplete: () => {
                  const {
                    newWindowStates: result,
                    newActiveWindows: activeResult,
                  } = windowUtils.activateWindow(
                    appId,
                    windowStates,
                    activeWindows,
                  );

                  setWindowStates(result as Record<string, WindowState>);
                  setActiveWindows(activeResult);
                },
              });
            }}
            className="block origin-bottom"
          >
            <Image
              src={`/icons/${appId}.webp`}
              width={1024}
              height={1024}
              alt={appId}
              className="h-full w-full"
            />
            {isAppRunning && (
              <div className="bg-foreground mx-auto size-1 rounded-full"></div>
            )}
          </motion.button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={10}
            className="rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm font-medium text-white capitalize shadow shadow-black"
          >
            {appId}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
