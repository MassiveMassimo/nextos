import { FileSystemTree, WebContainer } from "@webcontainer/api";

// Singleton pattern for WebContainer instance
let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

/**
 * Initializes and returns a WebContainer instance
 * Only creates a new instance if one doesn't already exist
 */
export async function getWebContainerInstance(): Promise<WebContainer> {
  if (webcontainerInstance) return webcontainerInstance;
  if (bootPromise) return bootPromise;

  // Create a single boot promise that all callers will share
  bootPromise = WebContainer.boot().then((instance) => {
    webcontainerInstance = instance;
    bootPromise = null;
    return instance;
  });

  return bootPromise;
}

/** Writes files to the WebContainer instance */
export async function writeFiles(
  instance: WebContainer,
  files: FileSystemTree,
) {
  await instance.mount(files);
}

/** Executes a command in the WebContainer */
export async function executeCommand(
  instance: WebContainer,
  command: string,
  args: string[] = [],
) {
  return instance.spawn(command, args);
}

/** Sets up an event listener for terminal output */
export function setupTerminalListener(
  instance: WebContainer,
  outputCallback: (data: string) => void,
) {
  const unsubscribe = instance.on("server-ready", (port, url) => {
    outputCallback(`Server ready on ${url}`);
  });

  return unsubscribe;
}

/** Provides access to the WebContainer's file system */
export function getFileSystem(instance: WebContainer) {
  return instance.fs;
}
