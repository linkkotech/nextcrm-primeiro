"use client";

import {
  Archive,
  BarChartSquare02,
  CheckDone01,
  CurrencyDollarCircle,
  Grid03,
  HomeLine,
  LayoutAlt01,
  LineChartUp03,
  MessageChatCircle,
  NotificationBox,
  Package,
  PieChart03,
  Rows01,
  Settings01,
  Star01,
  User01,
  Users01,
  UsersPlus,
} from "@untitledui/icons";
import { FeaturedCardProgressBar } from "@/components/application/app-navigation/base-components/featured-cards";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSimple } from "@/components/application/app-navigation/sidebar-navigation/sidebar-simple";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { UserProfile } from "./UserProfile";

interface SidebarNavigationProps {
  userName?: string | null;
  userEmail?: string | null;
  userImage?: string | null;
}

const navItemsSimple: NavItemType[] = [
  {
    label: "Home",
    href: "/admin",
    icon: HomeLine,
    items: [
      { label: "Overview", href: "/admin", icon: Grid03 },
      { label: "Workspaces", href: "/admin/workspaces", icon: Package },
      { label: "Orders", href: "/admin/orders", icon: CurrencyDollarCircle },
      { label: "Customers", href: "/admin/customers", icon: Users01 },
    ],
  },
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: BarChartSquare02,
    items: [
      { label: "Overview", href: "/admin/dashboard", icon: Grid03 },
      { label: "Notifications", href: "/admin/dashboard/notifications", icon: NotificationBox, badge: 10 },
      { label: "Analytics", href: "/admin/dashboard/analytics", icon: LineChartUp03 },
      { label: "Saved reports", href: "/admin/dashboard/saved-reports", icon: Star01 },
    ],
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Rows01,
    items: [
      { label: "View all", href: "/admin/projects", icon: Rows01 },
      { label: "Personal", href: "/admin/projects/personal", icon: User01 },
      { label: "Team", href: "/admin/projects/team", icon: Users01 },
      { label: "Shared with me", href: "/admin/projects/shared", icon: UsersPlus },
      { label: "Archive", href: "/admin/projects/archive", icon: Archive },
    ],
  },
  {
    label: "Tasks",
    href: "/admin/tasks",
    icon: CheckDone01,
    badge: 10,
  },
  {
    label: "Reporting",
    href: "/admin/reporting",
    icon: PieChart03,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users01,
  },
];

export function SidebarNavigation({
  userName,
  userEmail,
  userImage,
}: SidebarNavigationProps) {
  return (
    <SidebarNavigationSimple
      items={navItemsSimple}
      footerItems={[
        {
          label: "Settings",
          href: "/admin/settings",
          icon: Settings01,
        },
        {
          label: "Support",
          href: "/admin/support",
          icon: MessageChatCircle,
          badge: (
            <BadgeWithDot color="success" type="modern" size="sm">
              Online
            </BadgeWithDot>
          ),
        },
        {
          label: "Open in browser",
          href: "https://www.untitledui.com/",
          icon: LayoutAlt01,
        },
      ]}
      featureCard={
        <FeaturedCardProgressBar
          title="Used space"
          description="Your team has used 80% of your available space. Need more?"
          confirmLabel="Upgrade plan"
          progress={80}
          className="hidden md:flex"
          onDismiss={() => {}}
          onConfirm={() => {}}
        />
      }
      userProfile={
        <UserProfile name={userName} email={userEmail} image={userImage} />
      }
    />
  );
}
