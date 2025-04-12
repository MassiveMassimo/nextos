import { WebContainerClient } from "@/modules/webcontainer/client";

export default function Home() {
  return (
    <main className="w-full grow overflow-clip">
      <WebContainerClient />
    </main>
  );
}
