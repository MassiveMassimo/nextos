"use client";

import dynamic from "next/dynamic";

const WebContainerUI = dynamic(
  () => import("./ui").then((mod) => ({ default: mod.WebContainerUI })),
  { ssr: false },
);

export const WebContainerClient = () => <WebContainerUI />;
