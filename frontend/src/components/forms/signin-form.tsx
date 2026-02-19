import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninInput } from "../../lib/schemas";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../../api/client";
import { toast } from "sonner";
import { useAuth } from "../../context/auth-context";

export default function SigninForm() {
  const navigate = useNavigate();
  const auth = useAuth();

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(data: SigninInput) {
    try {
      await apifetch("/user/signin", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await auth.refresh(); // update global auth state so navbar shows immediately
      toast.success("Welcome back!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.error || "Signin failed. Please check your credentials.");
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Email Address</label>
        <input
          placeholder="name@example.com"
          {...form.register("email")}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-clean placeholder:text-muted-foreground/50"
        />
        {form.formState.errors.email && (
          <p className="text-xs text-destructive mt-1 ml-1">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
          className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-clean placeholder:text-muted-foreground/50"
        />
        {form.formState.errors.password && (
          <p className="text-xs text-destructive mt-1 ml-1">{form.formState.errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="w-full py-3.5 bg-primary text-primary-foreground rounded-full font-bold text-sm tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  )
}