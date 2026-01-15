import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import type React from "react";

export default function ArticleRenderer({ content }: { content: string }) {
  return (
    <div className="max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
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

          /* Unordered list */
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-4 space-y-1">
              {children}
            </ul>
          ),

          /* Ordered list (top level) */
          ol: ({ children, className }: { children?: React.ReactNode; className?: string }) => {
            const depth = className?.match(/depth-(\d+)/)?.[1] || "0";
            
            const counterStyle = depth === "0"
              ? "list-decimal"
              : depth === "1"
              ? "list-lower-alpha"
              : depth === "2"
              ? "list-lower-roman"
              : "list-decimal";

            return (
              <ol className={`${counterStyle} pl-6 my-4 space-y-1`}>
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

          code: ({ inline, className, children }: {inline?: string, className?: string, children?: React.ReactNode}) => {
            if (inline) {
              return (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
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

          img({ src, alt }) {
            if (!src) return null;
            return (
              <img
                src={src}
                alt={alt ?? ""}
                className="rounded-lg my-6"
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
