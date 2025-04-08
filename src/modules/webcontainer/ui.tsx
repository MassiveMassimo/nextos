"use client";

import { FC, useEffect, useState } from "react";

import { useWebContainer } from "@/hooks/use-web-container";
import { FileSystemTree } from "@webcontainer/api";
import { Editor } from "./editor";
import { Preview } from "./preview";
import { Terminal } from "./terminal";

const DEFAULT_CODE = `<!DOCTYPE html>
<html>
<head>
  <title>NextOS</title>
</head>
<body>
  <h1>Hello from WebContainer!</h1>
  <p>Edit this HTML and see changes in real-time.</p>
</body>
</html>`;

const WebContainerUI: FC = () => {
  const {
    webcontainer,
    isLoading,
    error,
    terminalOutput,
    previewUrl,
    runCommand,
    updateFiles,
  } = useWebContainer();

  const [code, setCode] = useState(DEFAULT_CODE);

  // Initialize files when WebContainer is ready
  useEffect(() => {
    if (webcontainer && !isLoading) {
      const files: FileSystemTree = {
        "index.html": {
          file: {
            contents: code,
          },
        },
        "package.json": {
          file: {
            contents: JSON.stringify(
              {
                name: "nextos-app",
                version: "1.0.0",
                description: "NextOS Sample App",
                scripts: {
                  start: "npx serve -p 3000",
                },
                dependencies: {
                  serve: "^14.0.0",
                },
              },
              null,
              2,
            ),
          },
        },
      };

      // Mount the files and start the server
      (async () => {
        await updateFiles(files);
        await runCommand("npm install");
        await runCommand("npm start");
      })();
    }
  }, [webcontainer, isLoading, code, updateFiles, runCommand]);

  // Handle code changes
  const handleCodeChange = async (newCode: string) => {
    setCode(newCode);
    if (!webcontainer || isLoading) return;

    await updateFiles({
      "index.html": { file: { contents: newCode } },
    });
  };

  // Handle terminal commands
  const handleCommand = async (command: string) => {
    await runCommand(command);
  };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="max-w-lg rounded-lg bg-red-100 p-6 text-center">
          <h2 className="mb-2 text-xl font-bold text-red-700">
            Error initializing WebContainer
          </h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-4 p-4">
      <div className="col-span-1 row-span-2">
        <Editor
          initialCode={code}
          onChange={handleCodeChange}
          language="html"
        />
      </div>

      <div className="col-span-1 row-span-1">
        <Terminal output={terminalOutput} onCommand={handleCommand} />
      </div>

      <div className="col-span-1 row-span-1">
        <Preview url={previewUrl} />
      </div>

      {isLoading && (
        <div className="bg-opacity-75 fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-gray-800"></div>
            <p className="font-medium text-gray-800">
              Initializing WebContainer...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

WebContainerUI.displayName = "WebContainerUI";
export { WebContainerUI };
