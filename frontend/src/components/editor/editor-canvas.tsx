import CodeTool from "@editorjs/code";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import List from "@editorjs/list";
import { useEffect, useRef } from "react";
import { apifetch } from "../../api/client";

type Props = {
  onChange: (data: any) => void;
  initialData?: any
}

export default function EditorCanvas({ onChange, initialData }: Props) {
  const editorRef = useRef<EditorJS | null>(null);
  const onChangeRef = useRef(onChange);

  // Keep the ref updated with the latest callback without triggering re-initialization
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Tell what's on your mind",
      data: initialData,
      tools: {
        header: Header,
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        code: CodeTool,
        image: {
          class: ImageTool,
          config: {
            features: {
              stretched: true
            },
            uploader: {
              async uploadByFile(file: File) {
                const sig = await apifetch("/image/sign");

                const formData = new FormData();
                formData.append("file", file);
                formData.append("api_key", sig.apiKey);
                formData.append("timestamp", sig.timestamp);
                formData.append("signature", sig.signature);
                formData.append("folder", sig.folder);

                const uploadRes = await fetch(
                  `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
                  {
                    method: "POST",
                    body: formData,
                  }
                );

                const data = await uploadRes.json();

                return {
                  success: 1,
                  file: { url: data.secure_url },
                };
              }
            }
          }
        }
      },
      async onChange() {
        const content = await editor.save();
        onChangeRef.current(content);
      },
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
        const holder = document.getElementById("editorjs");
        if (holder) holder.innerHTML = "";
      }
    };
  }, []) // Empty dependency array: Initialize ONCE

  return <div id="editorjs" className=" max-w-none" />;

}