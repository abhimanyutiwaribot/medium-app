import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { diffWords } from "diff";
import { apifetch } from "../api/client";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function ArticleDiffPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const from = params.get("from");
  const to = params.get("to");

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!from || !to) return;

    apifetch(`/q/${id}/diff?from=${from}&to=${to}`)
      .then(setData)
      .catch((err) => {
        toast.error(err.error || "Failed to load diff");
        navigate(`/article/${id}`);
      });
  }, [id, from, to, navigate]);

  if (!from || !to) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Invalid diff range.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse font-medium">Loading diff...</div>
      </div>
    );
  }

  const diff = diffWords(data.fromContent, data.toContent);

  return (
    <div className="min-h-screen bg-transparent animate-in slide-in-from-bottom-2 duration-700">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-24">

        {/* Page Header */}
        <div className="mb-10 md:mb-16 flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-clean flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              v{from} → v{to}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Word-by-word comparison between version {from} and version {to}
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-green-500/30 border border-green-500/40 inline-block" />
            Added
          </div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <span className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500/40 inline-block" />
            Removed
          </div>
        </div>

        {/* Diff Content */}
        <div className="border-t border-border/50 pt-10">
          <p className="whitespace-pre-wrap leading-9 text-lg">
            {diff.map((part: any, i: number) => {
              if (part.added) {
                return (
                  <mark
                    key={i}
                    className="bg-green-500/15 text-green-300 not-italic rounded-sm px-0.5"
                  >
                    {part.value}
                  </mark>
                );
              }
              if (part.removed) {
                return (
                  <del
                    key={i}
                    className="bg-red-500/15 text-red-400 line-through decoration-red-500/50 rounded-sm px-0.5"
                  >
                    {part.value}
                  </del>
                );
              }
              return (
                <span key={i} className="text-foreground/70">
                  {part.value}
                </span>
              );
            })}
          </p>
        </div>

      </div>
    </div>
  );
}
