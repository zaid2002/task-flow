"use client";

import { Calendar, Inbox, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const navItems = [
  { id: "inbox", name: "Inbox", icon: Inbox },
  { id: "today", name: "Today", icon: Calendar },
  { id: "upcoming", name: "Soon", icon: Clock },
  { id: "important", name: "Important", icon: Star },
];

export function MobileNav({ activeCategory, onCategoryChange }: MobileNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onCategoryChange(item.id)}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors",
                activeCategory === item.id
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
