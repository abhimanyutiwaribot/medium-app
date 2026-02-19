import WelcomeText from "../components/welcome/welcome-text";
import SigninForm from "../components/forms/signin-form";
import { Link } from "react-router-dom";

export default function Signin() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-16">
      <div className="w-full max-w-sm">
        <WelcomeText text="Welcome back." />
        <div className="mt-10">
          <SigninForm />
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
          <p>
            No account?{" "}
            <Link to="/signup" className="text-foreground hover:underline transition-clean">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
