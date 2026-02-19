import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupInput } from "../../lib/schemas";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../../api/client";
import { toast } from "sonner";
import { useAuth } from "../../context/auth-context";

export default function SignupForm() {
  const navigate = useNavigate();
  const auth = useAuth();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupInput) {
    try {
      await apifetch("/user/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await auth.refresh(); // populate global auth state immediately
      toast.success("Welcome to Xedium!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.error || "Signup failed. Please try again.");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Full Name</label>
        <input
          placeholder="John Doe"
          {...form.register("name")}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-clean placeholder:text-muted-foreground/40"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Username</label>
        <input
          placeholder="johndoe"
          {...form.register("username")}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-clean placeholder:text-muted-foreground/40"
        />
        {form.formState.errors.username && (
          <p className="text-xs text-destructive ml-1">{form.formState.errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Email</label>
        <input
          placeholder="email@example.com"
          {...form.register("email")}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-clean placeholder:text-muted-foreground/40"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive ml-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent transition-clean placeholder:text-muted-foreground/40"
        />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive ml-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full mt-4 py-4 bg-primary text-primary-foreground rounded-full font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create Account"}
      </button>
    </form>
  )
}