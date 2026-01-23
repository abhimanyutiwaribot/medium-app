import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/sidebar/app-sidebar"
import { Navbar } from "./navbar"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen w-full bg-black relative">
        {/* Sidebar */}
        <AppSidebar />
        
        {/* Main content */}
        <main className="relative">
          <Navbar />
          <div className="p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}