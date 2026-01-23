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
           // Headings with better hierarchy and spacing
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-12 mb-6 leading-tight text-gray-900 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-10 mb-5 leading-tight text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold mt-8 mb-4 leading-snug text-gray-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold mt-6 mb-3 leading-snug text-gray-800">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base sm:text-lg lg:text-xl font-semibold mt-6 mb-3 leading-normal text-gray-800">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-base sm:text-lg font-semibold mt-6 mb-3 leading-normal text-gray-300">
              {children}
            </h6>
          ),

          // Paragraphs with optimal reading width and spacing
          p: ({ children }) => (
            <p className="text-base sm:text-lg leading-relaxed mb-6 text-gray-400">
              {children}
            </p>
          ),

          // Text formatting
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),

          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),

          del: ({ children }) => (
            <del className="line-through text-gray-500">{children}</del>
          ),

          mark: ({ children }) => (
            <mark className="bg-yellow-200 px-1 rounded">{children}</mark>
          ),

          // Blockquotes with better styling
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 bg-blue-50 pl-6 pr-4 py-4 my-6 italic text-gray-300 rounded-r">
              {children}
            </blockquote>
          ),

          // Lists with better spacing and readability
          ul: ({ children }) => (
            <ul className="list-disc pl-6 my-6 space-y-3 text-gray-300">
              {children}
            </ul>
          ),

          ol: ({ children, className, style }: any) => {
            const counterTypeMatch = className?.match(/list-counter-(\S+)/);
            const counterType = counterTypeMatch?.[1] || style?.listStyleType || 'decimal';
            
            return (
              <ol 
                className="pl-6 my-6 space-y-3 text-gray-300"
                style={{ listStyleType: counterType }}
              >
                {children}
              </ol>
            );
          },

          li: ({ children }) => (
            <li className="text-base sm:text-lg leading-relaxed">
              {children}
            </li>
          ),

          // Code blocks with better contrast and scrolling
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 sm:p-6 my-8 overflow-x-auto shadow-lg border border-gray-700">
              {children}
            </pre>
          ),

          code: ({ inline, className, children }: {inline?: boolean, className?: string, children?: React.ReactNode}) => {
            if (inline) {
              return (
                <code className="bg-gray-100 px-2 py-0.5 rounded text-sm font-mono text-red-600 border border-gray-200">
                  {children}
                </code>
              );
            }

            return (
              <code className={`font-mono text-sm sm:text-base ${className ?? ""}`}>
                {children}
              </code>
            );
          },

          // Images with captions and better sizing
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <figure className="my-8 mx-auto max-w-2xl">
                <img
                  src={src}
                  alt={alt ?? ""}
                  className="rounded-lg w-full h-auto max-h-96 object-contain shadow-md"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="text-sm text-gray-500 mt-2 text-center italic">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },

          // Links with better visibility
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="my-12 border-t-2 border-gray-200" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}