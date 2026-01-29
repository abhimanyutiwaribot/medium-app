// navbar.tsx
import { SidebarTrigger } from "@/components/ui/sidebar"

export function Navbar() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <nav className="sticky top-0 z-40 border-none border-[#2a2d32]">
      <div className="max-w-none mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Left - Sidebar Trigger */}
        <div className="flex items-center">
          <SidebarTrigger className="p-2 text-[#dedede] hover:text-white hover:bg-[#1a1d21] rounded-md transition-colors" />
        </div>

        {/* Center - Logo */}
        <a href="/" className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-2xl text-white">Xedium</span>
        </a>

        {/* Right - Actions */}
        <div className="flex items-center gap-9">
          {isAuthenticated ? (
            <>
              <a
                href="/editor"
                className="text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                + Write
              </a>
              <div className="h-8 w-8 rounded-full bg-[#2a2d32] flex items-center justify-center">
                <span className="text-white text-sm">JD</span>
              </div>
            </>
          ) : (
            <>
              <a href="/signin" className="text-sm text-[#8a8d91] hover:text-white px-3">
                Sign in
              </a>
              <a
                href="/signup"
                className="text-sm bg-white hover:bg-gray-100 text-black px-4 py-2 rounded-md transition-colors"
              >
                Sign up
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}