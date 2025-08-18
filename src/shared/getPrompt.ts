export const outlinePrompt = (topic: string, difficulty: string) => {
  return `        
Return ONLY valid JSON:

{
  "title": "${topic}",
  "difficulty": "${difficulty}",
  "description": "<4-6 sentences course overview>",
  "chapters": [
    { "title": "<Title>", "description": "<6-8 sentence article>" }
  ]
}

Rules:
- JSON only (no markdown).
- 5–8 chapters.
- No placeholders.
`;
};

export const chapterPrompt = (
  courseName: string,
  courseDesc: string,
  chapterName: string,
  chapterDesc: string,
  chapterOrderIndex: number,
) => {
  return `
    Expand ONE chapter for the course named "${courseName}".

    Return ONLY a valid Markdown string as the final output.
    - Maximum heading level is ## (no #).
    - Wrap the entire content starting with ## Chapter ${chapterOrderIndex}: ${chapterName}.
    - Do NOT include <html>, <head>, or <body>.
    - Use semantic Markdown tags like ##, ###, -, 1., \`inline code\`, and fenced code blocks.
    - Do NOT return JSON, HTML tags, or extra explanations.
    - The response must be pure Markdown.

    Content requirements:
    1. What (introduction to the topic)  
    2. Why (importance and relevance)  
    3. Tools/Libraries (if applicable)  
    4. Steps/Concepts (ordered explanation)  
    5. Real Example (code or case study)  

    Special formatting rules:
    - Inline code snippets inside a sentence → \`inline code\`
    - Full multi-line code examples → 
      \`\`\`language
      ...code here...
      \`\`\`

    Context:
    - Course overview: ${courseDesc}  
    - Chapter order index: ${chapterOrderIndex}  
    - Chapter: ${chapterName}  
    - Chapter summary: ${chapterDesc}
`;
};
