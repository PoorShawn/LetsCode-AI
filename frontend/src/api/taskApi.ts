import { axiosRequest } from "../utils/request";

// Task 类型定义
export interface Task {
  taskId: number;
  taskName: string;
  taskContent: string;
  lessonId: number;
  teacherId: number;
  Student_has_Lesson_ID: number;
}

// API 路径前缀
const API_PREFIX = "/task";

// 创建任务
export const createTask = (task: Task) => {
  return axiosRequest<boolean>(`${API_PREFIX}/create`, "POST", task);
};

// 更新任务
export const updateTask = (task: Task, teacherId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/update/${teacherId}`,
    "PUT",
    task
  );
};

// 删除任务
export const deleteTask = (taskId: number, teacherId: number) => {
  return axiosRequest<boolean>(
    `${API_PREFIX}/delete?taskId=${taskId}&teacherId=${teacherId}`,
    "DELETE"
  );
};

// 根据课程获取任务
export const getTasksByLesson = (lessonId: number) => {
  return axiosRequest<Task[]>(`${API_PREFIX}/byLesson/${lessonId}`, "GET");
};

// 根据学生获取任务
export const getTasksByStudent = (studentId: number) => {
  return axiosRequest<Task[]>(`${API_PREFIX}/byStudent/${studentId}`, "GET");
};