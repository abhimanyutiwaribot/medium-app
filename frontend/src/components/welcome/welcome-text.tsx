type Text = {
  text: string;
};

export default function WelcomeText({ text }: Text) {
  return (
    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-center">
      {text}
    </h1>
  )
}