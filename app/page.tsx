"use client";

import { useState, useEffect } from "react";
import { TodoHeader } from "@/components/todo/todo-header";
import { TodoSidebar } from "@/components/todo/todo-sidebar";
import { TodoList } from "@/components/todo/todo-list";
import { MobileNav } from "@/components/todo/mobile-nav";
import { SubtaskView } from "@/components/todo/subtask-view";
import type { Todo } from "@/components/todo/todo-item";
import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";

const initialTodos: Todo[] = [
  {
    id: "1",
    title: "Review project proposal for Q1 launch",
    completed: false,
    important: true,
    dueDate: "Today",
    tag: { name: "Work", color: "bg-primary/20 text-primary" },
    subtasks: [
      { id: "1-1", title: "Read through proposal document", completed: true },
      { id: "1-2", title: "Check budget estimates", completed: false },
      { id: "1-3", title: "Review timeline", completed: false },
    ],
  },
  {
    id: "2",
    title: "Schedule team sync meeting",
    completed: false,
    important: false,
    dueDate: "Tomorrow",
    tag: { name: "Work", color: "bg-primary/20 text-primary" },
  },
  {
    id: "3",
    title: "Buy groceries for the week",
    completed: true,
    important: false,
    dueDate: "Today",
    tag: { name: "Shopping", color: "bg-chart-5/20 text-chart-5" },
  },
  {
    id: "4",
    title: "Complete online course module 5",
    completed: false,
    important: false,
    dueDate: "Jan 30",
    tag: { name: "Personal", color: "bg-chart-2/20 text-chart-2" },
  },
  {
    id: "5",
    title: "Prepare presentation slides",
    completed: false,
    important: true,
    dueDate: "Jan 28",
    tag: { name: "Work", color: "bg-primary/20 text-primary" },
    subtasks: [
      { id: "5-1", title: "Create outline", completed: true },
      { id: "5-2", title: "Design slide templates", completed: true },
      { id: "5-3", title: "Add content to slides", completed: false },
      { id: "5-4", title: "Add visuals and charts", completed: false },
    ],
  },
  {
    id: "6",
    title: "Call dentist for appointment",
    completed: true,
    important: false,
    tag: { name: "Personal", color: "bg-chart-2/20 text-chart-2" },
  },
  {
    id: "7",
    title: "Update portfolio website",
    completed: false,
    important: false,
    dueDate: "2024-02-01",
    tag: { name: "Personal", color: "bg-chart-2/20 text-chart-2" },
  },
];

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeCategory, setActiveCategory] = useState("inbox");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [selectedTodoId, setSelectedTodoId] = useState<string | null>(null);

  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load from Firestore
  useEffect(() => {
    if (!user) {
      setTodos([]);
      return;
    }

    const q = query(
      collection(db, "todos"),
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[];
      // Client-side sort or use orderBy in query (requires index)
      // For now simple client side sort
      setTodos(todosData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    });

    return () => unsubscribe();
  }, [user]);



  const selectedTodo = selectedTodoId ? todos.find((t) => t.id === selectedTodoId) : null;

  const handleToggle = async (id: string) => {
    if (!user) return;
    const todoToToggle = todos.find(t => t.id === id);
    if (todoToToggle) {
      await updateDoc(doc(db, "todos", id), {
        completed: !todoToToggle.completed
      });
    }
  };

  const handleToggleImportant = async (id: string) => {
    if (!user) return;
    const todoToToggle = todos.find(t => t.id === id);
    if (todoToToggle) {
      await updateDoc(doc(db, "todos", id), {
        important: !todoToToggle.important
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, "todos", id));
  };

  const handleEdit = async (id: string, newTitle: string) => {
    if (!user) return;
    await updateDoc(doc(db, "todos", id), {
      title: newTitle
    });
  };

  const handleAdd = async (
    title: string,
    important: boolean,
    dueDate?: string,
    tag?: { name: string; color: string }
  ) => {
    if (!user) return;
    await addDoc(collection(db, "todos"), {
      title,
      completed: false,
      important,
      dueDate: dueDate || null,
      tag: tag || null, // data validation
      subtasks: [],
      userId: user.uid,
      createdAt: Date.now()
    });
  };

  const handleOpenSubtasks = (id: string) => {
    setSelectedTodoId(id);
  };

  const handleAddSubtask = async (todoId: string, title: string) => {
    if (!user) return;
    const todo = todos.find(t => t.id === todoId);
    if (todo) {
      const newSubtask = {
        id: `${todoId}-${Date.now()}`,
        title,
        completed: false,
      };
      await updateDoc(doc(db, "todos", todoId), {
        subtasks: [...(todo.subtasks || []), newSubtask]
      });
    }
  };

  const handleToggleSubtask = async (todoId: string, subtaskId: string) => {
    if (!user) return;
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedSubtasks = (todo.subtasks || []).map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);

    await updateDoc(doc(db, "todos", todoId), {
      subtasks: updatedSubtasks,
      completed: allCompleted
    });
  };

  const handleDeleteSubtask = async (todoId: string, subtaskId: string) => {
    if (!user) return;
    const todo = todos.find(t => t.id === todoId);
    if (!todo) return;

    const updatedSubtasks = (todo.subtasks || []).filter(
      (subtask) => subtask.id !== subtaskId
    );

    const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every((s) => s.completed);

    await updateDoc(doc(db, "todos", todoId), {
      subtasks: updatedSubtasks,
      completed: updatedSubtasks.length > 0 ? allCompleted : todo.completed
    });
  };

  // Filter todos based on category
  const categoryFilteredTodos = todos.filter((todo) => {
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    switch (activeCategory) {
      case "today":
        return todo.dueDate === todayStr || todo.dueDate === "Today"; // Handle old hardcoded value just in case
      case "upcoming":
        return todo.dueDate && !todo.completed && todo.dueDate !== todayStr && todo.dueDate !== "Today";
      case "important":
        return todo.important;
      default:
        return true;
    }
  });


  const counts = {
    inbox: todos.filter((t) => !t.completed).length,
    today: todos.filter((t) => {
      const todayStr = new Date().toISOString().split("T")[0];
      return !t.completed && (t.dueDate === todayStr || t.dueDate === "Today");
    }).length,
    upcoming: todos.filter((t) => {
      const todayStr = new Date().toISOString().split("T")[0];
      return !t.completed && t.dueDate && t.dueDate !== todayStr && t.dueDate !== "Today";
    }).length,
    important: todos.filter((t) => !t.completed && t.important).length,
  };

  if (loading) return null; // Or a loading spinner

  return (
    <div className="flex h-screen flex-col bg-background">
      <TodoHeader />
      <div className="flex flex-1 overflow-hidden">
        <TodoSidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          counts={counts}
        />
        {selectedTodo ? (
          <SubtaskView
            todo={selectedTodo}
            onBack={() => setSelectedTodoId(null)}
            onAddSubtask={handleAddSubtask}
            onToggleSubtask={handleToggleSubtask}
            onDeleteSubtask={handleDeleteSubtask}
          />
        ) : (
          <TodoList
            todos={categoryFilteredTodos}
            category={activeCategory}
            filter={filter}
            onFilterChange={setFilter}
            onToggle={handleToggle}
            onToggleImportant={handleToggleImportant}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onAdd={handleAdd}
            onOpenSubtasks={handleOpenSubtasks}
          />
        )}
      </div>
      {!selectedTodo && (
        <MobileNav
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}
    </div>
  );
}
