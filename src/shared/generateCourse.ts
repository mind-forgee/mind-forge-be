import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config";

const genAI = new GoogleGenerativeAI(`${config.geminiApiKey}`);

export const getResponseAi = async () => {
  const textModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  return textModel;
};

export const getContentOutline = async (topic: string, difficulty: string) => {
  const prompt = `
TUGAS:
Buat ringkasan kursus.

INPUT:
Topik: ${topic}
Tingkat kesulitan: ${difficulty}

KETENTUAN:
- "course_name": judul profesional, 5 sampai 120 karakter.
- "description": 4 sampai 6 kalimat (tujuan, manfaat, audiens, outcome).
- (opsional untuk FE, tidak akan disimpan DB)
  "number_of_chapters": 4 sampai 8
  "est_duration_minutes": 180 sampai 600 (kelipatan 30)
- Gunakan Bahasa Inggris.
- Balas HANYA JSON berikut:

{
  "course_name": "string",
  "description": "string",
  "difficulty": "${difficulty}",
}
`;

  const model = await getResponseAi();
  const responseModel = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  const text = JSON.parse(responseModel.response.text());

  return text;
};

interface getContentChaptersProps {
  course_name: string;
  description: string;
  difficulty: string;
}

export const getContentChapters = async ({
  course_name,
  description,
  difficulty,
}: getContentChaptersProps) => {
  const prompt = `
You are to generate chapters for a course in **valid JSON only**.
Do not include any explanations, comments, or text outside of the JSON.
Ensure the JSON is syntactically correct and complete.

  KONTEKS: 
  - Judul: ${course_name}
- Deskripsi: ${description}
- Tingkat Kesulitan: ${difficulty}
  
KETENTUAN:
- Buat 4–8 bab.
- Struktur per bab:
  - "order_index": 1..N
  - "chapter_name": <= 100 karakter
  - "description": 2–4 kalimat
  - "content_json": {
      "markdown": "konten minimal ~300 kata (boleh ada code fences)",
      "blocks": [] // opsional: code/quiz/tip
    }
- Bahasa Inggris.
- Balas HANYA JSON:
{
  "chapters": [
    {
      "order_index": 1,
      "chapter_name": "string",
      "description": "string",
      "content_json": { "markdown": "string panjang", "blocks": [] }
    }
  ]
}

Rules:
- Always escape quotes inside JSON values
- Never break JSON structure

`;
  const model = await getResponseAi();
  const responseModel = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const text = JSON.parse(responseModel.response.text());
  return text;
};
