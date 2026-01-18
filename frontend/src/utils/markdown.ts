function normalizeText(html: string): string {
  if (!html) return "";

  return html
    .replace(/<strong>|<b>/gi, "**")
    .replace(/<\/strong>|<\/b>/gi, "**")
    .replace(/<em>|<i>/gi, "*")
    .replace(/<\/em>|<\/i>/gi, "*")
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
          const alt = normalizeText(block.data.caption || "image");
          pushBlock(`![${alt}](${block.data.file.url})`);
        }
        break;

      case "list":
        if (Array.isArray(block.data?.items)) {
          const style = block.data.style || "unordered";
          // IMPORTANT: Access counterType from meta object
          const counterType = block.data.meta?.counterType || "numeric";
          
          // Map Editor.js counter types to CSS list-style-type
          const counterTypeMap: Record<string, string> = {
            "numeric": "decimal",
            "lower-alpha": "lower-alpha",
            "upper-alpha": "upper-alpha",
            "lower-roman": "lower-roman",
            "upper-roman": "upper-roman"
          };
          
          const cssCounterType = counterTypeMap[counterType] || "decimal";
          
          if (style === "ordered") {
            // Use HTML for ordered lists with custom counter types
            const listItems = block.data.items.map((item: any) => {
              const text = typeof item === "string" ? item : item?.content || "";
              return `  <li>${normalizeText(text)}</li>`;
            }).join("\n");
            
            pushBlock([
              `<ol style="list-style-type: ${cssCounterType};" class="list-counter-${cssCounterType}">`,
              listItems,
              `</ol>`
            ]);
          } else {
            // Unordered lists use standard markdown
            const lines = block.data.items.map((item: any) => {
              const text = typeof item === "string" ? item : item?.content || "";
              return `- ${normalizeText(text)}`;
            });
            pushBlock(lines);
          }
        }
        break;
    }
  }

  return md.join("\n").trim();
}