"use client";

import React from "react"

import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Todo, Subtask } from "./todo-item";

interface SubtaskViewProps {
  todo: Todo;
  onBack: () => void;
  onAddSubtask: (todoId: string, title: string) => void;
  onToggleSubtask: (todoId: string, subtaskId: string) => void;
  onDeleteSubtask: (todoId: string, subtaskId: string) => void;
}

export function SubtaskView({
  todo,
  onBack,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: SubtaskViewProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const subtasks = todo.subtasks || [];
  const completedCount = subtasks.filter((s) => s.completed).length;
  const totalCount = subtasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(todo.id, newSubtaskTitle.trim());
      setNewSubtaskTitle("");
    }
  };

  return (
    <div className="flex flex-col h-full flex-1 bg-secondary/20">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border bg-background px-6 py-4 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center justify-center h-9 w-9 rounded-lg hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-foreground" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className={cn(
              "text-xl font-bold text-foreground truncate",
              todo.completed && "line-through text-muted-foreground"
            )}>
              {todo.title}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your subtasks and track progress
          </p>
        </div>
        {todo.tag && (
          <span className={cn(
            "hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
            todo.tag.color
          )}>
            {todo.tag.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto w-full space-y-8">
          {/* Progress Section */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Progress</h3>
                <p className="text-sm text-muted-foreground">Keep track of your subtasks</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
                <p className="text-xs text-muted-foreground">
                  {completedCount} of {totalCount} done
                </p>
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {totalCount > 0 && completedCount === totalCount && (
              <p className="text-sm text-primary mt-4 flex items-center justify-center gap-2 bg-primary/10 py-2 rounded-lg font-medium">
                <Check className="h-4 w-4" />
                Excellent! All subtasks are completed.
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subtasks</h3>
              {totalCount > 0 && (
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                  {totalCount} total
                </span>
              )}
            </div>

            {/* Add Subtask Form */}
            <form onSubmit={handleAddSubtask} className="group">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all shadow-sm">
                <Plus className="h-5 w-5 text-primary shrink-0 transition-transform group-focus-within:rotate-90" />
                <Input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="border-0 bg-transparent p-0 text-base placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button type="submit" size="sm" className="rounded-lg shadow-sm" disabled={!newSubtaskTitle.trim()}>
                  Add Task
                </Button>
              </div>
            </form>

            {/* Subtasks List */}
            <div className="flex flex-col gap-3">
              {subtasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-border rounded-2xl bg-card/50">
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                    <Plus className="h-8 shadow-sm text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Break it down</h3>
                  <p className="text-sm text-muted-foreground max-w-[250px]">
                    Smaller steps make it easier to reach your goal. Start by adding your first subtask!
                  </p>
                </div>
              ) : (
                subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className={cn(
                      "group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20",
                      subtask.completed && "bg-secondary/30 border-transparent shadow-none"
                    )}
                  >
                    <button
                      onClick={() => onToggleSubtask(todo.id, subtask.id)}
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all scale-100 active:scale-90",
                        subtask.completed
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground/30 hover:border-primary"
                      )}
                    >
                      {subtask.completed && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                    </button>

                    <span
                      className={cn(
                        "flex-1 text-base text-foreground font-medium transition-all",
                        subtask.completed && "line-through text-muted-foreground opacity-70"
                      )}
                    >
                      {subtask.title}
                    </span>

                    <button
                      onClick={() => onDeleteSubtask(todo.id, subtask.id)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                      title="Delete subtask"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
