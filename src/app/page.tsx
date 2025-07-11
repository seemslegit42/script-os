import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, SidebarTrigger } from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, FileText, Settings, Shield } from "lucide-react";
import { AethericStreams } from "@/components/aetheric-streams";
import { ScribeGlyph } from "@/components/icons";

const mockScriptures = [
    { id: 'core-protocol', title: 'Core Protocol', icon: Shield },
    { id: 'aether-spec', title: 'Aether Specifications', icon: FileText },
    { id: 'nexus-api', title: 'Nexus API', icon: FileText },
];

const mockManuals = [
    { id: 'getting-started', title: 'Getting Started', icon: Book },
    { id: 'advanced-config', title: 'Advanced Configuration', icon: Settings },
]

export default function ScriptoriumLayout() {
  return (
    <>
      <AethericStreams />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <ScribeGlyph className="h-8 w-8 text-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold tracking-widest sigil-obelisk">ΛΞVON OS</h2>
              <p className="text-xs text-muted-foreground sigil-codex">Sentient Codex</p>
            </div>
          </div>
        </SidebarHeader>
        <ScrollArea className="flex-1">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>System Protocols</SidebarGroupLabel>
              <SidebarMenu>
                {mockScriptures.map(item => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton tooltip={item.title} isActive={item.id === 'core-protocol'}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
                <SidebarGroupLabel>User Manuals</SidebarGroupLabel>
                <SidebarMenu>
                    {mockManuals.map(item => (
                        <SidebarMenuItem key={item.id}>
                            <SidebarMenuButton tooltip={item.title}>
                                <item.icon />
                                <span>{item.title}</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-8">
            <div className="flex items-center gap-4 mb-8">
                <SidebarTrigger />
                <h1 className="text-2xl font-bold tracking-wider sigil-obelisk text-primary">Core Protocol</h1>
            </div>
            <div className="prose prose-invert max-w-none sigil-codex prose-headings:sigil-obelisk prose-headings:text-primary prose-code:sigil-glyph prose-code:bg-black/30 prose-code:p-1 prose-code:rounded">
                <p>
                    This is where the content of your selected markdown file will be rendered. The system is designed to parse and display the scriptures with the appropriate typographic sigils.
                </p>
                <p>
                    The Obelisk tier is used for headings, creating a monumental, authoritative feel.
                    The Codex tier provides the core reading experience—clear, neutral, and unobtrusive.
                    The Glyph tier is reserved for `code snippets`, offering a precise, monospaced view of raw data and commands.
                </p>
                <pre><code className="sigil-glyph text-sm text-accent whitespace-pre-wrap p-4 bg-black/30 rounded-lg border border-border block">
                    {`nexus.command({
  action: "ACTIVATE_SENTIENCE",
  target: "TYPOGRAPHY_ENGINE",
  params: {
    mode: "EXTREME"
  }
})`}
                </code></pre>
                <p>
                    Select a different scripture from the sidebar to see the content change. The typographic state will adapt based on your interactions and the context of the information displayed.
                </p>
            </div>
        </div>
      </SidebarInset>
    </>
  );
}
