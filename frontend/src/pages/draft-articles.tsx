import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../api/client";
import { Plus } from "lucide-react";

type Draft = {
  id: string;
  title: string;
  current_version: number;
  updatedAt: string;
};

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apifetch("/q/article/drafts").then((data) => setDrafts(data.drafts));
  }, []);

  return (
    <div className="min-h-screen bg-transparent animate-in slide-in-from-bottom-2 duration-700">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">

        {/* Page Header */}
        <div className="mb-16 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Your Drafts</h1>
            <p className="text-muted-foreground mt-2">
              {drafts.length} draft{drafts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => navigate("/editor")}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-full hover:opacity-90 transition-clean"
          >
            <Plus className="w-4 h-4" />
            New Story
          </button>
        </div>

        {/* Drafts List */}
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            All Drafts
          </div>

          <div className="space-y-1">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="group w-full py-6 flex items-center justify-between border-b border-border/50 hover:bg-muted/30 transition-clean px-4 -mx-4 rounded-xl cursor-pointer"
                onClick={() => navigate(`/editor/${draft.id}`)}
              >
                <div className="space-y-1">
                  <span className="text-xl font-medium group-hover:translate-x-1 transition-transform block">
                    {draft.title || "Untitled"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    v{draft.current_version} · {new Date(draft.updatedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => navigate(`/article/${draft.id}/vS`)}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-clean"
                  >
                    History
                  </button>
                  <button
                    onClick={() => navigate(`/article/${draft.id}/preview`)}
                    className="text-sm font-semibold text-primary hover:opacity-70 transition-clean"
                  >
                    Preview →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {drafts.length === 0 && (
            <div className="py-20 text-center text-muted-foreground italic border border-dashed border-border rounded-2xl">
              No drafts yet. Start writing your first story.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
