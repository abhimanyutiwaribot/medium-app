import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type React from "react";

export default function ArticleRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-none prose prose-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-semibold mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold mt-4 mb-2">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xl font-semibold mt-4 mb-2">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-lg font-semibold mt-4 mb-2">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="font-semibold mt-4 mb-2">{children}</h6>
          ),

          p: ({ children }) => (
            <p className="my-4 leading-relaxed">{children}</p>
          ),

          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),

          em: ({ children }) => (
            <em className="italic">{children}</em>
          ),

          del: ({ children }) => (
            <del className="line-through">{children}</del>
          ),

          mark: ({ children }) => (
            <mark className="bg-yellow-200 px-1">{children}</mark>
          ),

          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
              {children}
            </blockquote>
          ),

          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-4 space-y-1">{children}</ul>
          ),

          ol: ({ children, className, style }: any) => {
            // Extract counter type from className or style
            const counterTypeMatch = className?.match(/list-counter-(\S+)/);
            const counterType = counterTypeMatch?.[1] || style?.listStyleType || 'decimal';
            
            return (
              <ol 
                className={`pl-6 my-4 space-y-1`}
                style={{ listStyleType: counterType }}
              >
                {children}
              </ol>
            );
          },

          li: ({ children }) => (
            <li className="leading-relaxed">{children}</li>
          ),

          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 my-6 overflow-x-auto">
              {children}
            </pre>
          ),

          code: ({ inline, className, children }: {inline?: boolean, className?: string, children?: React.ReactNode}) => {
            if (inline) {
              return (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600">
                  {children}
                </code>
              );
            }

            return (
              <code className={`font-mono text-sm ${className ?? ""}`}>
                {children}
              </code>
            );
          },

          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <img
                src={src}
                alt={alt ?? ""}
                className="rounded-lg my-6 max-w-full"
              />
            );
          },

          a: ({ children, href }) => (
            <a href={href} className="text-blue-600 hover:underline">
              {children}
            </a>
          ),

          hr: () => (
            <hr className="my-8 border-gray-300" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}