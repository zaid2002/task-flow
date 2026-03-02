"use client";

import { CheckCircle2, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

import { useAuth } from "@/components/auth-context";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TodoHeaderProps {
  onMenuClick?: () => void;
}

export function TodoHeader({ onMenuClick }: TodoHeaderProps) {
  const { theme, setTheme } = useTheme();
  const { logOut, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  return (
    <header className="flex items-center justify-between border-b border-border px-6 py-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="h-9 w-9 rounded-lg md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">TaskFlow</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-9 w-9 rounded-lg"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <div
          onClick={handleLogout}
          className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors"
          title="Click to log out"
        >
          <span className="text-sm font-medium text-muted-foreground">{userInitial}</span>
        </div>
      </div>
    </header>
  );
}
