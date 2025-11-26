"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

/**
 * Notifications Bell - Client Component
 * Dropdown with notification items
 */
export function NotificationsBell() {
  const [hasUnread, setHasUnread] = React.useState(true);
  const [notifications] = React.useState([
    {
      id: 1,
      title: "New dataset uploaded",
      description: 'User123 uploaded "Heart Disease Dataset"',
      time: "2m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Run completed",
      description: "Your experiment on task #456 has finished",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Collection shared",
      description: "Dr. Smith shared a collection with you",
      time: "3h ago",
      unread: false,
    },
  ]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          <Badge variant="secondary" className="ml-auto">
            {notifications.filter((n) => n.unread).length} new
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="cursor-pointer flex-col items-start p-3"
          >
            <div className="flex w-full items-start">
              {notification.unread && (
                <span className="bg-primary mt-1 mr-2 h-2 w-2 flex-shrink-0 rounded-full" />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                  {notification.description}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {notification.time}
                </p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-primary cursor-pointer justify-center text-center">
          View all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
