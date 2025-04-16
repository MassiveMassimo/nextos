import { Titlebar, Window } from "@/app/modules/window/Window";
import { Input } from "@/components/ui/input";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Finder() {
  return (
    <Window id="arc" className="!flex backdrop-blur-3xl">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="max-w-64 min-w-32">
          <div className="flex flex-col justify-center">
            <Titlebar className="justify-between bg-transparent select-none">
              <div className="text-muted-foreground flex items-center gap-2">
                <i>􀰌</i>
                <i>􀰑</i>
                <i>􀅈</i>
              </div>
            </Titlebar>
            <div className="px-2">
              <Input placeholder="localhost" className="bg-muted-foreground/20 border-0 shadow-none rounded-lg"/>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle className="bg-transparent" />
        <ResizablePanel className="flex">
          <div className="m-2 ml-0 grow rounded-md bg-white shadow">arc</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Window>
  );
}
