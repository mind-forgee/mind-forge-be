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
) => {
  return `
        Expand ONE chapter for "${courseName}". Return ONLY valid JSON:
        
        {
            "content": [
                "<markdown sentences (what, why, tools/libs, steps/concepts, real example)>",
                "...at least 5–7 items..."
            ]
        }
                
Course overview: ${courseDesc}
Chapter: ${chapterName}
Chapter summary: ${chapterDesc}

Rules:
- JSON only.
- Each content item is in markdown format. it can be paragraph, bullets, code, etc. it should be meaningful, specific.
`;
};
