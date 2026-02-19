import { useEffect, useState } from "react";
import { apifetch } from "../api/client";
import { formatDistanceToNow } from "date-fns";
import { Bell, Heart, UserPlus, FileText, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "sonner";

type Notification = {
  id: string;
  type: "FOLLOW" | "CLAP" | "PUBLISH";
  isRead: boolean;
  createdAt: string;
  sender: {
    username: string;
    name: string | null;
    avatar: string | null;
  } | null;
  articleId: string | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const data = await apifetch("/notification");
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await apifetch(`/notification/${id}/read`, { method: "PUT" });
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      toast.error("Failed to mark as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await apifetch("/notification/read-all", { method: "PUT" });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All marked as read");
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
        <Skeleton className="h-8 w-48 bg-muted" />
        {[1, 2, 3, 4, 5].map(i => (
          <Skeleton key={i} className="h-20 w-full rounded-xl bg-muted" />
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-2">
            <div className="w-1 h-3 bg-foreground" />
            <h1 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Notifications</h1>
          </div>
          {notifications.some(n => !n.isRead) && (
            <button
              onClick={markAllAsRead}
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-clean flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`group relative p-6 rounded-2xl border transition-all duration-300 ${n.isRead
                  ? "bg-transparent border-border/40"
                  : "bg-muted/30 border-primary/20 shadow-sm"
                }`}
            >
              <div className="flex gap-4">
                <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${n.type === "CLAP" ? "bg-red-500/10 text-red-500" :
                    n.type === "FOLLOW" ? "bg-blue-500/10 text-blue-500" :
                      "bg-green-500/10 text-green-500"
                  }`}>
                  {n.type === "CLAP" && <Heart className="w-5 h-5 fill-current" />}
                  {n.type === "FOLLOW" && <UserPlus className="w-5 h-5" />}
                  {n.type === "PUBLISH" && <FileText className="w-5 h-5" />}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm md:text-base">
                      {n.sender ? (
                        <Link to={`/u/${n.sender.username}`} className="font-bold hover:underline">
                          {n.sender.name || `@${n.sender.username}`}
                        </Link>
                      ) : (
                        <span className="font-bold">System</span>
                      )}
                      {" "}
                      <span className="text-muted-foreground">
                        {n.type === "CLAP" && "liked your article"}
                        {n.type === "FOLLOW" && "started following you"}
                        {n.type === "PUBLISH" && "published a new article"}
                      </span>
                      {n.articleId && (
                        <>
                          {" "}
                          <Link to={`/article/${n.articleId}`} className="font-medium text-foreground hover:underline">
                            view article
                          </Link>
                        </>
                      )}
                    </p>
                    {!n.isRead && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="p-1 hover:bg-muted rounded-full transition-clean flex-shrink-0"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {notifications.length === 0 && (
            <div className="text-center py-32 space-y-4 rounded-3xl border border-dashed border-border bg-muted/5">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Bell className="w-8 h-8 text-muted-foreground opacity-20" />
              </div>
              <p className="text-muted-foreground italic font-medium">No notifications yet.</p>
              <p className="text-xs text-muted-foreground/60 max-w-[200px] mx-auto leading-relaxed">
                When people interact with your stories or follow you, they'll show up here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
