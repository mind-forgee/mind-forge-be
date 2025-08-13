import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config";

const genAI = new GoogleGenerativeAI(`${config.geminiApiKey}`);

export const getResponseAI = async (topic: string, difficulty: string) => {
  const textModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `Generate a course tutorial in JSON format following this exact schema:
- course_name (string): The name of the course
- description (string): A short description of the course
- contents (array): A list of chapters, each containing:
    - chapter_name (string): The title of the chapter
    - about (string): A short description of the chapter
    - topics (array of strings): The list of topics in this chapter

Topic: ${topic}
Level: ${difficulty}

Do not include any other keys. Follow the schema exactly.
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
