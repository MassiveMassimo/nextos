import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

export default function MenuBar() {
  return (
    <header className="bg-foreground/10 flex h-9 items-center px-1 backdrop-blur-3xl">
      <Menubar className="h-8 items-stretch gap-0 border-none bg-transparent shadow-none">
        <MenubarMenu>
          <MenubarTrigger className="p-2.5 before:rounded-tl-2xl">
            <i className="icon-[simple-icons--apple] text-background text-base text-shadow-md" />
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>About This Mac</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>System Settings...</MenubarItem>
            <MenubarItem>App Store...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Recent Items</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Force Quit Finder... <MenubarShortcut>⌥⌘⎋</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Sleep</MenubarItem>
            <MenubarItem>Restart...</MenubarItem>
            <MenubarItem>Shut Down...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Lock Screen <MenubarShortcut>⌃⌘Q</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Log Out <MenubarShortcut>⇧⌘Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-extrabold text-shadow-md">
              Finder
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>About Finder</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Preferences... <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Empty Trash...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Services</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Hide Finder <MenubarShortcut>⌘H</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Hide Others <MenubarShortcut>⌥⌘H</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Show All</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-semibold text-shadow-md">
              File
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Finder Window <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Folder <MenubarShortcut>⇧⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Folder with Selection <MenubarShortcut>⌃⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Smart Folder <MenubarShortcut>⌥⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Tab <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Open <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Open With</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Close Window <MenubarShortcut>⌘W</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Get Info <MenubarShortcut>⌘I</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Rename</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Compress</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Duplicate <MenubarShortcut>⌘D</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Make Alias <MenubarShortcut>⌃⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Quick Look <MenubarShortcut>⌘Y</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Print</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-semibold text-shadow-md">
              Edit
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Undo <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Cut <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Copy <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Paste <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Select All <MenubarShortcut>⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Show Clipboard</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Start Dictation <MenubarShortcut>fn fn</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Emoji & Symbols <MenubarShortcut>⌃⌘Space</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-semibold text-shadow-md">
              View
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              as Icons <MenubarShortcut>⌘1</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              as List <MenubarShortcut>⌘2</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              as Columns <MenubarShortcut>⌘3</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              as Gallery <MenubarShortcut>⌘4</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Use Groups <MenubarShortcut>⌘J</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Sort By</MenubarItem>
            <MenubarItem>Clean Up</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Show Path Bar <MenubarShortcut>⌥⌘P</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Show Status Bar <MenubarShortcut>⌘/</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Show Sidebar <MenubarShortcut>⌥⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Show Preview</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Hide Toolbar <MenubarShortcut>⌥⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Show All Tabs <MenubarShortcut>⇧⌘\</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Enter Full Screen <MenubarShortcut>⌃⌘F</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-semibold text-shadow-md">
              Go
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Back <MenubarShortcut>⌘[</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Forward <MenubarShortcut>⌘]</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Enclosing Folder <MenubarShortcut>⌘↑</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Recents <MenubarShortcut>⇧⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Documents <MenubarShortcut>⇧⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Desktop <MenubarShortcut>⇧⌘D</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Downloads <MenubarShortcut>⌥⌘L</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Home <MenubarShortcut>⇧⌘H</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Computer <MenubarShortcut>⇧⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              AirDrop <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Network <MenubarShortcut>⇧⌘K</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Applications <MenubarShortcut>⇧⌘A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Utilities <MenubarShortcut>⇧⌘U</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Go to Folder... <MenubarShortcut>⇧⌘G</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Connect to Server... <MenubarShortcut>⌘K</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-semibold text-shadow-md">
              Window
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Minimize <MenubarShortcut>⌘M</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Zoom</MenubarItem>
            <MenubarItem>
              Cycle Through Windows <MenubarShortcut>⌘`</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Show Previous Tab <MenubarShortcut>⇧⌃Tab</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Show Next Tab <MenubarShortcut>⌃Tab</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>Move Tab to New Window</MenubarItem>
            <MenubarItem>Merge All Windows</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Bring All to Front</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="px-2.5">
            <p className="text-background text-sm font-semibold text-shadow-md">
              Help
            </p>
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              macOS Help <MenubarShortcut>⌘?</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>See What&apos;s New in macOS</MenubarItem>
            <MenubarItem>New Features in macOS</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </header>
  );
}
