import { useState } from "react";
import EditorCanvas from "../components/editor/editor-canvas";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);

  return (
    <div className="min-h-screen">
      <div
        className="
          mx-auto px-4 py-6
          max-w-full
          sm:max-w-xl
          lg:max-w-3xl
        "
      >
        <textarea
          name="title-area"
          placeholder="Title"
          onInput= {(e)=> {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = `${target.scrollHeight}px`;
          }}

          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            no-scrollbar
            font-serif
            w-full outline-none font-normal
            resize-none 
            bg-transparent
            text-xl
            sm:text-2xl
            lg:text-3xl
          "
        />

        <EditorCanvas onChange={setContent} />
      </div>
    </div>
  );
}
