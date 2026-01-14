import SignupForm from "../components/forms/signup-form";
import WelcomeText from "../components/welcome/welcome-text";

export default function Signup() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center ">
      <WelcomeText text ={"Join Medium."}/>
      <br />
      <SignupForm/>
      <br />
      <div className="font-serif font-normal">
        <p>Already have an account?
          <a href="/signin" className="underline underline-offset-1">Sign in</a>
        </p> 
      </div>
      
    </div>
  );
}
