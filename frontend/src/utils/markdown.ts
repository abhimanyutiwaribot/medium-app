function normalizeText(html: string): string {
  if (!html) return "";

  // Handle inline styles
  return html
    .replace(/<strong>|<b>/g, "**")
    .replace(/<\/strong>|<\/b>/g, "**")
    .replace(/<em>|<i>/g, "*")
    .replace(/<\/em>|<\/i>/g, "*")
    .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<br\s*\/?>/gi, "\n")

    .replace(/&nbsp;/g, " ")

    .replace(/<[^>]+>/g, "")
    .trim();
}

export function editorJsToMarkdown(data: any): string {
  if (!data?.blocks) return "";

  const md: string[] = [];

  const pushBlock = (lines: string[] | string) => {
    if (md.length > 0 && md[md.length - 1] !== "") {
      md.push("");
    }
    if (Array.isArray(lines)) {
      md.push(...lines);
    } else {
      md.push(lines);
    }
    md.push("");
  };

  for (const block of data.blocks) {
    switch (block.type) {
      case "paragraph":
        if (block.data?.text) {
          pushBlock(normalizeText(block.data.text));
        }
        break;

      case "header":
        const level = Math.min(Math.max(block.data?.level || 1, 1), 6);
        if (block.data?.text) {
          pushBlock(`${"#".repeat(level)} ${normalizeText(block.data.text)}`);
        }
        break;

      case "code":
        if (block.data?.code) {
          const lang = block.data.language || "";
          pushBlock([
            "```" + lang,
            block.data.code,
            "```",
          ]);
        }
        break;

      case "image":
        if (block.data?.file?.url) {
          const alt = block.data.caption || "image";
          pushBlock(`![${alt}](${block.data.file.url})`);
        }
        break;

      case "list":
        if (Array.isArray(block.data?.items)) {
          const lines = block.data.items.map((item: any, idx: number) => {
            const text = typeof item === "string" ? item : item?.content || "";
            return block.data.style === "ordered"
              ? `${idx + 1}. ${normalizeText(text)}`
              : `- ${normalizeText(text)}`;
          });
          pushBlock(lines);
        }
        break;

      default:
        // Log unsupported blocks in development
        if (import.meta.env.DEV) {
          console.warn(`Unsupported block type: ${block.type}`);
        }
        break;
    }
  }

  return md.join("\n").trim();
}   