export const outlinePrompt = (topic: string, difficulty: string) => {
  return `        
Return ONLY valid JSON:

{
  "course_name": "${topic}",
  "difficulty": "${difficulty}",
  "desc": "<4-6 sentences course overview>",
  "chapters": [
    { "chapter_name": "<Title>", "desc": "<6-8 sentence article>" }
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
                "<Topic Name>: <4–6 sentences (what, why, tools/libs, steps/concepts, real example)>",
                "...at least 5–7 items..."
                ]
                }
                
                Course overview: ${courseDesc}
Chapter: ${chapterName}
Chapter summary: ${chapterDesc}

Rules:
- JSON only.
- Each content item is paragraph (no bullets), meaningful, specific.
`;
};
