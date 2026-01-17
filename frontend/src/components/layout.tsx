import type React from "react";
import Navbar from "./navbar";

export default function Layout(
  {children}: {children: React.ReactNode}
){
  return(
    <div className="min-h-screen">
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}