import { Link, useLocation } from '@tanstack/react-router';
import {
  Binary,
  ClipboardList,
  Fingerprint,
  Hash,
  KeyRound,
  LayoutDashboard,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';

export const tools = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/',
    shortcut: 'd',
  },
  {
    title: 'Password Generator',
    icon: KeyRound,
    url: '/tools/password-generator',
    shortcut: 'p',
  },
  {
    title: 'Secrets Generator',
    icon: ShieldCheck,
    url: '/tools/secrets-generator',
    shortcut: 's',
  },
  {
    title: 'Text Share',
    icon: ClipboardList,
    url: '/tools/text-share',
    shortcut: 't',
  },
  {
    title: 'JSON Formatter',
    icon: Binary,
    url: '/tools/json-formatter',
    shortcut: 'j',
  },
  {
    title: 'Base64 Converter',
    icon: ShieldCheck,
    url: '/tools/base64',
    shortcut: 'b',
  },
  {
    title: 'UUID Generator',
    icon: Fingerprint,
    url: '/tools/uuid-generator',
    shortcut: 'u',
  },
  {
    title: 'Hash Generator',
    icon: Hash,
    url: '/tools/hash-generator',
    shortcut: 'h',
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Wrench className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Dev Toolkit</span>
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      <kbd className="ml-auto hidden font-sans text-[10px] uppercase opacity-60 group-data-[collapsible=icon]:hidden lg:inline-block">
                        {item.shortcut}
                      </kbd>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
