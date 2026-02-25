"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Trash2, Calendar, MoreHorizontal, ChevronRight, ListTodo, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, isToday, isBefore, startOfDay, parseISO } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  important: boolean;
  dueDate?: string;
  tag?: {
    name: string;
    color: string;
  };
  subtasks?: Subtask[];
  createdAt?: number;
  userId?: string;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onOpenSubtasks: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onToggleImportant, onDelete, onEdit, onOpenSubtasks }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, editTitle.trim());
      setIsEditing(false);
    } else {
      setEditTitle(todo.title); // Revert if empty
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  const subtaskCount = todo.subtasks?.length || 0;
  const completedSubtasks = todo.subtasks?.filter((s) => s.completed).length || 0;
  const hasSubtasks = subtaskCount > 0;

  return (
    <div className={cn(
      "group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/30",
      todo.completed && "opacity-60"
    )}>
      <button
        onClick={() => onToggle(todo.id)}
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          todo.completed
            ? "border-primary bg-primary"
            : "border-muted-foreground hover:border-primary"
        )}
      >
        {todo.completed && (
          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none"
          />
        ) : (
          <p className={cn(
            "text-sm font-medium text-foreground truncate",
            todo.completed && "line-through text-muted-foreground"
          )}>
            {todo.title}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1">
          {hasSubtasks && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <ListTodo className="h-3 w-3" />
              {completedSubtasks}/{subtaskCount} subtasks
            </span>
          )}
          {todo.dueDate && (
            <span className={cn(
              "flex items-center gap-1 text-xs",
              (todo.dueDate === "Today" || (todo.dueDate.includes("-") && isToday(parseISO(todo.dueDate))))
                ? "text-primary"
                : (todo.dueDate !== "Today" && todo.dueDate.includes("-") && isBefore(parseISO(todo.dueDate), startOfDay(new Date())))
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}>
              <Calendar className="h-3 w-3" />
              {todo.dueDate.includes("-")
                ? format(parseISO(todo.dueDate), "MMM d")
                : todo.dueDate
              }
            </span>
          )}
          {todo.tag && (
            <span className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs",
              todo.tag.color
            )}>
              {todo.tag.name}
            </span>
          )}
        </div>
      </div>

      <button
        onClick={() => onOpenSubtasks(todo.id)}
        className="flex items-center gap-1 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggleImportant(todo.id)}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            todo.important
              ? "text-primary hover:bg-secondary"
              : "text-muted-foreground hover:text-primary hover:bg-secondary"
          )}
        >
          <Star className={cn("h-4 w-4", todo.important && "fill-current")} />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => {
              setEditTitle(todo.title);
              setIsEditing(true);
            }}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(todo.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
