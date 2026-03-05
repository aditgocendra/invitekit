"use client";

import * as React from "react";
import { Command, Wallpaper } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSession } from "next-auth/react";

const data = {
  navMain: [
    {
      title: "Event",
      url: "#",
      icon: Wallpaper,
      isActive: true,
      items: [
        {
          title: "Wedding",
          url: "/dashboard/wedding",
        },
        {
          title: "Circumcision",
          url: "/dashboard/circumcision",
        },
      ],
    },
  ],
  // navSecondary: [
  //   {
  //     title: "Support",
  //     url: "#",
  //     icon: LifeBuoy,
  //   },
  //   {
  //     title: "Feedback",
  //     url: "#",
  //     icon: Send,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession();

  const user = session?.user;

  return (
    <Sidebar
      variant='inset'
      {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild>
              <Link href='/dashboard'>
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg'>
                  <Command className='size-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='font-fredoka truncate font-medium'>
                    Invitekit
                  </span>
                  <span className='truncate text-xs'>Dashboard</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary
          items={data.navSecondary}
          className='mt-auto'
        /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name || "",
            email: user?.email || "",
            avatar: user?.image || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
