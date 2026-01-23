// sidebar/app-sidebar.tsx
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// import { X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Notifications", href: "/notifications" },
  { label: "Profile", href: "/profile" },
  { label: "Settings", href: "/settings" },
];

export function AppSidebar() {
  const { open, setOpen } = useSidebar();

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   window.location.href = "/";
  // };

  return (
    <>
      {/* Backdrop - Close sidebar when clicking outside */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        className={`fixed left-0 top-0 h-full  w-[50vw] max-w-[200px] sm:w-48 bg-[#000000] border-none z-50 transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } `}
      >
        {/* Close button inside sidebar */}
      
          <SidebarTrigger className="absolute left-4 top-4 p-2 text-[#dedede] hover:text-white hover:bg-[#1a1d21] rounded-md transition-colors" />

        <SidebarContent className="pt-16">
          {/* User Profile */}
          {/* <div className="px-4 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1d21]">
              <div className="h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-bold">JD</span>
              </div>
              <div>
                <h3 className="font-bold text-white">John Doe</h3>
                <p className="text-sm text-[#8a8d91]">@johndoe</p>
              </div>
            </div>
          </div> */}

          {/* Navigation */}
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton asChild>
                      <a 
                        href={item.href} 
                        className="flex items-center gap-3 px-4 py-3 text-white rounded-lg -mx-0"
                        onClick={() => setOpen(false)} // Close sidebar on click
                      >
                        <span className="font-medium">{item.label}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Write Button */}
          {/* <div className="mt-6 px-4">
            <a
              href="/editor"
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg transition-all py-3 flex items-center justify-center gap-2 shadow-lg"
              onClick={() => setOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Write Story
            </a>
          </div> */}
        </SidebarContent>

        {/* Footer
        <SidebarFooter className="p-4 border-t border-[#2a2d32]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-[#b9c0c9] hover:text-white hover:bg-[#1a1d21] rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </SidebarFooter> */}
      </Sidebar>
    </>
  );
}