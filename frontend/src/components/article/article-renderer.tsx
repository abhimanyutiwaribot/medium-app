import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type React from "react";

export default function ArticleRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none 
      prose-headings:text-foreground 
      prose-p:text-foreground/90 
      prose-strong:text-foreground 
      prose-blockquote:text-muted-foreground 
      prose-blockquote:border-l-primary/30
      prose-a:text-foreground 
      prose-a:underline 
      prose-code:text-foreground 
      prose-code:bg-muted 
      prose-pre:bg-muted/50
      prose-pre:border
      prose-pre:border-border">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-8 first:mt-0 tracking-tighter">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl md:text-4xl font-bold mt-12 mb-6 tracking-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl md:text-3xl font-bold mt-10 mb-4 tracking-tight">
              {children}
            </h3>
          ),
          p: ({ children, node }: any) => {
            const hasOnlyImage = node?.children?.length === 1 &&
              node?.children[0]?.tagName === 'img';

            if (hasOnlyImage) return <>{children}</>;

            return (
              <p className="mb-8 leading-relaxed">
                {children}
              </p>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/20 pl-8 my-10 italic text-2xl text-muted-foreground/80">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-8 my-8 space-y-3 text-lg sm:text-xl lg:text-2xl font-[450]">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-8 my-8 space-y-3 text-lg sm:text-xl lg:text-2xl font-[450]">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {children}
            </li>
          ),
          pre: ({ children }) => (
            <pre className="bg-muted/30 border border-border rounded-xl p-6 my-10 overflow-x-auto text-sm md:text-base font-normal">
              {children}
            </pre>
          ),
          code: ({ inline, children }: { inline?: boolean, children?: React.ReactNode }) => {
            if (inline) {
              return (
                <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono border border-border/50">
                  {children}
                </code>
              );
            }
            return (
              <code className="font-mono leading-relaxed">
                {children}
              </code>
            );
          },
          img: ({ src, alt }: any) => {
            if (!src) return null;
            return (
              <figure className="my-12">
                <img
                  src={src}
                  alt={alt ?? ""}
                  className="rounded-xl w-full h-auto shadow-sm border border-border/50"
                  loading="lazy"
                />
                {alt && (
                  <figcaption className="text-sm mt-4 text-center text-muted-foreground italic font-medium">
                    {alt}
                  </figcaption>
                )}
              </figure>
            );
          },
          a: ({ children, href }) => (
            <a
              href={href}
              className="text-foreground underline decoration-primary/30 underline-offset-4 hover:decoration-primary transition-all font-medium"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          hr: () => <hr className="my-16 border-t border-border/60" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}