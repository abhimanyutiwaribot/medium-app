import { useState, useEffect } from "react";
import { apifetch } from "../api/client";
import Heatmap from "@/components/profile/heatmap";
import { useNavigate } from "react-router-dom";
import EditProfileModal from "@/components/profile/edit-profile-modal";
import { Settings, Plus, ArrowLeft, History } from "lucide-react";
import { useAuth } from "../context/auth-context";

export default function Profile() {
  const navigate = useNavigate();
  const { user: userProfile, patch } = useAuth();
  const [data, setData] = useState<any>(null);
  const [articles, setArticles] = useState<any>(null);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [tab, setTab] = useState<"published" | "drafts" | "bookmarks">("published");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    apifetch("/profile/articles").then(setArticles);
    apifetch("/profile/streak").then(setData);
    apifetch("/profile/bookmarks").then(setBookmarks);
  }, []);

  if (!data || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground animate-pulse font-medium">Preparing your workspace...</div>
      </div>
    );
  }

  const handleProfileUpdate = (updated: any) => {
    patch(updated);
  };

  const currentArticles =
    tab === "published" ? articles?.published :
      tab === "drafts" ? articles?.drafts :
        bookmarks;

  return (
    <div className="min-h-screen bg-transparent animate-in slide-in-from-bottom-2 duration-700">
      {/* Sticky header with back button */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-clean"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Profile</span>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-20">

        {/* Profile Header */}
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between gap-5 md:gap-8">
          <div className="flex gap-4 md:gap-8 items-center">
            {/* Avatar */}
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-muted border border-border flex-shrink-0 overflow-hidden">
              {userProfile.avatar ? (
                <img src={userProfile.avatar} alt={userProfile.username} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold text-muted-foreground uppercase">
                  {userProfile.username[0]}
                </div>
              )}
            </div>

            {/* Name + bio */}
            <div className="space-y-1 md:space-y-2 min-w-0">
              <h1 className="text-2xl md:text-4xl font-bold tracking-tight truncate">
                {userProfile.name || userProfile.username}
              </h1>
              <p className="text-muted-foreground text-sm md:text-lg max-w-lg leading-relaxed line-clamp-2">
                {userProfile.bio || "No bio yet."}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:opacity-90 transition-clean"
            >
              <Plus className="w-4 h-4" />
              <span>New Story</span>
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="p-2 md:p-2.5 rounded-full border border-border hover:bg-muted transition-clean"
            >
              <Settings className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-10 md:mb-16">
          <div className="space-y-0.5 md:space-y-1">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Streak</div>
            <div className="text-xl md:text-3xl font-bold">{data.currentStreak} <span className="text-sm md:text-base font-normal text-muted-foreground">days</span></div>
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Longest Streak</div>
            <div className="text-xl md:text-3xl font-bold">{data.longestStreak} <span className="text-sm md:text-base font-normal text-muted-foreground">days</span></div>
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Followers</div>
            <div className="text-xl md:text-3xl font-bold">{userProfile._count?.followers ?? 0}</div>
          </div>
          <div className="space-y-0.5 md:space-y-1">
            <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">Published</div>
            <div className="text-xl md:text-3xl font-bold">{userProfile._count?.article ?? 0}</div>
          </div>
        </div>

        {/* Activity Heatmap */}
        <div className="mb-10 md:mb-16 pb-10 md:pb-16 border-b border-border overflow-x-auto">
          <h2 className="text-[10px] md:text-sm font-bold uppercase tracking-widest mb-6 md:mb-10 text-muted-foreground">Writing Activity</h2>
          <Heatmap data={data.heatmap} />
        </div>

        {/* Articles List */}
        <div>
          <div className="flex gap-6 md:gap-8 mb-6 md:mb-10 border-b border-border transition-all">
            {["published", "drafts", "bookmarks"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`pb-3 md:pb-4 text-xs md:text-sm font-bold uppercase tracking-widest transition-all relative ${tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {t}
                {tab === t && (
                  <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
                )}
              </button>
            ))}
          </div>

          <div className="space-y-1">
            {currentArticles?.map((a: any) => (
              <div
                key={a.id}
                className="group w-full py-4 md:py-6 flex items-center justify-between border-b border-border/50 hover:bg-muted/30 transition-clean px-3 md:px-4 -mx-3 md:-mx-4 rounded-xl cursor-pointer"
                onClick={() => navigate(tab === "drafts" ? `/editor/${a.id}` : `/article/${a.id}`)}
              >
                <div className="space-y-1 truncate pr-4">
                  <span className="text-base md:text-xl font-medium group-hover:translate-x-1 transition-transform block truncate">
                    {a.title}
                  </span>
                  {tab === "bookmarks" && a.author && (
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                      by {a.author.name || `@${a.author.username}`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {(tab === "published" || tab === "drafts") && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/article/${a.id}/vS`);
                      }}
                      className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-all flex items-center justify-center"
                      title="Version History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  )}
                  <span className="text-muted-foreground group-hover:text-foreground transition-clean flex-shrink-0">
                    →
                  </span>
                </div>
              </div>
            ))}

            {(!currentArticles || currentArticles.length === 0) && (
              <div className="py-12 md:py-20 text-center text-muted-foreground italic border border-dashed border-border rounded-2xl text-sm animate-in fade-in duration-500">
                No {tab} found yet.
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={userProfile}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
}