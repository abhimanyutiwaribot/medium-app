import { SidebarTrigger } from "@/components/ui/sidebar"
import { Link } from "react-router-dom"
import { PenLine } from "lucide-react"
import { useAuth } from "../context/auth-context"

export function Navbar() {
  const { user, loading } = useAuth();

  const initials = user
    ? (user.name || user.username)
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
    : "";

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-clean" />
          <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-clean">
            Xedium
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          {loading ? (
            // Skeleton while the single /user/me call resolves
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/editor"
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-clean"
              >
                <PenLine className="w-4 h-4 md:hidden" />
                <span className="hidden md:inline">Write</span>
              </Link>

              <Link to="/profile" className="group relative">
                <div className="h-9 w-9 rounded-full bg-muted border-2 border-border group-hover:border-primary/50 overflow-hidden transition-all duration-200 flex items-center justify-center shadow-sm">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                      {initials}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-clean">
                Sign in
              </Link>
              <Link
                to="/signup"
                className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium hover:opacity-90 transition-clean"
              >
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}