import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apifetch } from "../api/client";

type Draft = {
  id: string;
  title: string;
  current_version: number;
  updatedAt: string;
};

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apifetch("/q/article/drafts").then((data) =>
      setDrafts(data.drafts)
    );
  }, []);

  async function publishDraft(articleId: string){
    // await apifetch(`/q/${articleId}/publish`, {
    //   method: "POST",
    // });
    navigate(`/article/${articleId}/preview`);
    // alert("published!!!")
    setDrafts((prev) => 
      prev.filter((d) => d.id !== articleId)
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Your drafts
      </h1>

      {drafts.length === 0 && (
        <div className="text-gray-500">
          You don’t have any drafts yet.
        </div>
      )}

      <div className="space-y-4">
        {drafts.map((draft) => (
          <div
            key={draft.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>
              <div className="font-medium">
                {draft.title || "Untitled"}
              </div>
              <div className="text-sm text-gray-500">
                Version {draft.current_version} ·{" "}
                {new Date(draft.updatedAt).toLocaleString()}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => publishDraft(draft.id)}
                className="text-blue-600 text-sm"
              >
                Preview and Publish
              </button>

              <button
                onClick={() =>
                  navigate(`/editor/${draft.id}`)
                }
                className="text-blue-600 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  navigate(`/article/${draft.id}/vS`)
                }
                className="text-sm"
              >
                History
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
