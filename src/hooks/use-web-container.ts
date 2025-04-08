"use client";

import { useCallback, useEffect, useState } from "react";

import {
  executeCommand,
  getWebContainerInstance,
  writeFiles,
} from "@/lib/webcontainer";
import { FileSystemTree, WebContainer } from "@webcontainer/api";

type UseWebContainerReturn = {
  webcontainer: WebContainer | null;

  isLoading: boolean;
  error: Error | null;

  previewUrl: string | null;
  updateFiles: (files: FileSystemTree) => Promise<void>;

  terminalOutput: string[];
  runCommand: (command: string) => Promise<void>;
};

export function useWebContainer(): UseWebContainerReturn {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    "Welcome to NextOS",
  ]);

  // Initialize WebContainer
  useEffect(() => {
    async function bootWebContainer() {
      try {
        setLoading(true);
        const instance = await getWebContainerInstance();

        // Listen for server-ready event
        instance.on("server-ready", (port, url) => {
          setPreviewUrl(url);
          addTerminalOutput(`Server started at ${url}`);
        });

        setWebcontainer(instance);
      } catch (err) {
        console.error("Failed to initialize WebContainer:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    }

    // Boot WebContainer only in the browser
    if (typeof window !== "undefined") {
      bootWebContainer();
    }
  }, []);

  // Helper function to add output to the terminal
  const addTerminalOutput = useCallback((output: string) => {
    setTerminalOutput((prev) => [...prev, output]);
  }, []);

  // Function to run a command in the WebContainer
  const runCommand = useCallback(
    async (command: string) => {
      if (!webcontainer) return;

      try {
        addTerminalOutput(`$ ${command}`);

        const [cmd, ...args] = command.split(" ");
        const process = await executeCommand(webcontainer, cmd, args);

        process.output.pipeTo(
          new WritableStream({
            write(data) {
              addTerminalOutput(data);
            },
          }),
        );

        const exitCode = await process.exit;
        if (exitCode !== 0) {
          addTerminalOutput(`Command exited with code ${exitCode}`);
        }
      } catch (err) {
        console.error("Failed to run command:", err);
        addTerminalOutput(
          `Error: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    },
    [webcontainer, addTerminalOutput],
  );

  // Function to update files in the WebContainer
  const updateFiles = useCallback(
    async (files: FileSystemTree) => {
      if (!webcontainer) return;

      try {
        await writeFiles(webcontainer, files);
        addTerminalOutput("Files updated successfully");
      } catch (err) {
        console.error("Failed to update files:", err);
        addTerminalOutput(
          `Error updating files: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    },
    [webcontainer, addTerminalOutput],
  );

  return {
    webcontainer,
    isLoading,
    error,
    previewUrl,
    updateFiles,
    terminalOutput,
    runCommand,
  };
}
