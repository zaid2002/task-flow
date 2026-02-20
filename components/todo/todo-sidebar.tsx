"use client";

import React from "react"

import { Calendar, Inbox, Star, Tag, Clock, Plus } from "lucide-react";
import { cn } from "@/lib/utils";


export interface SidebarCounts {
  inbox: number;
  today: number;
  upcoming: number;
  important: number;
}

interface TodoSidebarProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  counts: SidebarCounts;
}

const categories = [
  { id: "inbox", name: "Inbox", icon: <Inbox className="h-4 w-4" /> },
  { id: "today", name: "Today", icon: <Calendar className="h-4 w-4" /> },
  { id: "upcoming", name: "Upcoming", icon: <Clock className="h-4 w-4" /> },
  { id: "important", name: "Important", icon: <Star className="h-4 w-4" /> },
];

const tags = [
  { id: "work", name: "Work", color: "bg-primary" },
  { id: "personal", name: "Personal", color: "bg-chart-2" },
  { id: "shopping", name: "Shopping", color: "bg-chart-5" },
];

export function TodoSidebar({ activeCategory, onCategoryChange, counts }: TodoSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar p-4">
      <nav className="flex flex-col gap-1">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              activeCategory === category.id
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              {category.icon}
              <span>{category.name}</span>
            </div>
            <span className={cn(
              "text-xs rounded-full px-2 py-0.5",
              activeCategory === category.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
            )}>
              {counts[category.id as keyof SidebarCounts]}
            </span>
          </button>
        ))}
      </nav>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Tags
          </h3>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {tags.map((tag) => (
            <button
              key={tag.id}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors"
            >
              <Tag className="h-4 w-4" />
              <span>{tag.name}</span>
              <span className={cn("ml-auto h-2 w-2 rounded-full", tag.color)} />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-border">
        <div className="rounded-lg bg-secondary/50 p-4">
          <p className="text-sm font-medium text-foreground">Pro Tip</p>
          <p className="text-xs text-muted-foreground mt-1">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">Ctrl + N</kbd> to quickly add a new task
          </p>
        </div>
      </div>
    </aside>
  );
}
