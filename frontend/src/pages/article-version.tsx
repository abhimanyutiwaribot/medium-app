import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { apifetch } from "../api/client";
import ArticleRenderer from "../components/article/article-renderer";


export default function ArticleVersion() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const version = params.get("version");

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchArticle() {
      const query = version ? `?version=${version}` : "";
      const res = await apifetch(`/q/${id}${query}`);
      setData(res);
    }

    fetchArticle();
  }, [id, version]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-tranparent">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-sm text-gray-500 mb-2">
          Version {data.currentVersion}
        </div>

        <h1 className="text-4xl font-bold mb-8">
          {data.title}
        </h1>

        <ArticleRenderer content={data.content} />
      </div>
    </div>
  );
}
