import { useState, useRef } from "react";
import { apifetch } from "../../api/client";
import { X, Camera, Save } from "lucide-react";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string | null;
    bio: string | null;
    avatar: string | null;
  };
  onUpdate: (newData: any) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  initialData,
  onUpdate,
}: EditProfileModalProps) {
  const [name, setName] = useState(initialData.name || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [avatar, setAvatar] = useState(initialData.avatar || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize + compress image to 200x200 JPEG at 70% quality before storing
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        const SIZE = 200;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d")!;

        // Center-crop to square
        const minSide = Math.min(img.width, img.height);
        const sx = (img.width - minSide) / 2;
        const sy = (img.height - minSide) / 2;
        ctx.drawImage(img, sx, sy, minSide, minSide, 0, 0, SIZE, SIZE);

        URL.revokeObjectURL(objectUrl);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };

      img.onerror = reject;
      img.src = objectUrl;
    });
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      // Show approximate size savings
      const kb = Math.round((compressed.length * 3) / 4 / 1024);
      toast.success(`Photo ready (${kb}KB)`);
      setAvatar(compressed);
    } catch {
      toast.error("Failed to process image.");
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updated = await apifetch("/profile/update", {
        method: "PUT",
        body: JSON.stringify({ name, bio, avatar }),
      });
      onUpdate(updated);
      toast.success("Profile updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[100] flex items-end md:items-center justify-center transition-all duration-300"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal panel — bottom sheet on mobile, centered card on desktop */}
      <div className="bg-background border border-border w-full md:max-w-lg rounded-t-[2rem] md:rounded-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] md:shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden animate-in slide-in-from-bottom-4 md:zoom-in-95 duration-200 max-h-[92dvh] flex flex-col">

        {/* Drag handle (mobile only) */}
        <div className="md:hidden flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 md:px-10 md:py-6 border-b border-border/50 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">Edit Profile</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-clean text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable form body */}
        <form onSubmit={handleSubmit} className="px-6 py-6 md:px-10 md:py-8 space-y-6 overflow-y-auto flex-1">

          {/* Avatar picker */}
          <div className="flex flex-col items-center gap-3">
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImagePick}
            />

            {/* Clickable avatar circle */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="relative group cursor-pointer"
              title="Choose photo"
            >
              <div className="w-24 h-24 rounded-full bg-muted border-2 border-border overflow-hidden shadow-inner">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                    <Camera className="w-10 h-10" />
                  </div>
                )}
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="w-7 h-7 text-white" />
              </div>
            </button>

            <p className="text-xs text-muted-foreground">
              Tap to choose a photo from your device
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground/30 transition-all"
              placeholder="What should we call you?"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">
              About You
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none text-foreground placeholder:text-muted-foreground/30 transition-all font-inter "
              placeholder="Write a short summary of yourself..."
            />
            <div className="text-[10px] font-bold text-right text-muted-foreground uppercase tracking-widest">
              {bio.length}/200
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 pb-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-full border border-border text-sm font-bold hover:bg-muted transition-clean"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? "Saving..." : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
