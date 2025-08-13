import { getResponseAI } from "../../shared/generateCourse";

export const createCourseService = async (topic: string, difficulty: string) => {
  const course = await getResponseAI(topic, difficulty);

  // STORING DATABASE BERDASARKAN USER_ID

  return course;
};
