import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apifetch } from "../api/client";
import ArticleRenderer from "../components/article/article-renderer";
import { THEMES, type ThemeKey } from "../themes";

export default function Article() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchArticle() {
      const res = await apifetch(`/a/article/${id}`);
      setData(res);
    }

    fetchArticle();
  }, [id]);

  if (!data) return <div className="p-6">Loading...</div>;

  const selectedTheme = data.theme ? THEMES[data.theme as ThemeKey] : null;

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

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className={`text-sm mb-2 ${
          selectedTheme?.textColor === "light"
            ? "text-gray-300"
            : "text-gray-500"
        }`}>
          Version {data.version}
        </div>

        <h1 className="text-4xl font-normal font-serif mb-6">
          {data.title}
        </h1>

        <ArticleRenderer content={data.content} />
      </div>
    </div>
  );
}