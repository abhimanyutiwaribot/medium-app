type Text = {
  text: string;
};

export default function WelcomeText({text}: Text){
  return(
    <div className="text-slate-900 font-comic text-2xl font-thin">
      {text}
    </div>
  )
}