'use client';

import * as React from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  PlusSquare,
  History,
  CircleUser,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Icons.logo className="h-8 w-8 text-primary" />
            <span className="text-lg font-semibold font-headline text-primary">
              CanalUpsure
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard')}
                tooltip="Painel"
              >
                <Link href="/dashboard">
                  <LayoutDashboard />
                  <span>Painel</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/new-bet')}
                tooltip="Nova Aposta"
              >
                <Link href="/dashboard/new-bet">
                  <PlusSquare />
                  <span>Nova Aposta</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={isActive('/dashboard/history')}
                tooltip="Histórico"
              >
                <Link href="/dashboard/history">
                  <History />
                  <span>Histórico</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="my-2" />
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src="https://placehold.co/40x40.png" alt="@user" data-ai-hint="user avatar" />
              <AvatarFallback>
                <CircleUser />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Usuário Admin</span>
              <span className="text-xs text-muted-foreground">
                admin@canalupsure.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
