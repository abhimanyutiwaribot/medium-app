import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { apifetch } from "../api/client";
import { UserPlus, UserCheck, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../context/auth-context";

export default function PublicProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await apifetch(`/profile/u/${username}`);
        setProfile(data);
      } catch (error) {
        toast.error("User not found");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    if (!user) {
      toast.error("Please sign in to follow users.");
      navigate("/signin");
      return;
    }

    try {
      const res = await apifetch(`/profile/follow/${profile.id}`, {
        method: "POST"
      });
      setProfile({
        ...profile, isFollowing: res.followed, _count: {
          ...profile._count,
          followers: res.followed ? profile._count.followers + 1 : profile._count.followers - 1
        }
      });
      toast.success(res.followed ? `Following @${username}` : `Unfollowed @${username}`);
    } catch (error) {
      toast.error("Failed to follow user.");
    }
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto px-6 py-20 space-y-12">
      <div className="flex gap-8 items-center">
        <Skeleton className="w-24 h-24 rounded-full bg-muted" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 bg-muted" />
          <Skeleton className="h-4 w-32 bg-muted" />
        </div>
      </div>
      <div className="space-y-4 pt-10">
        <Skeleton className="h-6 w-full bg-muted" />
        <Skeleton className="h-6 w-full bg-muted" />
      </div>
    </div>
  );

  if (!profile) return <div className="p-20 text-center text-muted-foreground font-medium">User not found</div>;

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-10 items-start justify-between mb-20 pb-16 border-b border-border">
          <div className="flex gap-8 items-center">
            <div className="w-24 h-24 rounded-full bg-muted border border-border overflow-hidden flex-shrink-0">
              {profile.avatar && (
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight">{profile.name || profile.username}</h1>
              <p className="text-muted-foreground text-lg italic">@{profile.username}</p>
              <div className="flex gap-6 mt-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                <span>{profile._count.followers} Followers</span>
                <span>{profile._count.following} Following</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFollow}
            className={`px-8 py-3 rounded-full text-sm font-bold transition-clean flex items-center gap-2 ${profile.isFollowing
              ? "bg-secondary text-secondary-foreground border border-border"
              : "bg-primary text-primary-foreground"
              }`}
          >
            {profile.isFollowing ? (
              <>
                <UserCheck className="w-4 h-4" />
                Following
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Follow
              </>
            )}
          </button>
        </div>

        <div className="mb-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-8 flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Biography
          </h2>
          <p className="article-content text-2xl leading-relaxed italic">
            "{profile.bio || "This user hasn't written a bio yet."}"
          </p>
        </div>

        {/* Articles List */}
        <div className="mt-20">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-1 h-3 bg-muted-foreground" />
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Latest Publications</h2>
          </div>

          <div className="space-y-1">
            {profile.articles?.map((article: any) => (
              <Link
                key={article.id}
                to={`/article/${article.id}`}
                className="group w-full py-8 flex items-center justify-between border-b border-border/50 hover:bg-muted/30 transition-clean px-6 -mx-6 rounded-2xl"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold tracking-tight group-hover:text-muted-foreground transition-clean">{article.title}</h3>
                  <div className="text-sm font-medium text-muted-foreground">
                    {new Date(article.published_At).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric"
                    })}
                  </div>
                </div>
                <div className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all text-xl">
                  →
                </div>
              </Link>
            ))}
            {(!profile.articles || profile.articles.length === 0) && (
              <div className="text-muted-foreground italic py-20 text-center border border-dashed border-border rounded-2xl">
                No articles published yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
