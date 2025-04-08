"use client";

import { FC, useEffect, useState } from "react";

type PreviewProps = {
  url: string | null;
};

const Preview: FC<PreviewProps> = ({ url }) => {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (url) setLoading(true);
  }, [url]);

  const handleIframeLoad = () => {
    setLoading(false);
  };

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-md border">
      <div className="flex justify-between bg-gray-800 px-4 py-2 font-mono text-sm text-white">
        <span>Preview</span>
      </div>

      <div className="relative flex-1 bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-800"></div>
          </div>
        )}

        {url ? (
          <iframe
            src={url}
            className="h-full w-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            onLoad={handleIframeLoad}
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500">
            No preview available
          </div>
        )}
      </div>
    </div>
  );
};

Preview.displayName = "Preview";
export { Preview };
