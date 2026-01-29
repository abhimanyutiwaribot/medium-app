import { useEffect, useState } from "react";
import { apifetch } from "../api/client";
import Heatmap from "@/components/profile/heatmap";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [articles, setArticles] = useState<any>(null);
  const [tab, setTab] = useState<"published" | "drafts">("published");

  useEffect(() => {
    apifetch("/profile/articles", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(setArticles);
  }, []);

  useEffect(() => {
    apifetch("/profile/streak", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(setData);
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  const currentArticles = tab === "published" ? articles?.published : articles?.drafts;

  return (
  <div className="min-h-screen bg-black text-white">
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-3">Profile</h1>
        <p className="text-md text-gray-400">Keep writing. Consistency compounds.</p>
      </div>

      {/* Streak Stats - Inline, No Cards */}
      <div className="flex gap-16 mb-12 pb-16 border-b border-white/10">
        <div>
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">
            Current Streak
          </div>
          <div className="text-3xl font-bold">
            {data.currentStreak}
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wider">
            Longest Streak
          </div>
          <div className="text-2xl font-bold">
            {data.longestStreak}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mb-12 pb-16 border-b border-white/10">
        <h2 className="text-sm text-gray-500 uppercase tracking-wider mb-8">
          Activity
        </h2>
        <Heatmap data={data.heatmap} />
      </div>

      {/* Articles */}
      {articles && (
        <div>
          <div className="flex gap-8 mb-8 border-b border-white/10">
            <button
              onClick={() => setTab("published")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                tab === "published" ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Published
              {tab === "published" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>

            <button
              onClick={() => setTab("drafts")}
              className={`pb-4 text-sm font-medium transition-colors relative ${
                tab === "drafts" ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              Drafts
              {tab === "drafts" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
              )}
            </button>
          </div>

          <div className="space-y-1">
            {currentArticles?.map((a: any) => (
              <button
                key={a.id}
                className="w-full py-4 px-4 -mx-4 flex items-center justify-between hover:bg-white/5 rounded-lg transition-colors text-left group"
                onClick={() =>
                  navigate(
                    tab === "published" ? `/article/${a.id}` : `/editor/${a.id}`
                  )
                }
              >
                <span className="font-medium">{a.title}</span>
                <span className="text-gray-500 group-hover:text-white transition-colors text-sm">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
);
}