import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apifetch } from "../api/client";
import ArticleRenderer from "../components/article/article-renderer";


export default function Article() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  useEffect(() => {
    async function fetchArticle() {
      const res = await apifetch(`/a/article/${id}`);
      setData(res);
    }

    fetchArticle();
  }, [id]);

  if (!data) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-tranparent">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="text-sm text-gray-500 mb-2">
          Version {data.version}
        </div>

        <h1 className="text-4xl font-normal font-serif mb-6">
          {data.title}
        </h1>

        <ArticleRenderer content={data.content} />
      </div>
    </div>
  );
}
