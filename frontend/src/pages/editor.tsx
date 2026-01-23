import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EditorCanvas from "../components/editor/editor-canvas";
import { editorJsToMarkdown } from "../utils/markdown";
import { apifetch } from "../api/client";

export default function Editor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [currentVersion, setCurrentVersion] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState(false);

  const handleEditorChange = useCallback((data: any) => {
    if (isEditMode && !hasLoadedInitialData) return;

    setContent(data);
    setIsSaved(true);
  }, [hasLoadedInitialData, isEditMode])

  useEffect(() => {
    if (!isEditMode) return;

    setLoading(true);

    apifetch(`/q/edit/${id}`, { method: "GET" })
      .then((data) => {
        setTitle(data.title);
        setInitialData(data.content_json);
        setCurrentVersion(data.current_version);
        setIsSaved(false);
        setHasLoadedInitialData(true)
      })
      .finally(() => setLoading(false));
  }, [id, isEditMode]);

  async function saveDraft() {
    if (!title || !content){
      alert("Please add a title and some content");
      return;
    } 
      

    const markdown = editorJsToMarkdown(content);

    if (isEditMode) {
      await apifetch(`/q/edit/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          content_markdown: markdown,
          content_json: content,
        }),
      });
      alert("article has been saved as draft you can preview")
      // navigate(``)
    } else {
      await apifetch("/q/article", {
        method: "POST",
        body: JSON.stringify({
          title,
          content_markdown: markdown,
          content_json: content,
        }),
      });
      navigate(`/article/drafts`)
    }
    setIsSaved(false);
    
  }

  async function publishArticle() {
    await apifetch(`/q/${id}/publish`, {
      method: "POST",
    })
    navigate('/');
    alert("Article published!")
  }

  if (isEditMode && loading) {
    return <div className="p-6">Loading draft…</div>;
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
        {isEditMode && currentVersion !== null && (
          <div
            className="mb-2 text-sm text-gray-500 flex gap-2 items-center">
            <span>
              Editing based on version {currentVersion}
            </span>

            {currentVersion > 1 && (
              <a
                href={`/article/${id}/diff?from=${currentVersion - 1}&to=${currentVersion}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                Compare with previous
              </a>
            )}
          </div>
        )}

        {/* Title */}
        <textarea
          name="title-area"
          placeholder="Title"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = `${target.scrollHeight}px`;
          }}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            no-scrollbar
            font-comic
            w-full outline-none font-normal
            resize-none 
            bg-transparent
            text-xl
            sm:text-2xl
            lg:text-3xl
          "
        />

        {/* Editor */}
        <EditorCanvas
          initialData={initialData}
          onChange={handleEditorChange}
        />
      </div>

      {/* Actions */}
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={saveDraft}
          className="mt-6 bg-white text-black px-4 py-2 rounded"
        >
          Save Draft
        </button>
        {isEditMode && (
          <div>
            <button
              onClick={publishArticle}
              className="ml-3 bg-black text-white px-4 py-2 rounded">
              Publish
            </button>
            <button
              disabled={isSaved}
              title={isSaved ?  "Save draft to preview" : ""} 
              onClick={() => navigate(`/article/${id}/preview`)}
              className={`ml-3 bg-slate-800 text-white border px-4 py-2 rounded ${
                isSaved
                  ? "opacity-50 cursor-not-allowed"
                  : "border"              
              }`}
            >
              Preview
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
