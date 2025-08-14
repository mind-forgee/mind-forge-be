import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config";

const genAI = new GoogleGenerativeAI(`${config.geminiApiKey}`);

export const getResponseAI = async (topic: string, difficulty: string) => {
  const textModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
  console.log(topic, difficulty);

  const prompt = `You are to generate a detailed course curriculum in the following strict JSON structure:

{
  "course_name": "${topic}",
  "difficulty: "${difficulty}"
  "description": "<A detailed overview of the entire course, explaining its purpose, target audience, and skills to be learned. Minimum 4-6 sentences.>",
  "chapters": [
    {
      "chapter_name": "<Title of the chapter>",
      "description": "<A long-form article (minimum 6-8 sentences) explaining what this chapter covers, why it is important, and what skills the learner will gain.>",
      "content": [
        "<Topic Name>: <A detailed explanation of the topic in 4-6 sentences. Must cover: 
          - What the topic is
          - Why it is important
          - Tools, libraries, or technologies needed
          - Key concepts or steps to implement it
          - Example of real-world usage
        >",
        "<Another Topic>: <Detailed explanation with the same structure as above>",
        "...continue until all major subtopics are covered..."
      ]
    }
  ]
}

Requirements & Writing Rules:
1. Each "content item must be **at least 4-6 sentences** long, structured like a mini-article.
2. Include **tools, libraries, or dependencies** needed for each topic, where relevant.
3. Include **real-world examples** or scenarios to illustrate each topic.
4. Maintain a **professional and educational tone**, clear enough for intermediate learners.
5. Avoid vague statements like “this is important” without explaining why.
6. Output must be **valid JSON** with proper quotation marks and commas.
7. No placeholder text — all explanations must be meaningful and complete.
8. Assume the reader has basic technical knowledge but is learning the subject in depth.
9. Avoid bullet points inside the content — everything should be written in prose form.
10. Use this structure consistently for all chapters.

Example for one "content" item:
"Code Splitting & Lazy Loading: This technique involves dividing the application’s JavaScript bundle into smaller chunks, allowing the browser to load only the code needed for the current page or component. This reduces initial load times, improves performance, and enhances user experience. Developers often implement code splitting using tools like Webpack or Vite, which automatically generate separate bundles. Lazy loading further optimizes performance by loading components or assets only when they are required, such as when a user navigates to a new section of the app. For example, in an e-commerce site, product detail pages can be lazy loaded so that they only download when the user clicks on a specific product, rather than during the initial homepage load."

`;

  const result = await textModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  const text = result.response.text();
  return text;
};
