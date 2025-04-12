"use client";

import { ReactNode, useRef } from "react";

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
  "safari",
  "arc",
  "ghostty",
  "photos",
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
      className="relative z-10 mx-auto hidden h-18 shrink-0 items-end px-1 pb-1 sm:flex mb-1"
    >
      <motion.div
        className="absolute inset-y-0 -z-10 rounded-2xl border border-white/30 bg-white/30 backdrop-blur-3xl"
        style={{ left: leftSpring, right: rightSpring }}
      />

      {Array.from(Array(APPS.length).keys()).map((i) => (
        <AppIcon key={i} mouseLeft={mouseLeft}>
          {APPS[i]}
        </AppIcon>
      ))}
    </motion.nav>
  );
}

function AppIcon({
  mouseLeft,
  children,
}: {
  mouseLeft: MotionValue;
  children: ReactNode;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(() => {
    const bounds = ref.current
      ? { x: ref.current.offsetLeft, width: ref.current.offsetWidth }
      : { x: 0, width: 0 };

    return mouseLeft.get() - bounds.x - bounds.width / 2;
  });

  const scaleFactor = useTransform(distance, [-DISTANCE, 0, DISTANCE], [1, SCALE, 1]);
  const size = useTransform(scaleFactor, (s) => `${4 * s}rem`); // Convert scale factor to rem size (16px * 4 = 64px base size)
  
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
              // x: xSpring, 
              width: sizeSpring, 
              height: sizeSpring, 
              y 
            }}
            onClick={() => {
              animate(y, [0, -40, 0], {
                repeat: 2,
                ease: [
                  [0, 0, 0.2, 1],
                  [0.8, 0, 1, 1],
                ],
                duration: 0.7,
              });
            }}
            className="block origin-bottom"
          >
            <Image
              src={`/icons/${children}.webp`}
              width={1024}
              height={1024}
              alt={String(children)}
              className="w-full h-full"
            />
          </motion.button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            sideOffset={10}
            className="rounded border border-gray-600 bg-gray-700 px-2 py-1.5 text-sm font-medium text-white capitalize shadow shadow-black"
          >
            {children}
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
