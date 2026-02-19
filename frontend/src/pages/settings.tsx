import { useState } from "react";
import { useAuth } from "../context/auth-context";
import { apifetch } from "../api/client";
import { toast } from "sonner";
import { User, Mail, Camera, Save, Shield, AtSign, FileText, Lock, KeyRound } from "lucide-react";

type Tab = "general" | "security";

export default function SettingsPage() {
  const { user, patch } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    avatar: user?.avatar || "",
    username: user?.username || ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  if (!user) return null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await apifetch("/profile/update", {
        method: "PUT",
        body: JSON.stringify(formData)
      });
      patch(updated);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await apifetch("/user/password", {
        method: "POST",
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      toast.success("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      toast.error(err.error || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large (>2MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-transparent animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-1 h-3 bg-foreground" />
          <h1 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Navigation Sidebar */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${activeTab === "general" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
            >
              <User className="w-4 h-4" />
              General
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 ${activeTab === "security" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
                }`}
            >
              <Shield className="w-4 h-4" />
              Security
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === "general" ? (
              <form onSubmit={handleUpdate} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-8 pb-12 border-b border-border">
                  <div className="flex items-center gap-8">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-muted border-2 border-border shadow-inner flex items-center justify-center">
                        {formData.avatar ? (
                          <img src={formData.avatar} className="w-full h-full object-cover" alt="Avatar" />
                        ) : (
                          <User className="w-10 h-10 text-muted-foreground opacity-20" />
                        )}
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-[2px]">
                        <Camera className="w-6 h-6" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold">Profile Picture</h2>
                      <p className="text-sm text-muted-foreground">Update your photo for everyone to see.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                        placeholder="Display name"
                      />
                    </div>

                    <div className="space-y-2 text-muted-foreground bg-muted/10 border border-border/20 rounded-xl px-4 py-3 pointer-events-none opacity-60">
                      <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        Email Address
                      </label>
                      <div className="font-medium text-sm">{user.email}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <AtSign className="w-3 h-3" />
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                      placeholder="username"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      Biography
                    </label>
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium resize-none"
                      placeholder="Write a short summary about yourself..."
                    />
                  </div>
                </section>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Saving Changes..." : "Save Settings"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <section className="space-y-8 pb-12 border-b border-border">
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">Security Settings</h2>
                    <p className="text-sm text-muted-foreground">Manage your account security and password.</p>
                  </div>

                  <div className="space-y-6 max-w-md">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        Current Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.currentPassword}
                        onChange={e => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <KeyRound className="w-3 h-3" />
                        New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.newPassword}
                        onChange={e => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                        <KeyRound className="w-3 h-3" />
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={passwordData.confirmPassword}
                        onChange={e => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all font-medium"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </section>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? "Updating Password..." : "Update Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
