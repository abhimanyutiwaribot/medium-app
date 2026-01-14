import WelcomeText from "../components/welcome/welcome-text";
import SigninForm from "../components/forms/signin-form";

export default function Signin() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <WelcomeText text={"Welcome back."} />
      <br />
      <SigninForm/>
      <br />
      <div className="font-serif font-normal">
        <p>No account?
          <a href="/signup" className="underline underline-offset-1">Create one</a>
        </p> 
      </div>
    </div>
  );
}
