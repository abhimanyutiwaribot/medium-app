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
  },[id])

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await apifetch(`/q/${id}/publish`, {
        method: "POST",
        body: JSON.stringify({ theme })
      });
      // Navigate to published article or show success message
      navigate(`/article/${id}`);
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const selectedTheme = theme ? THEMES[theme] : null;

  return (
    <div className={`min-h-screen relative ${
      selectedTheme?.textColor === "light"
      ? "text-white"
      : "text-black"
    }`}>
      {/* Background */}
      {selectedTheme && (
        <div
          className="fixed inset-0 -z-10 bg-cover bg-center"
          style={{
            backgroundImage: `url(${selectedTheme.url})`,
          }}
        >
          <div
            className={`absolute inset-0 ${
              selectedTheme.overlay === "dark"
                ? "bg-black/60"
                : "bg-white/80"
            }`}
          />
        </div>
      )}

      {/* Publish Button */}
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={handlePublish}
          disabled={isPublishing || !theme}
          className={`px-6 py-2.5 rounded-full font-medium transition-all ${
            selectedTheme?.textColor === "light"
              ? "bg-white text-black hover:bg-gray-100"
              : "bg-black text-white hover:bg-gray-800"
          } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
        >
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-normal font-comic mb-6">
          {title}
        </h1>
        <ArticleRenderer content={content} />
      </div>

      {/* Theme Picker */}
      <div className="fixed bottom-0 left-0 right-0 bg-transparent border-none px-4">
        <ThemePicker selected={theme} onSelect={setTheme} />
      </div>
    </div>
  );
}