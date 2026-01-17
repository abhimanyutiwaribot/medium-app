import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { diffWords } from "diff";
import { apifetch } from "../api/client";

export default function ArticleDiffPage() {
  const { id } = useParams();
  const [params] = useSearchParams();

  const from = params.get("from");
  const to = params.get("to");

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!from || !to) return;

    apifetch(`/q/${id}/diff?from=${from}&to=${to}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(setData);
  }, [id, from, to]);

  if (!from || !to) {
    return <div className="p-6">Invalid diff range</div>;
  }

  if (!data) {
    return <div className="p-6">Loading diff…</div>;
  }

  const diff = diffWords(data.fromContent, data.toContent);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">
        Comparing version {from} → {to}
      </h1>

      <div className="whitespace-pre-wrap leading-7">
        {diff.map((part: any, i: number) => {
          if (part.added) {
            return (
              <span
                key={i}
                className="bg-green-200 text-green-900"
              >
                {part.value}
              </span>
            );
          }

          if (part.removed) {
            return (
              <span
                key={i}
                className="bg-red-200 text-red-900 line-through"
              >
                {part.value}
              </span>
            );
          }

          return <span key={i}>{part.value}</span>;
        })}
      </div>
    </div>
  );
}
