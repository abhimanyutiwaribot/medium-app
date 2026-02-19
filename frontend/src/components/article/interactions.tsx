import { useState, useEffect } from "react";
import { ThumbsUp, Bookmark, Share2 } from "lucide-react";
import { apifetch } from "../../api/client";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

interface InteractionsProps {
  articleId: string;
  initialClaps?: number;
  initialBookmarked?: boolean;
  initialClapped?: boolean;
}

export default function ArticleInteractions({
  articleId,
  initialClaps = 0,
  initialBookmarked = false,
  initialClapped = false,
}: InteractionsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [claps, setClaps] = useState(initialClaps);
  const [clapped, setClapped] = useState(initialClapped);
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isVisible, setIsVisible] = useState(true);

  // Toggle visibility logic (video control style)
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // If clicking inside the article content or window, toggle.
      // But avoid toggling if clicking the buttons themselves (handled by stopPropagation)
      const target = e.target as HTMLElement;
      // We only toggle if the click isn't inside the fixed bar
      if (!target.closest('.interaction-bar')) {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleClap = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling visibility
    if (!user) {
      toast.error("Please sign in to like articles.");
      navigate("/signin");
      return;
    }

    try {
      const res = await apifetch(`/q/${articleId}/clap`, { method: "POST" });
      setClapped(res.clapped);
      setClaps((prev) => (res.clapped ? prev + 1 : prev - 1));
      toast.success(res.clapped ? "Liked article" : "Removed like");
    } catch (error) {
      toast.error("Failed to update like.");
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling visibility
    if (!user) {
      toast.error("Please sign in to bookmark articles.");
      navigate("/signin");
      return;
    }

    try {
      const res = await apifetch(`/q/${articleId}/bookmark`, {
        method: "POST",
      });
      setIsBookmarked(res.bookmarked);
      toast.success(res.bookmarked ? "Added to bookmarks" : "Removed from bookmarks");
    } catch (error) {
      toast.error("Failed to bookmark.");
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent toggling visibility
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: url
        });
        return;
      } catch (err) { }
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`interaction-bar fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 px-8 py-4 bg-background border border-border rounded-full shadow-2xl glass z-50 transition-all duration-500 ease-in-out ${isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-24 opacity-0 pointer-events-none md:translate-y-0 md:opacity-100 md:pointer-events-auto"
        }`}
    >
      <button
        onClick={handleClap}
        className="flex items-center gap-2 group text-muted-foreground hover:text-foreground transition-all focus:outline-none"
      >
        <ThumbsUp
          className={`w-5 h-5 transition-transform group-active:scale-125 ${clapped ? "text-primary fill-primary/20" : ""}`}
        />
        <span className="text-sm font-bold">{claps}</span>
      </button>

      <div className="w-[1px] h-4 bg-border" />

      <button
        onClick={handleBookmark}
        className={`${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"} transition-all focus:outline-none`}
      >
        <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
      </button>

      <div className="w-[1px] h-4 bg-border" />

      <button
        onClick={handleShare}
        className="text-muted-foreground hover:text-foreground transition-all focus:outline-none"
      >
        <Share2 className="w-5 h-5 hover:rotate-12" />
      </button>
    </div>
  );
}
