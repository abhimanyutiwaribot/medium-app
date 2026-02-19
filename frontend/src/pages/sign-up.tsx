import WelcomeText from "../components/welcome/welcome-text";
import SignupForm from "../components/forms/signup-form";
import { Link } from "react-router-dom";

export default function Signup() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 px-6 py-16">
      <div className="w-full max-w-sm">
        <WelcomeText text="Join Xedium." />
        <div className="mt-10">
          <SignupForm />
        </div>
        <div className="mt-8 text-center text-sm text-muted-foreground font-medium">
          <p>
            Already have an account?{" "}
            <Link to="/signin" className="text-foreground hover:underline transition-clean">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
