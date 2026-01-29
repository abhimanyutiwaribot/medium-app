import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemePicker from "../components/theme/theme-picker";
import { THEMES, type ThemeKey } from "../themes";
import ArticleRenderer from "../components/article/article-renderer";
import { apifetch } from "../api/client";

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
    })
  }, [id])

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await apifetch(`/q/${id}/publish`, {
        method: "POST",
        body: JSON.stringify({ theme })
      });
      navigate(`/article/${id}`);
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const selectedTheme = theme ? THEMES[theme] : null;

  return (
    <div className="min-h-screen relative text-white">
      {/* Background Layer */}
      {selectedTheme && (
        <>
          {/* Base background image */}
          <div
            className="fixed inset-0 -z-10 bg-cover bg-center"
            style={{
              backgroundImage: `url(${selectedTheme.url})`,
            }}
          />

          {/* Vignette effect - darker edges, lighter center */}
          <div
            className="fixed inset-0 -z-10"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
            }}
          />
        </>
      )}

      {/* Publish Button */}
      <div className="fixed top-4 right-6 z-50">
        <button
          onClick={handlePublish}
          disabled={isPublishing || !theme}
          className="px-6 py-2.5 rounded-full font-medium transition-all bg-white text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg backdrop-blur-sm"
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>

      {/* Content Area */}
      <div className="max-w-3xl mx-auto px-4 py-16 relative">
        {/* Content container with subtle background for readability */}
        <div className="relative">
          {/* Optional: Subtle glow behind content for extra separation */}
          <div
            className="absolute inset-0 -z-1 blur-3xl opacity-30 bg-black rounded-3xl"
            style={{ transform: 'scale(1.02)' }}
          />

          <article className="relative space-y-6">
            <h1
              className="text-4xl md:text-5xl font-normal font-comic leading-tight"
              style={{
                textShadow: '2px 2px 12px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.5)'
              }}
            >
              {title}
            </h1>

            <div
              className="prose prose-invert prose-lg max-w-none"
              style={{
                textShadow: '1px 1px 8px rgba(0,0,0,0.8)'
              }}
            >
              <ArticleRenderer content={content} />
            </div>
          </article>
        </div>
      </div>

      {/* Theme Picker */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="bg-gradient-to-t from-white/95 to-transparent backdrop-blur-sm px-4 pt-6 pb-4">
          <ThemePicker selected={theme} onSelect={setTheme} />
        </div>
      </div>
    </div>
  );
}