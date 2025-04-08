"use client";

import { FC, useEffect, useRef, useState } from "react";

type EditorProps = {
  language?: string;
  initialCode: string;
  onChange: (code: string) => void;
};

const Editor: FC<EditorProps> = ({
  language = "javascript",
  initialCode,
  onChange,
}) => {
  const [code, setCode] = useState(initialCode);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update local state when initialCode prop changes
  useEffect(() => {
    setCode(initialCode);
  }, [initialCode]);

  // Handle tab key press to insert spaces instead of changing focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();

      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 2 spaces where the cursor is
      const newCode = code.substring(0, start) + "  " + code.substring(end);
      setCode(newCode);

      // Call the parent's onChange handler
      onChange(newCode);

      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = target.selectionStart + 2;
          textareaRef.current.selectionEnd = target.selectionStart + 2;
        }
      }, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);
    onChange(newCode);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md border">
      <div className="bg-gray-800 px-4 py-2 font-mono text-sm text-white">
        {language}
      </div>

      <textarea
        ref={textareaRef}
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="w-full flex-1 resize-none bg-gray-900 p-4 font-mono text-sm text-white outline-none"
        spellCheck="false"
      />
    </div>
  );
};

Editor.displayName = "Editor";
export { Editor };
