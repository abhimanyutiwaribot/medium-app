import CodeTool from "@editorjs/code";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import ImageTool from "@editorjs/image";
import EditorjsList from "@editorjs/list";
import { useEffect, useRef } from "react";


type Props = {
  onChange: (data: any) => void;
}

export default function EditorCanvas({ onChange }: Props){
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if(editorRef.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Tell what's on your mind....",
      tools:{
        header: Header,
        list: EditorjsList,
        code: CodeTool,
        image: {
          class: ImageTool,
          config:{
            uploader: {
              uploadByFile: async (file: File) => {
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(file),
                  }
                }
              }
            }
          }
        }
      },
      async onChange(){
        const content = await editor.save();
        onChange(content);
      },
    });

    editorRef.current = editor;

    return () => {
      editor.destroy;
      editorRef.current = null;
    };
  }, [onChange])

  return <div id="editorjs" className="max-w-none"/>;

}