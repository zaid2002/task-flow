"use client";

import React from "react"

import { useState } from "react";
import { Plus, Calendar, Tag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AddTodoProps {
  onAdd: (title: string, important: boolean, tag?: { name: string; color: string }) => void;
}

const tagOptions = [
  { name: "Work", color: "bg-primary/20 text-primary" },
  { name: "Personal", color: "bg-chart-2/20 text-chart-2" },
  { name: "Shopping", color: "bg-chart-5/20 text-chart-5" },
];

export function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{ name: string; color: string } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim(), isImportant, selectedTag || undefined);
      setTitle("");
      setIsImportant(false);
      setSelectedTag(null);
      setIsExpanded(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="rounded-xl border border-border bg-card p-4 transition-all focus-within:border-primary/50">
        <div className="flex items-center gap-3">
          <Plus className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            type="text"
            placeholder="Add a new task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="border-0 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>

        {isExpanded && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors"
              >
                <Calendar className="h-3.5 w-3.5" />
                Due date
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {selectedTag ? selectedTag.name : "Add tag"}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {tagOptions.map((tag) => (
                    <DropdownMenuItem
                      key={tag.name}
                      onClick={() => setSelectedTag(tag)}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${tag.color.split(" ")[0]}`} />
                      {tag.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <button
                type="button"
                onClick={() => setIsImportant(!isImportant)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                  isImportant
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <Star className={`h-3.5 w-3.5 ${isImportant ? "fill-current" : ""}`} />
                Important
              </button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle("");
                  setIsImportant(false);
                  setSelectedTag(null);
                }}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={!title.trim()}>
                Add Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
