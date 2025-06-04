import { axiosRequest } from "../utils/request";

// Curriculum 类型定义
export interface Curriculum {
  lessonId: number;
  lessonName: string;
  teacherId: string;
  lessonTerm: string;
  capacity: number;
  enrolledCount: number;
}

// API 路径前缀
const API_PREFIX = "/curriculum";

// 创建课程
export const createCurriculum = (curriculum: Curriculum) => {
  return axiosRequest<boolean>(`${API_PREFIX}/create`, "POST", curriculum);
};

// 更新课程
export const updateCurriculum = (curriculum: Curriculum) => {
  return axiosRequest<boolean>(`${API_PREFIX}/update`, "PUT", curriculum);
};

// 删除课程
export const deleteCurriculum = (lessonId: number) => {
  return axiosRequest<boolean>(`${API_PREFIX}/delete/${lessonId}`, "DELETE");
};

// 学生报名课程
export const enrollStudent = (studentId: number, lessonId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/enroll/${studentId}/${lessonId}`,
    "POST"
  );
};

// 学生退选课程
export const withdrawStudent = (studentId: number, lessonId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/withdraw/${studentId}/${lessonId}`,
    "DELETE"
  );
};

// 获取所有课程
export const listAllCurriculums = () => {
  return axiosRequest<Curriculum[]>(`${API_PREFIX}`, "GET");
};