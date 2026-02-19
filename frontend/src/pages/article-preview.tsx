import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemePicker from "../components/theme/theme-picker";
import { THEMES, type ThemeKey } from "../themes";
import ArticleRenderer from "../components/article/article-renderer";
import { apifetch } from "../api/client";
import { ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";

export default function ArticlePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<ThemeKey | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    apifetch(`/q/edit/${id}`, {
      method: "GET"
    }).then((data) => {
      setTitle(data.title)
      setContent(data.content_markdown)
    }).catch((err) => {
      toast.error(err.error || "Failed to load preview");
      navigate("/");
    })
  }, [id, navigate])

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await apifetch(`/q/${id}/publish`, {
        method: "POST",
        body: JSON.stringify({ theme })
      });
      toast.success("Article published successfully!");
      navigate(`/article/${id}`);
    } catch (error) {
      toast.error("Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const selectedTheme = theme ? THEMES[theme] : null;

  return (
    <div className={`min-h-screen relative animate-in fade-in duration-1000 ${selectedTheme ? "" : "bg-background"}`}>
      {/* Theme Background Layer */}
      {selectedTheme && (
        <div className="fixed inset-0 -z-10 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url(${selectedTheme.url})` }}>
          <div className={`absolute inset-0 ${selectedTheme.overlay === "dark" ? "bg-black/40" : "bg-white/40"}`} />
        </div>
      )}

      {/* Control Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-clean">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-widest text-muted-foreground truncate max-w-[100px] md:max-w-none">
              Preview & Publish
            </span>
          </div>

          <button
            onClick={handlePublish}
            disabled={isPublishing || !theme}
            className="flex items-center gap-2 px-4 md:px-8 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-full hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-xl shadow-primary/20"
            title="Confirm Publish"
          >
            {isPublishing ? "..." : (
              <>
                <Check className="w-4 h-4" />
                <span className="hidden md:inline">Confirm Publish</span>
                <span className="md:hidden">Publish</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div
        className="max-w-3xl mx-auto px-6 py-12 md:py-24 transition-all duration-500"
        style={{ color: selectedTheme?.color || (selectedTheme && selectedTheme.overlay === "light" ? "#333333" : "#ffffff") }}
      >
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.05]">
            {title}
          </h1>
        </header>

        <section className="article-content">
          <ArticleRenderer content={content} />
        </section>
      </div>

      {/* Theme Selector Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-background/95 backdrop-blur-md border-t border-border/50 p-6 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-500">
          <div className="max-w-5xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 ml-2">Choose Visual Style</div>
            <ThemePicker selected={theme} onSelect={setTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}