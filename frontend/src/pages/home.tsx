import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apifetch } from "../api/client";

type FeedItem = {
  id: string;
  title: string;
  author: {
    username: string;
    name: string | null;
  };
  readingTime: number;
  published_At: string;
};

export default function HomePage() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    apifetch("/a")
      .then((res) => res.items ?? res.data ?? res)
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6">Loading feed…</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {isAuthenticated && (
        <div className="mb-8 border-b pb-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome back 👋
          </h2>

          <div className="flex gap-4">
            <Link
              to="/editor"
              className="px-4 py-2 bg-black text-white rounded text-sm"
            >
              Continue writing
            </Link>

            <Link
              to="/article/drafts"
              className="px-4 py-2 border rounded text-sm"
            >
              Your drafts
            </Link>
          </div>
        </div>
      )}


      <h1 className="text-2xl font-semibold mb-6">
        Latest Articles
      </h1>

      {items.length === 0 && (
        <div className="text-gray-500">
          No articles published yet.
        </div>
      )}

      <div className="space-y-6">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/article/${item.id}`}
            className="block border-b pb-4 hover:bg-gray-50 transition"
          >
            <h2 className="text-xl font-medium">
              {item.title}
            </h2>

            <div className="text-sm text-gray-500 mt-1">
              By {item.author.name ?? item.author.username}
              {" · "}
              {item.readingTime} min read
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
