import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";
import { Home, Bell, User, Settings, LogOut } from "lucide-react";
import { apifetch } from "../api/client";
import { useAuth } from "../context/auth-context";
import { toast } from "sonner";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Notifications", href: "/notifications", icon: Bell },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await apifetch("/user/signout", { method: "POST" });
      toast.success("Signed out successfully");
    } catch { }

    // Clear legacy tokens if any and refresh auth context
    localStorage.removeItem("token");
    await auth.refresh();

    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 transition-clean"
          onClick={() => setOpen(false)}
        />
      )}

      <Sidebar
        className={`fixed left-0 top-0 h-full w-[280px] bg-background border-r border-border z-50 transition-transform duration-500 ease-out ${open ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-6 h-16 border-b border-border/50">
          <span className="font-bold tracking-tighter text-xl">Xedium</span>
          <SidebarTrigger className="p-2 hover:bg-muted rounded-full transition-clean" />
        </div>

        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="gap-2">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.href}
                        className="flex items-center gap-4 px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-clean"
                        onClick={() => setOpen(false)}
                      >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-base">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <div className="mt-auto pt-10 px-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 w-full px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-clean"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-base">Sign out</span>
            </button>
          </div>
        </SidebarContent>
      </Sidebar>
    </>
  );
}