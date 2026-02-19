import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans transition-clean flex flex-col items-center py-32 md:py-40">
      <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/5">
        <div className="max-w-5xl mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <span className="font-bold tracking-tight text-lg">Xedium</span>
          <div className="flex gap-6 md:gap-8">
            <button onClick={() => navigate('/signin')} className="text-sm font-medium opacity-40 hover:opacity-100 transition-all">Sign In</button>
            <button onClick={() => navigate('/signup')} className="text-sm font-bold underline underline-offset-4 hover:opacity-70 transition-all">Join</button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl w-full px-6 md:px-0 space-y-12 md:space-y-16">
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] md:leading-[1.05]">
            A quiet place <br />
            <span className="opacity-20 italic">to think and write.</span>
          </h1>
        </div>

        <div className="pt-4">
          <button
            onClick={() => navigate('/signup')}
            className="group w-full md:w-auto px-8 py-4 bg-foreground text-background text-lg font-bold rounded-xl flex items-center justify-center gap-3 hover:-translate-y-1 transition-all"
          >
            Start writing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-10 pt-12 md:pt-16 border-t border-border/10">
          <div className="space-y-2">
            <h3 className="font-bold opacity-80 flex items-center gap-3">No noise.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The editor is just a clean slate. No popups, no sidebars, no distractions. Just you and your thoughts.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold opacity-80 flex items-center gap-3">For humans.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              No complex algorithms here. Your stories are shared chronologically with people who actually want to listen.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold opacity-80 flex items-center gap-3">Take your time.</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Writing is personal.
            </p>
          </div>
        </div>

        {/* Closing */}
        <div className="pt-10 opacity-30 text-[10px] md:text-xs font-medium uppercase tracking-[0.25em]">
          Keep it simple. Keep it real.
        </div>
      </main>
    </div>
  );
}
