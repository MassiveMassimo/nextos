"use client";

import { FC, useEffect, useRef, useState } from "react";

type TerminalProps = {
  output: string[];
  onCommand: (command: string) => void;
};

const Terminal: FC<TerminalProps> = ({ onCommand, output }) => {
  const [command, setCommand] = useState("");
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (!terminalRef.current) return;
    terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
  }, [output]);

  // Focus the input when the terminal is clicked
  const focusInput = () => {
    if (!inputRef.current) return;
    inputRef.current.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    onCommand(command);
    setCommand("");
  };

  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-md bg-black p-4 font-mono text-sm text-green-500"
      onClick={focusInput}
    >
      <div
        ref={terminalRef}
        className="mb-2 flex-1 overflow-y-auto whitespace-pre-wrap"
      >
        {output.map((line, index) => (
          <div key={index} className="mb-1">
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="mr-2">$</span>
        <input
          ref={inputRef}
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          className="flex-1 bg-transparent outline-none"
          autoFocus
        />
      </form>
    </div>
  );
};

Terminal.displayName = "Terminal";
export { Terminal };
