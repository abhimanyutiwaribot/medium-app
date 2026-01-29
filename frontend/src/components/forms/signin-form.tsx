import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, type SigninInput } from "@abhimanyutiwaribot/medium-app-validation";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../../api/client";
import { setToken } from "../../utils/auth";

export default function SigninForm(){
  const navigate = useNavigate();

  const form = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  async function onSubmit(data: SigninInput) {
    try {
      const res = await apifetch("/user/signin", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setToken(res.token);
      navigate("/");
    } catch (err: any) {
      alert(err.error || "Signin failed");
    }
  }

    return(
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md space-y-4"
        >
          <input
            placeholder="Email: m@example.com"
            {...form.register("email")}
            className="rounded-2xl border-2 border-black focus:outline-none w-5/6 px-5 py-4 mx-auto block font-comic font-normal text-black placeholder:text-slate-800"
          />

          <input
            type="password"
            placeholder="Password"
            {...form.register("password")}
            className="rounded-2xl border-2 border-black focus:outline-none  w-5/6 px-5 py-4 mx-auto block font-normal font-comic text-black placeholder:text-slate-800"
            
          />

          <button className="w-5/6 py-3 hover:bg-gray-300 hover:text-slate-900 rounded-2xl hover:underline bg-black mx-auto block font-comic font-normal transition duration-800 ease-in-out">
            Sign In &gt;
          </button>
        </form>

    )

}