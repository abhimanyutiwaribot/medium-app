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

  useEffect(() => {
    apifetch("/a")
      .then((res) => res.items ?? res.data ?? res)
      .then(setItems)
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen  text-[#8a8d91] font-mono p-12">
        Loading feed...
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-[#8a8d91] font-comic font-normal p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* Section Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4a4d52]" />
          <h1 className="text-xl font-bold tracking-tight text-[#dedede]">latest articles</h1>
        </div>

        {/* Tree Container */}
        <div className="relative ml-[3px]">
          {/* Main Vertical Stem */}
          <div className="absolute left-0 top-0 bottom-6 w-[1px] bg-[#2a2d32]" />

          {items.map((item) => (
            <div key={item.id} className="relative group flex items-start h-20">

              <svg
                className="absolute left-0 top-0 w-10 h-full text-[#2a2d32] group-hover:text-[#4a4d52] transition-colors"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M1 25H35" // Straight down to 20, straight right to 35
                  stroke="currentColor"
                  strokeWidth="1"
                  shapeRendering="crispEdges"
                />
              </svg>

              {/* The Dot at the end of the branch */}
              <div className="absolute left-[35px] top-[42px] w-1.5 h-1.5 rounded-full bg-[#4a4d52] group-hover:bg-white transition-all shadow-[0_0_8px_rgba(255,255,255,0)] group-hover:shadow-[0_0_10px_white]" />

              {/* Text Content */}
              <Link
                to={`/article/${item.id}`}
                className="ml-14 mt-8 flex flex-col md:flex-row md:items-baseline gap-2"
              >
                <h2 className="text-[18px] text-[#d1d1d1] group-hover:text-white transition-colors leading-snug">
                  {item.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#4a4d52] whitespace-nowrap">
                  <span>. . . . by</span>
                  <span className="text-[#6a6d72] italic group-hover:text-gray-300">@{item.author.username}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}