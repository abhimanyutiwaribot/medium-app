import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { apifetch } from "../api/client";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function VersionHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apifetch(`/q/${id}/versions`)
      .then(setData)
      .catch((err) => {
        toast.error(err.error || "You are not authorized to view this.");
        navigate(`/article/${id}`);
      });
  }, [id, navigate]);

  async function publishArticleBasedVersion(version: number) {
    await apifetch(`/q/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ version }),
    });
    navigate(`/article/${id}`);
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse font-medium">Loading versions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent animate-in slide-in-from-bottom-2 duration-700">
      <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 md:py-24">

        {/* Page Header */}
        <div className="mb-10 md:mb-16 flex items-center gap-3 md:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-clean"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Version History</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              {data.versions.length} version{data.versions.length !== 1 ? "s" : ""} · Current v{data.current_version}
            </p>
          </div>
        </div>

        {/* Versions List */}
        <div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">
            All Versions
          </div>

          <div className="space-y-1">
            {data.versions
              .slice()
              .reverse()
              .map((v: any) => {
                const isCurrent = v.version === data.current_version;
                const canCompare = v.version < data.current_version;

                return (
                  <div
                    key={v.version}
                    className="group py-4 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 hover:bg-muted/30 transition-clean px-2 -mx-2 md:px-4 md:-mx-4 rounded-xl"
                  >
                    {/* Left: version info */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-lg md:text-xl font-medium">Version {v.version}</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {v.isPublished && (
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                              Published
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs md:text-sm text-muted-foreground font-medium">
                        {new Date(v.created_At).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex items-center gap-4 md:gap-6">
                      {v.isPublished && (
                        <Link
                          to={`/article/${id}`}
                          className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-clean"
                        >
                          Read
                        </Link>
                      )}
                      {canCompare && (
                        <button
                          onClick={() =>
                            navigate(`/article/${id}/diff?from=${v.version}&to=${data.current_version}`)
                          }
                          className="text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-clean"
                        >
                          Compare →
                        </button>
                      )}
                      {!v.isPublished && (
                        <button
                          onClick={() => publishArticleBasedVersion(v.version)}
                          className="text-xs md:text-sm font-bold uppercase tracking-widest text-primary hover:opacity-70 transition-clean"
                        >
                          Publish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          {data.versions.length === 0 && (
            <div className="py-20 text-center text-muted-foreground italic border border-dashed border-border rounded-2xl">
              No versions yet.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
