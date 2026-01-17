import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apifetch } from "../api/client";

export default function VersionHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    apifetch(`/q/${id}/versions`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(setData);
  }, [id]);

  async function publishArticleBasedVersion(version: number){
    await apifetch(`/q/${id}/publish`, {
      method: "POST",
      body: JSON.stringify({ version })
    })
    navigate(`/`);
    // alert(`Version ${version} published`);
  } 
  if (!data) return <div>Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Version History
      </h1>

      {data.versions.map((v: any) => {
        const isCurrent = v.version === data.current_version;
        const canCompare = v.version < data.current_version;

        return (
          <div
            key={v.version}
            className="border rounded p-3 mb-3 flex justify-between"
          >
            <div>
              <div className="font-medium">
                Version {v.version}
                {v.isPublished && " (Published)"}
                {isCurrent && " (Current Draft)"}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(v.created_At).toLocaleString()}
              </div>
            </div>

            <div className="flex gap-3">
              {canCompare && (
                <button
                  onClick={() =>
                    navigate(
                      `/article/${id}/diff?from=${v.version}&to=${data.current_version}`
                    )
                  }
                  className="text-blue-600 text-sm"
                >
                  Compare
                </button>
              )}

              {!v.isPublished && (
                <button
                  onClick={() => publishArticleBasedVersion(v.version)}>
                  Publish
                </button>
              )}

            </div>
          </div>
        );
      })}
    </div>
  );
}
