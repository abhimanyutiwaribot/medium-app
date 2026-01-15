import { useState } from "react";
import EditorCanvas from "../components/editor/editor-canvas";
import { editorJsToMarkdown } from "../utils/markdown";
import { apifetch } from "../api/client";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);

  async function saveDraft(){
    if(!title || !content) return;

    const markdown = editorJsToMarkdown(content);

    await apifetch("/q/article", {
      method: "POST",
      body: JSON.stringify({
        title,
        content: markdown,
      })
    });

    alert("Draft saved !!");
  }

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
            sm:px-0
            lg:text-3xl
          "
        />
        <div>
          <EditorCanvas onChange={setContent} />
        </div>
        
      </div>

      <button onClick={saveDraft} className="mt-6 bg-black text-white px-4 py-2 rounded">
        Save Draft
      </button>
    </div>
  );
}
