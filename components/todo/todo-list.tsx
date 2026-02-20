"use client";

import { TodoItem, type Todo } from "./todo-item";
import { AddTodo } from "./add-todo";
import { ListFilter, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface TodoListProps {
  todos: Todo[];
  category: string;
  filter: "all" | "active" | "completed";
  onFilterChange: (filter: "all" | "active" | "completed") => void;
  onToggle: (id: string) => void;
  onToggleImportant: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onAdd: (title: string, important: boolean, tag?: { name: string; color: string }) => void;
  onOpenSubtasks: (id: string) => void;
}

const categoryTitles: Record<string, string> = {
  inbox: "Inbox",
  today: "Today",
  upcoming: "Upcoming",
  important: "Important",
};

export function TodoList({
  todos,
  category,
  filter,
  onFilterChange,
  onToggle,
  onToggleImportant,
  onDelete,
  onEdit,
  onAdd,
  onOpenSubtasks,
}: TodoListProps) {
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {categoryTitles[category] || "Tasks"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ListFilter className="h-4 w-4" />
                {filter === "all" ? "All" : filter === "active" ? "Active" : "Completed"}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onFilterChange("all")}>
                <Check className={cn("h-4 w-4 mr-2", filter !== "all" && "opacity-0")} />
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("active")}>
                <Check className={cn("h-4 w-4 mr-2", filter !== "active" && "opacity-0")} />
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onFilterChange("completed")}>
                <Check className={cn("h-4 w-4 mr-2", filter !== "completed" && "opacity-0")} />
                Completed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            />
          </div>
        </div>

        <AddTodo onAdd={onAdd} />

        <div className="flex flex-col gap-3">
          {filteredTodos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No tasks found</h3>
              <p className="text-sm text-muted-foreground">
                {filter === "completed"
                  ? "You haven't completed any tasks yet"
                  : filter === "active"
                    ? "All tasks are completed!"
                    : "Add a task to get started"}
              </p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onToggleImportant={onToggleImportant}
                onDelete={onDelete}
                onEdit={onEdit}
                onOpenSubtasks={onOpenSubtasks}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
